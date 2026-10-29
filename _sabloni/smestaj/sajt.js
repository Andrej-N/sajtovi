// One-page demo site for accommodation (apartments, villas, small hotels).
// Markup is shared; each skin (tamni, spatial, staklo, neumorf) brings fonts + CSS and picks a hero variant.
// b.look can recolor (pal), reorder sections (order), and switch hero / units / gallery variants.
const { esc, fmtPhone, telHref, showRating } = require('../shared');

const ORDER = ['smestaj', 'ukljuceno', 'dodatno', 'galerija', 'okolina', 'ocena', 'kontakt'];
const mapSrc = (b) => `https://maps.google.com/maps?q=${encodeURIComponent(b.mapQuery || `${b.name}, ${b.address}`)}&z=15&output=embed`;
const viber = (p) => 'viber://chat?number=%2B381' + String(p).replace(/\D/g, '').replace(/^381/, '').replace(/^0/, '');
const nl = (s) => esc(s).replace(/\n/g, '<br>');
const img = (x, cls = '', sizes = '') => x ? `<img class="${cls}" src="${esc(x.src)}" alt="${esc(x.alt)}" loading="lazy" decoding="async"${sizes}>` : '';
const ICON = {
  tel: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/></svg>',
  chat: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>',
  x: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
};

// ───────── sections ─────────
const S = {
  header(b) {
    const links = [['smestaj', b.units ? 'Smeštaj' : null], ['galerija', b.gallery.length >= 3 ? 'Galerija' : null], ['okolina', b.nearby ? 'Okolina' : null], ['kontakt', 'Kontakt']].filter((l) => l[1]);
    return `<header class="top"><div class="wrap top-in">
<a class="brand" href="#vrh">${esc(b.short || b.name)}</a>
<nav class="nav" aria-label="Glavni meni">${links.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>
<a class="btn btn-call" href="${telHref(b.phones[0])}">${ICON.tel}<span>${fmtPhone(b.phones[0])}</span></a>
</div></header>`;
  },

  rating(b, cls = 'hero-rating') {
    if (!showRating(b.rating)) return '';
    return `<a class="${cls}" href="${esc(b.rating.url)}" target="_blank" rel="noopener">${ICON.star}<b>${esc(b.rating.value)}</b><span>${b.rating.count} ocena na Google-u</span></a>`;
  },

  facts(b) {
    if (!b.facts?.length) return '';
    return `<dl class="facts">${b.facts.map(([v, l]) => `<div><dt>${esc(v)}</dt><dd>${esc(l)}</dd></div>`).join('')}</dl>`;
  },

  ctas(b) {
    return `<div class="ctas"><a class="btn btn-main" href="#upit">Pitajte za slobodne termine</a><a class="btn btn-alt" href="${telHref(b.phones[0])}">${ICON.tel}Pozovite</a></div>`;
  },

  hero(b, v) {
    const h = b.hero;
    const kicker = `<p class="kicker">${esc(b.kicker)}</p>`;
    const title = `<h1>${nl(b.title)}</h1>`;
    if (v === 'full') return `<section class="hero hero-full" id="vrh">
${img(h, 'hero-bg', ' fetchpriority="high"').replace(' loading="lazy"', '')}
<div class="hero-shade"></div>
<div class="wrap hero-in">${kicker}${title}
<div class="hero-row"><p class="lead">${esc(b.intro)}</p>${S.facts(b)}</div>
${S.ctas(b)}${S.rating(b)}</div></section>`;
    if (v === 'prozori') return `<section class="hero hero-win" id="vrh"><div class="env">
${img(h, 'hero-bg', ' fetchpriority="high"').replace(' loading="lazy"', '')}
<div class="wrap hero-in">
<div class="win win-main">${kicker}${title}<p class="lead">${esc(b.intro)}</p>${S.ctas(b)}${S.rating(b)}</div>
${b.facts?.length ? `<div class="win win-side">${b.facts.slice(0, 2).map(([v2, l]) => `<div class="big">${esc(v2)}</div><p>${esc(l)}</p>`).join('')}</div>` : ''}
</div></div></section>`;
    if (v === 'staklo') return `<div class="bgfix" style="background-image:url('${esc(h.src)}')"></div>
<section class="hero hero-glass" id="vrh"><div class="wrap hero-in">
<div class="glass hero-card">${kicker}${title}<p class="lead">${esc(b.intro)}</p>${S.ctas(b)}${S.rating(b, 'hero-rating chip')}</div>
${S.facts(b)}</div></section>`;
    // split (neumorf)
    return `<section class="hero hero-split" id="vrh"><div class="wrap hero-in">
<div class="hero-text">${kicker}${title}<p class="lead">${esc(b.intro)}</p>${S.ctas(b)}</div>
<div class="hero-media raised">${img(h, 'well', ' fetchpriority="high"').replace(' loading="lazy"', '')}${S.facts(b)}</div>
</div></section>`;
  },

  upit(b) {
    const send = b.email ? `data-mail="${esc(b.email)}"` : `data-viber="${esc(viber(b.phones[0]))}"`;
    return `<section class="upit-wrap" id="upit"><form class="wrap upit" ${send}>
<p class="upit-title">${b.email ? 'Pošaljite upit' : 'Pitajte za termin'}</p>
<label>Dolazak<input type="date" name="od" required></label>
<label>Odlazak<input type="date" name="do" required></label>
<label>Broj osoba<input type="text" name="osobe" inputmode="numeric" placeholder="npr. 2 + 1 dete" required></label>
<button class="btn btn-main" type="submit">${b.email ? 'Pošaljite upit' : 'Pošaljite na Viber'}</button>
<p class="upit-note">${esc(b.bookingNote || 'Rezervacija direktno kod domaćina, bez provizije.')}</p>
</form></section>`;
  },

  smestaj(b, v) {
    const u = b.units;
    if (!u) return '';
    const items = u.list.map((x, i) => {
      const meta = [x.guests && `${x.guests}`, x.size].filter(Boolean).map(esc).join(' · ');
      if (v === 'redovi') return `<li class="unit-row"><span class="unit-n">${esc(x.n || String(i + 1))}</span><div><h3>${esc(x.name)}</h3>${meta ? `<p class="unit-meta">${meta}</p>` : ''}${x.desc ? `<p>${esc(x.desc)}</p>` : ''}</div></li>`;
      return `<li class="unit-card">${x.img ? img(x.img, 'unit-img') : ''}<div class="unit-body"><h3>${esc(x.name)}</h3>${meta ? `<p class="unit-meta">${meta}</p>` : ''}${x.desc ? `<p>${esc(x.desc)}</p>` : ''}</div></li>`;
    }).join('');
    return `<section class="sec" id="smestaj"><div class="wrap">
<div class="sec-head"><h2>${nl(u.title)}</h2>${u.note ? `<p>${esc(u.note)}</p>` : ''}</div>
<ul class="units units-${v}">${items}</ul>
${u.price ? `<p class="price-note">${esc(u.price)}</p>` : ''}
</div></section>`;
  },

  ukljuceno(b) {
    if (!b.amenities?.length) return '';
    return `<section class="sec sec-alt" id="ukljuceno"><div class="wrap split">
<h2>${nl(b.amenitiesTitle || 'Šta dobijate')}</h2>
<ul class="amen">${b.amenities.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
</div></section>`;
  },

  dodatno(b) {
    if (!b.extras?.length) return '';
    return `<section class="sec" id="dodatno"><div class="wrap">
${b.extrasTitle ? `<div class="sec-head"><h2>${nl(b.extrasTitle)}</h2></div>` : ''}
<div class="extras">${b.extras.map((x) => `<article class="extra">${x.img ? img(x.img, 'extra-img') : ''}<div class="extra-body"><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p>${x.list ? `<ul>${x.list.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}</div></article>`).join('')}</div>
</div></section>`;
  },

  galerija(b) {
    if (b.gallery.length < 3) return '';
    return `<section class="sec" id="galerija"><div class="wrap">
<div class="sec-head"><h2>${nl(b.galleryTitle || 'Kako izgleda kod nas')}</h2></div>
<div class="gal">${b.gallery.map((g) => `<a href="${esc(g.src)}" data-lb>${img(g)}</a>`).join('')}</div>
</div></section>`;
  },

  okolina(b) {
    if (!b.nearby && !b.distances) return '';
    return `<section class="sec sec-alt" id="okolina"><div class="wrap">
<div class="sec-head"><h2>${nl(b.nearbyTitle || 'U blizini')}</h2>${b.nearbyNote ? `<p>${esc(b.nearbyNote)}</p>` : ''}</div>
${b.distances ? `<dl class="dist">${b.distances.map(([v, l]) => `<div><dt>${esc(v)}</dt><dd>${esc(l)}</dd></div>`).join('')}</dl>` : ''}
${b.nearby ? `<ul class="near">${b.nearby.map(([t, d]) => `<li><b>${esc(t)}</b>${d ? `<span>${esc(d)}</span>` : ''}</li>`).join('')}</ul>` : ''}
${b.placeImg ? `<figure class="place">${img(b.placeImg)}</figure>` : ''}
</div></section>`;
  },

  ocena(b) {
    if (!showRating(b.rating)) return '';
    return `<section class="sec rating-band"><div class="wrap rating-in">
<div class="rating-num">${esc(b.rating.value)}</div>
<div><p class="rating-t">Prosečna ocena od ${b.rating.count} gostiju na Google-u</p><a class="btn btn-alt" href="${esc(b.rating.url)}" target="_blank" rel="noopener">Pročitajte utiske</a></div>
</div></section>`;
  },

  kontakt(b) {
    return `<section class="sec contact" id="kontakt"><div class="wrap contact-in">
<div class="contact-text">
<h2>${nl(b.contactTitle || 'Javite nam se')}</h2>
<p class="addr">${ICON.pin}<span>${esc(b.address)}</span></p>
<div class="phones">${b.phones.map((p) => `<a href="${telHref(p)}">${fmtPhone(p)}</a>`).join('')}</div>
${b.email ? `<a class="mail" href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}
<div class="ctas"><a class="btn btn-main" href="${telHref(b.phones[0])}">${ICON.tel}Pozovite</a><a class="btn btn-alt" href="${esc(viber(b.phones[0]))}">${ICON.chat}Viber</a></div>
${b.checkin ? `<p class="checkin">${esc(b.checkin)}</p>` : ''}
</div>
<div class="map"><iframe src="${mapSrc(b)}" loading="lazy" title="Mapa: ${esc(b.name)}" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
</div></section>`;
  },

  footer(b) {
    const credits = b.credits.length ? `<p class="credits">Fotografije okoline: ${b.credits.map((c) => `<a href="${esc(c.page)}" target="_blank" rel="noopener">${esc(c.author)}</a> (${esc(c.license)})`).join(', ')}, Wikimedia Commons.</p>` : '';
    return `<footer class="foot"><div class="wrap foot-in">
<p><b>${esc(b.name)}</b> · ${esc(b.address)} · <a href="${telHref(b.phones[0])}">${fmtPhone(b.phones[0])}</a></p>
<p>Predlog novog sajta za ${esc(b.name)}. Podaci su preuzeti sa vašeg postojećeg sajta i Google mape.</p>
${credits}
</div></footer>
<nav class="dock" aria-label="Brzi kontakt"><a href="${telHref(b.phones[0])}">${ICON.tel}Pozovite</a><a href="${esc(viber(b.phones[0]))}">${ICON.chat}Viber</a><a href="#upit">Upit</a></nav>
<dialog class="lb" aria-label="Fotografija"><button class="lb-x" type="button" aria-label="Zatvori">${ICON.x}</button><img alt=""></dialog>`;
  },
};

const SCRIPT = `<script>
document.querySelectorAll('form.upit').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var d=new FormData(f);
var t='Dobar dan, zanima me smeštaj.\\nDolazak: '+d.get('od')+'\\nOdlazak: '+d.get('do')+'\\nBroj osoba: '+d.get('osobe');
if(f.dataset.mail)location.href='mailto:'+f.dataset.mail+'?subject='+encodeURIComponent('Upit za smeštaj')+'&body='+encodeURIComponent(t);
else location.href=f.dataset.viber+'&text='+encodeURIComponent(t);});});
var lb=document.querySelector('.lb');if(lb&&lb.showModal){var li=lb.querySelector('img');
document.querySelectorAll('[data-lb]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();li.src=a.href;li.alt=a.querySelector('img').alt;lb.showModal();});});
lb.addEventListener('click',function(e){if(e.target===lb||e.target.closest('.lb-x'))lb.close();});}
</script>`;

module.exports = function sajt(b, skin) {
  const look = b.look || {};
  const order = look.order || ORDER;
  const v = { hero: look.hero || skin.hero, units: look.units || skin.units };
  const body = [S.header(b), S.hero(b, v.hero), S.upit(b), ...order.map((k) => S[k](b, v.units)), S.footer(b)].join('\n');
  const html = `<!doctype html>
<html lang="sr-Latn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(b.name)} · ${esc(b.placeName)}</title>
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
${body}
${SCRIPT}
</body>
</html>`;
  return { 'index.html': html };
};

// Layout shared by all skins; skins only paint it.
const BASE = `*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
html,body{overflow-x:clip}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--fb);font-size:17px;line-height:1.6}
img{max-width:100%;display:block}
a{color:inherit}
p,li,dd,span{overflow-wrap:anywhere}
h1,h2,h3{font-family:var(--fd);font-weight:var(--hw,400);margin:0;line-height:1.02;letter-spacing:var(--ht,-.02em)}
h2{font-size:clamp(36px,4.6vw,64px)}
h3{font-size:clamp(22px,2vw,28px);line-height:1.15}
.wrap{max-width:1240px;margin:0 auto;padding:0 20px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 24px;font:inherit;font-weight:600;text-decoration:none;cursor:pointer;border:0;transition:transform .15s ease,background-color .15s ease,box-shadow .15s ease}
.btn:active{transform:translateY(1px)}
.btn svg{flex:none}
.top{position:relative;z-index:5}
.top-in{display:flex;align-items:center;justify-content:space-between;gap:16px 32px;padding-top:18px;padding-bottom:18px}
.brand{font-family:var(--fd);font-size:26px;text-decoration:none;line-height:1.1}
.nav{display:flex;gap:26px;margin-left:auto}
.nav a{text-decoration:none;font-size:15px}
.btn-call{min-height:46px;padding:0 18px}
.kicker{margin:0 0 16px;font-size:16px}
.hero h1{font-size:clamp(46px,8vw,128px)}
.lead{font-size:19px;max-width:42ch;margin:0}
.ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.hero-rating{display:inline-flex;align-items:center;gap:8px;margin-top:22px;text-decoration:none;font-size:15px}
.facts{display:flex;flex-wrap:wrap;gap:16px 40px;margin:0}
.facts div{min-width:90px}.facts dt{font-family:var(--fd);font-size:40px;line-height:1}.facts dd{margin:6px 0 0;font-size:14px}
.upit{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:16px 24px;align-items:end;padding-top:26px;padding-bottom:26px}
.upit-title{grid-column:1/-1;margin:0;font-family:var(--fd);font-size:26px;line-height:1}
.upit label{display:flex;flex-direction:column;gap:6px;font-size:13px}
.upit input{font:inherit;font-size:17px;padding:12px 14px;min-height:50px;width:100%}
.upit-note{grid-column:1/-1;margin:0;font-size:14px}
.sec{padding:clamp(64px,9vw,120px) 0}
.sec-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px 56px;margin-bottom:44px}
.sec-head p{margin:0;max-width:46ch}
.units{list-style:none;margin:0;padding:0}
.units-redovi{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:0 56px}
.unit-row{display:flex;gap:22px;padding:24px 0}
.unit-n{flex:0 0 52px;font-family:var(--fd);font-size:46px;line-height:.9}
.unit-row h3{font-family:var(--fb);font-size:18px;font-weight:600;letter-spacing:0}
.unit-row p{margin:4px 0 0}
.unit-meta{font-size:15px}
.units-kartice{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:22px}
.unit-card{display:flex;flex-direction:column;overflow:hidden}
.unit-img{aspect-ratio:4/3;object-fit:cover;width:100%}
.unit-body{padding:22px 24px 26px}.unit-body p{margin:6px 0 0}
.price-note{margin:32px 0 0;font-size:15px}
.split{display:flex;flex-wrap:wrap;gap:32px 80px}
.split h2{flex:1 1 300px}
.amen{flex:2 1 520px;list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0 44px}
.amen li{padding:16px 0}
.extras{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:22px}
.extra{overflow:hidden;display:flex;flex-direction:column}
.extra-img{aspect-ratio:3/2;object-fit:cover;width:100%}
.extra-body{padding:26px}.extra-body p{margin:8px 0 0}.extra-body ul{margin:12px 0 0;padding-left:18px}
.gal{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:clamp(150px,18vw,250px);gap:12px}
.gal a{display:block;overflow:hidden}
.gal a:first-child{grid-column:span 2;grid-row:span 2}
.gal img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.gal a:hover img{transform:scale(1.04)}
.dist{display:flex;flex-wrap:wrap;gap:20px 56px;margin:0 0 40px}
.dist dt{font-family:var(--fd);font-size:clamp(38px,4vw,56px);line-height:1}.dist dd{margin:6px 0 0;font-size:15px}
.near{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0 44px}
.near li{padding:18px 0;display:flex;flex-direction:column;gap:2px}
.near b{font-family:var(--fd);font-size:24px;font-weight:var(--hw,400);line-height:1.15}
.place{margin:44px 0 0}.place img{width:100%;aspect-ratio:21/8;object-fit:cover}
.rating-in{display:flex;flex-wrap:wrap;align-items:center;gap:24px 56px}
.rating-num{font-family:var(--fd);font-size:clamp(96px,13vw,180px);line-height:.85}
.rating-t{font-size:22px;margin:0 0 18px;max-width:28ch}
.contact-in{display:flex;flex-wrap:wrap;gap:40px 64px}
.contact-text{flex:1 1 380px;display:flex;flex-direction:column;gap:18px}
.addr{display:flex;gap:10px;align-items:flex-start;margin:0}.addr svg{margin-top:4px;flex:none}
.phones{display:flex;flex-direction:column;gap:2px}
.phones a{font-family:var(--fd);font-size:30px;text-decoration:none;line-height:1.2}
.contact .ctas{margin-top:6px}
.checkin{margin:0;font-size:15px}
.map{flex:1 1 480px;min-height:360px;overflow:hidden}
.map iframe{width:100%;height:100%;min-height:360px;border:0;display:block}
.foot-in{padding-top:36px;padding-bottom:36px;font-size:14px;display:flex;flex-direction:column;gap:6px}
.foot-in p{margin:0}
.credits{font-size:12px}
.dock{display:none}
.lb{padding:0;border:0;background:transparent;max-width:min(1200px,94vw);max-height:92vh}
.lb::backdrop{background:rgba(0,0,0,.86)}
.lb img{max-height:88vh;width:auto;margin:auto}
.lb-x{position:fixed;top:14px;right:14px;width:48px;height:48px;border-radius:50%;border:0;background:#fff;color:#111;cursor:pointer;display:flex;align-items:center;justify-content:center}
:focus-visible{outline:3px solid var(--acc);outline-offset:3px}
@media (max-width:820px){
.nav{display:none}
.btn-call span{display:none}.btn-call{width:46px;padding:0}
.gal{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:150px}
.dock{display:flex;position:fixed;left:10px;right:10px;bottom:10px;z-index:20;gap:6px;padding:6px;border-radius:18px;background:var(--dock-bg,#111);box-shadow:0 12px 30px rgba(0,0,0,.3)}
.dock a{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;border-radius:13px;color:var(--dock-fg,#fff);text-decoration:none;font-weight:600;font-size:15px}
.dock a:first-child{background:var(--acc);color:var(--acc-fg)}
.foot{padding-bottom:76px}
.phones a{font-size:26px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;
