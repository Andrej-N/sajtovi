// Liquid glass. Default: glacier blue #8fe9ff / ultraviolet #6f3dff / mineral grey #b7b7b7 on deep ink. Recolor with glass(palette).
const { esc } = require('../shared');
const { rgba, mix } = require('../boje');
const baza = require('./baza');

const DEFAULT = {
  bg: '#0b0a1f', pri: '#6f3dff', acc: '#8fe9ff', grey: '#b7b7b7', muted: '#c7c7d3', glassBg: 'rgba(22,19,52,.55)', priFg: '#fff', accFg: '#0b0a1f',
  fonts: 'family=Red+Hat+Display:wght@500;700;900&family=Red+Hat+Text:wght@400;500;600', fd: "'Red Hat Display',sans-serif", fb: "'Red Hat Text',system-ui,sans-serif", hw: 900, ht: '-.035em',
  blobs: null,
};
const derive = (p) => ({ glassBg: rgba(mix(p.bg, '#fff', .07), .55), accFg: p.bg, muted: mix(p.grey || '#b7b7b7', '#fff', .3) });

module.exports = function glass(o = {}) {
  const p = o.pri ? { ...DEFAULT, ...derive(o), ...o } : { ...DEFAULT, ...o };
  const glass = `background:${p.glassBg};-webkit-backdrop-filter:blur(26px) saturate(170%);backdrop-filter:blur(26px) saturate(170%);border:1px solid rgba(255,255,255,.24);box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 24px 60px rgba(0,0,0,.35)`;

  const css = baza + `
:root{--bg:${p.bg};--fg:#fff;--muted:${p.muted};--surface:rgba(255,255,255,.07);--surface-2:rgba(255,255,255,.12);--line:rgba(255,255,255,.2);--accent:${p.pri};--accent-fg:${p.priFg};--accent-2:${p.acc};--accent-2-fg:${p.accFg};--accent-ink:${p.acc};--r:30px;--r-sm:999px;--font-d:${p.fd};--font-b:${p.fb};--hw:${p.hw};--ht:${p.ht};--star:${p.acc};--map-filter:invert(.92) hue-rotate(180deg) saturate(.8)}
body{--card-bg:${p.glassBg};--card-blur:blur(26px) saturate(170%);--card-sh:inset 0 1px 0 rgba(255,255,255,.5),0 24px 60px rgba(0,0,0,.35)}
h3{font-weight:700;letter-spacing:-.01em}
.blobs{position:fixed;inset:0;z-index:-1;overflow:hidden;background:${p.bg}}
.blobs i{position:absolute;display:block}
.site-head{padding-top:14px;position:sticky}
.head-in{${glass};border-radius:999px;padding:0 10px 0 22px;min-height:66px;max-width:1176px}
.mono{background:${p.acc};color:${p.accFg};border-radius:50%}
.btn-primary{box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 14px 30px ${rgba(p.pri, .45)}}
.btn-ghost,.svc-card,.fact,.step,.loc-card,.faq-list details,.form,.why-item,.chips a,.mnav nav,.rating-in,.photo,.illu,.mnav summary{${glass}}
.icon-box{border-radius:50%;box-shadow:inset 0 1px 0 rgba(255,255,255,.8)}
.tag{background:transparent;border:1px solid ${rgba(p.acc, .5)};color:${p.acc}}
.menu a[aria-current]{background:rgba(255,255,255,.12)}
.photo{padding:8px}
.photo img{border-radius:calc(var(--r) - 8px)}
.illu{color:${p.acc}}
.illu::before{content:'';position:absolute;width:55%;aspect-ratio:1;border-radius:50%;background:${p.pri};filter:blur(2px);opacity:.75;z-index:-1}
.illu > *{position:relative}
.illu-label{color:#fff}
.svc-main{background:${rgba(p.pri, .35)}}
.fact strong{color:${p.acc}}
.cta-in{background:${rgba(p.pri, .55)};-webkit-backdrop-filter:blur(26px);backdrop-filter:blur(26px);border:1px solid rgba(255,255,255,.3)}
.cta-in .btn-primary{background:${p.acc};color:${p.accFg}}
.cta-in .btn-ghost{color:#fff}
.form input,.form select,.form textarea{background:${rgba(p.bg, .55)};border-color:rgba(255,255,255,.25);color:#fff;border-radius:16px}
.form select option{background:${p.bg}}
.site-foot{${glass};border-radius:40px 40px 0 0;border-bottom:0}
.rating-num strong{color:#fff}
/* hero art */
.ha-photo{position:absolute;right:0;top:10px;width:88%;height:430px;transform:rotate(3deg)}
.ha-card{position:absolute;left:0;bottom:0;width:300px;padding:24px;border-radius:26px;${glass};display:flex;flex-direction:column;gap:12px}
.ha-card h3{font-size:18px}
.ha-card ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.ha-card li{display:flex;justify-content:space-between;gap:10px;padding:10px 14px;border-radius:14px;background:${rgba(p.bg, .45)};font-size:14px}
.ha-card li span:last-child{color:${p.grey}}
@media (max-width:1000px){.ha-photo{height:340px;width:100%;transform:none}.ha-card{width:260px}}
${p.css || ""}`;

  // Background shapes; a palette can pass its own blobs (array of inline styles)
  const blobs = () => `<div class="blobs" aria-hidden="true">
${(p.blobs || [
    `width:640px;height:640px;border-radius:50%;background:${p.pri};right:-160px;top:-80px`,
    `width:340px;height:460px;border-radius:44px;background:${p.acc};right:6%;top:46%;transform:rotate(14deg);opacity:.85`,
    `width:900px;height:340px;border-radius:170px;background:${p.pri};left:-300px;bottom:-60px;transform:rotate(-8deg)`,
    `width:220px;height:220px;border-radius:50%;background:${p.acc};left:-80px;top:62%;opacity:.8`,
  ]).map((s) => `<i style="${s}"></i>`).join('\n')}
</div>`;

  return {
    fonts: p.fonts,
    css,
    svcGrid: [3, 1],
    bodyDecor: blobs,
    heroArt(b, ctx) {
      const ask = b.flow === 'stamparija'
        ? [['Šta štampate', 'flajere, vizit…'], ['Tiraž', 'broj komada'], ['Rok', 'do kada']]
        : [['Fajl', 'PDF, Word, JPG'], ['Format', 'A4, A3…'], ['Boja', 'c/b ili kolor']];
      return `${b.heroImg ? `<figure class="photo ha-photo"><img src="${ctx.root}${b.heroImg.src}" alt="${esc(b.heroImg.alt)}"></figure>` : ''}
<div class="ha-card"><h3>U mailu napišite:</h3><ul>${ask.map(([a, z]) => `<li><span>${a}</span><span>${z}</span></li>`).join('')}</ul><a class="btn btn-primary" href="mailto:${esc(b.email)}" style="min-height:46px;font-size:14px">${esc(b.email)}</a></div>`;
    },
  };
};
