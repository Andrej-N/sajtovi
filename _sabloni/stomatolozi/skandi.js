// Skandi (Scandinavian holistic editorial): birch-white ground, large thin serif, asymmetric photos with captions,
// one colored band (quote / special) and one deep section for booking. Default: dr Marija Simić (birch / sage / spruce).
const { rgba } = require('../boje');

const DEFAULT = { bg: '#f5f4f0', ink: '#1e2a26', muted: '#4a5752', line: '#d6d4cb', band: '#c9d6c6', deep: '#2b3d35', acc: '#1e2a26', accInk: '#f5f4f0' };

module.exports = function skandi(o = {}) {
  const p = { ...DEFAULT, ...o };
  return {
    key: 'skandi', hero: 'editorial',
    order: ['posebno-0', 'usluge', 'galerija', 'tim', 'cene', 'utisci', 'posebno-1', 'kontakt'],
    tones: { 'posebno-0': 'band', usluge: 'plain', galerija: 'plain', tim: 'plain', cene: 'plain', utisci: 'band', 'posebno-1': 'plain', zakazivanje: 'deep', kontakt: 'plain' },
    fonts: 'family=Instrument+Serif&family=Albert+Sans:wght@300;400;500;600',
    css: `:root{--bg:${p.bg};--ink:${p.ink};--muted:${p.muted};--line:${p.line};--acc:${p.acc};--accInk:${p.accInk};--fd:'Instrument Serif',serif;--fb:'Albert Sans',system-ui,sans-serif;--hw:400;--ht:-.01em;--r-btn:0;--r-img:0;--r-in:0;--field:transparent}
body{font-weight:300;line-height:1.7}
b,strong,.doc b,.svc b,.box b{font-weight:500}
h2{font-size:clamp(40px,5vw,72px);line-height:1}
.in{max-width:1280px}
.brand{font-family:var(--fd);font-weight:400;font-size:28px;letter-spacing:0}
.btn{font-weight:500}
.btn-call{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.hero-in{display:flex;flex-wrap:wrap;gap:48px 6vw;align-items:flex-end;padding-top:clamp(32px,6vw,96px);padding-bottom:clamp(64px,8vw,128px)}
.hero-text{flex:1.3 1 480px;display:flex;flex-direction:column;gap:36px}
.hero-ed h1{font-size:clamp(54px,8.2vw,124px);line-height:.92}
.hero-sub{display:flex;flex-wrap:wrap;gap:24px 44px;align-items:flex-end}
.hero-sub .lead{flex:1 1 260px;max-width:36ch;font-size:18px}
.hero-fig{flex:1 1 340px;margin:0;display:flex;flex-direction:column;gap:10px}
.hero-fig img{width:100%;aspect-ratio:4/5;object-fit:cover;filter:saturate(.85)}
.hero-fig figcaption,.gal figcaption{font-size:13px;color:var(--muted)}
.sec{padding:clamp(72px,9vw,144px) 0}
.duo{gap:32px 6vw}
.prose{font-family:var(--fd);font-size:clamp(26px,2.6vw,36px);line-height:1.3;color:var(--ink)}
.svc li,.plist li,.pr{border-color:var(--line)}
.gal img{filter:saturate(.85);aspect-ratio:4/5}
.gal figure:nth-child(2n){margin-top:clamp(0px,6vw,96px)}
.quotes blockquote{font-size:clamp(24px,2.4vw,32px);line-height:1.25}
.tone-band{background:${p.band};--line:${rgba(p.ink, .18)}}
.tone-band .note{color:${rgba(p.ink, .8)}}
.tone-deep{background:${p.deep};color:#f1f0ea;--ink:#f1f0ea;--muted:${rgba('#f1f0ea', .72)};--line:${rgba('#ffffff', .25)};--acc:#f1f0ea;--accInk:${p.deep}}
.book input,.book select{border:0;border-bottom:1px solid var(--line);padding:0;background:transparent}
.book select option{color:#111}
.phones a{font-size:30px}
.map{filter:saturate(.7)}
.dock{--dockBg:${p.bg}}`,
  };
};
