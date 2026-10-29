// Rendgen: light steel ground, white price list, one dark band like X-ray film and one accent band. Wide Archivo headings.
// Default: Kraneks (steel blue / film black / X-ray warning yellow).
const { rgba } = require('../boje');

const DEFAULT = { bg: '#e4ecf1', ink: '#18222b', muted: '#4f5d68', line: '#d3dde3', dark: '#131c24', acc: '#f2c14e', accInk: '#18222b' };

module.exports = function rendgen(o = {}) {
  const p = { ...DEFAULT, ...o };
  return {
    key: 'rendgen', hero: 'split',
    order: ['usluge', 'cene', 'posebno-0', 'tim', 'galerija', 'posebno-1', 'utisci', 'kontakt'],
    tones: { usluge: 'plain', cene: 'white', 'posebno-0': 'dark', tim: 'white', galerija: 'plain', 'posebno-1': 'acc', utisci: 'white', zakazivanje: 'white', kontakt: 'plain' },
    fonts: 'family=Archivo:wdth,wght@62..125,400..800&family=Instrument+Sans:wght@400;500;600',
    css: `:root{--bg:${p.bg};--ink:${p.ink};--muted:${p.muted};--line:${p.line};--acc:${p.acc};--accInk:${p.accInk};--fd:'Archivo',sans-serif;--fb:'Instrument Sans',system-ui,sans-serif;--hw:600;--r-img:6px;--r-in:6px;--field:#fff}
h1,h2,h3,.brand,.phones a{font-stretch:118%}
.hero-in{display:flex;flex-wrap:wrap;gap:48px 72px;align-items:center;padding-top:clamp(32px,6vw,96px);padding-bottom:clamp(64px,8vw,120px)}
.hero-text{flex:1 1 400px;display:flex;flex-direction:column;gap:24px}
.hero-hours{margin:0;color:var(--muted)}
.hero-fig{flex:1.3 1 460px;margin:0;display:flex;flex-direction:column;gap:10px}
.hero-fig img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:6px;background:#000}
.hero-fig figcaption{font-size:14px;color:var(--muted)}
.tone-white{background:#fff}
.tone-dark{background:${p.dark};color:#eef3f6;--ink:#eef3f6;--muted:${rgba('#eef3f6', .68)};--line:${rgba('#ffffff', .14)};--field:${rgba('#ffffff', .06)}}
.tone-acc{background:${p.acc};color:${p.accInk};--ink:${p.accInk};--muted:${rgba(p.accInk, .78)};--line:${rgba(p.accInk, .2)};--acc:${p.accInk};--accInk:${p.acc}}
.tone-dark .box-shape i{border-color:${p.acc}}
.pr-v{font-family:var(--fd);font-stretch:112%;font-weight:600}
.quotes blockquote{font-size:19px;font-weight:500}
.dock{--dockBg:#fff}`,
  };
};
