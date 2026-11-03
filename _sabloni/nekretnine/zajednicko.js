// Shared parts of the real-estate demo: one link per agency holds all 4 designs (index.html + dizajn-2..4.html).
// Here: listing helpers, the floating design switcher, the listing detail dialog and the small filter script.
// Each design file (minimal, brutal, premium, lokal) only brings its own skeleton, fonts and CSS.
const { esc, fmtPhone, telHref, showRating } = require('../shared');

const DESIGNS = {
  minimal: 'Minimalistički',
  lokal: 'Topao, lokalni',
  premium: 'Premium',
  brutal: 'Brutalistički',
};
const OFFICE_MAIL = 'cherrystone.contact@gmail.com';

const dot = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const price = (x) => x.priceText ? x.priceText : x.cat ? 'Na upit' : x.price == null ? 'Cena na upit' : dot(x.price) + ' €' + (x.per ? ' / mes.' : '');
const m2 = (x) => x.m2 == null ? '' : typeof x.m2 === 'number' ? String(x.m2).replace('.', ',') + ' m²' : x.m2;
const facts = (x) => [m2(x), x.rooms, x.floor].filter(Boolean).join(' · ');
const nl = (s) => esc(s).replace(/\n/g, '<br>');
const pic = (x, cls = '', lazy = true) => x ? `<img class="${cls}" src="img/${esc(x)}.jpg" alt="" ${lazy ? 'loading="lazy" ' : 'fetchpriority="high" '}decoding="async">` : '';
const alt = (x) => [x.type, x.place].filter(Boolean).join(', ');
const img = (src, a, cls = '', lazy = true) => src ? `<img class="${cls}" src="img/${esc(src)}.jpg" alt="${esc(a)}" ${lazy ? 'loading="lazy" ' : 'fetchpriority="high" '}decoding="async">` : '';
const tel = (b, i = 0) => telHref(b.phones[i]);
const phone = (b, i = 0) => fmtPhone(b.phones[i]);
const mapSrc = (b) => `https://maps.google.com/maps?q=${encodeURIComponent(b.mapQuery || `${b.name}, ${b.address}`)}&z=16&output=embed`;
const types = (b) => [...new Set(b.listings.map((x) => x.type))];
const deals = (b) => [...new Set(b.listings.map((x) => x.deal))];
const rating = (b) => showRating(b.rating) ? b.rating : null;

// attributes every listing card carries, so one script filters and sorts in all 4 designs
const cardAttrs = (x, i) => `data-i="${i}" data-type="${esc(x.type)}" data-deal="${esc(x.deal)}" data-place="${esc(x.area || x.place || '')}" data-price="${x.price ?? ''}" data-per="${x.per ? 1 : 0}"`;

// all listings as JSON for the detail dialog
function listingJson(b) {
  const L = b.listings.map((x) => ({
    t: x.t, type: x.type, deal: x.deal === 'izdavanje' ? 'Izdavanje' : 'Prodaja', place: x.place, price: price(x),
    facts: facts(x), note: x.note || '', imgs: [x.img, ...(x.imgs || [])].filter(Boolean).map((s) => `img/${s}.jpg`),
  }));
  return `<script type="application/json" id="oglasi-data">${JSON.stringify(L).replace(/</g, '\\u003c')}</script>`;
}

function dialog(b) {
  return `<dialog class="ogl" id="ogl" aria-labelledby="ogl-t">
<div class="ogl-in">
<button type="button" class="ogl-x" data-close aria-label="Zatvorite">✕</button>
<div class="ogl-gal"><img class="ogl-main" alt=""><div class="ogl-th"></div></div>
<div class="ogl-body">
<p class="ogl-k"></p>
<h3 id="ogl-t"></h3>
<p class="ogl-p"></p>
<p class="ogl-f"></p>
<p class="ogl-n"></p>
<div class="ogl-cta"><a class="ogl-call" href="${tel(b)}">Pozovite ${esc(phone(b))}</a>${b.email ? `<a class="ogl-mail" data-mail href="mailto:${esc(b.email)}">Pošaljite upit mailom</a>` : ''}</div>
</div>
</div>
</dialog>
${listingJson(b)}`;
}

// default dialog look; each design overrides the custom properties
const dialogCss = `
.ogl{border:0;padding:0;max-width:min(980px,94vw);width:100%;background:var(--d-bg,#fff);color:var(--d-fg,#111);font-family:var(--d-font,inherit);border-radius:var(--d-r,0)}
.ogl::backdrop{background:rgba(10,10,10,.6)}
.ogl-in{display:flex;flex-wrap:wrap;position:relative}
.ogl-x{position:absolute;top:10px;right:10px;z-index:2;width:44px;height:44px;border:0;border-radius:var(--d-r,0);background:var(--d-bg,#fff);color:var(--d-fg,#111);font-size:18px;cursor:pointer}
.ogl-gal{flex:1.4 1 420px;min-width:0;background:rgba(0,0,0,.06)}
.ogl-main{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}
.ogl-th{display:flex;gap:6px;padding:6px;overflow-x:auto}
.ogl-th button{flex:0 0 76px;height:56px;padding:0;border:2px solid transparent;background:none;cursor:pointer}
.ogl-th button[aria-current=true]{border-color:var(--d-acc,#000)}
.ogl-th img{width:100%;height:100%;object-fit:cover;display:block}
.ogl-body{flex:1 1 300px;padding:clamp(20px,3vw,32px);display:flex;flex-direction:column;gap:10px}
.ogl-k{margin:0;font-size:14px;opacity:.75}
.ogl h3{margin:0;font-size:clamp(22px,2.4vw,30px);line-height:1.15;font-family:var(--d-head,inherit);font-weight:var(--d-hw,600)}
.ogl-p{margin:0;font-size:26px;font-family:var(--d-head,inherit);color:var(--d-acc,inherit)}
.ogl-f{margin:0;font-size:16px}
.ogl-n{margin:0;font-size:15px;line-height:1.6;opacity:.85}
.ogl-cta{margin-top:auto;display:flex;flex-direction:column;gap:8px;padding-top:12px}
.ogl-cta a{display:flex;align-items:center;justify-content:center;min-height:50px;padding:0 18px;text-decoration:none;font-weight:600;border-radius:var(--d-r,0)}
.ogl-call{background:var(--d-acc,#111);color:var(--d-on,#fff)}
.ogl-mail{border:1px solid currentColor;color:inherit}
`;

// floating switcher: same on every design, neutral so it never clashes with the page
function switcher(b, cur) {
  const order = b.designs;
  const i = order.indexOf(cur);
  const file = (k) => (order.indexOf(k) === 0 ? 'index.html' : `dizajn-${order.indexOf(k) + 1}.html`);
  const next = order[(i + 1) % order.length];
  const prev = order[(i + order.length - 1) % order.length];
  const subj = encodeURIComponent(`${b.name}: biramo dizajn ${i + 1} (${DESIGNS[cur]})`);
  const body = encodeURIComponent(`Zdravo,\n\nza ${b.name} nam se najviše sviđa dizajn ${i + 1} (${DESIGNS[cur]}).\n\n`);
  return `<link rel="prefetch" href="${file(next)}">
<nav class="dz" aria-label="Predlozi dizajna">
${i === 0 ? `<p class="dz-tip" id="dz-tip">Napravili smo vam <b>4 različita dizajna</b>. Pogledajte ovaj, pa pređite na sledeći.<button type="button" aria-label="Zatvorite" data-tip-x>✕</button></p>` : ''}
<div class="dz-bar">
<a class="dz-arr" href="${file(prev)}" aria-label="Prethodni dizajn: ${esc(DESIGNS[prev])}">‹</a>
<div class="dz-dots" role="list">${order.map((k, j) => `<a role="listitem" href="${file(k)}" class="dz-dot" ${k === cur ? 'aria-current="page"' : ''} title="${esc(DESIGNS[k])}">${j + 1}</a>`).join('')}</div>
<span class="dz-name"><b>Dizajn ${i + 1} od ${order.length}</b><span>${esc(DESIGNS[cur])}</span></span>
<a class="dz-next" href="${file(next)}">Pogledajte drugi dizajn <span aria-hidden="true">→</span></a>
<a class="dz-pick" href="mailto:${OFFICE_MAIL}?subject=${subj}&body=${body}">Ovaj mi se sviđa</a>
</div>
</nav>`;
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

// filters (buttons/selects with data-key/data-val), sort, project/hero picker, detail dialog, tip
const script = `<script>
(function(){
var grid=document.querySelector('[data-grid]');
var state={};var asc=null;
function apply(){if(!grid)return;var cards=[].slice.call(grid.querySelectorAll('[data-i]'));var n=0;
cards.forEach(function(c){var ok=Object.keys(state).every(function(k){var v=state[k];if(!v)return true;if(k==='max')return c.dataset.per==='0'&&c.dataset.price&&+c.dataset.price<=+v;return c.dataset[k]===v});c.hidden=!ok;if(ok)n++});
if(asc!==null){cards.sort(function(a,b){var x=+a.dataset.price||0,y=+b.dataset.price||0;return asc?x-y:y-x}).forEach(function(c){grid.appendChild(c)})}
var e=document.querySelector('[data-empty]');if(e)e.hidden=n>0;
document.querySelectorAll('[data-key]').forEach(function(btn){if(btn.tagName==='SELECT')return;btn.setAttribute('aria-pressed',(state[btn.dataset.key]||'')===btn.dataset.val?'true':'false')})}
document.addEventListener('click',function(e){var t=e.target.closest('[data-key]');if(t&&t.tagName==='BUTTON'){state[t.dataset.key]=t.dataset.val;apply()}
var s=e.target.closest('[data-sort]');if(s){asc=asc===null?false:!asc;s.textContent=asc?s.dataset.asc:s.dataset.desc;apply()}
var p=e.target.closest('[data-pick]');if(p){pick(+p.dataset.pick)}
var o=e.target.closest('[data-open]');if(o){e.preventDefault();open(+o.dataset.open)}
if(e.target.closest('[data-close]')||e.target===dlg){dlg.close()}
if(e.target.closest('[data-tip-x]')){var tip=document.getElementById('dz-tip');if(tip)tip.remove();try{sessionStorage.dzTip=1}catch(_){}}});
document.querySelectorAll('select[data-key]').forEach(function(s){s.addEventListener('change',function(){state[s.dataset.key]=s.value;apply()})});
document.querySelectorAll('form[data-find]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var g=document.getElementById('ponuda');if(g)g.scrollIntoView({behavior:'smooth'})})});
apply();
var picks=window.__picks||[];
function pick(i){var x=picks[i];if(!x)return;document.querySelectorAll('[data-pick]').forEach(function(r){r.setAttribute('aria-pressed',+r.dataset.pick===i?'true':'false')});
Object.keys(x).forEach(function(k){var el=document.querySelector('[data-show='+k+']');if(!el)return;if(el.tagName==='IMG'){el.src=x[k]}else{el.textContent=x[k]}})}
var dlg=document.getElementById('ogl');var data=[];try{data=JSON.parse(document.getElementById('oglasi-data').textContent)}catch(_){}
function show(src){dlg.querySelector('.ogl-main').src=src;dlg.querySelectorAll('.ogl-th button').forEach(function(b){b.setAttribute('aria-current',b.dataset.src===src?'true':'false')})}
function open(i){var x=data[i];if(!x||!dlg)return;dlg.querySelector('.ogl-k').textContent=[x.deal,x.type,x.place].filter(Boolean).join(' · ');
dlg.querySelector('#ogl-t').textContent=x.t;dlg.querySelector('.ogl-p').textContent=x.price;dlg.querySelector('.ogl-f').textContent=x.facts;dlg.querySelector('.ogl-n').textContent=x.note;
var th=dlg.querySelector('.ogl-th');th.innerHTML='';if(x.imgs.length>1)x.imgs.forEach(function(s){var b=document.createElement('button');b.type='button';b.dataset.src=s;b.setAttribute('aria-label','Prikažite fotografiju');b.innerHTML='<img alt="" src="'+s+'">';b.onclick=function(){show(s)};th.appendChild(b)});
show(x.imgs[0]||'');dlg.querySelector('.ogl-gal').hidden=!x.imgs.length;var m=dlg.querySelector('[data-mail]');if(m)m.href=m.href.split('?')[0]+'?subject='+encodeURIComponent('Upit: '+x.t);dlg.showModal()}
try{if(sessionStorage.dzTip){var tp=document.getElementById('dz-tip');if(tp)tp.remove()}}catch(_){}
document.querySelectorAll('form[data-mailto]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var lines=[].slice.call(f.elements).filter(function(x){return x.name&&x.value}).map(function(x){return x.name+': '+x.value});location.href='mailto:'+f.dataset.mailto+'?subject='+encodeURIComponent(f.dataset.subject||'Upit sa sajta')+'&body='+encodeURIComponent(lines.join('\\n'))})});
})();
</script>`;

// page frame: head, design body, dialog, switcher, script
function page(b, design, { title, fonts, css, body }) {
  return `<!doctype html>
<html lang="sr-Latn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(title)}</title>
<meta name="description" content="${esc(b.intro)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${fonts}&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
html,body{overflow-x:clip;margin:0}
p,li,dd,span,h1,h2,h3{overflow-wrap:break-word}
img{max-width:100%}
[hidden]{display:none!important}
button{font:inherit}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important}}
${css}
${dialogCss}
${switcherCss}
</style>
</head>
<body>
${body}
${dialog(b)}
${switcher(b, design)}
${script}
</body>
</html>`;
}

const demoNote = (b) => `Predlog novog sajta za ${esc(b.name)}. Oglasi i podaci su preuzeti sa vašeg postojećeg sajta.`;
const photoNote = (b) => b.credits ? ` Fotografije grada sa Wikimedia Commons: ${esc(b.credits)}.` : '';

// contact form posting to the agency's mail (no server needed)
const formAttrs = (b, subject) => b.email ? ` data-mailto="${esc(b.email)}" data-subject="${esc(subject)}"` : '';

module.exports = { DESIGNS, dot, price, m2, facts, nl, img, pic, alt, tel, phone, mapSrc, types, deals, rating, cardAttrs, page, demoNote, photoNote, formAttrs, esc, fmtPhone, telHref };
