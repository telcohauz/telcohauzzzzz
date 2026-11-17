"""Bounded, idempotent scheduled maintenance. Never publishes or purchases."""
import json
import os
from datetime import datetime, timedelta, timezone
from .core import now, uid

KINDS={'health','daily','weekly','monthly'}


def enqueue(store, kind, slot):
    if kind not in KINDS:
        raise ValueError('Unsupported job')
    key=f'{kind}:{slot}'
    with store.db() as db:
        db.execute('INSERT OR IGNORE INTO automation_jobs(id,kind,scheduled_at,status,approval_required) VALUES(?,?,?,?,0)',(key,kind,now(),'PENDING'))
    return key


def work(store, handler=None, limit=10):
    if not 1<=limit<=20:
        raise ValueError('Batch limit 1..20')
    budget=int(os.environ.get('AUTOPILOT_MONTHLY_JOB_LIMIT','100'))
    if budget<0 or budget>1000:
        raise ValueError('Budget must be 0..1000')
    count=0
    for _ in range(limit):
        instant=now(); month=instant[:7]
        with store.db() as db:
            db.execute('BEGIN IMMEDIATE')
            if db.execute("SELECT value FROM settings WHERE key='paused'").fetchone()[0]=='1':
                break
            # Expired leases consume retries; crashed processes cannot loop indefinitely.
            for old in db.execute("SELECT * FROM automation_jobs WHERE status='RUNNING' AND lease_until<?",(instant,)).fetchall():
                retry=old['retry_count']+1
                db.execute('UPDATE automation_jobs SET retry_count=?,status=?,error_code=?,lease_until=NULL WHERE id=?',
                           (retry,'DISABLED' if retry>=old['max_retries'] else 'FAILED','LEASE_EXPIRED',old['id']))
                db.execute("UPDATE automation_executions SET status='FAILED',finished_at=?,error_code='LEASE_EXPIRED' WHERE job_id=? AND status='RUNNING'",(instant,old['id']))
            db.execute('INSERT OR IGNORE INTO usage_buckets(period) VALUES(?)',(month,))
            usage=db.execute('SELECT executions FROM usage_buckets WHERE period=?',(month,)).fetchone()[0]
            if usage>=budget:
                db.execute("UPDATE automation_jobs SET status='PAUSED' WHERE status IN ('PENDING','FAILED')")
                store.notify(db,'QUOTA','Configured monthly job budget reached. Check actual host quotas before resuming.',month)
                break
            job=db.execute("SELECT * FROM automation_jobs WHERE status IN ('PENDING','FAILED') AND retry_count<max_retries AND scheduled_at<=? AND (next_attempt_at IS NULL OR next_attempt_at<=?) ORDER BY scheduled_at LIMIT 1",(instant,instant)).fetchone()
            if not job:
                break
            if job['approval_required']:
                db.execute("UPDATE automation_jobs SET status='AWAITING_APPROVAL' WHERE id=?",(job['id'],))
                continue
            eid=uid()
            lease=(datetime.now(timezone.utc)+timedelta(minutes=10)).isoformat()
            db.execute("UPDATE automation_jobs SET status='RUNNING',lease_until=? WHERE id=?",(lease,job['id']))
            db.execute('INSERT INTO automation_executions VALUES(?,?,?,NULL,?,NULL)',(eid,job['id'],instant,'RUNNING'))
            db.execute('UPDATE usage_buckets SET executions=executions+1 WHERE period=?',(month,))
        try:
            evidence=(handler or maintain)(store,dict(job))
            with store.db() as db:
                db.execute("UPDATE automation_jobs SET status='COMPLETED',last_success_at=?,completion_evidence=?,error_code=NULL,lease_until=NULL WHERE id=?",(now(),json.dumps(evidence),job['id']))
                db.execute("UPDATE automation_executions SET status='COMPLETED',finished_at=? WHERE id=?",(now(),eid))
        except Exception:
            # Do not persist exception text: external libraries may include credentials.
            retry=job['retry_count']+1
            next_at=(datetime.now(timezone.utc)+timedelta(seconds=min(3600,60*2**retry))).isoformat()
            with store.db() as db:
                db.execute('UPDATE automation_jobs SET status=?,retry_count=?,next_attempt_at=?,error_code=?,lease_until=NULL WHERE id=?',('DISABLED' if retry>=job['max_retries'] else 'FAILED',retry,next_at,'HANDLER_FAILED',job['id']))
                db.execute("UPDATE automation_executions SET status='FAILED',finished_at=?,error_code='HANDLER_FAILED' WHERE id=?",(now(),eid))
                store.notify(db,'WORKFLOW_FAILED','Job failed; see error code and bounded retry status.',job['id']+':'+str(retry))
        count+=1
    return count


def maintain(store, job):
    with store.db() as db:
        queued=db.execute("SELECT COUNT(*) FROM publishing_queue WHERE state='SCHEDULED'").fetchone()[0]
        store.notify(db,'OPERATIONS',f'{queued} scheduled items require official manual publishing; no automatic publisher connected.',job['id'])
        if job['kind']=='weekly':
            store.notify(db,'POLICY_REVIEW','Review official program requirements and security scan results before account activation.',job['id']+':policy')
    report=store.financial() if job['kind'] in ('daily','monthly') else None
    return {'kind':job['kind'],'checked_at':now(),'queue_count':queued,'financial':report,'external_calls':0,'automatic_publications':0}
