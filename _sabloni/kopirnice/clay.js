// Claymorphism. Default: black #030407 / cobalt #1558c9 / acid lime #d4ff24. Recolor with clay(palette).
const { esc, showRating } = require('../shared');
const { rgba, mix } = require('../boje');
const ic = require('../ikone');
const baza = require('./baza');

const DEFAULT = {
  dark: '#030407', pri: '#1558c9', acc: '#d4ff24', bg: '#dfe6f3', surf: '#f4f7fc', surf2: '#e6edf8', muted: '#3a4152',
  priFg: '#fff', priSoft: '#dce7ff', darkSoft: '#b9c0cf', darkSoft2: '#9aa3b5', paperLine: '#c9d4e8', dark2: '#1a1d24', dark3: '#2c313c',
  priDeep: 'rgba(5,30,90,.5)', accSh: 'rgba(120,150,0,.26)', accSh2: 'rgba(90,110,0,.30)',
  fonts: 'family=Unbounded:wght@500;700;800&family=Onest:wght@400;500;600', fd: "'Unbounded',sans-serif", fb: "'Onest',system-ui,sans-serif", hw: 800, ht: '-.035em',
};
const derive = (p) => ({
  surf: mix(p.bg, '#fff', .7), surf2: mix(p.bg, '#fff', .3), muted: mix(p.dark, p.bg, .25), priFg: '#fff',
  priSoft: mix(p.pri, '#fff', .85), darkSoft: mix(p.dark, '#fff', .72), darkSoft2: mix(p.dark, '#fff', .6), paperLine: mix(p.bg, p.pri, .15),
  dark2: mix(p.dark, '#fff', .08), dark3: mix(p.dark, '#fff', .17),
  priDeep: rgba(mix(p.pri, '#000', .6), .5), accSh: rgba(mix(p.acc, '#000', .45), .26), accSh2: rgba(mix(p.acc, '#000', .55), .3),
});

module.exports = function clay(o = {}) {
  const p = o.pri ? { ...DEFAULT, ...derive(o), ...o } : { ...DEFAULT, ...o };
  const clayL = `0 20px 34px ${rgba(p.pri, .14)},inset 0 -10px 18px ${rgba(p.pri, .10)},inset 0 10px 14px #fff`;
  const clayB = `0 26px 44px ${rgba(p.pri, .35)},inset 0 -16px 26px ${p.priDeep},inset 0 14px 20px rgba(255,255,255,.25)`;
  const clayG = `0 20px 34px ${p.accSh},inset 0 -10px 18px ${p.accSh2},inset 0 10px 14px rgba(255,255,255,.65)`;
  const clayK = `0 20px 34px ${rgba(p.dark, .3)},inset 0 -10px 18px rgba(0,0,0,.6),inset 0 10px 14px rgba(255,255,255,.12)`;

  const css = baza + `
:root{--bg:${p.bg};--fg:${p.dark};--muted:${p.muted};--surface:${p.surf};--surface-2:${p.surf2};--line:${rgba(p.pri, .16)};--accent:${p.pri};--accent-fg:${p.priFg};--accent-2:${p.acc};--accent-2-fg:${p.dark};--r:36px;--r-sm:22px;--font-d:${p.fd};--font-b:${p.fb};--hw:${p.hw};--ht:${p.ht};--star:${p.pri}${p.priInk ? `;--accent-ink:${p.priInk}` : ''}}
body{--card-sh:${clayL}}
h3{font-weight:700;letter-spacing:-.015em;font-size:20px}
.site-head{background:${rgba(p.bg, .82)};-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
.mono{background:${p.dark};color:${p.acc};box-shadow:${clayK};border-radius:16px}
.btn-primary{box-shadow:${clayB}}
.btn-ghost{border:0;box-shadow:${clayL}}
.menu a[aria-current]{background:${p.surf};box-shadow:${clayL}}
.icon-box{box-shadow:${clayG};border-radius:18px}
.svc-card,.fact,.step,.loc-card,.faq-list details,.form,.why-item,.chips a,.mnav nav{box-shadow:${clayL};border:0}
.why-item{background:var(--surface)}
.fact:nth-child(2){background:${p.acc};box-shadow:${clayG}}
.fact:nth-child(3){background:${p.dark};color:#fff;box-shadow:${clayK}}.fact:nth-child(3) span{color:${p.darkSoft}}
.fact:nth-child(4){background:${p.pri};color:${p.priFg};box-shadow:${clayB}}.fact:nth-child(4) span{color:${p.priSoft}}
.svc-grid{grid-template-columns:repeat(4,minmax(0,1fr))}
.svc-main{grid-column:span 2;grid-row:span 2;background:${p.pri};color:${p.priFg};box-shadow:${clayB};padding:40px;justify-content:flex-end}
.svc-main h3{font-size:clamp(28px,3vw,40px);letter-spacing:-.03em}
.svc-main p{color:${p.priSoft};font-size:18px}
.svc-main .more{color:${p.acc}}
.svc-main .icon-box{width:72px;height:72px;margin-bottom:auto}.svc-main .icon-box svg{width:36px;height:36px}
.svc-card:nth-child(4n+3):not(.svc-main){background:${p.dark};color:#fff;box-shadow:${clayK}}
.svc-card:nth-child(4n+3):not(.svc-main) p{color:${p.darkSoft}}
.svc-card:nth-child(4n+3):not(.svc-main) .more{color:${p.acc}}
.photo{border:10px solid ${p.surf};box-shadow:${clayL}}
.illu{box-shadow:${clayG}}
.illu::before{content:'';position:absolute;width:62%;aspect-ratio:1;border-radius:50%;background:${p.surf};box-shadow:${clayL};z-index:0}
.illu > *{position:relative;z-index:1}
.illu-icon{color:${p.pri}}
.step:nth-child(3){background:${p.acc};box-shadow:${clayG}}
.step .icon-box{background:${p.pri};color:${p.priFg};box-shadow:${clayB}}
.rating-in{background:${p.pri};color:${p.priFg};box-shadow:${clayB}}
.rating-in .lead{color:${p.priSoft}}.rating-num .stars{color:${p.acc}}
.rating-in .btn-ghost{background:${p.acc};color:${p.dark};box-shadow:${clayG}}
.cta-in{background:${p.dark};box-shadow:${clayK}}
.cta-in h2{color:${p.acc}}
.cta-in .btn-primary{background:${p.acc};color:${p.dark};box-shadow:${clayG}}
.cta-in .btn-ghost{background:${p.dark2};color:#fff;box-shadow:none;border:1px solid ${p.dark3}}
.band{overflow:hidden;padding:18px 0}
.band p{margin:0 -40px;background:${p.dark};color:${p.acc};transform:rotate(-1.4deg);padding:22px 0;white-space:nowrap;font-family:var(--font-d);font-weight:700;font-size:24px;text-align:center}
.site-foot{background:${p.dark};color:#fff;border-radius:44px 44px 0 0}
.site-foot .foot-brand p,.site-foot .foot-note,.site-foot .foot-col h3{color:${p.darkSoft2}}
.site-foot .logo-word{color:#fff}
.site-foot .foot-note{border-color:${p.dark3}}
.page-hero{padding-bottom:70px}
.page-hero::after{content:'';position:absolute;right:-80px;top:-60px;width:380px;height:380px;border-radius:50%;background:${p.acc};box-shadow:${clayG};z-index:0}
.form input,.form select,.form textarea{border:0;background:${p.surf2};box-shadow:inset 0 4px 8px ${rgba(p.pri, .12)}}
/* hero art */
.ha-photo{position:absolute;right:0;top:0;width:86%;height:420px;border-radius:40px}
.ha-blob{position:absolute;left:-20px;top:30px;width:240px;height:240px;border-radius:50%;background:${p.acc};box-shadow:${clayG}}
.ha-printer{position:absolute;left:0;bottom:0;width:300px;height:190px}
.ha-printer > span{position:absolute;display:block}
.ha-pill{position:absolute;right:24px;bottom:30px;display:flex;align-items:center;gap:10px;padding:14px 20px;border-radius:999px;background:${p.surf};box-shadow:${clayL};font-weight:600;text-decoration:none}
.ha-pill .stars svg{width:15px;height:15px}
@media (max-width:1000px){.svc-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.ha-photo{width:100%;height:340px}.ha-printer{transform:scale(.75);transform-origin:left bottom}}
@media (max-width:640px){.svc-main{grid-column:span 1;grid-row:span 1}.svc-grid{grid-template-columns:1fr}.page-hero::after{width:200px;height:200px}.ha-photo{height:280px}.ha-blob{width:150px;height:150px}}
${p.css || ""}`;

  const printer = () => `<div class="ha-printer" aria-hidden="true">
<span style="left:0;right:0;top:40px;height:150px;border-radius:40px;background:${p.pri};box-shadow:${clayB}"></span>
<span style="left:50px;right:50px;top:66px;height:22px;border-radius:999px;background:${p.dark};box-shadow:inset 0 6px 10px rgba(0,0,0,.9)"></span>
<span style="left:70px;right:70px;top:-10px;height:110px;border-radius:20px;background:#fff;transform:rotate(-5deg);box-shadow:0 16px 30px ${rgba(p.dark, .2)};padding:22px"><i style="display:block;height:10px;width:70%;border-radius:9px;background:${p.dark}"></i><i style="display:block;height:7px;margin-top:10px;border-radius:9px;background:${p.paperLine}"></i><i style="display:block;height:7px;width:80%;margin-top:8px;border-radius:9px;background:${p.paperLine}"></i></span>
<span style="right:30px;top:110px;width:40px;height:40px;border-radius:50%;background:${p.acc};box-shadow:${clayG}"></span>
</div>`;

  return {
    fonts: p.fonts,
    css,
    svcGrid: [4, 4],
    heroArt(b, ctx) {
      const r = b.rating;
      return `<span class="ha-blob" aria-hidden="true"></span>
${b.heroImg ? `<figure class="photo ha-photo"><img src="${ctx.root}${b.heroImg.src}" alt="${esc(b.heroImg.alt)}"></figure>` : ''}
${printer()}
${showRating(r) ? `<a class="ha-pill" href="${esc(r.url)}"><span class="stars">${ic.zvezda.repeat(5)}</span>${esc(r.value)} · Google</a>` : ''}`;
    },
    homeOrder: ['hero', 'band', 'facts', 'servicesPreview', 'feature', 'process', 'gallery', 'why', 'rating', 'faq', 'locations', 'ctaBand'],
    sections: {
      band: (b) => `<div class="band" aria-hidden="true"><p>${b.services.map((s) => esc(s.t)).join(' · ')}</p></div>`,
    },
  };
};
