// Builds one-page demo sites for accommodation: sajtovi/smestaj/<slug>/index.html + img/.
// Phone, rating, reviews and Maps link come from EMAIL-LEADOVI.xlsx by slug, so the links in the mail always match.
// Photos: '05' = business's own photo (_slike/smestaj/<slug>/05.jpg), 'zlatibor:13' = Wikimedia Commons location photo (credited in the footer).
// Usage: node sajtovi/_alati/build-smestaj.js [slug ...]
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const niche = 'smestaj';
const only = process.argv.slice(2);
const XLSX = path.join(ROOT, '..', 'EMAIL-LEADOVI.xlsx');
const LEADS = require(path.join(ROOT, '..', 'email-leadovi-po-delatnosti.json')).find((x) => x.niche === niche);
const site = require('../_sabloni/smestaj/sajt');
const PLACES = { zlatibor: 'Zlatibor', kopaonik: 'Kopaonik', tara: 'Tara', vrnjacka: 'Vrnjačka Banja', sokobanja: 'Sokobanja' };

async function excelRows() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);
  const rows = new Map();
  wb.getWorksheet(LEADS.sheet).eachRow((r, i) => {
    if (i === 1) return;
    const cell = (k) => { const v = r.getCell(k).value; return v && typeof v === 'object' ? v.hyperlink || v.text || v.result || '' : v ?? ''; };
    rows.set(cell(3), { name: cell(2), email: String(cell(5)).replace(/^mailto:/i, '').split(/\s+/)[0], address: cell(10), phone: String(cell(11)), rating: String(cell(12)), reviews: Number(cell(13)) || 0, maps: cell(19) });
  });
  return rows;
}

(async () => {
  const rows = await excelRows();
  const data = require(path.join(ROOT, '_podaci', niche + '.js'));
  const problems = [];
  let n = 0;
  for (const raw of data) {
    if (only.length && !only.includes(raw.slug)) continue;
    const row = rows.get(raw.slug);
    if (!row) { problems.push(`${raw.slug}: nije u Excelu`); continue; }
    const used = new Map(); // source -> published name
    const credits = new Map();
    const pic = (ref, alt) => {
      if (!ref) return null;
      const [a, b] = ref.includes(':') ? ref.split(':') : [null, ref];
      const src = a ? path.join(ROOT, '_slike', 'stock-' + niche, a, b + '.jpg') : path.join(ROOT, '_slike', niche, raw.slug, b + '.jpg');
      if (!fs.existsSync(src)) { problems.push(`${raw.slug}: nema slike ${ref}`); return null; }
      const name = (a ? a + '-' : '') + b + '.jpg';
      used.set(src, name);
      if (a) {
        const meta = JSON.parse(fs.readFileSync(path.join(ROOT, '_slike', 'stock-' + niche, a, '_izvor.json'), 'utf8')).find((m) => m.file === b + '.jpg');
        if (meta) credits.set(meta.page, meta);
      }
      return { src: 'img/' + name, alt: a ? raw.placeName || PLACES[a] || a : alt || raw.name || row.name };
    };
    const name = raw.name || row.name;
    const placeName = raw.placeName || PLACES[raw.place];
    const b = {
      ...raw,
      name,
      placeName,
      address: raw.address || row.address,
      email: raw.email === null ? '' : raw.email || row.email || '',
      phones: [...new Set([...(raw.phones || []), row.phone].filter(Boolean).map((p) => p.replace(/\D/g, '').replace(/^381/, '').replace(/^0/, '')))].map((p) => '+381' + p),
      rating: row.rating ? { value: row.rating, count: row.reviews, url: row.maps } : null,
      hero: pic(raw.hero, `${name}, ${placeName}`),
      placeImg: pic(raw.placeImg, placeName),
      gallery: (raw.gallery || []).map((g) => pic(g, name)).filter(Boolean),
      units: raw.units && { ...raw.units, list: raw.units.list.map((u) => ({ ...u, img: pic(u.img, `${name}: ${u.name}`) })) },
      extras: raw.extras && raw.extras.map((x) => ({ ...x, img: pic(x.img, `${name}: ${x.t}`) })),
    };
    b.credits = [...credits.values()];
    const skin = require(`../_sabloni/smestaj/${raw.t}`)(raw.look?.pal);
    const files = site(b, skin);
    const dir = path.join(ROOT, niche, raw.slug);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(path.join(dir, 'img'), { recursive: true });
    for (const [rel, content] of Object.entries(files)) fs.writeFileSync(path.join(dir, rel), content);
    for (const [src, nm] of used) fs.copyFileSync(src, path.join(dir, 'img', nm));
    console.log(`${raw.t.padEnd(8)} ${raw.slug.padEnd(42)} ${String(used.size).padStart(2)} slika`);
    n++;
  }
  console.log(`\n${n} sajtova → sajtovi/${niche}/`);
  if (problems.length) { console.log('\nPROBLEMI:\n' + problems.join('\n')); process.exitCode = 1; }
})();
