// Multi-page demo site for a copy/print shop: Početna, Usluge, O nama, Kontakt.
// Shared markup lives here; each skin (clay, minimal, glass, spatial) brings its CSS and may override any section.
const { esc, fmtPhone, telHref, hoursList, logo, showRating, steps } = require('../shared');
const ic = require('../ikone');
const varijante = require('./varijante');

const PAGES = [['', 'Početna'], ['usluge/', 'Usluge'], ['o-nama/', 'O nama'], ['kontakt/', 'Kontakt']];
const mapSrc = (b, l) => `https://maps.google.com/maps?q=${encodeURIComponent(`${b.name}, ${l.address}`)}&z=16&output=embed`;
// Grid spans so the last row is always full: first item may be 2×2, the last one stretches over what is left
const galCols = (n) => (n <= 3 || n === 6 ? 3 : 4);
function lastSpan(n, cols, firstCells) {
  const used = firstCells + (n - 1);
  const rem = used % cols;
  return rem ? cols - rem + 1 : 1;
}
function galSpan(n, i) {
  const cols = galCols(n), big = n >= 5;
  if (i === 0 && big) return 'grid-column:span 2;grid-row:span 2';
  if (i === n - 1) { const s = lastSpan(n, cols, big ? 4 : 1); return s > 1 ? `grid-column:span ${s}` : ''; }
  return '';
}
const stars = () =>`<span class="stars">${ic.zvezda.repeat(5)}</span>`;

// ───────── building blocks ─────────
const D = {
  head(b, ctx, title) {
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
<link href="https://fonts.googleapis.com/css2?${ctx.skin.fonts}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${ctx.root}stil.css">
</head>`;
  },

  header(b, ctx) {
    const links = PAGES.map(([href, label]) => `<a href="${ctx.root}${href}"${ctx.href === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
    const cta = b.phone ? `<a class="btn btn-primary head-cta" href="${telHref(b.phone)}">${ic.telefon}<span>${fmtPhone(b.phone)}</span></a>` : `<a class="btn btn-primary head-cta" href="mailto:${esc(b.email)}">${ic.mail}<span>Pišite nam</span></a>`;
    return `<header class="site-head"><div class="wrap head-in">
<a class="brand" href="${ctx.root}">${logo(b, { mono: (t) => `<span class="mono" aria-hidden="true">${esc(t)}</span>` }).replace(/src="logo/, `src="${ctx.root}logo`)}</a>
<nav class="menu" aria-label="Glavni meni">${links}</nav>
${cta}
<details class="mnav"><summary aria-label="Otvori meni">${ic.meni}</summary><nav>${links}<a href="mailto:${esc(b.email)}">${esc(b.email)}</a></nav></details>
</div></header>`;
  },

  footer(b, ctx) {
    const l0 = b.locations[0];
    return `<footer class="site-foot"><div class="wrap foot-grid">
<div class="foot-brand"><a class="brand" href="${ctx.root}">${logo(b, { mono: (t) => `<span class="mono" aria-hidden="true">${esc(t)}</span>` }).replace(/src="logo/, `src="${ctx.root}logo`)}</a><p>${esc(b.intro)}</p></div>
<nav class="foot-col" aria-label="Stranice"><h3>Stranice</h3>${PAGES.map(([h, l]) => `<a href="${ctx.root}${h}">${l}</a>`).join('')}</nav>
<div class="foot-col"><h3>Kontakt</h3><span>${esc(l0.address)}</span>${b.phone ? `<a href="${telHref(b.phone)}">${fmtPhone(b.phone)}</a>` : ''}<a href="mailto:${esc(b.email)}">${esc(b.email)}</a></div>
<div class="foot-col"><h3>Usluge</h3>${b.services.slice(0, 6).map((s) => `<a href="${ctx.root}usluge/#${s.id}">${esc(s.t)}</a>`).join('')}</div>
</div>
<div class="wrap foot-note"><span>© ${new Date().getFullYear()} ${esc(b.name)}</span><span>Predlog novog sajta za ${esc(b.name)}. Podaci su preuzeti sa vašeg postojećeg sajta i Google mape.</span></div>
</footer>`;
  },

  pageHead(b, ctx, kicker, title, lead) {
    return `<section class="page-hero"><div class="wrap">
<p class="crumbs"><a href="${ctx.root}">${esc(b.short || b.name)}</a> / ${esc(kicker)}</p>
<h1>${esc(title)}</h1>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
</div>${ctx.skin.pageDecor ? ctx.skin.pageDecor(b, ctx) : ''}</section>`;
  },

  sectionHead(kicker, title, note) {
    return `<div class="sec-head"><div><p class="kicker">${esc(kicker)}</p><h2>${esc(title)}</h2></div>${note ? `<p class="sec-note">${esc(note)}</p>` : ''}</div>`;
  },

  // Photo or, when a service has no fitting photo, a drawn panel with its icon
  visual(s, ctx, cls = '') {
    if (s.img) return `<figure class="photo ${cls}"><img src="${ctx.root}${s.img}" alt="${esc(s.t)}" loading="lazy"></figure>`;
    return `<figure class="illu ${cls}" aria-hidden="true"><span class="illu-icon">${ic[s.icon] || ic.stampa}</span><span class="illu-label">${esc(s.t)}</span></figure>`;
  },

  facts(b) {
    const f = [];
    if (b.since) f.push([String(b.since), 'godina osnivanja']);
    if (showRating(b.rating)) f.push([b.rating.value, `ocena na Google-u (${b.rating.count})`]);
    f.push([String(b.services.length), b.services.length === 1 ? 'usluga' : 'vrsta usluga']);
    if (b.locations.length > 1) f.push([String(b.locations.length), 'lokacije']);
    else f.push([b.city, b.area && b.area !== b.city ? b.area : 'lokacija']);
    if (b.formatsFact) f.push(b.formatsFact);
    if (b.look.pal) for (const [d, h] of hoursList(b.locations[0].hours)) if (f.length < 4 && d && !/ne radimo|zatvoreno/.test(h)) f.push([h.replace(/:00/g, '').replace(/(^|–)0(\d)/g, '$1$2').replace(/(\d)$/, '$1h'), d.toLowerCase()]);
    if (b.look.facts === 'strip') return `<section class="fstrip"><div class="wrap fstrip-in" style="--n:${f.slice(0, 4).length}">${f.slice(0, 4).map(([v, l]) => `<div><strong>${esc(v)}</strong><span>${esc(l)}</span></div>`).join('')}</div></section>`;
    return `<section class="facts"><div class="wrap facts-in">${f.slice(0, 4).map(([v, l]) => `<div class="fact"><strong>${esc(v)}</strong><span>${esc(l)}</span></div>`).join('')}</div></section>`;
  },

  hero(b, ctx) {
    const r = b.rating;
    if (b.look.hero === 'cover' && b.heroImg) return D.heroCover(b, ctx);
    return `<section class="hero${b.look.hero ? ' hero-' + b.look.hero : ''}"><div class="wrap hero-in">
<div class="hero-copy">
<p class="kicker">${esc(b.kind)} · ${esc(b.locations[0].address)}</p>
<h1>${esc(b.headline)}</h1>
<p class="lead">${esc(b.intro)}</p>
<div class="actions"><a class="btn btn-primary" href="mailto:${esc(b.email)}">${ic.upload}<span>${esc(b.cta || 'Pošaljite fajl')}</span></a><a class="btn btn-ghost" href="usluge/">Sve usluge ${ic.strelica}</a></div>
<div class="trust">${showRating(r) ? `<a href="${esc(r.url)}">${stars()}<span><strong>${esc(r.value)}</strong> · ${r.count} ocena na Google-u</span></a>` : ''}${b.since ? `<span>Od ${esc(b.since)}. godine</span>` : ''}${b.locations.length > 1 ? `<span>${b.locations.length} lokacije</span>` : ''}</div>
</div>
<div class="hero-art">${b.look.hero === 'mosaic' && b.gallery.length >= 3 ? `<div class="hm">${b.gallery.slice(0, 3).map((g) => `<figure class="photo"><img src="${ctx.root}${g.src}" alt="${esc(g.alt)}"></figure>`).join('')}</div>` : ctx.skin.heroArt(b, ctx)}</div>
</div></section>`;
  },

  servicesPreview(b, ctx) {
    if (b.look.svc && D['svc_' + b.look.svc]) return D['svc_' + b.look.svc](b, ctx);
    return `<section class="sec" id="usluge"><div class="wrap">
${D.sectionHead('Usluge', b.servicesTitle || 'Šta sve radimo', b.servicesNote || 'Za cenu i rok pošaljite fajl ili pozovite.')}
<div class="svc-grid">${b.services.map((s, i) => `<a class="svc-card${i === 0 ? ' svc-main' : ''}" href="usluge/#${s.id}"${ctx.skin.svcGrid && i === b.services.length - 1 && lastSpan(b.services.length, ctx.skin.svcGrid[0], ctx.skin.svcGrid[1]) > 1 ? ` style="grid-column:span ${lastSpan(b.services.length, ctx.skin.svcGrid[0], ctx.skin.svcGrid[1])}"` : ''}>
<span class="icon-box">${ic[s.icon] || ic.stampa}</span>${s.tag ? `<span class="tag">${esc(s.tag)}</span>` : ''}
<h3>${esc(s.t)}</h3><p>${esc(s.d)}</p><span class="more">Detaljnije ${ic.strelica}</span></a>`).join('\n')}</div>
</div></section>`;
  },

  feature(b, ctx) {
    const s = b.featured;
    return `<section class="sec feature"><div class="wrap feature-in">
${D.visual(s, ctx, 'feature-visual')}
<div class="feature-copy">
<p class="kicker">${esc(s.tag || 'Izdvajamo')}</p>
<h2>${esc(s.t)}</h2>
<p class="lead">${esc(s.long)}</p>
${s.bullets.length ? `<ul class="checks">${s.bullets.map((x) => `<li>${ic.cek}<span>${esc(x)}</span></li>`).join('')}</ul>` : ''}
<a class="btn btn-primary" href="mailto:${esc(b.email)}">${esc(b.cta || 'Pošaljite fajl')}</a>
</div></div></section>`;
  },

  process(b) {
    const st = steps(b);
    if (b.look.steps === 'line') return `<section class="sec process"><div class="wrap">
${D.sectionHead('Kako radimo', b.flow === 'stamparija' ? 'Od upita do gotovog tiraža' : 'Bez čekanja u redu')}
<ol class="tl">${st.map(([t, d], i) => `<li class="tl-item"><span class="tl-dot">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ol>
</div></section>`;
    return `<section class="sec process"><div class="wrap">
${D.sectionHead('Kako radimo', b.flow === 'stamparija' ? 'Od upita do gotovog tiraža' : 'Bez čekanja u redu')}
<ol class="steps">${st.map(([t, d], i) => `<li class="step"><span class="step-n">${String(i + 1).padStart(2, '0')}</span><span class="icon-box">${[ic.upload, ic.mail, ic.cek][i]}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}</ol>
</div></section>`;
  },

  gallery(b, ctx) {
    if (!b.gallery.length) return '';
    return `<section class="sec gallery"><div class="wrap">
${D.sectionHead(b.galleryKicker || 'Iz naše radnje', b.galleryTitle || 'Pogledajte šta radimo')}
<div class="gal-grid" style="--cols:${galCols(b.gallery.length)}">${b.gallery.map((g, i) => `<figure class="photo" style="${galSpan(b.gallery.length, i)}"><img src="${ctx.root}${g.src}" alt="${esc(g.alt)}" loading="lazy"></figure>`).join('')}</div>
</div></section>`;
  },

  why(b, ctx) {
    if (!b.why.length) return '';
    const wi = b.aboutImg || b.heroImg;
    if (b.look.why === 'split' && wi) return `<section class="sec why"><div class="wrap ws-in">
<figure class="photo ws-photo"><img src="${ctx.root}${wi.src}" alt="${esc(wi.alt)}" loading="lazy"></figure>
<div>${D.sectionHead('Zašto mi', b.whyTitle || 'Zašto nas biraju')}
<ul class="ws-list">${b.why.map(([t, d], i) => `<li><span class="why-n">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join('')}</ul></div>
</div></section>`;
    return `<section class="sec why"><div class="wrap">
${D.sectionHead('Zašto mi', b.whyTitle || 'Zašto nas biraju')}
<div class="why-grid">${b.why.map(([t, d], i) => `<div class="why-item"><span class="why-n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>
</div></section>`;
  },

  rating(b) {
    const r = b.rating;
    if (!showRating(r)) return '';
    return `<section class="sec rating"><div class="wrap rating-in">
<div class="rating-num"><strong>${esc(r.value)}</strong>${stars()}</div>
<div class="rating-copy"><h2>${r.count} ${r.count === 1 ? 'ocena' : 'ocena'} na Google-u</h2><p class="lead">${esc(b.ratingText || 'Pročitajte šta kažu ljudi koji su kod nas već štampali, pa se uverite sami.')}</p>
<a class="btn btn-ghost" href="${esc(r.url)}">Pročitajte recenzije ${ic.strelica}</a></div>
</div></section>`;
  },

  faq(b) {
    return `<section class="sec faq"><div class="wrap faq-in">
${D.sectionHead('Pitanja', 'Česta pitanja')}
<div class="faq-list">${b.faq.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</div></section>`;
  },

  locations(b, ctx, withMap = true) {
    return `<section class="sec locs" id="kontakt"><div class="wrap">
${D.sectionHead('Kontakt', b.locations.length > 1 ? 'Naše lokacije' : 'Gde se nalazimo')}
<div class="loc-grid">${b.locations.map((l) => `<article class="loc-card">
${withMap ? `<iframe class="map" src="${mapSrc(b, l)}" title="Mapa: ${esc(l.address)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : ''}
<div class="loc-body">
${l.label ? `<h3>${esc(l.label)}</h3>` : ''}
<p class="row">${ic.pin}<span>${esc(l.address)}</span></p>
${l.phones.map((p) => `<p class="row">${ic.telefon}<a href="${telHref(p)}">${fmtPhone(p)}</a></p>`).join('')}
${hoursList(l.hours).length ? `<div class="row">${ic.sat}<dl class="hours">${hoursList(l.hours).map(([d, h]) => `<dt>${esc(d)}</dt><dd>${esc(h)}</dd>`).join('')}</dl></div>` : ''}
<a class="more" href="${esc(l.maps)}">Otvori u Google mapama ${ic.strelica}</a>
</div></article>`).join('')}</div>
</div></section>`;
  },

  ctaBand(b, ctx) {
    return `<section class="cta-band"><div class="wrap cta-in">
<h2>${esc(b.ctaTitle || (b.flow === 'stamparija' ? 'Imate posao za štampu?' : 'Imate fajl za štampu?'))}</h2>
<p class="lead">${esc(b.flow === 'stamparija' ? 'Pošaljite upit i dobijate ponudu sa cenom i rokom.' : 'Pošaljite ga sada, a mi vam javimo cenu i kada je gotovo.')}</p>
<div class="actions"><a class="btn btn-primary" href="mailto:${esc(b.email)}">${ic.mail}<span>${esc(b.email)}</span></a>${b.phone ? `<a class="btn btn-ghost" href="${telHref(b.phone)}">${ic.telefon}<span>${fmtPhone(b.phone)}</span></a>` : ''}</div>
</div></section>`;
  },

  // ───────── layout variants (see varijante.js) ─────────
  topbar(b) {
    const l = b.locations[0], h = hoursList(l.hours)[0];
    return `<div class="topbar"><div class="wrap"><span>${ic.pin}${esc(l.address)}</span>${h ? `<span>${ic.sat}${esc(h.join(' ').trim())}</span>` : ''}<a href="mailto:${esc(b.email)}">${ic.mail}${esc(b.email)}</a></div></div>`;
  },

  heroCover(b, ctx) {
    const r = b.rating, h = hoursList(b.locations[0].hours);
    return `<section class="hero hero-cover">
<figure class="hc-bg"><img src="${ctx.root}${b.heroImg.src}" alt="${esc(b.heroImg.alt)}"></figure>
<div class="wrap hc-in">
<div class="hero-copy">
<p class="kicker">${esc(b.kind)} · ${esc(b.city)}</p>
<h1>${esc(b.headline)}</h1>
<p class="lead">${esc(b.intro)}</p>
<div class="actions"><a class="btn btn-primary" href="mailto:${esc(b.email)}">${ic.upload}<span>${esc(b.cta || 'Pošaljite fajl')}</span></a><a class="btn btn-ghost" href="usluge/">Sve usluge ${ic.strelica}</a></div>
<div class="trust">${showRating(r) ? `<a href="${esc(r.url)}">${stars()}<span><strong>${esc(r.value)}</strong> · ${r.count} ocena na Google-u</span></a>` : ''}${b.since ? `<span>Od ${esc(b.since)}. godine</span>` : ''}</div>
</div>
<aside class="hc-card">
<h3>${b.locations.length > 1 ? 'Naše lokacije' : 'Svratite'}</h3>
${b.locations.map((x) => `<p class="row">${ic.pin}<span>${esc(x.address)}</span></p>`).join('')}
${h.length ? `<div class="row">${ic.sat}<dl class="hours">${h.map(([d, x]) => `<dt>${esc(d)}</dt><dd>${esc(x)}</dd>`).join('')}</dl></div>` : ''}
${b.phone ? `<p class="row">${ic.telefon}<a href="${telHref(b.phone)}">${fmtPhone(b.phone)}</a></p>` : ''}
<p class="row">${ic.mail}<a href="mailto:${esc(b.email)}">${esc(b.email)}</a></p>
</aside>
</div></section>`;
  },

  svc_photo(b, ctx) {
    const n = b.services.length, wideFirst = n % 3 !== 0, wideLast = n % 3 === 1 && n > 1;
    // Each photo once: a service whose photo is already used (hero or an earlier card) gets its drawn panel
    const seen = new Set([b.heroImg && b.heroImg.src]);
    const uniq = (s) => { if (!s.img || seen.has(s.img)) return { ...s, img: null }; seen.add(s.img); return s; };
    return `<section class="sec" id="usluge"><div class="wrap">
${D.sectionHead('Usluge', b.servicesTitle || 'Šta sve radimo', b.servicesNote || 'Za cenu i rok pošaljite fajl ili pozovite.')}
<div class="sv-photos">${b.services.map((s, i) => { const w = (i === 0 && wideFirst) || (i === n - 1 && wideLast); return `<a class="sv-pc vcard${w ? ' wide' : ''}" href="usluge/#${s.id}"${w ? ' style="grid-column:span 2"' : ''}>
${D.visual(uniq(s), ctx)}
<div class="sv-pc-body">${s.tag ? `<span class="tag">${esc(s.tag)}</span>` : ''}<h3>${esc(s.t)}</h3><p>${esc(s.d)}</p><span class="more">Detaljnije ${ic.strelica}</span></div></a>`; }).join('\n')}</div>
</div></section>`;
  },

  svc_list(b) {
    return `<section class="sec" id="usluge"><div class="wrap">
${D.sectionHead('Usluge', b.servicesTitle || 'Šta sve radimo', b.servicesNote || 'Za cenu i rok pošaljite fajl ili pozovite.')}
<div class="sv-list">${b.services.map((s, i) => `<a class="sv-row" href="usluge/#${s.id}"><span class="sv-n">${String(i + 1).padStart(2, '0')}</span><span class="icon-box">${ic[s.icon] || ic.stampa}</span><span><h3>${esc(s.t)}</h3>${s.tag ? `<span class="tag">${esc(s.tag)}</span>` : ''}</span><p>${esc(s.d)}</p><span class="sv-go">${ic.strelica}</span></a>`).join('\n')}</div>
</div></section>`;
  },

  svc_split(b) {
    return `<section class="sec" id="usluge"><div class="wrap sv-split-in">
<div class="sv-split-head"><p class="kicker">Usluge</p><h2>${esc(b.servicesTitle || 'Šta sve radimo')}</h2><p>${esc(b.servicesNote || 'Za cenu i rok pošaljite fajl ili pozovite.')}</p><a class="btn btn-primary" href="usluge/">Sve usluge detaljno ${ic.strelica}</a></div>
<div class="sv-split-list">${b.services.map((s) => `<a class="sv-mini vcard" href="usluge/#${s.id}"><span class="icon-box">${ic[s.icon] || ic.stampa}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></a>`).join('\n')}</div>
</div></section>`;
  },

  marquee(b) {
    const t = b.services.map((s) => esc(s.t)).join(' ✦ ') + ' ✦ ';
    return `<div class="mq" aria-hidden="true"><div class="mq-track"><span>${t}</span><span>${t}</span></div></div>`;
  },

  statement(b) {
    return `<section class="sec stmt"><div class="wrap">
<p class="kicker">${b.since ? `Od ${esc(b.since)}.` : 'O nama'}</p>
<p class="stmt-text">${esc(b.story[0])}</p>
<a class="more" href="o-nama/">Naša priča ${ic.strelica}</a>
</div></section>`;
  },

  visit(b) {
    const l = b.locations[0], h = hoursList(l.hours);
    return `<section class="sec visit"><div class="wrap"><div class="visit-in vcard">
<div><p class="kicker">${b.locations.length > 1 ? `${b.locations.length} lokacije` : 'Svratite'}</p><h2>${b.locations.map((x) => esc(x.address)).join('<br>')}</h2>
<p class="lead">${esc(b.area && b.area !== b.city ? `${b.area}, ${b.city}` : b.city)}</p>
<div class="actions"><a class="btn btn-primary" href="${esc(l.maps)}">${ic.pin}<span>Otvori mapu</span></a>${b.phone ? `<a class="btn btn-ghost" href="${telHref(b.phone)}">${ic.telefon}<span>${fmtPhone(b.phone)}</span></a>` : ''}</div></div>
${h.length ? `<dl class="hours">${h.map(([d, x]) => `<dt>${esc(d)}</dt><dd>${esc(x)}</dd>`).join('')}</dl>` : `<p class="lead">Pišite na ${esc(b.email)}</p>`}
</div></div></section>`;
  },

  // ───────── services page ─────────
  serviceDetail(b, ctx) {
    if (b.look.detail === 'wide') return `<nav class="chips wrap" aria-label="Usluge">${b.services.map((s) => `<a href="#${s.id}">${esc(s.t)}</a>`).join('')}</nav>
${b.services.map((s, i) => `<section class="dw" id="${s.id}"><div class="wrap">
${D.visual(s, ctx, 'svc-visual')}
<div class="dw-in"><div class="dw-head"><span class="sv-n">${String(i + 1).padStart(2, '0')}</span><h2>${esc(s.t)}</h2>${s.tag ? `<span class="tag">${esc(s.tag)}</span>` : ''}</div>
<div class="dw-body"><p class="lead">${esc(s.d)}</p><p>${esc(s.long)}</p>
${s.bullets.length ? `<ul class="checks">${s.bullets.map((x) => `<li>${ic.cek}<span>${esc(x)}</span></li>`).join('')}</ul>` : ''}
<a class="more" href="mailto:${esc(b.email)}?subject=${encodeURIComponent('Upit: ' + s.t)}">Pošaljite upit za ovu uslugu ${ic.strelica}</a></div></div>
</div></section>`).join('\n')}`;
    return `<nav class="chips wrap" aria-label="Usluge">${b.services.map((s) => `<a href="#${s.id}">${esc(s.t)}</a>`).join('')}</nav>
${b.services.map((s, i) => `<section class="sec svc-detail${i % 2 ? ' flip' : ''}" id="${s.id}"><div class="wrap svc-detail-in">
${D.visual(s, ctx, 'svc-visual')}
<div class="svc-copy">
<span class="icon-box">${ic[s.icon] || ic.stampa}</span>${s.tag ? `<span class="tag">${esc(s.tag)}</span>` : ''}
<h2>${esc(s.t)}</h2>
<p class="lead">${esc(s.d)}</p>
<p>${esc(s.long)}</p>
${s.bullets.length ? `<ul class="checks">${s.bullets.map((x) => `<li>${ic.cek}<span>${esc(x)}</span></li>`).join('')}</ul>` : ''}
<a class="more" href="mailto:${esc(b.email)}?subject=${encodeURIComponent('Upit: ' + s.t)}">Pošaljite upit za ovu uslugu ${ic.strelica}</a>
</div></div></section>`).join('\n')}`;
  },

  // ───────── about page ─────────
  story(b, ctx) {
    return `<section class="sec story"><div class="wrap story-in">
<div class="story-copy">${b.story.map((p) => `<p class="lead">${esc(p)}</p>`).join('')}</div>
${b.aboutImg ? `<figure class="photo story-photo"><img src="${ctx.root}${b.aboutImg.src}" alt="${esc(b.aboutImg.alt)}" loading="lazy"></figure>` : `<div class="story-photo">${ctx.skin.heroArt(b, ctx)}</div>`}
</div></section>`;
  },

  // ───────── contact page ─────────
  contactForm(b) {
    return `<section class="sec form-sec"><div class="wrap form-in">
<div>${D.sectionHead('Upit', b.flow === 'stamparija' ? 'Zatražite ponudu' : 'Pošaljite poruku')}
<p class="lead">Popunite polja i otvoriće se vaš mail sa porukom spremnom za slanje na ${esc(b.email)}. Fajl dodajte kao prilog.</p></div>
<form class="form" id="upit" data-to="${esc(b.email)}">
<label>Ime i prezime<input name="ime" autocomplete="name" required></label>
<label>Telefon<input name="telefon" type="tel" autocomplete="tel"></label>
<label>Usluga<select name="usluga">${b.services.map((s) => `<option>${esc(s.t)}</option>`).join('')}<option>Nešto drugo</option></select></label>
<label class="full">Poruka<textarea name="poruka" rows="5" placeholder="${b.flow === 'stamparija' ? 'Šta štampate, tiraž, format, rok…' : 'Format, broj primeraka, boja, povez…'}"></textarea></label>
<button class="btn btn-primary" type="submit">${ic.mail}<span>Otvori mail sa porukom</span></button>
</form>
</div></section>
<script>
document.getElementById('upit').addEventListener('submit', function (e) {
  e.preventDefault();
  var f = e.target, v = function (n) { return f.elements[n].value.trim(); };
  var body = 'Ime: ' + v('ime') + '\\nTelefon: ' + v('telefon') + '\\nUsluga: ' + v('usluga') + '\\n\\n' + v('poruka');
  location.href = 'mailto:' + f.dataset.to + '?subject=' + encodeURIComponent('Upit sa sajta: ' + v('usluga')) + '&body=' + encodeURIComponent(body);
});
</script>`;
  },
};

function page(b, ctx, title, body) {
  return `${D.head(b, ctx, title)}
<body class="p-${ctx.page} sk-${b.template}${ctx.page === 'home' && b.look.hero === 'cover' && b.heroImg ? ' has-cover' : ''}">
${ctx.skin.bodyDecor ? ctx.skin.bodyDecor(b, ctx) : ''}
${b.look.topbar ? D.topbar(b, ctx) : ''}
${(ctx.skin.header || D.header)(b, ctx)}
<main>
${body}
</main>
${(ctx.skin.footer || D.footer)(b, ctx)}
</body>
</html>
`;
}

// Returns { 'index.html': html, 'usluge/index.html': html, ... , 'stil.css': css }
module.exports = function build(b, skin) {
  const S = { ...D, ...(skin.sections || {}) };
  const ctx = (page, href, root) => ({ skin, page, href, root, S });
  const order = b.look.order || skin.homeOrder || ['hero', 'facts', 'servicesPreview', 'feature', 'process', 'gallery', 'why', 'rating', 'faq', 'locations', 'ctaBand'];
  const home = ctx('home', '', '');
  const t = `${b.name} — ${b.kind}, ${b.city}`;
  return {
    'stil.css': skin.css + varijante,
    'index.html': page(b, home, t, order.map((k) => S[k](b, home)).join('\n')),
    'usluge/index.html': (() => { const c = ctx('usluge', 'usluge/', '../'); return page(b, c, `Usluge — ${b.name}`, [S.pageHead(b, c, 'Usluge', b.servicesTitle || 'Usluge', b.servicesIntro || b.intro), S.serviceDetail(b, c), S.faq(b, c), S.ctaBand(b, c)].join('\n')); })(),
    'o-nama/index.html': (() => { const c = ctx('o-nama', 'o-nama/', '../'); return page(b, c, `O nama — ${b.name}`, [S.pageHead(b, c, 'O nama', b.aboutTitle || `O nama`, b.since ? `${b.name}, od ${b.since}. godine.` : b.kind + ', ' + b.city), S.story(b, c), S.facts(b, c), S.why(b, c), S.gallery(b, c), S.rating(b, c), S.ctaBand(b, c)].join('\n')); })(),
    'kontakt/index.html': (() => { const c = ctx('kontakt', 'kontakt/', '../'); return page(b, c, `Kontakt — ${b.name}`, [S.pageHead(b, c, 'Kontakt', 'Kontakt', b.locations.length > 1 ? `${b.locations.length} lokacije, jedan mail: ${b.email}` : `${b.locations[0].address} · ${b.email}`), S.locations(b, c), S.contactForm(b, c), S.faq(b, c)].join('\n')); })(),
  };
};
module.exports.D = D;
