// Prints a compact digest of collected site text (unique lines) for writing the data file by hand.
// Usage: node sajtovi/_alati/izvod.js smestaj slug [slug ...] [--max 2200]
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
const niche = args.shift();
const mi = args.indexOf('--max');
const max = mi >= 0 ? +args.splice(mi, 2)[1] : 2200;
for (const slug of args) {
  const f = path.join(__dirname, '..', '_podaci', niche + '-izvor', slug + '.json');
  if (!fs.existsSync(f)) { console.log(`\n### ${slug}: nema`); continue; }
  const r = JSON.parse(fs.readFileSync(f, 'utf8'));
  const seen = new Set();
  const lines = [];
  for (const p of r.pages) for (const l of p.text.split('\n')) {
    const k = l.toLowerCase();
    if (l.length < 3 || seen.has(k) || /cookie|kolačić|©|copyright|izrada sajta|web design|powered by/i.test(l)) continue;
    seen.add(k);
    lines.push(l);
  }
  const txt = lines.join(' | ');
  console.log(`\n### ${slug} [${r.site_state}] ${r.website || ''} slike:${r.images.length}\n${txt.slice(0, max)}`);
}
