// Shared helpers for demo-site templates. Folders starting with "_" are not published by GitHub Pages (Jekyll).

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// +381113112795 -> "011 311 2795", +38163391218 -> "063 391 218"
function fmtPhone(p) {
  const d = String(p || '').replace(/\D/g, '').replace(/^381/, '');
  if (!d) return '';
  const code = '0' + d.slice(0, 2), rest = d.slice(2);
  const split = rest.length === 7 ? [3, 4] : rest.length === 6 ? [3, 3] : rest.length === 8 ? [4, 4] : [rest.length];
  const parts = []; let i = 0;
  for (const n of split) { parts.push(rest.slice(i, i + n)); i += n; }
  return code + ' ' + parts.join(' ');
}
const telHref = (p) => 'tel:+381' + String(p).replace(/\D/g, '').replace(/^381/, '').replace(/^0/, '');

// [['Pon–Pet','08–20'], ...] -> rows; a plain string stays one line
function hoursList(hours) {
  if (!hours) return [];
  return typeof hours === 'string' ? [['', hours]] : hours;
}

function initials(name) {
  const w = name.replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean);
  return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2)).toUpperCase();
}

// Logo: uploaded file, a custom SVG mark from data, or a monogram the template styles.
// opts.mono(text) returns the template's monogram markup.
function logo(b, opts) {
  if (b.logo) {
    const img = `<img src="logo${esc(b.logo.ext)}" alt="${esc(b.name)}" style="height:${b.logo.h || 44}px;width:auto;display:block">`;
    return b.logo.chip ? `<span class="logo-chip" style="background:${b.logo.chip}">${img}</span>` : img;
  }
  const mark = b.mark ? `<span class="logo-mark" aria-hidden="true">${b.mark}</span>` : opts.mono(b.monogram || initials(b.short || b.name));
  return `${mark}<span class="logo-word">${esc(b.short || b.name)}</span>`;
}

const showRating = (r) => r && r.value && parseFloat(r.value.replace(',', '.')) >= 4 && r.count >= 30; // few reviews are not worth showing

function head({ b, title, fonts, css }) {
  return `<!doctype html>
<html lang="sr-Latn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(title)}</title>
<meta name="description" content="${esc(b.intro)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${fonts}&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
html,body{overflow-x:clip}
p,li,dd,span{overflow-wrap:anywhere}
img{max-width:100%}
.logo-chip{display:inline-flex;align-items:center;padding:8px 14px;border-radius:14px}
${css}
</style>
</head>`;
}

// Honest footer line: this is a proposal built from public info
const demoNote = (b) => `Predlog novog sajta za ${esc(b.name)}. Podaci su preuzeti sa vašeg postojećeg sajta i Google mape.`;

// Default "how it works" steps per kind of shop
function steps(b) {
  if (b.steps) return b.steps;
  const mail = b.email;
  return b.flow === 'stamparija'
    ? [['Pošaljete upit', `Napišite šta vam treba, tiraž i rok, na ${mail}.`], ['Dobijete ponudu', 'Javimo cenu, papir i rok izrade.'], ['Štampamo', 'Gotov materijal preuzimate ili vam ga dostavimo.']]
    : [['Pošaljete fajl', `Na ${mail} ili ga donesete na USB-u.`], ['Javimo cenu i rok', 'Odmah znate koliko košta i kada je gotovo.'], ['Preuzmete', 'Svratite usput, sve vas čeka spremno.']];
}

module.exports = { esc, fmtPhone, telHref, hoursList, logo, showRating, head, demoNote, steps, initials };
