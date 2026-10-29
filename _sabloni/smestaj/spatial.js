// Spatial: photo "environment" with floating windows, layered depth, pill nav. Default: mineral grey / verdigris / Cormorant.
const { rgba, mix } = require('../boje');

const DEFAULT = { bg: '#e7ecea', ink: '#16201e', muted: '#4a5654', acc: '#3f7a6e', dark: '#16201e', soft: '#a9d4c8' };

module.exports = function spatial(o = {}) {
  const p = { ...DEFAULT, ...o };
  const sh = (a) => `inset 0 1px 0 rgba(255,255,255,.9),0 ${30 + a}px ${60 + a}px -30px ${rgba(p.dark, .42)},0 10px 20px -12px ${rgba(p.dark, .2)}`;
  return {
    key: 'spatial', hero: 'prozori', units: 'kartice',
    fonts: 'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500',
    css: `:root{--bg:${p.bg};--ink:${p.ink};--acc:${p.acc};--acc-fg:#fff;--fd:'Cormorant Garamond',serif;--fb:'Jost',system-ui,sans-serif;--hw:300;--ht:-.015em;--dock-bg:${p.dark}}
body{font-weight:300}
b,strong{font-weight:500}
.top{position:absolute;left:0;right:0;top:22px}
.top-in{max-width:1180px;margin:0 auto;padding:8px 8px 8px 26px;border-radius:999px;background:${rgba('#ffffff', .74)};-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);box-shadow:0 18px 40px -18px ${rgba(p.dark, .45)};width:calc(100% - 40px)}
.brand{font-weight:500;font-size:26px}
.nav a{padding:8px 4px}
.btn{border-radius:999px}
.btn-call{background:${p.dark};color:#fff}
.btn-main{background:${p.dark};color:#fff;box-shadow:0 14px 28px -12px ${rgba(p.dark, .6)}}.btn-main:hover{background:${p.acc}}
.btn-alt{background:#fff;color:${p.ink};box-shadow:0 8px 20px -10px ${rgba(p.dark, .4)}}
.hero-win{padding:12px}
.env{position:relative;min-height:min(92svh,900px);border-radius:40px;overflow:hidden;background:${mix(p.bg, p.dark, .3)};display:flex;align-items:flex-end}
.hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.env::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,${rgba(p.dark, .45)},transparent 60%)}
.hero-in{position:relative;z-index:1;width:100%;display:flex;flex-wrap:wrap;gap:22px;align-items:flex-end;padding-top:130px;padding-bottom:44px}
.win{border-radius:36px;-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px)}
.win-main{flex:1 1 560px;max-width:700px;padding:clamp(26px,4vw,50px);background:${rgba('#fbfcfb', .88)};box-shadow:${sh(20)}}
.win-side{flex:0 1 300px;padding:28px;background:${rgba(p.dark, .8)};color:#e9efed;margin-bottom:clamp(0px,5vw,70px);box-shadow:0 40px 70px -30px ${rgba(p.dark, .7)}}
.win-side .big{font-family:var(--fd);font-weight:300;font-size:64px;line-height:.9;color:${p.soft}}
.win-side p{margin:8px 0 18px;color:#c3cfcb}.win-side p:last-child{margin-bottom:0}
.hero h1{font-size:clamp(46px,6.4vw,94px);line-height:.98}
.kicker{color:${p.acc};font-weight:400}
.lead{margin-top:18px;color:${p.muted}}
.hero-rating{color:${p.muted}}.hero-rating svg{color:${p.acc}}
.upit-wrap{padding:0 20px;margin-top:28px}
.upit{max-width:1180px;background:#fff;border-radius:32px;box-shadow:${sh(10)};padding:28px}
.upit input{border:1px solid ${mix(p.bg, p.dark, .15)};border-radius:16px;background:${mix(p.bg, '#fff', .6)}}
.upit-note,.sec-head p,.unit-body p,.price-note,.extra-body p,.near span,.dist dd,.checkin{color:${p.muted}}
h2{font-size:clamp(40px,5.4vw,76px)}
.unit-card,.extra{background:#fff;border-radius:32px;box-shadow:${sh(10)}}
.unit-img,.extra-img{border-radius:24px;margin:10px 10px 0;width:calc(100% - 20px)}
.unit-body h3,.extra-body h3{font-weight:500;font-size:30px}
.unit-meta{color:${p.acc};font-weight:400}
@media (min-width:900px){.units-kartice .unit-card:nth-child(even){transform:translateY(40px)}.units-kartice{padding-bottom:40px}}
.amen{display:flex;flex-wrap:wrap;gap:10px;padding:14px;border-radius:34px;background:${rgba('#ffffff', .6)};box-shadow:0 24px 50px -28px ${rgba(p.dark, .45)};align-content:flex-start}
.amen li{padding:12px 20px;border-radius:999px;background:#fff;box-shadow:0 4px 12px -6px ${rgba(p.dark, .3)}}
.gal{perspective:1400px}
.gal a{border-radius:28px;box-shadow:0 30px 50px -30px ${rgba(p.dark, .55)}}
@media (min-width:900px){.gal a:nth-child(4n+2){transform:rotateY(-7deg)}.gal a:nth-child(4n+3){transform:rotateY(7deg)}}
.dist dt{color:${p.acc}}
.near{gap:14px}
.near li{background:#fff;border-radius:24px;padding:22px 24px;box-shadow:0 20px 40px -26px ${rgba(p.dark, .4)}}
.near b{font-weight:500;font-size:28px}
.place img{border-radius:36px}
.rating-in{background:${p.dark};color:#e9efed;border-radius:36px;padding:clamp(28px,4vw,48px);box-shadow:0 40px 70px -30px ${rgba(p.dark, .6)}}
.rating-num{color:${p.soft};font-weight:300}
.rating-in .btn-alt{background:${p.soft};color:${p.dark}}
.contact-text{background:${p.dark};color:#e9efed;border-radius:36px;padding:clamp(26px,4vw,44px);box-shadow:0 40px 70px -30px ${rgba(p.dark, .6)}}
.contact-text h2,.phones a{color:#fff}
.contact-text .addr,.contact-text .checkin{color:#b5c2be}
.mail{color:${p.soft}}
.contact-text .btn-main{background:${p.soft};color:${p.dark}}
.map{border-radius:36px;box-shadow:inset 0 2px 10px ${rgba(p.dark, .15)},0 30px 60px -34px ${rgba(p.dark, .5)}}
.foot{color:${p.muted}}
@media (max-width:820px){.top{top:12px}.top-in{width:calc(100% - 24px);padding-left:20px}.env{border-radius:28px}.hero-in{padding-top:110px}}`,
  };
};
