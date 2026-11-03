// Design 4: brutalism. Off-white paper, black rules, one flat signal color, Anton + IBM Plex Mono.
// Skeleton: black data strip, giant headline, search form that filters the grid, hard-shadow cards with a fact table,
// black "Prodajete?" block with their steps (or services), big phone numbers.
const Z = require('./zajednicko');
const { esc } = Z;

const PAL = { ink: '#000000', paper: '#F2F1EC', sig: '#C7D0BE', card: '#FFFFFF', link: '#0000EE' };

module.exports = function brutal(b) {
  const p = { ...PAL, ...(b.pal?.brutal || {}) };
  const L = b.listings;
  const types = Z.types(b);
  const deals = Z.deals(b);
  const priced = L.filter((x) => x.price && !x.per).map((x) => x.price).sort((a, c) => a - c);
  const caps = [50000, 100000, 150000, 250000, 500000, 1000000].filter((c) => priced.length && c >= priced[0] && c <= priced[priced.length - 1] * 1.5).slice(0, 4);
  const sel = (key, label, opts) => `<label>${label}<select data-key="${key}"><option value="">Sve</option>${opts.map(([v, t]) => `<option value="${esc(v)}">${esc(t)}</option>`).join('')}</select></label>`;
  const left = b.steps ? 'Prodajete?' : 'Usluge';
  const big = b.big || `Nekretnine\n${b.city}`;

  const body = `<div class="b">
<header class="b-top">
<a href="#vrh" class="b-name">${esc((b.word || b.name).toUpperCase())}</a>
<span>${esc(b.address)}</span>
${b.reg ? `<span>Reg. broj posrednika ${esc(b.reg)}</span>` : b.since ? `<span>Od ${esc(b.since)}.</span>` : ''}
${b.phones.slice(0, 2).map((_, i) => `<a href="${Z.tel(b, i)}">${esc(Z.phone(b, i))}</a>`).join('')}
</header>

<section class="b-hero" id="vrh">
<h1>${Z.nl(big)}</h1>
<div class="b-hero-row">
<p>${esc(b.intro)}</p>
<form class="b-find" data-find>
${deals.length > 1 ? sel('deal', 'Za', deals.map((d) => [d, d === 'izdavanje' ? 'Iznajmljivanje' : 'Prodaju'])) : ''}
${types.length > 1 ? sel('type', 'Tip', types.map((t) => [t, t])) : ''}
${caps.length > 1 ? sel('max', 'Cena do', caps.map((c) => [c, Z.dot(c) + ' €'])) : ''}
<button type="submit">Traži</button>
</form>
</div>
</section>

<section class="b-sec" id="ponuda">
<div class="b-bar">
<div class="b-tabs" role="group" aria-label="Tip nekretnine"><button type="button" data-key="type" data-val="">SVE <span>${L.length}</span></button>${types.map((t) => `<button type="button" data-key="type" data-val="${esc(t)}">${esc(t.toUpperCase())} <span>${L.filter((x) => x.type === t).length}</span></button>`).join('')}</div>
<button type="button" class="b-sort" data-sort data-asc="CENA: OD NAJNIŽE" data-desc="CENA: OD NAJVIŠE">SORTIRAJ PO CENI</button>
</div>
<div class="b-grid" data-grid>${L.map((x, i) => `<article ${Z.cardAttrs(x, i)}>
${x.img ? Z.img(x.img, Z.alt(x), 'b-ph') : `<div class="b-noph">${esc(x.type)}</div>`}
<div class="b-pr">${esc(Z.price(x))}</div>
<h3>${esc(x.t)}</h3>
<dl>
<dt>TIP</dt><dd>${esc(x.type)}${x.deal === 'izdavanje' ? ', izdavanje' : ''}</dd>
${x.place ? `<dt>MESTO</dt><dd>${esc(x.place)}</dd>` : ''}
${Z.m2(x) ? `<dt>POVRŠ.</dt><dd>${esc(Z.m2(x))}</dd>` : ''}
${x.rooms ? `<dt>SOBE</dt><dd>${esc(x.rooms)}</dd>` : ''}
</dl>
<a href="#" data-open="${i}" class="b-go">DETALJI I POZIV <span aria-hidden="true">→</span></a>
</article>`).join('')}</div>
<p data-empty hidden class="b-empty">NEMA OGLASA ZA OVAJ IZBOR. POZOVITE, IMAMO I PONUDU KOJA NIJE NA SAJTU.</p>
</section>

<section class="b-sell">
<div class="b-sell-l"><h2>${left}</h2><p>${esc(b.steps ? (b.stepsIntro || 'Evo tačno šta radimo kada nam poverite nekretninu, korak po korak.') : (b.servicesIntro || 'Sve oko kupovine, prodaje i izdavanja, na jednom mestu.'))}</p></div>
<ol>${(b.steps || b.services).map((s, i) => `<li><span>${i + 1}</span><span>${esc(s)}</span></li>`).join('')}</ol>
</section>

${b.steps ? `<section class="b-sec b-svc-s"><h2>Usluge</h2><div class="b-svc">${b.services.map((s) => `<div>${esc(s)}</div>`).join('')}</div></section>` : `<section class="b-sec b-svc-s"><h2>O nama</h2><p class="b-about">${esc(b.aboutLong || b.about)}</p></section>`}

<section class="b-ct" id="kontakt">
<div><p class="b-k">POZOVITE</p>${b.phones.slice(0, 3).map((_, i) => `<a class="b-big" href="${Z.tel(b, i)}">${esc(Z.phone(b, i))}</a>`).join('')}${b.email ? `<a class="b-mail" href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}</div>
<p>${esc(b.address)}${b.hours ? `<br>${esc(b.hours)}` : ''}${b.reg ? `<br>Registarski broj ${esc(b.reg)}` : ''}</p>
</section>
<footer class="b-foot"><span>© ${esc(b.legal || b.name)}</span><span>${Z.demoNote(b)}${Z.photoNote(b)}</span></footer>
</div>`;

  const css = `
.b{font-family:'IBM Plex Mono',monospace;color:${p.ink};background:${p.paper};--d-bg:${p.paper};--d-fg:${p.ink};--d-acc:${p.ink};--d-on:${p.sig};--d-head:'Anton',sans-serif;--d-hw:400}
.b a{color:${p.link}}
.b-top{background:${p.ink};color:${p.paper};display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));font-size:14px}
.b-top>*{padding:15px 20px;border-right:1px solid #444;border-bottom:1px solid #444;color:${p.paper}!important;text-decoration:none}
.b-top .b-name{color:${p.sig}!important;font-weight:700}
.b-hero{border-bottom:4px solid ${p.ink}}
.b h1{margin:0;padding:22px clamp(12px,3vw,32px) 0;font-family:'Anton',sans-serif;font-weight:400;font-size:clamp(56px,12.5vw,200px);line-height:.88;text-transform:uppercase;letter-spacing:-.01em}
.b-hero-row{display:flex;flex-wrap:wrap;margin-top:24px;border-top:4px solid ${p.ink}}
.b-hero-row>p{flex:1 1 320px;margin:0;padding:24px clamp(12px,3vw,32px);font-size:17px;line-height:1.5;border-right:4px solid ${p.ink}}
.b-find{flex:2 1 560px;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));background:${p.sig}}
.b-find label{display:flex;flex-direction:column;gap:6px;padding:16px 18px;border-right:2px solid ${p.ink};font-size:12px;font-weight:700;text-transform:uppercase}
.b-find select{min-height:44px;border:2px solid ${p.ink};background:#fff;font:inherit;font-size:15px;font-weight:500;text-transform:none;padding:0 8px;border-radius:0;color:${p.ink}}
.b-find button{min-height:76px;border:0;background:${p.ink};color:${p.sig};font-family:'Anton',sans-serif;font-size:30px;text-transform:uppercase;cursor:pointer}
.b-sec{padding:40px clamp(12px,3vw,32px) 56px}
.b-bar{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;margin-bottom:28px}
.b-tabs{display:flex;flex-wrap:wrap;gap:8px}
.b-tabs button,.b-sort{min-height:48px;padding:0 16px;border:3px solid ${p.ink};background:#fff;color:${p.ink};font-weight:700;cursor:pointer}
.b-tabs button span{opacity:.6}
.b-tabs button[aria-pressed=true]{background:${p.ink};color:${p.sig}}
.b-sort{background:${p.paper}}
.b-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:28px}
.b-grid article{border:3px solid ${p.ink};background:${p.card};box-shadow:8px 8px 0 ${p.ink};display:flex;flex-direction:column}
.b-ph{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;border-bottom:3px solid ${p.ink}}
.b-noph{aspect-ratio:4/3;background:${p.sig};border-bottom:3px solid ${p.ink};display:flex;align-items:flex-end;padding:16px;font-family:'Anton',sans-serif;font-size:44px;line-height:.95;text-transform:uppercase}
.b-pr{padding:16px 18px 4px;font-family:'Anton',sans-serif;font-size:42px;line-height:1}
.b-grid h3{margin:0;padding:4px 18px 12px;font-size:14px;font-weight:500;line-height:1.4}
.b-grid dl{margin:0;display:grid;grid-template-columns:92px 1fr;font-size:14px}
.b-grid dt{padding:8px 18px;border-top:2px solid ${p.ink};font-weight:700}
.b-grid dd{margin:0;padding:8px 18px 8px 0;border-top:2px solid ${p.ink}}
.b-go{margin-top:auto;display:flex;align-items:center;justify-content:space-between;min-height:52px;padding:0 18px;border-top:3px solid ${p.ink};background:${p.ink};color:${p.sig}!important;text-decoration:none;font-weight:700}
.b-empty{font-weight:700;margin:24px 0 0}
.b-sell{border-top:4px solid ${p.ink};display:flex;flex-wrap:wrap}
.b-sell-l{flex:1 1 360px;padding:40px clamp(12px,3vw,32px);background:${p.ink};color:${p.paper}}
.b h2{margin:0;font-family:'Anton',sans-serif;font-weight:400;font-size:clamp(46px,6vw,92px);line-height:.9;text-transform:uppercase}
.b-sell-l h2{color:${p.sig}}
.b-sell-l p{margin:20px 0 0;font-size:16px;line-height:1.6;max-width:42ch}
.b-sell ol{flex:2 1 560px;margin:0;padding:0;list-style:none}
.b-sell li{display:flex;gap:20px;padding:18px clamp(12px,3vw,32px);border-bottom:2px solid ${p.ink};font-size:16px;line-height:1.45}
.b-sell li span:first-child{font-family:'Anton',sans-serif;font-size:32px;line-height:1;min-width:38px}
.b-svc-s{border-top:4px solid ${p.ink}}
.b-svc-s h2{margin-bottom:24px;font-size:clamp(40px,5vw,72px)}
.b-svc{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));border-top:3px solid ${p.ink};border-left:3px solid ${p.ink}}
.b-svc div{padding:20px;border-right:3px solid ${p.ink};border-bottom:3px solid ${p.ink};font-size:16px;font-weight:500}
.b-svc div:nth-child(5n+3){background:${p.sig}}
.b-about{margin:0;font-size:17px;line-height:1.6;max-width:70ch}
.b-ct{border-top:4px solid ${p.ink};background:${p.sig};padding:40px clamp(12px,3vw,32px);display:flex;flex-wrap:wrap;gap:24px 48px;align-items:flex-end;justify-content:space-between}
.b-k{margin:0 0 8px;font-weight:700}
.b-big{display:block;font-family:'Anton',sans-serif;font-size:clamp(40px,7vw,104px);line-height:1.02;color:${p.ink}!important;text-decoration:none}
.b-mail{display:inline-block;margin-top:12px;font-size:17px;font-weight:700;color:${p.ink}!important}
.b-ct>p{margin:0;font-size:16px;line-height:1.6}
.b-foot{background:${p.ink};color:${p.paper};padding:16px clamp(12px,3vw,32px);font-size:13px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 24px}
`;
  return Z.page(b, 'brutal', {
    title: `${b.name}: nekretnine${b.city ? ', ' + b.city : ''}`,
    fonts: 'family=Anton&family=IBM+Plex+Mono:wght@400;500;700',
    css, body,
  });
};
