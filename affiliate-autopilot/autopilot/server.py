"""Private single-owner control plane. Deploy only behind a TLS reverse proxy."""
import hmac
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from .core import ROOT


def serve(store, host='127.0.0.1', port=8080):
    token=os.environ.get('AUTOPILOT_OWNER_TOKEN','')
    if len(token)<32:
        raise ValueError('Set AUTOPILOT_OWNER_TOKEN to a random value of at least 32 characters')

    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*args):
            pass  # Access URLs and authorization headers are not logged.

        def respond(self,status,data,kind='application/json'):
            body=json.dumps(data).encode() if kind=='application/json' else data
            self.send_response(status)
            for k,v in {'Content-Type':kind,'Content-Length':str(len(body)),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none'"}.items():
                self.send_header(k,v)
            self.end_headers(); self.wfile.write(body)

        def auth(self):
            supplied=self.headers.get('Authorization','')
            return hmac.compare_digest(supplied,'Bearer '+token)

        def do_GET(self):
            static={'/':'index.html','/app.js':'app.js','/style.css':'style.css'}
            if self.path in static:
                file=ROOT/'web'/static[self.path]
                kind={'html':'text/html; charset=utf-8','js':'text/javascript; charset=utf-8','css':'text/css; charset=utf-8'}[file.suffix[1:]]
                return self.respond(200,file.read_bytes(),kind)
            if not self.auth():
                return self.respond(401,{'error':'UNAUTHORIZED'})
            if self.path=='/api/status':
                return self.respond(200,store.snapshot())
            return self.respond(404,{'error':'NOT_FOUND'})

        def do_POST(self):
            if not self.auth():
                return self.respond(401,{'error':'UNAUTHORIZED'})
            if self.headers.get('Sec-Fetch-Site')=='cross-site':
                return self.respond(403,{'error':'CROSS_SITE_DENIED'})
            try:
                length=int(self.headers.get('Content-Length','0'))
                if not 0<length<=262144:
                    return self.respond(413,{'error':'BODY_LIMIT'})
                if self.headers.get('Content-Type','').split(';')[0]!='application/json':
                    return self.respond(415,{'error':'JSON_REQUIRED'})
                data=json.loads(self.rfile.read(length))
                if self.path=='/api/control':
                    store.control(data['action'],'owner')
                elif self.path=='/api/product':
                    return self.respond(201,{'id':store.import_product(data,'owner')})
                elif self.path=='/api/draft':
                    return self.respond(201,{'id':store.draft(data['product_id'],data['language'])})
                elif self.path=='/api/transition':
                    store.transition(data['queue_id'],data['target'],'owner',data.get('scheduled_at'),data.get('evidence'))
                elif self.path=='/api/finance':
                    store.import_finance(data,'owner')
                elif self.path=='/api/retry':
                    with store.db() as db:
                        cursor=db.execute("UPDATE automation_jobs SET status='PENDING',next_attempt_at=NULL WHERE id=? AND status='FAILED' AND retry_count<max_retries",(data['job_id'],))
                        if cursor.rowcount!=1:
                            raise ValueError('Job not retryable')
                        store.audit(db,'owner','RETRY',data['job_id'])
                else:
                    return self.respond(404,{'error':'NOT_FOUND'})
                return self.respond(200,{'ok':True})
            except (ValueError,KeyError,TypeError):
                return self.respond(400,{'error':'INVALID_INPUT_OR_STATE','help':'Check schema, eligibility, source dates, approval and current state.'})
            except Exception:
                return self.respond(500,{'error':'OPERATION_FAILED'})
    ThreadingHTTPServer((host,port),Handler).serve_forever()
