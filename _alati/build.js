// Builds the demo sites: sajtovi/<niche>/<slug>/ with index.html, usluge/, o-nama/, kontakt/, stil.css, img/, logo.
// Phone, rating, reviews and Maps link come from EMAIL-LEADOVI.xlsx by slug, so the links in the mail always match.
// Usage: node sajtovi/_alati/build.js [niche]   (default: stamparije)
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { hoursList, fmtPhone, showRating } = require('../_sabloni/shared');

const ROOT = path.join(__dirname, '..');
const XLSX = path.join(ROOT, '..', 'EMAIL-LEADOVI.xlsx');
const niche = process.argv[2] || 'stamparije';
const TEMPLATES = { stamparije: 'kopirnice' };

const slugId = (s) => s.toLowerCase().replace(/đ/g, 'dj').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function excelRows() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(XLSX);
  const rows = new Map();
  for (const ws of wb.worksheets) {
    if (ws.getCell('C1').value !== 'Slug (folder sajta)') continue;
    ws.eachRow((r, i) => {
      if (i === 1) return;
      const cell = (k) => { const v = r.getCell(k).value; return v && typeof v === 'object' ? v.hyperlink || v.text || v.result || '' : v ?? ''; };
      rows.set(cell(3), { name: cell(2), phone: String(cell(11)), rating: String(cell(12)), reviews: Number(cell(13)) || 0, maps: cell(19) });
    });
  }
  return rows;
}

function defaultFaq(b) {
  const l = b.locations;
  const where = l.map((x) => `${x.label ? x.label + ': ' : ''}${x.address}${hoursList(x.hours).length ? ' (' + hoursList(x.hours).map(([d, h]) => `${d} ${h}`.trim()).join(', ') + ')' : ''}`).join('; ');
  const has = (t) => b.services.some((s) => s.type === t);
  const f = b.flow === 'stamparija'
    ? [
      ['Kako da dobijem ponudu?', `Pošaljite upit na ${b.email}: šta štampate, tiraž, format i rok. Javljamo cenu i rok izrade.`],
      ['U kom formatu da pošaljem fajl?', 'Najbolje PDF sa tekstom pretvorenim u krive i 3 mm za sečenje sa svake strane. Ako niste sigurni, pošaljite šta imate pa ćemo proveriti.'],
      has('dizajn') ? ['Nemam pripremljen fajl, šta sada?', 'Uradimo dizajn i pripremu za štampu, a pre štampe dobijate predlog na odobrenje.'] : null,
      ['Gde se nalazite?', where],
    ]
    : [
      ['Kako da pošaljem fajl?', `Pošaljite ga na ${b.email} ili ga donesite na USB-u. Najsigurnije je u PDF formatu, da se ništa ne pomeri.`],
      ['Koliko košta štampa?', 'Cena zavisi od formata, boje, broja strana i poveza. Pošaljite fajl i javljamo tačnu cenu.'],
      has('koricenje') ? ['Da li koričite diplomske i seminarske radove?', b.services.find((s) => s.type === 'koricenje').d] : null,
      ['Gde se nalazite i kada radite?', where],
    ];
  return [...f.filter(Boolean), ...(b.faq || [])];
}

function defaultWhy(b, rows) {
  const w = [['Fajl mailom', `Pošaljite na ${b.email} i ne čekate u redu.`]];
  const r = b.rating;
  if (showRating(r)) w.push([`${r.value} na Google-u`, `Prosečna ocena od ${r.count} ljudi koji su bili kod nas.`]);
  w.push(b.locations.length > 1 ? [`${b.locations.length} lokacije`, b.locations.map((l) => l.address).join(' · ')] : [b.area && b.area !== b.city ? b.area : b.city, b.locations[0].address]);
  const h = hoursList(b.locations[0].hours);
  if (h.length) w.push(['Radno vreme', h.map(([d, x]) => `${d} ${x}`.trim()).join(', ')]);
  else if (b.phone) w.push(['Pozovite', fmtPhone(b.phone)]);
  return w;
}

(async () => {
  const rows = await excelRows();
  const data = require(path.join(ROOT, '_podaci', niche + '.js'));
  const extra = require(path.join(ROOT, '_podaci', niche + '-dodatno.js'));
  const looks = fs.existsSync(path.join(ROOT, '_podaci', niche + '-izgled.js')) ? require(path.join(ROOT, '_podaci', niche + '-izgled.js')) : {};
  const tplDir = path.join(ROOT, '_sabloni', TEMPLATES[niche] || niche);
  const katalog = require(path.join(tplDir, 'katalog.js'));
  const site = require(path.join(tplDir, 'sajt.js'));
  const outDir = path.join(ROOT, niche);
  const problems = [];
  let pages = 0;

  for (const raw of data) {
    const x = extra[raw.key] || {};
    for (const s of raw.slugs) if (!rows.has(s)) problems.push(`${raw.key}: slug "${s}" nije u Excelu`);
    const main = rows.get(raw.ratingSlug || raw.slugs[0]) || {};
    const used = new Map(); // source path -> published name under img/
    const img = (ref) => {
      if (!ref) return null;
      const src = ref.startsWith('stock:') ? path.join(ROOT, '_slike', 'stock', ref.slice(6) + '.jpg') : path.join(ROOT, '_slike', raw.key, ref);
      if (!fs.existsSync(src)) { problems.push(`${raw.key}: nema slike ${ref}`); return null; }
      const name = (ref.startsWith('stock:') ? ref.slice(6) + '.jpg' : ref);
      used.set(src, name);
      return 'img/' + name;
    };

    const b = {
      ...raw,
      phone: raw.phone || rows.get(raw.slugs[0])?.phone || '',
      rating: main.rating ? { value: main.rating, count: main.reviews, url: main.maps } : null,
      locations: raw.locations.map((l) => {
        const row = l.slug ? rows.get(l.slug) || {} : {};
        const phones = l.phones || (row.phone ? [row.phone] : []);
        return { ...l, phones: [...new Set(phones.map((p) => p.replace(/\D/g, '')))], maps: row.maps || main.maps };
      }),
    };
    b.services = raw.services.map((s, i) => {
      const type = (x.types || [])[i] || 'stampa';
      const k = katalog[type] || katalog.stampa;
      const own = (x.svcImg || {})[i];
      return { ...s, type, id: slugId(s.t), icon: k.icon, long: s.long || k.long, bullets: s.bullets || [], img: own ? img(own) : k.img ? img('stock:' + k.img) : null };
    });
    if (!x.types) problems.push(`${raw.key}: nema tipova usluga u -dodatno`);
    b.featured = b.services.find((s) => s.img) || b.services[0];
    const alt = (ref) => `${b.name}`;
    b.heroImg = x.hero ? { src: img(x.hero), alt: alt(x.hero) } : null;
    b.aboutImg = x.about ? { src: img(x.about), alt: alt(x.about) } : b.heroImg;
    b.gallery = (x.gallery || []).map((g) => ({ src: img(g), alt: b.name })).filter((g) => g.src);
    Object.assign(b, { galleryTitle: x.galleryTitle, galleryKicker: x.galleryKicker });
    b.story = x.story || [b.intro, `Pošaljite fajl ili upit na ${b.email}, ili svratite na adresu ${b.locations[0].address}. Rado ćemo pomoći oko izbora papira, formata i poveza.`];
    b.why = x.why || defaultWhy(b);
    b.faq = defaultFaq(b);
    if (b.logo) b.logo.ext = path.extname(b.logo.file);
    b.look = looks[raw.key] || {};
    if (b.look.template) b.template = b.look.template;
    // Redesigned sites: feature a service whose photo is not already the hero photo
    if (b.look.pal && b.heroImg) b.featured = b.services.find((s) => s.img && s.img !== b.heroImg.src) || b.featured;

    const skin = require(path.join(tplDir, b.template + '.js'))(b.look.pal);
    const files = site(b, skin);

    for (const slug of raw.slugs) {
      const dir = path.join(outDir, slug);
      fs.rmSync(dir, { recursive: true, force: true });
      for (const [rel, content] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
        fs.writeFileSync(path.join(dir, rel), content);
      }
      fs.mkdirSync(path.join(dir, 'img'), { recursive: true });
      for (const [src, name] of used) fs.copyFileSync(src, path.join(dir, 'img', name));
      if (b.logo) fs.copyFileSync(path.join(ROOT, '_logo', b.logo.file), path.join(dir, 'logo' + b.logo.ext));
      pages++;
    }
    console.log(`${b.template.padEnd(8)} ${raw.key.padEnd(14)} ${String(used.size).padStart(2)} slika → ${raw.slugs.join(', ')}`);
  }

  console.log(`\n${pages} sajtova (po 4 strane), ${data.length} biznisa → ${path.relative(process.cwd(), outDir)}`);
  if (problems.length) { console.log('\nPROBLEMI:\n' + problems.join('\n')); process.exitCode = 1; }
})();
