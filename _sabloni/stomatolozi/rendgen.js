// Rendgen: light steel ground with a faint measuring grid, photo collage hero with a floating fact card, figures strip,
// icon cards for services, white price list, one dark film band, one accent band, steps, Q&A and a photo mosaic.
// Default: Kraneks (steel blue / film black / X-ray warning yellow).
const { rgba, mix } = require('../boje');

const DEFAULT = { bg: '#e4ecf1', ink: '#18222b', muted: '#4f5d68', line: '#d3dde3', dark: '#131c24', acc: '#f2c14e', accInk: '#18222b' };

module.exports = function rendgen(o = {}) {
  const p = { ...DEFAULT, ...o };
  const grid = `repeating-linear-gradient(0deg,${rgba(p.ink, .05)} 0 1px,transparent 1px 32px),repeating-linear-gradient(90deg,${rgba(p.ink, .05)} 0 1px,transparent 1px 32px)`;
  return {
    key: 'rendgen', hero: 'split',
    order: ['brojke', 'usluge', 'cene', 'posebno-0', 'koraci', 'galerija', 'tim', 'posebno-1', 'pitanja', 'utisci', 'kontakt'],
    tones: { brojke: 'white', usluge: 'plain', cene: 'white', 'posebno-0': 'dark', koraci: 'plain', tim: 'white', galerija: 'white', 'posebno-1': 'acc', pitanja: 'plain', utisci: 'white', zakazivanje: 'white', kontakt: 'plain' },
    fonts: 'family=Archivo:wdth,wght@62..125,400..800&family=Instrument+Sans:wght@400;500;600',
    css: `:root{--bg:${p.bg};--ink:${p.ink};--muted:${p.muted};--line:${p.line};--acc:${p.acc};--accInk:${p.accInk};--acc2:${mix(p.acc, p.ink, .45)};--fd:'Archivo',sans-serif;--fb:'Instrument Sans',system-ui,sans-serif;--hw:600;--r-img:10px;--r-in:8px;--field:#fff}
h1,h2,h3,.brand,.phones a,.facts dt,.pr-v,.col-badge b{font-stretch:116%}
.sec{padding:clamp(52px,6vw,88px) 0}
.top{background:${rgba('#ffffff', .55)};border-bottom:1px solid ${rgba(p.ink, .06)}}
.hero-split{background-color:${p.bg};background-image:${grid};border-bottom:1px solid ${rgba(p.ink, .08)}}
.hero-in{display:flex;flex-wrap:wrap;gap:40px 64px;align-items:center;padding-top:clamp(28px,4vw,64px);padding-bottom:clamp(40px,5vw,80px)}
.hero-text{flex:1 1 420px;display:flex;flex-direction:column;gap:22px}
.hero-split h1{font-size:clamp(40px,5.2vw,70px)}
.hero-hours{margin:0;display:inline-flex;align-self:flex-start;gap:10px;align-items:center;padding:10px 14px;border-radius:8px;background:#fff;border:1px solid ${p.line};font-size:15px}
.hero-hours::before{content:'';width:8px;height:8px;border-radius:50%;background:#2fa36b;box-shadow:0 0 0 4px ${rgba('#2fa36b', .18)}}
.hero-fig{flex:1.15 1 460px;margin:0 0 28px;min-width:0}
.col-main{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:12px;background:#0b0f13;box-shadow:0 24px 60px ${rgba(p.ink, .18)}}
.col-s{position:absolute;object-fit:cover;border-radius:10px;border:5px solid #fff;box-shadow:0 14px 34px ${rgba(p.ink, .2)}}
.col-s1{width:38%;aspect-ratio:4/3;left:-7%;bottom:-28px}
.col-s2{width:30%;aspect-ratio:1;right:-4%;top:-26px}
.col-badge{right:16px;bottom:16px;background:${p.acc};color:${p.accInk}}
.has-col .col-badge{right:auto;left:36%;bottom:-22px;max-width:300px}
.col-badge .ic{width:40px;height:40px;border-radius:10px;background:${rgba(p.accInk, .1)}}
.hero-fig figcaption{position:absolute;left:12px;top:12px;font-size:13px;padding:6px 10px;border-radius:6px;background:${rgba(p.dark, .72)};color:#fff}
.tone-white{background:#fff}
.tone-dark{background:${p.dark};color:#eef3f6;--ink:#eef3f6;--muted:${rgba('#eef3f6', .7)};--line:${rgba('#ffffff', .14)};--field:${rgba('#ffffff', .06)};--acc2:${p.acc}}
.tone-acc{background:${p.acc};color:${p.accInk};--ink:${p.accInk};--muted:${rgba(p.accInk, .8)};--line:${rgba(p.accInk, .2)};--acc:${p.accInk};--accInk:${p.acc};--acc2:${p.accInk}}
.tone-dark .box-shape i{border-color:${p.acc}}
.facts dt{font-weight:600}
.facts div{padding-left:18px;border-left:3px solid ${p.acc}}
.facts .ic{display:none}
.cards{grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
.card{padding:22px;border-radius:12px;background:#fff;border:1px solid ${p.line};transition:transform .2s ease,box-shadow .2s ease}
.tone-white .card{background:${mix(p.bg, '#ffffff', .55)}}
.card:hover{transform:translateY(-2px);box-shadow:0 14px 30px ${rgba(p.ink, .08)}}
.card .ic{width:46px;height:46px;border-radius:10px;background:${rgba(p.acc, .28)};color:${p.ink}}
.pr-v{font-family:var(--fd);font-weight:600}
.duo-img{align-items:center}
.duo-img .sp-img{flex:1 1 420px;width:100%;max-height:none;aspect-ratio:4/3;order:2}
.duo-img .duo-h,.duo-img .duo-b{flex:1 1 360px}
.boxes{border-top:1px solid var(--line);padding-top:32px}
.steps{position:relative}
.steps li{padding:22px;border-radius:12px;background:#fff;border:1px solid ${p.line}}
.steps .ic{width:46px;height:46px;border-radius:50%;background:${p.dark};color:${p.acc}}
.gal{grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:190px;gap:12px}
.gal img{height:100%;aspect-ratio:auto}
.gal figure{position:relative}.gal a{height:100%}
.gal figcaption{position:absolute;left:10px;bottom:10px;padding:4px 9px;border-radius:6px;background:${rgba(p.dark, .72)};color:#fff;font-size:12px}
.gal-5 figure:first-child,.gal-4 figure:first-child{grid-column:span 2;grid-row:span 2}
.gal-3 figure:first-child{grid-column:span 2}
.quotes blockquote{font-size:19px;font-weight:500;padding:24px;border-radius:12px;background:${mix(p.bg, '#ffffff', .5)};border:1px solid ${p.line}}
.faq summary{font-family:var(--fd);font-stretch:108%}
.dock{--dockBg:#fff}
@media (max-width:820px){.gal{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:150px}.col-s1{left:-2%}.col-s2{right:-2%}.has-col .col-badge{left:auto;right:8px}}`,
  };
};
