// Collects text, signals and photos from each business's existing site (or its Wayback copy when the site is dead).
// Output: _podaci/<niche>-izvor/<slug>.json and _slike/<niche>/<slug>/NN.jpg (resized to max 1600 px).
// Usage: node sajtovi/_alati/skupi.js smestaj [slug ...]
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const niche = process.argv[2] || 'smestaj';
const only = process.argv.slice(3);
const SRC = path.join(ROOT, '..', 'email-leadovi-po-delatnosti.json');
const OUT = path.join(ROOT, '_podaci', niche + '-izvor');
const IMG = path.join(ROOT, '_slike', niche);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const PAGE_HINT = /apartman|smestaj|smeštaj|sob[ae]|room|cen|price|kontakt|contact|o-nama|onama|about|galerij|gallery|foto|lokacij|location|usluge|ponud|vila|studio|spa|wellness|restoran|ponuda/i;
const IMG_SKIP = /logo|icon|ikon|flag|zastav|sprite|facebook|instagram|twitter|youtube|booking|tripadvisor|airbnb|visa|master|paypal|banner-ad|pixel|blank|spacer|loader|arrow|strelic|btn|button|captcha|thumb_|-150x150|-100x100|wp-emoji/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, ms = 20000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'sr,en;q=0.8' }, redirect: 'follow', signal: ac.signal });
    const buf = Buffer.from(await r.arrayBuffer());
    return { ok: r.ok, status: r.status, url: r.url, type: r.headers.get('content-type') || '', buf };
  } catch (e) {
    return { ok: false, status: 0, error: String(e.cause?.code || e.message) };
  } finally { clearTimeout(t); }
}

function decode(res) {
  const head = res.buf.subarray(0, 4000).toString('latin1');
  const cs = (/charset=["']?([\w-]+)/i.exec(res.type) || /<meta[^>]+charset=["']?([\w-]+)/i.exec(head) || [])[1] || 'utf-8';
  try { return new TextDecoder(cs.toLowerCase().replace('utf8', 'utf-8')).decode(res.buf); } catch { return res.buf.toString('utf8'); }
}

const ent = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

function textOf(html) {
  return ent(html.replace(/<(script|style|noscript|svg|iframe)[\s\S]*?<\/\1>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(br|\/p|\/div|\/li|\/h\d|\/tr|\/td|\/section|\/article)[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' '))
    .split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter((l) => l.length > 1).join('\n').replace(/\n{2,}/g, '\n');
}

function abs(href, base) { try { return new URL(ent(href.trim()), base).href.split('#')[0]; } catch { return null; } }

function links(html, base) {
  const out = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const u = abs(m[1], base);
    if (u && /^https?:/.test(u)) out.push({ u, t: textOf(m[2]).slice(0, 60) });
  }
  return out;
}

function images(html, base) {
  const set = new Set();
  const add = (s) => { const u = abs(s, base); if (u && /\.(jpe?g|png|webp)(\?|$)/i.test(u) && !IMG_SKIP.test(u)) set.add(u); };
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    for (const a of ['data-lazy-src', 'data-src', 'data-original', 'src']) { const v = new RegExp(a + '=["\']([^"\']+)', 'i').exec(tag); if (v) { add(v[1]); break; } }
    const ss = /srcset=["']([^"']+)/i.exec(tag);
    if (ss) { const last = ss[1].split(',').map((x) => x.trim().split(/\s+/)[0]).pop(); if (last) add(last); }
  }
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+\.(?:jpe?g|png|webp))["']/gi)) add(m[1]);
  for (const m of html.matchAll(/url\(\s*['"]?([^'")]+\.(?:jpe?g|png|webp))/gi)) add(m[1]);
  return [...set];
}

function signals(html) {
  const years = [...html.matchAll(/(?:©|&copy;|copyright)[^0-9<]{0,30}((?:19|20)\d\d)(?:\s*[-–]\s*((?:19|20)\d\d))?/gi)].map((m) => +(m[2] || m[1]));
  return {
    copyright: years.length ? Math.max(...years) : null,
    viewport: /<meta[^>]+name=["']viewport/i.test(html),
    generator: (/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)/i.exec(html) || [])[1] || null,
    flash: /\.swf|shockwave/i.test(html),
    jquery: (/jquery[.-]?(\d\.\d+(?:\.\d+)?)/i.exec(html) || [])[1] || null,
  };
}

async function wayback(url) {
  const r = await get('https://archive.org/wayback/available?url=' + encodeURIComponent(url));
  if (!r.ok) return null;
  try { const s = JSON.parse(r.buf.toString()).archived_snapshots?.closest; return s?.available ? s.url.replace(/^http:/, 'https:') : null; } catch { return null; }
}

async function saveImages(urls, dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const kept = [];
  for (const u of urls.slice(0, 70)) {
    if (kept.length >= 16) break;
    const r = await get(u, 20000);
    if (!r.ok || r.buf.length < 25000) continue;
    try {
      const img = sharp(r.buf);
      const m = await img.metadata();
      if (!m.width || m.width < (+process.env.MINW || 700) || m.height < (+process.env.MINW || 700) * 0.55 || m.width / m.height > 3.2 || m.height / m.width > 2) continue;
      const name = String(kept.length + 1).padStart(2, '0') + '.jpg';
      await img.rotate().resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 76, mozjpeg: true }).toFile(path.join(dir, name));
      kept.push({ file: name, src: u, w: m.width, h: m.height });
    } catch {}
  }
  return kept;
}

(async () => {
  const data = JSON.parse(fs.readFileSync(SRC, 'utf8')).find((x) => x.niche === niche);
  const slugs = await require('./slugovi')(niche); // name -> slug, as in Excel
  fs.mkdirSync(OUT, { recursive: true });
  for (const b of data.businesses) {
    const slug = slugs.get(b.name);
    if (!slug || (only.length && !only.includes(slug))) continue;
    const rec = { slug, name: b.name, website: b.website, site_state: b.site_state, pages: [], images: [], signals: null, source: null };
    if (b.website) {
      let base = b.website;
      let home = await get(base);
      if (!home.ok && /^https:/.test(base)) { base = base.replace(/^https:/, 'http:'); home = await get(base); }
      if (!home.ok || home.buf.length < 1500 || b.site_state === 'DEAD') {
        const wb = await wayback(b.website);
        if (wb) { home = await get(wb, 30000); base = wb; rec.source = 'wayback'; }
      }
      if (home.ok) {
        base = home.url || base;
        rec.source = rec.source || 'site';
        const html = decode(home);
        rec.signals = signals(html);
        const host = new URL(base).host;
        rec.pages.push({ url: base, title: (/<title>([^<]*)/i.exec(html) || [])[1]?.trim(), text: textOf(html).slice(0, 7000) });
        let imgs = images(html, base);
        const next = [...new Map(links(html, base).filter((l) => new URL(l.u).host === host && l.u !== base && !/\.(jpe?g|png|pdf|webp|gif)$/i.test(l.u) && (PAGE_HINT.test(l.u) || PAGE_HINT.test(l.t))).map((l) => [l.u, l])).values()].slice(0, 9);
        for (const l of next) {
          const r = await get(l.u);
          if (!r.ok || !/html/i.test(r.type)) continue;
          const h = decode(r);
          rec.pages.push({ url: l.u, title: l.t, text: textOf(h).slice(0, 5000) });
          imgs.push(...images(h, l.u));
          const s = signals(h);
          if (s.copyright && (!rec.signals.copyright || s.copyright > rec.signals.copyright)) rec.signals.copyright = s.copyright;
        }
        rec.images = await saveImages([...new Set(imgs)], path.join(IMG, slug));
      } else rec.error = home.error || home.status;
    }
    fs.writeFileSync(path.join(OUT, slug + '.json'), JSON.stringify(rec, null, 1));
    console.log(`${slug.padEnd(42)} ${String(rec.source || rec.error || 'nema sajt').padEnd(8)} str:${rec.pages.length} slike:${rec.images.length} ©${rec.signals?.copyright || '-'} vp:${rec.signals?.viewport ? 'da' : 'ne'}`);
    await sleep(300);
  }
})();
