// Bento + soft 3D: the whole page is one grid of raised tiles (hero, hours, rating, photo, services, ...). Keycap buttons.
// Default: Premović (cool grey / navy hours tile / teal / mint / sand).
const { rgba, mix } = require('../boje');

const DEFAULT = { bg: '#e3eaee', ink: '#1b2c38', muted: '#4b5e6b', dark: '#1f3646', acc: '#23796f', soft: '#d7ece7', sand: '#f1e3d0' };

module.exports = function bento(o = {}) {
  const p = { ...DEFAULT, ...o };
  const lift = `box-shadow:10px 12px 30px ${rgba(p.ink, .08)},-8px -8px 22px ${rgba('#ffffff', .85)}`;
  return {
    key: 'bento', hero: 'tile', grid: true,
    order: ['vreme', 'ocena', 'foto', 'usluge', 'cene', 'posebno-0', 'tim', 'galerija', 'posebno-1', 'utisci', 'kontakt'],
    tones: { vreme: 'dark', ocena: 'acc', foto: 'plain', usluge: 'soft', cene: 'white', 'posebno-0': 'white', tim: 'white', galerija: 'white', 'posebno-1': 'sand', utisci: 'white', zakazivanje: 'white', kontakt: 'sand' },
    fonts: 'family=Gabarito:wght@400..800&family=Figtree:wght@400;500;600',
    css: `:root{--bg:${p.bg};--ink:${p.ink};--muted:${p.muted};--line:${rgba(p.ink, .1)};--acc:${p.acc};--accInk:#fff;--acc2:${p.acc};--fd:'Gabarito',sans-serif;--fb:'Figtree',system-ui,sans-serif;--hw:600;--ht:-.03em;--r-btn:16px;--r-img:20px;--r-in:12px;--field:#f6f9fa}
.grid{max-width:1200px;margin:0 auto;padding:8px 20px 48px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:20px;grid-auto-flow:dense}
.grid .sec{padding:28px;border-radius:30px;${lift};grid-column:span 3;overflow:hidden}
.grid .in{max-width:none;padding:0}
.grid h2{font-size:clamp(24px,2.2vw,30px)}
.s-hero{grid-column:span 4!important;grid-row:span 2;padding:clamp(28px,4vw,56px)!important}
.s-hero .in{height:100%;display:flex;flex-direction:column;justify-content:space-between;gap:28px}
.s-hero h1{font-size:clamp(40px,5.4vw,74px);line-height:.98}
.s-hero .lead{margin-top:auto}
.s-vreme,.s-ocena{grid-column:span 2!important}
.s-foto{padding:0!important;min-height:300px}.s-foto .in,.s-foto img{height:100%}.tile-img{width:100%;height:100%;min-height:300px;object-fit:cover}
.s-galerija,.s-utisci,.s-kontakt{grid-column:1/-1!important}
.s-zakazivanje{grid-column:span 6!important}
.h-small{font-size:16px!important;font-family:var(--fb)!important;font-weight:500;color:var(--muted);letter-spacing:0;margin-bottom:12px}
.duo{flex-direction:column;flex-wrap:nowrap;gap:16px}.duo-h,.duo-b{flex:none}
.s-zakazivanje .duo{flex-direction:row;gap:24px 56px}.s-zakazivanje .duo-h{flex:1 1 240px}.s-zakazivanje .duo-b{flex:2 1 460px}
.prose{font-size:18px}
.big-rating{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;height:100%;text-decoration:none;color:inherit}
.big-rating b{font-family:var(--fd);font-size:68px;line-height:.85;letter-spacing:-.04em;font-weight:600}
.big-rating span{font-size:15px;text-align:right;opacity:.85}
.tone-white{background:#fff}
.tone-plain{background:${mix(p.bg, '#ffffff', .4)}}
.tone-soft{background:${p.soft}}
.tone-sand{background:${p.sand};--line:${rgba(p.ink, .12)}}
.tone-dark{background:linear-gradient(150deg,${mix(p.dark, '#ffffff', .1)},${p.dark});color:#fff;--ink:#fff;--muted:${rgba('#ffffff', .7)};--line:${rgba('#ffffff', .14)}}
.tone-acc{background:linear-gradient(150deg,${mix(p.acc, '#ffffff', .12)},${p.acc});color:#fff;--ink:#fff;--muted:${rgba('#ffffff', .85)}}
.tone-dark .hours div{border:0;padding:6px 0}
.tone-dark .hours dd{font-family:var(--fd);font-size:22px;padding:4px 12px;border-radius:12px;background:${rgba('#ffffff', .1)};box-shadow:0 4px 0 ${rgba('#000000', .35)}}
.btn-main{box-shadow:0 5px 0 ${mix(p.acc, '#000000', .3)},0 12px 22px ${rgba(p.acc, .2)}}
.btn-alt{background:#f6f9fa;box-shadow:0 5px 0 ${rgba(p.ink, .14)},0 10px 18px ${rgba(p.ink, .06)}}
.btn-call{border-radius:14px;box-shadow:0 4px 0 ${mix(p.acc, '#000000', .3)}}
.svc,.plist{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
.team{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
.team-img{flex-basis:100%;aspect-ratio:16/9}
.team-wrap{gap:22px}
.gal{grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-top:18px}
.quotes{margin-top:18px}.quotes blockquote{font-size:18px;font-weight:500}
.sp-img{max-height:300px!important}
.map{border-radius:20px;box-shadow:inset 6px 6px 14px ${rgba(p.ink, .06)}}
.foot-in{padding-top:8px}
@media (max-width:860px){.grid .sec,.s-hero,.s-vreme,.s-ocena{grid-column:span 3!important}.s-hero{grid-column:1/-1!important;grid-row:auto}}
@media (max-width:600px){.grid{gap:14px;padding:4px 12px 32px}.grid .sec{grid-column:1/-1!important;padding:22px}.s-zakazivanje .duo{flex-direction:column}}`,
  };
};
