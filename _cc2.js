const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.setCookie({ name: 'cookie_consent', value: 'accepted', url: 'http://localhost:4326' });
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto('http://localhost:4326/', { waitUntil: 'networkidle2' });
  await p.evaluate(async()=>{ await new Promise(r=>{let y=0;const s=()=>{window.scrollTo(0,y);y+=500;if(y<document.body.scrollHeight)setTimeout(s,30);else{window.scrollTo(0,0);setTimeout(r,300)}};s();}); });
  await sleep(400);
  const box = await p.evaluate(() => {
    const sec = document.getElementById('climb');
    const cards = [...sec.querySelectorAll('div')].filter(d => d.textContent && d.textContent.includes('PUBLIC PROFILE') && d.textContent.includes('SHARE'));
    const card = cards.sort((a,b)=>a.getBoundingClientRect().width-b.getBoundingClientRect().width)[0];
    const r = card.getBoundingClientRect();
    return { x: Math.round(r.left+window.scrollX), y: Math.round(r.top+window.scrollY), w: Math.round(r.width), h: Math.round(r.height) };
  });
  console.log('card abs box:', JSON.stringify(box));
  await p.screenshot({ path: '/tmp/cc2.png', clip: { x: Math.max(0,box.x-8), y: box.y-8, width: box.w+16, height: box.h+16 } });
  await b.close(); console.log('done');
})().catch(e=>{console.error(e);process.exit(1);});
