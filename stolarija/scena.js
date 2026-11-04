// Stolarija: proizvod firme koji se sklapa dok se skroluje (mode: prozor, namestaj, vrata, krevet).
// Prozor: Delovi su na početku rasklopljeni, a redom dolaze na mesto:
// štok, čelično ojačanje u komorama, krilo, zaptivke, staklopaket, okov i ručka. Na kraju se krilo otvori.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const canvas = document.getElementById('scena');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CFG = window.SCENA || { bg: {} };
const C = { top: '#0b2f86', glow: '92,180,245', hi: '214,240,255', low: '6,20,84', mid: '40,110,240', ...CFG.bg };

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  document.documentElement.classList.add('bez-3d');
  throw e;
}

const portrait = () => innerWidth / innerHeight < 0.9;
const isPortrait = portrait();
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.transmissionResolutionScale = isPortrait ? 0.5 : 0.7;

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

/* ---------- svetlo i pozadina ---------- */
const scene = new THREE.Scene();
const envS = new THREE.Scene();
envS.background = new THREE.Color(0x0a2a6b);
function panel(w, h, x, y, z, col, i) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(i), side: THREE.DoubleSide }));
  m.position.set(x, y, z); m.lookAt(0, 0, 0); envS.add(m);
}
panel(30, 3, 0, 16, 6, 0xffffff, 14); panel(3, 22, -20, 2, 10, 0xe6f4ff, 9); panel(4, 22, 22, 0, 6, 0xbfe4ff, 6);
panel(30, 5, 0, -14, 8, 0x7fb6ff, 3); panel(14, 10, 4, 4, 24, 0xffffff, 2.2); panel(10, 6, -8, -6, -20, 0xffb37a, 5);
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(envS, 0.012).texture;

const bgc = document.createElement('canvas'); bgc.width = 1024; bgc.height = 640;
const g = bgc.getContext('2d');
g.fillStyle = C.top; g.fillRect(0, 0, 1024, 640);
function blob(x, y, r, c) { const a = g.createRadialGradient(x, y, 0, x, y, r); a.addColorStop(0, c); a.addColorStop(1, c.replace(/[\d.]+\)$/, '0)')); g.fillStyle = a; g.fillRect(0, 0, 1024, 640); }
blob(780, 130, 520, `rgba(${C.glow},0.9)`); blob(960, 30, 280, `rgba(${C.hi},0.85)`); blob(120, 620, 560, `rgba(${C.low},0.95)`); blob(520, 650, 380, `rgba(${C.mid},0.8)`);
const bg = new THREE.CanvasTexture(bgc); bg.colorSpace = THREE.SRGBColorSpace; scene.background = bg;

const key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(3, 6, 7); scene.add(key);
const rim = new THREE.DirectionalLight(0xffc49a, 1.5); rim.position.set(-6, -2, -3); scene.add(rim);

/* ---------- materijali ---------- */
const glass = new THREE.MeshPhysicalMaterial({ color: 0xe4f3ff, transparent: true, opacity: 0.2, roughness: 0.02, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.4, depthWrite: false, side: THREE.DoubleSide });
const pvc = new THREE.MeshPhysicalMaterial({ color: 0xdfe5e6, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.35, envMapIntensity: 0.62, side: THREE.DoubleSide });
const steel = new THREE.MeshStandardMaterial({ color: 0xaebccb, metalness: 1, roughness: 0.36, envMapIntensity: 1.25 });
const alu = new THREE.MeshStandardMaterial({ color: 0xdfe9f3, metalness: 1, roughness: 0.3, envMapIntensity: 1.2 });
const rubber = new THREE.MeshStandardMaterial({ color: 0x12161c, roughness: 0.62, metalness: 0.05 });
const copper = new THREE.MeshStandardMaterial({ color: 0xd98a4e, metalness: 1, roughness: 0.28, envMapIntensity: 1.5 });

/* ---------- delovi: svaki zna odakle dolazi i kada ---------- */
const parts = [];
function part(parent, obj, off, rot, a, b) {
  parent.add(obj);
  parts.push({ obj, base: obj.position.clone(), baseR: obj.rotation.clone(), off: V(...off), rot, a, b });
  return obj;
}

/* ---------- profil sa komorama, sečen pod 45 stepeni ---------- */
function outline(pts, holes) {
  const s = new THREE.Shape();
  pts.forEach(([u, v], i) => (i ? s.lineTo(u, v) : s.moveTo(u, v)));
  s.closePath();
  for (const [a, b, c, d] of holes) {
    const h = new THREE.Path();
    h.moveTo(a, b); h.lineTo(a, d); h.lineTo(c, d); h.lineTo(c, b); h.closePath();
    s.holes.push(h);
  }
  return s;
}
function bar(shape, L, inward, depth) {
  const geo = new THREE.ExtrudeGeometry(shape, { depth: L, bevelEnabled: false, steps: 1, curveSegments: 1 });
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i), z = p.getZ(i);
    p.setZ(i, z < L / 2 ? z + u : z - u); // sečenje pod 45 stepeni: spoljna ivica ostaje najduža
  }
  geo.computeVertexNormals();
  const along = inward.clone().cross(depth);
  geo.applyMatrix4(new THREE.Matrix4().makeBasis(inward, depth, along));
  return geo;
}
// Četiri strane pravougaonika: gde počinju, kuda ide unutrašnjost i kolika je dužina.
function sides(W, H) {
  const d = V(0, 0, 1);
  return [
    { start: V(W / 2, H / 2, 0), inward: V(0, -1, 0), L: W, out: V(0, 1, 0), along: V(-1, 0, 0), d },
    { start: V(W / 2, -H / 2, 0), inward: V(-1, 0, 0), L: H, out: V(1, 0, 0), along: V(0, 1, 0), d },
    { start: V(-W / 2, -H / 2, 0), inward: V(0, 1, 0), L: W, out: V(0, -1, 0), along: V(1, 0, 0), d },
    { start: V(-W / 2, H / 2, 0), inward: V(1, 0, 0), L: H, out: V(-1, 0, 0), along: V(0, -1, 0), d },
  ];
}
function steelBar(s, u1, u2, v1, v2, inset) {
  // čelična cev koja ulazi u najveću komoru
  const t = 0.022;
  const shape = outline([[u1, v1], [u2, v1], [u2, v2], [u1, v2]], [[u1 + t, v1 + t, u2 - t, v2 - t]]);
  const L = s.L - 2 * inset;
  const geo = new THREE.ExtrudeGeometry(shape, { depth: L, bevelEnabled: false, steps: 1, curveSegments: 1 });
  const along = s.inward.clone().cross(s.d);
  geo.applyMatrix4(new THREE.Matrix4().makeBasis(s.inward, s.d, along));
  const m = new THREE.Mesh(geo, steel);
  m.position.copy(along).multiplyScalar(inset);
  return m;
}

const MODE = CFG.mode || 'prozor';

/* ---------- drvo: tekstura godova, boja iz podataka ---------- */
function woodMat(hex, rough = 0.48) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 1024;
  const g2 = c.getContext('2d');
  g2.fillStyle = hex; g2.fillRect(0, 0, 512, 1024);
  let q = 11; const r = () => { q = (q * 16807) % 2147483647; return q / 2147483647; };
  for (let i = 0; i < 240; i++) {
    const x = r() * 512, w = 1 + r() * 5, dark = r() > 0.5;
    g2.strokeStyle = dark ? `rgba(30,14,4,${0.05 + r() * 0.16})` : `rgba(255,220,170,${0.03 + r() * 0.08})`;
    g2.lineWidth = w;
    g2.beginPath(); g2.moveTo(x, 0);
    g2.bezierCurveTo(x + (r() - 0.5) * 34, 340, x + (r() - 0.5) * 34, 680, x + (r() - 0.5) * 18, 1024);
    g2.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  return new THREE.MeshPhysicalMaterial({ map: t, roughness: rough, clearcoat: 0.3, clearcoatRoughness: 0.42, envMapIntensity: 0.7 });
}
const DRVO = woodMat(CFG.drvo || '#7B4B2A');
const SVETLO = woodMat(CFG.drvo2 || '#C49A6C', 0.56);
const FRONT = new THREE.MeshPhysicalMaterial({ color: CFG.front || 0x2b3236, roughness: 0.62, clearcoat: 0.08, envMapIntensity: 0.6 });
const black = new THREE.MeshStandardMaterial({ color: 0x15181c, metalness: 0.8, roughness: 0.36 });
// daska: širina, visina, debljina; ivice blago zaobljene
const board = (w, h, d, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * 0.16), mat); m.position.set(x, y, z); return m; };
const baseKey = { sx: 0.2, sy: 0.15 };
const K = (p, look, dir, d, dp) => ({ p, look, dir, d, dp, ...baseKey });

/* ---------- element nameštaja: korpus, leđa i police, fioke, okov, fronte, ručke, pa se otvori ---------- */
function namestaj() {
  const W = 6, H = 6.4, D = 1.9, T = 0.14;
  const u = new THREE.Group(); u.rotation.set(0.05, -0.58, 0.02); scene.add(u);
  part(u, board(T, H, D, DRVO, -W / 2 + T / 2, 0, 0), [-2.2, 0.4, -0.6], [0.1, 0.3, 0.1], 0.02, 0.12);
  part(u, board(T, H, D, DRVO, W / 2 - T / 2, 0, 0), [2.2, -0.3, -0.6], [0.1, -0.3, -0.1], 0.04, 0.14);
  part(u, board(W - 2 * T, T, D, DRVO, 0, H / 2 - T / 2, 0), [0.3, 1.8, -0.4], [0.3, 0.1, 0.1], 0.06, 0.16);
  part(u, board(W - 2 * T, T, D, DRVO, 0, -H / 2 + T / 2, 0), [-0.3, -1.8, -0.4], [-0.3, 0.1, -0.1], 0.08, 0.18);
  part(u, board(W - 2 * T, H - 2 * T, 0.05, SVETLO, 0, 0, -D / 2 + 0.05), [0, 0.2, -4], [0, 0.2, 0], 0.2, 0.3);
  const midY = -0.5;
  part(u, board(W - 2 * T, T * 0.8, D - 0.14, DRVO, 0, midY, 0.03), [1.5, 0, 3.6], [0, 0.3, 0], 0.26, 0.34);
  part(u, board(W - 2 * T, T * 0.7, D - 0.14, SVETLO, 0, midY + 1.45, 0.03), [-1.5, 0.2, 3.4], [0, -0.3, 0], 0.29, 0.36);
  part(u, board(W - 2 * T, T * 0.7, D - 0.14, SVETLO, 0, midY + 2.65, 0.03), [1.5, 0.3, 3.2], [0, 0.3, 0], 0.31, 0.38);
  // fioke u donjem delu
  const dH = (H / 2 - T + midY) / 2 - 0.02;
  const drawers = [];
  [0, 1].forEach((i) => {
    const y = -H / 2 + T + dH * (i + 0.5) + 0.02 * i;
    const g = new THREE.Group(); g.position.set(0, y, 0);
    g.add(board(W - 2 * T - 0.12, dH - 0.12, D - 0.3, SVETLO, 0, -0.02, -0.08));
    const front = board(W - 2 * T - 0.04, dH - 0.04, 0.12, FRONT, 0, 0, D / 2 + 0.05); g.add(front);
    g.add(board(1.4, 0.07, 0.09, black, 0, dH * 0.22, D / 2 + 0.16));
    const q = part(u, g, [i ? -1.1 : 1.1, 0, 3.2], [0, i ? -0.3 : 0.3, 0], 0.39 + i * 0.04, 0.49 + i * 0.04);
    drawers.push(q);
  });
  // okov: šarke i klizači
  const hw = new THREE.Group();
  const upH = H / 2 - T - midY;
  const upY = midY + upH / 2;
  for (const sx of [-1, 1]) for (const dy of [-1.55, 0, 1.55]) {
    hw.add(board(0.12, 0.34, 0.5, alu, sx * (W / 2 - T - 0.07), upY + dy, D / 2 - 0.28));
  }
  for (const sx of [-1, 1]) for (const y of [-H / 2 + T + dH * 0.5, -H / 2 + T + dH * 1.5]) hw.add(board(0.06, 0.08, D - 0.3, steel, sx * (W / 2 - T - 0.05), y, -0.05));
  part(u, hw, [0, 0, 2.4], [0, 0, 0], 0.51, 0.6);
  // fronte gornjeg dela: svaka na svojoj šarci
  const fW = (W - 0.06) / 2, fH = upH - 0.06;
  const mkDoor = (s) => {
    const hinge = new THREE.Group(); hinge.position.set(s * (W / 2 - 0.02), upY, D / 2 + 0.03); u.add(hinge);
    const d = new THREE.Group(); d.position.x = -s * fW / 2; hinge.add(d);
    const hold = new THREE.Group(); d.add(hold);
    hold.add(board(fW, fH, 0.12, FRONT, 0, 0, 0.03));
    const hd = board(0.07, 1.2, 0.09, black, -s * (fW / 2 - 0.26), -0.8, 0.14);
    part(hold, hd, [-s * 0.2, -0.3, 1.4], [0.3, 0, 0], 0.78, 0.86);
    return { hinge, hold, s };
  };
  const doors = [mkDoor(-1), mkDoor(1)];
  parts.push({ obj: doors[0].hold, base: V(0, 0, 0), baseR: new THREE.Euler(), off: V(-0.6, 0.3, 4), rot: [0.1, 0.32, 0.04], a: 0.63, b: 0.74 });
  parts.push({ obj: doors[1].hold, base: V(0, 0, 0), baseR: new THREE.Euler(), off: V(0.6, -0.2, 4.6), rot: [0.1, -0.32, -0.04], a: 0.66, b: 0.77 });
  // topla LED traka pod vrhom, pali se kad se otvori
  const led = new THREE.Mesh(new THREE.BoxGeometry(W - 2 * T - 0.3, 0.035, 0.08), new THREE.MeshBasicMaterial({ color: 0x20160e }));
  led.position.set(0, H / 2 - T - 0.04, 0.5); u.add(led);
  const lamp = new THREE.PointLight(0xffc98e, 0, 12, 1.6); lamp.position.set(0, H / 2 - 1, 1.2); u.add(lamp);
  const keys = [
    K(0, [0, 0, 0.8], [0.06, 0.14, 1], 34, 62), K(0.18, [0, 0, 0], [0.04, 0.14, 1], 30, 54), K(0.36, [0, 0, 0.2], [0.34, 0.16, 1], 25, 48),
    K(0.5, [0, -1.2, 0.8], [0.14, 0.2, 1], 25, 50), K(0.6, [0, -0.4, 0.6], [-0.24, 0.12, 1], 24, 48), K(0.76, [0, 0, 1.6], [0.1, 0.1, 1], 28, 54),
    K(0.88, [0, 0, 0.5], [0.04, 0.08, 1], 25, 50), K(1, [0, 0, 0.5], [0.12, 0.08, 1], 24, 48), K(1.3, [0, 0, 0.5], [0.3, 0.04, 1], 20, 42),
  ];
  function finale(p) {
    const open = smooth(0.9, 0.98, p);
    doors[0].hinge.rotation.y = -open * 1.75;
    doors[1].hinge.rotation.y = open * 1.75;
    drawers[1].position.z = drawers[1].position.z + smooth(0.93, 0.99, p) * 1.1;
    led.material.color.set(open > 0.02 ? 0xfff0da : 0x20160e);
    lamp.intensity = open * 24;
  }
  return { keys, finale, run: 2, mirno: 0.86 };
}

/* ---------- drvena vrata: štok, ram krila, ispuna, šarke, brava i kvaka, lajsne, pa se otvore ---------- */
function vrata() {
  const W = 3.8, H = 7.4, FW = 0.34, FD = 0.9;
  const u = new THREE.Group(); u.rotation.set(0.03, -0.6, 0.01); scene.add(u);
  part(u, board(FW, H, FD, DRVO, -W / 2 + FW / 2, 0, 0), [-1.6, 0.3, -0.6], [0.1, 0.3, 0.08], 0.02, 0.13);
  part(u, board(FW, H, FD, DRVO, W / 2 - FW / 2, 0, 0), [1.6, -0.3, -0.6], [0.1, -0.3, -0.08], 0.05, 0.16);
  part(u, board(W - 2 * FW, FW, FD, DRVO, 0, H / 2 - FW / 2, 0), [0.2, 1.5, -0.5], [0.3, 0, 0.1], 0.08, 0.19);
  const SW = W - 2 * FW - 0.04, SH = H - FW - 0.08, S = 0.36;
  const hinge = new THREE.Group(); hinge.position.set(-SW / 2, -FW / 2 + 0.02, 0.28); u.add(hinge);
  const sash = new THREE.Group(); sash.position.set(SW / 2, 0, 0); hinge.add(sash);
  const hold = new THREE.Group(); sash.add(hold);
  const slide = { z: 3 };
  part(hold, board(S, SH, 0.26, DRVO, -SW / 2 + S / 2, 0, 0), [-1.5, 0.2, 1.6], [0.1, 0.25, 0.06], 0.21, 0.3);
  part(hold, board(S, SH, 0.26, DRVO, SW / 2 - S / 2, 0, 0), [1.5, -0.2, 1.8], [0.1, -0.25, -0.06], 0.23, 0.32);
  for (const [y, i] of [[SH / 2 - S / 2, 0], [0.1, 1], [-SH / 2 + S / 2, 2]]) part(hold, board(SW - 2 * S, S, 0.26, DRVO, 0, y, 0), [i === 1 ? 2 : -2, y * 0.4, 1.6], [0, 0.2, 0.1], 0.25 + i * 0.02, 0.33 + i * 0.02);
  const pH = (SH - 3 * S) / 2;
  part(hold, board(SW - 2 * S + 0.04, pH + 0.04, 0.09, SVETLO, 0, 0.1 + S / 2 + pH / 2, 0), [1.1, 0.5, 3], [0.2, 0.3, 0], 0.37, 0.46);
  part(hold, board(SW - 2 * S + 0.04, pH + 0.04, 0.09, SVETLO, 0, 0.1 - S / 2 - pH / 2, 0), [1.5, -0.4, 3.4], [-0.2, 0.3, 0], 0.4, 0.49);
  const hg = new THREE.Group();
  for (const y of [SH / 2 - 0.9, 0.1, -SH / 2 + 0.9]) { hg.add(board(0.12, 0.46, 0.2, alu, -SW / 2 - 0.02, y, 0.04)); }
  part(hold, hg, [-1.2, 0, 1.5], [0, 0.4, 0], 0.52, 0.62);
  const lock = new THREE.Group(); lock.position.set(SW / 2 - S / 2, -0.4, 0);
  lock.add(board(0.1, 0.9, 0.3, steel, 0.09, 0, 0));
  lock.add(board(0.2, 0.42, 0.04, alu, 0, 0.08, 0.15));
  const lever = new THREE.Group(); lever.position.set(0, 0.2, 0.18); lock.add(lever);
  lever.add(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.16, 16).rotateX(Math.PI / 2), alu));
  const arm = board(0.66, 0.08, 0.08, alu, -0.28, 0, 0.1); lever.add(arm);
  part(hold, lock, [1.4, -0.6, 2.2], [0.3, -0.5, 0.2], 0.63, 0.73);
  // lajsne: oblažu štok
  const lM = DRVO;
  const lW = 0.28;
  part(u, board(lW, H + 0.1, 0.06, lM, -W / 2 + 0.05, 0.05, FD / 2 + 0.03), [-0.9, 0, 1.8], [0, 0.2, 0], 0.74, 0.82);
  part(u, board(lW, H + 0.1, 0.06, lM, W / 2 - 0.05, 0.05, FD / 2 + 0.03), [0.9, 0, 1.8], [0, -0.2, 0], 0.76, 0.84);
  part(u, board(W + 0.18, lW, 0.06, lM, 0, H / 2 + 0.02, FD / 2 + 0.03), [0, 0.8, 1.8], [0.2, 0, 0], 0.78, 0.86);
  // svetlo iza vrata
  const lc2 = document.createElement('canvas'); lc2.width = 128; lc2.height = 256;
  const lx = lc2.getContext('2d'); const gr = lx.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#fff6ea'); gr.addColorStop(1, '#ffe1bd'); lx.fillStyle = gr; lx.fillRect(0, 0, 128, 256);
  const lm = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lc2), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  lm.map.colorSpace = THREE.SRGBColorSpace;
  const bk = new THREE.Mesh(new THREE.PlaneGeometry(W - 2 * FW, H - FW), lm); bk.position.set(0, -FW / 2, -FD / 2 + 0.02); u.add(bk);
  const keys = [
    K(0, [0, 0, 0.8], [0.04, 0.1, 1], 34, 60), K(0.19, [0, 0, 0], [0.04, 0.1, 1], 31, 56), K(0.34, [0, 0, 1], [0.16, 0.1, 1], 29, 54),
    K(0.5, [0, 0, 1.2], [-0.16, 0.08, 1], 27, 52), K(0.62, [-1, 0, 1.5], [-0.3, 0.08, 1], 22, 46), K(0.74, [1, -0.6, 1.5], [0.2, 0.08, 1], 18, 40),
    K(0.87, [0, 0, 0.5], [0.04, 0.06, 1], 28, 54), K(1, [0, 0, 0.5], [0.14, 0.05, 1], 27, 52), K(1.3, [0, 0, 0.5], [0.28, 0.02, 1], 22, 46),
  ];
  function finale(p) {
    hinge.position.z = 0.28 + slide.z * (1 - smooth(0.84, 0.89, p));
    lever.rotation.z = smooth(0.89, 0.915, p) * 0.5;
    const open = smooth(0.92, 0.99, p);
    hinge.rotation.y = -open * 1.25;
    lm.opacity = open * 0.95;
  }
  return { keys, finale, run: 2, mirno: 0.84 };
}

/* ---------- krevet: stranice, letvice, fioke, uzglavlje, dušek, pa se fioka izvuče ---------- */
function krevet() {
  const W = 4.8, L = 7.6, Hh = 0.95, T = 0.17;
  const u = new THREE.Group(); u.rotation.set(0, -0.72, 0); u.position.y = -0.8; scene.add(u);
  part(u, board(T, Hh, L, DRVO, -W / 2 + T / 2, 0, 0), [-2.4, 0.4, 0], [0, 0.2, 0.2], 0.02, 0.12);
  part(u, board(T, Hh, L, DRVO, W / 2 - T / 2, 0, 0), [2.4, 0.4, 0], [0, -0.2, -0.2], 0.04, 0.14);
  part(u, board(W, Hh, T, DRVO, 0, 0, L / 2 - T / 2), [0, 0.6, 2.4], [0.2, 0, 0], 0.08, 0.18);
  part(u, board(W, Hh, T, DRVO, 0, 0, -L / 2 + T / 2), [0, 0.6, -2.4], [-0.2, 0, 0], 0.08, 0.18);
  const n = 15;
  for (let i = 0; i < n; i++) {
    const z = -L / 2 + 0.5 + i * (L - 1) / (n - 1);
    part(u, board(W - 2 * T, 0.05, 0.3, SVETLO, 0, Hh / 2 - 0.2, z), [0, 1.7, 0.1], [0.2, 0, 0.1 * (i % 2 ? 1 : -1)], 0.2 + i * 0.012, 0.25 + i * 0.012);
  }
  const dr = new THREE.Group(); dr.position.set(W / 2 - 0.1, -0.1, 0.9);
  dr.add(board(W * 0.56, 0.5, 2.5, SVETLO, -W * 0.28, -0.04, 0));
  dr.add(board(0.1, 0.62, 2.6, DRVO, 0.05, 0, 0));
  part(u, dr, [1.9, 0.2, 0.4], [0, 0.3, 0], 0.42, 0.52);
  const dr2 = new THREE.Group(); dr2.position.set(W / 2 - 0.1, -0.1, -1.9);
  dr2.add(board(W * 0.56, 0.5, 2.5, SVETLO, -W * 0.28, -0.04, 0));
  dr2.add(board(0.1, 0.62, 2.6, DRVO, 0.05, 0, 0));
  part(u, dr2, [1.9, -0.2, -0.3], [0, -0.3, 0], 0.46, 0.56);
  const hb = board(W + 0.22, 3.3, 0.22, DRVO, 0, 1.15, -L / 2 - 0.08);
  part(u, hb, [0, 1.4, -1.5], [-0.3, 0, 0], 0.57, 0.68);
  const cloth = new THREE.MeshPhysicalMaterial({ color: CFG.platno || 0xe8e3d8, roughness: 0.9, sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color(0xffffff) });
  const mat = new THREE.Mesh(new RoundedBoxGeometry(W - 2 * T - 0.03, 0.7, L - 2 * T - 0.03, 6, 0.16), cloth); mat.position.set(0, Hh / 2 + 0.1, 0);
  part(u, mat, [0, 2.7, 0], [0.08, 0, 0.05], 0.7, 0.82);
  const pil = [[-1.05, 0], [1.05, 0]].map(([x], i) => { const m = new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.36, 0.95, 6, 0.17), cloth); m.position.set(x, Hh / 2 + 0.62, -L / 2 + 0.85); m.rotation.x = -0.25; part(u, m, [i ? 0.5 : -0.5, 3.4, 0.3], [0.4, 0.3, 0], 0.83 + i * 0.015, 0.89 + i * 0.015); return m; });
  void pil;
  const keys = [
    K(0, [0, 1, 0], [0.5, 0.42, 1], 33, 62), K(0.18, [0, 0.6, 0], [0.5, 0.5, 1], 30, 54), K(0.34, [0, 0.2, 0], [0.3, 0.7, 1], 25, 48),
    K(0.54, [1.4, -0.2, 0.5], [1.05, 0.34, 1], 24, 48), K(0.68, [0, 0.9, -1], [0.5, 0.36, 1], 26, 50), K(0.86, [0, 0.4, 0], [0.5, 0.42, 1], 26, 50),
    K(1, [0.4, 0, 0.2], [0.8, 0.4, 1], 24, 46), K(1.3, [0.4, 0, 0.2], [0.9, 0.36, 1], 20, 40),
  ];
  keys.forEach((k) => { k.sx = 0.14; });
  const drBase = dr.position.x;
  function finale(p) {
    const o = smooth(0.91, 0.99, p);
    if (o > 0) dr.position.x = drBase + o * 1.9;
  }
  return { keys, finale, run: 2, mirno: 0.86 };
}

function prozor() {
  const W = 4.8, H = 6.2, FD = 0.62;
  const win = new THREE.Group();
  win.rotation.set(0.05, -0.62, 0.02);
  scene.add(win);

  /* ---------- štok ---------- */
  const FR = outline(
    [[0, 0], [0.42, 0], [0.42, 0.3], [0.3, 0.3], [0.3, 0.62], [0, 0.62]],
    [[0.03, 0.03, 0.39, 0.12], [0.09, 0.15, 0.27, 0.45], [0.03, 0.15, 0.06, 0.45], [0.03, 0.48, 0.27, 0.59], [0.3, 0.15, 0.39, 0.27]],
  );
  const fOff = [[0.5, 1.5, -1.2], [1.5, -0.4, -0.9], [-0.3, -1.5, -1.1], [-1.5, 0.4, -1.3]];
  const fRot = [[0.22, 0.1, 0.1], [0.12, -0.22, -0.08], [-0.2, 0.12, 0.12], [-0.1, 0.22, 0.08]];
  sides(W, H).forEach((s, i) => {
    const outer = new THREE.Group(); outer.position.copy(s.start).setZ(-FD / 2);
    const inner = new THREE.Group();
    inner.add(new THREE.Mesh(bar(FR, s.L, s.inward, s.d), pvc));
    part(win, outer, fOff[i], fRot[i], 0.02 + i * 0.015, 0.11 + i * 0.015);
    // zazor koji se zatvara tek kad čelik uđe
    part(outer, inner, s.out.clone().multiplyScalar(0.55).toArray(), [0, 0, 0], 0.26, 0.31);
    // čelik: viri iz profila i uliva se u komoru
    const st = new THREE.Group(); st.add(steelBar(s, 0.11, 0.25, 0.17, 0.43, 0.46));
    part(inner, st, s.along.clone().multiplyScalar(-s.L * 0.72).toArray(), [0, 0, 0], 0.15 + i * 0.012, 0.25 + i * 0.008);
  });

  /* ---------- krilo: drži se ispred štoka dok se ne završi, pa se zatvara ---------- */
  const SW = W - 2 * 0.31, SH = H - 2 * 0.31;
  const HOLD = 2.9;
  const sashSlide = new THREE.Group(); // pomera krilo od položaja ispred štoka do štoka
  sashSlide.position.z = -FD / 2 + 0.31;
  const hinge = new THREE.Group(); hinge.position.x = -SW / 2; sashSlide.add(hinge); // osa na levoj strani
  const sash = new THREE.Group(); sash.position.x = SW / 2; hinge.add(sash);
  win.add(sashSlide);
  const slideBase = sashSlide.position.z;

  const SR = outline(
    [[0, 0], [0.48, 0], [0.48, 0.4], [0.4, 0.4], [0.4, 0.62], [0, 0.62]],
    [[0.03, 0.03, 0.45, 0.11], [0.09, 0.14, 0.36, 0.38], [0.03, 0.14, 0.06, 0.38], [0.03, 0.41, 0.37, 0.59], [0.39, 0.14, 0.45, 0.37]],
  );
  const sOff = [[-0.3, 1.1, 0.9], [1.1, 0.2, 1.2], [0.3, -1.1, 1], [-1.1, -0.2, 1.3]];
  const sRot = [[-0.18, 0.12, -0.08], [0.1, 0.2, 0.08], [0.18, -0.12, 0.08], [-0.1, -0.2, -0.06]];
  sides(SW, SH).forEach((s, i) => {
    const g = new THREE.Group(); g.position.copy(s.start);
    g.add(new THREE.Mesh(bar(SR, s.L, s.inward, s.d), pvc));
    g.add(steelBar(s, 0.12, 0.33, 0.16, 0.36, 0.5));
    part(sash, g, sOff[i], sRot[i], 0.31 + i * 0.012, 0.41 + i * 0.012);
  });

  /* ---------- zaptivke rastu oko štoka i krila ---------- */
  function loop(w, h, z, r) {
    const q = 0.05, x = w / 2, y = h / 2;
    const pts = [];
    const side = (a, b, n) => { for (let i = 0; i < n; i++) pts.push(a.clone().lerp(b, i / n)); };
    side(V(-x + q, y, z), V(x - q, y, z), 24); side(V(x, y - q, z), V(x, -y + q, z), 24);
    side(V(x - q, -y, z), V(-x + q, -y, z), 24); side(V(-x, -y + q, z), V(-x, y - q, z), 24);
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.2), 420, r, 8, true);
    const m = new THREE.Mesh(geo, rubber); m.visible = false;
    return { mesh: m, count: geo.index.count };
  }
  const seals = [
    { ...loop(W - 2 * 0.285, H - 2 * 0.285, 0.33 - FD / 2, 0.036), parent: win, a: 0.44, b: 0.5 },
    { ...loop(SW - 0.02, SH - 0.02, 0.02, 0.034), parent: sash, a: 0.47, b: 0.53 },
    { ...loop(SW - 2 * 0.385, SH - 2 * 0.385, 0.41, 0.03), parent: sash, a: 0.5, b: 0.56 },
  ];
  seals.forEach((s) => s.parent.add(s.mesh));

  /* ---------- staklopaket: dva stakla i aluminijumski odstojnik, pa lajsne ---------- */
  const GW = SW - 2 * 0.405, GH = SH - 2 * 0.405;
  const pane = (z) => { const m = new THREE.Mesh(new RoundedBoxGeometry(GW, GH, 0.035, 2, 0.008), glass); m.position.z = z; return m; };
  part(sash, pane(0.43), [1.5, 0.3, 2], [0.04, 0.08, 0.02], 0.57, 0.63);
  const spacer = new THREE.Group();
  for (const [w, h, x, y] of [[GW - 0.05, 0.06, 0, GH / 2 - 0.06], [GW - 0.05, 0.06, 0, -GH / 2 + 0.06], [0.06, GH - 0.05, GW / 2 - 0.06, 0], [0.06, GH - 0.05, -GW / 2 + 0.06, 0]]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), alu); m.position.set(x, y, 0.5); spacer.add(m);
  }
  part(sash, spacer, [2.1, 0.4, 3], [0.04, 0.08, 0.02], 0.61, 0.67);
  part(sash, pane(0.57), [2.7, 0.5, 4], [0.04, 0.08, 0.02], 0.64, 0.7);
  const BEAD = outline([[0, 0], [0.09, 0], [0.09, 0.17], [0, 0.17]], []);
  sides(GW, GH).forEach((s, i) => {
    const g = new THREE.Group();
    g.position.copy(s.start).setZ(0.455);
    g.add(new THREE.Mesh(bar(BEAD, s.L, s.inward, s.d), pvc));
    part(sash, g, s.out.clone().multiplyScalar(0.5).add(V(1.3, 0, 2.4)).toArray(), [0, 0, 0], 0.67 + i * 0.008, 0.72 + i * 0.008);
  });

  /* ---------- okov i ručka ---------- */
  const hw = new THREE.Group();
  const strip = new THREE.Mesh(new THREE.BoxGeometry(0.03, SH - 0.7, 0.11), steel); strip.position.set(SW / 2 + 0.018, 0, 0.3); hw.add(strip);
  for (const y of [-2.2, -1.1, 0.2, 1.3, 2.3]) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.09, 16).rotateZ(Math.PI / 2), alu); c.position.set(SW / 2 + 0.07, y, 0.3); hw.add(c);
  }
  part(sash, hw, [1.1, 1.6, 0.2], [0, 0, 0.04], 0.72, 0.79);
  for (const y of [SH / 2 - 0.55, -SH / 2 + 0.55]) {
    const h = new THREE.Group();
    const a = new THREE.Mesh(new RoundedBoxGeometry(0.15, 0.46, 0.17, 2, 0.03), alu); a.position.set(-SW / 2 - 0.02, y, 0.3); h.add(a);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.62, 14), steel); pin.position.set(-SW / 2 - 0.02, y, 0.3); h.add(pin);
    part(sash, h, [-1.1, y > 0 ? 0.5 : -0.5, 0.4], [0, 0.5, 0], 0.74, 0.8);
  }
  const rose = new THREE.Group(); rose.position.set(SW / 2 - 0.22, 0, 0.64);
  rose.add(new THREE.Mesh(new RoundedBoxGeometry(0.17, 0.5, 0.05, 3, 0.022), alu));
  const lever = new THREE.Group(); lever.position.z = 0.03; rose.add(lever);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.05, 0.16, 16).rotateX(Math.PI / 2), alu); neck.position.z = 0.08; lever.add(neck);
  const arm = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.7, 0.07, 3, 0.03), alu); arm.position.set(0, -0.29, 0.15); lever.add(arm);
  part(sash, rose, [1.2, -0.5, 2.4], [0.3, -0.5, 0.2], 0.78, 0.85);

  /* ---------- sveža svetlost kroz otvoreno krilo ---------- */
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const lc = document.createElement('canvas'); lc.width = 256; lc.height = 340;
  const lg = lc.getContext('2d'); const lgr = lg.createLinearGradient(0, 0, 0, 340); lgr.addColorStop(0, '#dff2ff'); lgr.addColorStop(0.6, '#ffffff'); lgr.addColorStop(1, '#ffe7cf');
  lg.fillStyle = lgr; lg.fillRect(0, 0, 256, 340);
  const lt = new THREE.CanvasTexture(lc); lt.colorSpace = THREE.SRGBColorSpace; lightMat.map = lt;
  const lightP = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.84, H - 0.84), lightMat); lightP.position.z = -FD / 2 + 0.04; win.add(lightP);

  const airN = isPortrait ? 180 : 420;
  let sd = 7; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const seed = Array.from({ length: airN }, () => [rnd(), rnd(), rnd()]);
  const airPos = new Float32Array(airN * 3);
  const airGeo = new THREE.BufferGeometry(); airGeo.setAttribute('position', new THREE.BufferAttribute(airPos, 3));
  const sc = document.createElement('canvas'); sc.width = sc.height = 64;
  const sg = sc.getContext('2d'); const rg = sg.createRadialGradient(32, 32, 0, 32, 32, 32); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.35, 'rgba(255,240,222,.5)'); rg.addColorStop(1, 'rgba(255,230,205,0)');
  sg.fillStyle = rg; sg.fillRect(0, 0, 64, 64);
  const airMat = new THREE.PointsMaterial({ map: new THREE.CanvasTexture(sc), size: 0.15, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0, color: 0xfff1df });
  const air = new THREE.Points(airGeo, airMat); air.frustumCulled = false; win.add(air);
  function moveAir(t) {
    for (let i = 0; i < airN; i++) {
      const [a, b, c] = seed[i];
      const life = (t * (0.07 + c * 0.05) + b) % 1;
      airPos[i * 3] = (a - 0.5) * (W - 1) + Math.sin(life * 6 + a * 20) * 0.3 * life + life * 0.6;
      airPos[i * 3 + 1] = (c - 0.5) * (H - 1) + Math.sin(life * 5 + c * 9) * 0.22 * life - life * 0.5;
      airPos[i * 3 + 2] = -0.2 + life * 8.5;
    }
    airGeo.attributes.position.needsUpdate = true;
  }


  const keys = [
    { p: 0, look: [0.1, 0, 1], dir: [0.06, 0.12, 1], d: 31, dp: 62, sx: 0.2, sy: 0.15 },
    { p: 0.14, look: [0, 0.3, 0], dir: [0.02, 0.14, 1], d: 26, dp: 54, sx: 0.2, sy: 0.15 },
    { p: 0.24, look: [2.0, 2.7, 0], dir: [0.86, 0.5, 1], d: 15, dp: 30, sx: 0.16, sy: 0.15 },
    { p: 0.31, look: [1.6, 1.6, 0], dir: [0.6, 0.34, 1], d: 22, dp: 40, sx: 0.18, sy: 0.15 },
    { p: 0.44, look: [0, 0, 1.5], dir: [0.1, 0.16, 1], d: 25, dp: 52, sx: 0.2, sy: 0.15 },
    { p: 0.56, look: [0, 0, 1.4], dir: [0.36, 0.14, 1], d: 25, dp: 50, sx: 0.2, sy: 0.15 },
    { p: 0.72, look: [0, 0, 2.2], dir: [0.14, 0.1, 1], d: 25, dp: 52, sx: 0.2, sy: 0.15 },
    { p: 0.84, look: [0.3, 0, 2.5], dir: [-0.28, 0.08, 1], d: 22, dp: 48, sx: 0.2, sy: 0.15 },
    { p: 0.9, look: [0, 0, 0.3], dir: [0.02, 0.08, 1], d: 21, dp: 46, sx: 0.2, sy: 0.15 },
    { p: 1, look: [0.2, 0, 0.6], dir: [0.14, 0.06, 1], d: 21, dp: 46, sx: 0.2, sy: 0.15 },
    { p: 1.3, look: [0.2, 0, 0.6], dir: [0.3, 0.02, 1], d: 20, dp: 42, sx: 0, sy: 0.1 },
  ];

  function finale(p, time) {
    for (const s of seals) {
      const t = smooth(s.a, s.b, p);
      s.mesh.visible = t > 0.001;
      s.mesh.geometry.setDrawRange(0, Math.floor(s.count * t / 6) * 6);
    }
    // krilo stoji ispred štoka, zatvara se tek kad je sve na mestu
    sashSlide.position.z = slideBase + HOLD * (1 - smooth(0.85, 0.89, p));
    // ručka se okrene, pa se krilo otvori ka sobi
    lever.rotation.z = smooth(0.89, 0.92, p) * Math.PI / 2;
    const open = smooth(0.92, 0.99, p);
    hinge.rotation.y = -open * 1.12;
    lightMat.opacity = open * 0.96;
    airMat.opacity = open * 0.85;
    air.visible = open > 0.01;
    if (air.visible) moveAir(time);
  }
  return { keys, finale, run: 0.92, mirno: 0.84 };
}
const M = { prozor, namestaj, vrata, krevet }[MODE]();
/* ---------- kamera po skrolu ---------- */
const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 300);
const tmpL = V(0, 0, 0), tmpD = V(0, 0, 0);
function placeCamera(p) {
  const keys = M.keys;
  let i = 0; while (i < keys.length - 2 && p > keys[i + 1].p) i++;
  const a = keys[i], b = keys[i + 1], t = smooth(a.p, b.p, p);
  tmpL.set(mix(a.look[0], b.look[0], t), mix(a.look[1], b.look[1], t), mix(a.look[2], b.look[2], t));
  tmpD.set(mix(a.dir[0], b.dir[0], t), mix(a.dir[1], b.dir[1], t), mix(a.dir[2], b.dir[2], t)).normalize();
  const pt = portrait();
  const d = pt ? mix(a.dp, b.dp, t) * 0.74 : mix(a.d, b.d, t);
  camera.position.copy(tmpL).addScaledVector(tmpD, d);
  camera.lookAt(tmpL);
  const Wv = innerWidth, Hv = innerHeight;
  const sx = CFG.still || pt ? 0 : mix(a.sx, b.sx, t), sy = !CFG.still && pt ? mix(a.sy, b.sy, t) : 0;
  camera.setViewOffset(Wv, Hv, -Wv * sx, Hv * sy, Wv, Hv);
}

/* ---------- jedan kadar ---------- */
function apply(p, time) {
  for (const q of parts) {
    const t = smooth(q.a, q.b, p), r = 1 - t;
    q.obj.position.copy(q.base).addScaledVector(q.off, r);
    q.obj.rotation.set(q.baseR.x + q.rot[0] * r, q.baseR.y + q.rot[1] * r, q.baseR.z + q.rot[2] * r);
  }
  M.finale(p, time);
  placeCamera(p);
}

/* ---------- skrol ---------- */
const stage = document.getElementById('sklapanje');
let target = 0, cur = 0, stageTop = 0, stageLen = 1;
function measure() {
  const r = stage.getBoundingClientRect();
  stageTop = r.top + scrollY;
  stageLen = Math.max(1, r.height - innerHeight);
  target = Math.max(0, (scrollY - stageTop) / stageLen);
  target = target > 1 ? Math.min(1.3, 1 + (target - 1) * 0.55) : target;
  if (reduced) target = M.mirno;
}
function resize() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, isPortrait ? 1.5 : 1.75));
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  measure(); dirty = true;
}
let dirty = true, last = performance.now(), time = 40;
addEventListener('scroll', measure, { passive: true });
addEventListener('resize', resize);

let frozen = false; // pregled kadrova: skrol ne upravlja scenom
function tick(now) {
  requestAnimationFrame(tick);
  if (frozen || document.hidden) { last = now; return; }
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const before = cur;
  cur += (target - cur) * (reduced ? 1 : 1 - Math.exp(-dt * 8));
  if (Math.abs(target - cur) < 0.00015) cur = target;
  const running = !reduced && cur > M.run;
  if (running) time += dt;
  if (dirty || cur !== before || running) {
    apply(cur, time);
    renderer.render(scene, camera);
    dirty = false;
  }
  window.__settled = cur === target;
}

window.__beil = { get cur() { return cur; }, get target() { return target; } };
window.__kadar = (p) => { frozen = true; cur = target = p; apply(p, 40); renderer.render(scene, camera); };
resize();
apply(cur, time);
requestAnimationFrame(tick);
document.documentElement.classList.add('ima-3d');
