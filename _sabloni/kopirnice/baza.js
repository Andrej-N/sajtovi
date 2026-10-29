// Layout CSS shared by all skins. Skins set the tokens below and add their own look on top.
// Tokens: --bg --fg --muted --surface --surface-2 --line --accent --accent-fg --accent-2 --accent-2-fg
//         --r (big radius) --r-sm --shadow --font-d --font-b --hw (heading weight) --ht (heading tracking)
module.exports = `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
html,body{overflow-x:clip}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--font-b);font-size:17px;line-height:1.55;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:inherit}
p,li,dd,span,a{overflow-wrap:anywhere}
svg{flex:none}
h1,h2,h3{font-family:var(--font-d);font-weight:var(--hw);letter-spacing:var(--ht);margin:0;line-height:1.02}
h1{font-size:clamp(42px,6.2vw,80px)}
h2{font-size:clamp(32px,4.2vw,54px)}
h3{font-size:21px;line-height:1.2}
.wrap{max-width:1240px;margin:0 auto;padding:0 32px}
.lead{font-size:clamp(18px,1.6vw,20px);line-height:1.6;color:var(--muted);margin:0;max-width:640px}
.kicker{margin:0 0 14px;font-size:14px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent-ink,var(--accent))}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:54px;padding:0 26px;border-radius:var(--r-sm);font-weight:600;font-size:16px;text-decoration:none;border:0;cursor:pointer;font-family:inherit;transition:transform .2s ease,box-shadow .2s ease}
.btn svg{width:19px;height:19px}
.btn:hover{transform:translateY(-2px)}
.btn-primary{background:var(--accent);color:var(--accent-fg)}
.btn-ghost{background:var(--surface);color:var(--fg);border:1px solid var(--line)}
.actions{display:flex;gap:14px;flex-wrap:wrap}
.more{display:inline-flex;align-items:center;gap:8px;font-weight:600;text-decoration:none;color:var(--accent-ink,var(--accent))}
.more svg{width:18px;height:18px;transition:transform .2s}
a:hover .more svg,.more:hover svg{transform:translateX(4px)}
.icon-box{width:52px;height:52px;border-radius:calc(var(--r-sm) * .8);display:inline-flex;align-items:center;justify-content:center;background:var(--accent-2);color:var(--accent-2-fg)}
.icon-box svg{width:26px;height:26px}
.tag{display:inline-block;padding:5px 12px;border-radius:999px;font-size:13px;font-weight:600;background:var(--surface-2);color:var(--fg)}
.stars{display:inline-flex;gap:2px;color:var(--star,var(--accent))}.stars svg{width:17px;height:17px}

/* header */
.site-head{position:sticky;top:0;z-index:20}
.head-in{display:flex;align-items:center;gap:24px;min-height:78px}
.brand{display:flex;align-items:center;gap:12px;text-decoration:none;margin-right:auto}
.logo-word{font-family:var(--font-d);font-weight:var(--hw);font-size:19px;letter-spacing:-.01em}
.logo-mark svg{height:40px;width:auto}
.logo-chip{display:inline-flex;align-items:center;padding:6px 12px;border-radius:12px}
.mono{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:var(--font-d);font-weight:800;font-size:15px;background:var(--accent);color:var(--accent-fg)}
.menu{display:flex;gap:6px}
.menu a{padding:10px 14px;border-radius:999px;text-decoration:none;font-weight:500}
.menu a[aria-current]{background:var(--surface-2)}
.head-cta{min-height:46px;padding:0 18px}
.mnav{display:none;position:relative}
.mnav summary{list-style:none;width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:var(--surface);border:1px solid var(--line)}
.mnav summary::-webkit-details-marker{display:none}
.mnav summary svg{width:22px;height:22px}
.mnav nav{position:absolute;right:0;top:56px;min-width:240px;display:grid;gap:2px;padding:10px;border-radius:16px;background:var(--surface);border:1px solid var(--line);box-shadow:0 30px 60px -20px rgba(0,0,0,.35)}
.mnav nav a{padding:12px 14px;border-radius:10px;text-decoration:none;font-weight:500}

/* hero */
.hero{padding:56px 0 90px;position:relative}
.hero-in{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center}
.hero-copy{display:flex;flex-direction:column;gap:26px}
.hero-copy .kicker{margin:0}
.trust{display:flex;flex-wrap:wrap;gap:10px 24px;font-size:15px;color:var(--muted)}
.trust a{display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:var(--fg)}
.hero-art{position:relative;min-height:520px}

/* facts */
.facts{padding:0 0 30px}
.facts-in{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.fact{padding:26px;border-radius:var(--r);background:var(--surface);display:flex;flex-direction:column;gap:4px}
.fact strong{font-family:var(--font-d);font-weight:var(--hw);font-size:clamp(30px,3.4vw,44px);letter-spacing:var(--ht);line-height:1}
.fact span{color:var(--muted);font-size:15px}

/* sections */
.sec{padding:90px 0}
.sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:44px}
.sec-head h2{max-width:760px}
.sec-note{margin:0;max-width:380px;color:var(--muted)}
.svc-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.svc-card{display:flex;flex-direction:column;gap:14px;padding:30px;border-radius:var(--r);background:var(--surface);text-decoration:none;color:inherit;transition:transform .25s ease,box-shadow .25s ease;position:relative}
.svc-card:hover{transform:translateY(-4px)}
.svc-card p{margin:0;color:var(--muted);font-size:16px}
.svc-card .more{margin-top:auto}
.svc-card .tag{position:absolute;top:30px;right:30px}
.feature-in{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.feature-copy{display:flex;flex-direction:column;gap:22px;align-items:flex-start}
.photo{margin:0;border-radius:var(--r);overflow:hidden;background:var(--surface-2)}
.photo img{width:100%;height:100%;object-fit:cover}
.feature-visual,.svc-visual{aspect-ratio:4/3.2}
.illu{margin:0;border-radius:var(--r);aspect-ratio:4/3.2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;position:relative;overflow:hidden;background:var(--illu-bg,var(--accent-2));color:var(--illu-fg,var(--accent-2-fg))}
.illu-icon svg{width:120px;height:120px;stroke-width:1.1}
.illu-label{font-family:var(--font-d);font-weight:var(--hw);font-size:22px;letter-spacing:var(--ht);text-align:center;padding:0 24px}
.checks{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.checks li{display:flex;gap:12px;align-items:flex-start}
.checks svg{width:20px;height:20px;margin-top:3px;color:var(--accent-ink,var(--accent))}
.steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.step{padding:30px;border-radius:var(--r);background:var(--surface);display:flex;flex-direction:column;gap:14px;position:relative}
.step p{margin:0;color:var(--muted)}
.step-n{position:absolute;top:26px;right:28px;font-family:var(--font-d);font-weight:var(--hw);font-size:15px;color:var(--muted)}
.gal-grid{display:grid;grid-template-columns:repeat(var(--cols,4),minmax(0,1fr));grid-auto-rows:230px;gap:14px}
.gal-grid .photo{height:100%}
.why-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
.why-item{padding:30px;border-radius:var(--r);border:1px solid var(--line);display:flex;flex-direction:column;gap:10px}
.why-item p{margin:0;color:var(--muted)}
.why-n{font-family:var(--font-d);font-weight:var(--hw);color:var(--accent-ink,var(--accent))}
.rating-in{display:grid;grid-template-columns:auto 1fr;gap:56px;align-items:center;padding:56px;border-radius:var(--r);background:var(--surface)}
.rating-num{display:flex;flex-direction:column;align-items:center;gap:8px}
.rating-num strong{font-family:var(--font-d);font-weight:var(--hw);font-size:clamp(80px,10vw,140px);line-height:.9;letter-spacing:-.05em}
.rating-num .stars svg{width:24px;height:24px}
.rating-copy{display:flex;flex-direction:column;gap:18px;align-items:flex-start}
.faq-in{display:grid;grid-template-columns:.8fr 1.2fr;gap:56px;align-items:start}
.faq-list{display:grid;gap:12px}
.faq-list details{border-radius:var(--r-sm);background:var(--surface);padding:0 24px}
.faq-list summary{cursor:pointer;list-style:none;padding:22px 0;font-weight:600;font-size:18px;display:flex;justify-content:space-between;gap:16px}
.faq-list summary::-webkit-details-marker{display:none}
.faq-list summary::after{content:'+';font-size:24px;line-height:1;color:var(--accent-ink,var(--accent))}
.faq-list details[open] summary::after{content:'–'}
.faq-list details p{margin:0 0 22px;color:var(--muted)}
.loc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:18px}
.loc-card{border-radius:var(--r);background:var(--surface);overflow:hidden;display:flex;flex-direction:column}
.map{width:100%;height:260px;border:0;display:block;filter:var(--map-filter,none)}
.loc-body{padding:26px 28px;display:flex;flex-direction:column;gap:12px}
.loc-body .row{margin:0;display:flex;gap:12px;align-items:flex-start}
.loc-body .row svg{width:20px;height:20px;margin-top:3px;color:var(--accent-ink,var(--accent))}
.hours{margin:0;display:grid;grid-template-columns:auto 1fr;gap:2px 16px}
.hours dt{color:var(--muted)}.hours dd{margin:0}
.cta-band{padding:30px 0 100px}
.cta-in{border-radius:var(--r);padding:64px;background:var(--accent);color:var(--accent-fg);display:flex;flex-direction:column;gap:22px;align-items:flex-start}
.cta-in .lead{color:inherit;opacity:.85}

/* inner pages */
.page-hero{padding:56px 0 40px;position:relative;overflow:hidden}
.page-hero .wrap{display:flex;flex-direction:column;gap:20px;position:relative;z-index:1}
.crumbs{margin:0;font-size:14px;color:var(--muted)}
.crumbs a{text-decoration:none}
.chips{display:flex;flex-wrap:wrap;gap:10px;padding-top:10px;padding-bottom:10px}
.chips a{padding:10px 16px;border-radius:999px;background:var(--surface);border:1px solid var(--line);text-decoration:none;font-weight:500;font-size:15px}
.svc-detail{padding:60px 0}
.svc-detail-in{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.svc-detail.flip .svc-visual{order:2}
.svc-copy{display:flex;flex-direction:column;gap:18px;align-items:flex-start}
.svc-copy p{margin:0}
.svc-copy .lead{color:var(--fg)}
.svc-copy > p:not(.lead){color:var(--muted)}
.story-in{display:grid;grid-template-columns:1.1fr .9fr;gap:56px;align-items:center}
.story-copy{display:flex;flex-direction:column;gap:20px}
.story-copy .lead:first-child{color:var(--fg);font-size:clamp(20px,2vw,26px)}
.story-photo{aspect-ratio:4/4.4;position:relative}
.form-in{display:grid;grid-template-columns:.8fr 1.2fr;gap:56px;align-items:start}
.form{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:36px;border-radius:var(--r);background:var(--surface)}
.form label{display:flex;flex-direction:column;gap:8px;font-weight:600;font-size:15px}
.form .full,.form button{grid-column:1 / -1}
.form input,.form select,.form textarea{font:inherit;font-weight:400;padding:14px 16px;border-radius:calc(var(--r-sm) * .8);border:1px solid var(--line);background:var(--bg);color:var(--fg);min-height:50px}
.form textarea{resize:vertical}

/* footer */
.site-foot{padding:70px 0 30px;margin-top:20px}
.foot-grid{display:grid;grid-template-columns:1.4fr repeat(3,1fr);gap:40px}
.foot-brand p{color:var(--muted);font-size:15px;max-width:340px}
.foot-col{display:flex;flex-direction:column;gap:10px;font-size:15px}
.foot-col h3{font-size:14px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;font-family:var(--font-b);font-weight:600;color:var(--muted)}
.foot-col a{text-decoration:none}
.foot-col a:hover{text-decoration:underline}
.foot-note{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-top:50px;padding-top:24px;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}

@media (max-width:1000px){
.menu{display:none}.mnav{display:block}
.head-cta span{display:none}.head-cta{width:46px;padding:0}
.hero-in,.feature-in,.svc-detail-in,.story-in,.faq-in,.form-in{grid-template-columns:1fr}
.svc-detail.flip .svc-visual{order:0}
.hero-art{min-height:420px}
.facts-in{grid-template-columns:repeat(2,minmax(0,1fr))}
.svc-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.svc-card{grid-column:auto!important}
.fact:last-child:nth-child(odd){grid-column:span 2}
.steps{grid-template-columns:1fr}
.foot-grid{grid-template-columns:1fr 1fr}
.rating-in{grid-template-columns:1fr;padding:36px}
}
@media (max-width:640px){
body{font-size:16px}
.wrap{padding:0 16px}
.hero{padding:30px 0 60px}.sec{padding:60px 0}
.svc-grid{grid-template-columns:1fr}
.gal-grid{grid-template-columns:1fr 1fr!important;grid-auto-rows:150px}
.gal-grid figure{grid-column:auto!important;grid-row:auto!important}.gal-grid figure:first-child{grid-column:span 2!important;grid-row:span 2!important}
.form{grid-template-columns:1fr;padding:22px}
.cta-in{padding:36px 24px}
.foot-grid{grid-template-columns:1fr}
.hero-art{min-height:360px}
.loc-grid{grid-template-columns:1fr}
}
`;
