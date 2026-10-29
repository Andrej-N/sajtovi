// Tamni premium: full-bleed photo, huge Bodoni name, brass details, numbered unit rows. Default: forest black / brass.
const { rgba } = require('../boje');

const DEFAULT = { bg: '#0f1713', surf: '#16211b', ink: '#e6e3db', head: '#ffffff', muted: '#a7a49b', line: '#2a3630', acc: '#c2a26b' };

module.exports = function tamni(o = {}) {
  const p = { ...DEFAULT, ...o };
  return {
    key: 'tamni', hero: 'full', units: 'redovi',
    fonts: 'family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400&family=Hanken+Grotesk:wght@300;400;500;600',
    css: `:root{--bg:${p.bg};--ink:${p.ink};--acc:${p.acc};--acc-fg:${p.bg};--fd:'Bodoni Moda',serif;--fb:'Hanken Grotesk',system-ui,sans-serif;--ht:-.03em;--dock-bg:${p.surf}}
body{font-weight:300}
h1,h2,h3{color:${p.head}}
b,strong{font-weight:500}
.top{position:absolute;left:0;right:0;top:0}
.brand{color:#fff;font-weight:500;font-size:24px}
.nav a{color:${rgba('#ffffff', .78)}}.nav a:hover{color:#fff}
.btn-call{border:1px solid ${p.acc};color:#fff;background:${rgba(p.bg, .25)}}
.btn-main{background:${p.acc};color:${p.bg}}.btn-main:hover{background:#fff}
.btn-alt{background:transparent;color:#fff;border:1px solid ${rgba('#ffffff', .35)}}.btn-alt:hover{border-color:#fff}
.hero-full{position:relative;min-height:min(100svh,920px);display:flex;align-items:flex-end;background:${p.surf}}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero-shade{position:absolute;inset:0;background:linear-gradient(to top,${p.bg} 4%,${rgba(p.bg, .55)} 45%,${rgba(p.bg, .15)} 75%,${rgba(p.bg, .45)})}
.hero-in{position:relative;width:100%;padding-top:140px;padding-bottom:64px}
.hero h1{font-size:clamp(56px,10.5vw,156px);line-height:.9;letter-spacing:-.035em;max-width:11ch}
.kicker{color:${p.acc};font-weight:400}
.hero-row{display:flex;flex-wrap:wrap;gap:28px 56px;align-items:flex-end;justify-content:space-between;margin-top:34px}
.lead{color:${rgba('#ffffff', .82)}}
.facts dt{color:#fff}.facts dd{color:${p.muted}}
.hero-rating{color:${p.muted}}.hero-rating svg{color:${p.acc}}.hero-rating b{color:#fff;font-size:18px}
.upit-wrap{border-top:1px solid ${p.line};border-bottom:1px solid ${p.line}}
.upit-title{color:#fff}
.upit label{color:${p.muted}}
.upit input{background:transparent;border:0;border-bottom:1px solid ${rgba('#ffffff', .25)};color:#fff;padding-left:0;color-scheme:dark}
.upit-note{color:${p.muted}}
.sec-head p,.unit-row p,.price-note,.extra-body p,.near span,.dist dd,.checkin,.addr{color:${p.muted}}
.units-redovi{border-bottom:1px solid ${p.line}}
.unit-row{border-top:1px solid ${p.line}}
.unit-n{color:${p.acc}}
.unit-row h3{color:#fff}
.unit-card{background:${p.surf}}
.sec-alt{background:${p.surf}}
.amen li{border-top:1px solid ${p.line};font-size:18px}
.extra{background:${p.surf}}
.sec-alt .extra{background:${p.bg}}
.gal{gap:10px}
.dist dt{color:${p.acc}}
.near li{border-top:1px solid ${p.line}}.near b{color:#fff}
.rating-band{background:${p.surf}}
.rating-num{color:${p.acc}}.rating-t{color:#fff}
.phones a{color:#fff}
.mail{color:${p.acc}}
.map{background:${p.surf}}.map iframe{filter:grayscale(.5) contrast(1.05)}
.foot{border-top:1px solid ${p.line};color:${p.muted}}.foot a{color:${p.ink}}
@media (max-width:820px){.hero-in{padding-top:110px}}`,
  };
};
