// Contact sheet of downloaded photos (numbered thumbnails), to pick hero and gallery by eye.
// Usage: node sajtovi/_alati/list-slika.js <dir-with-niche-images> <out.jpg> slug [slug ...]
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const [dir, out, ...slugs] = process.argv.slice(2);
const W = 170, H = 110, COLS = 8;
(async () => {
  const tiles = [];
  let y = 0;
  for (const s of slugs) {
    const d = path.join(dir, s);
    const files = fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.jpg')) : [];
    tiles.push({ input: Buffer.from(`<svg width="${COLS * W}" height="22"><rect width="100%" height="100%" fill="#222"/><text x="6" y="16" font-size="15" fill="#fff" font-family="Arial">${s}</text></svg>`), left: 0, top: y });
    y += 22;
    for (let i = 0; i < files.length; i++) {
      const buf = await sharp(path.join(d, files[i])).resize(W - 4, H - 4, { fit: 'cover' }).toBuffer();
      const left = (i % COLS) * W, top = y + Math.floor(i / COLS) * H;
      tiles.push({ input: buf, left: left + 2, top: top + 2 });
      tiles.push({ input: Buffer.from(`<svg width="26" height="18"><rect width="100%" height="100%" fill="#000"/><text x="3" y="14" font-size="13" fill="#ff0" font-family="Arial">${files[i].slice(0, 2)}</text></svg>`), left: left + 2, top: top + 2 });
    }
    y += Math.ceil(files.length / COLS) * H || 0;
  }
  await sharp({ create: { width: COLS * W, height: y, channels: 3, background: '#444' } }).composite(tiles).jpeg({ quality: 70 }).toFile(out);
})();
