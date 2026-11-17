import hashlib
import json
import os
# Bounded local encoder; no shell or remote assets.
import subprocess  # nosec B404
import textwrap
from pathlib import Path
from .core import uid, now


def render(store, script_id, output):
    """Original informational title cards, burned-in captions and silent MP4."""
    with store.db() as db:
        s=db.execute('SELECT * FROM content_scripts WHERE id=?',(script_id,)).fetchone()
        q=db.execute('SELECT * FROM publishing_queue WHERE script_id=?',(script_id,)).fetchone()
        if not s or not q or q['state'] not in ('APPROVED','SCHEDULED'):
            raise ValueError('Approve factual content and rights before rendering')
    folder=Path(output).resolve()/script_id
    folder.mkdir(parents=True,exist_ok=True)
    video=folder/'video.mp4'
    if video.exists():
        with store.db() as db:
            existing=db.execute('SELECT * FROM media_assets WHERE script_id=? AND path=?',(script_id,str(video))).fetchone()
        if existing and hashlib.sha256(video.read_bytes()).hexdigest()==existing['sha256']:
            return str(video)
    with store.db() as db:
        count=db.execute('SELECT COUNT(*) FROM media_assets WHERE created_at>=?',(now()[:7]+'-01',)).fetchone()[0]
    cap=int(os.environ.get('AUTOPILOT_MONTHLY_MEDIA_LIMIT','10'))
    if count>=cap or cap<0 or cap>100:
        raise ValueError('Monthly rendering budget reached; verify free resources before increasing')
    from PIL import Image, ImageDraw, ImageFont
    font_path='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    font=ImageFont.truetype(font_path,38)
    small=ImageFont.truetype(font_path,30)
    parts=['TELCOHAUZ\nProduct information',s['body'],s['disclosure']+'\nSemak sebelum membeli / Check before buying']
    for i,part in enumerate(parts):
        im=Image.new('RGB',(720,1280),'#0a1626'); d=ImageDraw.Draw(im)
        d.rounded_rectangle((35,35,685,1245),radius=28,outline='#38dfad',width=3)
        d.text((65,85),'TELCOHAUZ',font=font,fill='#38dfad')
        lines='\n'.join(textwrap.wrap(part,26))
        d.multiline_text((65,260),lines,font=font,fill='white',spacing=14)
        d.multiline_text((65,1040),'Affiliate disclosure / Pendedahan afiliasi\nMay earn commission / Mungkin menerima komisen',font=small,fill='#38dfad',spacing=10)
        im.save(folder/f'card{i}.png')
    # Use a bounded ffmpeg invocation, no shell interpolation or network assets.
    inputs=[]
    for i in range(3):
        inputs+=['-loop','1','-t','6','-i',str(folder/f'card{i}.png')]
    temp=folder/'rendering.mp4'
    subprocess.run(['/usr/bin/ffmpeg','-hide_banner','-loglevel','error','-y',*inputs,'-filter_complex','[0:v][1:v][2:v]concat=n=3:v=1:a=0,format=yuv420p[v]','-map','[v]','-r','24','-c:v','libx264','-preset','ultrafast','-threads','1','-t','18',str(temp)],check=True,timeout=120,capture_output=True)  # nosec B603
    temp.replace(video)
    (folder/'captions.txt').write_text(s['body']+'\n\n'+s['disclosure'],encoding='utf-8')
    (folder/'storyboard.json').write_text(json.dumps({'scenes':parts,'seconds_per_scene':6,'rights':'Original text cards; DejaVu font; no third-party product imagery or audio','voiceover_script':s['body'],'hashtags':['#Telcohauz','#Affiliate'],'subtitle_mode':'Burned-in text cards'},ensure_ascii=False),encoding='utf-8')
    with store.db() as db:
        db.execute('INSERT INTO media_assets VALUES(?,?,?,?,?,?)',(uid(),script_id,str(video),hashlib.sha256(video.read_bytes()).hexdigest(),'Original Telcohauz text cards; DejaVu font license',now()))
        store.audit(db,'renderer','MEDIA_RENDERED',script_id)
    return str(video)
