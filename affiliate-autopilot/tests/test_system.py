"""ALL fixtures are SYNTHETIC; never commercial performance evidence."""
import json
import os
import sqlite3
import subprocess
import tempfile
import time
import unittest
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch
from autopilot.core import Store, now
from autopilot.runner import enqueue, work
from autopilot.adapters import ADAPTERS, activate_assisted_account
from autopilot.intelligence import import_metrics, recommendations, rank_products


class SystemTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.store=Store(Path(self.temp.name)/'test.sqlite3')
        self.product={'platform_id':'shopee-my','product_identifier':'SYNTHETIC-ONLY','name':'Synthetic test item','category':'Synthetic fixtures','price_sen':1234,'commission_bps':500,'available':True,'source_ref':'https://example.invalid/synthetic-export','source_at':now(),'compliance':'VERIFIED','affiliate_url':'https://example.invalid/synthetic-link'}

    def tearDown(self): self.temp.cleanup()

    def activate(self):
        activate_assisted_account(self.store,{'platform_id':'shopee-my','country':'MY','owner_approval':'ACTIVATE_ASSISTED_OPERATIONS','official_minimum_age':18,'holder_meets_minimum_age':True,'policy_source':'https://example.invalid/synthetic-policy','policy_checked_at':now(),'eligibility_evidence':'https://example.invalid/synthetic-eligibility','enrollment_evidence':'https://example.invalid/synthetic-enrollment','payment_evidence':'https://example.invalid/synthetic-payment'},'synthetic-owner')

    def draft(self):
        pid=self.store.import_product(self.product)
        sid=self.store.draft(pid)
        with self.store.db() as db: qid=db.execute('SELECT id FROM publishing_queue').fetchone()[0]
        return pid,sid,qid

    def test_database_migration_repeat_and_foreign_keys(self):
        Store(self.store.path)
        with self.store.db() as db:
            self.assertEqual(db.execute('SELECT COUNT(*) FROM affiliate_platforms').fetchone()[0],2)
            with self.assertRaises(sqlite3.IntegrityError):
                db.execute("INSERT INTO affiliate_links VALUES('x','missing','https://example.invalid','ref')")

    def test_product_validation_and_idempotency(self):
        first=self.store.import_product(self.product)
        self.assertEqual(first,self.store.import_product(self.product))
        for bad in ({'price_sen':-1},{'affiliate_url':'javascript:alert(1)'},{'commission_bps':10001},{'available':'yes'},{'source_at':'2026-01-01'}):
            with self.assertRaises(ValueError): self.store.import_product(self.product|bad)

    def test_duplicate_bilingual_drafts(self):
        pid,sid,_=self.draft()
        self.assertEqual(sid,self.store.draft(pid))
        self.assertNotEqual(sid,self.store.draft(pid,'en'))
        self.assertTrue(rank_products(self.store))
        with self.store.db() as db:
            self.assertEqual(db.execute('SELECT COUNT(*) FROM content_scripts').fetchone()[0],2)

    def test_stale_source_blocks(self):
        pid=self.store.import_product(self.product|{'source_at':(datetime.now(timezone.utc)-timedelta(days=2)).isoformat()})
        with self.assertRaises(ValueError): self.store.draft(pid)

    def test_state_machine_approval_and_publication_evidence(self):
        _,_,qid=self.draft()
        with self.assertRaises(ValueError): self.store.transition(qid,'PUBLISHED','test')
        for state in ('VALIDATED','APPROVED'):
            self.store.transition(qid,state,'synthetic-owner')
        self.store.transition(qid,'SCHEDULED','test',now())
        evidence={'url':'https://example.invalid/synthetic-video','source_ref':'https://example.invalid/synthetic-publish','published_at':now()}
        with self.assertRaises(ValueError): self.store.transition(qid,'PUBLISHED','test',evidence=evidence)
        self.activate()
        self.store.transition(qid,'PUBLISHED','test',evidence=evidence)
        self.store.transition(qid,'ANALYZED','test')
        with self.store.db() as db:
            self.assertEqual(db.execute('SELECT COUNT(*) FROM published_content').fetchone()[0],1)
            self.assertEqual(db.execute('SELECT COUNT(*) FROM approval_requests').fetchone()[0],1)

    def test_adapters_no_automatic_publishing(self):
        for adapter in ADAPTERS.values():
            self.assertFalse(adapter.automatic_publishing)
            with self.assertRaises(NotImplementedError): adapter.publish()

    def test_account_requires_owner_and_age_evidence(self):
        with self.assertRaises(ValueError): activate_assisted_account(self.store,{'platform_id':'shopee-my','country':'MY'},'test')
        with self.store.db() as db:
            with self.assertRaises(ValueError): self.store.require_account(db,'shopee-my')

    def test_scheduler_idempotent_and_concurrent_claims(self):
        self.store.control('RESUME','test')
        for _ in range(3): enqueue(self.store,'health','synthetic-slot')
        with ThreadPoolExecutor(max_workers=2) as pool:
            list(pool.map(lambda _:work(self.store),range(2)))
        with self.store.db() as db:
            self.assertEqual(db.execute('SELECT COUNT(*) FROM automation_executions').fetchone()[0],1)
            self.assertEqual(db.execute('SELECT status FROM automation_jobs').fetchone()[0],'COMPLETED')

    def test_scheduler_paused_and_quota(self):
        enqueue(self.store,'health','synthetic-slot')
        self.assertEqual(work(self.store),0)
        self.store.control('RESUME','test')
        with patch.dict(os.environ,{'AUTOPILOT_MONTHLY_JOB_LIMIT':'0'}): self.assertEqual(work(self.store),0)
        with self.store.db() as db: self.assertEqual(db.execute('SELECT status FROM automation_jobs').fetchone()[0],'PAUSED')

    def test_bounded_retry_and_secret_redaction(self):
        self.store.control('RESUME','test'); key=enqueue(self.store,'health','synthetic-slot')
        def fail(*args): raise RuntimeError('SYNTHETIC_SECRET_MUST_NOT_BE_LOGGED')
        for _ in range(5):
            work(self.store,fail)
            with self.store.db() as db:
                db.execute('UPDATE automation_jobs SET next_attempt_at=NULL WHERE id=?',(key,))
        with self.store.db() as db:
            row=dict(db.execute('SELECT * FROM automation_jobs').fetchone())
            self.assertEqual(row['status'],'DISABLED'); self.assertEqual(row['retry_count'],3)
            self.assertNotIn('SYNTHETIC_SECRET',json.dumps(row))

    def test_lease_recovery(self):
        self.store.control('RESUME','test'); key=enqueue(self.store,'health','synthetic-slot')
        with self.store.db() as db:
            db.execute("UPDATE automation_jobs SET status='RUNNING',lease_until='2000-01-01T00:00:00+00:00' WHERE id=?",(key,))
        work(self.store)
        with self.store.db() as db:
            row=db.execute('SELECT * FROM automation_jobs').fetchone()
            self.assertEqual(row['status'],'COMPLETED'); self.assertEqual(row['retry_count'],1)

    def finance_payload(self):
        base={'source_ref':'https://example.invalid/synthetic-finance','source_at':now()}
        return {'platform_id':'shopee-my','attestation':'AUTHORIZED_PLATFORM_EXPORT','records':[
            base|{'kind':'commission','external_id':'synthetic-a','campaign_id':'synthetic-campaign','status':'APPROVED','sales_sen':10000,'amount_sen':1000},
            base|{'kind':'commission','external_id':'synthetic-b','campaign_id':'synthetic-campaign','status':'PENDING','sales_sen':20000,'amount_sen':2000},
            base|{'kind':'commission','external_id':'synthetic-c','campaign_id':'synthetic-campaign','status':'REJECTED','sales_sen':30000,'amount_sen':3000},
            base|{'kind':'payout','external_id':'synthetic-payout','amount_sen':700},
            base|{'kind':'EXPENSE','external_id':'synthetic-cost','amount_sen':100}]}

    def test_financial_calculations_and_duplicate_import(self):
        self.activate(); payload=self.finance_payload()
        self.store.import_finance(payload); self.store.import_finance(payload)
        f=self.store.financial()
        self.assertEqual(f['approved_commissions'],1000); self.assertEqual(f['pending_commissions'],2000)
        self.assertEqual(f['actual_payouts'],700); self.assertEqual(f['net_realized_income'],600)
        self.assertEqual(f['payout_reconciliation'],'UNRECONCILED'); self.assertTrue(f['sources'])

    def test_financial_atomic_rollback_and_permissions(self):
        with self.assertRaises(ValueError): self.store.import_finance(self.finance_payload())
        self.activate(); payload=self.finance_payload(); payload['records'][-1]['amount_sen']=-1
        with self.assertRaises(ValueError): self.store.import_finance(payload)
        self.assertEqual(self.store.financial()['data_status'],'NO_SOURCE_DATA')

    def test_financial_conflict_and_old_source_rejected(self):
        self.activate(); payload=self.finance_payload(); self.store.import_finance(payload)
        payload['records'][3]['amount_sen']=900
        with self.assertRaises(ValueError): self.store.import_finance(payload)
        self.assertEqual(self.store.financial()['actual_payouts'],700)
        older=self.finance_payload(); older['records']=older['records'][:1]
        older['records'][0]['source_at']='2000-01-01T00:00:00+00:00'
        with self.assertRaises(ValueError): self.store.import_finance(older)

    def test_retention_preserves_financial_evidence(self):
        self.activate(); self.store.import_finance(self.finance_payload())
        self.assertEqual(self.store.retain(30)['financial_records'],'PRESERVED')
        self.assertEqual(self.store.financial()['actual_payouts'],700)
        with self.assertRaises(ValueError): self.store.retain(0)

    def test_render_quota(self):
        from autopilot.media import render
        _,sid,qid=self.draft()
        self.store.transition(qid,'VALIDATED','test'); self.store.transition(qid,'APPROVED','test')
        with patch.dict(os.environ,{'AUTOPILOT_MONTHLY_MEDIA_LIMIT':'0'}):
            with self.assertRaises(ValueError): render(self.store,sid,self.temp.name)

    def test_metrics_do_not_create_money(self):
        import_metrics(self.store,{'attestation':'AUTHORIZED_PLATFORM_EXPORT','records':[{'campaign_id':'synthetic-campaign','kind':'views','value':100,'source_ref':'https://example.invalid/synthetic-metrics','source_at':now()}]})
        self.assertEqual(self.store.financial()['actual_payouts'],0)
        self.assertEqual(recommendations(self.store)['status'],'DESCRIPTIVE_ONLY')

    def test_empty_dashboard_is_truthful(self):
        data=self.store.snapshot()
        self.assertTrue(data['paused']); self.assertFalse(any(p['enabled'] for p in data['affiliate_platforms']))
        self.assertEqual(data['financial']['data_status'],'NO_SOURCE_DATA')

    def test_http_auth_dashboard_and_controls(self):
        import socket
        with socket.socket() as s:
            s.bind(('127.0.0.1',0)); port=s.getsockname()[1]
        token='SYNTHETIC_TEST_TOKEN_'+'x'*40
        proc=subprocess.Popen(['python','-m','autopilot','--db',self.store.path,'serve','--port',str(port)],env=os.environ|{'AUTOPILOT_OWNER_TOKEN':token},stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
        root=f'http://127.0.0.1:{port}'
        try:
            for _ in range(40):
                try:
                    with urllib.request.urlopen(root,timeout=1) as r:
                        self.assertIn(b'Affiliate Autopilot',r.read()); self.assertIn("default-src 'self'",r.headers['Content-Security-Policy'])
                    break
                except OSError: time.sleep(.05)
            else: self.fail('Server failed to start')
            with self.assertRaises(urllib.error.HTTPError) as err: urllib.request.urlopen(root+'/api/status')
            self.assertEqual(err.exception.code,401)
            req=urllib.request.Request(root+'/api/status',headers={'Authorization':'Bearer '+token})
            with urllib.request.urlopen(req) as r: self.assertTrue(json.load(r)['paused'])
            req=urllib.request.Request(root+'/api/control',data=b'{"action":"RESUME"}',headers={'Authorization':'Bearer '+token,'Content-Type':'application/json'})
            with urllib.request.urlopen(req) as r: self.assertTrue(json.load(r)['ok'])
            self.assertFalse(self.store.snapshot()['paused'])
        finally:
            proc.terminate(); proc.communicate(timeout=5)

    @unittest.skipUnless(os.environ.get('AUTOPILOT_TEST_MEDIA')=='1','Set AUTOPILOT_TEST_MEDIA=1 for real FFmpeg integration test')
    def test_render_real_video(self):
        from autopilot.media import render
        _,sid,qid=self.draft()
        with self.assertRaises(ValueError): render(self.store,sid,self.temp.name)
        self.store.transition(qid,'VALIDATED','test'); self.store.transition(qid,'APPROVED','test')
        output=render(self.store,sid,self.temp.name)
        result=subprocess.run(['ffprobe','-v','quiet','-show_streams','-of','json',output],capture_output=True,text=True,check=True)
        stream=json.loads(result.stdout)['streams'][0]
        self.assertEqual((stream['width'],stream['height']),(720,1280))
        self.assertEqual(output,render(self.store,sid,self.temp.name))
        with self.store.db() as db: self.assertEqual(db.execute('SELECT COUNT(*) FROM media_assets').fetchone()[0],1)
