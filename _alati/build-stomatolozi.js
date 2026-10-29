// Builds one-page demo sites for dental offices: sajtovi/stomatolozi/<slug>/index.html + img/ + logo.
// Phone, rating, reviews and Maps link come from EMAIL-LEADOVI.xlsx by slug, so the links in the mail always match.
// Photos: '05' = the business's own photo (_slike/stomatolozi/<slug>/05.jpg). Logo: _logo/stomatolozi/<slug>.<ext>.
// Usage: node sajtovi/_alati/build-stomatolozi.js [slug ...]
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const niche = 'stomatolozi';
const only = process.argv.slice(2);
const XLSX = path.join(ROOT, '..', 'EMAIL-LEADOVI.xlsx');
const LEADS = require(path.join(ROOT, '..', 'email-leadovi-po-delatnosti.json')).find((x) => x.niche === niche);
const site = require('../_sabloni/stomatolozi/sajt');

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
    const name = raw.name || row.name;
    const used = new Map(); // source -> published name
    const pic = (ref, alt, cap) => {
      if (!ref) return null;
      const src = path.join(ROOT, '_slike', niche, raw.slug, ref + '.jpg');
      if (!fs.existsSync(src)) { problems.push(`${raw.slug}: nema slike ${ref}`); return null; }
      used.set(src, ref + '.jpg');
      return { src: 'img/' + ref + '.jpg', alt: alt || name, cap };
    };
    let logo = null;
    if (raw.logo !== false) {
      const file = fs.readdirSync(path.join(ROOT, '_logo', niche)).find((f) => f.startsWith(raw.slug + '.'));
      if (file) logo = { ...(raw.logo || {}), ext: path.extname(file), file: path.join(ROOT, '_logo', niche, file) };
    }
    const b = {
      ...raw,
      name,
      logo,
      address: raw.address || row.address,
      email: raw.email === null ? '' : raw.email || row.email || '',
      phones: [...new Set([...(raw.phones || []), row.phone].filter(Boolean).map((p) => p.replace(/\D/g, '').replace(/^381/, '').replace(/^0/, '')))].map((p) => '+381' + p),
      rating: row.rating ? { value: row.rating, count: row.reviews, url: row.maps } : null,
      hero: pic(raw.hero, raw.heroAlt),
      teamImg: pic(raw.teamImg, `Tim: ${name}`),
      heroImgs: (raw.heroImgs || []).map((g) => Array.isArray(g) ? pic(g[0], g[1]) : pic(g, name)).filter(Boolean),
      servicesImg: pic(raw.servicesImg, name),
      gallery: (raw.gallery || []).map((g) => Array.isArray(g) ? pic(g[0], g[1], g[1]) : pic(g)).filter(Boolean),
      special: (raw.special || []).map((x) => ({ ...x, img: pic(x.img, x.t) })),
      backdrops: Object.fromEntries(Object.entries(raw.backdrops || {}).map(([k, v]) => [k, pic(v, '')])),
    };
    const skin = require(`../_sabloni/stomatolozi/${raw.t}`)(raw.look?.pal);
    const files = site(b, skin);
    const dir = path.join(ROOT, niche, raw.slug);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(path.join(dir, 'img'), { recursive: true });
    for (const [rel, content] of Object.entries(files)) fs.writeFileSync(path.join(dir, rel), content);
    for (const [src, nm] of used) fs.copyFileSync(src, path.join(dir, 'img', nm));
    if (logo) fs.copyFileSync(logo.file, path.join(dir, 'logo' + logo.ext));
    console.log(`${raw.t.padEnd(8)} ${raw.slug.padEnd(42)} ${String(used.size).padStart(2)} slika ${logo ? 'logo' : '-'}`);
    n++;
  }
  console.log(`\n${n} sajtova → sajtovi/${niche}/`);
  if (problems.length) { console.log('\nPROBLEMI:\n' + problems.join('\n')); process.exitCode = 1; }
})();
