// Negative space za bravare: isti kostur kao stolarija. Veliki beli oblik u heroju je ključ ili kapija.
// Fotografije su u okviru boje polja. Simboli su pune površine sa isečenim detaljima.
const { esc, tel, phone, telHref, fmtPhone, demoNote, ratingText, page, priceGroups } = require('../stolarija/zajednicko');

const W = '#fff';
const r = (x, y, w, h, f = 'var(--f)') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
const c = (x, y, q, f = 'var(--f)') => `<circle cx="${x}" cy="${y}" r="${q}" fill="${f}"/>`;
const S = {
  kljuc: ['Ključ', c(100, 66, 60) + c(100, 52, 20, W) + r(86, 118, 28, 178) + r(114, 206, 30, 20) + r(114, 244, 42, 20)],
  master: ['Master ključ', r(10, 20, 180, 46) + r(26, 66, 24, 230) + r(88, 66, 24, 230) + r(150, 66, 24, 230) + r(50, 210, 20, 18) + r(50, 250, 30, 18) + r(112, 190, 30, 18) + r(112, 240, 20, 18) + r(130, 222, 20, 18) + r(130, 262, 20, 18)],
  auto: ['Auto ključ', `<rect x="46" y="6" width="108" height="130" rx="26" fill="var(--f)"/>` + r(78, 38, 44, 60, W) + r(90, 50, 20, 36) + r(86, 136, 28, 160) + r(98, 150, 6, 132, W)],
  cilindar: ['Cilindar', c(100, 206, 90) + r(62, 30, 76, 170) + c(100, 206, 28, W) + r(92, 214, 16, 52, W)],
  katanac: ['Katanac', `<path d="M58 150 V76 a42 42 0 0 1 84 0 V92" fill="none" stroke="var(--f)" stroke-width="24"/>` + r(22, 150, 156, 146) + c(100, 206, 20, W) + r(91, 214, 18, 44, W)],
  sef: ['Sef', r(10, 26, 180, 252) + r(26, 278, 36, 18) + r(138, 278, 36, 18) + c(100, 152, 60, W) + c(100, 152, 42) + r(92, 104, 16, 36, W)],
  kvaka: ['Kvaka', r(66, 20, 68, 260) + c(100, 88, 22, W) + r(46, 76, 108, 24) + r(10, 76, 50, 24) + c(100, 212, 14, W) + r(94, 216, 12, 34, W)],
  sigurnosna: ['Sigurnosna vrata', r(34, 4, 132, 292) + c(140, 56, 8, W) + c(140, 112, 8, W) + c(140, 188, 8, W) + c(140, 244, 8, W) + r(56, 142, 44, 12, W) + c(108, 176, 7, W)],
  noz: ['Oštrenje', `<path d="M12 186 L170 40 L190 58 L80 186 Z" fill="var(--f)"/>` + r(12, 186, 110, 40) + r(40, 204, 12, 8, W) + r(76, 204, 12, 8, W)],
  kapija: ['Kapija', r(4, 40, 22, 256) + r(174, 40, 22, 256) + `<path d="M26 100 Q100 40 174 100 V296 H26 Z" fill="var(--f)"/>` + [44, 66, 88, 112, 134, 156].map((x) => r(x - 4, 92, 10, 186, W)).join('') + r(36, 180, 128, 8)],
  rail: ['Gelender', `<path d="M6 110 L194 30 V62 L6 142 Z" fill="var(--f)"/>` + [34, 72, 110, 148].map((x, i) => r(x, 130 - i * 16, 14, 180 + i * 16 - 14)).join('') + r(6, 282, 188, 14)],
  stepenice: ['Stepenište', r(6, 256, 188, 40) + r(46, 196, 148, 60) + r(90, 136, 104, 60) + r(134, 76, 60, 60) + r(62, 214, 26, 8, W) + r(106, 154, 26, 8, W) + r(150, 94, 26, 8, W)],
  resetka: ['Zaštitna rešetka', r(14, 30, 172, 246) + r(30, 46, 140, 214, W) + [62, 94, 126].map((x) => r(x, 46, 12, 214)).join('') + [108, 180].map((y) => r(30, y, 140, 12)).join('')],
  konstrukcija: ['Konstrukcija', `<path d="M100 24 L196 110 H176 L100 42 L24 110 H4 Z" fill="var(--f)"/>` + r(16, 110, 18, 186) + r(166, 110, 18, 186) + `<path d="M34 118 L166 118 V134 L34 134 Z M50 134 L100 58 L150 134 H130 L100 90 L70 134 Z" fill="var(--f)"/>` + r(92, 134, 16, 162)],
  salon: ['Šaloni', r(14, 30, 172, 256) + [58, 90, 122, 154, 186, 218, 250].map((y) => r(28, y, 144, 12, W)).join('')],
  krevetic: ['Nameštaj', r(14, 118, 172, 16) + r(14, 118, 18, 178) + r(168, 118, 18, 178) + r(14, 214, 172, 14) + c(100, 74, 44) + c(100, 74, 24, W)],
  lim: ['Lim', `<path d="M6 60 Q30 20 54 60 T102 60 T150 60 T198 60 V146 Q174 106 150 146 T102 146 T54 146 T6 146 Z" fill="var(--f)"/>` + `<path d="M6 180 Q30 140 54 180 T102 180 T150 180 T198 180 V266 Q174 226 150 266 T102 266 T54 266 T6 266 Z" fill="var(--f)"/>`],
  modla: ['Modle', `<path d="M20 110 L44 100 L68 110 L92 100 L116 110 L140 100 L180 110 L160 220 H40 Z" fill="var(--f)"/>` + r(50, 130, 100, 8, W)],
  ploca: ['Graviranje', r(6, 76, 188, 148) + r(30, 112, 140, 12, W) + r(30, 142, 100, 12, W) + r(30, 172, 66, 12, W) + c(18, 90, 5, W) + c(182, 90, 5, W) + c(18, 210, 5, W) + c(182, 210, 5, W)],
  prozor: ['Prozor', r(10, 60, 180, 236) + r(26, 76, 66, 204, W) + r(108, 76, 66, 204, W) + r(96, 160, 8, 38, W)],
  balkon: ['Balkonska vrata', r(44, 4, 112, 292) + r(58, 18, 84, 196, W) + r(58, 230, 84, 52, W) + r(128, 126, 8, 38)],
  vrata: ['Vrata', r(34, 4, 132, 292) + r(56, 28, 88, 56, W) + r(56, 104, 88, 6, W) + r(56, 124, 88, 6, W) + r(140, 166, 10, 56, W)],
  sobna: ['Sobna vrata', r(34, 4, 132, 292) + r(54, 24, 92, 112, W) + r(54, 156, 92, 120, W) + r(128, 136, 12, 20, 'var(--a)')],
  roletna: ['Roletna', r(10, 60, 180, 236) + r(10, 102, 180, 6, W) + [128, 152, 176, 200, 224, 248].map((y) => r(24, y, 152, 6, W)).join('')],
  komarnik: ['Komarnik', r(10, 60, 180, 236) + r(24, 74, 152, 208, W) + `<path d="M44 74V282M64 74V282M84 74V282M104 74V282M124 74V282M144 74V282M164 74V282M24 94H176M24 114H176M24 134H176M24 154H176M24 174H176M24 194H176M24 214H176M24 234H176M24 254H176" stroke="var(--f)" stroke-width="3" fill="none"/>`],
  garaza: ['Garažna vrata', r(6, 96, 188, 200) + [122, 154, 186, 218, 250].map((y) => r(20, y, 160, 6, W)).join('') + r(30, 132, 24, 12, W) + r(66, 132, 24, 12, W) + r(102, 132, 24, 12, W) + r(138, 132, 24, 12, W)],
  rolo: ['Rolo vrata', r(6, 60, 188, 42) + r(14, 102, 172, 194) + [120, 136, 152, 168, 184, 200, 216, 232, 248, 264].map((y) => r(14, y, 172, 5, W)).join('') + r(20, 76, 160, 6, W)],
  harmonika: ['Harmonika', r(6, 40, 188, 256) + [22, 58, 94, 130, 166].map((x) => `<path d="M${x} 56 L${x + 22} 68 V270 L${x} 282 Z" fill="#fff"/>`).join('')],
  terasa: ['Zatvorena terasa', r(6, 40, 188, 200) + r(20, 54, 46, 172, W) + r(77, 54, 46, 172, W) + r(134, 54, 46, 172, W) + r(6, 256, 188, 40)],
  fasada: ['Fasada', r(10, 20, 180, 276) + [36, 88, 140].map((y) => r(24, y, 44, 40, W) + r(78, y, 44, 40, W) + r(132, y, 44, 40, W)).join('') + r(24, 196, 152, 86, W)],
  staklenik: ['Staklenik', `<path d="M6 120 L100 44 L194 120 V296 H6 Z" fill="var(--f)"/>` + r(22, 134, 46, 146, W) + r(77, 134, 46, 146, W) + r(132, 134, 46, 146, W) + `<path d="M34 118 L100 66 L166 118 Z" fill="#fff"/>`],
  profil: ['Profil', r(30, 20, 140, 276) + r(46, 36, 108, 40, W) + r(46, 92, 44, 188, W) + r(106, 92, 48, 188, W)],
  ograda: ['Ograda', r(6, 90, 188, 16) + r(6, 266, 188, 16) + [20, 54, 88, 122, 156].map((x) => r(x, 106, 14, 160)).join('')],
  kuhinja: ['Kuhinja', r(6, 30, 188, 88) + r(101, 40, 2, 68, W) + r(6, 172, 188, 124) + r(6, 160, 188, 6) + r(70, 190, 2, 106, W) + r(134, 190, 2, 106, W) + r(30, 186, 20, 5, W) + r(92, 186, 20, 5, W) + r(154, 186, 20, 5, W)],
  orman: ['Plakar', r(14, 4, 172, 292) + r(98, 4, 4, 292, W) + r(82, 134, 6, 48, W) + r(112, 134, 6, 48, W)],
  fioke: ['Komoda', r(14, 86, 172, 210) + r(14, 150, 172, 5, W) + r(14, 216, 172, 5, W) + r(82, 112, 36, 6, W) + r(82, 178, 36, 6, W) + r(82, 248, 36, 6, W)],
  krevet: ['Krevet', r(10, 100, 16, 196) + r(174, 170, 16, 126) + r(10, 216, 180, 56) + `<rect x="26" y="182" width="148" height="34" fill="var(--f)"/>` + r(36, 188, 44, 22, W)],
  sprat: ['Krevet na sprat', r(14, 20, 12, 276) + r(174, 20, 12, 276) + r(14, 110, 172, 22) + r(14, 240, 172, 22) + r(32, 88, 50, 22) + r(32, 218, 50, 22)],
  sofa: ['Sofa', r(14, 130, 172, 56) + r(14, 186, 172, 70) + r(14, 256, 14, 30) + r(172, 256, 14, 30) + r(30, 200, 140, 8, W)],
  daske: ['Lamperija', [12, 50, 88, 126, 164].map((x) => r(x, 40, 30, 256)).join('')],
  trupac: ['Građa', r(6, 90, 188, 40) + r(6, 146, 188, 40) + r(6, 202, 188, 40) + r(6, 258, 188, 38)],
};

// veliki beli oblik u heroju
const HERO = {
  kljuc: '<svg class="kolk" viewBox="0 0 900 360"><circle cx="170" cy="180" r="170" fill="#fff"/><circle cx="112" cy="180" r="52" fill="var(--f)"/><rect x="320" y="132" width="580" height="86" fill="#fff"/><rect x="360" y="166" width="540" height="12" fill="var(--f)"/><path d="M500 218h48v62h-48ZM590 218h40v92h-40ZM672 218h48v50h-48ZM760 218h40v78h-40ZM836 218h44v44h-44Z" fill="#fff"/></svg>',
  kapija: '<svg class="kolk kolg" viewBox="0 0 900 620"><path d="M60 620V40h60v44Q450-60 780 84V40h60v580Z" fill="#fff"/><path d="M120 620V150Q450 10 780 150V620Z" fill="var(--f)"/>' + [190, 262, 334, 406, 494, 566, 638, 710].map((x, i) => '<rect x="' + (x - 11) + '" y="' + [125, 95, 75, 65, 65, 75, 95, 125][i] + '" width="22" height="' + (620 - [125, 95, 75, 65, 65, 75, 95, 125][i]) + '" fill="#fff"/>').join('') + '<rect x="438" y="50" width="24" height="570" fill="#fff"/><rect x="120" y="430" width="660" height="22" fill="#fff"/></svg>',
  prozor: '<div class="kol m-p"><i></i><i></i><i></i><i></i></div>',
  vrata: '<div class="kol m-v"><i></i><i></i><b></b></div>',
  element: '<div class="kol m-e"><i></i><i></i><i></i><i></i><i></i><i></i></div>',
  krevet: '<div class="kol m-k"><i></i><i></i><i></i></div>',
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
.kolk{position:absolute;top:clamp(96px,11vw,170px);right:-7vw;width:max(370px,66vw);height:auto;display:block}.kolg{right:2vw;width:max(330px,46vw)}
.kol{position:absolute;top:90px;right:-8vw;width:max(400px,58vw);height:max(450px,52vw);background:#fff;padding:max(16px,2.2vw);display:grid;gap:max(16px,2.2vw)}.kol i{display:block;background:var(--f)}
.m-p{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:34% minmax(0,1fr)}
.m-v{right:6vw;width:max(280px,32vw);height:max(450px,56vw);grid-template-rows:42% minmax(0,1fr)}.m-v b{position:absolute;right:max(26px,3.6vw);top:44%;width:max(14px,1.6vw);height:max(46px,6vw);background:var(--a)}
.m-e{grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:58% minmax(0,1fr)}
.m-k{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:30% minmax(0,1fr)}.m-k i:last-child{grid-column:1/3}
.t{position:relative;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:4px 28px;padding:24px 0}
.lg{font-size:24px;font-weight:700;letter-spacing:.03em;text-decoration:none;text-transform:uppercase}.t a:last-child{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;background:var(--f);font-weight:500;text-decoration:none;font-variant-numeric:tabular-nums}
.tx{position:relative;padding-top:calc(555px - 24vw);display:flex;flex-direction:column;align-items:flex-start;gap:24px;width:max(40vw,min(340px,100%))}
h1{font-size:clamp(42px,5.4vw,78px);font-weight:600;line-height:1;letter-spacing:-.02em;text-wrap:balance;overflow-wrap:break-word}.tx p{max-width:24em}
.bt{display:inline-flex;align-items:center;min-height:56px;padding:0 28px;background:var(--a);color:var(--ink);font-weight:600;text-decoration:none;font-variant-numeric:tabular-nums}
.ur{padding:clamp(80px,11vw,160px) var(--rub);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(150px,100%),1fr));gap:48px clamp(20px,5vw,72px);align-items:end}
.ur figure{display:flex;flex-direction:column;gap:18px}.ur svg{width:100%;height:auto;display:block;max-width:260px}.ur figcaption{min-height:2.9em}
.del{padding:0 var(--rub) clamp(88px,12vw,176px);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:48px clamp(40px,8vw,120px)}
.del img,.dr img{width:clamp(280px,46vw,660px);max-width:100%;aspect-ratio:5/4;object-fit:cover;border:max(12px,1.3vw) solid var(--f)}
.dt{flex:1 1 min(380px,100%);min-width:0;max-width:560px;display:flex;flex-direction:column;gap:20px}
h2{font-size:clamp(36px,4.2vw,60px);font-weight:600;line-height:1.02;letter-spacing:-.02em;text-wrap:balance}
.god{background:var(--f);color:var(--on);padding:clamp(56px,6vw,88px) var(--rub) clamp(64px,6.6vw,96px);display:flex;flex-direction:column;gap:clamp(90px,16vw,240px)}
.god strong{font-size:clamp(116px,28vw,404px);font-weight:700;line-height:.82;letter-spacing:-.04em;color:#fff;margin-left:-.04em;white-space:nowrap}
.god strong.dug{font-size:clamp(70px,15vw,210px);line-height:.92}
.god p{align-self:flex-end;max-width:26em;font-size:clamp(21px,1.9vw,27px);line-height:1.3}
.dr{padding:clamp(88px,12vw,176px) var(--rub);display:flex;flex-wrap:wrap-reverse;align-items:center;justify-content:space-between;gap:48px clamp(40px,8vw,120px)}.dr img{aspect-ratio:5/3}
.dr>div{flex:1 1 min(380px,100%);min-width:0;max-width:640px;display:flex;flex-direction:column;gap:20px}.dr p{max-width:30em}
.dr a{align-self:flex-start;display:inline-flex;align-items:center;min-height:44px;font-weight:500;font-variant-numeric:tabular-nums}
footer{background:var(--f);color:var(--on);overflow:hidden;padding:clamp(44px,5vw,72px) var(--rub) 0;display:flex;flex-direction:column;gap:clamp(56px,9vw,130px)}
.fr{display:flex;flex-wrap:wrap;justify-content:space-between;gap:18px 56px}.fb{font-size:clamp(36px,4.2vw,60px);font-weight:600;line-height:1;letter-spacing:-.02em;text-decoration:none;font-variant-numeric:tabular-nums;white-space:nowrap}
address{font-style:normal;display:flex;flex-direction:column;gap:2px}.pr{font-size:14px;flex-basis:100%;color:#D5DCD7}
.ime{font-weight:700;line-height:.74;letter-spacing:-.015em;color:#fff;white-space:nowrap;margin-left:-.05em;margin-bottom:-.03em;text-transform:uppercase}
body{padding-bottom:0}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;
  const nameBig = n.word || b.name;
  const size = Math.min(27.5, 91 / (nameBig.length * 0.66)).toFixed(2);
  const sec = n.second;
  const body = `
<section class="h" id="vrh"><div aria-hidden="true">${HERO[n.mark || 'prozor']}</div>
<header class="t"><a class="lg" href="#vrh">${esc(n.word || b.name)}</a><a href="${tel(b)}">${phone(b)}</a></header>
<div class="tx"><h1>${esc(n.h1 || b.h1)}</h1><p>${esc(n.lede || b.lede)}</p><a class="bt" href="${tel(b)}">Pozovite ${phone(b)}</a></div></section>
<section class="ur" aria-label="Šta radimo">${n.shapes.map((x) => `<figure><svg viewBox="0 0 200 300" role="img" aria-label="${esc(S[x.k][0])}">${S[x.k][1]}</svg><figcaption>${esc(x.t)}</figcaption></figure>`).join('')}</section>
<section class="del"><img src="img/${esc(n.img || b.heroImg)}.jpg" alt="${esc(n.alt || b.heroAlt)}" loading="lazy"><div class="dt"><h2>${esc(n.h2)}</h2>${n.ps.map((p) => `<p>${esc(p)}</p>`).join('')}</div></section>
<section class="god"><strong${String(n.big).length > 5 ? ' class="dug"' : ''}>${esc(n.big)}</strong><p>${esc(n.bigText)}</p></section>
${sec ? `<section class="dr"><div><h2>${esc(sec.h)}</h2><p>${esc(sec.p)}</p><a href="${tel(b)}">${esc(sec.cta || 'Pozovite')} ${phone(b)}</a></div>${sec.img ? `<img src="img/${esc(sec.img)}.jpg" alt="${esc(sec.alt || '')}" loading="lazy">` : ''}</section>` : ''}
<footer><div class="fr"><a class="fb" href="${tel(b)}">${phone(b)}</a><address><span>${esc(b.address)}</span>${b.hours ? `<span>${esc(b.hours)}</span>` : ''}${b.phones[1] ? `<a href="${telHref(b.phones[1])}">${fmtPhone(b.phones[1])}</a>` : ''}${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}${ratingText(b) ? `<span>${ratingText(b)}</span>` : ''}</address><p class="pr">${demoNote(b)}</p></div>
<div class="ime" aria-hidden="true" style="font-size:${size}vw">${esc(nameBig)}</div></footer>`;
  return page({ b, cur: 'negativ', title: `${b.name}: ${b.tag}`, fonts: 'family=Jost:wght@400;500;600;700', css, body });
};
