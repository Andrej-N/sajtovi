// Stolarija: jedan link po biznisu sa 3 dizajna (index.html + dizajn-2.html + dizajn-3.html).
// Traka za prebacivanje je ista kao kod nekretnina.
const { esc, fmtPhone, telHref, showRating } = require('../shared');

const DESIGNS = { staklo: '3D sklapanje', premium: 'Premium', negativ: 'Negative space' };
const OFFICE_MAIL = 'cherrystone.contact@gmail.com';

const tel = (b, i = 0) => telHref(b.phones[i]);
const phone = (b, i = 0) => fmtPhone(b.phones[i]);
const demoNote = (b) => `Predlog novog sajta za ${esc(b.name)}. Podaci su preuzeti sa vašeg postojećeg sajta i Google mape.`;
const rec = (n) => (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'recenzije' : n % 10 === 1 && n % 100 !== 11 ? 'recenzija' : 'recenzija');
const ratingText = (b) => (showRating(b.rating) ? `Google ocena ${esc(b.rating.value)} (${b.rating.count} ${rec(b.rating.count)})` : '');

const fileOf = (b, k) => (b.designs.indexOf(k) === 0 ? 'index.html' : `dizajn-${b.designs.indexOf(k) + 1}.html`);

function switcher(b, cur) {
  const order = b.designs;
  const i = order.indexOf(cur);
  const next = order[(i + 1) % order.length];
  const prev = order[(i + order.length - 1) % order.length];
  const subj = encodeURIComponent(`${b.name}: biramo dizajn ${i + 1} (${DESIGNS[cur]})`);
  const body = encodeURIComponent(`Zdravo,\n\nza ${b.name} nam se najviše sviđa dizajn ${i + 1} (${DESIGNS[cur]}).\n\n`);
  return `<link rel="prefetch" href="${fileOf(b, next)}">
<nav class="dz" aria-label="Predlozi dizajna">
${i === 0 ? `<p class="dz-tip" id="dz-tip">Napravili smo vam <b>${order.length} različita dizajna</b>. Pogledajte ovaj, pa pređite na sledeći.<button type="button" aria-label="Zatvorite" data-tip-x>✕</button></p>` : ''}
<div class="dz-bar">
<a class="dz-arr" href="${fileOf(b, prev)}" aria-label="Prethodni dizajn: ${esc(DESIGNS[prev])}">‹</a>
<div class="dz-dots" role="list">${order.map((k, j) => `<a role="listitem" href="${fileOf(b, k)}" class="dz-dot" ${k === cur ? 'aria-current="page"' : ''} title="${esc(DESIGNS[k])}">${j + 1}</a>`).join('')}</div>
<span class="dz-name"><b>Dizajn ${i + 1} od ${order.length}</b><span>${esc(DESIGNS[cur])}</span></span>
<a class="dz-next" href="${fileOf(b, next)}">Pogledajte drugi dizajn <span aria-hidden="true">→</span></a>
<a class="dz-pick" href="mailto:${OFFICE_MAIL}?subject=${subj}&body=${body}">Ovaj mi se sviđa</a>
</div>
</nav>
<script>(function(){var t=document.getElementById('dz-tip');if(!t)return;try{if(sessionStorage.dzTip){t.remove();return}}catch(_){}
t.querySelector('[data-tip-x]').addEventListener('click',function(){t.remove();try{sessionStorage.dzTip=1}catch(_){}})})();</script>`;
}

const switcherCss = `
body{padding-bottom:96px}
.dz{position:fixed;left:0;right:0;bottom:max(14px,env(safe-area-inset-bottom));z-index:9999;display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none;font:500 15px/1.3 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:0;text-transform:none}
.dz *{box-sizing:border-box}
.dz-bar,.dz-tip{pointer-events:auto}
.dz-tip{margin:0;max-width:min(440px,calc(100vw - 24px));background:#fff;color:#16181d;padding:12px 44px 12px 16px;border-radius:14px;box-shadow:0 8px 28px rgba(0,0,0,.22);position:relative;font-size:15px;line-height:1.45}
.dz-tip button{position:absolute;top:6px;right:6px;width:32px;height:32px;border:0;background:none;color:#16181d;font-size:15px;cursor:pointer;border-radius:8px}
.dz-bar{display:flex;align-items:center;gap:6px;background:#16181d;color:#fff;padding:6px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.35);max-width:calc(100vw - 16px)}
.dz a{color:#fff;text-decoration:none}
.dz-arr{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;font-size:24px;line-height:1}
.dz-arr:hover,.dz-dot:hover{background:rgba(255,255,255,.12)}
.dz-dots{display:flex;gap:2px}
.dz-dot{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;font-size:14px;color:#c9ccd3!important}
.dz-dot[aria-current]{background:#fff;color:#16181d!important;font-weight:700}
.dz-name{display:flex;flex-direction:column;padding:0 10px 0 6px;font-size:13px;line-height:1.25;white-space:nowrap}
.dz-name span{color:#aeb3bd}
.dz-next{display:flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border-radius:999px;background:#ffd23f;color:#16181d!important;font-weight:700;white-space:nowrap}
.dz-next:hover{background:#ffe077}
.dz-pick{display:flex;align-items:center;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid rgba(255,255,255,.35);white-space:nowrap}
.dz-pick:hover{background:rgba(255,255,255,.12)}
@media (max-width:760px){.dz-name,.dz-pick{display:none}.dz-dots{display:none}.dz-bar{gap:4px}.dz-next{padding:0 14px}}
@media (max-width:360px){.dz-arr{display:none}}
`;

function page({ b, title, fonts, css, body, extraHead = '', cur }) {
  return `<!doctype html>
<html lang="sr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(b.lede)}">
<meta name="robots" content="noindex, nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap">
<style>${switcherCss}${css}</style>
${extraHead}
</head>
<body>
${body}
${switcher(b, cur)}
</body>
</html>
`;
}

// rows of prices, used by all three designs: groups = [{ t, rows: [[naziv, cena, napomena?]] }]
const priceGroups = (b, h = 'h3') => (b.prices ? b.prices.groups : []).map((g) => `<div class="cg"><${h}>${esc(g.t)}</${h}>${g.rows.map((r) => `<div class="red"><span>${esc(r[0])}${r[2] ? `<small>${esc(r[2])}</small>` : ''}</span><strong>${esc(r[1])}</strong></div>`).join('')}</div>`).join('');

module.exports = { DESIGNS, esc, tel, phone, telHref, fmtPhone, demoNote, ratingText, page, priceGroups, showRating };
