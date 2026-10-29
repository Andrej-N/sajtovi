// Skandi (Scandinavian holistic editorial, fuller): birch ground, large thin serif, photo collage hero with an hours card,
// a colored band with a line-drawn tooth, icon cards in thin circles, figures strip, mosaic, Q&A and a deep booking section.
// Default: dr Marija Simić (birch / sage / spruce).
const { rgba, mix } = require('../boje');

const DEFAULT = { bg: '#f5f4f0', ink: '#1e2a26', muted: '#4a5752', line: '#d6d4cb', band: '#c9d6c6', deep: '#2b3d35', acc: '#1e2a26', accInk: '#f5f4f0', tint: '#3f7a55' };

const toothSvg = (c) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${c}' stroke-width='.35'><path d='M7.5 3.5c1.6 0 2.7.9 4.5.9s2.9-.9 4.5-.9c2.4 0 4 1.9 4 4.6 0 3-1.3 4.6-2 7.4-.6 2.6-.9 5-2.4 5-1.7 0-1.6-4.7-4.1-4.7S9.6 20.5 7.9 20.5c-1.5 0-1.8-2.4-2.4-5-.7-2.8-2-4.4-2-7.4 0-2.7 1.6-4.6 4-4.6z'/><path d='M9 7.5c.9.4 1.9.6 3 .6' stroke-width='.25'/></svg>`)}")`;

module.exports = function skandi(o = {}) {
  const p = { ...DEFAULT, ...o };
  return {
    key: 'skandi', hero: 'editorial',
    order: ['posebno-0', 'usluge', 'brojke', 'galerija', 'tim', 'cene', 'posebno-1', 'pitanja', 'utisci', 'kontakt'],
    tones: { 'posebno-0': 'band', usluge: 'plain', brojke: 'white', galerija: 'plain', tim: 'plain', cene: 'plain', 'posebno-1': 'white', pitanja: 'plain', utisci: 'band', zakazivanje: 'deep', kontakt: 'plain' },
    fonts: 'family=Instrument+Serif:ital@0;1&family=Albert+Sans:wght@300;400;500;600',
    css: `:root{--bg:${p.bg};--ink:${p.ink};--muted:${p.muted};--line:${p.line};--acc:${p.acc};--accInk:${p.accInk};--acc2:${p.tint};--fd:'Instrument Serif',serif;--fb:'Albert Sans',system-ui,sans-serif;--hw:400;--ht:-.01em;--r-btn:0;--r-img:2px;--r-in:0;--field:transparent}
body{font-weight:300;line-height:1.65}
b,strong,.doc b,.svc b,.box b,.steps b{font-weight:500}
h2{font-size:clamp(38px,4.4vw,62px);line-height:1}
.in{max-width:1240px}
.sec{padding:clamp(56px,6.5vw,100px) 0}
.brand{font-family:var(--fd);font-weight:400;font-size:28px;letter-spacing:0}
.btn{font-weight:500}
.btn-call{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.hero-in{display:flex;flex-wrap:wrap;gap:40px 5vw;align-items:center;padding-top:clamp(20px,3vw,48px);padding-bottom:clamp(56px,6vw,96px)}
.hero-text{flex:1.15 1 460px;display:flex;flex-direction:column;gap:30px}
.hero-ed h1{font-size:clamp(52px,7.2vw,112px);line-height:.94}
.hero-sub{display:flex;flex-direction:column;gap:22px}
.hero-sub .lead{max-width:44ch;font-size:18px}
.hero-fig{flex:1 1 380px;margin:0 0 30px;min-width:0}
.col-main{width:100%;aspect-ratio:4/5;object-fit:cover;filter:saturate(.9)}
.col-s{position:absolute;object-fit:cover;border:8px solid ${p.bg};filter:saturate(.9)}
.col-s1{width:46%;aspect-ratio:1;left:-18%;bottom:-30px}
.col-s2{width:34%;aspect-ratio:3/4;right:-6%;top:-22px}
.col-badge{right:-10px;bottom:28%;border-radius:0;background:${p.deep};color:#f1f0ea;flex-direction:column;align-items:flex-start;gap:8px;box-shadow:none;max-width:220px}
.col-badge b{font-size:26px}.col-badge span{color:${rgba('#f1f0ea', .75)}}
.col-badge .ic{color:${p.band};margin-bottom:4px}
.hero-fig figcaption{margin-top:10px;font-size:13px;color:var(--muted)}
.has-col figcaption{margin-top:40px}
.quote-big{font-size:clamp(32px,4vw,58px)}
.tone-band{background:${p.band} ${toothSvg(rgba(p.ink, .35))} no-repeat left -60px center/clamp(260px,34vw,460px);--line:${rgba(p.ink, .18)}}
.tone-band .note{color:${rgba(p.ink, .8)}}
.tone-white{background:${mix(p.bg, '#ffffff', .65)}}
.tone-deep{background:${p.deep};color:#f1f0ea;--ink:#f1f0ea;--muted:${rgba('#f1f0ea', .72)};--line:${rgba('#ffffff', .25)};--acc:#f1f0ea;--accInk:${p.deep}}
.cards{grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:0;border-top:1px solid var(--line)}
.card{padding:28px 28px 30px 0;border-bottom:1px solid var(--line);gap:12px}
.card h3{font-family:var(--fd);font-size:28px;font-weight:400;line-height:1.05;letter-spacing:0}
.card .ic{width:52px;height:52px;border-radius:50%;border:1px solid ${rgba(p.tint, .5)};color:${p.tint}}
.card-img{border:0;padding:0 0 0 0!important;min-height:260px}
.card-img img{filter:saturate(.9)}
.facts{grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0}
.facts div{padding:6px 28px;border-left:1px solid var(--line)}
.facts div:first-child{border-left:0;padding-left:0}
.facts dt{font-size:clamp(44px,4.6vw,68px);font-weight:400}
.facts .ic{color:${p.tint};margin-bottom:6px}
.prose{font-family:var(--fd);font-size:clamp(26px,2.6vw,36px);line-height:1.3;color:var(--ink)}
.duo-img{align-items:center}
.duo-img .sp-img{flex:1 1 420px;width:100%;aspect-ratio:4/3;filter:saturate(.9)}
.duo-img .duo-h,.duo-img .duo-b{flex:1 1 340px}
.plist li{border-color:var(--line)}
.gal{grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:clamp(150px,17vw,230px);gap:10px}
.gal figure{position:relative}.gal a{height:100%}
.gal img{height:100%;aspect-ratio:auto;filter:saturate(.9)}
.gal figcaption{position:absolute;left:0;bottom:0;padding:6px 10px;background:${p.bg};font-size:12px}
.gal-5 figure:first-child,.gal-4 figure:first-child{grid-column:span 2;grid-row:span 2}
.gal-3 figure:first-child{grid-column:span 2;grid-row:span 2}
.gal-2{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:clamp(220px,28vw,380px)}
.steps li{padding-top:18px;border-top:1px solid var(--line)}
.steps .ic{color:${p.tint}}
.faq summary{font-family:var(--fd);font-weight:400;font-size:24px}
.quotes blockquote{font-size:clamp(24px,2.4vw,32px);line-height:1.25}
.book input,.book select{border:0;border-bottom:1px solid var(--line);padding:0;background:transparent}
.book select option{color:#111}
.phones a{font-size:30px}
.map{filter:saturate(.7)}
.dock{--dockBg:${p.bg}}
@media (max-width:820px){.col-s1{left:-4%}.col-s2{right:-3%}.col-badge{right:6px}.gal{grid-template-columns:repeat(2,minmax(0,1fr))}.facts div{border-left:0;padding-left:0}}`,
  };
};
