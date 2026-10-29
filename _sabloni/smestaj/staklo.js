// Staklo (glassmorphism): one photo fixed behind the whole page, all content on frosted glass. Default: forest / Instrument Serif.
const { rgba } = require('../boje');

const DEFAULT = { bg: '#10261f', ink: '#f1f5f2', muted: '#cfe2d6', acc: '#ffffff', dark: '#10261f', tint: '#0c1d17' };

module.exports = function staklo(o = {}) {
  const p = { ...DEFAULT, ...o };
  const glass = `background:${rgba('#ffffff', .12)};-webkit-backdrop-filter:blur(22px) saturate(150%);backdrop-filter:blur(22px) saturate(150%);border:1px solid ${rgba('#ffffff', .22)}`;
  return {
    key: 'staklo', hero: 'staklo', units: 'kartice',
    fonts: 'family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600',
    css: `:root{--bg:${p.bg};--ink:${p.ink};--acc:${p.acc};--acc-fg:${p.dark};--fd:'Instrument Serif',serif;--fb:'Instrument Sans',system-ui,sans-serif;--ht:-.015em;--dock-bg:${rgba(p.tint, .85)}}
.bgfix{position:fixed;inset:0;z-index:-2;background-size:cover;background-position:center}
.bgfix::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,${rgba(p.tint, .55)},${rgba(p.tint, .35)} 40%,${rgba(p.tint, .7)})}
h1,h2,h3{color:#fff}
.glass,.top-in,.upit,.unit-card,.extra,.near li,.amen li,.gal a,.rating-in,.facts div{${glass}}
.top-in{max-width:1200px;margin:16px auto 0;width:calc(100% - 40px);padding:12px 12px 12px 24px;border-radius:22px}
.brand{color:#fff;font-size:30px}
.nav a{color:${p.muted}}.nav a:hover{color:#fff}
.btn{border-radius:16px}
.btn-call{background:#fff;color:${p.dark}}
.btn-main{background:#fff;color:${p.dark}}.btn-main:hover{background:${p.muted}}
.btn-alt{${glass};color:#fff}
.hero-glass .hero-in{padding-top:clamp(90px,14vw,200px);padding-bottom:40px}
.hero-card{max-width:780px;border-radius:32px;padding:clamp(26px,4.4vw,56px);box-shadow:0 30px 80px -30px rgba(0,0,0,.55)}
.hero h1{font-size:clamp(48px,7vw,98px);line-height:.96}
.kicker{color:${p.muted}}
.lead{margin-top:20px;color:${rgba('#ffffff', .86)}}
.hero-rating{color:#fff}.hero-rating.chip{padding:10px 16px;border-radius:14px;${glass}}
.facts{margin-top:18px;gap:12px}
.facts div{border-radius:20px;padding:16px 22px}
.facts dt{color:#fff}.facts dd{color:${p.muted}}
.upit-wrap{padding:0 20px}
.upit{max-width:1200px;border-radius:28px;padding:26px}
.upit-title{color:#fff}
.upit label{color:${p.muted}}
.upit input{border-radius:14px;border:1px solid ${rgba('#ffffff', .25)};background:${rgba('#ffffff', .1)};color:#fff;color-scheme:dark}
.upit input::placeholder{color:${rgba('#ffffff', .55)}}
.upit-note,.sec-head p,.unit-body p,.price-note,.extra-body p,.near span,.dist dd,.checkin,.unit-meta{color:${p.muted}}
.sec{padding:clamp(48px,7vw,96px) 0}
h2{font-size:clamp(40px,5vw,66px)}
.unit-card,.extra{border-radius:26px;padding:10px}
.unit-img,.extra-img{border-radius:18px}
.unit-body,.extra-body{padding:18px 14px 14px}
.unit-body h3,.extra-body h3{font-size:30px}
.amen{display:flex;flex-wrap:wrap;gap:10px;align-content:flex-start}
.amen li{padding:12px 18px;border-radius:16px}
.gal a{border-radius:20px;padding:6px}.gal img{border-radius:15px}
.dist dt{color:#fff}
.near{gap:12px}
.near li{border-radius:22px;padding:20px 22px}.near b{color:#fff;font-size:28px}
.place img{border-radius:28px}
.rating-in{border-radius:30px;padding:clamp(26px,4vw,48px)}
.rating-num{color:#fff}.rating-t{color:#fff}
.contact-in{background:${rgba('#ffffff', .92)};color:${p.dark};border-radius:32px;padding:clamp(24px,4vw,52px);box-shadow:0 30px 80px -30px rgba(0,0,0,.6)}
.contact h2,.phones a{color:${p.dark}}
.contact .addr,.contact .checkin{color:${p.dark};opacity:.8}
.mail{color:${p.dark};font-weight:500}
.contact .btn-main{background:${p.dark};color:#fff}
.contact .btn-alt{background:transparent;border:1px solid ${rgba(p.dark, .3)};color:${p.dark};-webkit-backdrop-filter:none;backdrop-filter:none}
.map{border-radius:24px}
.foot{color:${p.muted}}.foot a{color:#fff}
@media (max-width:820px){.top-in{width:calc(100% - 24px)}}`,
  };
};
