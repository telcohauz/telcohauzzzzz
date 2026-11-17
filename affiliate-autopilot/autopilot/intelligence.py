from datetime import datetime, timedelta, timezone
from .core import integer, https, timestamp, uid


def rank_products(store):
    with store.db() as db:
        rows=db.execute("SELECT * FROM affiliate_products WHERE compliance='VERIFIED' AND available=1 AND source_at>=? ORDER BY COALESCE(commission_bps,0) DESC,source_at DESC",((datetime.now(timezone.utc)-timedelta(hours=24)).isoformat(),)).fetchall()
    return [{'id':r['id'],'name':r['name'],'commission_bps':r['commission_bps'],'source_at':r['source_at'],'ranking_basis':'Fresh verified availability, then disclosed commission rate; quality/relevance not independently measured'} for r in rows]


def import_metrics(store, payload):
    if payload.get('attestation')!='AUTHORIZED_PLATFORM_EXPORT':
        raise ValueError('Authorized platform export required')
    rows=payload['records']
    if not isinstance(rows,list) or len(rows)>1000:
        raise ValueError('Maximum 1000 records')
    with store.db() as db:
        for r in rows:
            if r['kind'] not in ('clicks','views'):
                raise ValueError('Only measured clicks/views supported')
            integer(r['value']); https(r['source_ref']); at=timestamp(r['source_at'])
            db.execute('INSERT INTO campaign_metrics VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(campaign_id,kind,source_ref,source_at) DO UPDATE SET value=excluded.value',
                       (uid(),r['campaign_id'],r.get('content_id'),r.get('product_id'),r.get('link_id'),r['kind'],r['value'],r['source_ref'],at))
        store.audit(db,'operator','METRICS_IMPORTED','batch')


def recommendations(store):
    with store.db() as db:
        rows=db.execute('SELECT campaign_id,kind,SUM(value) total FROM campaign_metrics GROUP BY campaign_id,kind').fetchall()
    if not rows:
        return {'status':'INSUFFICIENT_DATA','recommendations':[]}
    return {'status':'DESCRIPTIVE_ONLY','recommendations':[{'campaign_id':r['campaign_id'],'kind':r['kind'],'measured_total':r['total'],'suggestion':'Review source reporting windows before comparison. Test one hook variation using legitimate approved content; no causal or conversion claim is established.'} for r in rows]}
