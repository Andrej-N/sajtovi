// node sajtovi/_alati/uzivo.js <niche> : stvarno ponasanje u browseru pre pisanja mailova: da li http adresa prelazi na https, viewport, sirina na telefonu, futer, probni tekstovi.
const { chromium } = require('playwright');
const niche = process.argv[2];
const L = require('../../email-leadovi-po-delatnosti.json').find((x) => x.niche === niche);
const S = Object.fromEntries(L.businesses.filter((x) => x.website).map((x) => [x.name.slice(0, 28), x.website.replace(/^https?:\/\//, '').split('/')[0]]));
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');
const toks = (t) => new Set(t.toLowerCase().split(/[^a-zčćšžđ0-9]+/i).filter((w) => w.length > 3));
const jac = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / Math.max(1, Math.min(a.size, b.size)); };
const old = async (host, y) => { try { const c = new AbortController(); setTimeout(() => c.abort(), 25000); const r = await fetch(`https://web.archive.org/web/${y}id_/http://${host}/`, { signal: c.signal }); return { y: (r.url.match(/\/web\/(\d{4})/) || [])[1], t: await r.text() }; } catch { return { y: '-', t: '' }; } };
(async () => {
  const b = await chromium.launch();
  for (const [ime, host] of Object.entries(S)) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, userAgent: 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36' });
    const pg = await ctx.newPage();
    let line = ime.padEnd(30), txt = '';
    try {
      await pg.goto('http://' + host + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await pg.waitForTimeout(1500);
      const r = await pg.evaluate(() => ({ url: location.href, sw: document.documentElement.scrollWidth, vp: !!document.querySelector('meta[name=viewport]'), body: document.body.innerText }));
      txt = r.body;
      line += ` krajnji: ${r.url.slice(0, 44).padEnd(44)} ${r.url.startsWith('http:') ? 'OSTAJE-HTTP' : 'https'} vp:${r.vp} sirina:${r.sw}`;
    } catch (e) { line += ' GRESKA ' + e.message.slice(0, 60); }
    const y = /test\d|lorem|We will contact|Loading\.\.\.|u pripremi|under construction/i.exec(txt);
    const cp = [...txt.matchAll(/(?:©|copyright)[^\n]{0,40}/gi)].map((m) => m[0].trim()).slice(0, 2).join(' / ');
    console.log(line, '\n   ', cp || '(nema copyright)', y ? '| TEKST: ' + y[0] : '');
    await ctx.close();
    if (process.env.WAYBACK) {
      for (const yy of ['2018', '2020']) { const o = await old(host, yy); console.log('    wayback', yy, '->', o.y, 'slicnost', o.t && txt ? jac(toks(strip(o.t)), toks(txt)).toFixed(2) : '-'); }
    }
  }
  await b.close();
})();
