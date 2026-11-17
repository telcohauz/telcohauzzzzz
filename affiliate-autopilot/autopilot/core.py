import hashlib
import json
import os
import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
MY = ZoneInfo('Asia/Kuala_Lumpur')
STATES = ['DRAFT', 'VALIDATED', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'ANALYZED']


def now():
    return datetime.now(timezone.utc).isoformat()


def uid():
    return uuid.uuid4().hex


def timestamp(value):
    t = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if t.tzinfo is None or t > datetime.now(timezone.utc) + timedelta(minutes=5):
        raise ValueError('Timestamp requires timezone and cannot be in the future')
    return t.astimezone(timezone.utc).isoformat()


def https(value):
    p = urlsplit(value)
    if p.scheme != 'https' or not p.hostname or p.username or p.password or len(value) > 2048:
        raise ValueError('A public HTTPS source reference is required')
    return value


def integer(value, minimum=0, maximum=10**12):
    if isinstance(value, bool) or not isinstance(value, int) or not minimum <= value <= maximum:
        raise ValueError('Invalid integer amount')
    return value


class Store:
    def __init__(self, path):
        self.path = str(path)
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        with self.db() as db:
            db.executescript((ROOT / 'migrations/001_initial.sql').read_text())
        os.chmod(path, 0o600)

    @contextmanager
    def db(self):
        db = sqlite3.connect(self.path, timeout=15)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA foreign_keys=ON')
        try:
            with db:
                yield db
        finally:
            db.close()

    def audit(self, db, actor, action, entity):
        db.execute('INSERT INTO audit_logs(actor,action,entity_id,created_at) VALUES(?,?,?,?)',
                   (actor, action, entity, now()))

    def notify(self, db, kind, message, key):
        db.execute('INSERT OR IGNORE INTO notifications VALUES(?,?,?,?,NULL,?)',
                   (uid(), kind, message, now(), key))

    def import_product(self, p, actor='operator'):
        https(p['source_ref']); https(p['affiliate_url'])
        at = timestamp(p['source_at'])
        price = integer(p['price_sen'])
        if p['compliance'] not in ('PENDING', 'VERIFIED', 'REJECTED'):
            raise ValueError('Invalid compliance')
        if not isinstance(p['available'], bool):
            raise ValueError('Availability must be boolean')
        for key in ('name', 'category', 'product_identifier'):
            if not isinstance(p[key], str) or not 1 <= len(p[key]) <= 300:
                raise ValueError('Missing or excessive product field')
        rate = p.get('commission_bps')
        if rate is not None:
            integer(rate, 0, 10000)
        identity = hashlib.sha256((p['platform_id'] + ':' + p['product_identifier']).encode()).hexdigest()
        with self.db() as db:
            db.execute('''INSERT INTO affiliate_products(id,platform_id,product_identifier,name,category,price_sen,commission_bps,available,source_ref,source_at,compliance)
            VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,category=excluded.category,price_sen=excluded.price_sen,commission_bps=excluded.commission_bps,available=excluded.available,source_ref=excluded.source_ref,source_at=excluded.source_at,compliance=excluded.compliance''',
                       (identity,p['platform_id'],p['product_identifier'],p['name'],p['category'],price,rate,int(p['available']),p['source_ref'],at,p['compliance']))
            db.execute('INSERT INTO affiliate_links VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET url=excluded.url,source_ref=excluded.source_ref',
                       (identity,identity,p['affiliate_url'],p['source_ref']))
            self.audit(db,actor,'PRODUCT_IMPORTED',identity)
        return identity

    def draft(self, product_id, language='ms'):
        if language not in ('ms','en'):
            raise ValueError('Language must be ms or en')
        with self.db() as db:
            p = db.execute('SELECT * FROM affiliate_products WHERE id=?',(product_id,)).fetchone()
            if not p or p['compliance'] != 'VERIFIED' or not p['available']:
                raise ValueError('Product must be verified and available')
            if datetime.fromisoformat(p['source_at']) < datetime.now(timezone.utc)-timedelta(hours=24):
                raise ValueError('Product source is stale; refresh before drafting')
            price = f"RM{p['price_sen']/100:.2f}"
            if language == 'ms':
                disclosure = 'Pendedahan afiliasi: Saya mungkin menerima komisen jika anda membeli melalui pautan ini.'
                body = f"Kenali {p['name']}. Kategori: {p['category']}. Harga yang direkodkan: {price}. Semak harga, ketersediaan dan terma terkini di platform sebelum membeli. Kandungan ini ialah maklumat produk, bukan pengalaman penggunaan peribadi."
            else:
                disclosure = 'Affiliate disclosure: I may earn a commission if you purchase through this link.'
                body = f"Explore {p['name']}. Category: {p['category']}. Recorded price: {price}. Check current price, availability and terms on the platform before buying. This is product information, not a personal review."
            fp = hashlib.sha256((product_id+language+body).encode()).hexdigest()
            existing = db.execute('SELECT id FROM content_scripts WHERE fingerprint=?',(fp,)).fetchone()
            if existing:
                return existing['id']
            sid = uid()
            db.execute('INSERT INTO content_scripts VALUES(?,?,?,?,?,?,?,?)',(sid,product_id,language,body,disclosure,fp,p['source_ref'],now()))
            db.execute('INSERT INTO content_ideas VALUES(?,?,?,?)',(uid(),product_id,'Informational product overview',now()))
            db.execute('INSERT INTO publishing_queue(id,script_id,state,updated_at) VALUES(?,?,?,?)',(uid(),sid,'DRAFT',now()))
            self.audit(db,'generator','DRAFT_CREATED',sid)
            return sid

    def transition(self, queue_id, target, actor, scheduled_at=None, evidence=None):
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            q = db.execute('SELECT * FROM publishing_queue WHERE id=?',(queue_id,)).fetchone()
            if not q or target not in STATES or STATES.index(target) != STATES.index(q['state'])+1:
                raise ValueError('Invalid state transition')
            script = db.execute('SELECT * FROM content_scripts WHERE id=?',(q['script_id'],)).fetchone()
            p = db.execute('SELECT * FROM affiliate_products WHERE id=?',(script['product_id'],)).fetchone()
            if target in ('VALIDATED','APPROVED','SCHEDULED'):
                if not script['disclosure'] or p['compliance'] != 'VERIFIED' or not p['available'] or datetime.fromisoformat(p['source_at']) < datetime.now(timezone.utc)-timedelta(hours=24):
                    raise ValueError('Disclosure or fresh verified source missing')
            if target == 'APPROVED':
                db.execute('UPDATE publishing_queue SET approved_by=?,approved_at=? WHERE id=?',(actor,now(),queue_id))
                db.execute('INSERT INTO approval_requests VALUES(?,?,?,?,?,?,?)',(uid(),queue_id,'CONTENT','APPROVED','Operator reviewed factual claims and rights',actor,now()))
            if target == 'SCHEDULED':
                if not scheduled_at:
                    raise ValueError('Schedule timestamp required')
                dt = datetime.fromisoformat(scheduled_at.replace('Z','+00:00'))
                if dt.tzinfo is None:
                    raise ValueError('Schedule timezone required')
                scheduled_at = dt.astimezone(timezone.utc).isoformat()
                db.execute('UPDATE publishing_queue SET scheduled_at=?,manual_status=? WHERE id=?',(scheduled_at,'AWAITING_MANUAL_PUBLICATION',queue_id))
                self.notify(db,'PENDING_APPROVAL','Upload approved assets using the official platform interface.',queue_id)
            if target == 'PUBLISHED':
                self.require_account(db,p['platform_id'])
                if not evidence:
                    raise ValueError('Publication evidence required')
                https(evidence['url']); https(evidence['source_ref'])
                db.execute('INSERT INTO published_content VALUES(?,?,?,?,?)',(uid(),queue_id,evidence['url'],evidence['source_ref'],timestamp(evidence['published_at'])))
                db.execute('UPDATE publishing_queue SET manual_status=NULL WHERE id=?',(queue_id,))
            db.execute('UPDATE publishing_queue SET state=?,updated_at=? WHERE id=?',(target,now(),queue_id))
            self.audit(db,actor,target,queue_id)

    @staticmethod
    def require_account(db, platform):
        a = db.execute('SELECT * FROM affiliate_accounts WHERE platform_id=? AND enabled=1',(platform,)).fetchone()
        p = db.execute('SELECT * FROM affiliate_platforms WHERE id=?',(platform,)).fetchone()
        if not a or not p or not p['enabled'] or not all(a[k] for k in ('eligibility_evidence','enrollment_evidence','payment_evidence','owner_approved_at')) or not p['policy_source'] or not p['policy_checked_at']:
            raise ValueError('Verified eligibility, policy, enrollment, payment and owner approval required')
        if datetime.fromisoformat(p['policy_checked_at']) < datetime.now(timezone.utc)-timedelta(days=7):
            raise ValueError('Policy verification expired')

    def import_finance(self, payload, actor='operator'):
        # Owner attests that records are an authorized platform export, never projections.
        if payload.get('attestation') != 'AUTHORIZED_PLATFORM_EXPORT':
            raise ValueError('Authorized export attestation required')
        platform = payload['platform_id']
        records = payload['records']
        if not isinstance(records,list) or len(records)>1000:
            raise ValueError('Maximum 1000 records per import')
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            self.require_account(db,platform)
            for r in records:
                https(r['source_ref']); at=timestamp(r['source_at']); amount=integer(r['amount_sen'])
                rid=hashlib.sha256((platform+':'+r['kind']+':'+r['external_id']).encode()).hexdigest()
                if not isinstance(r['external_id'],str) or not 1<=len(r['external_id'])<=200:
                    raise ValueError('Invalid external record ID')
                if r['kind']=='commission':
                    previous=db.execute('SELECT source_at FROM commission_records WHERE id=?',(rid,)).fetchone()
                    if previous and at<previous['source_at']:
                        raise ValueError('Cannot replace a newer financial record with an older export')
                    if r['status'] not in ('PENDING','APPROVED','REJECTED'):
                        raise ValueError('Invalid commission status')
                    sales=integer(r['sales_sen'])
                    db.execute('INSERT INTO affiliate_conversions VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET qualified=excluded.qualified,sales_sen=excluded.sales_sen,source_ref=excluded.source_ref,source_at=excluded.source_at',
                               (rid,platform,r['external_id'],r['campaign_id'],int(r['status']=='APPROVED'),sales,r['source_ref'],at))
                    db.execute('INSERT INTO commission_records VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,amount_sen=excluded.amount_sen,source_ref=excluded.source_ref,source_at=excluded.source_at',
                               (rid,rid,amount,r['status'],r['source_ref'],at))
                elif r['kind']=='payout':
                    previous=db.execute('SELECT amount_sen FROM payout_records WHERE id=?',(rid,)).fetchone()
                    if previous and amount!=previous['amount_sen']:
                        raise ValueError('Payout conflict requires reconciliation, not overwrite')
                    db.execute('INSERT INTO payout_records VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING',(rid,platform,r['external_id'],amount,r['source_ref'],at))
                elif r['kind'] in ('EXPENSE','PLATFORM_CHARGE'):
                    previous=db.execute('SELECT amount_sen FROM operating_expenses WHERE id=?',(rid,)).fetchone()
                    if previous and amount!=previous['amount_sen']:
                        raise ValueError('Expense conflict requires reconciliation')
                    db.execute('INSERT INTO operating_expenses VALUES(?,?,?,?,?) ON CONFLICT(id) DO NOTHING',(rid,amount,r['kind'],r['source_ref'],at))
                else:
                    raise ValueError('Unsupported financial record')
                self.audit(db,actor,'FINANCIAL_IMPORT',rid)
            self.notify(db,'FINANCE_IMPORTED','Authorized financial records imported; reconcile payouts separately.',uid())

    def financial(self, start=None, end=None):
        if bool(start) != bool(end):
            raise ValueError('Both date bounds required')
        start=timestamp(start) if start else '0001-01-01T00:00:00+00:00'
        end=timestamp(end) if end else '9999-12-31T23:59:59+00:00'
        if start>=end:
            raise ValueError('Invalid report interval')
        params=(start,end)
        with self.db() as db:
            commissions={r['status']:r['total'] for r in db.execute('SELECT status,SUM(amount_sen) total FROM commission_records WHERE source_at>=? AND source_at<? GROUP BY status',params)}
            payouts=db.execute('SELECT COALESCE(SUM(amount_sen),0) FROM payout_records WHERE source_at>=? AND source_at<?',params).fetchone()[0]
            expenses=db.execute('SELECT COALESCE(SUM(amount_sen),0) FROM operating_expenses WHERE source_at>=? AND source_at<?',params).fetchone()[0]
            sources=[dict(r) for r in db.execute('SELECT source_ref,source_at FROM commission_records WHERE source_at>=? AND source_at<? UNION ALL SELECT source_ref,source_at FROM payout_records WHERE source_at>=? AND source_at<? UNION ALL SELECT source_ref,source_at FROM operating_expenses WHERE source_at>=? AND source_at<?',params*3)]
            confirmed_sales=db.execute('SELECT COALESCE(SUM(sales_sen),0) FROM affiliate_conversions WHERE source_at>=? AND source_at<? AND qualified=1',params).fetchone()[0]
            return {'confirmed_sales':confirmed_sales,'currency':'MYR','unit':'sen','approved_commissions':commissions.get('APPROVED',0),'pending_commissions':commissions.get('PENDING',0),'rejected_commissions':commissions.get('REJECTED',0),'actual_payouts':payouts,'verified_costs':expenses,'net_realized_income':payouts-expenses,'sources':sources,'interval':{'start':start,'end':end},'payout_reconciliation':'UNRECONCILED' if payouts else 'NO_PAYOUT_RECORDS','data_status':'IMPORTED_OWNER_ATTESTED' if sources else 'NO_SOURCE_DATA'}

    def control(self, action, actor):
        if action not in ('PAUSE','RESUME','DISABLE'):
            raise ValueError('Unknown action')
        with self.db() as db:
            db.execute("UPDATE settings SET value=? WHERE key='paused'",('0' if action=='RESUME' else '1',))
            if action=='DISABLE':
                db.execute('UPDATE affiliate_platforms SET enabled=0')
                db.execute('UPDATE affiliate_accounts SET enabled=0')
                db.execute("UPDATE automation_jobs SET status='DISABLED' WHERE status!='COMPLETED'")
            self.audit(db,actor,action,'system')

    def snapshot(self):
        with self.db() as db:
            # Only this hard-coded map controls SQL identifiers, never request input.
            queries={
                'affiliate_platforms':'SELECT * FROM affiliate_platforms LIMIT 200',
                'affiliate_products':'SELECT * FROM affiliate_products LIMIT 200',
                'publishing_queue':'SELECT * FROM publishing_queue LIMIT 200',
                'automation_jobs':'SELECT * FROM automation_jobs LIMIT 200',
                'notifications':'SELECT * FROM notifications LIMIT 200',
                'media_assets':'SELECT * FROM media_assets LIMIT 200',
                'published_content':'SELECT * FROM published_content LIMIT 200',
                'integration_status':'SELECT * FROM integration_status LIMIT 200',
                'usage_buckets':'SELECT * FROM usage_buckets LIMIT 200'}
            data={table:[dict(r) for r in db.execute(query)] for table,query in queries.items()}
            data['paused']=db.execute("SELECT value FROM settings WHERE key='paused'").fetchone()[0]=='1'
        data.update(financial=self.financial(),timezone='Asia/Kuala_Lumpur',generated_at=now(),deployment='LOCAL_BUILD',ai_provider='DISABLED; deterministic bilingual templates only')
        return data

    def retain(self, days=90, actor='local-owner'):
        integer(days,30,3650)
        cutoff=(datetime.now(timezone.utc)-timedelta(days=days)).isoformat()
        with self.db() as db:
            notifications=db.execute('DELETE FROM notifications WHERE read_at IS NOT NULL AND created_at<?',(cutoff,)).rowcount
            self.audit(db,actor,'RETENTION_APPLIED','read-notifications')
        return {'read_notifications_deleted':notifications,'financial_records':'PRESERVED','audit_logs':'PRESERVED'}
