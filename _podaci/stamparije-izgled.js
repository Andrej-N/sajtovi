// Look per business: palette + fonts for the skin (pal), and layout variants (see _sabloni/kopirnice/varijante.js).
// hero: rev | stack | cover | mosaic (3 gallery photos) · svc: photo | list | split · facts: strip · steps: line · why: split · detail: wide · topbar: true
// order: home sections, also marquee, statement, visit. Businesses not listed keep their skin's default look.
// Kept as they were on purpose: electra, grafobogdanov, simbol, copyline, copycentarbg, copycentarns.
const F = {
  fredoka: ['family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700', "'Fredoka',sans-serif", "'Nunito',system-ui,sans-serif"],
  baloo: ['family=Baloo+2:wght@600;700;800&family=Mulish:wght@400;500;600', "'Baloo 2',sans-serif", "'Mulish',system-ui,sans-serif"],
  sora: ['family=Sora:wght@600;700;800&family=Figtree:wght@400;500;600', "'Sora',sans-serif", "'Figtree',system-ui,sans-serif"],
  archivo: ['family=Archivo+Black&family=Archivo:wght@400;500;600', "'Archivo Black',sans-serif", "'Archivo',system-ui,sans-serif"],
  familjen: ['family=Familjen+Grotesk:wght@500;600;700&family=DM+Mono:wght@400;500', "'Familjen Grotesk',system-ui,sans-serif", "'Familjen Grotesk',system-ui,sans-serif", "'DM Mono',monospace"],
  hanken: ['family=Hanken+Grotesk:wght@400;500;700;800&family=Space+Mono:wght@400;700', "'Hanken Grotesk',system-ui,sans-serif", "'Hanken Grotesk',system-ui,sans-serif", "'Space Mono',monospace"],
  fraunces: ['family=Fraunces:opsz,wght@9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400', "'Fraunces',serif", "'IBM Plex Sans',system-ui,sans-serif", "'IBM Plex Mono',monospace"],
  newsreader: ['family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Public+Sans:wght@400;500;600&family=Azeret+Mono:wght@400', "'Newsreader',serif", "'Public Sans',system-ui,sans-serif", "'Azeret Mono',monospace"],
  urbanist: ['family=Urbanist:wght@600;700;800&family=Karla:wght@400;500;600', "'Urbanist',sans-serif", "'Karla',system-ui,sans-serif"],
  syne: ['family=Syne:wght@600;700;800&family=Albert+Sans:wght@400;500;600', "'Syne',sans-serif", "'Albert Sans',system-ui,sans-serif"],
  lexend: ['family=Lexend+Deca:wght@500;600;700&family=Rethink+Sans:wght@400;500;600', "'Lexend Deca',sans-serif", "'Rethink Sans',system-ui,sans-serif"],
  shoulders: ['family=Big+Shoulders+Display:wght@700;800;900&family=Work+Sans:wght@400;500;600', "'Big Shoulders Display',sans-serif", "'Work Sans',system-ui,sans-serif"],
  chivo: ['family=Chivo:wght@400;600;800&family=Chivo+Mono:wght@400;500', "'Chivo',system-ui,sans-serif", "'Chivo',system-ui,sans-serif", "'Chivo Mono',monospace"],
  dmserif: ['family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500', "'DM Serif Display',serif", "'DM Sans',system-ui,sans-serif", "'DM Mono',monospace"],
  epilogue: ['family=Epilogue:wght@400;500;600;800&family=Azeret+Mono:wght@400;500', "'Epilogue',system-ui,sans-serif", "'Epilogue',system-ui,sans-serif", "'Azeret Mono',monospace"],
};
const font = (k, hw, ht) => { const [fonts, fd, fb, fm] = F[k]; return { fonts, fd, fb, ...(fm ? { fm } : {}), hw, ...(ht ? { ht } : {}) }; };

module.exports = {
  // ── clay ──
  arena: {
    pal: { dark: '#2a160f', pri: '#d63b22', acc: '#ffcf3d', bg: '#f4eadf', ...font('fredoka', 700, '-.02em') },
    hero: 'rev', svc: 'photo', facts: 'strip', steps: 'line', topbar: true,
    order: ['hero', 'facts', 'servicesPreview', 'marquee', 'feature', 'process', 'why', 'rating', 'locations', 'faq', 'ctaBand'],
  },
  leptiric: {
    pal: { dark: '#0d2b22', pri: '#0f8a5f', acc: '#ff8a65', bg: '#e2f2ea', ...font('baloo', 800, '-.02em') },
    hero: 'cover', svc: 'split', why: 'split', detail: 'wide',
    order: ['hero', 'servicesPreview', 'facts', 'feature', 'why', 'process', 'rating', 'locations', 'faq', 'ctaBand'],
  },
  uveric: {
    pal: { dark: '#132a30', pri: '#0e7380', acc: '#ffa62b', bg: '#f5eedf', ...font('sora', 700, '-.03em') },
    hero: 'stack', svc: 'list', steps: 'line',
    order: ['hero', 'marquee', 'statement', 'servicesPreview', 'facts', 'process', 'gallery', 'why', 'rating', 'faq', 'locations', 'ctaBand'],
  },
  aeroton: {
    pal: { dark: '#1e0d26', pri: '#c81d64', acc: '#43d9e4', bg: '#f8e3ec', ...font('archivo', 400, '-.03em') },
    svc: 'photo', facts: 'strip', why: 'split', detail: 'wide', topbar: true,
    order: ['hero', 'servicesPreview', 'facts', 'feature', 'why', 'process', 'visit', 'faq', 'ctaBand'],
  },
  // ── minimal ──
  copystudio: {
    pal: { fg: '#141414', bg: '#f4f2ed', acc: '#e5341c', accFg: '#fff', ...font('familjen', 700, '-.045em') },
    svc: 'photo', steps: 'line', detail: 'wide', topbar: true,
    order: ['hero', 'facts', 'servicesPreview', 'statement', 'feature', 'process', 'why', 'rating', 'faq', 'locations', 'ctaBand'],
  },
  adverto: {
    pal: { fg: '#1c2a4a', bg: '#ece7df', acc: '#ff6e4f', ...font('hanken', 800, '-.05em') },
    svc: 'split', facts: 'strip',
    order: ['hero', 'marquee', 'servicesPreview', 'process', 'feature', 'why', 'facts', 'faq', 'visit', 'ctaBand'],
  },
  byzart: {
    pal: { fg: '#1f1b3d', bg: '#f3eee3', acc: '#c8961e', ...font('fraunces', 700, '-.025em') },
    why: 'split', detail: 'wide', topbar: true,
    order: ['hero', 'statement', 'servicesPreview', 'facts', 'why', 'process', 'rating', 'faq', 'locations', 'ctaBand'],
  },
  matija: {
    pal: { fg: '#22301f', bg: '#e6eadc', acc: '#e45a2a', accFg: '#fff', ...font('newsreader', 600, '-.02em') },
    hero: 'cover', svc: 'split', facts: 'strip', steps: 'line', why: 'split',
    order: ['hero', 'facts', 'servicesPreview', 'gallery', 'why', 'process', 'faq', 'locations', 'ctaBand'],
  },
  // ── glass ──
  izradaflajera: {
    pal: { bg: '#03211f', pri: '#00a88f', acc: '#ffd166', grey: '#a9c2bd', ...font('urbanist', 800, '-.03em') },
    hero: 'stack', svc: 'photo', steps: 'line',
    order: ['hero', 'marquee', 'servicesPreview', 'gallery', 'process', 'why', 'rating', 'faq', 'locations', 'ctaBand'],
  },
  kreatika: {
    pal: {
      bg: '#160b06', pri: '#ff5d2e', acc: '#ffc9a8', grey: '#c4b0a5', ...font('syne', 800, '-.03em'),
      blobs: ['width:560px;height:560px;border-radius:50%;background:#ff5d2e;right:-220px;top:-200px;opacity:.9', 'width:260px;height:260px;border-radius:50%;background:#ffc9a8;right:-90px;bottom:-90px;opacity:.5'],
    },
    hero: 'mosaic', svc: 'split', why: 'split', detail: 'wide',
    order: ['hero', 'statement', 'servicesPreview', 'why', 'process', 'faq', 'visit', 'ctaBand'], // portfolio is in the hero mosaic and on O nama
  },
  ris: {
    pal: { bg: '#07142a', pri: '#2f7bff', acc: '#ff9ec0', grey: '#a8b4c8', ...font('lexend', 700, '-.03em') },
    hero: 'rev', svc: 'list', facts: 'strip', topbar: true,
    order: ['hero', 'facts', 'servicesPreview', 'feature', 'process', 'why', 'rating', 'faq', 'locations', 'ctaBand'],
  },
  zebra: {
    pal: {
      bg: '#0d0d0d', pri: '#f1f1f1', priFg: '#0d0d0d', acc: '#ff3b30', accFg: '#fff', grey: '#a0a0a0', ...font('shoulders', 900, '-.01em'),
      blobs: [
        'width:160%;height:120px;background:#f1f1f1;left:-30%;top:8%;transform:rotate(-16deg);opacity:.16',
        'width:160%;height:70px;background:#f1f1f1;left:-30%;top:30%;transform:rotate(-16deg);opacity:.12',
        'width:160%;height:140px;background:#f1f1f1;left:-30%;top:58%;transform:rotate(-16deg);opacity:.14',
        'width:520px;height:520px;border-radius:50%;background:#ff3b30;right:-180px;top:-120px;opacity:.85',
        'width:300px;height:300px;border-radius:50%;background:#ff3b30;left:-120px;bottom:-80px;opacity:.7',
      ],
      css: '.cta-in{background:rgba(255,59,48,.6);color:#fff}.cta-in .btn-primary{background:#fff;color:#0d0d0d}h1,h2{text-transform:uppercase}',
    },
    steps: 'line', why: 'split',
    order: ['hero', 'marquee', 'servicesPreview', 'process', 'why', 'feature', 'faq', 'visit', 'ctaBand'],
  },
  // ── spatial ──
  indexcopy: {
    pal: { dark: '#17123d', bg: '#e9eff9', acc: '#0088c2', ...font('chivo', 800, '-.035em') },
    hero: 'rev', svc: 'photo', facts: 'strip', topbar: true,
    order: ['hero', 'facts', 'statement', 'servicesPreview', 'feature', 'process', 'why', 'faq', 'locations', 'ctaBand'],
  },
  staze: {
    pal: { dark: '#3a1e10', bg: '#f1e9dc', acc: '#b8621a', ...font('dmserif', 400, '-.01em') },
    hero: 'cover', svc: 'list', why: 'split', detail: 'wide',
    order: ['hero', 'servicesPreview', 'why', 'feature', 'process', 'facts', 'faq', 'visit', 'ctaBand'],
  },
  grafotin: {
    pal: { dark: '#0f3b2d', bg: '#edf0e5', acc: '#d92e63', ...font('epilogue', 800, '-.04em') },
    hero: 'stack', svc: 'split', steps: 'line',
    order: ['hero', 'marquee', 'servicesPreview', 'statement', 'gallery', 'process', 'why', 'faq', 'locations', 'ctaBand'],
  },
};
