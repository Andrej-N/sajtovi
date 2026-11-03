// Builds the real-estate demos: one link per agency with all 4 designs.
// sajtovi/nekretnine/<slug>/index.html (design 1), dizajn-2.html, dizajn-3.html, dizajn-4.html + img/.
// The order of designs per agency is b.designs (first = what they see first). A floating bar switches between them.
// Phone, rating, reviews and Maps link come from EMAIL-LEADOVI.xlsx by slug, so the mail links always match.
// Photos: 'o-03' = _slike/nekretnine/<slug>/o-03.jpg (from _alati/oglasi.js), '05' = from skupi.js.
// Usage: node sajtovi/_alati/build-nekretnine.js [slug ...]
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const niche = 'nekretnine';
const only = process.argv.slice(2);
const XLSX = path.join(ROOT, '..', 'EMAIL-LEADOVI.xlsx');
const LEADS = require(path.join(ROOT, '..', 'email-leadovi-po-delatnosti.json')).find((x) => x.niche === niche);
const T = { minimal: require('../_sabloni/nekretnine/minimal'), lokal: require('../_sabloni/nekretnine/lokal'), premium: require('../_sabloni/nekretnine/premium'), brutal: require('../_sabloni/nekretnine/brutal') };

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

const norm = (p) => String(p).replace(/\D/g, '').replace(/^381/, '').replace(/^0/, '');

(async () => {
  const rows = await excelRows();
  const data = require(path.join(ROOT, '_podaci', niche + '.js'));
  const problems = [];
  let n = 0;
  for (const raw of data) {
    if (only.length && !only.includes(raw.slug)) continue;
    const row = rows.get(raw.slug);
    if (!row) { problems.push(`${raw.slug}: nije u Excelu`); continue; }
    const used = new Map(); // published name -> source file
    const credits = new Set();
    // 'o-03' = their photo; 'stock:kraljevo/07' = Wikimedia Commons photo (author and licence go to the footer)
    const need = (ref) => {
      if (!ref) return ref;
      let src = path.join(ROOT, '_slike', niche, raw.slug, ref + '.jpg'), name = ref;
      const st = /^stock:([\w-]+)\/(\d+)$/.exec(ref);
      if (st) {
        const dir = path.join(ROOT, '_slike', 'stock-' + niche, st[1]);
        src = path.join(dir, st[2] + '.jpg');
        name = 's-' + st[1] + '-' + st[2];
        const it = JSON.parse(fs.readFileSync(path.join(dir, '_izvor.json'), 'utf8')).find((f) => f.file === st[2] + '.jpg');
        if (it) credits.add(`${/nepoznat|unknown/i.test(it.author) ? 'nepoznat autor' : it.author}, ${it.license}`);
      }
      if (!fs.existsSync(src)) { problems.push(`${raw.slug}: nema slike ${ref}`); return null; }
      used.set(name, src);
      return name;
    };
    const L = raw.listings.map((x) => ({ ...x, img: need(x.img), imgs: (x.imgs || []).map(need).filter(Boolean) }));
    const bandImgs = raw.bandImgs && raw.bandImgs.map(need).filter(Boolean);
    const heroImg = need(raw.heroImg);
    const b = {
      ...raw,
      listings: L, bandImgs, heroImg,
      name: raw.name || row.name,
      address: raw.address || row.address,
      email: raw.email === null ? '' : raw.email || row.email || '',
      phones: [...new Set([...(raw.phones || []), row.phone].filter(Boolean).map(norm))].map((p) => '+381' + p),
      rating: row.rating ? { value: row.rating, count: row.reviews, url: row.maps } : null,
      designs: raw.designs || ['minimal', 'lokal', 'premium', 'brutal'],
      credits: credits.size ? [...credits].join('; ') : '',
    };
    const dir = path.join(ROOT, niche, raw.slug);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(path.join(dir, 'img'), { recursive: true });
    b.designs.forEach((d, i) => fs.writeFileSync(path.join(dir, i === 0 ? 'index.html' : `dizajn-${i + 1}.html`), T[d](b)));
    for (const [name, src] of used) fs.copyFileSync(src, path.join(dir, 'img', name + '.jpg'));
    console.log(`${raw.slug.padEnd(42)} ${b.designs.join(' > ').padEnd(36)} ${String(b.listings.length).padStart(2)} oglasa ${String(used.size).padStart(2)} slika`);
    n++;
  }
  console.log(`\n${n} agencija → sajtovi/${niche}/`);
  if (problems.length) { console.log('\nPROBLEMI:\n' + problems.join('\n')); process.exitCode = 1; }
})();
