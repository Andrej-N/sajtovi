// Neumorfizam: soft raised and pressed surfaces on one ground color, solid accent buttons for contrast. Default: lilac grey / aubergine.
const { mix } = require('../boje');

const DEFAULT = { bg: '#e4dfe8', ink: '#2a1d33', muted: '#5a4c63', acc: '#4a2457' };

module.exports = function neumorf(o = {}) {
  const p = { ...DEFAULT, ...o };
  const d = mix(p.bg, '#000', .14), l = mix(p.bg, '#fff', .75);
  const up = (n) => `box-shadow:${n}px ${n}px ${n * 2.4}px ${d},-${n}px -${n}px ${n * 2.4}px ${l}`;
  const down = (n) => `box-shadow:inset ${n}px ${n}px ${n * 2}px ${d},inset -${n}px -${n}px ${n * 2}px ${l}`;
  return {
    key: 'neumorf', hero: 'split', units: 'kartice',
    fonts: 'family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600',
    css: `:root{--bg:${p.bg};--ink:${p.ink};--acc:${p.acc};--acc-fg:#fff;--fd:'Bricolage Grotesque',sans-serif;--fb:'DM Sans',system-ui,sans-serif;--hw:800;--ht:-.04em;--dock-bg:${p.ink}}
.top-in{max-width:1200px;margin:20px auto 0;width:calc(100% - 40px);padding:12px 12px 12px 26px;border-radius:26px;${up(10)}}
.brand{font-weight:800;letter-spacing:-.03em;font-size:24px}
.nav a{color:${p.muted}}
.btn{border-radius:18px}
.btn-call{color:${p.acc};background:${p.bg};${down(4)}}
.btn-main{background:${p.acc};color:#fff;${up(8)}}.btn-main:hover{background:${mix(p.acc, '#000', .2)}}
.btn-alt{background:${p.bg};color:${p.ink};${up(8)}}
.hero-split .hero-in{display:flex;flex-wrap:wrap;gap:44px 56px;align-items:center;padding-top:clamp(40px,6vw,88px);padding-bottom:clamp(40px,6vw,80px)}
.hero-text{flex:1 1 440px}
.hero h1{font-size:clamp(50px,7vw,100px);line-height:.92}
.kicker{color:${p.muted};font-weight:500}
.lead{margin-top:22px;color:${p.muted}}
.hero-media{flex:1 1 420px;padding:18px;border-radius:36px}
.raised{${up(14)}}
.well{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:24px}
.hero-media .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:12px;margin-top:16px}
.hero-media .facts div{padding:14px 10px;border-radius:18px;text-align:center;${down(4)}}
.facts dt{font-size:26px;font-weight:800;letter-spacing:-.03em}.facts dd{color:${p.muted};font-size:13px;margin-top:4px}
.upit-wrap{padding:0 20px}
.upit{max-width:1200px;border-radius:32px;padding:28px;${up(12)}}
.upit-title{font-weight:800;letter-spacing:-.03em}
.upit label{font-weight:600}
.upit input{border:0;border-radius:16px;background:${p.bg};color:${p.ink};${down(5)}}
.upit-note,.sec-head p,.unit-body p,.price-note,.extra-body p,.near span,.dist dd,.checkin,.unit-meta,.addr{color:${p.muted}}
.unit-card,.extra{border-radius:28px;padding:12px;${up(10)}}
.unit-img,.extra-img{border-radius:20px;${down(3)}}
.unit-body,.extra-body{padding:18px 12px 12px}
.unit-body h3,.extra-body h3{font-size:24px;font-weight:700;letter-spacing:-.02em}
.amen{display:flex;flex-wrap:wrap;gap:12px;padding:14px;border-radius:30px;align-content:flex-start;${down(8)}}
.amen li{padding:12px 18px;border-radius:16px;background:${p.bg};${up(5)}}
.gal{gap:16px}
.gal a{border-radius:22px;padding:8px;${up(8)}}.gal img{border-radius:16px}
.dist div{padding:16px 22px;border-radius:20px;${down(5)}}
.dist dt{color:${p.acc};font-weight:800}
.near{gap:16px}
.near li{padding:20px 22px;border-radius:22px;${up(8)}}.near b{font-weight:700;font-size:22px;letter-spacing:-.02em}
.place{padding:12px;border-radius:30px;${up(10)}}.place img{border-radius:22px}
.rating-in{border-radius:34px;padding:clamp(26px,4vw,48px);${up(14)}}
.rating-num{color:${p.acc};font-weight:800;letter-spacing:-.05em}
.contact-in{border-radius:36px;padding:clamp(22px,4vw,44px);${up(14)}}
.phones a{font-weight:800;letter-spacing:-.03em}
.mail{color:${p.acc};font-weight:600}
.map{border-radius:26px;padding:10px;${down(6)}}.map iframe{border-radius:18px}
.foot{color:${p.muted}}
@media (max-width:820px){.top-in{width:calc(100% - 24px)}}`,
  };
};
