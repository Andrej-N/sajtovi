// Design 3: premium. Near-black, ivory and muted gold, Cormorant Garamond + Jost.
// Skeleton: full-bleed photo of their best listing as the hero, ivory "about" band with a quote,
// collection with one wide object and the rest in two columns, a strip of neighbourhoods, "we search for you" form.
const Z = require('./zajednicko');
const { esc } = Z;

const PAL = { bg: '#0D0D0C', ivory: '#F4EFE6', gold: '#B8975A', goldL: '#D9BE86', soft: '#C9C2B6', panel: '#1E1D1A' };

module.exports = function premium(b) {
  const p = { ...PAL, ...(b.pal?.premium || {}) };
  const L = b.listings;
  const hi = b.hero ?? 0;
  const h = L[hi];
  const heroImg = b.heroImg || h.img;
  const deals = Z.deals(b);
  const types = Z.types(b);
  const [key, vals] = deals.length > 1 ? ['deal', deals] : ['type', types];
  const lbl = (v) => key === 'deal' ? (v === 'izdavanje' ? 'Izdavanje' : 'Prodaja') : v;
  const areas = b.areas || [...new Set(L.map((x) => x.area || x.place).filter(Boolean))].slice(0, 6);

  const body = `<div class="p">
<section class="p-hero" id="vrh">
${Z.img(heroImg, h.t, 'p-hero-img', false)}
<div class="p-shade"></div>
<header class="p-head">
<a href="#vrh" class="p-word">${esc((b.word || b.short || b.name).toUpperCase())}</a>
<nav aria-label="Glavni meni"><a href="#kolekcija">Ponuda</a><a href="#o-nama">O nama</a><a href="#trazimo">Tražimo za vas</a><a href="#kontakt">Kontakt</a></nav>
<a class="p-tel" href="${Z.tel(b)}">${esc(Z.phone(b))}</a>
</header>
<div class="p-hero-in">
<div class="p-hero-t">
<p class="p-loc">${esc([h.place, b.city].filter(Boolean).join(', '))}</p>
<h1>${esc(b.heroTitle || h.t)}</h1>
<p class="p-hero-l">${esc(b.heroText || [Z.facts(h), h.note].filter(Boolean).join('. '))}</p>
</div>
<div class="p-hero-c">
<span class="p-hero-p">${esc(Z.price(h))}</span>
<div class="p-ctas"><a class="p-btn" href="#" data-open="${hi}">Pogledajte nekretninu</a><a class="p-ghost" href="#kontakt">Zakažite razgledanje</a></div>
</div>
</div>
</section>

<section class="p-ivory" id="o-nama"><div class="p-ivory-in">
<blockquote>${esc(b.quote || b.title.replace(/\n/g, ' '))}</blockquote>
<div><p>${esc(b.about)}</p>${b.since ? `<p class="p-since">Na tržištu od ${esc(b.since)}.</p>` : ''}</div>
</div></section>

<section class="p-col" id="kolekcija">
<div class="p-col-h"><h2>${esc(b.collectionTitle || 'Iz naše ponude')}</h2>${vals.length > 1 ? `<div class="p-tabs" role="group" aria-label="Izbor"><button type="button" data-key="${key}" data-val="">Sve</button>${vals.map((v) => `<button type="button" data-key="${key}" data-val="${esc(v)}">${esc(lbl(v))}</button>`).join('')}</div>` : ''}</div>
<div class="p-grid" data-grid>${L.map((x, i) => `<article ${Z.cardAttrs(x, i)}><a href="#" data-open="${i}" class="p-card">
${x.img ? Z.img(x.img, Z.alt(x), 'p-ph') : '<div class="p-ph p-noph"></div>'}
<div class="p-c-h"><h3>${esc(x.t)}</h3><span>${esc(Z.price(x))}</span></div>
<p>${esc([x.place, Z.facts(x)].filter(Boolean).join(' · '))}</p>
</a></article>`).join('')}</div>
<p data-empty hidden class="p-empty">Za ovaj izbor trenutno nema oglasa na sajtu. Pitajte nas, ponuda se menja svakog dana.</p>
</section>

${areas.length > 2 ? `<section class="p-areas" aria-label="Lokacije"><div>${areas.map((a) => `<span>${esc(a)}</span>`).join('')}</div></section>` : ''}

<section class="p-find" id="trazimo">
<div class="p-find-l"><h2>Ne vidite ono što tražite?</h2><p>Opišite nam stan, kuću ili lokal koji tražite. Javljamo se čim nađemo nešto što odgovara.</p></div>
<form${Z.formAttrs(b, 'Tražim nekretninu')}>
<label>Ime i prezime<input name="Ime" type="text" autocomplete="name"></label>
<label>Telefon<input name="Telefon" type="tel" autocomplete="tel"></label>
<label>Lokacija<input name="Lokacija" type="text" placeholder="${esc(areas[0] ? 'npr. ' + areas[0] : 'deo grada')}"></label>
<label>Budžet<input name="Budžet" type="text" placeholder="do ${esc(Z.dot(Math.max(50000, Math.round(((L.find((x) => x.price && !x.per) || {}).price || 100000) / 10000) * 10000)))} €"></label>
<button type="submit" class="p-btn">Pošaljite zahtev</button>
</form>
</section>

<footer class="p-foot" id="kontakt">
<div class="p-foot-in">
<div><div class="p-word p-word-d">${esc((b.word || b.short || b.name).toUpperCase())}</div><p>${esc(b.address)}${b.reg ? `<br>Broj u registru posrednika ${esc(b.reg)}` : ''}${b.hours ? `<br>${esc(b.hours)}` : ''}</p></div>
<div class="p-foot-c">${b.phones.map((_, i) => `<a href="${Z.tel(b, i)}">${esc(Z.phone(b, i))}</a>`).join('')}${b.email ? `<a class="p-mail" href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}</div>
</div>
<p class="p-note">${Z.demoNote(b)}${Z.photoNote(b)}</p>
</footer>
</div>`;

  const css = `
.p{font-family:'Jost',sans-serif;font-weight:300;color:${p.ivory};background:${p.bg};--d-bg:${p.bg};--d-fg:${p.ivory};--d-acc:${p.gold};--d-on:${p.bg};--d-head:'Cormorant Garamond',serif;--d-hw:500}
.p a{color:${p.goldL}}
.p-hero{position:relative;min-height:clamp(620px,62vw,900px);display:flex;flex-direction:column;overflow:hidden}
.p-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.p-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,13,12,.6) 0%,rgba(13,13,12,0) 30%,rgba(13,13,12,.2) 55%,rgba(13,13,12,.9) 100%)}
.p-head{position:relative;max-width:1360px;width:100%;margin:0 auto;padding:24px clamp(18px,4vw,48px);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 32px}
.p-word{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:500;letter-spacing:.26em;color:${p.ivory}!important;text-decoration:none}
.p-head nav{display:flex;flex-wrap:wrap;gap:0 28px;font-size:15px;font-weight:400}
.p-head nav a{color:${p.ivory};text-decoration:none;padding:12px 0}
.p-tel{font-size:15px;font-weight:400;color:${p.ivory}!important;text-decoration:none;border-bottom:1px solid ${p.gold};padding:10px 0}
.p-hero-in{position:relative;margin-top:auto;max-width:1360px;width:100%;margin-left:auto;margin-right:auto;padding:0 clamp(18px,4vw,48px) clamp(36px,5vw,64px);display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:28px}
.p-hero-t{max-width:820px}
.p-loc{margin:0 0 14px;font-size:16px;font-weight:400;color:${p.goldL}}
.p h1{margin:0;font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(42px,6vw,96px);line-height:1;letter-spacing:-.01em}
.p-hero-l{margin:20px 0 0;font-size:18px;line-height:1.6;max-width:52ch}
.p-hero-c{display:flex;flex-direction:column;align-items:flex-start;gap:16px}
.p-hero-p{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:500}
.p-ctas{display:flex;flex-wrap:wrap;gap:12px}
.p-btn{display:inline-flex;align-items:center;min-height:50px;padding:0 26px;background:${p.gold};color:${p.bg}!important;text-decoration:none;font-weight:500;font-size:15px;border:0;cursor:pointer}
.p-ghost{display:inline-flex;align-items:center;min-height:50px;padding:0 22px;border:1px solid ${p.ivory};color:${p.ivory}!important;text-decoration:none;font-weight:400;font-size:15px}
.p-ivory{background:${p.ivory};color:${p.bg}}
.p-ivory-in{max-width:1100px;margin:0 auto;padding:clamp(64px,9vw,128px) clamp(18px,4vw,48px);display:flex;flex-wrap:wrap;gap:40px 72px;align-items:flex-start}
.p-ivory blockquote{flex:1.4 1 440px;margin:0;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(30px,3.6vw,52px);line-height:1.12}
.p-ivory-in>div{flex:1 1 300px;font-size:17px;line-height:1.7;font-weight:400;color:#34312C}
.p-ivory-in>div p{margin:0}.p-since{margin-top:16px!important;color:#7A5F2C}
.p-col{max-width:1360px;margin:0 auto;padding:clamp(64px,8vw,112px) clamp(18px,4vw,48px)}
.p-col-h{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:40px}
.p h2{margin:0;font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(38px,4.6vw,66px);line-height:1.02}
.p-tabs{display:flex;flex-wrap:wrap;gap:4px 26px}
.p-tabs button{min-height:44px;padding:0;background:none;border:0;border-bottom:1px solid transparent;color:#A39C90;font-size:17px;font-weight:400;cursor:pointer}
.p-tabs button[aria-pressed=true]{color:${p.ivory};border-color:${p.gold}}
.p-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:56px 40px}
.p-grid article:first-child:not([hidden]){grid-column:1/-1}
.p-card{display:block;color:${p.ivory}!important;text-decoration:none}
.p-ph{width:100%;display:block;object-fit:cover;aspect-ratio:4/3;background:${p.panel}}
.p-grid article:first-child .p-ph{aspect-ratio:21/9}
.p-c-h{display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-top:18px;border-top:1px solid rgba(184,151,90,.5);padding-top:14px}
.p-grid h3{margin:0;font-family:'Cormorant Garamond',serif;font-weight:500;font-size:28px;line-height:1.1}
.p-c-h span{font-family:'Cormorant Garamond',serif;font-size:25px;color:${p.goldL};white-space:nowrap}
.p-card p{margin:8px 0 0;font-size:15px;font-weight:400;color:${p.soft}}
.p-card:hover h3{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:5px}
.p-empty{color:${p.soft};font-size:16px}
.p-areas{border-top:1px solid rgba(184,151,90,.4);border-bottom:1px solid rgba(184,151,90,.4)}
.p-areas div{max-width:1360px;margin:0 auto;padding:34px clamp(18px,4vw,48px);display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px 32px;font-family:'Cormorant Garamond',serif;font-size:clamp(26px,3vw,44px)}
.p-find{max-width:1360px;margin:0 auto;padding:clamp(64px,8vw,112px) clamp(18px,4vw,48px);display:flex;flex-wrap:wrap;gap:48px 80px}
.p-find-l{flex:1 1 340px}.p-find-l p{margin:20px 0 0;font-size:17px;line-height:1.7;font-weight:400;color:${p.soft};max-width:40ch}
.p-find form{flex:1.3 1 440px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:22px 28px}
.p-find label{display:flex;flex-direction:column;gap:8px;font-size:13px;font-weight:400;color:${p.goldL}}
.p-find input{min-height:46px;background:transparent;border:0;border-bottom:1px solid #6E675C;color:${p.ivory};font:inherit;font-size:17px;border-radius:0}
.p-find input::placeholder{color:#8F887C}
.p-find .p-btn{justify-self:start}
.p-foot{background:${p.ivory};color:${p.bg}}
.p-foot-in{max-width:1360px;margin:0 auto;padding:56px clamp(18px,4vw,48px) 28px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:32px}
.p-word-d{color:${p.bg}!important;font-size:30px}
.p-foot-in p{margin:12px 0 0;font-size:15px;font-weight:400;color:#4A463F;line-height:1.6}
.p-foot-c{display:flex;flex-direction:column;gap:6px;font-size:17px;font-weight:400}
.p-foot-c a{color:${p.bg}}.p-foot-c .p-mail{color:#7A5F2C}
@media (max-width:700px){.p-head nav{display:none}.p-hero{min-height:640px}.p-hero-p{font-size:36px}}
.p-note{max-width:1360px;margin:0 auto;padding:0 clamp(18px,4vw,48px) 28px;font-size:13px;font-weight:400;color:#5E594F}
`;
  return Z.page(b, 'premium', {
    title: `${b.name}: ${h.t}`,
    fonts: 'family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500',
    css, body,
  });
};
