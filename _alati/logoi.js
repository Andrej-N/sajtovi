// Downloads each business's logo from its homepage (img with "logo" in src/class/id/alt, else apple-touch-icon / og:image).
// Output: _logo/<niche>/<slug>.<ext> + _logo/<niche>/_izvor.json. Pick by eye afterwards; wrong ones are deleted by hand.
// Usage: node sajtovi/_alati/logoi.js stomatolozi [slug ...]
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const niche = process.argv[2];
const only = process.argv.slice(3);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const OUT = path.join(ROOT, '_logo', niche);

async function get(url) {
  const ac = new AbortController(); const t = setTimeout(() => ac.abort(), 20000);
  try { const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: ac.signal }); return { ok: r.ok, url: r.url, type: r.headers.get('content-type') || '', buf: Buffer.from(await r.arrayBuffer()) }; }
  catch { return { ok: false }; } finally { clearTimeout(t); }
}
const abs = (h, b) => { try { return new URL(h.replace(/&amp;/g, '&'), b).href; } catch { return null; } };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const log = [];
  for (const f of fs.readdirSync(path.join(ROOT, '_podaci', niche + '-izvor'))) {
    const rec = JSON.parse(fs.readFileSync(path.join(ROOT, '_podaci', niche + '-izvor', f), 'utf8'));
    if (only.length && !only.includes(rec.slug)) continue;
    const home = await get(rec.website);
    if (!home.ok) { console.log(rec.slug, 'sajt ne odgovara'); continue; }
    const html = home.buf.toString('utf8');
    const cands = [];
    for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
      const tag = m[0];
      if (!/logo/i.test(tag)) continue;
      const src = (/\ssrc=["']([^"']+)/i.exec(tag) || /data-src=["']([^"']+)/i.exec(tag) || [])[1];
      if (src && !/facebook|instagram|google|visa|master/i.test(src)) cands.push(abs(src, home.url));
    }
    for (const m of html.matchAll(/<link[^>]+rel=["'](?:apple-touch-icon|icon)["'][^>]*>/gi)) { const h = (/href=["']([^"']+)/i.exec(m[0]) || [])[1]; if (h) cands.push(abs(h, home.url)); }
    let saved = null;
    for (const u of [...new Set(cands.filter(Boolean))]) {
      const r = await get(u);
      if (!r.ok || r.buf.length < 400) continue;
      const ext = /svg/.test(r.type) || /\.svg/i.test(u) ? '.svg' : /png/.test(r.type) || /\.png/i.test(u) ? '.png' : /webp/.test(r.type) ? '.webp' : /icon/.test(r.type) || /\.ico/i.test(u) ? '.ico' : '.jpg';
      if (ext === '.ico') continue;
      saved = rec.slug + ext;
      fs.writeFileSync(path.join(OUT, saved), r.buf);
      log.push({ slug: rec.slug, file: saved, src: u });
      break;
    }
    console.log(rec.slug.padEnd(42), saved || 'nema logoa', cands.length);
  }
  fs.writeFileSync(path.join(OUT, '_izvor.json'), JSON.stringify(log, null, 1));
})();
