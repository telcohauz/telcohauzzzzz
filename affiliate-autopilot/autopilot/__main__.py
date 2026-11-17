import argparse
import json
import os
from datetime import datetime
from .core import Store, MY
from .runner import enqueue, work

p=argparse.ArgumentParser(description='Telcohauz Affiliate Autopilot')
p.add_argument('--db',default=os.environ.get('AUTOPILOT_DB','data/autopilot.sqlite3'))
s=p.add_subparsers(dest='command',required=True)
s.add_parser('init'); s.add_parser('status')
a=s.add_parser('serve'); a.add_argument('--host',default='127.0.0.1'); a.add_argument('--port',type=int,default=8080)
a=s.add_parser('run'); a.add_argument('kind',choices=['health','daily','weekly','monthly']); a.add_argument('--slot')
a=s.add_parser('control'); a.add_argument('action',choices=['PAUSE','RESUME','DISABLE'])
a=s.add_parser('import-products'); a.add_argument('file')
a=s.add_parser('import-finance'); a.add_argument('file')
a=s.add_parser('draft'); a.add_argument('product_id'); a.add_argument('--language',choices=['ms','en'],default='ms')
a=s.add_parser('render'); a.add_argument('script_id'); a.add_argument('--output',default='data/assets')
a=s.add_parser('activate-assisted'); a.add_argument('file')
a=s.add_parser('import-metrics'); a.add_argument('file')
s.add_parser('recommend'); s.add_parser('rank')
a=s.add_parser('transition'); a.add_argument('queue_id'); a.add_argument('target'); a.add_argument('--schedule'); a.add_argument('--evidence-file')
a=s.add_parser('report'); a.add_argument('--start'); a.add_argument('--end')
args=p.parse_args(); store=Store(args.db)
if args.command=='serve':
    from .server import serve
    serve(store,args.host,args.port)
elif args.command=='status': print(json.dumps(store.snapshot(),indent=2))
elif args.command=='run':
    current=datetime.now(MY)
    slot=args.slot or {'health':current.strftime('%Y-%m-%d')+f'-{current.hour//6}','daily':current.strftime('%Y-%m-%d'),'weekly':current.strftime('%G-W%V'),'monthly':current.strftime('%Y-%m')}[args.kind]
    print(json.dumps({'job_id':enqueue(store,args.kind,slot),'processed':work(store)}))
elif args.command=='control': store.control(args.action,'local-owner')
elif args.command=='import-products':
    from pathlib import Path
    for product in json.loads(Path(args.file).read_text()): print(store.import_product(product))
elif args.command=='import-finance':
    from pathlib import Path
    store.import_finance(json.loads(Path(args.file).read_text()))
elif args.command=='draft': print(store.draft(args.product_id,args.language))
elif args.command=='render':
    from .media import render
    print(render(store,args.script_id,args.output))
elif args.command=='report': print(json.dumps(store.financial(args.start,args.end),indent=2))

elif args.command=='activate-assisted':
    from pathlib import Path
    from .adapters import activate_assisted_account
    activate_assisted_account(store,json.loads(Path(args.file).read_text()),'local-owner')
elif args.command=='import-metrics':
    from pathlib import Path
    from .intelligence import import_metrics
    import_metrics(store,json.loads(Path(args.file).read_text()))
elif args.command=='recommend':
    from .intelligence import recommendations
    print(json.dumps(recommendations(store),indent=2))
elif args.command=='rank':
    from .intelligence import rank_products
    print(json.dumps(rank_products(store),indent=2))
elif args.command=='transition':
    from pathlib import Path
    evidence=json.loads(Path(args.evidence_file).read_text()) if args.evidence_file else None
    store.transition(args.queue_id,args.target,'local-owner',args.schedule,evidence)
