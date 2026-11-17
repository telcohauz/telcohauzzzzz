// All data in this browser check is synthetic, held in a temporary database.
const { chromium } = require('playwright');
const {spawn,execFileSync}=require('node:child_process');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
(async()=>{
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'autopilot-browser-'));
  const token='SYNTHETIC_BROWSER_TOKEN_'+'x'.repeat(40);
  const port=18987;
  const child=spawn('python',['-m','autopilot','--db',path.join(folder,'synthetic.sqlite3'),'serve','--port',String(port)],{env:{...process.env,AUTOPILOT_OWNER_TOKEN:token},stdio:'ignore'});
  let browser;
  try{
    for(let i=0;i<50;i++){try{await fetch(`http://127.0.0.1:${port}`);break;}catch{await new Promise(r=>setTimeout(r,100));}}
    browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
    const page=await browser.newPage({viewport:{width:390,height:844}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`http://127.0.0.1:${port}`);
    await page.getByLabel('Owner token',{exact:true}).fill(token);
    await page.getByRole('button',{name:'Connect dashboard'}).click();
    await page.getByRole('status').filter({hasText:'Connected.'}).waitFor();
    if(await page.locator('#state').textContent()!=='PAUSED')throw Error('Expected initial pause');
    await page.getByRole('button',{name:'Resume',exact:true}).click();
    await page.waitForFunction(()=>document.getElementById('state').textContent==='ENABLED · ASSISTED');
    await page.getByRole('button',{name:'Pause',exact:true}).click();
    await page.waitForFunction(()=>document.getElementById('state').textContent==='PAUSED');
    if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth))throw Error('Mobile horizontal overflow');
    if(await page.locator('#cards').textContent().then(t=>!t.includes('No source data')))throw Error('Unverified earnings display');
    if(errors.length)throw Error(errors.join('; '));
    fs.mkdirSync('docs/evidence',{recursive:true});
    await page.screenshot({path:'docs/evidence/dashboard-mobile.png',fullPage:true});
    await page.setViewportSize({width:1440,height:1000});
    await page.screenshot({path:'docs/evidence/dashboard-desktop.png',fullPage:true});
    console.log('PASS: real Chromium, owner login, pause/resume, honest empty metrics, mobile overflow, no browser JS errors.');
  }finally{if(browser)await browser.close();child.kill();fs.rmSync(folder,{recursive:true,force:true});}
})().catch(e=>{console.error(e.message);process.exit(1);});
