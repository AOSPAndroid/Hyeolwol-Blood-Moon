// Headless smoke test: start a run, mash random inputs, fail on any page error.
// Usage: npm i playwright && CHROME=/path/to/chrome node tools/smoke.js [seconds]
// STORY=1 plays story chapter 1 instead of the endless arena.
const {chromium} = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), secs = +process.argv[2] || 40;
const types = {'.html':'text/html','.js':'text/javascript','.png':'image/png','.webmanifest':'application/manifest+json'};
const server = http.createServer((q, r) => {
  const f = path.join(root, q.url === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(root) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, {'content-type': types[path.extname(f)] || 'application/octet-stream'}); fs.createReadStream(f).pipe(r);
});
(async () => {
  await new Promise(ok => server.listen(0, ok));
  const browser = await chromium.launch({executablePath: process.env.CHROME || undefined,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox']});
  const page = await browser.newPage({viewport: {width: 390, height: 800}});
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:' + server.address().port + '/');
  if (process.env.STORY) { await page.click('#storyB'); await page.click('#chlist .chap'); } else await page.click('#start');
  await page.click('#ecards .card');
  await page.evaluate(() => { const h = window.__hw; h.G.cap = 12;
    for (const t of ['guard', 'archer', 'wisp', 'brute', 'yangban', 'mudang', 'gwishin', 'bat']) h.G.queue.push(t);
    setInterval(() => { const P = h.P, r = Math.random(); if (P.hp < 50) P.hp = P.maxHp;
      h.inp.jx = Math.sin(Date.now() / 700); h.inp.jy = Math.cos(Date.now() / 900);
      if (r < .25) h.inp.pA = true; else if (r < .32) h.inp.pD = true; else if (r < .4) h.inp.pP = true; else if (r < .44) h.inp.pR = true; else if (r < .5) h.inp.pQ = true;
      if (h.G.state === 'talk') h.advTalk();
      if (h.G.state === 'reward') { const c = [...document.querySelectorAll('#cards .card')].find(x => x.style.display !== 'none'); if (c) c.click(); }
    }, 45); });
  await page.waitForTimeout(secs * 1000);
  const s = await page.evaluate(() => ({room: window.__hw.G.room, kills: window.__hw.G.kills, state: window.__hw.G.state}));
  await browser.close(); server.close();
  console.log(s, errors.length ? 'ERRORS:' : 'no page errors', errors.slice(0, 5));
  process.exit(errors.length ? 1 : 0);
})();
