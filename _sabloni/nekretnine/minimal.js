// Design 1: minimalism. White, one deep accent (cobalt by default) and one warm action color.
// Skeleton: hero = list of featured objects on the left + big photo with an accent info band on the right,
// offer grid with 1px gutters and a segmented filter, accent band with services, contact with a form.
const Z = require('./zajednicko');
const { esc } = Z;

const PAL = { ink: '#111317', paper: '#FFFFFF', acc: '#1B2C6E', hot: '#E36A35', line: '#E3E5EA', muted: '#5B616E', onHot: '#111317' };

module.exports = function minimal(b) {
  const p = { ...PAL, ...(b.pal?.minimal || {}) };
  const L = b.listings;
  const feat = (b.projects || (b.featured || [0, 1, 2, 3, 4, 5]).map((i) => L[i]).filter(Boolean)).map((x) => ({
    name: x.t, price: x.priceText || Z.price(x), sub: x.sub || Z.facts(x) || x.place || '', desc: x.desc || [x.type, x.place].filter(Boolean).join(', '),
    img: x.img ? `img/${x.img}.jpg` : '', count: x.count, parking: x.parking, i: L.indexOf(x),
  }));
  const f0 = feat[0];
  const types = Z.types(b);
  const deals = Z.deals(b);
  const filt = (key, vals, label) => vals.length > 1 ? `<div class="m-seg" role="group" aria-label="${label}"><button type="button" data-key="${key}" data-val="">Sve</button>${vals.map((v) => `<button type="button" data-key="${key}" data-val="${esc(v)}">${esc(key === 'deal' ? (v === 'izdavanje' ? 'Izdavanje' : 'Prodaja') : v)}</button>`).join('')}</div>` : '';

  const body = `<div class="m">
<header class="m-head"><div class="m-w">
<a class="m-brand" href="#vrh"><span class="m-word">${esc(b.word || b.short || b.name)}</span><span class="m-tag">${esc(b.tagline)}</span></a>
<nav class="m-nav" aria-label="Glavni meni"><a href="#ponuda">Ponuda</a><a href="#usluge">Usluge</a><a href="#kontakt">Kontakt</a></nav>
<a class="m-tel" href="${Z.tel(b)}">${esc(Z.phone(b))}</a>
</div></header>

<section class="m-w m-hero" id="vrh">
<div class="m-hero-l">
<h1>${Z.nl(b.title)}${b.titleAccent ? `<span>${esc(b.titleAccent)}</span>` : ''}</h1>
<p class="m-lead">${esc(b.intro)}</p>
<div class="m-rows">${feat.map((x, i) => `<button type="button" data-pick="${i}" aria-pressed="${i === 0}"><span class="r-n">${esc(x.name)}</span><span class="r-p">${esc(x.price)}</span><span class="r-s">${esc(x.count ? x.count + ' stanova' : x.sub)}</span></button>`).join('')}</div>
</div>
<div class="m-hero-r">
<img data-show="img" src="${esc(f0.img)}" alt="${esc(f0.name)}" fetchpriority="high">
<div class="m-band">
<div class="m-band-t"><div class="m-band-n" data-show="name">${esc(f0.name)}</div><div data-show="desc">${esc(f0.desc)}</div></div>
<dl><div><dt>Cena</dt><dd data-show="price">${esc(f0.price)}</dd></div><div><dt>${b.projects ? 'Stanova' : 'Detalji'}</dt><dd data-show="sub">${esc(b.projects ? f0.count : f0.sub)}</dd></div></dl>
<a class="m-btn" href="#kontakt">${esc(b.ctaVisit || 'Zakažite razgledanje')}</a>
</div>
</div>
</section>

<section class="m-w m-sec" id="ponuda">
<div class="m-sec-h"><div><h2>${esc(b.offerTitle || 'Ponuda')}</h2>${b.offerSub ? `<p>${esc(b.offerSub)}</p>` : ''}</div><div class="m-filt">${filt('deal', deals, 'Prodaja ili izdavanje')}${filt('type', types, 'Vrsta nekretnine')}</div></div>
<div class="m-grid" data-grid>${L.map((x, i) => `<article ${Z.cardAttrs(x, i)}>
${Z.img(x.img, Z.alt(x), 'm-ph')}
<div class="m-c-top"><span class="m-c-pr">${esc(Z.price(x))}</span><span class="m-c-ty">${esc(x.deal === 'izdavanje' ? 'izdavanje' : x.type)}</span></div>
<h3>${esc(x.t)}</h3>
<p class="m-c-f">${esc(Z.facts(x))}</p>
<a href="#" data-open="${i}" class="m-c-a">Pogledajte detalje</a>
</article>`).join('')}</div>
<p data-empty hidden class="m-empty">Za ovaj izbor trenutno nema oglasa. Pozovite nas, imamo i ponudu koja nije na sajtu.</p>
${b.offerMore ? `<p class="m-more">${esc(b.offerMore)}</p>` : ''}
</section>

<section class="m-acc" id="usluge"><div class="m-w m-acc-in">
<div class="m-acc-l"><h2>${esc(b.servicesTitle || 'Šta radimo za vas')}</h2><p>${esc(b.about)}</p></div>
<ul class="m-svc">${b.services.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
</div></section>

<section class="m-w m-sec m-ct" id="kontakt">
<div class="m-ct-l">
<h2>${esc(b.contactTitle || 'Pišite nam ili pozovite')}</h2>
<p>${esc(b.contactText || 'Recite nam šta tražite ili šta prodajete. Javljamo se istog dana.')}</p>
<div class="m-ct-d">${b.phones.map((_, i) => `<a href="${Z.tel(b, i)}"><b>${esc(Z.phone(b, i))}</b></a>`).join('')}${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}<span>${esc(b.address)}</span>${b.hours ? `<span>${esc(b.hours)}</span>` : ''}</div>
</div>
<form class="m-form"${Z.formAttrs(b, 'Upit sa sajta')}>
<label>Ime<input name="Ime" type="text" autocomplete="name"></label>
<label>Telefon<input name="Telefon" type="tel" autocomplete="tel"></label>
<label class="w">Nekretnina<select name="Nekretnina"><option>Tražim nešto drugo</option>${L.map((x) => `<option>${esc(x.t)}</option>`).join('')}<option>Želim da prodam ili izdam</option></select></label>
<label class="w">Poruka<textarea name="Poruka" rows="3"></textarea></label>
<button type="submit" class="m-btn">Pošaljite upit</button>
</form>
</section>

<footer class="m-foot"><div class="m-w"><span>© ${esc(b.legal || b.name)} · ${esc(b.address)}${b.reg ? ` · Reg. br. posrednika ${esc(b.reg)}` : ''}</span><span>${Z.demoNote(b)}${Z.photoNote(b)}</span></div></footer>
</div>
<script>window.__picks=${JSON.stringify(feat.map((x) => ({ img: x.img, name: x.name, desc: x.desc, price: x.price, sub: b.projects ? String(x.count) : x.sub }))).replace(/</g, '\\u003c')}</script>`;

  const css = `
.m{font-family:'Archivo',sans-serif;color:${p.ink};background:${p.paper};--d-bg:${p.paper};--d-fg:${p.ink};--d-acc:${p.acc};--d-on:#fff;--d-head:'Instrument Serif',serif;--d-hw:400}
.m a{color:${p.acc}}
.m-w{max-width:1320px;margin:0 auto;padding-left:clamp(16px,4vw,40px);padding-right:clamp(16px,4vw,40px)}
.m-head{border-bottom:1px solid ${p.line}}
.m-head .m-w{padding-top:16px;padding-bottom:16px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 32px}
.m-brand{text-decoration:none;display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 12px;color:${p.ink}!important}
.m-word{font-family:'Instrument Serif',serif;font-size:28px;letter-spacing:.3em;text-transform:uppercase}
.m-tag{font-size:13px;color:${p.muted}}
.m-nav{display:flex;flex-wrap:wrap;gap:0 30px;font-size:12px;text-transform:uppercase;letter-spacing:.16em;font-stretch:115%}
.m-nav a{color:${p.ink};text-decoration:none;padding:12px 0}
.m-tel{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border:1px solid ${p.ink};color:${p.ink}!important;text-decoration:none;font-weight:500;font-size:14px;letter-spacing:.08em}
.m-hero{padding-top:clamp(28px,5vw,64px);display:flex;flex-wrap:wrap;gap:40px}
.m-hero-l{flex:1 1 380px;min-width:0;display:flex;flex-direction:column;gap:26px}
.m h1{margin:0;font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(46px,6vw,92px);line-height:.95;letter-spacing:-.02em}
.m h1 span{display:block;font-style:italic;color:${p.acc}}
.m-lead{margin:0;font-size:18px;line-height:1.65;font-weight:300;color:#3A3F4A;max-width:46ch}
.m-rows{border-top:1px solid ${p.ink}}
.m-rows button{width:100%;display:flex;align-items:center;gap:16px;min-height:56px;padding:0 14px;border:0;border-bottom:1px solid ${p.line};background:${p.paper};color:${p.ink};cursor:pointer;text-align:left}
.m-rows button[aria-pressed=true]{background:${p.acc};color:#fff}
.r-n{flex:1 1 auto;font-size:16px;font-weight:500;min-width:0}
.r-p{font-size:15px;font-variant-numeric:tabular-nums;white-space:nowrap}
.r-s{width:150px;text-align:right;font-size:12px;line-height:1.3;opacity:.8}
.m-hero-r{flex:1.4 1 520px;min-width:0;display:flex;flex-direction:column}
.m-hero-r>img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:${p.line}}
.m-band{background:${p.acc};color:#fff;padding:22px 26px;display:flex;flex-wrap:wrap;gap:14px 36px;align-items:flex-end}
.m-band-t{flex:1 1 220px;font-size:15px;opacity:.95}
.m-band-n{font-family:'Instrument Serif',serif;font-size:32px;line-height:1.05;margin-bottom:6px}
.m-band dl{margin:0;display:flex;flex-wrap:wrap;gap:8px 28px;font-size:14px}
.m-band dt{opacity:.8}.m-band dd{margin:0;font-family:'Instrument Serif',serif;font-size:28px}.m-band dd[data-show=sub]{font-size:20px;max-width:24ch;line-height:1.2}
.m-btn{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 26px;background:${p.hot};color:${p.onHot}!important;font-weight:600;letter-spacing:.04em;text-decoration:none;border:0;cursor:pointer}
.m-sec{padding-top:clamp(56px,8vw,112px)}
.m-sec-h{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:28px}
.m h2{margin:0;font-family:'Instrument Serif',serif;font-weight:400;font-size:clamp(36px,4.4vw,60px);line-height:1.02}
.m-sec-h p{margin:10px 0 0;font-size:16px;color:${p.muted}}
.m-filt{display:flex;flex-wrap:wrap;gap:12px}
.m-seg{display:flex;flex-wrap:wrap;border:1px solid ${p.ink}}
.m-seg button{min-height:44px;padding:0 16px;border:0;background:${p.paper};color:${p.ink};font-size:15px;cursor:pointer}
.m-seg button[aria-pressed=true]{background:${p.ink};color:#fff}
.m-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:1px;padding:1px}
.m-grid article{background:${p.paper};outline:1px solid ${p.line};padding:18px;display:flex;flex-direction:column;gap:10px}
.m-ph{width:100%;aspect-ratio:3/2;object-fit:cover;display:block;background:${p.line}}
.m-c-top{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-top:4px}
.m-c-pr{font-family:'Instrument Serif',serif;font-size:34px;line-height:1;font-variant-numeric:tabular-nums}
.m-c-ty{font-size:13px;color:${p.muted};text-align:right}
.m-grid h3{margin:0;font-size:16px;font-weight:500;line-height:1.35}
.m-c-f{margin:0;font-size:14px;color:${p.muted}}
.m-c-a{margin-top:auto;align-self:flex-start;display:inline-flex;align-items:center;min-height:44px;font-weight:600;text-decoration:underline;text-underline-offset:4px}
.m-empty,.m-more{font-size:16px;color:${p.muted};margin:20px 0 0}
.m-acc{margin-top:clamp(56px,8vw,112px);background:${p.acc};color:#fff}
.m-acc-in{padding-top:clamp(40px,6vw,80px);padding-bottom:clamp(40px,6vw,80px);display:flex;flex-wrap:wrap;gap:36px 64px}
.m-acc-l{flex:1 1 320px}.m-acc-l p{margin:16px 0 0;font-size:17px;line-height:1.6;max-width:42ch;opacity:.95}
.m-svc{flex:2 1 520px;margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0 40px;align-content:start}
.m-svc li{padding:14px 0;border-bottom:1px solid rgba(255,255,255,.25);font-size:16px;line-height:1.45}
.m-ct{display:flex;flex-wrap:wrap;gap:48px;padding-bottom:clamp(56px,8vw,112px)}
.m-ct-l{flex:1 1 320px;display:flex;flex-direction:column;gap:16px}
.m-ct-l p{margin:0;font-size:17px;line-height:1.55;color:#3A3F4A}
.m-ct-d{display:flex;flex-direction:column;gap:6px;font-size:17px}
.m-ct-d a b{color:${p.ink}}.m-ct-d span{color:${p.muted}}
.m-form{flex:1.3 1 420px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;align-content:start}
.m-form label{display:flex;flex-direction:column;gap:6px;font-size:14px;font-weight:600}
.m-form .w{grid-column:1/-1}
.m-form input,.m-form select,.m-form textarea{min-height:48px;border:1px solid ${p.ink};padding:10px 14px;font:inherit;font-weight:400;background:${p.paper};color:${p.ink};border-radius:0}
.m-form .m-btn{grid-column:1/-1;justify-self:start}
.m-foot{border-top:1px solid ${p.line}}
.m-foot .m-w{padding-top:22px;padding-bottom:22px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px 24px;font-size:14px;color:${p.muted}}
@media (max-width:520px){.r-s{display:none}.m-word{font-size:24px}}
`;
  return Z.page(b, 'minimal', {
    title: `${b.name}: ${b.city ? 'nekretnine, ' + b.city : 'nekretnine'}`,
    fonts: 'family=Archivo:wdth,wght@62..125,300..700&family=Instrument+Serif:ital@0;1',
    css, body,
  });
};
