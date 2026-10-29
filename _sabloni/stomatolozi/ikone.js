// Dental line icons (24px grid, stroke = currentColor). ikona(name) or ikona.za(text) picks one by keywords.
const p = (d) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const TOOTH = 'M7.5 3.5c1.6 0 2.7.9 4.5.9s2.9-.9 4.5-.9c2.4 0 4 1.9 4 4.6 0 3-1.3 4.6-2 7.4-.6 2.6-.9 5-2.4 5-1.7 0-1.6-4.7-4.1-4.7S9.6 20.5 7.9 20.5c-1.5 0-1.8-2.4-2.4-5-.7-2.8-2-4.4-2-7.4 0-2.7 1.6-4.6 4-4.6z';

const I = {
  zub: p(`<path d="${TOOTH}"/>`),
  implant: p('<path d="M7 4.5c1.4 0 2.4.7 5 .7s3.6-.7 5-.7c1.6 0 2.5 1.2 2.5 2.8 0 1.6-.8 2.4-1.5 3.2H6c-.7-.8-1.5-1.6-1.5-3.2C4.5 5.7 5.4 4.5 7 4.5z"/><path d="M9 10.5h6l-.6 9.5h-4.8z"/><path d="M8.8 13h6.4M9 15.5h6M9.2 18h5.6"/>'),
  krunica: p('<path d="M4 9l3-4 2.5 3L12 4l2.5 4L17 5l3 4"/><path d="M5 9.5h14"/><path d="M5.5 9.5c0 4 1 6.5 1.6 9.5h9.8c.6-3 1.6-5.5 1.6-9.5"/>'),
  bravice: p('<path d="M3 10.5c3 2 6 3 9 3s6-1 9-3"/><rect x="5" y="9.2" width="3" height="3" rx=".6"/><rect x="10.5" y="11" width="3" height="3" rx=".6"/><rect x="16" y="9.2" width="3" height="3" rx=".6"/>'),
  rendgen: p('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7.5 9c1.2-.8 2.6-.8 3.5 0 1 .8 2.4.8 3.5 0 1.2-.8 2.4-.4 2.5.5"/><path d="M8 13v3M11 13.5v3M14 13.5v3M17 13v3"/>'),
  cbct: p('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>'),
  dete: p('<circle cx="12" cy="8" r="4"/><path d="M10.5 7.5h.01M13.5 7.5h.01M10.5 9.5c.8.6 2.2.6 3 0"/><path d="M5 21c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>'),
  sjaj: p(`<path d="${TOOTH}" transform="translate(-2 2) scale(.8)"/><path d="M18 3v4M16 5h4M20.5 9.5v2M19.5 10.5h2"/>`),
  desni: p('<path d="M3 8c2.5 2 5.5 3 9 3s6.5-1 9-3"/><path d="M5.5 10c0 3 .7 5.5 1.5 8M10 11v8M14 11v8M18.5 10c0 3-.7 5.5-1.5 8"/>'),
  lice: p('<path d="M12 3c-4 0-6.5 3-6.5 7.2 0 4.6 3 9.8 6.5 9.8s6.5-5.2 6.5-9.8C18.5 6 16 3 12 3z"/><path d="M9.5 10h.01M14.5 10h.01M10 15c1.2.8 2.8.8 4 0"/>'),
  hirurgija: p('<path d="M14.5 3.5l6 6-9.5 9.5-6 1.5 1.5-6z"/><path d="M12.5 5.5l6 6"/>'),
  proteza: p('<path d="M3 8.5C5 13 8.3 15 12 15s7-2 9-6.5"/><path d="M5 10.5v2.5M8 12.6v2.6M12 13.4v2.8M16 12.6v2.6M19 10.5v2.5"/><path d="M3 8.5c3 4.5 15 4.5 18 0"/>'),
  kanal: p(`<path d="${TOOTH}"/><path d="M10 9.5l.8 6M14 9.5l-.8 6"/>`),
  pregled: p('<circle cx="15" cy="8" r="4.5"/><path d="M11.8 11.2L3.5 19.5"/>'),
  film: p('<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 3v18M16 3v18M4 8h4M4 13h4M4 18h4M16 8h4M16 13h4M16 18h4"/>'),
  usb: p('<rect x="7" y="9" width="10" height="12" rx="2"/><path d="M9 9V3h6v6M10.5 5.5h.01M13.5 5.5h.01"/>'),
  mejl: p('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>'),
  oblak: p('<path d="M7 18.5a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.6 1.5A3.8 3.8 0 0 1 17.5 18.5z"/>'),
  stit: p('<path d="M12 3l7.5 3v5.5c0 4.4-3.2 8.2-7.5 9.5-4.3-1.3-7.5-5.1-7.5-9.5V6z"/><path d="M8.8 12l2.2 2.2 4.3-4.4"/>'),
  sat: p('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  cek: p('<path d="M4.5 12.5l4.5 4.5L19.5 7"/>'),
  parking: p('<rect x="4" y="3.5" width="16" height="17" rx="3"/><path d="M10 16.5v-9h3a2.6 2.6 0 0 1 0 5.2h-3"/>'),
  bus: p('<rect x="5" y="3.5" width="14" height="14" rx="2.5"/><path d="M5 11.5h14M8.5 17.5v2.5M15.5 17.5v2.5M8.5 14.5h.01M15.5 14.5h.01"/>'),
  hotel: p('<path d="M3 19.5v-12M3 15h18v4.5M21 15v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11.5" r="2"/>'),
  globus: p('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5s1.1-6.1 3.4-8.5z"/>'),
  kalendar: p('<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
  laser: p('<path d="M3 21l7-7"/><path d="M10 14l3.5-3.5"/><path d="M15 3v3M19.5 4.5l-2 2M21 9h-3M13 9.5L17 5.5"/>'),
  lab: p('<path d="M9 3h6M10 3v6L4.8 18.2A1.8 1.8 0 0 0 6.4 21h11.2a1.8 1.8 0 0 0 1.6-2.8L14 9V3"/><path d="M7 15h10"/>'),
  ekran: p('<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/><path d="M7 12l3-3 2.5 2.5L17 7"/>'),
  telefon: p('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/>'),
  srce: p('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>'),
  cetkica: p('<path d="M4 20L14 10"/><rect x="13" y="3" width="5" height="9" rx="1.2" transform="rotate(45 15.5 7.5)"/><path d="M15 5.5l3 3M16.5 4l3 3"/>'),
};

// keyword → icon, first match wins (order matters)
const MAP = [
  [/cbct|3d|trodimenz/i, 'cbct'], [/rendgen|rtg|ortopan|snim|radiogra|radiolo|bitewing|sinus|telerendgen|ceph|zglob/i, 'rendgen'], [/film/i, 'film'],
  [/implant|all-on|pterigo|zigoma/i, 'implant'], [/krun|most|keramik|cirkon|faset|ljuspic|vinir|cerec|bezmetal/i, 'krunica'],
  [/ortodon|ortoped|bravic|aparat|folij|clearliner|lingval/i, 'bravice'], [/protez|protetik|nadoknad/i, 'proteza'],
  [/kanal|endodon|koren/i, 'kanal'], [/hirurg|vađenj|vadjenj|umnjak|ekstrakc|apikotom/i, 'hirurgija'], [/parodon|paradon|desni|kamen/i, 'desni'],
  [/dec|dete|deca|mleč|fisur|prevent/i, 'dete'], [/estet|izbelj|beljenj|osmeh|nakit/i, 'sjaj'], [/filer|lice|intralipo|prp|bor[ae]/i, 'lice'],
  [/laser/i, 'laser'], [/cad|lab/i, 'lab'], [/pregled|konsult|dijagno/i, 'pregled'], [/anestez|sedac/i, 'srce'], [/higij|četk|cetk|itop/i, 'cetkica'],
];
function za(text) { for (const [re, k] of MAP) if (re.test(text)) return I[k]; return I.zub; }

module.exports = Object.assign((k) => I[k] || I.zub, { za, all: I });
