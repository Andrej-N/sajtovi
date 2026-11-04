// NICHE=<delatnost> node sajtovi/_alati/snimi.js <izlaz> <w> <h> slug/fajl[@skrol] ... : pregled strana. Skrol je udeo sklapanja kod 3D dizajna (0-1); ostale strane se snimaju cele.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const root = path.resolve('sajtovi', process.env.NICHE || 'klima-bela-tehnika');
const [out, w, h, ...items] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png' };
const srv = http.createServer((q, s) => {
  const p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'content-type': mime[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(s);
});
(async () => {
  await new Promise(r => srv.listen(4793, '127.0.0.1', r));
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  for (const it of items) {
    const [p, sk] = it.split('@');
    const pg = await b.newPage({ viewport: { width: +w, height: +h } });
    pg.on('console', m => { if (m.type() === 'error' && !/favicon|404/.test(m.text())) console.log(p, 'ERR', m.text()); });
    pg.on('pageerror', e => console.log(p, 'PAGEERR', e.message));
    await pg.goto('http://127.0.0.1:4793/' + p, { waitUntil: 'networkidle', timeout: 120000 });
    await pg.evaluate(() => document.fonts.ready);
    const over = await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (over > 0) console.log(p, 'PRELIV', over);
    const three = await pg.evaluate(() => !!document.getElementById('scena'));
    const name = (it.replace(/[\/@.]/g, '_')) + `-${w}`;
    if (three) {
      await pg.waitForFunction('window.__beil !== undefined', { timeout: 60000 }).catch(() => console.log(p, 'nema scene'));
      const len = await pg.evaluate(() => document.getElementById('sklapanje').getBoundingClientRect().height - innerHeight);
      await pg.evaluate(v => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, v); }, (+(sk || 0)) * len);
      await pg.waitForFunction('window.__beil && Math.abs(window.__beil.cur - window.__beil.target) < 0.002', { timeout: 180000 }).catch(() => console.log(p, 'nije stiglo'));
      await pg.waitForTimeout(400);
      await pg.screenshot({ path: path.join(out, name + '.jpg'), type: 'jpeg', quality: 70, timeout: 120000 });
    } else {
      await pg.addStyleTag({ content: '.dz{display:none!important}' });
      await pg.waitForTimeout(600);
      await pg.screenshot({ path: path.join(out, name + '.jpg'), type: 'jpeg', quality: 62, fullPage: true, timeout: 120000 });
    }
    await pg.close();
  }
  await b.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
