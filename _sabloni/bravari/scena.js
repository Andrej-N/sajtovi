// Bravari, mode: cilindar, kapija (kovana), kapija-cev (od cevi).
// Cilindar brave u preseku se sklapa dok se skroluje. Kućište, jezgro, donji i gornji pinovi, opruge,
// pa ulazi ključ i svaki pin se penje po profilu ključa do linije smicanja. Na kraju se presek zatvori i ključ okrene.
// Osa cilindra je z, pinovi su uspravni, ravan preseka je x = 0, a kamera gleda sa strane +x.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

const canvas = document.getElementById('scena');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CFG = window.SCENA || { bg: {} };
const C = { top: '#0A1A33', glow: '60,104,168', hi: '150,190,230', low: '4,10,24', mid: '22,52,110', ...CFG.bg };

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
renderer.toneMappingExposure = 1.08;

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
const V = (x, y, z) => new THREE.Vector3(x, y, z);

/* ---------- svetlo i pozadina ---------- */
const scene = new THREE.Scene();
const envS = new THREE.Scene();
envS.background = new THREE.Color(0x101c30);
function panel(w, h, x, y, z, col, i) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(i), side: THREE.DoubleSide }));
  m.position.set(x, y, z); m.lookAt(0, 0, 0); envS.add(m);
}
panel(30, 5, 0, 18, 4, 0xffffff, 12); panel(5, 26, 22, 4, 12, 0xeaf3ff, 9); panel(6, 22, 16, 0, -20, 0xbcd8ff, 5);
panel(26, 5, 8, -16, 6, 0x88a8e0, 3); panel(12, 10, 26, 8, 0, 0xffffff, 3); panel(10, 8, -22, 2, 8, 0xffd2a0, 4);
const pm = new THREE.PMREMGenerator(renderer);
scene.environment = pm.fromScene(envS, 0.015).texture;

const bgc = document.createElement('canvas'); bgc.width = 1024; bgc.height = 640;
const g = bgc.getContext('2d');
g.fillStyle = C.top; g.fillRect(0, 0, 1024, 640);
function blob(x, y, r, c) { const a = g.createRadialGradient(x, y, 0, x, y, r); a.addColorStop(0, c); a.addColorStop(1, c.replace(/[\d.]+\)$/, '0)')); g.fillStyle = a; g.fillRect(0, 0, 1024, 640); }
blob(740, 240, 500, `rgba(${C.glow},0.85)`); blob(930, 50, 260, `rgba(${C.hi},0.42)`); blob(110, 620, 540, `rgba(${C.low},0.95)`); blob(560, 660, 360, `rgba(${C.mid},0.7)`);
const bg = new THREE.CanvasTexture(bgc); bg.colorSpace = THREE.SRGBColorSpace; scene.background = bg;

const key = new THREE.DirectionalLight(0xffffff, 1.9); key.position.set(9, 7, 6); scene.add(key);
const rim = new THREE.DirectionalLight(0xffc99a, 1.1); rim.position.set(-3, -4, -9); scene.add(rim);

/* ---------- materijali ---------- */
const MESING = new THREE.MeshStandardMaterial({ color: CFG.mesing || 0xd9ac5c, metalness: 1, roughness: 0.3, envMapIntensity: 1.25 });
const MESING2 = new THREE.MeshStandardMaterial({ color: 0xe6c27a, metalness: 1, roughness: 0.2, envMapIntensity: 1.4 });
const NIKL = new THREE.MeshStandardMaterial({ color: 0xd8dde2, metalness: 1, roughness: 0.24, envMapIntensity: 1.3 });
const CELIK = new THREE.MeshStandardMaterial({ color: 0x9aa4ae, metalness: 1, roughness: 0.32, envMapIntensity: 1.2 });
const KANAL = new THREE.MeshStandardMaterial({ color: 0x1b1408, metalness: 0.6, roughness: 0.6 });
const REZ = new THREE.MeshStandardMaterial({ color: 0xc89b4e, metalness: 1, roughness: 0.46, envMapIntensity: 1 });

/* ---------- delovi: svaki zna odakle dolazi i kada ---------- */
const parts = [];
function part(parent, obj, off, rot, a, b) {
  parent.add(obj);
  parts.push({ obj, base: obj.position.clone(), baseR: obj.rotation.clone(), off: V(...off), rot, a, b });
  return obj;
}

const MODE = CFG.mode || 'cilindar';
const K = (p, look, dir, d, dp, sx = 0.17, sy = -0.12) => ({ p, look, dir, d, dp, sx, sy });
const CRN = new THREE.MeshStandardMaterial({ color: 0x17191c, metalness: 0.7, roughness: 0.4 });

function cilindar() {
const u = new THREE.Group(); u.rotation.set(0.02, 0.1, 0); scene.add(u);
const L = 11, R = 1.35, HR = 1.38, RO = 1.78, STEM = 4.1, SW = 0.86;
const SL = 1.365; // linija smicanja: između jezgra i kućišta

function ekstruzija(s, dub) {
  let geo = new THREE.ExtrudeGeometry(s, { depth: dub, bevelEnabled: false, curveSegments: 40 });
  geo.translate(0, 0, -dub / 2);
  return toCreasedNormals(geo, 0.5);
}
// kućište: polovina preseka, x sa znakom strane
function kucisteOblik(sg) {
  const s = new THREE.Shape();
  const a = Math.atan2(Math.sqrt(RO * RO - SW * SW), -SW); // gde se krug spaja sa vratom
  const pts = [];
  for (let i = 0; i <= 40; i++) { const t = (3 * Math.PI) / 2 + ((a - (3 * Math.PI) / 2) * i) / 40; pts.push([Math.cos(t) * RO, Math.sin(t) * RO]); }
  pts.push([-SW, STEM], [0, STEM], [0, HR]);
  for (let i = 1; i <= 40; i++) { const t = Math.PI / 2 + (Math.PI * i) / 40; pts.push([Math.cos(t) * HR, Math.sin(t) * HR]); }
  pts.forEach(([x, y], i) => (i ? s.lineTo(x * sg, y) : s.moveTo(x * sg, y)));
  s.closePath();
  return s;
}
function jezgroOblik(sg) {
  const s = new THREE.Shape();
  for (let i = 0; i <= 48; i++) { const t = -Math.PI / 2 - (Math.PI * i) / 48; const x = Math.cos(t) * R, y = Math.sin(t) * R; i ? s.lineTo(x * sg, y) : s.moveTo(x * sg, y); }
  s.closePath();
  return s;
}

const Zp = [-3.2, -1.6, 0, 1.6, 3.2]; // mesta pinova
const Hk = [0.12, 0.62, 0.28, 0.82, 0.42]; // visina ključa ispod svakog pina

/* ---------- kućište (zadnja polovina) sa kanalima za pinove ---------- */
const kuc = new THREE.Group();
kuc.add(new THREE.Mesh(ekstruzija(kucisteOblik(1), L), MESING));
for (const z of Zp) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.02, STEM - 0.22 - HR, 0.66), KANAL); m.position.set(0.012, (STEM - 0.22 + HR) / 2, z); kuc.add(m); }
part(u, kuc, [-3.2, 0.5, -1.4], [0.12, -0.3, 0.1], 0.02, 0.12);

/* ---------- jezgro: ovo se okreće zajedno sa ključem ---------- */
const obrt = new THREE.Group(); u.add(obrt);
const jez = new THREE.Group();
jez.add(new THREE.Mesh(ekstruzija(jezgroOblik(1), L + 0.3).translate(0, 0, 0.15), MESING2));
for (const z of Zp) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.02, R - 0.02, 0.66), KANAL); m.position.set(0.012, R / 2, z); jez.add(m); }
const kanalKljuca = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.16, L + 0.3), KANAL); kanalKljuca.position.set(0.014, -0.16, 0.15); jez.add(kanalKljuca);
part(obrt, jez, [0, -1, 11], [0.1, 0.1, 0], 0.13, 0.25);

/* ---------- zadnji zatvarač ---------- */
const brega = new THREE.Group(); brega.position.z = -L / 2 - 0.42;
brega.add(new THREE.Mesh(new THREE.CylinderGeometry(R * 0.96, R * 0.96, 0.5, 48).rotateX(Math.PI / 2), CELIK));
const zub = new THREE.Mesh(new RoundedBoxGeometry(0.72, 1.7, 0.5, 2, 0.1), CELIK); zub.position.set(0, -1.9, 0); brega.add(zub);
part(obrt, brega, [0, -2.4, -6], [0, 0, 0.8], 0.18, 0.27);

/* ---------- pinovi i opruge ---------- */
const lower = [], upper = [], opruge = [];
const RP = 0.29, DRIVER = 1;
const REST = -0.25;
function oprugaGeo() {
  const pts = [];
  for (let i = 0; i <= 150; i++) { const t = i / 150, a = t * Math.PI * 2 * 7; pts.push(V(Math.cos(a) * 0.22, t, Math.sin(a) * 0.22)); }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 300, 0.038, 6);
}
const OG = oprugaGeo();
Zp.forEach((z, i) => {
  const len = SL - Hk[i];
  // donji pin: zaobljen vrh koji jaše po ključu
  const lw = new THREE.Group(); lw.position.z = z;
  const lm = new THREE.Group(); lw.add(lm);
  lm.add(new THREE.Mesh(new THREE.CylinderGeometry(RP, RP * 0.66, 0.2, 28).translate(0, 0.1, 0).rotateY(0), MESING2));
  const tel = new THREE.Mesh(new THREE.CylinderGeometry(RP, RP, Math.max(0.02, len - 0.2), 28), MESING2); tel.position.y = 0.2 + (len - 0.2) / 2; lm.add(tel);
  part(obrt, lw, [1.6, -5.4 - i * 0.15, 0], [0.2, 0.2, 0.3], 0.27 + i * 0.012, 0.34 + i * 0.012);
  lower.push({ lm, len, z });
  // gornji pin
  const dw = new THREE.Group(); dw.position.z = z;
  const dm = new THREE.Mesh(new THREE.CylinderGeometry(RP, RP, DRIVER, 28).translate(0, DRIVER / 2, 0), NIKL); dw.add(dm);
  part(u, dw, [1.8, 6.2 + i * 0.15, 0], [-0.2, 0.2, -0.3], 0.33 + i * 0.012, 0.4 + i * 0.012);
  upper.push(dm);
  // opruga
  const ow = new THREE.Group(); ow.position.z = z;
  const om = new THREE.Mesh(OG, CELIK); ow.add(om);
  part(u, ow, [1.5, 9 + i * 0.2, 0], [0, 0.4, -0.2], 0.39 + i * 0.012, 0.46 + i * 0.012);
  opruge.push(om);
});

/* ---------- ključ: profil se računa iz istih visina kao pinovi ---------- */
const profil = [[-4.4, -0.42], [-3.92, -0.08]];
Zp.forEach((z, i) => { profil.push([z - 0.2, Hk[i]], [z + 0.2, Hk[i]]); });
profil.push([4.3, 0.2], [5.5, 0.2], [5.7, 0.5]);
const visinaKljuca = (z) => {
  if (z < profil[0][0]) return -Infinity;
  for (let i = 0; i < profil.length - 1; i++) {
    const [a, b] = profil[i], [c, d] = profil[i + 1];
    if (z <= c) return b + ((d - b) * (z - a)) / (c - a);
  }
  return profil.at(-1)[1];
};
const klj = new THREE.Group();
{
  const s = new THREE.Shape();
  s.moveTo(-4.4, -0.72);
  profil.forEach(([a, b]) => s.lineTo(a, b));
  s.lineTo(5.7, -0.72); s.closePath();
  const b1 = new THREE.ExtrudeGeometry(s, { depth: 0.26, bevelEnabled: false }); b1.rotateY(-Math.PI / 2); b1.translate(0.13, 0, 0);
  klj.add(new THREE.Mesh(b1, NIKL));
  // žljeb duž sečiva
  const zl = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 9.6), CELIK); zl.position.set(0.14, -0.42, 0.55); klj.add(zl);
  const gl = new THREE.Shape();
  gl.absellipse(7.5, -0.1, 1.85, 1.6, 0, Math.PI * 2, false, 0);
  const rupa = new THREE.Path(); rupa.absarc(8.6, -0.1, 0.36, 0, Math.PI * 2, true); gl.holes.push(rupa);
  const b2 = new THREE.ExtrudeGeometry(gl, { depth: 0.32, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3, curveSegments: 48 }); b2.rotateY(-Math.PI / 2); b2.translate(0.16, 0, 0);
  klj.add(new THREE.Mesh(b2, NIKL));
}
const KEY_OUT = 13; // koliko je ključ izvučen pre ulaska
klj.position.z = KEY_OUT;
obrt.add(klj);

/* ---------- prednja polovina: zatvara presek pred okret ---------- */
const prednjaK = new THREE.Mesh(ekstruzija(kucisteOblik(-1), L), MESING);
const prednjaJ = new THREE.Mesh(ekstruzija(jezgroOblik(-1), L + 0.3).translate(0, 0, 0.15), MESING2);
const zavrtanj = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.14, 24).rotateZ(Math.PI / 2), CELIK); zavrtanj.position.set(RO - 0.02, -0.8, 0); void zavrtanj;
part(u, prednjaK, [7, 0.6, 0.6], [0.1, 0.34, 0], 0.76, 0.84).userData.kasno = true;
part(obrt, prednjaJ, [9, -0.4, 0.3], [0.1, 0.34, 0], 0.79, 0.87).userData.kasno = true;

const keys = [
  K(0, [0, 0.8, 1.5], [1, 0.24, 0.62], 54, 118),
  K(0.14, [0, 0.6, 0.4], [1, 0.22, 0.42], 44, 92),
  K(0.28, [0, 0.4, 0], [1, 0.14, 0.24], 36, 78),
  K(0.42, [0, 2, 0], [1, 0.12, 0.14], 25, 62),
  K(0.56, [0, 1, 2.5], [1, 0.08, 0.14], 32, 72),
  K(0.66, [0, 1.1, 0], [1, 0.05, 0.05], 20, 50),
  K(0.72, [0, 1.3, 0.6], [1, 0.05, 0.06], 21, 46),
  K(0.86, [0, 0.8, 1.2], [1, 0.22, 0.44], 33, 76),
  K(1, [0, 0.9, 2.4], [0.86, 0.2, 1], 28, 62),
  K(1.3, [0, 0.9, 2.4], [0.5, 0.22, 1], 30, 66, 0, 0),
];
  const VRH_KANALA = STEM - 0.22;
  function finale(p) {
    // ključ ulazi: pin jaše po profilu, gornji pin i opruga ga prate
    const ulaz = smooth(0.52, 0.66, p);
    const off = (1 - ulaz) * KEY_OUT;
    klj.position.z = off;
    Zp.forEach((z, i) => {
      const dno = Math.max(REST, visinaKljuca(z - off));
      lower[i].lm.position.y = dno;
      const vrh = dno + lower[i].len;
      upper[i].position.y = vrh;
      const pocetak = vrh + DRIVER;
      opruge[i].position.y = pocetak;
      opruge[i].scale.y = Math.max(0.2, VRH_KANALA - pocetak);
    });
    // okret ključa: jezgro, ključ i zatvarač
    obrt.rotation.z = -smooth(0.89, 0.985, p) * Math.PI / 2;
  }
  return { keys, finale };
}

/* ---------- kapija: stubovi, ram krila, ispuna, varovi, farba, okov, pa se otvori ---------- */
function kapija(moderna) {
  const G = -3.6, TOP = 3.3, HW = 6.1; // tlo, vrh krila, polovina otvora
  const u = new THREE.Group(); u.rotation.set(0, -0.32, 0); scene.add(u);
  const SIROVO = new THREE.Color(0x6d7276), BOJA = new THREE.Color(CFG.front || 0x1a1d20);
  const CEL = new THREE.MeshStandardMaterial({ color: SIROVO.clone(), metalness: 0.85, roughness: 0.46, envMapIntensity: 1 });
  const BETON = new THREE.MeshStandardMaterial({ color: 0x4b5054, roughness: 0.94, envMapIntensity: 0.42 });
  const b = (w, h, d, x, y, z, mat = CEL) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); return m; };

  part(u, b(31, 0.5, 11, 0, G - 0.25, 0, BETON), [0, -5, 0], [0.12, 0, 0], 0.01, 0.09);
  // stubovi sa kapom
  for (const s of [-1, 1]) {
    const st = new THREE.Group();
    st.add(b(0.72, TOP - G + 0.5, 0.72, s * (HW + 0.36), (TOP + 0.5 + G) / 2, 0));
    st.add(b(0.98, 0.14, 0.98, s * (HW + 0.36), TOP + 0.56, 0));
    if (!moderna) { const k = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 16), CEL); k.position.set(s * (HW + 0.36), TOP + 0.84, 0); st.add(k); }
    part(u, st, [s * 5, 6, 0], [0, 0, s * 0.3], 0.04 + (s > 0 ? 0.03 : 0), 0.13 + (s > 0 ? 0.03 : 0));
  }

  const T = 0.2, L = HW - 0.06, Y0 = G + 0.42;
  const A = moderna ? 0 : 1.05; // luk ka sredini kapije
  const vrh = (t) => TOP - 0.2 + A * Math.sin((t * Math.PI) / 2) - A; // t = 0 kod šarke, 1 na sredini
  const spojevi = [];
  const krila = [-1, 1].map((s) => {
    // s = -1: levo krilo, šarka levo; krilo ide ka sredini
    const hinge = new THREE.Group(); hinge.position.set(s * HW, 0, 0); u.add(hinge);
    const x = (t) => -s * (0.1 + t * (L - 0.2)); // lokalno x duž krila
    // ram: unutrašnji stub, spoljni stub, donja šina, gornji pojas
    const dT = s < 0 ? 0 : 0.02;
    part(hinge, b(T, vrh(0) - Y0, T, x(0), (vrh(0) + Y0) / 2, 0), [s * 1.6, 2, 2.2], [0.1, 0, 0.14], 0.17 + dT, 0.25 + dT);
    part(hinge, b(T, vrh(1) - Y0, T, x(1), (vrh(1) + Y0) / 2, 0), [s * -2, 2.4, 2.4], [0.1, 0, -0.14], 0.19 + dT, 0.27 + dT);
    part(hinge, b(L - 0.2, T, T, x(0.5), Y0, 0), [0, -2.4, 2.8], [0.1, 0.2, 0], 0.21 + dT, 0.29 + dT);
    if (moderna) part(hinge, b(L - 0.2, T, T, x(0.5), vrh(0), 0), [0, 2.6, 2.8], [-0.1, 0.2, 0], 0.22 + dT, 0.3 + dT);
    else {
      const pts = []; for (let i = 0; i <= 28; i++) { const t = i / 28; pts.push(V(x(t), vrh(t), 0)); }
      part(hinge, new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.11, 10), CEL), [0, 3, 2.8], [-0.1, 0.2, 0], 0.22 + dT, 0.3 + dT);
    }
    spojevi.push(V(s * HW + x(0), Y0, 0.12), V(s * HW + x(1), Y0, 0.12), V(s * HW + x(1), vrh(1), 0.12), V(s * HW + x(0), vrh(0), 0.12));
    const ispuna = [];
    if (moderna) {
      const n = 9, h = (vrh(0) - Y0 - T) / n;
      for (let i = 0; i < n; i++) ispuna.push(b(L - 0.42, h * 0.72, 0.1, x(0.5), Y0 + T / 2 + h * (i + 0.5), 0));
    } else {
      const n = 13, sred = Y0 + 1.5;
      ispuna.push(b(L - 0.3, 0.14, 0.14, x(0.5), sred, 0));
      for (let i = 1; i < n; i++) {
        const t = i / n, yv = vrh(t);
        const g = new THREE.Group();
        g.add(b(0.12, yv - Y0, 0.12, x(t), (yv + Y0) / 2, 0));
        // kovani šiljak iznad pojasa
        const sp = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.44, 4), CEL); sp.position.set(x(t), yv + 0.24, 0); g.add(sp);
        ispuna.push(g);
      }
      // kovane spirale u donjem pojasu
      const n2 = 4, w = (L - 0.5) / n2;
      for (let i = 0; i < n2; i++) {
        const c = V(x((i + 0.5) / n2), Y0 + 0.75, 0.02);
        const pts = []; for (let k = 0; k <= 60; k++) { const f = k / 60, a = f * Math.PI * 3.4, r = 0.08 + f * Math.min(0.56, w * 0.42); pts.push(V(c.x + Math.cos(a) * r * (i % 2 ? 1 : -1), c.y + Math.sin(a) * r, c.z)); }
        ispuna.push(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, 0.045, 7), CEL));
      }
    }
    ispuna.forEach((m, i) => {
      const a = 0.33 + (i / ispuna.length) * 0.1 + (s > 0 ? 0.012 : 0);
      part(hinge, m, [i % 2 ? 0.5 : -0.5, moderna ? 0 : 1.2, 5], [0.2, 0.3 * (i % 2 ? 1 : -1), 0], a, a + 0.055);
    });
    // šarke
    const ok = new THREE.Group();
    for (const y of [Y0 + 0.9, vrh(0) - 0.9]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.56, 18), MESING); c.position.set(s * 0.02, y, 0.16); ok.add(c); }
    part(hinge, ok, [s * 1.6, 0, 1.6], [0, 0.4, 0], 0.82, 0.87).userData.kasno = true;
    return { hinge, s, x };
  });

  // ograda levo i desno, u istom stilu
  for (const s of [-1, 1]) {
    const f = new THREE.Group(), x1 = s * (HW + 0.72), x2 = s * 14.6, W = Math.abs(x2 - x1), yT = TOP - 1.05, yB = Y0 + 0.5;
    f.add(b(W, 0.14, 0.14, (x1 + x2) / 2, yT, 0), b(W, 0.14, 0.14, (x1 + x2) / 2, yB, 0));
    if (moderna) for (let i = 0; i < 7; i++) f.add(b(W, 0.28, 0.08, (x1 + x2) / 2, yB + 0.4 + i * ((yT - yB - 0.5) / 6.4), 0));
    else for (let i = 1; i < 24; i++) { const xx = x1 + (x2 - x1) * (i / 24); f.add(b(0.1, yT - yB + 0.56, 0.1, xx, (yT + yB + 0.56) / 2, 0)); const c = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.36, 4), CEL); c.position.set(xx, yT + 0.72, 0); f.add(c); }
    f.add(b(0.3, yT - G + 0.5, 0.3, x2, (yT + 0.5 + G) / 2, 0));
    part(u, f, [s * 6, 0, 3], [0, s * 0.3, 0], 0.43 + (s > 0 ? 0.02 : 0), 0.49 + (s > 0 ? 0.02 : 0));
  }

  // brava i kvaka na desnom krilu, zasun na levom
  const brava = new THREE.Group();
  const dx = krila[1].x(1) + 0.02;
  brava.add(b(0.42, 0.78, 0.14, dx, -0.4, 0.15, CRN));
  const cil = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.18, 14).rotateX(Math.PI / 2), MESING); cil.position.set(dx, -0.56, 0.3); brava.add(cil);
  const kv = new THREE.Group(); kv.position.set(dx, -0.14, 0.26); kv.add(b(0.64, 0.08, 0.08, 0.3, 0, 0.08, MESING)); brava.add(kv);
  part(krila[1].hinge, brava, [-1.2, -0.6, 2.2], [0.3, -0.4, 0.2], 0.84, 0.89).userData.kasno = true;
  const zasun = b(0.1, 1.2, 0.1, krila[0].x(0.97), Y0 - 0.1, 0.17, MESING);
  part(krila[0].hinge, zasun, [0.6, 1.2, 1.6], [0, 0, 0], 0.85, 0.89).userData.kasno = true;

  // varnice: skaču od spoja do spoja, svaki spoj ostavi šav
  const SP = isPortrait ? 90 : 170;
  const spPos = new Float32Array(SP * 3);
  const spG = new THREE.BufferGeometry(); spG.setAttribute('position', new THREE.BufferAttribute(spPos, 3));
  const sc = document.createElement('canvas'); sc.width = sc.height = 64;
  const sx = sc.getContext('2d'); const rg = sx.createRadialGradient(32, 32, 0, 32, 32, 32); rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.3, 'rgba(255,214,150,.75)'); rg.addColorStop(1, 'rgba(255,150,60,0)'); sx.fillStyle = rg; sx.fillRect(0, 0, 64, 64);
  const spM = new THREE.PointsMaterial({ map: new THREE.CanvasTexture(sc), size: 0.3, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffd9a6 });
  const sparks = new THREE.Points(spG, spM); sparks.frustumCulled = false; u.add(sparks);
  const luk = new THREE.PointLight(0xbcd6ff, 0, 22, 1.7); u.add(luk);
  const lukM = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })); u.add(lukM);
  const C_SAV = new THREE.Color(0x3d3f42);
  const savovi = spojevi.map((p, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), new THREE.MeshStandardMaterial({ color: 0x3d3f42, metalness: 0.7, roughness: 0.74 })); m.scale.set(1, 1, 0.5); const kr = i < 4 ? krila[0] : krila[1]; m.position.copy(p).sub(kr.hinge.position); m.visible = false; kr.hinge.add(m); return m; });
  const seme = Array.from({ length: SP }, (_, i) => { const r = (n) => { const x = Math.sin((i + 1) * n * 12.9898) * 43758.5453; return x - Math.floor(x); }; return [r(1) - 0.5, r(2), r(3) - 0.5, r(4)]; });
  // dvorište iza kapije
  u.add(b(HW * 2 - 0.2, 0.04, 5.2, 0, G + 0.02, -2.8, new THREE.MeshStandardMaterial({ color: 0x3b3f42, roughness: 0.9 })));

  const keys = [
    K(0, [2, 0.5, 1], [0.5, 0.42, 1], 70, 170),
    K(0.158, [2, 0, 0], [0.42, 0.24, 1], 62, 140),
    K(0.325, [-3, 0, 1], [0.2, 0.16, 1], 42, 92),
    K(0.49, [2, 0, 1], [0.34, 0.14, 1], 56, 118),
    K(0.58, [-3, -1.4, 0], [0.32, 0.1, 1], 26, 62),
    K(0.658, [3, -1.4, 0], [-0.1, 0.1, 1], 28, 64),
    K(0.825, [1.5, 0, 0.5], [0.2, 0.12, 1], 48, 104),
    K(0.885, [2.2, -0.6, 0.5], [0.34, 0.08, 1], 16, 36),
    K(1, [2.6, -0.3, 0], [0.42, 0.2, 1], 54, 118),
    K(1.3, [0, -0.3, 0], [0.16, 0.22, 1], 54, 118, 0, 0),
  ];
  function finale(p) {
    // zavarivanje: ide po spojevima
    const w = (p - 0.5) / 0.14, ide = w > 0 && w < 1;
    const n = spojevi.length, idx = Math.min(n - 1, Math.floor(Math.max(0, w) * n));
    savovi.forEach((m, i) => { m.visible = w * n > i + 0.3 || w >= 1; });
    sparks.visible = lukM.visible = ide;
    luk.intensity = ide ? 40 : 0;
    if (ide) {
      const c = spojevi[idx], f = (w * n) % 1;
      lukM.position.copy(c); luk.position.copy(c).add(V(0, 0.2, 0.8));
      for (let i = 0; i < SP; i++) {
        const [a, b2, d, e] = seme[i], t = (f * 2.6 + e) % 1;
        spPos[i * 3] = c.x + a * 3.6 * t; spPos[i * 3 + 1] = c.y + (0.9 + b2 * 1.2) * t - 3.4 * t * t; spPos[i * 3 + 2] = c.z + 0.3 + d * 3 * t + t;
      }
      spG.attributes.position.needsUpdate = true;
    }
    // farba
    const f2 = smooth(0.66, 0.8, p);
    CEL.color.copy(SIROVO).lerp(BOJA, f2);
    CEL.metalness = mix(0.85, 0.3, f2); CEL.roughness = mix(0.46, 0.36, f2);
    savovi.forEach((m) => { m.material.color.copy(C_SAV).lerp(BOJA, f2); });
    // otvaranje
    const o = smooth(0.91, 0.99, p) * 1.22;
    krila[0].hinge.rotation.y = o; krila[1].hinge.rotation.y = -o;
    kv.rotation.z = -smooth(0.89, 0.915, p) * 0.5;
  }
  return { keys, finale };
}

const M = { cilindar: () => cilindar(), kapija: () => kapija(false), 'kapija-cev': () => kapija(true) }[MODE]();
const keys = M.keys;

/* ---------- kamera po skrolu ---------- */
const camera = new THREE.PerspectiveCamera(26, 1, 0.5, 300);
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
  const Wv = innerWidth, Hv = innerHeight;
  const sx = CFG.still || pt ? 0 : mix(a.sx, b.sx, t), sy = !CFG.still && pt ? -mix(a.sy, b.sy, t) : 0;
  camera.setViewOffset(Wv, Hv, -Wv * sx, Hv * sy, Wv, Hv);
}

/* ---------- jedan kadar ---------- */
function apply(p) {
  for (const q of parts) {
    const t = smooth(q.a, q.b, p), r = 1 - t;
    if (q.obj.userData.kasno) q.obj.visible = p > q.a;
    q.obj.position.copy(q.base).addScaledVector(q.off, r);
    q.obj.rotation.set(q.baseR.x + q.rot[0] * r, q.baseR.y + q.rot[1] * r, q.baseR.z + q.rot[2] * r);
  }
  M.finale(p);
  placeCamera(p);
}

/* ---------- skrol ---------- */
const stage = document.getElementById('sklapanje');
let target = 0, cur = 0, stageTop = 0, stageLen = 1, dirty = true, last = performance.now();
function measure() {
  const r = stage.getBoundingClientRect();
  stageTop = r.top + scrollY;
  stageLen = Math.max(1, r.height - innerHeight);
  target = Math.max(0, (scrollY - stageTop) / stageLen);
  target = target > 1 ? Math.min(1.3, 1 + (target - 1) * 0.55) : target;
  if (reduced) target = MODE === 'cilindar' ? 0.72 : 0.86;
}
function resize() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, isPortrait ? 1.5 : 1.75));
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  measure(); dirty = true;
}
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
  if (dirty || cur !== before) {
    apply(cur);
    renderer.render(scene, camera);
    dirty = false;
  }
  window.__settled = cur === target;
}

window.__beil = { get cur() { return cur; }, get target() { return target; } };
window.__kadar = (p) => { frozen = true; cur = target = p; apply(p); renderer.render(scene, camera); };
resize();
apply(cur);
requestAnimationFrame(tick);
document.documentElement.classList.add('ima-3d');
