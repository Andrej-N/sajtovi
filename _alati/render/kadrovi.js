// Kadrovi sklapanja iz sceme stolarije (softverski WebGL), za Design platno i poster.
// node kadrovi.js <izlaz> <w> <h> <p,p,p...> [ime-prefiks]
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const [out, w, h, list, pre = 'k'] = process.argv.slice(2);
const three = path.join(path.dirname(require.resolve('three')), '..');
// SCENA_JS bira drugu scenu (npr. _sabloni/kuhinja/scena.js); podrazumevana je stolarija.
const scena = process.env.SCENA_JS ? path.resolve(process.env.SCENA_JS) : path.join(__dirname, '..', '..', '_sabloni', 'stolarija', 'scena.js');
const CFG = process.env.SCENA || JSON.stringify({ bg: {} });
const page = `<!doctype html><meta charset=utf-8><style>html,body{margin:0;background:#000}canvas{display:block;width:100vw;height:100vh}#sklapanje{height:100px}</style>
<script>window.SCENA=${CFG}</script>
<script type=importmap>{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>
<canvas id=scena></canvas><div id=sklapanje></div><script type=module src=/scena.js></script>`;
const srv = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/') { s.writeHead(200, { 'content-type': 'text/html' }); return s.end(page); }
  const f = u === '/scena.js' ? scena : path.join(three, u.replace(/^\/three\//, ''));
  if (!fs.existsSync(f)) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'content-type': 'text/javascript' });
  fs.createReadStream(f).pipe(s);
});
(async () => {
  fs.mkdirSync(out, { recursive: true });
  await new Promise((r) => srv.listen(4795, '127.0.0.1', r));
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const pg = await b.newPage({ viewport: { width: +w, height: +h } });
  pg.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) console.log('ERR', m.text()); });
  pg.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await pg.goto('http://127.0.0.1:4795/');
  await pg.waitForFunction('window.__kadar !== undefined', { timeout: 120000 });
  const ps = list.split(',');
  for (let i = 0; i < ps.length; i++) {
    await pg.evaluate((p) => window.__kadar(p), +ps[i]);
    await pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const name = `${pre}-${String(i).padStart(2, '0')}.jpg`;
    await pg.screenshot({ path: path.join(out, name), type: 'jpeg', quality: 80, timeout: 180000 });
    console.log('ok', name, ps[i]);
  }
  await b.close(); srv.close();
})().catch((e) => { console.error(e); process.exit(1); });
