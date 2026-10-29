// Full-page screenshots of built demo sites (desktop 1280 and phone 390), shrunk for quick review.
// Usage: node sajtovi/_alati/snimak.js <out-dir> <niche/slug> [...]
const path = require('path');
const { chromium } = require('playwright');
const sharp = require('sharp');
const [out, ...sites] = process.argv.slice(2);
(async () => {
  const br = await chromium.launch();
  for (const s of sites) {
    for (const [w, tag] of [[1280, 'd'], [390, 'm']]) {
      const p = await br.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
      await p.goto('file:///' + path.resolve(__dirname, '..', s, 'index.html').split(path.sep).join('/'), { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } window.scrollTo(0, 0); });
      await p.waitForTimeout(1500);
      const buf = await p.screenshot({ fullPage: true });
      const name = s.split('/').pop() + '-' + tag + '.jpg';
      await sharp(buf).resize({ width: tag === 'd' ? 760 : 300 }).jpeg({ quality: 70 }).toFile(path.join(out, name));
      await p.close();
    }
  }
  await br.close();
})();
