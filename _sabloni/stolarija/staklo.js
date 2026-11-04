// 3D: proizvod firme se sklapa dok se skroluje (scena je u ../scena.js). Kartice sa koracima su tečno staklo.
const { esc, tel, phone, telHref, fmtPhone, demoNote, ratingText, page, priceGroups } = require('./zajednicko');

module.exports = (b) => {
  const c = { deep: '#0E2F8C', glass: '7,26,100', top: '#0b2f86', glow: '92,180,245', hi: '214,240,255', low: '6,20,84', mid: '40,110,240', ...(b.d3 || {}) };
  const steps = b.steps;
  const mode = b.mode || 'prozor';
  const css = `
:root{--d:${c.deep};--g:${c.glass};--led:#D9EEFF;--rub:clamp(16px,4.4vw,64px)}
*{box-sizing:border-box}html{background:var(--d);color-scheme:dark;scroll-behavior:smooth}
body{margin:0;background:var(--d);color:#fff;font:400 18px/1.5 Onest,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased}
h1,h2,h3,p,figure,blockquote{margin:0}a{color:inherit}a:focus-visible,button:focus-visible{outline:3px solid #fff;outline-offset:3px}
#scena,.poster{position:fixed;inset:0;width:100%;height:100%;z-index:0;display:block}.poster{object-fit:cover;object-position:60% 40%}.ima-3d .poster{display:none}.bez-3d #scena{display:none}
.sl{position:relative;z-index:1}
.st{background:rgba(var(--g),.5);-webkit-backdrop-filter:blur(24px) saturate(175%);backdrop-filter:blur(24px) saturate(175%);border:1px solid rgba(255,255,255,.36);box-shadow:inset 0 1.5px 1px rgba(255,255,255,.78),inset 0 -14px 24px rgba(255,255,255,.07),inset 12px 0 22px -14px rgba(255,255,255,.5),inset -12px 0 22px -14px rgba(255,255,255,.34),0 30px 66px rgba(3,14,60,.44)}
.tr{position:fixed;z-index:5;top:14px;left:var(--rub);right:var(--rub);display:flex;align-items:center;justify-content:space-between;gap:20px;padding:7px 10px 7px 22px;border-radius:40px;background:rgba(var(--g),.46)}
.lg{font-weight:700;letter-spacing:.01em;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tr nav{display:flex;align-items:center;gap:26px;font-size:16px;flex:none}.tr nav a:not(.d){text-decoration:none}
.d{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 22px;border-radius:30px;background:rgba(255,255,255,.95);color:#0d2448;font-weight:700;text-decoration:none;font-variant-numeric:tabular-nums;white-space:nowrap;box-shadow:inset 0 1px 1px #fff,inset 0 -6px 11px rgba(40,110,240,.2),0 12px 28px rgba(4,18,70,.4);transition:transform .18s}
.d:hover{transform:translateY(-1px)}.d.v{min-height:60px;padding:0 32px;font-size:19px;border-radius:34px}
.e{min-height:112vh;min-height:112svh;display:flex;align-items:center;padding:96px var(--rub)}
.uv{min-height:100vh;min-height:100svh;align-items:flex-end;padding-bottom:clamp(100px,14vh,150px)}
.ut{max-width:min(620px,44vw);display:flex;flex-direction:column;align-items:flex-start;gap:22px}
h1{font-size:clamp(40px,4.9vw,76px);font-weight:600;line-height:1.02;letter-spacing:-.035em;text-wrap:balance}.ut p{max-width:29em}
.ng{display:flex;align-items:center;gap:12px;font-size:16px;color:var(--led)}.ng svg{width:18px;height:26px;flex:none}
.k{width:min(440px,100%);padding:clamp(22px,2.4vw,34px);border-radius:32px;display:flex;flex-direction:column;gap:12px}
.k h2{font-size:clamp(28px,2.7vw,40px);font-weight:600;line-height:1.08;letter-spacing:-.025em;text-wrap:balance}.k .d{align-self:flex-start;margin-top:8px}
.o{padding:clamp(64px,8vw,120px) var(--rub)}.o+.o{padding-top:0}
.n{font-size:clamp(34px,4.4vw,64px);font-weight:600;line-height:1.04;letter-spacing:-.03em;max-width:15em;text-wrap:balance}
.pn{margin-top:clamp(28px,3.4vw,48px);border-radius:38px;padding:clamp(20px,2.4vw,36px) clamp(20px,3vw,44px);background:rgba(var(--g),.6)}
.cgs{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(330px,100%),1fr));gap:24px clamp(32px,5vw,72px)}
.cg h3{font-size:21px;font-weight:600;padding-bottom:10px}.red{display:flex;justify-content:space-between;align-items:baseline;gap:20px;padding:11px 0;border-top:1px solid rgba(255,255,255,.22)}.red strong{font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums}.red small{display:block;font-size:15px;color:var(--led)}
.nm{margin-top:18px;max-width:46em;font-size:16px;color:var(--led)}
.ls{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr));gap:0 clamp(32px,5vw,72px)}.ls div{padding:17px 0;border-top:1px solid rgba(255,255,255,.22)}.ls h3{font-size:20px;font-weight:600}.ls p{color:var(--led)}
.br{display:flex;flex-wrap:wrap;margin-top:clamp(28px,3.4vw,48px);border-radius:40px;overflow:hidden;background:rgba(var(--g),.44)}
.br>div{flex:1 1 min(240px,100%);padding:clamp(24px,3vw,44px);display:flex;flex-direction:column;justify-content:flex-end;gap:8px}.br>div:first-child{flex:1.5 1 min(360px,100%)}
.br strong{font-size:clamp(40px,4.2vw,60px);font-weight:600;line-height:1;letter-spacing:-.04em;font-variant-numeric:tabular-nums;white-space:nowrap}.br>div:first-child strong{font-size:clamp(50px,6.8vw,100px)}
.pz{margin-top:clamp(28px,3.4vw,48px);font-size:clamp(21px,2vw,29px);font-weight:500;line-height:1.28;max-width:32em;text-wrap:pretty}
blockquote{margin-top:clamp(28px,3.4vw,48px);font-size:clamp(23px,2.1vw,31px);font-weight:500;line-height:1.24;max-width:30em}blockquote footer{margin-top:12px;font-size:16px;font-weight:400;color:var(--led)}
.kt{padding:clamp(72px,10vw,150px) var(--rub) clamp(24px,3vw,40px)}
.kp{border-radius:42px;padding:clamp(26px,3.6vw,52px);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:28px 48px}
.bj{flex:2 1 min(520px,100%);font-size:clamp(36px,7vw,100px);font-weight:600;line-height:1;letter-spacing:-.045em;text-decoration:none;font-variant-numeric:tabular-nums;white-space:nowrap}
address{flex:1 1 min(250px,100%);font-style:normal;display:flex;flex-direction:column;gap:3px}.pr{padding-top:22px;font-size:14px;color:var(--led)}
@media (max-width:760px){.tr nav a:not(.d){display:none}.tr{padding-left:16px}.lg{font-size:16px}.d{padding:0 16px}.d.v{min-height:56px;padding:0 26px;font-size:18px}
.uv{padding-bottom:108px}.ut{max-width:100%;gap:14px}h1{font-size:clamp(34px,9.6vw,44px)}.ng{display:none}
.e:not(.uv){align-items:flex-end;padding-bottom:14vh;min-height:118svh}.k{width:100%;border-radius:28px}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.d{transition:none}}
`;
  const cfg = { mode, drvo: b.drvo, drvo2: b.drvo2, front: b.front, bg: { top: c.top, glow: c.glow, hi: c.hi, low: c.low, mid: c.mid } };
  const head = `<script>window.SCENA=${JSON.stringify(cfg)}</script>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"}}</script>`;
  const body = `
<canvas id="scena" aria-hidden="true"></canvas>
<img class="poster" src="../poster-${mode}.jpg" alt="">
<header class="tr st"><a class="lg" href="#vrh">${esc(b.name)}</a><nav aria-label="Glavni meni">${b.prices ? '<a href="#cene">Cene</a>' : '<a href="#usluge">Usluge</a>'}<a href="#kontakt">Kontakt</a><a class="d" href="${tel(b)}">${phone(b)}</a></nav></header>
<main class="sl" id="vrh"><div id="sklapanje">
<section class="e uv"><div class="ut"><h1>${esc(b.h1)}</h1><p>${esc(b.lede)}</p><a class="d v" href="${tel(b)}">Pozovite ${phone(b)}</a><span class="ng"><svg viewBox="0 0 18 26" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="1" y="1" width="16" height="24" rx="8"/><path d="M9 6v5"/></svg>${esc(b.scrollHint || 'Skrolujte i pogledajte kako se sklapa')}</span></div></section>
${steps.map((s, i) => `<section class="e"><div class="k st"><h2>${esc(s.h)}</h2><p>${esc(s.p)}</p>${i === steps.length - 1 ? `<a class="d" href="${tel(b)}">${esc(b.stepCta || 'Pozovite nas')}</a>` : ''}</div></section>`).join('\n')}
</div>
${b.prices ? `<section class="o" id="cene"><h2 class="n">${esc(b.prices.t)}</h2><div class="pn st cgs">${priceGroups(b)}</div>${b.prices.note ? `<p class="nm">${esc(b.prices.note)}</p>` : ''}</section>` : ''}
<section class="o" id="usluge"><h2 class="n">${esc(b.servicesTitle)}</h2><div class="pn st ls">${b.services.map((s) => `<div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div>`).join('')}</div></section>
<section class="o">${b.nums ? `<div class="br st" style="margin-top:0">${b.nums.map((n) => `<div><strong>${esc(n.v)}</strong><span>${esc(n.t)}</span></div>`).join('')}</div>` : ''}
${b.brands ? `<p class="pz">${esc(b.brands)}</p>` : ''}${b.refs ? `<p class="pz">${esc(b.refs)}</p>` : ''}${b.quote ? `<blockquote>${esc(b.quote.t)}<footer>${esc(b.quote.by)}</footer></blockquote>` : ''}</section>
<footer class="kt" id="kontakt"><div class="kp st"><a class="bj" href="${tel(b)}">${phone(b)}</a><address><span>${esc(b.address)}</span>${b.hours ? `<span>${esc(b.hours)}</span>` : ''}${b.email ? `<a href="mailto:${esc(b.email)}">${esc(b.email)}</a>` : ''}${ratingText(b) ? `<span>${ratingText(b)}</span>` : ''}</address></div><p class="pr">${demoNote(b)}</p></footer>
</main>
<script type="module" src="../scena.js"></script>`;
  return page({ b, cur: 'staklo', title: `${b.name}: ${b.tag}`, fonts: 'family=Onest:wght@400;500;600;700', css, body, extraHead: head });
};
