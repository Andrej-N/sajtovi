// Minimalizam. Default: silver #dde3e8 / deep aubergine #3a0f34 / marigold #eaaa00. Recolor with minimal(palette).
const { esc } = require('../shared');
const { rgba, mix } = require('../boje');
const baza = require('./baza');

const DEFAULT = {
  fg: '#3a0f34', bg: '#dde3e8', acc: '#eaaa00', surf: '#e8ecef', surf2: '#d2d9df', muted: '#5e3d59', fgOn: '#fff', accFg: '#3a0f34',
  fonts: 'family=Schibsted+Grotesk:wght@400;500;700;800&family=IBM+Plex+Mono:wght@400;500',
  fd: "'Schibsted Grotesk',system-ui,sans-serif", fb: "'Schibsted Grotesk',system-ui,sans-serif", fm: "'IBM Plex Mono',monospace", hw: 800, ht: '-.05em',
};
const derive = (p) => ({ surf: mix(p.bg, '#fff', .4), surf2: mix(p.bg, p.fg, .06), muted: mix(p.fg, p.bg, .3), accFg: p.fg });

module.exports = function minimal(o = {}) {
  const p = o.fg ? { ...DEFAULT, ...derive(o), ...o } : { ...DEFAULT, ...o };
  const css = baza + `
:root{--bg:${p.bg};--fg:${p.fg};--muted:${p.muted};--surface:${p.surf};--surface-2:${p.surf2};--line:${rgba(p.fg, .22)};--accent:${p.fg};--accent-fg:${p.fgOn};--accent-2:${p.acc};--accent-2-fg:${p.accFg};--r:0px;--r-sm:0px;--font-d:${p.fd};--font-b:${p.fb};--hw:${p.hw};--ht:${p.ht};--star:${p.fg}}
body{--card-bg:${p.surf}}
h1{font-size:clamp(50px,8vw,112px);line-height:.92}
h2{font-size:clamp(36px,5vw,68px);line-height:.95}
h3{font-weight:700;letter-spacing:-.02em;font-size:24px}
.kicker,.crumbs,.tag,.step-n,.why-n,.fact span,.foot-col h3,.foot-note,.hours dt,.sec-note{font-family:${p.fm};letter-spacing:0;text-transform:none;font-weight:400}
.kicker{font-size:14px;color:var(--fg)}
.kicker::before{content:'( ';}.kicker::after{content:' )'}
.site-head{background:var(--bg);border-bottom:1px solid var(--line)}
.menu a[aria-current]{background:none;text-decoration:underline;text-decoration-color:${p.acc};text-decoration-thickness:3px;text-underline-offset:6px}
.btn{border-radius:0}
.btn-primary{background:${p.fg}}
.btn-ghost{background:transparent;border:1.5px solid ${p.fg}}
.btn:hover{transform:none;box-shadow:6px 6px 0 ${p.acc}}
.icon-box{border-radius:0;background:${p.acc}}
.mono{border-radius:0;background:${p.fg};color:${p.acc};font-family:${p.fm}}
.lead{color:var(--fg)}
.hero{padding-top:80px}
.hero-in{grid-template-columns:1fr;gap:56px}
.hero-copy{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:24px;row-gap:32px}
.hero-copy > *{grid-column:1 / -1}
.hero-copy .kicker{grid-column:1 / span 4}
.hero-copy .lead,.hero-copy .actions,.hero-copy .trust{grid-column:5 / -1}
.hero-art{min-height:0}
.facts-in{gap:0;border-top:1.5px solid var(--fg);border-bottom:1.5px solid var(--fg)}
.fact{background:none;border-left:1px solid var(--line);padding:30px 24px}
.fact:first-child{border-left:0;padding-left:0}
.fact strong{font-size:clamp(36px,4vw,56px)}
.sec-head{border-top:1.5px solid var(--fg);padding-top:24px}
.svc-grid{grid-template-columns:1fr;gap:0;border-top:1.5px solid var(--fg)}
.svc-card{background:none;border-bottom:1px solid var(--line);display:grid;grid-template-columns:60px 1.1fr 1.6fr 140px;align-items:center;gap:24px;padding:28px 0}
.svc-card:hover{transform:none;background:${p.surf}}
.svc-card .icon-box{width:44px;height:44px}.svc-card .icon-box svg{width:22px;height:22px}
.svc-card .tag{position:static;grid-column:4;grid-row:1;justify-self:end;background:${p.acc};color:${p.accFg}}
.svc-card .more{grid-column:4;justify-self:end;margin:0}
.svc-card .tag + h3{grid-column:2}
.photo{filter:grayscale(.25) contrast(1.03)}
.illu{background:${p.surf};color:${p.fg};border:1.5px solid ${p.fg}}
.illu::before{content:'';position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:40px 40px}
.illu::after{content:'';position:absolute;right:0;bottom:0;width:25%;height:25%;background:${p.acc}}
.illu > *{position:relative;z-index:1}
.step,.why-item{background:none;border:0;border-top:1.5px solid var(--fg);padding:26px 0}
.step-n{position:static;order:-1}
.rating-in{background:none;border-top:1.5px solid var(--fg);border-bottom:1.5px solid var(--fg);padding:48px 0}
.faq-list details{background:none;border-bottom:1px solid var(--line);padding:0}
.loc-card{background:${p.surf}}
.cta-band .cta-in{background:${p.acc};color:${p.accFg}}
.cta-in .btn-ghost{border-color:${p.accFg}}
.chips a{border-radius:0;background:none;border-color:var(--fg)}
.form{background:${p.surf}}
.form input,.form select,.form textarea{border-radius:0}
.site-foot{border-top:1.5px solid var(--fg)}
.page-hero h1{font-size:clamp(56px,9vw,128px)}
/* hero art: photo with A-series grid */
.ha{position:relative;aspect-ratio:2.1/1;border:1.5px solid ${p.fg};overflow:hidden}
.ha .photo{position:absolute;left:0;top:0;width:50%;height:100%;border-right:1.5px solid ${p.fg}}
.ha .photo2{left:50%;width:25%;height:50%;border-bottom:1.5px solid ${p.fg}}
.ha-cell{position:absolute;font-family:${p.fm};font-size:13px;padding:10px 12px;box-sizing:border-box}
.ha-a4{left:75%;top:0;width:25%;height:50%;background:${p.acc};color:${p.accFg};border-left:1.5px solid ${p.fg};display:flex;flex-direction:column;justify-content:space-between}
.ha-a4 strong{font-family:${p.fd};font-size:clamp(40px,6vw,88px);letter-spacing:-.05em;line-height:.9}
.ha-txt{left:50%;top:50%;width:50%;height:50%;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;font-size:14px}
@media (max-width:1000px){.hero-copy .kicker,.hero-copy .lead,.hero-copy .actions,.hero-copy .trust{grid-column:1 / -1}.svc-card{grid-template-columns:44px 1fr;row-gap:8px}.svc-card p,.svc-card .more{grid-column:2;justify-self:start}.svc-card .tag{grid-column:2;grid-row:auto;justify-self:start}.fact{border-left:0;padding-left:0}}
@media (max-width:640px){.ha{aspect-ratio:1/1}.ha .photo{width:100%;height:60%;border-right:0;border-bottom:1.5px solid ${p.fg}}.ha .photo2{display:none}.ha-a4{left:0;top:60%;width:50%;height:40%;border-left:0}.ha-txt{left:50%;top:60%;width:50%;height:40%}}
${p.css || ""}`;

  return {
    fonts: p.fonts,
    css,
    heroArt(b, ctx) {
      const p2 = b.gallery[0] && b.heroImg && b.gallery[0].src !== b.heroImg.src ? b.gallery[0] : b.services.find((s) => s.img && (!b.heroImg || ctx.root + s.img !== ctx.root + b.heroImg.src));
      const src2 = p2 ? (p2.src || p2.img) : null;
      return `<div class="ha">
${b.heroImg ? `<figure class="photo"><img src="${ctx.root}${b.heroImg.src}" alt="${esc(b.heroImg.alt)}"></figure>` : ''}
${src2 ? `<figure class="photo photo2"><img src="${ctx.root}${src2}" alt=""></figure>` : ''}
<div class="ha-cell ha-a4"><span>A4 — 210 × 297</span><strong>A4</strong></div>
<div class="ha-cell ha-txt"><span>${esc(b.locations[0].address)}</span><span>${esc(b.kind)}${b.since ? ` · od ${esc(b.since)}.` : ''}</span></div>
</div>`;
    },
  };
};
