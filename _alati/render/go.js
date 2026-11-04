// node go.js : renderuje scene.html kroz Playwright (softverski WebGL) u PNG.
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const root = __dirname;
const mime = { '.html': 'text/html', '.js': 'text/javascript' };
const srv = http.createServer((q, s) => {
  const p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p)) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'content-type': mime[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(s);
});
(async () => {
  await new Promise(r => srv.listen(4791, '127.0.0.1', r));
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const shots = process.argv.slice(2);
  for (const s of shots) {
    const [name, w, h, pal] = s.split(':');
    const pg = await b.newPage({ viewport: { width: +w, height: +h } });
    pg.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text()); });
    pg.on('pageerror', e => console.log('PAGEERR', e.message));
    await pg.goto(`http://127.0.0.1:4791/scene.html?shot=${name}&w=${w}&h=${h}&pal=${pal||""}`);
    await pg.waitForFunction('window.DONE===true', { timeout: 300000 });
    await pg.locator('#c').screenshot({ path: path.join(root, (pal?pal+'-':'') + name + '.png') });
    await pg.close();
    console.log('ok', name);
  }
  await b.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
