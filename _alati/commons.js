// Free location photos from Wikimedia Commons (CC0 / public domain / CC BY / CC BY-SA) for places where a business has too few own photos.
// Saves _slike/stock-<niche>/<mesto>/NN.jpg plus _izvor.json with author and licence (shown in the site footer).
// Usage: node sajtovi/_alati/commons.js smestaj
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const niche = process.argv[2] || 'smestaj';
const UA = 'lead-prospecting-demo/1.0 (andrej.nedeljkovic5@gmail.com)';
const MESTA = {
  smestaj: {
    zlatibor: ['Zlatibor', 'Zlatibor Lake', 'Ribnica Lake (Zlatibor)'],
    kopaonik: ['Kopaonik', 'Kopaonik National Park', 'Kopaonik Ski Resort'],
    tara: ['Tara (mountain)', 'Tara National Park (Serbia)', 'Zaovine Lake', 'Perućac Lake'],
    vrnjacka: ['Vrnjačka Banja', 'Vrnjacka Banja', 'Vrnjačka Banja Spa'],
    sokobanja: ['Sokobanja', 'Nature of Sokobanja', 'Panoramas of Sokobanja', 'Streets in Sokobanja'],
    beograd: ['Slavija (Belgrade)', 'Vračar', 'Saint Sava Temple'],
  },
}[niche];
const OK_LIC = /^(cc0|public domain|pd|cc by(-sa)? [1-4]\.0)/i;

async function api(params) {
  const u = 'https://commons.wikimedia.org/w/api.php?format=json&' + new URLSearchParams(params);
  for (let i = 0; i < 4; i++) {
    const r = await fetch(u, { headers: { 'User-Agent': UA } });
    if (r.ok) { const j = await r.json(); if (!j.error) return j; }
    await new Promise((res) => setTimeout(res, 3000 * (i + 1)));
  }
  return {};
}

async function files(cat) {
  const j = await api({ action: 'query', list: 'categorymembers', cmtitle: 'Category:' + cat, cmtype: 'file', cmlimit: 500 });
  return (j.query?.categorymembers || []).map((m) => m.title).filter((t) => /\.jpe?g$/i.test(t));
}

async function infos(titles) {
  const out = [];
  for (let i = 0; i < titles.length; i += 40) {
    const j = await api({ action: 'query', titles: titles.slice(i, i + 40).join('|'), prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: 1600 });
    for (const p of Object.values(j.query?.pages || {})) {
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      const md = ii.extmetadata || {};
      const lic = md.LicenseShortName?.value || '';
      const artist = (md.Artist?.value || '').replace(/<[^>]+>/g, '').trim();
      out.push({ title: p.title, w: ii.width, h: ii.height, url: ii.thumburl || ii.url, page: ii.descriptionurl, lic, artist });
    }
  }
  return out;
}

(async () => {
  for (const [key, cats] of Object.entries(MESTA)) {
    const dir = path.join(__dirname, '..', '_slike', 'stock-' + niche, key);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    let titles = [];
    for (const c of cats) titles.push(...await files(c));
    titles = [...new Set(titles)];
    const list = (await infos(titles)).filter((x) => x.w >= 1800 && x.w / x.h >= 1.3 && x.w / x.h <= 2.4 && OK_LIC.test(x.lic) && x.artist);
    list.sort((a, b) => b.w * b.h - a.w * a.h);
    const meta = [];
    for (const x of list.slice(0, 24)) {
      try {
        const r = await fetch(x.url, { headers: { 'User-Agent': UA } });
        if (!r.ok) continue;
        const name = String(meta.length + 1).padStart(2, '0') + '.jpg';
        await sharp(Buffer.from(await r.arrayBuffer())).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 76, mozjpeg: true }).toFile(path.join(dir, name));
        meta.push({ file: name, title: x.title, author: x.artist.slice(0, 80), license: x.lic, page: x.page });
      } catch {}
      await new Promise((res) => setTimeout(res, 400));
    }
    fs.writeFileSync(path.join(dir, '_izvor.json'), JSON.stringify(meta, null, 1));
    console.log(key.padEnd(10), `${titles.length} fajlova, ${list.length} odgovara, skinuto ${meta.length}`);
  }
})();
