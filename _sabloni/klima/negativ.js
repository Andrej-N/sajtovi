// Negative space: hladno polje i bele površine. Uređaji su pune površine sa isečenim detaljima, a veliki krug
// je vrata veš mašine, ventilator ili točak, zavisno od toga čime se biznis bavi.
const { esc, tel, phone, telHref, fmtPhone, demoNote, ratingText, page, priceGroups } = require('./zajednicko');

const S = {
  frizider: ['Frižider', '<rect x="34" y="4" width="132" height="292" fill="var(--f)"/><rect x="34" y="98" width="132" height="6" fill="#fff"/><rect x="48" y="56" width="7" height="30" fill="#fff"/><rect x="48" y="116" width="7" height="44" fill="#fff"/>'],
  ves: ['Veš mašina', '<rect x="14" y="84" width="172" height="212" fill="var(--f)"/><circle cx="100" cy="196" r="66" fill="#fff"/><circle cx="100" cy="196" r="46" fill="var(--f)"/><rect x="28" y="98" width="52" height="8" fill="#fff"/><circle cx="166" cy="102" r="7" fill="#fff"/>'],
  sporet: ['Šporet', '<rect x="14" y="84" width="172" height="212" fill="var(--f)"/><circle cx="42" cy="110" r="9" fill="#fff"/><circle cx="76" cy="110" r="9" fill="#fff"/><circle cx="124" cy="110" r="9" fill="#fff"/><circle cx="158" cy="110" r="9" fill="#fff"/><rect x="34" y="146" width="132" height="122" fill="#fff"/>'],
  klima: ['Klima uređaj', '<rect x="4" y="30" width="192" height="74" fill="var(--f)"/><rect x="20" y="84" width="160" height="6" fill="#fff"/><circle cx="174" cy="52" r="4" fill="#fff"/>'],
  spoljna: ['Spoljna jedinica', '<rect x="4" y="110" width="192" height="150" fill="var(--f)"/><circle cx="76" cy="185" r="58" fill="#fff"/><circle cx="76" cy="185" r="12" fill="var(--f)"/><rect x="72" y="127" width="8" height="116" fill="var(--f)"/><rect x="18" y="181" width="116" height="8" fill="var(--f)"/><rect x="150" y="130" width="30" height="5" fill="#fff"/><rect x="150" y="144" width="30" height="5" fill="#fff"/><rect x="150" y="158" width="30" height="5" fill="#fff"/><rect x="30" y="260" width="22" height="18" fill="var(--f)"/><rect x="148" y="260" width="22" height="18" fill="var(--f)"/>'],
  kaseta: ['Kasetna klima', '<rect x="10" y="60" width="180" height="180" fill="var(--f)"/><rect x="58" y="108" width="84" height="84" fill="#fff"/><rect x="28" y="78" width="144" height="10" fill="#fff"/><rect x="28" y="212" width="144" height="10" fill="#fff"/><rect x="28" y="96" width="10" height="108" fill="#fff"/><rect x="162" y="96" width="10" height="108" fill="#fff"/>'],
  komora: ['Rashladna komora', '<rect x="10" y="30" width="180" height="266" fill="var(--f)"/><rect x="50" y="88" width="100" height="208" fill="#fff"/><rect x="128" y="176" width="10" height="42" fill="var(--f)"/><rect x="24" y="48" width="152" height="24" fill="#fff"/>'],
  ormar: ['Klima ormar', '<rect x="30" y="4" width="140" height="292" fill="var(--f)"/><rect x="46" y="22" width="108" height="40" fill="#fff"/><rect x="46" y="80" width="108" height="6" fill="#fff"/><rect x="46" y="100" width="108" height="6" fill="#fff"/><rect x="46" y="120" width="108" height="6" fill="#fff"/><circle cx="100" cy="216" r="44" fill="#fff"/><circle cx="100" cy="216" r="30" fill="var(--f)"/>'],
  pumpa: ['Toplotna pumpa', '<rect x="30" y="60" width="140" height="236" fill="var(--f)"/><circle cx="100" cy="140" r="46" fill="#fff"/><rect x="50" y="214" width="100" height="6" fill="#fff"/><rect x="50" y="232" width="100" height="6" fill="#fff"/><rect x="50" y="250" width="100" height="6" fill="#fff"/>'],
  auto: ['Automobil', '<path d="M6 214 L20 164 Q24 154 36 152 L58 148 L84 104 Q88 96 98 96 H148 Q158 96 164 104 L184 150 Q196 154 196 170 V214 Z" fill="var(--f)"/><path d="M92 114 H124 V148 H72 Z" fill="#fff"/><path d="M134 114 H152 L168 148 H134 Z" fill="#fff"/><circle cx="56" cy="216" r="28" fill="#fff"/><circle cx="56" cy="216" r="16" fill="var(--f)"/><circle cx="154" cy="216" r="28" fill="#fff"/><circle cx="154" cy="216" r="16" fill="var(--f)"/>'],
  kamion: ['Hladnjača', '<rect x="4" y="74" width="126" height="130" fill="var(--f)"/><path d="M136 112 H170 L196 150 V204 H136 Z" fill="var(--f)"/><path d="M148 122 H166 L182 148 H148 Z" fill="#fff"/><rect x="22" y="92" width="90" height="6" fill="#fff"/><circle cx="46" cy="212" r="24" fill="#fff"/><circle cx="46" cy="212" r="13" fill="var(--f)"/><circle cx="162" cy="212" r="24" fill="#fff"/><circle cx="162" cy="212" r="13" fill="var(--f)"/>'],
  kompresor: ['Kompresor', '<rect x="46" y="66" width="108" height="196" rx="46" fill="var(--f)"/><rect x="62" y="98" width="76" height="6" fill="#fff"/><rect x="62" y="116" width="76" height="6" fill="#fff"/><rect x="96" y="20" width="10" height="46" fill="var(--f)"/><rect x="134" y="36" width="10" height="44" fill="var(--f)"/><rect x="40" y="262" width="120" height="14" fill="var(--f)"/>'],
};

const mark = {
  vrata: '<div class="p1"></div>',
  ventilator: '<div class="p1"></div><div class="kr h"></div><div class="kr v"></div><div class="c0"></div>',
  tocak: '<div class="p1"></div><div class="p2"></div><div class="c0"></div>',
};

module.exports = (b) => {
  const n = b.neg || {};
  const f = n.field || '#1A3E46';
  const css = `
:root{--f:${f};--on:#EFE9DD;--a:${n.acc || '#E0A679'};--ink:#14201F;--rub:clamp(20px,4.4vw,64px)}
*{box-sizing:border-box}html{background:#fff;scroll-behavior:smooth}
body{margin:0;background:#fff;color:var(--ink);font:400 19px/1.45 Jost,'Century Gothic',Futura,Arial,sans-serif;overflow-x:hidden}
h1,h2,p,figure{margin:0}a{color:inherit}a:focus-visible{outline:3px solid var(--a);outline-offset:3px}img{display:block;max-width:100%}
.h{position:relative;overflow:hidden;background:var(--f);color:var(--on);padding:0 var(--rub) clamp(40px,4.4vw,64px)}
.kol{position:absolute;top:90px;right:-8vw;width:max(400px,60vw);height:max(400px,60vw);border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden}
.p1{width:74%;height:74%;border-radius:50%;border:max(10px,1.5vw) solid var(--f);flex:none}.p2{position:absolute;width:36%;height:36%;border-radius:50%;border:max(8px,1.1vw) solid var(--f)}
.c0{position:absolute;width:13%;height:13%;border-radius:50%;background:var(--f)}.kr{position:absolute;background:var(--f)}.kr.h{width:74%;height:max(6px,.8vw)}.kr.v{height:74%;width:max(6px,.8vw)}
.t{position:relative;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:4px 28px;padding:24px 0}
.lg{font-size:24px;font-weight:700;letter-spacing:.03em;text-decoration:none;text-transform:uppercase}.t a:last-child{display:inline-flex;align-items:center;min-height:44px;font-weight:500;text-decoration:none;font-variant-numeric:tabular-nums}
.tx{position:relative;padding-top:calc(555px - 24vw);display:flex;flex-direction:column;align-items:flex-start;gap:24px;width:max(44vw,min(340px,100%))}
h1{font-size:clamp(42px,5.6vw,80px);font-weight:600;line-height:1;letter-spacing:-.02em;text-wrap:balance}.tx p{max-width:24em}
.bt{display:inline-flex;align-items:center;min-height:56px;padding:0 28px;background:var(--a);color:var(--ink);font-weight:600;text-decoration:none;font-variant-numeric:tabular-nums}
.ur{padding:clamp(80px,11vw,160px) var(--rub);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(150px,100%),1fr));gap:48px clamp(20px,5vw,72px);align-items:end}
.ur figure{display:flex;flex-direction:column;gap:18px}.ur svg{width:100%;height:auto;display:block;max-width:300px}
.del{padding:0 var(--rub) clamp(88px,12vw,176px);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:48px clamp(40px,8vw,120px)}
.del img{width:clamp(280px,44vw,640px);max-width:100%;aspect-ratio:1;border-radius:50%;object-fit:cover}
.dt{flex:1 1 min(380px,100%);min-width:0;max-width:560px;display:flex;flex-direction:column;gap:20px}
h2{font-size:clamp(36px,4.2vw,60px);font-weight:600;line-height:1.02;letter-spacing:-.02em;text-wrap:balance}
.god{background:var(--f);color:var(--on);padding:clamp(56px,6vw,88px) var(--rub) clamp(64px,6.6vw,96px);display:flex;flex-direction:column;gap:clamp(90px,16vw,240px)}
.god strong{font-size:clamp(116px,28vw,404px);font-weight:700;line-height:.82;letter-spacing:-.04em;color:#fff;margin-left:-.04em;white-space:nowrap}
.god strong.dug{font-size:clamp(70px,15vw,210px);line-height:.92}
.god p{align-self:flex-end;max-width:26em;font-size:clamp(21px,1.9vw,27px);line-height:1.3}
.dr{padding:clamp(88px,12vw,176px) var(--rub);display:flex;justify-content:flex-end}.dr>div{width:min(720px,100%);display:flex;flex-direction:column;gap:20px}.dr p{max-width:30em}
.dr a{align-self:flex-start;font-weight:500;font-variant-numeric:tabular-nums}
.cg h3{font-size:24px;font-weight:600;margin:0 0 8px}.cgs{display:flex;flex-direction:column;gap:30px}.red{display:flex;justify-content:space-between;align-items:baseline;gap:20px;padding:10px 0;border-top:1px solid #C8D4D5}.red strong{font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums}.red small{display:block;font-size:15px;color:#4A5A5B}
.cn{font-size:16px;color:#4A5A5B}
footer{background:var(--f);color:var(--on);overflow:hidden;padding:clamp(44px,5vw,72px) var(--rub) 0;display:flex;flex-direction:column;gap:clamp(56px,9vw,130px)}
.fr{display:flex;flex-wrap:wrap;justify-content:space-between;gap:18px 56px}.fb{font-size:clamp(36px,4.2vw,60px);font-weight:600;line-height:1;letter-spacing:-.02em;text-decoration:none;font-variant-numeric:tabular-nums;white-space:nowrap}
address{font-style:normal;display:flex;flex-direction:column;gap:2px}.pr{font-size:14px;flex-basis:100%;color:#D5DCD7}
.ime{font-weight:700;line-height:.74;letter-spacing:-.015em;color:#fff;white-space:nowrap;margin-left:-.05em;margin-bottom:-.03em;text-transform:uppercase}
body{padding-bottom:0}.ur figcaption{min-height:2.9em}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;
  const nameBig = n.word || b.name;
  const size = Math.min(27.5, 91 / (nameBig.length * 0.66)).toFixed(2);
  const body = `
<section class="h" id="vrh"><div class="kol" aria-hidden="true">${mark[n.mark || 'ventilator']}</div>
<header class="t"><a class="lg" href="#vrh">${esc(n.word || b.name)}</a><a href="${tel(b)}">${phone(b)}</a></header>
<div class="tx"><h1>${esc(n.h1 || b.h1)}</h1><p>${esc(b.lede)}</p><a class="bt" href="${tel(b)}">Pozovite ${phone(b)}</a></div></section>
<section class="ur" aria-label="Šta radimo">${n.shapes.map((x) => `<figure><svg viewBox="0 0 200 300" role="img" aria-label="${esc(S[x.k][0])}">${S[x.k][1]}</svg><figcaption>${esc(x.t)}</figcaption></figure>`).join('')}</section>
<section class="del"><img src="img/${esc(n.img || b.heroImg)}.jpg" alt="${esc(n.alt || b.heroAlt)}" loading="lazy"><div class="dt"><h2>${esc(n.h2)}</h2>${n.ps.map((p) => `<p>${esc(p)}</p>`).join('')}</div></section>
<section class="god"><strong${String(n.big).length > 5 ? ' class="dug"' : ''}>${esc(n.big)}</strong><p>${esc(n.bigText)}</p></section>
${b.prices || n.second ? `<section class="dr"><div>${b.prices ? `<h2>${esc(b.prices.t)}</h2><div class="cgs">${priceGroups(b)}</div>${b.prices.note ? `<p class="cn">${esc(b.prices.note)}</p>` : ''}` : `<h2>${esc(n.second.h)}</h2><p>${esc(n.second.p)}</p><a href="${tel(b)}">Pozovite ${phone(b)}</a>`}</div></section>` : ''}
<footer><div class="fr"><a class="fb" href="${tel(b)}">${phone(b)}</a><address><span>${esc(b.address)}</span>${b.hours ? `<span>${esc(b.hours)}</span>` : ''}${b.phones[1] ? `<a href="${telHref(b.phones[1])}">${fmtPhone(b.phones[1])}</a>` : ''}${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}${ratingText(b) ? `<span>${ratingText(b)}</span>` : ''}</address><p class="pr">${demoNote(b)}</p></div>
<div class="ime" aria-hidden="true" style="font-size:${size}vw">${esc(nameBig)}</div></footer>`;
  return page({ b, cur: 'negativ', title: `${b.name}: ${b.tag}`, fonts: 'family=Jost:wght@400;500;600;700', css, body });
};
