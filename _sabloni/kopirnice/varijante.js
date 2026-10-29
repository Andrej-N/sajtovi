// Layout variants a business can pick in _podaci/<niche>-izgled.js (look.hero, look.svc, look.facts, look.steps, look.why,
// look.detail, look.topbar and extra home sections marquee / statement / visit). Uses only the skin tokens, so it works in every skin.
// Skins may set --card-bg, --card-sh, --card-blur for cards and --shade for the cover hero overlay.
module.exports = `
body{--shade:var(--fg)}
.sk-glass{--shade:var(--bg)}
.vcard{background:var(--card-bg,var(--surface));box-shadow:var(--card-sh,none);-webkit-backdrop-filter:var(--card-blur,none);backdrop-filter:var(--card-blur,none);border-radius:var(--r)}

/* top info bar */
.topbar{background:var(--fg);color:var(--bg);font-size:14px;position:relative;z-index:21}
.sk-glass .topbar{background:rgba(255,255,255,.08);color:#fff;border-bottom:1px solid rgba(255,255,255,.14)}
.topbar .wrap{display:flex;gap:6px 28px;flex-wrap:wrap;align-items:center;min-height:42px;padding-top:8px;padding-bottom:8px}
.topbar span,.topbar a{display:inline-flex;gap:8px;align-items:center;text-decoration:none}
.topbar svg{width:15px;height:15px;opacity:.8}
.topbar a{margin-left:auto;font-weight:600}

/* hero: art on the left */
@media (min-width:1001px){.hero-rev .hero-copy{order:2}.hero-rev .hero-in{grid-template-columns:.95fr 1.05fr}}
/* hero: centered copy, wide art under it */
.hero-stack .hero-in{grid-template-columns:1fr;gap:40px}
.hero-stack .hero-copy{align-items:center;text-align:center;max-width:920px;margin:0 auto}
.hero-stack .lead{margin:0 auto}
.hero-stack .actions,.hero-stack .trust{justify-content:center}
.hero-stack .hero-art{width:100%;max-width:1040px;margin:0 auto;min-height:520px}
/* hero: portfolio mosaic on the right */
.hm{position:absolute;inset:0;display:grid;grid-template-columns:1.1fr .9fr;grid-template-rows:1fr 1fr;gap:16px}
.hm .photo{height:100%}
.hm .photo:first-child{grid-row:span 2}
/* hero: full-bleed photo; the header floats over it so the photo starts at the very top */
.has-cover .site-head{position:fixed;top:0;left:0;right:0}
.hero.hero-cover{padding:0;min-height:min(88vh,780px);display:flex;align-items:flex-end;color:#fff;overflow:hidden;isolation:isolate}
.hc-bg{position:absolute;inset:0;z-index:-1;margin:0}
.hc-bg img{width:100%;height:100%;object-fit:cover}
.hc-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25) 0%,rgba(0,0,0,.35) 35%,color-mix(in srgb,var(--shade) 92%,transparent) 100%)}
.hc-in{width:100%;display:grid;grid-template-columns:1.35fr .65fr;gap:48px;align-items:end;padding-top:150px;padding-bottom:64px}
.hero-cover .hero-copy{display:flex;flex-direction:column;gap:24px}
.hero-cover .hero-copy > *{grid-column:auto}
.hero-cover h1{color:#fff;font-size:clamp(44px,6.4vw,92px)}
.hero-cover .kicker{color:#fff;opacity:.9}
.hero-cover .kicker::before,.hero-cover .kicker::after{content:none}
.hero-cover .lead,.hero-cover .trust,.hero-cover .trust a{color:rgba(255,255,255,.88)}
.hero-cover .btn-ghost{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.4);box-shadow:none;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.hc-card{background:var(--bg);color:var(--fg);border-radius:var(--r);padding:28px;display:flex;flex-direction:column;gap:12px;font-size:15px}
.hc-card h3{font-size:19px;margin-bottom:4px}
.hc-card .row{margin:0;display:flex;gap:12px;align-items:flex-start}
.hc-card .row svg{width:19px;height:19px;margin-top:2px;color:var(--accent-ink,var(--accent))}
.hc-card .hours{font-size:15px}

/* facts: one full-width band */
.fstrip{background:var(--accent);color:var(--accent-fg);margin:10px 0 0}
.fstrip-in{display:grid;grid-template-columns:repeat(var(--n,4),minmax(0,1fr))}
.fstrip-in > div{padding:42px 28px;display:flex;flex-direction:column;gap:6px;border-left:1px solid color-mix(in srgb,currentColor 22%,transparent)}
.fstrip-in > div:first-child{border-left:0;padding-left:0}
.fstrip strong{font-family:var(--font-d);font-weight:var(--hw);letter-spacing:var(--ht);font-size:clamp(34px,4.4vw,62px);line-height:1}
.fstrip span{opacity:.8;font-size:15px}

/* services: photo cards */
.sv-photos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.sv-pc{display:flex;flex-direction:column;overflow:hidden;text-decoration:none;color:inherit;transition:transform .25s ease}
.sv-pc:hover{transform:translateY(-4px)}
.sv-pc .photo,.sv-pc .illu{aspect-ratio:16/10;border-radius:0;border:0;box-shadow:none;padding:0}
.sv-pc .photo img{border-radius:0}
.sv-pc .illu-icon svg{width:76px;height:76px}.sv-pc .illu-label{display:none}
.sv-pc.wide .photo,.sv-pc.wide .illu{aspect-ratio:16/7.6}
.sv-pc-body{padding:26px 28px 28px;display:flex;flex-direction:column;gap:10px;flex:1}
.sv-pc-body p{margin:0;color:var(--muted);font-size:16px}
.sv-pc-body .more{margin-top:auto;padding-top:6px}
.sv-pc .tag{align-self:flex-start}

/* services: numbered rows */
.sv-list{border-top:1.5px solid var(--fg)}
.sv-row{display:grid;grid-template-columns:64px 56px minmax(0,1fr) minmax(0,1.3fr) 44px;gap:24px;align-items:center;padding:26px 18px;border-bottom:1px solid var(--line);text-decoration:none;color:inherit;transition:background .2s,color .2s}
.sv-row:hover{background:var(--accent);color:var(--accent-fg)}
.sv-row:hover p{color:inherit;opacity:.85}
.sv-n{font-family:var(--font-d);font-weight:var(--hw);font-size:26px;letter-spacing:var(--ht);color:var(--accent-ink,var(--accent))}
.sv-row:hover .sv-n{color:inherit}
.sv-row h3{font-size:clamp(20px,2vw,26px)}
.sv-row .tag{margin-top:8px}
.sv-row p{margin:0;color:var(--muted)}
.sv-row .sv-go svg{width:26px;height:26px}

/* services: sticky intro + two-column list */
.sv-split-in{display:grid;grid-template-columns:.8fr 1.2fr;gap:56px;align-items:start}
.sv-split-head{position:sticky;top:120px;display:flex;flex-direction:column;gap:20px;align-items:flex-start}
.sv-split-head h2{font-size:clamp(34px,4.4vw,58px)}
.sv-split-head p{margin:0;color:var(--muted)}
.sv-split-list{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.sv-mini{padding:26px;display:flex;flex-direction:column;gap:12px;text-decoration:none;color:inherit}
.sv-mini p{margin:0;color:var(--muted);font-size:15px}
.sv-mini:first-child{grid-column:1 / -1;background:var(--accent);color:var(--accent-fg)}
.sv-mini:last-child:nth-child(even){grid-column:1 / -1}
.sv-mini:first-child p{color:inherit;opacity:.85}
.sv-mini:first-child .icon-box{background:var(--accent-fg);color:var(--accent)}

/* process: timeline */
.tl{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;position:relative}
.tl::before{content:'';position:absolute;left:30px;right:30px;top:30px;height:2px;background:repeating-linear-gradient(90deg,var(--accent) 0 10px,transparent 10px 18px)}
.tl-item{position:relative;display:flex;flex-direction:column;gap:12px}
.tl-dot{width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--accent);color:var(--accent-fg);font-family:var(--font-d);font-weight:var(--hw);font-size:22px;box-shadow:0 0 0 8px var(--bg);margin-bottom:10px}
.tl-item p{margin:0;color:var(--muted)}

/* why: photo + list */
.ws-in{display:grid;grid-template-columns:.9fr 1.1fr;gap:56px;align-items:center}
.ws-photo{aspect-ratio:4/4.6}
.ws-list{list-style:none;margin:0;padding:0;display:grid;gap:0}
.ws-list li{display:grid;grid-template-columns:56px 1fr;gap:16px;padding:22px 0;border-top:1px solid var(--line)}
.ws-list li:last-child{border-bottom:1px solid var(--line)}
.ws-list h3{margin-bottom:6px}
.ws-list p{margin:0;color:var(--muted)}
.ws-list .why-n{font-size:22px}

/* statement */
.stmt .wrap{display:flex;flex-direction:column;gap:26px;align-items:flex-start}
.stmt-text{margin:0;font-family:var(--font-d);font-weight:var(--hw);letter-spacing:var(--ht);font-size:clamp(28px,3.6vw,50px);line-height:1.15;max-width:1060px}
.stmt-text em{font-style:normal;color:var(--accent-ink,var(--accent))}

/* marquee */
.mq{overflow:hidden;background:var(--accent-2);color:var(--accent-2-fg);padding:20px 0;margin:10px 0}
.mq-track{display:flex;width:max-content;animation:mq 38s linear infinite}
.mq-track span{white-space:nowrap;font-family:var(--font-d);font-weight:var(--hw);font-size:clamp(20px,2.4vw,30px);letter-spacing:var(--ht);padding-right:40px}
@keyframes mq{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.mq-track{animation:none}}

/* visit band */
.visit-in{display:grid;grid-template-columns:1.2fr .8fr;gap:48px;align-items:center;padding:56px}
.visit h2{font-size:clamp(30px,4vw,52px)}
.visit .lead{margin-top:14px}
.visit .actions{margin-top:26px}
.visit .hours{font-size:18px;gap:8px 24px}

/* services page: wide visual on top */
.dw{padding:50px 0}
.dw .svc-visual{aspect-ratio:21/8;margin-bottom:36px}
.dw .illu{aspect-ratio:21/8}
.sk-clay .dw .illu::before,.sk-glass .dw .illu::before{width:min(62%,300px)}
.dw-in{display:grid;grid-template-columns:.8fr 1.2fr;gap:56px;align-items:start}
.dw-head{display:flex;flex-direction:column;gap:16px;align-items:flex-start}
.dw-body{display:flex;flex-direction:column;gap:18px;align-items:flex-start}
.dw-body p{margin:0}
.dw-body > p:not(.lead){color:var(--muted)}

@media (max-width:1000px){
.hc-in,.sv-split-in,.ws-in,.visit-in,.dw-in{grid-template-columns:1fr}
.hc-in{padding-top:120px;gap:28px}
.sv-split-head{position:static}
.sv-photos{grid-template-columns:1fr 1fr}
.sv-pc{grid-column:auto!important}
.fstrip-in{grid-template-columns:1fr 1fr}
.fstrip-in > div{border-left:0;padding-left:0;border-top:1px solid color-mix(in srgb,currentColor 22%,transparent)}
.fstrip-in > div:nth-child(-n+2){border-top:0}
.sv-row{grid-template-columns:48px 1fr 32px;gap:6px 16px;padding:22px 6px}
.sv-row .icon-box{display:none}
.sv-row p{grid-column:2}
.sv-row .sv-go{grid-row:1;grid-column:3}
.tl{grid-template-columns:1fr;gap:26px}
.tl::before{left:30px;right:auto;top:30px;bottom:30px;width:2px;height:auto;background:repeating-linear-gradient(180deg,var(--accent) 0 10px,transparent 10px 18px)}
.tl-item{padding-left:86px;min-height:62px}
.tl-dot{position:absolute;left:0;top:0}
.visit-in{padding:36px}
.hero-stack .hero-art{min-height:420px}
}
@media (max-width:640px){
.hero.hero-cover{min-height:0}
.hc-in{padding-top:180px;padding-bottom:36px}
.sv-photos,.sv-split-list{grid-template-columns:1fr}
.sv-mini:first-child{grid-column:auto}
.fstrip-in > div{padding:26px 0}
.visit-in{padding:26px 20px}
.dw .svc-visual,.dw .illu{aspect-ratio:16/10}
.hero-stack .hero-art{min-height:360px}
}
`;
