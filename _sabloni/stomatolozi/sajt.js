// One-page demo site for dental offices. Markup is shared; each skin (rendgen, staklo, bento, skandi) brings fonts + CSS,
// a hero variant and default section tones. Per business, b.look can recolor (pal), reorder (order) and retone sections (tones).
// Tones: plain | white | dark | acc | soft | photo (photo = their photo behind a glass panel, staklo only).
const { esc, fmtPhone, telHref, showRating } = require('../shared');
const ikona = require('./ikone');

const nl = (s) => esc(s).replace(/\n/g, '<br>');
const img = (x, cls = '', extra = '') => x ? `<img class="${cls}" src="${esc(x.src)}" alt="${esc(x.alt)}" loading="lazy" decoding="async"${extra}>` : '';
const eager = (x, cls) => img(x, cls, ' fetchpriority="high"').replace(' loading="lazy"', '');
const mapSrc = (b) => `https://maps.google.com/maps?q=${encodeURIComponent(b.mapQuery || `${b.name}, ${b.address}`)}&z=16&output=embed`;
const ICON = {
  tel: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/></svg>',
  cal: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  pin: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>',
  x: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
};

const brand = (b) => b.logo
  ? `<a class="brand brand-img" href="#vrh"${b.logo.chip ? ` style="background:${b.logo.chip}"` : ''}><img src="logo${esc(b.logo.ext)}" alt="${esc(b.name)}" style="height:${b.logo.h || 40}px"></a>`
  : `<a class="brand" href="#vrh">${esc(b.short || b.name)}</a>`;

const call = (b, cls = 'btn btn-main', label) => `<a class="${cls}" href="${telHref(b.phones[0])}">${ICON.tel}<span>${esc(label || 'Pozovite ' + fmtPhone(b.phones[0]))}</span></a>`;
const book = (b, cls = 'btn btn-alt') => `<a class="${cls}" href="#zakazivanje">${ICON.cal}<span>${esc(b.bookLabel || 'Zakažite pregled')}</span></a>`;
const ratingLink = (b, cls = 'rating') => showRating(b.rating)
  ? `<a class="${cls}" href="${esc(b.rating.url)}" target="_blank" rel="noopener">${ICON.star}<b>${esc(b.rating.value)}</b><span>${b.rating.count} ocena na Google-u</span></a>` : '';
const hoursText = (b) => (b.hours || []).map(([d, h]) => `${d} ${h}`).join(', ');

// section shell: tone + optional backdrop photo; .in is the content box
function shell(id, b, skin, inner, extra = '') {
  const tone = (b.look?.tones || {})[id] || skin.tones[id] || 'plain';
  const bd = tone === 'photo' && b.backdrops?.[id];
  const span = b.look?.spans?.[id];
  if (span) extra += ` style="grid-column:span ${span}"`;
  return `<section class="sec s-${id.replace(/-\d+$/, '')} tone-${tone}" id="${id}"${extra}>${bd ? img(bd, 'bd') + '<div class="bd-shade"></div>' : ''}<div class="in">${inner}</div></section>`;
}

// hero picture: main photo, up to two smaller ones overlapping, and a floating fact card
function collage(b) {
  if (!b.hero) return '';
  const small = (b.heroImgs || []).map((x, i) => img(x, 'col-s col-s' + (i + 1))).join('');
  const badge = b.heroBadge ? `<div class="col-badge">${b.heroBadge.icon ? `<span class="ic">${ikona(b.heroBadge.icon)}</span>` : ''}<div class="col-badge-t"><b>${esc(b.heroBadge.v)}</b><span>${esc(b.heroBadge.l)}</span></div></div>` : '';
  return `<figure class="hero-fig${small ? ' has-col' : ''}">${eager(b.hero, 'col-main')}${small}${badge}${b.heroCap ? `<figcaption>${esc(b.heroCap)}</figcaption>` : ''}</figure>`;
}

const S = {
  hero(b, skin) {
    const h = b.hero;
    const text = `<h1>${nl(b.title)}</h1><p class="lead">${esc(b.intro)}</p>`;
    if (skin.hero === 'glass') return `<section class="hero hero-glass" id="vrh">${eager(h, 'bd')}<div class="bd-shade"></div>
<div class="in hero-in"><div class="glass hero-card">${text}<div class="ctas">${call(b, 'btn btn-main', 'Pozovite')}${book(b, 'btn btn-glass')}</div>${ratingLink(b, 'rating')}</div></div></section>`;
    if (skin.hero === 'tile') return `<section class="sec s-hero tone-white" id="vrh"><div class="in">${text}<div class="ctas">${call(b, 'btn btn-main', 'Pozovite')}${book(b)}</div></div></section>`;
    if (skin.hero === 'editorial') return `<section class="hero hero-ed" id="vrh"><div class="in hero-in">
<div class="hero-text"><h1>${nl(b.title)}</h1><div class="hero-sub"><p class="lead">${esc(b.intro)}</p><div class="ctas">${call(b, 'btn btn-main', fmtPhone(b.phones[0]))}${book(b)}</div></div>${ratingLink(b)}</div>
${collage(b)}
</div></section>`;
    // split (rendgen)
    return `<section class="hero hero-split" id="vrh"><div class="in hero-in">
<div class="hero-text">${text}${b.hours ? `<p class="hero-hours">${esc(hoursText(b))}</p>` : ''}<div class="ctas">${call(b)}${book(b)}</div>${ratingLink(b)}</div>
${collage(b)}
</div></section>`;
  },

  // bento-only small tiles
  vreme(b, skin) {
    if (!b.hours) return '';
    return shell('vreme', b, skin, `<h2 class="h-small">Radno vreme</h2><dl class="hours">${b.hours.map(([d, h]) => `<div><dt>${esc(d)}</dt><dd>${esc(h)}</dd></div>`).join('')}</dl>`);
  },
  ocena(b, skin) {
    if (showRating(b.rating)) return shell('ocena', b, skin, `<a class="big-rating" href="${esc(b.rating.url)}" target="_blank" rel="noopener"><b>${esc(b.rating.value)}</b><span>${b.rating.count} ocena<br>na Google-u</span></a>`);
    if (!b.bigFact) return '';
    return shell('ocena', b, skin, `<div class="big-rating"><b>${esc(b.bigFact[0])}</b><span>${nl(b.bigFact[1])}</span></div>`);
  },
  foto(b, skin) {
    if (!b.hero) return '';
    return shell('foto', b, skin, eager(b.hero, 'tile-img'));
  },

  usluge(b, skin) {
    const sv = b.services;
    if (!sv?.length) return '';
    if (sv.some((x) => x && x.t)) {
      return shell('usluge', b, skin, `<div class="sec-top"><h2>${nl(b.servicesTitle || 'Šta radimo')}</h2>${b.servicesNote ? `<p class="note">${esc(b.servicesNote)}</p>` : ''}</div>
<div class="cards">${sv.map((x) => `<article class="card"><span class="ic">${x.icon ? ikona(x.icon) : ikona.za(x.t)}</span><h3>${esc(x.t)}</h3>${x.d ? `<p>${esc(x.d)}</p>` : ''}</article>`).join('')}${b.servicesImg ? `<figure class="card card-img">${img(b.servicesImg)}</figure>` : ''}</div>`);
    }
    const rich = sv.some((x) => Array.isArray(x));
    const body = rich
      ? `<ul class="svc">${sv.map((x) => Array.isArray(x) ? `<li><b>${esc(x[0])}</b><span>${esc(x[1])}</span></li>` : `<li><b>${esc(x)}</b></li>`).join('')}</ul>`
      : `<p class="prose">${esc(sv.join(', '))}.</p>`;
    return shell('usluge', b, skin, `<div class="duo"><div class="duo-h"><h2>${nl(b.servicesTitle || 'Šta radimo')}</h2>${b.servicesNote ? `<p class="note">${esc(b.servicesNote)}</p>` : ''}</div><div class="duo-b">${body}</div></div>`);
  },

  brojke(b, skin) {
    if (!b.facts?.length) return '';
    return shell('brojke', b, skin, `<dl class="facts">${b.facts.map(([v, l, ic]) => `<div>${ic ? `<span class="ic">${ikona(ic)}</span>` : ''}<dt>${esc(v)}</dt><dd>${esc(l)}</dd></div>`).join('')}</dl>`);
  },

  koraci(b, skin) {
    if (!b.steps?.length) return '';
    return shell('koraci', b, skin, `<div class="sec-top"><h2>${nl(b.stepsTitle || 'Kako izgleda dolazak')}</h2></div>
<ol class="steps">${b.steps.map(([t, d, ic]) => `<li><span class="ic">${ikona(ic || 'zub')}</span><b>${esc(t)}</b>${d ? `<p>${esc(d)}</p>` : ''}</li>`).join('')}</ol>`);
  },

  pitanja(b, skin) {
    if (!b.faq?.length) return '';
    return shell('pitanja', b, skin, `<div class="duo"><div class="duo-h"><h2>${nl(b.faqTitle || 'Pitanja pacijenata')}</h2>${b.faqNote ? `<p class="note">${esc(b.faqNote)}</p>` : ''}</div>
<div class="duo-b faq">${b.faq.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></div>`);
  },

  cene(b, skin) {
    const p = b.prices;
    if (!p) return '';
    return shell('cene', b, skin, `<div class="duo"><div class="duo-h"><h2>${nl(p.title || 'Cene')}</h2>${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}</div>
<div class="duo-b"><div class="prices">${p.rows.map(([n, v, d]) => `<div class="pr"><span class="pr-n">${esc(n)}${d ? `<small>${esc(d)}</small>` : ''}</span><span class="pr-v">${esc(v)}</span></div>`).join('')}</div>
${p.extra ? `<p class="note pr-extra">${esc(p.extra)}</p>` : ''}</div></div>`);
  },

  tim(b, skin) {
    if (!b.team?.length) return '';
    const fig = b.teamImg ? img(b.teamImg, 'team-img') : '';
    return shell('tim', b, skin, `<div class="team-wrap">${fig}<div class="team-body"><h2>${nl(b.teamTitle || 'Ko vas leči')}</h2>
<div class="team">${b.team.map((m) => `<div class="doc"><b>${esc(m.name)}</b><span class="doc-r">${esc(m.role)}</span>${m.d ? `<p>${esc(m.d)}</p>` : ''}</div>`).join('')}</div></div></div>`);
  },

  posebno(b, skin, i) {
    const x = b.special?.[i];
    if (!x) return '';
    const id = 'posebno-' + i;
    if (!x.d && !x.list && !x.boxes && !x.img) return shell(id, b, skin, `<p class="quote-big">${nl(x.t)}</p>`);
    const list = x.list ? `<ul class="plist">${x.list.map((l) => `<li><span class="ck">${ikona(x.listIcon || 'cek')}</span><span>${esc(l)}</span></li>`).join('')}</ul>` : '';
    const boxes = x.boxes ? `<div class="boxes">${x.boxes.map((bx) => `<div class="box">${bx.w ? `<div class="box-shape"><i style="width:${bx.w}px;height:${bx.h}px"></i></div>` : ''}<b>${esc(bx.t)}</b>${bx.d ? `<span>${esc(bx.d)}</span>` : ''}${bx.v ? `<em>${esc(bx.v)}</em>` : ''}</div>`).join('')}</div>` : '';
    return shell(id, b, skin, `${x.img ? `<div class="sp-split">${img(x.img, 'sp-img')}<div class="sp-text"><h2>${nl(x.t)}</h2>${x.d ? `<p class="note">${esc(x.d)}</p>` : ''}${list}</div></div>` : `<div class="duo"><div class="duo-h"><h2>${nl(x.t)}</h2>${x.d ? `<p class="note">${esc(x.d)}</p>` : ''}</div><div class="duo-b">${list}</div></div>`}${boxes}`);
  },

  galerija(b, skin) {
    if (!b.gallery?.length) return '';
    return shell('galerija', b, skin, `${b.galleryTitle ? `<h2>${nl(b.galleryTitle)}</h2>` : ''}<div class="gal gal-${Math.min(b.gallery.length, 5)}">${b.gallery.map((g) => `<figure><a href="${esc(g.src)}" data-lb>${img(g)}</a>${g.cap ? `<figcaption>${esc(g.cap)}</figcaption>` : ''}</figure>`).join('')}</div>`);
  },

  utisci(b, skin) {
    if (!b.quotes?.length) return '';
    return shell('utisci', b, skin, `${b.quotesTitle ? `<h2>${nl(b.quotesTitle)}</h2>` : ''}<div class="quotes">${b.quotes.map((q) => `<blockquote>„${esc(q)}“</blockquote>`).join('')}</div>`);
  },

  kontakt(b, skin) {
    const opts = (b.formOptions || ['Pregled i konsultacije', 'Popravka ili lečenje zuba', 'Krunice, mostovi, proteze', 'Implantati', 'Nešto drugo']).map((o) => `<option>${esc(o)}</option>`).join('');
    const when = (b.formWhen || ['Pre podne', 'Posle podne', 'Subota']).map((o) => `<option>${esc(o)}</option>`).join('');
    return `${shell('zakazivanje', b, skin, `<div class="duo"><div class="duo-h"><h2>${nl(b.formTitle || 'Zakažite pregled')}</h2><p class="note">${esc(b.formNote || 'Ostavite ime i broj, a mi vas zovemo da dogovorimo termin.')}</p></div>
<form class="duo-b book" data-mail="${esc(b.email)}" data-name="${esc(b.name)}">
<label>Ime i prezime<input name="ime" autocomplete="name" required></label>
<label>Telefon<input name="tel" type="tel" autocomplete="tel" required></label>
<label>Šta vam treba<select name="sta">${opts}</select></label>
<label>Kada vam odgovara<select name="kada">${when}</select></label>
<button class="btn btn-main" type="submit">Pošaljite upit</button>
</form></div>`)}
${shell('kontakt', b, skin, `<div class="contact"><div class="contact-text">
<h2>${nl(b.contactTitle || b.street || b.address)}</h2>
<p class="addr">${ICON.pin}<span>${esc(b.address)}${b.addressNote ? `. ${esc(b.addressNote)}` : ''}</span></p>
${b.hours ? `<dl class="hours">${b.hours.map(([d, h]) => `<div><dt>${esc(d)}</dt><dd>${esc(h)}</dd></div>`).join('')}</dl>` : ''}
<div class="phones">${b.phones.map((p) => `<a href="${telHref(p)}">${fmtPhone(p)}</a>`).join('')}</div>
${b.email ? `<a class="mail" href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}
</div><div class="map"><iframe src="${mapSrc(b)}" loading="lazy" title="Mapa: ${esc(b.name)}" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>`)}`;
  },
};

const SCRIPT = `<script>
document.querySelectorAll('form.book').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var d=new FormData(f);
var t='Dobar dan, želim da zakažem pregled.\\nIme: '+d.get('ime')+'\\nTelefon: '+d.get('tel')+'\\nŠta mi treba: '+d.get('sta')+'\\nOdgovara mi: '+d.get('kada');
location.href='mailto:'+f.dataset.mail+'?subject='+encodeURIComponent('Zakazivanje pregleda')+'&body='+encodeURIComponent(t);});});
var lb=document.querySelector('.lb');if(lb&&lb.showModal){var li=lb.querySelector('img');
document.querySelectorAll('[data-lb]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();li.src=a.href;li.alt=a.querySelector('img').alt;lb.showModal();});});
lb.addEventListener('click',function(e){if(e.target===lb||e.target.closest('.lb-x'))lb.close();});}
</script>`;

function header(b) {
  const links = [['usluge', b.services?.length && 'Usluge'], ['cene', b.prices && 'Cene'], ['tim', b.team?.length && 'Tim'], ['kontakt', 'Kontakt']].filter((l) => l[1]);
  return `<header class="top"><div class="top-in">${brand(b)}
<nav class="nav" aria-label="Glavni meni">${links.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>
${call(b, 'btn btn-call', fmtPhone(b.phones[0]))}</div></header>`;
}

function footer(b) {
  return `<footer class="foot"><div class="foot-in">
<p><b>${esc(b.name)}</b>, ${esc(b.address)}, <a href="${telHref(b.phones[0])}">${fmtPhone(b.phones[0])}</a></p>
<p>Predlog novog sajta za ${esc(b.name)}. Podaci su preuzeti sa vašeg postojećeg sajta i Google mape.</p>
</div></footer>
<nav class="dock" aria-label="Brzi kontakt"><a href="${telHref(b.phones[0])}">${ICON.tel}Pozovite</a><a href="#zakazivanje">${ICON.cal}${esc(b.dockLabel || 'Zakažite')}</a></nav>
<dialog class="lb" aria-label="Fotografija"><button class="lb-x" type="button" aria-label="Zatvori">${ICON.x}</button><img alt=""></dialog>`;
}

module.exports = function sajt(b, skin) {
  const order = b.look?.order || skin.order;
  const parts = order.map((k) => {
    const m = /^posebno-(\d+)$/.exec(k);
    return m ? S.posebno(b, skin, +m[1]) : S[k](b, skin);
  });
  const main = skin.grid ? `<main class="grid">${S.hero(b, skin)}${parts.join('\n')}</main>` : `${S.hero(b, skin)}\n<main>${parts.join('\n')}</main>`;
  const html = `<!doctype html>
<html lang="sr-Latn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(b.name)}, ${esc(b.city)}</title>
<meta name="description" content="${esc(b.intro)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${skin.fonts}&display=swap" rel="stylesheet">
<style>
${BASE}
${skin.css}
</style>
</head>
<body class="t-${skin.key}">
${header(b)}
${main}
${footer(b)}
${SCRIPT}
</body>
</html>`;
  return { 'index.html': html };
};

// Layout shared by all skins; skins paint it and may rearrange it (bento turns sections into tiles).
const BASE = `*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
html,body{overflow-x:clip}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--fb);font-size:17px;line-height:1.6}
img{max-width:100%;display:block}
a{color:inherit}
p,li,dd,span{overflow-wrap:anywhere}
h1,h2,h3{font-family:var(--fd);font-weight:var(--hw,500);margin:0;line-height:1.04;letter-spacing:var(--ht,-.03em)}
h1{font-size:clamp(40px,5.6vw,76px)}
h2{font-size:clamp(28px,3.2vw,44px)}
.in{max-width:1200px;margin:0 auto;padding:0 24px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 24px;font:inherit;font-weight:600;text-decoration:none;cursor:pointer;border:0;border-radius:var(--r-btn,999px);transition:transform .15s ease,background-color .15s ease,box-shadow .15s ease}
.btn:active{transform:translateY(1px)}
.btn svg{flex:none}
.btn-main{background:var(--acc);color:var(--accInk)}
.btn-alt{background:transparent;color:inherit;box-shadow:inset 0 0 0 1px var(--line2,currentColor)}
.top{position:relative;z-index:5}
.top-in{max-width:1200px;margin:0 auto;padding:22px 24px;display:flex;align-items:center;gap:16px 32px}
.brand{font-family:var(--fd);font-size:22px;font-weight:600;text-decoration:none;letter-spacing:-.02em;line-height:1.1}
.brand-img{display:inline-flex;align-items:center;padding:6px 10px;border-radius:12px;margin-left:-10px}
.brand-img img{width:auto;max-width:220px;object-fit:contain}
.nav{display:flex;gap:26px;margin-left:auto}
.nav a{text-decoration:none;font-size:15px;color:var(--muted)}
.nav a:hover{color:var(--ink)}
.btn-call{min-height:46px;padding:0 18px;background:var(--acc);color:var(--accInk)}
.lead{font-size:19px;max-width:44ch;margin:0;color:var(--muted)}
.ctas{display:flex;flex-wrap:wrap;gap:12px}
.rating{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-size:15px;color:var(--muted)}
.rating svg{color:var(--star,#e0a400)}.rating b{color:var(--ink);font-size:17px}
.sec{position:relative;padding:clamp(64px,8vw,120px) 0}
.note{margin:0;color:var(--muted);max-width:40ch}
.duo{display:flex;flex-wrap:wrap;gap:28px 96px}
.duo-h{flex:1 1 260px;display:flex;flex-direction:column;gap:14px}
.duo-b{flex:2 1 520px;min-width:0}
.duo-b:empty{display:none}
.sp-split{display:flex;flex-wrap:wrap;gap:32px 64px;align-items:center}
.sp-split .sp-img{flex:1 1 420px;min-width:0;width:100%;aspect-ratio:4/3;max-height:440px;object-fit:cover;border-radius:var(--r-img,6px)}
.sp-text{flex:1 1 380px;display:flex;flex-direction:column;gap:18px}
.sp-text .plist{grid-template-columns:1fr}
.duo-img .sp-img{flex:1 1 100%;width:100%;max-height:440px;object-fit:cover;border-radius:var(--r-img,6px)}
.sec-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:12px 64px;margin-bottom:32px}
.sec-top .note{max-width:52ch}
.ic{display:inline-flex;align-items:center;justify-content:center;flex:none}
.ic svg{width:24px;height:24px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.card{display:flex;flex-direction:column;gap:10px;margin:0}
.card h3{font-size:19px;line-height:1.25;letter-spacing:-.01em}
.card p{margin:0;color:var(--muted);font-size:15px;line-height:1.55}
.card-img{padding:0!important;overflow:hidden;grid-column:span 2;grid-row:span 2;order:-1}.card-img img{width:100%;height:100%;min-height:220px;object-fit:cover}
.facts{margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:24px}
.facts div{display:flex;flex-direction:column;gap:4px}
.facts dt{font-family:var(--fd);font-size:clamp(34px,3.6vw,52px);line-height:1;letter-spacing:-.03em}
.facts dd{margin:0;color:var(--muted);font-size:15px}
.steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;counter-reset:st}
.steps li{display:flex;flex-direction:column;gap:8px}
.steps b{font-size:18px}.steps p{margin:0;color:var(--muted);font-size:15px}
.faq details{border-bottom:1px solid var(--line);padding:4px 0}
.faq summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:16px;padding:14px 0;font-weight:600;font-size:17px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:'+';font-size:22px;line-height:1;color:var(--acc2,var(--muted))}
.faq details[open] summary::after{content:'–'}
.faq p{margin:0 0 16px;color:var(--muted);max-width:68ch}
.plist li{display:flex;gap:10px;align-items:flex-start}.plist .ck{margin-top:2px;color:var(--acc2,var(--acc))}.plist .ck svg{width:18px;height:18px}
.hero-fig{position:relative}
.col-badge{position:absolute;display:flex;align-items:center;gap:10px;padding:14px 18px;border-radius:16px;background:#fff;color:#111;box-shadow:0 14px 34px rgba(0,0,0,.14);font-size:14px;max-width:260px}
.col-badge b{font-family:var(--fd);font-size:24px;line-height:1.05}
.col-badge-t{display:flex;flex-direction:column;gap:3px;min-width:0}.col-badge-t span{overflow-wrap:normal;line-height:1.3}
.prose{margin:0;font-size:clamp(19px,1.8vw,22px);line-height:1.7;color:var(--muted)}
.svc{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0 40px}
.svc li{display:flex;flex-direction:column;gap:2px;padding:16px 0;border-bottom:1px solid var(--line)}
.svc b{font-weight:600}.svc span{color:var(--muted);font-size:15px}
.prices{display:flex;flex-direction:column}
.pr{display:flex;justify-content:space-between;gap:24px;padding:15px 0;border-bottom:1px solid var(--line)}
.pr-n small{display:block;color:var(--muted);font-size:14px}
.pr-v{font-weight:600;white-space:nowrap}
.pr-extra{margin-top:16px;max-width:none}
.team-wrap{display:flex;flex-wrap:wrap;gap:40px 72px;align-items:center}
.team-img{flex:1 1 440px;min-width:0;width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:var(--r-img,6px)}
.team-body{flex:1 1 400px;display:flex;flex-direction:column;gap:26px}
.team{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px 32px}
.doc{display:flex;flex-direction:column;gap:2px}
.doc b{font-size:19px;font-weight:600}.doc-r{color:var(--acc2,var(--muted));font-size:15px}.doc p{margin:6px 0 0;color:var(--muted);font-size:15px}
.plist{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0 40px}
.plist li{padding:14px 0;border-bottom:1px solid var(--line)}
.boxes{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:36px;margin-top:48px}
.box{display:flex;flex-direction:column;gap:6px}
.box-shape{height:84px;display:flex;align-items:flex-end;margin-bottom:8px}
.box-shape i{display:block;border:1.5px solid var(--acc);border-radius:3px}
.box b{font-weight:600}.box span{color:var(--muted);font-size:15px}.box em{font-style:normal}
.gal{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:28px}
.gal figure{margin:0}.gal a{display:block;overflow:hidden;border-radius:var(--r-img,6px)}
.gal img{width:100%;aspect-ratio:4/3;object-fit:cover;transition:transform .5s ease}
.gal a:hover img{transform:scale(1.03)}
.gal figcaption{padding-top:8px;font-size:14px;color:var(--muted)}
.quote-big{margin:0 0 0 auto;max-width:26ch;font-family:var(--fd);font-size:clamp(30px,4vw,56px);line-height:1.15;letter-spacing:var(--ht,-.02em)}
.quotes{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px 40px;margin-top:28px}
.quotes blockquote{margin:0;font-family:var(--fd);font-size:21px;line-height:1.4}
.book{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:18px 24px;align-content:start}
.book label{display:flex;flex-direction:column;gap:6px;font-size:14px;color:var(--muted)}
.book input,.book select{font:inherit;font-size:17px;color:var(--ink);min-height:50px;padding:0 14px;border:1px solid var(--line2,var(--line));border-radius:var(--r-in,10px);background:var(--field,#fff);width:100%}
.book button{grid-column:1/-1;justify-self:start}
.contact{display:flex;flex-wrap:wrap;gap:40px 72px}
.contact-text{flex:1 1 340px;display:flex;flex-direction:column;gap:16px}
.addr{display:flex;gap:10px;align-items:flex-start;margin:0;color:var(--muted)}.addr svg{margin-top:4px;flex:none}
.hours{margin:0;display:flex;flex-direction:column}
.hours div{display:flex;justify-content:space-between;gap:20px;padding:8px 0;border-bottom:1px solid var(--line)}
.hours dt{color:var(--muted)}.hours dd{margin:0;font-weight:500;text-align:right}
.phones{display:flex;flex-direction:column;gap:2px}
.phones a{font-family:var(--fd);font-size:24px;text-decoration:none;line-height:1.3}
.mail{color:var(--acc2,var(--ink))}
.map{flex:1.4 1 440px;min-height:340px;overflow:hidden;border-radius:var(--r-img,6px);background:var(--line)}
.map iframe{width:100%;height:100%;min-height:340px;border:0;display:block}
.foot-in{max-width:1200px;margin:0 auto;padding:32px 24px;font-size:14px;color:var(--muted);display:flex;flex-direction:column;gap:4px}
.foot-in p{margin:0}
.dock{display:none}
.bd{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.lb{padding:0;border:0;background:transparent;max-width:min(1200px,94vw);max-height:92vh}
.lb::backdrop{background:rgba(0,0,0,.86)}
.lb img{max-height:88vh;width:auto;margin:auto}
.lb-x{position:fixed;top:14px;right:14px;width:48px;height:48px;border-radius:50%;border:0;background:#fff;color:#111;cursor:pointer;display:flex;align-items:center;justify-content:center}
:focus-visible{outline:3px solid var(--acc);outline-offset:3px}
@media (max-width:820px){
.nav{display:none}
.btn-call{margin-left:auto}.btn-call span{display:none}.btn-call{width:46px;padding:0}
.dock{display:flex;position:fixed;left:10px;right:10px;bottom:10px;z-index:20;gap:6px;padding:6px;border-radius:18px;background:var(--dockBg,#fff);box-shadow:0 10px 30px rgba(0,0,0,.18)}
.dock a{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;border-radius:13px;color:var(--ink);text-decoration:none;font-weight:600;font-size:15px}
.dock a:first-child{background:var(--acc);color:var(--accInk)}
.foot{padding-bottom:76px}
.duo{gap:22px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;
