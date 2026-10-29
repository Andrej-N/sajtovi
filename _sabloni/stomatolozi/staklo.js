// Staklo (light liquid glass): their photo full-bleed, frosted white glass panels, one pastel band and one deep band with dark glass.
// Default: Primus (lilac white / magenta / deep plum).
const { rgba } = require('../boje');

const DEFAULT = { bg: '#f8f5fa', ink: '#2a1a38', muted: '#5a4a68', line: '#eee6f2', acc: '#b8166f', accInk: '#ffffff', soft: '#f3d9e8', deep: '#3a1b5c' };

const glass = (a = .62) => `background:${rgba('#ffffff', a)};backdrop-filter:blur(28px) saturate(160%);-webkit-backdrop-filter:blur(28px) saturate(160%);border:1px solid ${rgba('#ffffff', .9)};box-shadow:inset 0 1px 0 #fff,0 24px 60px rgba(40,20,60,.12)`;

module.exports = function staklo(o = {}) {
  const p = { ...DEFAULT, ...o };
  return {
    key: 'staklo', hero: 'glass',
    order: ['usluge', 'tim', 'cene', 'posebno-0', 'galerija', 'utisci', 'kontakt'],
    tones: { usluge: 'soft', tim: 'photo', cene: 'dark', 'posebno-0': 'plain', galerija: 'white', utisci: 'photo', zakazivanje: 'plain', kontakt: 'white' },
    fonts: 'family=Geist:wght@300..700',
    css: `:root{--bg:${p.bg};--ink:${p.ink};--muted:${p.muted};--line:${p.line};--acc:${p.acc};--accInk:${p.accInk};--acc2:${p.acc};--fd:'Geist',system-ui,sans-serif;--fb:'Geist',system-ui,sans-serif;--hw:500;--ht:-.045em;--r-img:28px;--r-in:14px;--field:${rgba('#ffffff', .8)}}
.top{position:absolute;left:0;right:0;top:0}
.top-in{margin-top:18px;width:calc(100% - 40px);padding:10px 10px 10px 22px;border-radius:999px;${glass(.6)}}
.brand-img{padding:2px 8px;margin-left:-8px}
.hero-glass{position:relative;min-height:min(92svh,820px);display:flex;align-items:flex-end;overflow:hidden;background:${p.soft}}
.hero-glass .bd-shade{position:absolute;inset:0;background:linear-gradient(to right,${rgba(p.bg, .5)},${rgba(p.bg, 0)} 70%)}
.hero-in{position:relative;width:100%;padding-top:140px;padding-bottom:40px}
.hero-card{max-width:580px;padding:clamp(26px,3.4vw,44px);border-radius:36px;${glass(.64)};display:flex;flex-direction:column;gap:20px}
.hero-card h1{font-size:clamp(38px,5vw,66px)}
.btn-glass{background:${rgba('#ffffff', .5)};color:var(--ink);box-shadow:inset 0 1px 0 #fff,inset 0 0 0 1px ${rgba('#ffffff', .9)}}
.tone-white{background:#fff}
.tone-soft{background:${p.soft};--muted:${rgba(p.ink, .78)}}
.tone-dark{background:${p.deep};color:#fff;--ink:#fff;--muted:${rgba('#ffffff', .75)};--line:${rgba('#ffffff', .16)};--acc2:${rgba('#ffffff', .85)}}
.tone-dark .duo-b{padding:8px 28px;border-radius:32px;background:${rgba('#ffffff', .09)};border:1px solid ${rgba('#ffffff', .25)};box-shadow:inset 0 1px 0 ${rgba('#ffffff', .4)}}
.tone-photo{overflow:hidden;padding:clamp(80px,10vw,150px) 0}
.tone-photo .bd-shade{position:absolute;inset:0;background:${rgba(p.bg, .22)}}
.tone-photo .in{position:relative}
.tone-photo .team-img{display:none}
.tone-photo .team-body,.tone-photo .quotes blockquote{padding:28px;border-radius:30px;${glass(.66)}}
.tone-photo .team-body{max-width:640px}
.tone-photo h2{font-size:clamp(26px,2.6vw,36px)}
.quotes blockquote{font-size:19px;font-weight:400;letter-spacing:-.01em}
.book input,.book select{border-color:${rgba(p.ink, .15)}}
.dock{--dockBg:${rgba('#ffffff', .85)};backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
@media (max-width:820px){.top-in{width:calc(100% - 24px);margin-top:12px}.hero-in{padding-top:110px}}`,
  };
};
