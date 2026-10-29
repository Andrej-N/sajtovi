// Spatial. Default: petrol #08343c / mist #e4eeec / process magenta #e0007a. Recolor with spatial(palette).
const { esc } = require('../shared');
const { rgba, mix } = require('../boje');
const baza = require('./baza');

const DEFAULT = {
  dark: '#08343c', bg: '#e4eeec', acc: '#e0007a', surf: '#fff', surf2: '#d3e3e0', muted: '#3d5f66', darkSoft: '#9fc4c0', accSoft: '#ff6fb7', accInk: '#c2006a', sheetLine: '#cfdfdc', accFg: '#fff',
  fonts: 'family=Instrument+Sans:wght@400;500;600;700&family=Martian+Mono:wght@400;500', fd: "'Instrument Sans',system-ui,sans-serif", fb: "'Instrument Sans',system-ui,sans-serif", fm: "'Martian Mono',monospace", hw: 700, ht: '-.04em',
};
const derive = (p) => ({
  surf: '#fff', surf2: mix(p.bg, p.dark, .08), muted: mix(p.dark, p.bg, .3), darkSoft: mix(p.dark, '#fff', .6),
  accSoft: mix(p.acc, '#fff', .45), accInk: mix(p.acc, '#000', .13), sheetLine: mix(p.bg, p.dark, .1), accFg: '#fff',
});

module.exports = function spatial(o = {}) {
  const p = o.dark ? { ...DEFAULT, ...derive(o), ...o } : { ...DEFAULT, ...o };
  const deep = `0 60px 90px -40px ${rgba(p.dark, .45)},0 2px 0 rgba(255,255,255,.6) inset`;

  const css = baza + `
:root{--bg:${p.bg};--fg:${p.dark};--muted:${p.muted};--surface:${p.surf};--surface-2:${p.surf2};--line:${rgba(p.dark, .14)};--accent:${p.acc};--accent-fg:${p.accFg};--accent-2:${p.dark};--accent-2-fg:${p.bg};--accent-ink:${p.accInk};--r:40px;--r-sm:999px;--font-d:${p.fd};--font-b:${p.fb};--hw:${p.hw};--ht:${p.ht};--star:${p.acc}}
body{--card-sh:${deep};--card-bg:${p.surf}}
h3{font-weight:600;letter-spacing:-.02em}
.kicker,.crumbs,.step-n,.why-n,.foot-col h3,.tag{font-family:${p.fm};letter-spacing:.02em;text-transform:uppercase;font-weight:500;font-size:12px}
.site-head{padding-top:16px}
.head-in{max-width:980px;min-height:64px;padding:0 8px 0 10px;border-radius:999px;background:${rgba(p.dark, .94)};color:${p.bg};box-shadow:0 30px 60px -20px ${rgba(p.dark, .55)};gap:12px}
.brand{background:${p.bg};color:${p.dark};border-radius:999px;padding:6px 16px 6px 6px}
.brand .logo-chip{padding:2px 6px}
.mono{background:${p.acc};color:${p.accFg};border-radius:12px;width:36px;height:36px}
.menu a[aria-current]{background:${rgba(p.bg, .16)}}
.head-cta{min-height:48px}
.mnav summary{background:${rgba(p.bg, .12)};border:0;color:${p.bg}}
.mnav nav{color:${p.dark}}
.btn-primary{box-shadow:0 24px 40px -16px ${rgba(p.acc, .6)}}
.btn-ghost{border:0;box-shadow:0 24px 40px -18px ${rgba(p.dark, .35)}}
.svc-card,.fact,.step,.loc-card,.faq-list details,.form,.chips a,.why-item{box-shadow:${deep};border:0;background:${p.surf}}
.svc-grid{perspective:1400px}
.svc-card{transform-style:preserve-3d}
.svc-card:hover{transform:translateY(-6px) rotateX(4deg)}
.svc-main{background:${p.dark};color:${p.bg}}.svc-main p{color:${p.darkSoft}}.svc-main .more{color:${p.accSoft}}
.svc-main .icon-box{background:${p.acc};color:${p.accFg}}
.fact:first-child{background:${p.dark};color:${p.bg}}.fact:first-child span{color:${p.darkSoft}}
.photo{box-shadow:0 80px 110px -50px ${rgba(p.dark, .6)}}
.illu{background:${p.dark};color:${p.bg};box-shadow:0 80px 110px -50px ${rgba(p.dark, .6)}}
.illu::before{content:'';position:absolute;right:12%;top:14%;width:34%;height:46%;border-radius:22px;background:${p.acc};transform:rotate(12deg);opacity:.95}
.illu::after{content:'';position:absolute;left:10%;bottom:12%;width:30%;height:40%;border-radius:20px;background:#fff;transform:rotate(-8deg);opacity:.12}
.illu > *{position:relative;z-index:1}
.steps{perspective:1400px}
.step:nth-child(1){transform:rotateY(7deg)}.step:nth-child(3){transform:rotateY(-7deg);background:${p.dark};color:${p.bg}}.step:nth-child(3) p{color:${p.darkSoft}}
.step .icon-box{background:${p.acc};color:${p.accFg}}
.rating-in{background:${p.dark};color:${p.bg};box-shadow:${deep}}.rating-in .lead{color:${p.darkSoft}}
.cta-in{background:${p.dark};color:${p.bg};box-shadow:${deep}}
.cta-in .btn-primary{background:${p.acc}}
.cta-in .btn-ghost{background:${rgba(p.bg, .12)};color:${p.bg};box-shadow:none}
.site-foot{background:${p.dark};color:${p.bg};border-radius:48px 48px 0 0}
.site-foot .foot-brand p,.site-foot .foot-note,.site-foot .foot-col h3{color:${p.darkSoft}}
.site-foot .foot-note{border-color:${rgba(p.bg, .15)}}
.site-foot .brand{background:${p.bg}}
/* hero art */
.ha{position:absolute;inset:0;perspective:1600px;perspective-origin:30% 40%}
.ha > *{position:absolute}
.ha-photo{left:6%;top:20px;width:78%;height:400px;transform:rotateY(-16deg) rotateX(4deg) translateZ(-40px);border-radius:36px}
.ha-sheet{right:0;top:250px;width:190px;height:250px;border-radius:24px;background:#fff;transform:rotateY(-24deg) translateZ(80px);box-shadow:${deep};padding:20px;display:flex;flex-direction:column;gap:10px}
.ha-sheet i{display:block;height:8px;border-radius:6px;background:${p.sheetLine}}
.ha-sheet strong{margin-top:auto;font-size:52px;letter-spacing:-.05em;line-height:1}
.ha-card{left:0;bottom:10px;width:220px;height:126px;border-radius:20px;background:${p.acc};color:${p.accFg};transform:rotateY(14deg) translateZ(140px);box-shadow:0 50px 70px -24px ${rgba(p.acc, .55)};padding:18px;display:flex;flex-direction:column;justify-content:space-between}
.ha-card small{font-family:${p.fm};font-size:11px}
.ha-shadow{left:12%;right:4%;bottom:-20px;height:40px;border-radius:50%;background:${rgba(p.dark, .14)}}
@media (max-width:1000px){.head-in{border-radius:28px}.ha-photo{width:90%;height:320px}.ha-sheet{top:200px;width:150px;height:200px}}
@media (max-width:640px){.ha-photo{left:0;width:100%;height:260px;transform:none}.ha-sheet{top:180px;width:130px;height:170px;right:6px}.ha-card{width:180px;height:104px}.step:nth-child(n){transform:none}}
${p.css || ""}`;

  return {
    fonts: p.fonts,
    css,
    svcGrid: [3, 1],
    heroArt(b, ctx) {
      const [f1] = b.sheets || ['A4'];
      return `<div class="ha">
<span class="ha-shadow" aria-hidden="true"></span>
${b.heroImg ? `<figure class="photo ha-photo"><img src="${ctx.root}${b.heroImg.src}" alt="${esc(b.heroImg.alt)}"></figure>` : ''}
<div class="ha-sheet" aria-hidden="true"><small style="font-family:${p.fm.replace(/"/g, '')};font-size:11px">${esc(f1)}</small><i style="width:70%;background:${p.dark}"></i><i></i><i style="width:85%"></i><strong>${esc(f1.split(' ')[0])}</strong></div>
<div class="ha-card" aria-hidden="true"><strong>${esc(b.short || b.name)}</strong><small>vizit karta · 85 × 55</small></div>
</div>`;
    },
  };
};
