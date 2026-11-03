// Collects real-estate listing cards (photo + text + link) from each agency's own site, for the demo designs.
// Opens the homepage and the offer pages it links to (stanovi, kuće, prodaja, izdavanje…) in Playwright,
// finds blocks that hold one photo plus a price or an area, and saves them.
// Output: _podaci/nekretnine-oglasi/<slug>.json and _slike/nekretnine/<slug>/o-NN.jpg (max 1600 px).
// Usage: node sajtovi/_alati/oglasi.js slug=url [slug=url ...]   (extra start pages: slug=url1,url2)
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '_podaci', 'nekretnine-oglasi');
const IMG = path.join(ROOT, '_slike', 'nekretnine');
const MAX_PAGES = +(process.env.MAX_PAGES || 8);
const MAX_IMG = +(process.env.MAX_IMG || 24);
const HINT = /stan|kuc|kuć|plac|parcel|lokal|poslovn|nekretnin|prodaj|izdav|ponud|oglas|property|real-estate|zemlji|vikend|projek|novogradnj|garsonjer/i;
const SKIP = /kontakt|contact|o-nama|onama|about|blog|vesti|news|login|registr|facebook|instagram|mailto:|tel:|\.pdf|\.jpg|\.png|uslov|politik|privacy|cenovnik|dokument/i;

function cardsInPage() {
  const big = (im) => (im.naturalWidth || im.width) >= 200 && im.getBoundingClientRect().width >= 120;
  const src = (im) => im.currentSrc || im.src || im.getAttribute('data-src') || im.getAttribute('data-lazy-src') || '';
  const bgOf = (el) => { const m = /url\(["']?([^"')]+)/.exec(getComputedStyle(el).backgroundImage || ''); return m ? m[1] : ''; };
  const out = [];
  const seen = new Set();
  const imgs = [...document.querySelectorAll('img')].filter(big).map((im) => ({ el: im, url: src(im) }));
  for (const el of document.querySelectorAll('div,a,figure,span')) {
    const r = el.getBoundingClientRect();
    if (r.width >= 160 && r.height >= 100 && !el.querySelector('img')) { const u = bgOf(el); if (u && !/gradient/.test(u)) imgs.push({ el, url: u }); }
  }
  for (const { el, url } of imgs) {
    if (!url || /logo|icon|banner|flag|sprite|placeholder|no-image|noimage/i.test(url)) continue;
    let node = el, card = null;
    for (let i = 0; i < 7 && node.parentElement; i++) {
      node = node.parentElement;
      const n = [...node.querySelectorAll('img')].filter(big).length;
      if (n > 3) break;
      const t = node.innerText || '';
      if (/€|eur|din|m2|m²|kvadrat/i.test(t) && t.length > 15) { card = node; break; }
    }
    if (!card) continue;
    const a = card.tagName === 'A' ? card : card.querySelector('a[href]') || el.closest('a[href]');
    const href = a ? a.href : '';
    const key = href || url;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ href, img: new URL(url, location.href).href, text: (card.innerText || '').replace(/\s*\n\s*/g, ' | ').slice(0, 400) });
  }
  return out;
}

async function save(url, file) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/130' }, signal: AbortSignal.timeout(25000) });
    if (!r.ok) return false;
    const buf = Buffer.from(await r.arrayBuffer());
    const meta = await sharp(buf).metadata();
    if ((meta.width || 0) < 300) return false;
    await sharp(buf).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(file);
    return true;
  } catch { return false; }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, locale: 'sr-RS' });
  for (const arg of process.argv.slice(2)) {
    const [slug, list] = arg.split('=');
    const starts = list.split(',');
    const page = await ctx.newPage();
    const queue = [...starts];
    const done = new Set();
    const cards = [];
    const keys = new Set();
    while (queue.length && done.size < MAX_PAGES) {
      const u = queue.shift();
      if (done.has(u)) continue;
      done.add(u);
      try {
        await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2500);
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
        await page.waitForTimeout(800);
      } catch (e) { console.log(`  ${slug}: ${u} ne otvara (${e.message.split('\n')[0]})`); continue; }
      for (const c of await page.evaluate(cardsInPage)) {
        const k = c.href || c.img;
        if (keys.has(k)) continue;
        keys.add(k);
        cards.push({ ...c, page: u });
      }
      if (done.size === 1 || starts.includes(u)) {
        const host = new URL(page.url()).host.replace(/^www\./, '');
        const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => ({ h: a.href.split('#')[0], t: (a.innerText || '').trim() })));
        for (const l of links) {
          if (!l.h.includes(host) || SKIP.test(l.h) || done.has(l.h) || queue.includes(l.h)) continue;
          if (HINT.test(l.h) || HINT.test(l.t)) queue.push(l.h);
        }
      }
    }
    // Second pass: open each listing's own page for full-size photos (list thumbnails are often ~230 px).
    const host0 = new URL(starts[0]).host.replace(/^www\./, '');
    const real = cards.filter((c) => c.href && c.href.includes(host0) && !starts.includes(c.href) && !done.has(c.href) && /€|eur|m2|m²/i.test(c.text) && c.text.length < 350);
    for (const c of real.slice(0, MAX_IMG)) {
      try {
        await page.goto(c.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(1500);
        const d = await page.evaluate(() => {
          const og = document.querySelector('meta[property="og:image"]')?.content;
          const ims = [...document.querySelectorAll('img, a[href$=".jpg"], a[href$=".jpeg"], a[href$=".JPG"]')].map((e) => e.tagName === 'A' ? { u: e.href, w: 900 } : { u: e.currentSrc || e.src || e.getAttribute('data-src') || '', w: e.naturalWidth || 0 });
          const big = ims.filter((x) => x.u && x.w >= 500 && !/logo|icon|banner|sprite|placeholder/i.test(x.u)).map((x) => x.u);
          const main = document.querySelector('main, article, .content, #content, .property, .item-page') || document.body;
          return { imgs: [...new Set([og, ...big].filter(Boolean))].slice(0, 6), text: (main.innerText || '').replace(/\s*\n\s*/g, ' | ').slice(0, 1500), title: document.title };
        });
        c.detail = d;
      } catch { /* keep the card without detail */ }
    }
    await page.close();
    const dir = path.join(IMG, slug);
    fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(dir)) if (/^o-\d+[a-z]?\.jpg$/.test(f)) fs.rmSync(path.join(dir, f));
    let n = 0;
    const ordered = [...real, ...cards.filter((c) => !real.includes(c))];
    for (const c of ordered) {
      if (n >= MAX_IMG) break;
      const name = 'o-' + String(n + 1).padStart(2, '0');
      const urls = [...(c.detail?.imgs || []), c.img];
      let ok = false;
      for (const u of urls) if (await save(u, path.join(dir, name + '.jpg'))) { ok = true; break; }
      if (!ok) continue;
      c.file = name;
      c.extra = [];
      if (n < 8) for (const [i, u] of urls.slice(1, 4).entries()) {
        const x = name + 'bcd'[i];
        if (await save(u, path.join(dir, x + '.jpg'))) c.extra.push(x);
      }
      n++;
    }
    fs.writeFileSync(path.join(OUT, slug + '.json'), JSON.stringify({ slug, pages: [...done], cards }, null, 1));
    console.log(`${slug.padEnd(42)} strana ${done.size}  kartica ${cards.length}  slika ${n}`);
  }
  await browser.close();
})();
