// Small color helpers so skins can be recolored per business: rgb('#1558c9') -> '21,88,201', mix(a, b, t), rgba(hex, a)
const toRgb = (h) => { const x = h.replace('#', ''); const n = parseInt(x.length === 3 ? x.replace(/./g, '$&$&') : x, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const toHex = (c) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const rgb = (h) => toRgb(h).join(',');
const rgba = (h, a) => `rgba(${rgb(h)},${a})`;
const mix = (a, b, t) => { const x = toRgb(a), y = toRgb(b); return toHex(x.map((v, i) => v + (y[i] - v) * t)); };

module.exports = { rgb, rgba, mix };
