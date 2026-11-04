// Beil: klima koja se sklapa dok se skroluje. Scena je podeljena na delove koji iz rasklopljenog
// položaja dolaze na svoje mesto, a redosled prati postupak ugradnje sa njihovog sajta.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const canvas = document.getElementById('scena');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CFG = window.SCENA || { mode: 'split', bg: {} };
const KRUG = CFG.mode === 'krug'; // bez kućišta: sam rashladni krug (auto klime, čileri)
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

const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(3, 6, 7); scene.add(key);
const rim = new THREE.DirectionalLight(0xffc49a, 1.5); rim.position.set(-6, -2, -3); scene.add(rim);

/* ---------- materijali ---------- */
const glass = new THREE.MeshPhysicalMaterial({ color: 0xf2faff, transmission: 1, roughness: 0.035, ior: 1.46, thickness: 0.55, attenuationColor: new THREE.Color(0xbfe6ff), attenuationDistance: 3.2, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.35 });
const glassThin = glass.clone(); glassThin.thickness = 0.18; glassThin.attenuationDistance = 1.6;
const copper = new THREE.MeshStandardMaterial({ color: 0xd98a4e, metalness: 1, roughness: 0.24, envMapIntensity: 1.6 });
const alu = new THREE.MeshStandardMaterial({ color: 0xdfe9f3, metalness: 1, roughness: 0.34, envMapIntensity: 1.1 });
const steel = new THREE.MeshStandardMaterial({ color: 0xb9c8d6, metalness: 1, roughness: 0.42 });
const white = new THREE.MeshPhysicalMaterial({ color: 0xf5f9fc, roughness: 0.42, clearcoat: 0.5, envMapIntensity: 0.9 });
const dark = new THREE.MeshStandardMaterial({ color: 0x1a2438, metalness: 0.75, roughness: 0.38 });
const hose = new THREE.MeshStandardMaterial({ color: 0xeaf1f6, roughness: 0.6 });

/* ---------- delovi: svaki zna odakle dolazi i kada ---------- */
const parts = [];
function part(parent, obj, off, rot, a, b, skip) {
  parent.add(obj);
  if (KRUG && skip) { obj.visible = false; return obj; }
  parts.push({ obj, base: obj.position.clone(), baseR: obj.rotation.clone(), off: V(...off), rot, a, b });
  return obj;
}
function tube(pts, r, mat, seg = 90) {
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, 12, false), mat);
}

/* ---------- unutrašnja jedinica ---------- */
const L = 7.4, HH = 1.95, D = 1.55;
const ac = new THREE.Group();
ac.rotation.set(0.1, -0.38, 0.02);
scene.add(ac);

// nosač: limeni profil sa otvorima za šrafove
const shape = new THREE.Shape();
const bw = L - 1, bh = 1.45;
shape.moveTo(-bw / 2, -bh / 2); shape.lineTo(bw / 2, -bh / 2); shape.lineTo(bw / 2, bh / 2); shape.lineTo(-bw / 2, bh / 2); shape.closePath();
for (let i = 0; i < 6; i++) {
  const hx = -bw / 2 + 0.55 + i * (bw - 1.1) / 5;
  for (const hy of [0.42, -0.42]) {
    const h = new THREE.Path();
    h.absellipse(hx, hy, i % 2 ? 0.2 : 0.11, 0.11, 0, Math.PI * 2, false, 0);
    shape.holes.push(h);
  }
}
const bracket = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false, curveSegments: 16 }), steel);
bracket.position.set(0, 0, -D / 2 - 0.03);
part(ac, bracket, [0.8, 5.3, -4.5], [0.4, -0.5, 0.12], 0.05, 0.2, true);

// ram jedinice
const frame = new THREE.Group();
const bar = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(w, h, d) * 0.4), white); m.position.set(x, y, z); frame.add(m); };
bar(L - 1.3, 0.1, 0.18, 0, 0.83, -0.56); bar(L - 1.3, 0.1, 0.18, 0, -0.83, -0.56);
bar(0.12, 1.7, 1.15, -L / 2 + 0.56, 0, -0.1); bar(0.12, 1.7, 1.15, L / 2 - 0.56, 0, -0.1);
part(ac, frame, [-0.5, 3.6, -3], [-0.3, 0.4, -0.08], 0.09, 0.22, true);

// isparivač: lamele
const finN = isPortrait ? 110 : 170;
const fins = new THREE.InstancedMesh(new THREE.BoxGeometry(0.018, 1.02, 0.56), alu, finN);
const M = new THREE.Matrix4();
for (let i = 0; i < finN; i++) { M.identity(); M.setPosition(-L / 2 + 0.72 + i * (L - 1.44) / (finN - 1), 0, 0); fins.setMatrixAt(i, M); }
const finsG = new THREE.Group(); finsG.add(fins); finsG.position.set(0, 0.14, 0.02);
part(ac, finsG, [0.3, 1.4, -1.2], [0.5, -0.3, 0.1], KRUG ? 0.05 : 0.2, KRUG ? 0.2 : 0.32);

// bakarne cevi kroz isparivač
const cu = new THREE.Group();
const rows = [0.5, 0.25, 0, -0.25], zc = 0.36, xa = -L / 2 + 0.58, xb = L / 2 - 0.58;
rows.forEach((y, k) => {
  cu.add(new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, xb - xa, 14).rotateZ(Math.PI / 2).translate(0, y, zc), copper));
  if (k < rows.length - 1) {
    const y2 = rows[k + 1], side = k % 2 ? xa : xb, s = k % 2 ? -1 : 1;
    cu.add(tube([V(side, y, zc), V(side + s * 0.13, y - 0.04, zc), V(side + s * 0.17, (y + y2) / 2, zc), V(side + s * 0.13, y2 + 0.04, zc), V(side, y2, zc)], 0.05, copper, 24));
  }
});
part(ac, cu, [-0.4, -0.5, 2.6], [-0.5, 0.35, -0.14], KRUG ? 0.18 : 0.25, 0.37);

// turbina
const fanG = new THREE.Group(); fanG.position.set(0, -0.6, 0.02);
const fanSpin = new THREE.Group(); fanG.add(fanSpin);
const bladeN = 44, blades = new THREE.InstancedMesh(new THREE.BoxGeometry(L - 1.7, 0.012, 0.095), white, bladeN);
const O = new THREE.Object3D();
for (let i = 0; i < bladeN; i++) { const a = i / bladeN * Math.PI * 2; O.position.set(0, Math.cos(a) * 0.27, Math.sin(a) * 0.27); O.rotation.set(a + 0.7, 0, 0); O.updateMatrix(); blades.setMatrixAt(i, O.matrix); }
fanSpin.add(blades);
for (let i = 0; i < 9; i++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.016, 32).rotateZ(Math.PI / 2), white); d.position.x = -(L - 1.7) / 2 + i * (L - 1.7) / 8; fanSpin.add(d); }
part(ac, fanG, [0.2, -3.4, 0.8], [0.2, 0.45, 0.18], 0.36, 0.46);

// filter: tanka mrežica na vrhu
const filt = new THREE.Group();
const fr = new RoundedBoxGeometry(L - 1.6, 0.03, 0.72, 2, 0.012);
const ff = new THREE.Mesh(fr, new THREE.MeshStandardMaterial({ color: 0xe6f3fb, roughness: 0.7, metalness: 0.1, wireframe: false }));
ff.scale.set(1, 0.6, 1); filt.add(ff);
const wiresN = 60, wires = new THREE.InstancedMesh(new THREE.BoxGeometry(0.012, 0.03, 0.72), dark, wiresN);
for (let i = 0; i < wiresN; i++) { M.identity(); M.setPosition(-(L - 1.6) / 2 + i * (L - 1.6) / (wiresN - 1), 0.012, 0); wires.setMatrixAt(i, M); }
filt.add(wires);
filt.position.set(0, 0.74, 0.02);
part(ac, filt, [-0.6, 2.4, 0.8], [0.5, 0.2, -0.1], 0.39, 0.48, true);

// stakleni oklop zatvara sve
const shell = new THREE.Mesh(new RoundedBoxGeometry(L, HH, D, 8, 0.42), glass);
part(ac, shell, [2.6, 1.4, 5.2], [-0.35, 0.5, -0.1], 0.46, 0.58, true);

// krilo: ostaje van oklopa i otvara se pri puštanju u rad
const hinge = new THREE.Group(); // krilo hinge.position.set(0, -1.02, 0.72);
const flap = new THREE.Mesh(new RoundedBoxGeometry(L - 0.6, 0.05, 0.42, 4, 0.024), glassThin);
flap.position.z = 0.16; hinge.add(flap); hinge.rotation.x = 0.28;
part(ac, hinge, [0.4, -4.4, 1.4], [0.4, -0.3, 0.12], 0.49, 0.59, true);

/* ---------- spoljna jedinica ---------- */
const OW = 4.8, OH = 3.5, OD = 1.75;
const out = new THREE.Group();
out.position.set(...(isPortrait ? [1.8, -9.6, -2.5] : [8.9, -6.2, -2.5]));
out.rotation.set(0.06, -0.3, 0);
scene.add(out);

const base = new THREE.Mesh(new RoundedBoxGeometry(OW - 0.2, 0.09, OD - 0.2, 2, 0.03), steel); base.position.y = -OH / 2 + 0.14;
part(out, base, [0, -6, 0], [0.2, 0.2, 0], 0.7, 0.78);

// kondenzator: lamele i bakar na zadnjoj strani
const conG = new THREE.Group();
const cfN = 90, cf = new THREE.InstancedMesh(new THREE.BoxGeometry(0.016, OH - 0.65, 0.3), alu, cfN);
for (let i = 0; i < cfN; i++) { M.identity(); M.setPosition(-OW / 2 + 0.45 + i * (OW - 0.9) / (cfN - 1), 0, 0); cf.setMatrixAt(i, M); }
conG.add(cf);
[-1, -0.33, 0.33, 1].forEach(y => conG.add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, OW - 0.8, 10).rotateZ(Math.PI / 2).translate(0, y, 0.17), copper)));
conG.position.z = -0.52;
part(out, conG, [1.5, 6.4, -5], [-0.5, -0.4, 0.1], 0.72, 0.8);

// kompresor sa priključcima
const comp = new THREE.Group();
const cb = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 1.5, 28), dark); comp.add(cb);
const cc = new THREE.Mesh(new THREE.SphereGeometry(0.52, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), dark); cc.position.y = 0.75; comp.add(cc);
comp.add(tube([V(0.3, 1.1, 0), V(0.5, 1.45, 0.05), V(1.0, 1.35, 0.15), V(1.15, 0.5, 0.2), V(1.25, -0.5, 0.3)], 0.05, copper, 30));
comp.add(tube([V(-0.3, 0.9, 0.1), V(-0.55, 1.3, 0.2), V(-0.9, 1.3, 0.15), V(-1.15, 0.8, -0.2)], 0.04, copper, 24));
comp.position.set(OW / 2 - 1.5, -0.6, 0);
part(out, comp, [6.5, -2.6, 2], [0.3, 0.4, -0.5], 0.74, 0.83);

// ventilator sa rešetkom
const oFan = new THREE.Group(); oFan.position.set(-OW / 2 + 1.62, 0, 0.3);
const oSpin = new THREE.Group(); oFan.add(oSpin);
const bladeShape = new THREE.Shape(); bladeShape.moveTo(0.12, -0.06); bladeShape.quadraticCurveTo(0.7, -0.42, 1.2, -0.2); bladeShape.quadraticCurveTo(1.05, 0.18, 0.12, 0.1); bladeShape.closePath();
const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.02, bevelEnabled: false, curveSegments: 10 });
for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(bladeGeo, white); m.rotation.z = i / 3 * Math.PI * 2; m.rotateY(0.3); oSpin.add(m); }
oSpin.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.3, 20).rotateX(Math.PI / 2), dark));
[0.5, 0.88, 1.26].forEach(r => { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.016, 8, 56), steel); t.position.z = 0.22; oFan.add(t); });
for (let i = 0; i < 2; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(2.56, 0.022, 0.022), steel); b.rotation.z = i * Math.PI / 2; b.position.z = 0.22; oFan.add(b); }
part(out, oFan, [-5.2, -3.6, 4.5], [0.3, -0.6, 0.4], 0.76, 0.85);

// stakleno kućište
const oShell = new THREE.Mesh(new RoundedBoxGeometry(OW, OH, OD, 8, 0.24), glass);
part(out, oShell, [4, 5, 9], [-0.3, -0.5, 0.2], 0.8, 0.9, true);

/* ---------- instalacija između jedinica: raste dok se skroluje ---------- */
scene.updateMatrixWorld(true);
const a0 = (x, y, z) => ac.localToWorld(V(x, y, z));
const o0 = (x, y, z) => out.localToWorld(V(x, y, z));
function route(ax, ay, az, ox, oy, oz) {
  const s = a0(ax, ay, az), e = o0(ox, oy, oz);
  const m1 = a0(L / 2 + 0.55, ay - 0.1, az - 0.55);
  const m2 = isPortrait ? V(mix(s.x, e.x, 0.75) + 2.4, mix(s.y, e.y, 0.45), mix(s.z, e.z, 0.5))
    : V(mix(s.x, e.x, 0.52), mix(s.y, e.y, 0.22), mix(s.z, e.z, 0.5));
  const m3 = isPortrait ? V(e.x + 3.3, e.y + 0.6, e.z + 0.2) : V(e.x - OW / 2 + 0.2 - 0.95, e.y + 0.55, e.z + 0.3);
  return [s, m1, m2, m3, e];
}
const lines = [
  { pts: route(xb, 0.5, zc, OW / 2 - 0.1, 0.5, 0.1), r: 0.085, mat: copper, d: 0 },
  { pts: route(xa + 7.2, -0.25, zc - 0.6, OW / 2 - 0.1, 0.1, 0.25), r: 0.06, mat: copper, d: 0.012 },
  { pts: route(L / 2 - 1, -0.8, -0.4, OW / 2 - 0.1, -0.5, 0.2), r: 0.05, mat: hose, d: 0.024 },
  { pts: route(L / 2 - 0.9, 0.1, -0.35, OW / 2 - 0.1, -0.15, 0.4), r: 0.035, mat: dark, d: 0.034 }
].map(l => {
  const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(l.pts), 110, l.r, 10, false);
  const mesh = new THREE.Mesh(geo, l.mat); mesh.visible = false; scene.add(mesh);
  return { mesh, count: geo.index.count, d: l.d };
});

/* ---------- hladan vazduh ---------- */
const airN = isPortrait ? 260 : 700;
const seed = Array.from({ length: airN }, () => [Math.random(), Math.random(), Math.random()]);
const airPos = new Float32Array(airN * 3);
const airGeo = new THREE.BufferGeometry(); airGeo.setAttribute('position', new THREE.BufferAttribute(airPos, 3));
const sc = document.createElement('canvas'); sc.width = sc.height = 64;
const sg = sc.getContext('2d'); const rg = sg.createRadialGradient(32, 32, 0, 32, 32, 32); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.35, 'rgba(210,240,255,.55)'); rg.addColorStop(1, 'rgba(180,225,255,0)');
sg.fillStyle = rg; sg.fillRect(0, 0, 64, 64);
const airMat = new THREE.PointsMaterial({ map: new THREE.CanvasTexture(sc), size: 0.36, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0, color: 0xd6f0ff });
const air = new THREE.Points(airGeo, airMat); air.frustumCulled = false; ac.add(air);
function moveAir(t) {
  for (let i = 0; i < airN; i++) {
    const [a, b, c] = seed[i];
    const life = (t * (0.16 + c * 0.1) + b) % 1;
    const x = (a - 0.5) * (L - 1) * (1 + life * 0.28) + Math.sin(life * 6 + a * 20) * 0.22 * life;
    const y = -1.16 - life * life * 4.8 - life * 0.3 + Math.sin(life * 5 + c * 9) * 0.12 * life;
    const z = 0.92 + life * 3.4 + Math.cos(life * 4 + b * 8) * 0.2 * life;
    airPos[i * 3] = x; airPos[i * 3 + 1] = y; airPos[i * 3 + 2] = z;
  }
  airGeo.attributes.position.needsUpdate = true;
}

/* ---------- kamera po skrolu ---------- */
const cx = out.position.x * 0.47, cy = out.position.y * 0.47;
const keys = [
  { p: 0, look: [0, 0.3, 0], dir: [-0.18, 0.1, 1], d: 33, dp: 62, sx: 0.2, sy: 0.17 },
  { p: 0.2, look: [0, 0.9, 0], dir: [-0.26, 0.14, 1], d: 28, dp: 54, sx: 0.2, sy: 0.17 },
  { p: 0.36, look: [0, 0.2, 0], dir: [-0.22, 0.12, 1], d: 22, dp: 44, sx: 0.2, sy: 0.17 },
  { p: 0.56, look: [0, 0, 0], dir: [-0.12, 0.06, 1], d: 18.5, dp: 40, sx: 0.2, sy: 0.17 },
  { p: 0.68, look: [1.8, -1, 0], dir: [-0.1, 0.1, 1], d: 25, dp: 46, sx: 0.17, sy: 0.15 },
  { p: 0.78, look: [cx * 0.92, cy * 0.92, -1], dir: [-0.08, 0.09, 1], d: 36, dp: 60, sx: 0.2, sy: 0.14 },
  { p: 0.88, look: [cx, cy, -1], dir: [-0.06, 0.08, 1], d: 36, dp: 64, sx: 0.2, sy: 0.14 },
  { p: 1, look: [cx, cy, -1], dir: [-0.03, 0.06, 1], d: 34, dp: 62, sx: 0.2, sy: 0.14 },
  { p: 1.3, look: [0.6, -0.8, 0], dir: [0.24, 0.02, 1], d: 17, dp: 36, sx: 0, sy: 0.1 }
];
const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 300);
const tmpL = V(0, 0, 0), tmpD = V(0, 0, 0);
function placeCamera(p) {
  let i = 0; while (i < keys.length - 2 && p > keys[i + 1].p) i++;
  const a = keys[i], b = keys[i + 1], t = smooth(a.p, b.p, p);
  tmpL.set(mix(a.look[0], b.look[0], t), mix(a.look[1], b.look[1], t), mix(a.look[2], b.look[2], t));
  tmpD.set(mix(a.dir[0], b.dir[0], t), mix(a.dir[1], b.dir[1], t), mix(a.dir[2], b.dir[2], t)).normalize();
  const pt = portrait();
  const d = pt ? mix(a.dp, b.dp, t) : mix(a.d, b.d, t);
  camera.position.copy(tmpL).addScaledVector(tmpD, d);
  camera.lookAt(tmpL);
  const W = innerWidth, H = innerHeight;
  const sx = pt ? 0 : mix(a.sx, b.sx, t), sy = pt ? mix(a.sy, b.sy, t) : 0;
  camera.setViewOffset(W, H, -W * sx, H * sy, W, H);
}

/* ---------- jedan kadar ---------- */
const hingeP = parts.find(q => q.obj === hinge);
function apply(p, time) {
  for (const q of parts) {
    const t = smooth(q.a, q.b, p), r = 1 - t;
    q.obj.visible = q.a < 0.65 || p > q.a - 0.005;
    q.obj.position.copy(q.base).addScaledVector(q.off, r);
    q.obj.rotation.set(q.baseR.x + q.rot[0] * r, q.baseR.y + q.rot[1] * r, q.baseR.z + q.rot[2] * r);
  }
  for (const l of lines) {
    const t = smooth(0.58 + l.d, 0.74 + l.d, p);
    l.mesh.visible = t > 0.001;
    l.mesh.geometry.setDrawRange(0, Math.floor(l.count * t / 6) * 6);
  }
  const run = smooth(0.9, 0.97, p);
  if (hingeP) hinge.rotation.x = hingeP.baseR.x + run * 0.72;
  fanSpin.rotation.x = p * 14 + time * 7 * run;
  oSpin.rotation.z = time * 6 * run;
  airMat.opacity = run * 0.95;
  air.visible = run > 0.01;
  if (air.visible) moveAir(time);
  placeCamera(p);
}

/* ---------- skrol ---------- */
const stage = document.getElementById('sklapanje');
let target = 0, cur = 0, stageTop = 0, stageLen = 1;
function measure() {
  const r = stage.getBoundingClientRect();
  stageTop = r.top + scrollY;
  stageLen = Math.max(1, r.height - innerHeight);
  // posle sklapanja kamera još polako prilazi jedinici, do 1.3
  target = Math.max(0, (scrollY - stageTop) / stageLen);
  target = target > 1 ? Math.min(1.3, 1 + (target - 1) * 0.55) : target;
  if (reduced) target = 0.6;
}
function resize() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, isPortrait ? 1.5 : 1.75));
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  measure(); dirty = true;
}
let dirty = true, last = performance.now(), time = 0;
addEventListener('scroll', measure, { passive: true });
addEventListener('resize', resize);

function tick(now) {
  requestAnimationFrame(tick);
  if (document.hidden) { last = now; return; }
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const before = cur;
  cur += (target - cur) * (reduced ? 1 : 1 - Math.exp(-dt * 8));
  if (Math.abs(target - cur) < 0.00015) cur = target;
  const running = !reduced && cur > 0.9;
  if (running) time += dt;
  if (dirty || cur !== before || running) {
    apply(cur, time);
    renderer.render(scene, camera);
    dirty = false;
  }
  window.__settled = cur === target;
}

window.__beil = { get cur() { return cur; }, get target() { return target; } };
resize();
apply(cur, 0);
requestAnimationFrame(tick);
document.documentElement.classList.add('ima-3d');
