// Gradi demo sajtove za klimu i belu tehniku: jedan link po biznisu sa 3 dizajna (kao nekretnine).
// sajtovi/klima-bela-tehnika/<slug>/index.html, dizajn-2.html, dizajn-3.html + img/, a 3D scena je jedna:
// sajtovi/klima-bela-tehnika/scena.js (+ poster.jpg kad WebGL nije dostupan).
// Telefon je iz podataka, a ocena, recenzije i Maps iz EMAIL-LEADOVI.xlsx po slugu.
// Upotreba: node sajtovi/_alati/build-klima.js [slug ...]
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const niche = 'klima-bela-tehnika';
const only = process.argv.slice(2);
const XLSX = path.join(ROOT, '..', 'EMAIL-LEADOVI.xlsx');
const LEADS = require(path.join(ROOT, '..', 'email-leadovi-po-delatnosti.json')).find((x) => x.niche === niche);
const T = { staklo: require('../_sabloni/klima/staklo'), premium: require('../_sabloni/klima/premium'), negativ: require('../_sabloni/klima/negativ') };
const data = require('../_podaci/' + niche);

async function excelRows() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);
  const rows = new Map();
  wb.getWorksheet(LEADS.sheet).eachRow((r, i) => {
    if (i === 1) return;
    const cell = (k) => { const v = r.getCell(k).value; return v && typeof v === 'object' ? v.hyperlink || v.text || v.result || '' : v ?? ''; };
    rows.set(cell(3), { name: cell(2), email: String(cell(5)).replace(/^mailto:/i, '').split(/\s+/)[0], rating: String(cell(12)), reviews: Number(cell(13)) || 0, maps: cell(19) });
  });
  return rows;
}

(async () => {
  const rows = await excelRows();
  const problems = [];
  let n = 0;
  const out = path.join(ROOT, niche);
  fs.mkdirSync(out, { recursive: true });
  fs.copyFileSync(path.join(ROOT, '_sabloni', 'klima', 'scena.js'), path.join(out, 'scena.js'));
  fs.copyFileSync(path.join(ROOT, '_slike', niche, '_render', 'poster.jpg'), path.join(out, 'poster.jpg'));
  for (const raw of data) {
    if (only.length && !only.includes(raw.slug)) continue;
    const row = rows.get(raw.slug);
    if (!row) { problems.push(`${raw.slug}: nije u Excelu`); continue; }
    const used = new Map();
    // '08' = njihova slika, '_render/kadar' = naš render staklene klime
    const need = (ref) => {
      if (!ref) return ref;
      const isR = ref.startsWith('_render/');
      const src = isR ? path.join(ROOT, '_slike', niche, ref + '.jpg') : path.join(ROOT, '_slike', niche, raw.slug, ref + '.jpg');
      const name = isR ? 'r-' + ref.slice(8) : ref;
      if (!fs.existsSync(src)) { problems.push(`${raw.slug}: nema slike ${ref}`); return null; }
      used.set(name, src);
      return name;
    };
    const b = {
      ...raw,
      heroImg: need(raw.heroImg),
      gallery: (raw.gallery || []).map((g) => ({ ...g, img: need(g.img) })),
      proc: raw.proc && { ...raw.proc, img: need(raw.proc.img) },
      neg: { ...raw.neg, img: need(raw.neg.img || raw.heroImg) },
      email: raw.email || row.email || '',
      rating: row.rating ? { value: row.rating, count: row.reviews, url: row.maps } : null,
    };
    const dir = path.join(out, raw.slug);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(path.join(dir, 'img'), { recursive: true });
    b.designs.forEach((d, i) => fs.writeFileSync(path.join(dir, i === 0 ? 'index.html' : `dizajn-${i + 1}.html`), T[d](b)));
    for (const [name, src] of used) fs.copyFileSync(src, path.join(dir, 'img', name + '.jpg'));
    console.log(`${raw.slug.padEnd(44)} ${b.designs.join(' > ').padEnd(28)} ${String(used.size).padStart(2)} slika  ${(b.email || '-').slice(0, 34)}`);
    n++;
  }
  console.log(`\n${n} biznisa → sajtovi/${niche}/`);
  if (problems.length) { console.log('\nPROBLEMI:\n' + problems.join('\n')); process.exitCode = 1; }
})();
