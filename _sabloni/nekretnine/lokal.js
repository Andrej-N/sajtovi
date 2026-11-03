// Design 2: warm, local agency. Forest green, beige, ochre; Bitter + Rethink Sans; rounded photos and pill buttons.
// Skeleton: split hero with a captioned photo, offer by neighbourhood (chips), green band with who they are + services +
// map, optional agents, ochre "Prodajete?" contact block.
const Z = require('./zajednicko');
const { esc } = Z;

const PAL = { green: '#2D4A37', beige: '#F6F0E4', ochre: '#E2B13C', ink: '#2A2620', card: '#FFFDF8', muted: '#5C5346', line: '#B9AC94', mint: '#D8E0D3' };

module.exports = function lokal(b) {
  const p = { ...PAL, ...(b.pal?.lokal || {}) };
  const L = b.listings;
  const hi = b.lokalHero ?? b.hero ?? 0;
  const h = L[hi];
  const areas = [...new Set(L.map((x) => x.area || x.place).filter(Boolean))];
  const byArea = areas.length >= 3 && areas.length <= 9 && !L.some((x) => x.cat);
  const chipVals = byArea ? areas : Z.types(b);
  const r = Z.rating(b);
  const band = (b.bandImgs || L.filter((x, i) => i !== hi && x.img).slice(0, 2).map((x) => x.img)).slice(0, 2);

  const body = `<div class="l">
<header class="l-head">
<a href="#vrh" class="l-brand"><span class="l-name">${esc(b.short || b.name)}</span><span class="l-tag">${esc(b.lokalTag || `nekretnine, ${b.city}${b.since ? ', od ' + b.since + '.' : ''}`)}</span></a>
<nav aria-label="Glavni meni"><a href="#ponuda">Ponuda</a><a href="#ko-smo">Ko smo</a><a href="#kontakt">Kontakt</a></nav>
<a class="l-pill" href="${Z.tel(b)}">${esc(Z.phone(b))}</a>
</header>

<section class="l-hero" id="vrh">
<div class="l-hero-t">
<h1>${Z.nl(b.title)}</h1>
<p>${esc(b.intro)}</p>
<div class="l-hero-a"><a class="l-btn" href="#ponuda">Pogledajte ponudu</a>${r ? `<a class="l-rate" href="${esc(r.url)}" target="_blank" rel="noopener"><b>${esc(r.value)}</b> na Google-u · ${r.count} recenzija</a>` : ''}</div>
</div>
<figure class="l-hero-f">${Z.img(h.img, h.t, '', false)}<figcaption><b>${esc([h.place, Z.m2(h), Z.price(h)].filter(Boolean).join(' · '))}</b><br>${esc(h.t)}</figcaption></figure>
</section>

<section class="l-sec" id="ponuda">
<h2>${byArea ? 'Ponuda po krajevima' : 'Naša ponuda'}</h2>
<div class="l-chips" role="group" aria-label="${byArea ? 'Kraj' : 'Vrsta'}"><button type="button" data-key="${byArea ? 'place' : 'type'}" data-val="">${byArea ? 'Svi krajevi' : 'Sve'}</button>${chipVals.map((v) => `<button type="button" data-key="${byArea ? 'place' : 'type'}" data-val="${esc(v)}">${esc(v)}</button>`).join('')}</div>
<div class="l-grid" data-grid>${L.map((x, i) => `<article ${Z.cardAttrs(x, i)}><a href="#" data-open="${i}">
${x.img ? Z.img(x.img, Z.alt(x)) : `<div class="l-noph">${esc(x.type)}</div>`}
<div class="l-c"><div class="l-c-top"><span>${esc(x.area || x.place || '')}</span><span>${esc(x.deal === 'izdavanje' ? x.type + ', izdavanje' : x.type)}</span></div>
<span class="l-c-pr">${esc(Z.price(x))}</span>
<span class="l-c-t">${esc(x.t)}</span>
${Z.facts(x) ? `<span class="l-c-f">${esc(Z.facts(x))}${x.price && x.m2 && typeof x.m2 === 'number' && !x.per && x.type === 'Stan' ? ' · ' + Z.dot(x.price / x.m2) + ' €/m²' : ''}</span>` : ''}
</div></a></article>`).join('')}</div>
<p data-empty hidden class="l-empty">Trenutno nema oglasa za ovaj izbor. Pozovite nas, ponuda se menja svake nedelje.</p>
</section>

<section class="l-band" id="ko-smo"><div class="l-band-in">
<div class="l-band-t">
<h2>${esc(b.lokalAboutTitle || 'Ko smo i šta radimo')}</h2>
<p>${esc(b.about)}</p>
<ul>${b.services.slice(0, 8).map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
</div>
<div class="l-band-m">${band.map((s) => Z.img(s, b.name)).join('')}<iframe title="Mapa: ${esc(b.address)}" src="${Z.mapSrc(b)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
</div></section>

${b.agents ? `<section class="l-sec l-ag"><h2>Ko vas vodi</h2><div class="l-ag-g">${b.agents.map((a, i) => `<div class="l-ag-c"><span aria-hidden="true" class="l-av${i % 2 ? ' alt' : ''}">${esc(a.name.split(' ').map((w) => w[0]).join('').slice(0, 2))}</span><div><b>${esc(a.name)}</b>${a.role ? `<div>${esc(a.role)}</div>` : ''}${a.phone ? `<a href="${Z.telHref(a.phone)}">${esc(Z.fmtPhone(a.phone))}</a>` : ''}</div></div>`).join('')}</div></section>` : ''}

<section class="l-sec" id="kontakt"><div class="l-ct">
<div class="l-ct-t"><h2>Prodajete kuću ili stan?</h2><p>${esc(b.lokalSell || `Svratite u kancelariju (${b.address}) ili nas pozovite. Dolazimo da pogledamo nekretninu i kažemo vam realnu cenu.`)}</p></div>
<div class="l-ct-c">${b.phones.map((_, i) => `<a href="${Z.tel(b, i)}">${esc(Z.phone(b, i))}</a>`).join('')}${b.email ? `<a class="l-ct-m" href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}${b.hours ? `<span>${esc(b.hours)}</span>` : ''}</div>
</div></section>
<footer class="l-foot"><span>${esc(b.legal || b.name)} · ${esc(b.address)}${b.reg ? ` · Reg. br. ${esc(b.reg)}` : ''}</span><span>${Z.demoNote(b)}${Z.photoNote(b)}</span></footer>
</div>`;

  const css = `
.l{font-family:'Rethink Sans',sans-serif;color:${p.ink};background:${p.beige};--d-bg:${p.beige};--d-fg:${p.ink};--d-acc:${p.green};--d-on:${p.beige};--d-head:'Bitter',serif;--d-hw:700;--d-r:16px}
.l a{color:${p.green}}
.l-head,.l-hero,.l-sec,.l-foot,.l-band-in{max-width:1320px;margin:0 auto;padding-left:clamp(16px,4vw,40px);padding-right:clamp(16px,4vw,40px)}
.l-head{padding-top:18px;padding-bottom:18px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 28px}
.l-brand{text-decoration:none;display:flex;flex-direction:column}
.l-name{font-family:'Bitter',serif;font-size:25px;font-weight:700;color:${p.green}}
.l-tag{font-size:14px;color:${p.muted}}
.l-head nav{display:flex;flex-wrap:wrap;gap:0 26px;font-size:16px;font-weight:500}
.l-head nav a{color:${p.ink};text-decoration:none;padding:12px 0}
.l-pill{display:inline-flex;align-items:center;min-height:46px;padding:0 20px;border-radius:999px;background:${p.green};color:${p.beige}!important;text-decoration:none;font-weight:600}
.l-hero{padding-top:clamp(12px,3vw,32px);display:flex;flex-wrap:wrap;gap:32px 48px;align-items:center}
.l-hero-t{flex:1 1 380px;min-width:0}
.l h1{margin:0;font-family:'Bitter',serif;font-weight:700;font-size:clamp(36px,4.6vw,64px);line-height:1.05;color:${p.green}}
.l-hero-t>p{margin:22px 0 0;font-size:18px;line-height:1.6;max-width:46ch}
.l-hero-a{display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;margin-top:28px}
.l-btn{display:inline-flex;align-items:center;min-height:52px;padding:0 26px;border-radius:999px;background:${p.ochre};color:${p.ink}!important;text-decoration:none;font-weight:600}
.l-rate{font-size:15px;color:${p.ink}!important;text-decoration:none}.l-rate b{font-size:20px;color:${p.green}}
.l-hero-f{flex:1.2 1 480px;min-width:0;margin:0;position:relative}
.l-hero-f img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;border-radius:20px}
.l-hero-f figcaption{position:absolute;left:16px;bottom:16px;right:16px;max-width:max-content;background:${p.beige};border-radius:14px;padding:12px 16px;font-size:15px;line-height:1.4}
.l-sec{padding-top:clamp(56px,7vw,96px)}
.l h2{margin:0 0 18px;font-family:'Bitter',serif;font-weight:700;font-size:clamp(28px,3.4vw,44px);color:${p.green}}
.l-chips{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:28px}
.l-chips button{min-height:44px;padding:0 18px;border-radius:999px;font-size:15px;font-weight:500;cursor:pointer;background:transparent;color:${p.ink};border:1px solid ${p.line}}
.l-chips button[aria-pressed=true]{background:${p.green};color:${p.beige};border-color:${p.green}}
.l-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:24px}
.l-grid a{display:flex;flex-direction:column;height:100%;background:${p.card};border-radius:18px;overflow:hidden;color:${p.ink}!important;text-decoration:none}
.l-grid img,.l-noph{width:100%;aspect-ratio:3/2;object-fit:cover;display:block}
.l-noph{background:${p.mint};display:flex;align-items:flex-end;padding:16px;font-family:'Bitter',serif;font-size:26px;color:${p.green}}
.l-c{padding:16px 18px 18px;display:flex;flex-direction:column;gap:6px}
.l-c-top{display:flex;justify-content:space-between;gap:10px;font-size:13px;color:${p.muted}}
.l-c-top span:first-child{font-size:14px;font-weight:600;color:${p.green}}
.l-c-pr{font-family:'Bitter',serif;font-size:25px;font-weight:700}
.l-c-t{font-size:15px;line-height:1.4}
.l-c-f{font-size:14px;color:${p.muted}}
.l-grid a:hover .l-c-t{text-decoration:underline}
.l-empty{font-size:16px;color:${p.muted}}
.l-band{margin-top:clamp(56px,7vw,96px);background:${p.green};color:${p.beige}}
.l-band-in{padding-top:clamp(40px,6vw,80px);padding-bottom:clamp(40px,6vw,80px);display:flex;flex-wrap:wrap;gap:40px 56px}
.l-band-t{flex:1 1 360px}
.l-band h2{color:${p.beige}}
.l-band-t p{margin:0;font-size:17px;line-height:1.6}
.l-band ul{margin:20px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px 20px;font-size:16px}
.l-band li{display:flex;gap:10px;align-items:baseline}
.l-band li::before{content:"";flex:0 0 10px;height:10px;border-radius:50%;background:${p.ochre};transform:translateY(1px)}
.l-band-m{flex:1.2 1 440px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.l-band-m img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:14px;display:block}
.l-band-m iframe{grid-column:1/-1;width:100%;height:240px;border:0;border-radius:14px;background:${p.mint}}
.l-ag-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px}
.l-ag-c{background:${p.card};border-radius:18px;padding:22px;display:flex;gap:16px;align-items:center}
.l-ag-c b{font-size:18px}.l-ag-c div div{font-size:15px;color:${p.muted}}.l-ag-c a{display:inline-block;margin-top:6px;font-weight:600}
.l-av{flex:0 0 60px;height:60px;border-radius:50%;background:${p.ochre};display:flex;align-items:center;justify-content:center;font-family:'Bitter',serif;font-weight:700;font-size:21px}
.l-av.alt{background:${p.mint}}
.l-ct{background:${p.ochre};border-radius:24px;padding:clamp(28px,4vw,48px);display:flex;flex-wrap:wrap;gap:28px 48px;align-items:center;justify-content:space-between}
.l-ct h2{color:${p.ink}}
.l-ct-t{flex:1 1 360px}.l-ct-t p{margin:0;font-size:17px;line-height:1.6}
.l-ct-c{display:flex;flex-direction:column;gap:8px;font-size:18px;font-weight:600}
.l-ct-c a{color:${p.ink}!important}.l-ct-m{font-weight:500;font-size:16px}.l-ct-c span{font-size:15px;font-weight:500}
.l-foot{padding-top:28px;padding-bottom:32px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px 24px;font-size:14px;color:${p.muted}}
`;
  return Z.page(b, 'lokal', {
    title: `${b.name}: nekretnine${b.city ? ', ' + b.city : ''}`,
    fonts: 'family=Bitter:wght@500;700&family=Rethink+Sans:wght@400;500;600',
    css, body,
  });
};
