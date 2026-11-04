// Premium: tamna petrolej osnova, bakarni akcenat, serif. Kostur: naslov + fotografija, spisak usluga, diptih,
// traka sa postupkom, tri činjenice, marke, svetao kontakt.
const { esc, tel, phone, telHref, fmtPhone, demoNote, ratingText, page, priceGroups } = require('./zajednicko');

module.exports = (b) => {
  const p = { ground: '#0E1C20', band: '#1A3E46', acc: '#E0A679', line: '#2B4146', bandLine: '#3A5C63', ...(b.premium || {}) };
  const css = `
:root{--g:${p.ground};--b:${p.band};--a:${p.acc};--l:${p.line};--bl:${p.bandLine};--i:#EFE9DD;--m:#C9D0CB;--ink:#14201F;--rub:clamp(20px,4.4vw,64px);--sf:Newsreader,Georgia,'Times New Roman',serif}
*{box-sizing:border-box}html{background:var(--g);color-scheme:dark;scroll-behavior:smooth}
body{margin:0;background:var(--g);color:var(--i);font:400 17px/1.6 'Hanken Grotesk','Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased}
h1,h2,h3,p,figure,ol{margin:0}a{color:inherit}a:focus-visible{outline:2px solid var(--a);outline-offset:3px}img{display:block;max-width:100%}
.top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 40px;padding:24px var(--rub)}
.ime{font:500 30px/1.1 var(--sf);text-decoration:none}
.top nav{display:flex;flex-wrap:wrap;align-items:center;gap:6px 32px;font-size:15px}.top nav a{text-decoration:none}.top .br{color:var(--a);font-weight:500;font-variant-numeric:tabular-nums}
.hero{display:flex;flex-wrap:wrap;align-items:stretch}
.hl{flex:1 1 min(520px,100%);min-width:0;display:flex;flex-direction:column;justify-content:space-between;gap:52px;padding:clamp(28px,6vw,88px) var(--rub) clamp(32px,4.4vw,64px)}
h1{font:300 clamp(44px,6.2vw,94px)/1.01 var(--sf);letter-spacing:-.022em;text-wrap:balance}
.hb{display:flex;flex-direction:column;gap:26px;max-width:30em}.hb p{color:var(--m)}
.btn{align-self:flex-start;display:inline-flex;align-items:center;min-height:52px;padding:0 28px;background:var(--a);color:var(--ink);font-weight:600;text-decoration:none;transition:background .18s}.btn:hover{background:#ecbb95}
.hr{flex:1.25 1 min(620px,100%);min-width:0;position:relative;min-height:clamp(360px,52vw,760px);background:var(--b);overflow:hidden}
.hr img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.traka{display:flex;flex-wrap:wrap;gap:12px clamp(40px,7vw,110px);padding:24px var(--rub);border-bottom:1px solid var(--l);font-size:15px;color:var(--m)}
.usl{padding:clamp(64px,9vw,136px) var(--rub) clamp(48px,6vw,88px);display:flex;flex-wrap:wrap;gap:36px clamp(40px,6vw,96px)}
h2{font:300 clamp(34px,3.8vw,56px)/1.06 var(--sf);letter-spacing:-.015em;text-wrap:balance}
.usl h2{flex:1 1 min(300px,100%)}.ul{flex:3 1 min(620px,100%);min-width:0;display:flex;flex-direction:column}
.ur{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:4px 40px;padding:22px 0;border-top:1px solid var(--l)}.ur:last-child{border-bottom:1px solid var(--l)}
.ur h3{font:400 clamp(23px,2.2vw,31px)/1.18 var(--sf)}.ur span{color:var(--m)}
.dip{display:flex;flex-wrap:wrap;align-items:flex-end;gap:clamp(20px,2.4vw,36px);padding:0 var(--rub) clamp(72px,9vw,136px)}
.dip figure{min-width:0;display:flex;flex-direction:column;gap:14px;flex:1 1 min(320px,100%)}.dip figure:first-child{flex:1.7 1 min(520px,100%)}
.dip img{width:100%;aspect-ratio:5/3;object-fit:cover}.dip figure:not(:first-child) img{aspect-ratio:4/5}.dip figcaption{font-size:15px;color:var(--m)}
.sv{background:var(--b);display:flex;flex-wrap:wrap;align-items:stretch}
.svi{flex:1 1 min(480px,100%);min-width:0;position:relative;min-height:clamp(300px,42vw,640px);overflow:hidden}.svi img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.svt{flex:1.15 1 min(520px,100%);min-width:0;padding:clamp(48px,6.4vw,96px) var(--rub);display:flex;flex-direction:column;gap:30px}
.svt ol{padding:0;list-style:none;display:flex;flex-direction:column}.svt li{display:flex;gap:20px;padding:13px 0;border-top:1px solid var(--bl)}.svt li:last-child{border-bottom:1px solid var(--bl)}
.svt li b{font-weight:400;color:var(--a);font-variant-numeric:tabular-nums}.svt>p{color:#D5DCD7;max-width:34em}
.tri{padding:clamp(72px,9vw,136px) var(--rub);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr));gap:44px clamp(32px,5vw,80px)}
.tri div{display:flex;flex-direction:column;gap:10px}.tri strong{font:300 clamp(36px,3.6vw,52px)/1.08 var(--sf)}.tri div:first-child strong{font-size:clamp(58px,7vw,104px);line-height:1;color:var(--a)}.tri span{color:var(--m);max-width:22em}
.cen{padding:0 var(--rub) clamp(72px,9vw,136px);display:flex;flex-direction:column;gap:30px}
.cgs{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr));gap:30px clamp(32px,5vw,80px)}
.cg h3{font:400 clamp(23px,2.2vw,31px)/1.18 var(--sf);padding-bottom:12px}.red{display:flex;justify-content:space-between;align-items:baseline;gap:20px;padding:11px 0;border-top:1px solid var(--l)}
.red strong{font-weight:500;white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--a)}.red small{display:block;font-size:14px;color:var(--m)}.cen>p{color:var(--m);max-width:44em;font-size:15px}
.mar{padding:0 var(--rub) clamp(72px,9vw,136px)}.mar p{border-top:1px solid var(--l);padding-top:38px;font:300 clamp(27px,3.2vw,46px)/1.22 var(--sf);max-width:25em;text-wrap:pretty}
.kon{background:var(--i);color:var(--ink);padding:clamp(64px,8vw,120px) var(--rub) clamp(40px,4vw,60px);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:44px}
.kl{flex:2 1 min(560px,100%);min-width:0;display:flex;flex-direction:column;gap:16px}.kb{font:300 clamp(44px,8.4vw,128px)/1 var(--sf);letter-spacing:-.015em;text-decoration:none;white-space:nowrap;font-variant-numeric:lining-nums}
address{flex:1 1 min(260px,100%);font-style:normal;display:flex;flex-direction:column;gap:3px}.pred{flex-basis:100%;font-size:14px;color:#47524F;margin-top:8px}
body{padding-bottom:0}.kon{padding-bottom:clamp(110px,10vw,130px)}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;
  const g = b.gallery || [];
  const svImg = b.proc && (b.proc.img || null);
  const body = `
<header class="top"><a class="ime" href="#vrh">${esc(b.name)}</a><nav aria-label="Glavni meni">
<a href="#usluge">Usluge</a>${b.proc ? `<a href="#postupak">${esc(b.proc.nav || 'Postupak')}</a>` : ''}${b.prices ? '<a href="#cene">Cene</a>' : ''}<a href="#kontakt">Kontakt</a>
<a class="br" href="${tel(b)}">${phone(b)}</a></nav></header>
<main id="vrh">
<section class="hero"><div class="hl"><h1>${esc(b.premiumH1 || b.h1)}</h1><div class="hb"><p>${esc(b.lede)}</p><a class="btn" href="${tel(b)}">Pozovite ${phone(b)}</a></div></div>
<div class="hr"><img src="img/${esc(b.heroImg)}.jpg" alt="${esc(b.heroAlt)}" style="object-position:${b.heroPos || '50% 50%'}"></div></section>
${b.strip ? `<section class="traka">${b.strip.map((s) => `<span>${esc(s)}</span>`).join('')}</section>` : ''}
<section class="usl" id="usluge"><h2>${esc(b.servicesTitle)}</h2><div class="ul">${b.services.map((s) => `<div class="ur"><h3>${esc(s.t)}</h3><span>${esc(s.d)}</span></div>`).join('')}</div></section>
${g.length > 1 ? `<section class="dip">${g.slice(0, 2).map((x) => `<figure><img src="img/${esc(x.img)}.jpg" alt="${esc(x.cap)}" loading="lazy"><figcaption>${esc(x.cap)}</figcaption></figure>`).join('')}</section>` : ''}
${b.proc ? `<section class="sv" id="postupak">${svImg ? `<div class="svi"><img src="img/${esc(svImg)}.jpg" alt="${esc(b.proc.alt || '')}" loading="lazy" style="object-position:${b.proc.pos || '50% 50%'}"></div>` : ''}<div class="svt"><h2>${esc(b.proc.t)}</h2><ol>${b.proc.items.map((x, i) => `<li><b>${i + 1}</b><span>${esc(x)}</span></li>`).join('')}</ol>${b.proc.note ? `<p>${esc(b.proc.note)}</p>` : ''}</div></section>` : ''}
${b.facts ? `<section class="tri">${b.facts.map((f) => `<div><strong>${esc(f.k)}</strong><span>${esc(f.t)}</span></div>`).join('')}</section>` : ''}
${b.prices ? `<section class="cen" id="cene"><h2>${esc(b.prices.t)}</h2><div class="cgs">${priceGroups(b)}</div>${b.prices.note ? `<p>${esc(b.prices.note)}</p>` : ''}</section>` : ''}
${b.brands ? `<section class="mar"><p>${esc(b.brands)}</p></section>` : ''}
${b.refs ? `<section class="mar"><p>${esc(b.refs)}</p></section>` : ''}
</main>
<footer class="kon" id="kontakt"><div class="kl"><span>${esc(b.ctaLine || 'Pozovite nas')}</span><a class="kb" href="${tel(b)}">${phone(b)}</a></div>
<address><span>${esc(b.address)}</span>${b.hours ? `<span>${esc(b.hours)}</span>` : ''}${b.phones.slice(1, 3).map((x) => `<a href="${telHref(x)}">${fmtPhone(x)}</a>`).join('')}${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}${ratingText(b) ? `<span>${ratingText(b)}</span>` : ''}</address>
<p class="pred">${demoNote(b)}</p></footer>`;
  return page({ b, cur: 'premium', title: `${b.name}: ${b.tag}`, fonts: 'family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500&family=Hanken+Grotesk:wght@400;500;600', css, body });
};
