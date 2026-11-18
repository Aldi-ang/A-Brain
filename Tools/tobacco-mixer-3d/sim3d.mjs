import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { MACHINE } from "./physics.mjs";

const TOBACCO_COLORS = [
  new THREE.Color(0x4a2915), // Temanggung Srintil (dark rich brown)
  new THREE.Color(0xc28135), // Madura Campor (warm amber gold)
  new THREE.Color(0x886c36), // Boyolali Tengah (warm olive ochre)
];

export const PIECE_INFO = {
  "01": {
    name: "Steel Base Skid & Rubber Feet",
    indo: "Rangka Bawah UNP 100 + Kaki Karet",
    fn: "Carries the full ~650 kg loaded machine flat on workshop floor; anti-slip rubber pads isolate vibration.",
    spec: "UNP 100 / Hollow 100×50×3.2 mm, 238×224 cm footprint, 4 rubber isolation pads.",
    cam: { pos: [-3.6, 1.45, 3.8], target: [0, 0.35, 0] },
  },
  "02": {
    name: "Twin A-Frame Trunnion Stanchions",
    indo: "Tiang Penyangga A-Frame + UCP-210",
    fn: "Holds cradle trunnion pins at 154 cm CoG height so drum clears floor at +32° mix and -12° dump.",
    spec: "Hollow 80×80×3 mm A-legs + 2× UCP-210 (50 mm) pillow-block bearings.",
    cam: { pos: [-3.5, 2.0, 3.1], target: [-0.55, 1.15, 0] },
  },
  "03": {
    name: "Tilting U-Cradle & Worm Tilt Wheel",
    indo: "Rangka Ayun + Roda Kemiringan",
    fn: "Self-locking brass worm handwheel tilts drum from +32° mix down to -12° dump without dropping load. Click wheel in 3D to tilt!",
    spec: "U-cradle channel frame + self-locking worm quadrant + 40 cm brass handwheel.",
    cam: { pos: [3.1, 1.95, 2.6], target: [0.95, 1.32, 0.1] },
  },
  "04": {
    name: "4 Trunnion Rollers & Rear Thrust Hub",
    indo: "4 Roda Penumpu + Bearing Dorong",
    fn: "Supports rotating drum externally on twin rolling tire bands (mu=0.012) so thin steamer sheet never tears.",
    spec: "4× 150 mm polyurethane-on-steel guide rollers + rear 51112 axial thrust bearing.",
    cam: { pos: [-2.85, 1.05, 2.65], target: [0, 0.78, 0.1] },
  },
  "05": {
    name: "179×179 cm Baglog Steamer Cylinder",
    indo: "Tabung Steamer Baglog Jamur (179×179 cm)",
    fn: "Existing 4,505 L mushroom baglog autoclave barrel. Kept intact with bolted tire rings & top mouth flange.",
    spec: "179 cm diameter × 179 cm length (~2.5 mm stainless/mild steel), stiffening chimes.",
    cam: { pos: [-3.65, 2.45, 3.75], target: [0, 1.42, 0.1] },
  },
  "06": {
    name: "4 Helical Flights & Cross-Deflectors",
    indo: "4 Sirip Heliks + Pembelah Halus",
    fn: "Alternating curved scoops gently lift shredded rajangan to 11 o'clock and waterfall across drum width (<1% bubuk).",
    spec: "4× 14 cm curved smooth SS304 flights (18° helix) + 4 cross-vanes; ZERO sharp cutting blades.",
    cam: { pos: [-2.75, 2.25, 3.05], target: [0.05, 1.45, 0.25] },
  },
  "07": {
    name: "181 cm Tupperware Vault Lid & 8 Clamps",
    indo: "Tutup Vault Tupperware + 8 Pengunci + Engsel Ayun",
    fn: "Full-area EPDM U-gasket seals aroma & dust; 8 over-center latches unlock before gas-strut davit swings the 48 kg lid aside. Click door in 3D!",
    spec: "181 cm domed cap + EPDM U-gasket + 8× GH-40341 toggle latches + offset swing-davit arm.",
    cam: { pos: [1.85, 2.25, 3.65], target: [0.15, 1.75, 1.15] },
  },
  "08": {
    name: "Center Twist-Lock Sample Cap",
    indo: "Tutup Kecil Cek Sampel & Aroma (Tengah Pintu)",
    fn: "28 cm Tupperware-style inspection port in door center lets you check blend uniformity & aroma mid-run without opening the 48 kg vault lid.",
    spec: "28 cm quick-twist quarter-turn collar + silicone O-ring + brass T-handle. Click cap in 3D!",
    cam: { pos: [1.35, 2.15, 3.55], target: [0.0, 1.75, 1.25] },
  },
  "09": {
    name: "144T Welded Roller-Chain Ring & 12T Pinion",
    indo: "Rantai Rol Las 144T (Keliling Luar) + Pinion 12T (12:1)",
    fn: "Hollow exterior #60 roller-chain band welded around barrel skin leaves drum 100% hollow inside while meshing with twin-bearing 12T pinion.",
    spec: "Open collar + 144T #60 exterior roller-chain ring (PCD 185 cm) + meshed 12T pinion & #50 jackshaft chain.",
    cam: { pos: [-2.65, 1.55, 2.25], target: [-0.85, 1.12, -0.05] },
  },
  "10": {
    name: "Dual-Drive 2-Speed Gearbox, Chain & 90° Bevel",
    indo: "Gearbox 2-Kecepatan + Rantai #50 + Bevel Engkol 90°",
    fn: "Bolted cradle gearbox connects inline motor coupling + #50 drive chain directly to pinion shaft; 90° miter box feeds hand crank & dog-clutch.",
    spec: "Bolted outrigger gearbox + #50 18T:36T chain loop + 90° crank bevel + ratchet pawl.",
    cam: { pos: [-2.75, 1.45, 2.15], target: [-1.15, 1.05, -0.05] },
  },
  "11": {
    name: "3 HP Motor / GX160 & Coupled Crank / Pedal",
    indo: "Mesin 3 HP / GX160 + Engkol 35 cm & Rantai Sepeda",
    fn: "2.2 kW motor or GX160 coupled solidly to gearbox rear shaft; right-angle 35 cm hand crank or chained bicycle pedal drive.",
    spec: "2.2 kW 4-pole + WPWDX-100 inline OR GX160; 90° crank / vertical chained pedal frame.",
    cam: { pos: [-3.05, 1.48, 2.35], target: [-1.35, 1.02, -0.05] },
  },
  human: {
    name: "171 cm Operator Scale Reference (Aldi)",
    indo: "Referensi Tinggi Manusia 171 cm",
    fn: "Exact 171 cm figure beside 179 cm cylinder shows why upright drum (179 cm tall) is over-head and why tilting cradle ergonomics matter.",
    spec: "171.0 cm height · Waist crank shaft at 98 cm · Chest loading lip at 114 cm.",
    cam: { pos: [-3.95, 2.52, 4.45], target: [-0.22, 1.42, 0.12] },
  },
};

function makeGearMesh(teeth, pitchRadius, thickness, mat, holeRadius = 0.03) {
  const shape = new THREE.Shape();
  const addendum = (2 * Math.PI * pitchRadius) / (teeth * 3.4);
  const dedendum = addendum * 1.15;
  const rOut = pitchRadius + addendum;
  const rRoot = Math.max(holeRadius + 0.015, pitchRadius - dedendum);

  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const step = (Math.PI * 2) / teeth;
    const a1 = a0 + step * 0.2;
    const a2 = a0 + step * 0.32;
    const a3 = a0 + step * 0.62;
    const a4 = a0 + step * 0.74;
    if (i === 0) shape.moveTo(Math.cos(a0) * rRoot, Math.sin(a0) * rRoot);
    else shape.lineTo(Math.cos(a0) * rRoot, Math.sin(a0) * rRoot);
    shape.lineTo(Math.cos(a1) * rRoot, Math.sin(a1) * rRoot);
    shape.lineTo(Math.cos(a2) * rOut, Math.sin(a2) * rOut);
    shape.lineTo(Math.cos(a3) * rOut, Math.sin(a3) * rOut);
    shape.lineTo(Math.cos(a4) * rRoot, Math.sin(a4) * rRoot);
  }
  shape.closePath();

  if (holeRadius > 0.005) {
    const hole = new THREE.Path();
    const holeSegs = 64;
    for (let s = holeSegs; s >= 0; s--) {
      const a = (s / holeSegs) * Math.PI * 2;
      const hx = Math.cos(a) * holeRadius;
      const hy = Math.sin(a) * holeRadius;
      if (s === holeSegs) hole.moveTo(hx, hy);
      else hole.lineTo(hx, hy);
    }
    hole.closePath();
    shape.holes.push(hole);
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.002,
    bevelSegments: 1,
    curveSegments: 16,
  });
  geo.translate(0, 0, -thickness / 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Closed roller-chain drive loop connecting sprocket A (pA, rA) to sprocket B (pB, rB)
 * at local axial plane `zPos`, with movable roller pins along perimeter.
 */
function makeChainDriveLoop(pA, rA, pB, rB, zPos, matPlate, matRoller) {
  const group = new THREE.Group();
  const dx = pB[0] - pA[0];
  const dy = pB[1] - pA[1];
  const d = Math.hypot(dx, dy);
  const baseAng = Math.atan2(dy, dx);
  const alpha = Math.acos(Math.max(-0.98, Math.min(0.98, (rA - rB) / Math.max(0.001, d))));

  const waypoints = [];
  const tTopA = baseAng + alpha;
  const tTopB = baseAng + alpha;
  const tBotB = baseAng - alpha + Math.PI * 2;
  const tBotA = baseAng - alpha + Math.PI * 2;

  for (let i = 0; i <= 8; i++) {
    const a = tTopB - ((tTopB - (tBotB - Math.PI * 2)) * i) / 8;
    waypoints.push([pB[0] + Math.cos(a) * rB, pB[1] + Math.sin(a) * rB]);
  }
  for (let i = 0; i <= 8; i++) {
    const a = baseAng - alpha - ((2 * (Math.PI - alpha)) * i) / 8;
    waypoints.push([pA[0] + Math.cos(a) * rA, pA[1] + Math.sin(a) * rA]);
  }

  // Tangent straight plate runs on both sides
  for (const sign of [-1, 1]) {
    const a = baseAng + sign * alpha;
    const x1 = pA[0] + Math.cos(a) * rA;
    const y1 = pA[1] + Math.sin(a) * rA;
    const x2 = pB[0] + Math.cos(a) * rB;
    const y2 = pB[1] + Math.sin(a) * rB;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const seg = new THREE.Mesh(new THREE.BoxGeometry(len, 0.012, 0.022), matPlate);
    seg.position.set((x1 + x2) / 2, (y1 + y2) / 2, zPos);
    seg.rotation.z = Math.atan2(y2 - y1, x2 - x1);
    group.add(seg);
  }

  // Arc wrap bands around both sprockets
  for (const [cp, rp] of [
    [pA, rA],
    [pB, rB],
  ]) {
    const wrap = new THREE.Mesh(new THREE.CylinderGeometry(rp + 0.004, rp + 0.004, 0.022, 28, 1, true), matPlate);
    wrap.rotation.x = Math.PI / 2;
    wrap.position.set(cp[0], cp[1], zPos);
    group.add(wrap);
  }

  // Closed path sampler for animated #50 chain link pins
  const cumLen = [0];
  for (let i = 1; i <= waypoints.length; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i % waypoints.length];
    cumLen.push(cumLen[i - 1] + Math.hypot(curr[0] - prev[0], curr[1] - prev[1]));
  }
  const totalLen = cumLen[cumLen.length - 1];
  const pinCount = 26;
  const pins = [];
  const pinGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.028, 8);
  pinGeo.rotateX(Math.PI / 2);
  for (let i = 0; i < pinCount; i++) {
    const pin = new THREE.Mesh(pinGeo, matRoller);
    pin.position.z = zPos;
    group.add(pin);
    pins.push(pin);
  }

  function advance(distM) {
    for (let i = 0; i < pinCount; i++) {
      let s = ((distM + (i / pinCount) * totalLen) % totalLen + totalLen) % totalLen;
      let segIdx = 0;
      while (segIdx < cumLen.length - 2 && cumLen[segIdx + 1] < s) segIdx++;
      const l0 = cumLen[segIdx];
      const l1 = cumLen[segIdx + 1];
      const f = l1 > l0 ? (s - l0) / (l1 - l0) : 0;
      const a = waypoints[segIdx];
      const b = waypoints[(segIdx + 1) % waypoints.length];
      pins[i].position.x = a[0] + (b[0] - a[0]) * f;
      pins[i].position.y = a[1] + (b[1] - a[1]) * f;
    }
  }
  advance(0);
  return { group, advance };
}

function makeFloorGridTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#16191f";
  ctx.fillRect(0, 0, 1024, 1024);

  for (let i = 0; i < 4000; i++) {
    const v = 22 + ((i * 37) % 10);
    ctx.fillStyle = `rgb(${v},${v + 2},${v + 6})`;
    ctx.fillRect((i * 197) % 1024, (i * 419) % 1024, 2, 2);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 16; i++) {
    const p = (i / 16) * 1024;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(1024, p);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(217,155,56,0.12)";
  ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    const p = (i / 4) * 1024;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(1024, p);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = 4;
  return tex;
}

function hash01(seed) {
  let s = seed | 0;
  s = Math.imul(s ^ (s >>> 16), 0x85ebca6b);
  s = Math.imul(s ^ (s >>> 13), 0xc2b2ae35);
  return ((s ^ (s >>> 16)) >>> 0) / 4294967296;
}

/**
 * High-res (1024x1024) organic fibrous shredded tobacco ("tembakau rajangan")
 * color + bump texture pair using SplitMix32 hash PRNG (zero lattice stripes).
 */
function createTobaccoBedTexture(anisotropy = 8) {
  const SIZE = 1024;
  const c = document.createElement("canvas");
  c.width = SIZE;
  c.height = SIZE;
  const ctx = c.getContext("2d");

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = SIZE;
  bumpCanvas.height = SIZE;
  const bctx = bumpCanvas.getContext("2d");

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = anisotropy;

  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  bumpTex.wrapS = bumpTex.wrapT = THREE.RepeatWrapping;
  bumpTex.anisotropy = anisotropy;

  const shreds = Array.from({ length: 10000 }, (_, i) => ({
    u: hash01(i * 11 + 1) * SIZE,
    v: hash01(i * 11 + 2) * SIZE,
    bandSpread: (hash01(i * 11 + 3) - 0.12) * (SIZE * 0.44),
    len: 8 + hash01(i * 11 + 4) * 16,
    wid: 1.4 + hash01(i * 11 + 5) * 2.0,
    ang: hash01(i * 11 + 6) * Math.PI * 2,
    orig: i % 3,
    jitter: hash01(i * 11 + 7),
  }));

  const palette = ["#472512", "#c48131", "#856a33"];
  const darkPalette = ["#2d170a", "#945e1e", "#5b4822"];
  let lastMixBucket = -1;

  function drawStrand(targetCtx, x, y, len, wid, ang, fill, alpha) {
    targetCtx.save();
    targetCtx.translate(x, y);
    targetCtx.rotate(ang);
    targetCtx.fillStyle = fill;
    targetCtx.globalAlpha = alpha;
    targetCtx.fillRect(-len / 2, -wid / 2, len, wid);
    targetCtx.restore();
  }

  function update(mixFrac) {
    const bucket = Math.round(mixFrac * 20);
    if (bucket === lastMixBucket) return;
    lastMixBucket = bucket;

    const grad = ctx.createLinearGradient(0, 0, SIZE, 0);
    if (mixFrac < 0.75) {
      const m = mixFrac / 0.75;
      grad.addColorStop(0, m < 0.4 ? "#3a1e0e" : "#5e3e1e");
      grad.addColorStop(0.5, m < 0.4 ? "#8a5a20" : "#6c4823");
      grad.addColorStop(1, m < 0.4 ? "#644d23" : "#664220");
    } else {
      grad.addColorStop(0, "#63401e");
      grad.addColorStop(1, "#6a4622");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    bctx.fillStyle = "#565656";
    bctx.fillRect(0, 0, SIZE, SIZE);

    for (let i = 0; i < shreds.length; i++) {
      const s = shreds[i];
      const zoneU = (((s.orig / 3) * SIZE + s.bandSpread) % SIZE + SIZE) % SIZE;
      const u = (zoneU * (1 - mixFrac) + s.u * mixFrac) % SIZE;
      const fill = i % 3 === 0 ? darkPalette[s.orig] : palette[s.orig];
      const alpha = 0.7 + s.jitter * 0.28;
      drawStrand(ctx, u, s.v, s.len, s.wid, s.ang, fill, alpha);
      if (i % 2 === 0) {
        drawStrand(bctx, u, s.v, s.len, s.wid, s.ang, i % 4 === 0 ? "#dedede" : "#969696", 1);
      }
    }
    ctx.globalAlpha = 1;
    tex.needsUpdate = true;
    bumpTex.needsUpdate = true;
  }

  update(0.12);
  return { tex, bumpTex, update };
}

function makeBrushedMetalMaps(anisotropy = 8) {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#b4b4b4";
  ctx.fillRect(0, 0, S, S);
  for (let y = 0; y < S; y++) {
    const shade = Math.round(172 + (hash01(y * 97 + 13) - 0.5) * 18);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(0, y, S, 1);
  }
  for (let i = 0; i < 650; i++) {
    const x = hash01(i * 5 + 1) * S;
    const y = hash01(i * 5 + 2) * S;
    const w = 18 + hash01(i * 5 + 3) * 70;
    const v = Math.round(162 + hash01(i * 5 + 4) * 32);
    ctx.fillStyle = `rgba(${v},${v},${v},0.35)`;
    ctx.fillRect(x, y, w, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = anisotropy;
  return tex;
}

function makeBambooWeaveMaps(anisotropy = 8) {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d");
  const b = document.createElement("canvas");
  b.width = S;
  b.height = S;
  const bctx = b.getContext("2d");

  ctx.fillStyle = "#8a6635";
  ctx.fillRect(0, 0, S, S);
  bctx.fillStyle = "#666666";
  bctx.fillRect(0, 0, S, S);

  const step = 16;
  for (let y = 0; y < S; y += step) {
    for (let x = 0; x < S; x += step) {
      const even = ((x / step) + (y / step)) % 2 === 0;
      ctx.fillStyle = even ? "#a98249" : "#78582b";
      ctx.fillRect(x + 1, y + 1, step - 2, step - 2);
      bctx.fillStyle = even ? "#dcdcdc" : "#8e8e8e";
      bctx.fillRect(x + 1, y + 1, step - 2, step - 2);
    }
  }
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(6, 2);
  map.anisotropy = anisotropy;

  const bumpMap = new THREE.CanvasTexture(b);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(6, 2);
  bumpMap.anisotropy = anisotropy;
  return { map, bumpMap };
}

function makeScaleRulerSprite(label, color = "#d99b38") {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(15,17,21,0.94)";
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(16, 32, 992, 192, 34);
  else ctx.rect(16, 32, 992, 192);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 9;
  ctx.stroke();
  ctx.fillStyle = "#f4efe6";
  ctx.font = "700 84px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 512, 130);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.anisotropy = 8;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.95, 0.24, 1);
  return sprite;
}

function createSafeRenderer() {
  for (const opts of [
    { antialias: true, powerPreference: "high-performance" },
    { antialias: false, powerPreference: "default" },
  ]) {
    try {
      return new THREE.WebGLRenderer(opts);
    } catch {
      // Retry with conservative context options for embedded webviews
    }
  }
  throw new Error("WebGL context could not be initialized in this browser.");
}

export function createMixerSimulation(
  container,
  { onPartSelect, onPartAction, onPartHover, onMetrics, onContextLost } = {}
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f1115);
  scene.fog = new THREE.FogExp2(0x0f1115, 0.036);

  const renderer = createSafeRenderer();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  container.appendChild(renderer.domElement);
  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    if (onContextLost) onContextLost();
  });

  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy() || 4);

  // Physically based workshop reflections (guarded if float PMREM fails on older GPUs)
  let pmrem = null;
  let envTex = null;
  try {
    pmrem = new THREE.PMREMGenerator(renderer);
    envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
  } catch {
    pmrem?.dispose();
    pmrem = null;
    envTex = null;
  }

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 45);
  camera.position.set(-3.95, 2.52, 4.45);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.target.set(-0.22, 1.42, 0.12);
  controls.minDistance = 1.3;
  controls.maxDistance = 10.5;
  controls.maxPolarAngle = Math.PI * 0.495;

  // Smooth camera transition state (yields immediately when user drags)
  const camAnim = { active: false, goalPos: new THREE.Vector3(), goalTarget: new THREE.Vector3() };
  controls.addEventListener("start", () => {
    camAnim.active = false;
  });

  // Lighting (sharp shadow frustum dCam=2.7 around machine)
  const hemi = new THREE.HemisphereLight(0xf8f1e5, 0x262b36, 0.65);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xfff5e4, 1.85);
  keyLight.position.set(-4.2, 6.2, 4.8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 16;
  const dCam = 2.75;
  keyLight.shadow.camera.left = -dCam;
  keyLight.shadow.camera.right = dCam;
  keyLight.shadow.camera.top = dCam;
  keyLight.shadow.camera.bottom = -dCam;
  keyLight.shadow.bias = -0.0004;
  keyLight.shadow.normalBias = 0.035;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xe6ac4c, 0.75);
  rimLight.position.set(4.5, 3.2, -3.5);
  scene.add(rimLight);

  // Workshop Floor
  const floorTex = makeFloorGridTexture();
  floorTex.anisotropy = maxAniso;
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.88,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // High-quality PBR Materials with Brushed Metal + Bamboo Maps
  const brushedMap = makeBrushedMetalMaps(maxAniso);
  const bambooMaps = makeBambooWeaveMaps(maxAniso);
  const matDefs = {
    steelFrame: new THREE.MeshStandardMaterial({ color: 0x3b4454, roughness: 0.48, metalness: 0.72 }),
    darkIron: new THREE.MeshStandardMaterial({ color: 0x242a34, roughness: 0.56, metalness: 0.78 }),
    steamer: new THREE.MeshStandardMaterial({
      color: 0xbac2cd,
      roughness: 0.34,
      metalness: 0.86,
      roughnessMap: brushedMap,
      bumpMap: brushedMap,
      bumpScale: 0.0014,
      side: THREE.DoubleSide,
    }),
    steamerCutaway: new THREE.MeshPhysicalMaterial({
      color: 0xc2cbd6,
      roughness: 0.22,
      metalness: 0.18,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    flight: new THREE.MeshStandardMaterial({ color: 0xd99b38, roughness: 0.36, metalness: 0.72, side: THREE.DoubleSide }),
    tire: new THREE.MeshStandardMaterial({ color: 0x8791a0, roughness: 0.28, metalness: 0.90 }),
    poly: new THREE.MeshStandardMaterial({ color: 0xc77d24, roughness: 0.48, metalness: 0.12 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xdfa23e, roughness: 0.30, metalness: 0.86 }),
    epdm: new THREE.MeshStandardMaterial({ color: 0x1c1e22, roughness: 0.85, metalness: 0.05 }),
    clampRed: new THREE.MeshStandardMaterial({ color: 0xcf4130, roughness: 0.38, metalness: 0.32 }),
    motor: new THREE.MeshStandardMaterial({ color: 0x435368, roughness: 0.44, metalness: 0.68 }),
    humanBody: new THREE.MeshStandardMaterial({ color: 0x414b5c, roughness: 0.72, metalness: 0.08 }),
    humanSkin: new THREE.MeshStandardMaterial({ color: 0xcfa27b, roughness: 0.68, metalness: 0.02 }),
    humanApron: new THREE.MeshStandardMaterial({ color: 0x946a37, roughness: 0.78, metalness: 0.04 }),
    bamboo: new THREE.MeshStandardMaterial({
      map: bambooMaps.map,
      bumpMap: bambooMaps.bumpMap,
      bumpScale: 0.012,
      roughness: 0.86,
      metalness: 0.02,
      side: THREE.DoubleSide,
    }),
  };

  // Clone material per partId for independent Anatomy Focus highlighting & ghosting
  const partGroups = {};
  const partMaterials = {};
  const registerPart = (obj, partId) => {
    if (!partGroups[partId]) partGroups[partId] = [];
    if (!partMaterials[partId]) partMaterials[partId] = [];
    partGroups[partId].push(obj);
    obj.traverse((n) => {
      n.userData.partId = partId;
      if (n.isMesh) {
        n.castShadow = true;
        n.receiveShadow = true;
        if (!n.userData.ownMat) {
          const cloned = n.material.clone();
          cloned.userData.baseEmissive = cloned.emissive ? cloned.emissive.clone() : new THREE.Color(0);
          cloned.userData.baseOpacity = cloned.opacity ?? 1;
          cloned.userData.baseTransparent = !!cloned.transparent;
          n.material = cloned;
          n.userData.ownMat = true;
        }
        partMaterials[partId].push(n.material);
      }
    });
    return obj;
  };

  // =========================================================================
  // 01: BASE SKID & FEET
  // =========================================================================
  const PIVOT_Y = 1.54;
  const g01 = new THREE.Group();
  for (const zPos of [-1.05, 1.05]) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(2.38, 0.09, 0.11), matDefs.steelFrame);
    beam.position.set(0, 0.085, zPos);
    g01.add(beam);
  }
  for (const xPos of [-1.18, 1.18]) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 2.24), matDefs.steelFrame);
    beam.position.set(xPos, 0.085, 0);
    g01.add(beam);
    for (const zPos of [-1.05, 1.05]) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.04, 20), matDefs.epdm);
      pad.position.set(xPos, 0.02, zPos);
      g01.add(pad);
    }
  }
  scene.add(registerPart(g01, "01"));

  // =========================================================================
  // 02: TWIN A-FRAME TRUNNION STANCHIONS
  // =========================================================================
  const g02 = new THREE.Group();
  for (const side of [-1, 1]) {
    const xBase = side * 1.18;
    for (const zSign of [-1, 1]) {
      const p0 = new THREE.Vector3(xBase, 0.12, zSign * 0.85);
      const p1 = new THREE.Vector3(xBase, PIVOT_Y - 0.04, zSign * 0.06);
      const dir = p1.clone().sub(p0);
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.085, dir.length(), 0.085), matDefs.steelFrame);
      leg.position.copy(p0).addScaledVector(dir, 0.5);
      leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      g02.add(leg);
    }
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.05), matDefs.steelFrame);
    brace.position.set(xBase, 0.72, 0);
    g02.add(brace);
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.24), matDefs.darkIron);
    block.position.set(xBase, PIVOT_Y, 0);
    g02.add(block);
    const journal = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.22, 20), matDefs.tire);
    journal.rotation.z = Math.PI / 2;
    journal.position.set(xBase - side * 0.06, PIVOT_Y, 0);
    g02.add(journal);
  }
  scene.add(registerPart(g02, "02"));

  // =========================================================================
  // 03: TILTING U-CRADLE + INTERACTIVE WORM TILT HANDWHEEL
  // =========================================================================
  const cradlePivot = new THREE.Group();
  cradlePivot.position.set(0, PIVOT_Y, 0);
  scene.add(cradlePivot);

  const g03 = new THREE.Group();
  for (const side of [-1, 1]) {
    const sideBar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 1.88), matDefs.steelFrame);
    sideBar.position.set(side * 1.04, -0.32, 0.05);
    g03.add(sideBar);
    const armUp = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.38, 0.14), matDefs.steelFrame);
    armUp.position.set(side * 1.04, -0.13, 0);
    g03.add(armUp);
    const crossWeb = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, 0.14), matDefs.steelFrame);
    crossWeb.position.set(side * 1.07, 0, 0);
    g03.add(crossWeb);
  }
  for (const zPos of [-0.52, 0.42]) {
    const cross = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.10, 0.11), matDefs.steelFrame);
    cross.position.set(0, -0.96, zPos);
    g03.add(cross);
    for (const side of [-1, 1]) {
      const riser = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.66, 0.09), matDefs.steelFrame);
      riser.position.set(side * 1.04, -0.64, zPos);
      g03.add(riser);
    }
  }
  const rearBeam = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.10, 0.10), matDefs.steelFrame);
  rearBeam.position.set(0, 0, -0.94);
  g03.add(rearBeam);
  for (const side of [-1, 1]) {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.96), matDefs.steelFrame);
    tie.position.set(side * 1.04, -0.16, -0.46);
    g03.add(tie);
  }

  // Tilt Worm Quadrant & Brass Handwheel (+X stanchion)
  const tiltQuadrant = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.025, 10, 28, Math.PI * 0.75), matDefs.brass);
  tiltQuadrant.rotation.y = Math.PI / 2;
  tiltQuadrant.rotation.z = -Math.PI * 0.35;
  tiltQuadrant.position.set(1.13, 0, 0);
  g03.add(tiltQuadrant);

  const tiltHandwheel = new THREE.Group();
  tiltHandwheel.position.set(1.30, PIVOT_Y - 0.32, 0.14);
  const wheelRing = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.02, 12, 32), matDefs.brass);
  wheelRing.rotation.y = Math.PI / 2;
  tiltHandwheel.add(wheelRing);
  const wheelKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.09, 12), matDefs.clampRed);
  wheelKnob.rotation.z = Math.PI / 2;
  wheelKnob.position.set(0.05, 0.20, 0);
  tiltHandwheel.add(wheelKnob);
  for (let s = 0; s < 3; s++) {
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.40, 8), matDefs.steelFrame);
    spoke.rotation.x = (s * Math.PI) / 3;
    tiltHandwheel.add(spoke);
  }
  scene.add(registerPart(tiltHandwheel, "03"));
  cradlePivot.add(registerPart(g03, "03"));

  // =========================================================================
  // 04: 4 TRUNNION ROLLERS & REAR THRUST HUB
  // =========================================================================
  const DRUM_Z_OFF = 0.08;
  const R = MACHINE.drumRadiusM; // 0.895m
  const L = MACHINE.drumLengthM; // 1.79m
  const g04 = new THREE.Group();
  const rollerPos = [
    [-0.58, -0.78, -0.52 + DRUM_Z_OFF],
    [0.58, -0.78, -0.52 + DRUM_Z_OFF],
    [-0.58, -0.78, 0.42 + DRUM_Z_OFF],
    [0.58, -0.78, 0.42 + DRUM_Z_OFF],
  ];
  const rollerMeshes = [];
  for (const [rx, ry, rz] of rollerPos) {
    const brk = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.16), matDefs.darkIron);
    brk.position.set(rx, ry - 0.12, rz);
    g04.add(brk);
    const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.11, 24), matDefs.poly);
    roller.rotation.x = Math.PI / 2;
    roller.position.set(rx, ry, rz);
    g04.add(roller);
    rollerMeshes.push(roller);
  }
  const thrustHub = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.12, 24), matDefs.tire);
  thrustHub.rotation.x = Math.PI / 2;
  thrustHub.position.set(0, 0, -L / 2 + DRUM_Z_OFF - 0.06);
  g04.add(thrustHub);
  cradlePivot.add(registerPart(g04, "04"));

  // =========================================================================
  // DRUM ROTATING GROUP + WARM INTERIOR WORKLIGHT
  // =========================================================================
  const drumSpinGroup = new THREE.Group();
  drumSpinGroup.position.set(0, 0, DRUM_Z_OFF);
  cradlePivot.add(drumSpinGroup);

  const interiorLight = new THREE.PointLight(0xf2f6ff, 1.85, 3.8, 1.3);
  interiorLight.position.set(-0.25, 0.48, 0.25 + DRUM_Z_OFF);
  cradlePivot.add(interiorLight);

  // =========================================================================
  // 05: 179 x 179 cm BAGLOG STEAMER CYLINDER (with Cutaway window!)
  // =========================================================================
  const g05 = new THREE.Group();
  const shellFull = new THREE.Mesh(new THREE.CylinderGeometry(R, R, L, 96, 1, true), matDefs.steamer);
  shellFull.rotation.x = Math.PI / 2;
  g05.add(shellFull);

  // Stationary cutaway shell in cradlePivot so cutaway window ALWAYS faces camera while internals spin!
  const cutawayShellHolder = new THREE.Group();
  cutawayShellHolder.position.set(0, 0, DRUM_Z_OFF);

  const cutawaySolid = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R, L, 80, 1, true, Math.PI * 1.92, Math.PI * 0.80),
    matDefs.steamer
  );
  cutawaySolid.rotation.x = Math.PI / 2;
  cutawaySolid.visible = false;
  cutawayShellHolder.add(cutawaySolid);

  const cutawayGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R, L, 48, 1, true, Math.PI * 0.72, Math.PI * 1.20),
    matDefs.steamerCutaway
  );
  cutawayGlass.rotation.x = Math.PI / 2;
  cutawayGlass.visible = false;
  cutawayShellHolder.add(cutawayGlass);
  cradlePivot.add(registerPart(cutawayShellHolder, "05"));

  const bottomPlate = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.02, 96), matDefs.steamer);
  bottomPlate.rotation.x = Math.PI / 2;
  bottomPlate.position.z = -L / 2;
  g05.add(bottomPlate);

  const mouthFlange = new THREE.Mesh(new THREE.TorusGeometry(R + 0.015, 0.032, 18, 96), matDefs.tire);
  mouthFlange.position.z = L / 2;
  g05.add(mouthFlange);

  for (const zBand of [-0.52, 0.42]) {
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.028, R + 0.028, 0.09, 96, 1, true), matDefs.tire);
    tire.rotation.x = Math.PI / 2;
    tire.position.z = zBand;
    g05.add(tire);
    const tireRingA = new THREE.Mesh(new THREE.TorusGeometry(R + 0.014, 0.016, 12, 96), matDefs.tire);
    tireRingA.position.z = zBand - 0.045;
    g05.add(tireRingA);
    const tireRingB = tireRingA.clone();
    tireRingB.position.z = zBand + 0.045;
    g05.add(tireRingB);
  }
  for (const zRib of [-0.15, 0.16, 0.72]) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(R + 0.01, 0.012, 12, 96), matDefs.tire);
    rib.position.z = zRib;
    g05.add(rib);
  }
  // 16 perimeter flange hex bolts on mouth collar
  for (let b = 0; b < 16; b++) {
    const a = (b / 16) * Math.PI * 2;
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.035, 6), matDefs.brass);
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(Math.cos(a) * (R + 0.015), Math.sin(a) * (R + 0.015), L / 2 + 0.02);
    g05.add(bolt);
  }
  drumSpinGroup.add(registerPart(g05, "05"));

  // =========================================================================
  // 06: 4 HELICAL LIFTING FLIGHTS + 4 CROSS-DEFLECTORS
  // =========================================================================
  const g06 = new THREE.Group();
  for (let f = 0; f < 4; f++) {
    const baseAngle = (f * Math.PI) / 2;
    const segments = 22;
    const pitchTwist = (f % 2 === 0 ? 1 : -1) * 0.45;
    const geo = new THREE.BufferGeometry();
    const verts = [];
    const indices = [];
    for (let s = 0; s <= segments; s++) {
      const t = s / segments;
      const z = -L * 0.45 + t * L * 0.88;
      const ang = baseAngle + t * pitchTwist;
      const outerX = Math.cos(ang) * (R - 0.01);
      const outerY = Math.sin(ang) * (R - 0.01);
      const innerAng = ang + 0.16;
      const innerX = Math.cos(innerAng) * (R - 0.16);
      const innerY = Math.sin(innerAng) * (R - 0.16);
      verts.push(outerX, outerY, z, innerX, innerY, z);
    }
    for (let s = 0; s < segments; s++) {
      const a = s * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c, b, d, c);
    }
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    g06.add(new THREE.Mesh(geo, matDefs.flight));

    const midAng = baseAngle + Math.PI / 4;
    const vane = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.015, 0.34), matDefs.flight);
    vane.position.set(Math.cos(midAng) * (R - 0.06), Math.sin(midAng) * (R - 0.06), f % 2 === 0 ? -0.25 : 0.25);
    vane.rotation.z = midAng;
    vane.rotation.y = f % 2 === 0 ? 0.35 : -0.35;
    g06.add(vane);
  }
  drumSpinGroup.add(registerPart(g06, "06"));

  // =========================================================================
  // 09: 144T HOLLOW WELDED ROLLER-CHAIN RING & TWIN-BEARING 12T PINION
  // =========================================================================
  const g09Drum = new THREE.Group();
  const ringPitchR = 0.925;
  // Open cylindrical steel band welded outside the 179cm barrel (ZERO blocking inner disc!)
  const ringCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.018, R + 0.018, 0.056, 96, 1, true),
    matDefs.tire
  );
  ringCollar.rotation.x = Math.PI / 2;
  ringCollar.position.z = -0.15;
  g09Drum.add(ringCollar);
  for (const zs of [-0.025, 0.025]) {
    const flangeRim = new THREE.Mesh(new THREE.TorusGeometry(R + 0.016, 0.009, 10, 96), matDefs.tire);
    flangeRim.position.z = -0.15 + zs;
    g09Drum.add(flangeRim);
  }
  // 144 welded RS-60 roller-chain link pins & tooth barrels around exterior skin (100% hollow center!)
  const chainPinGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.038, 10);
  chainPinGeo.rotateX(Math.PI / 2);
  const ringChainLinks = new THREE.InstancedMesh(chainPinGeo, matDefs.brass, 144);
  const linkDummy = new THREE.Object3D();
  for (let t = 0; t < 144; t++) {
    const a = (t / 144) * Math.PI * 2;
    linkDummy.position.set(Math.cos(a) * ringPitchR, Math.sin(a) * ringPitchR, -0.15);
    linkDummy.rotation.set(0, 0, a);
    linkDummy.updateMatrix();
    ringChainLinks.setMatrixAt(t, linkDummy.matrix);
  }
  ringChainLinks.instanceMatrix.needsUpdate = true;
  g09Drum.add(ringChainLinks);
  drumSpinGroup.add(registerPart(g09Drum, "09"));

  // Outrigger Steel Mount Plate welded to Cradle left rail (-X) supporting Pinion + Gearbox + Motor
  const cradleDriveMount = new THREE.Group();
  const mountPlate = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.045, 0.72), matDefs.steelFrame);
  mountPlate.position.set(-1.06, -0.71, -0.28);
  cradleDriveMount.add(mountPlate);
  const mountGussetF = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.36, 0.08), matDefs.steelFrame);
  mountGussetF.position.set(-1.04, -0.51, 0.02);
  cradleDriveMount.add(mountGussetF);
  const mountGussetR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.36, 0.08), matDefs.steelFrame);
  mountGussetR.position.set(-1.04, -0.51, -0.52);
  cradleDriveMount.add(mountGussetR);
  cradlePivot.add(registerPart(cradleDriveMount, "03"));

  // 12T Pinion + Twin Bolted Pillow Blocks + 36T #50 Driven Sprocket on SAME Z-shaft
  const PINION_X = -0.857;
  const PINION_Y = -0.520;
  const Z_RING = -0.15 + DRUM_Z_OFF; // -0.07
  const Z_CHAIN = -0.28;
  const pinionGroup = new THREE.Group();
  pinionGroup.position.set(PINION_X, PINION_Y, 0);
  const pinion12T = makeGearMesh(12, ringPitchR / 12, 0.055, matDefs.brass, 0.024);
  pinion12T.position.z = Z_RING;
  pinionGroup.add(pinion12T);
  const pinionShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.42, 16), matDefs.tire);
  pinionShaft.rotation.x = Math.PI / 2;
  pinionShaft.position.z = -0.13;
  pinionGroup.add(pinionShaft);
  const pinionSprocket36 = makeGearMesh(30, 0.112, 0.022, matDefs.brass, 0.024);
  pinionSprocket36.position.z = Z_CHAIN;
  pinionGroup.add(pinionSprocket36);
  cradlePivot.add(registerPart(pinionGroup, "09"));

  // Twin Stationary Pillow-Block Bearings bolting Pinion Shaft down onto Mount Plate
  const pinionBearings = new THREE.Group();
  for (const zb of [0.03, -0.19]) {
    const ucp = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.21, 0.055), matDefs.darkIron);
    ucp.position.set(PINION_X, PINION_Y - 0.08, zb);
    pinionBearings.add(ucp);
  }
  cradlePivot.add(registerPart(pinionBearings, "09"));

  // =========================================================================
  // 07 & 08: 181 cm TUPPERWARE VAULT LID + ANIMATED 8 CLAMPS + WORKING SAMPLE CAP
  // =========================================================================
  const davitHinge = new THREE.Group();
  davitHinge.position.set(1.04, 0, L / 2 + DRUM_Z_OFF + 0.03);
  cradlePivot.add(davitHinge);

  const g07 = new THREE.Group();
  // Offset swing-davit arm arched above the center cap (y = +0.34m) so center Sample Cap opens unobstructed!
  const davitUpper = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.055, 0.055), matDefs.steelFrame);
  davitUpper.position.set(-0.46, 0.36, 0.09);
  g07.add(davitUpper);
  const davitRise = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.40, 0.055), matDefs.steelFrame);
  davitRise.position.set(0, 0.18, 0.09);
  g07.add(davitRise);
  const davitDrop = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.14, 0.055), matDefs.steelFrame);
  davitDrop.position.set(-0.90, 0.30, 0.08);
  g07.add(davitDrop);
  const hingePost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.48, 16), matDefs.tire);
  hingePost.position.set(0, 0.05, -0.10);
  g07.add(hingePost);

  // Gas-strut damper cylinder bridging hinge post to arm
  const gasStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.022, 0.52, 12), matDefs.brass);
  gasStrut.rotation.z = 1.05;
  gasStrut.position.set(-0.24, -0.15, 0.04);
  g07.add(gasStrut);

  const lidCenter = new THREE.Group();
  lidCenter.position.set(-1.04, 0, 0);

  // Outer EPDM Tupperware U-channel lip gasket
  const lidSkirt = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.025, R + 0.025, 0.05, 64, 1, true), matDefs.epdm);
  lidSkirt.rotation.x = Math.PI / 2;
  lidSkirt.position.z = -0.02;
  lidCenter.add(lidSkirt);

  // Annular outer door ring (Ring with 15cm radius hollow center for the Sample Inspection Cap!)
  const doorShape = new THREE.Shape();
  doorShape.absarc(0, 0, R + 0.022, 0, Math.PI * 2, false);
  const centerPort = new THREE.Path();
  centerPort.absarc(0, 0, 0.145, 0, Math.PI * 2, true);
  doorShape.holes.push(centerPort);
  const lidPlate = new THREE.Mesh(
    new THREE.ExtrudeGeometry(doorShape, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, curveSegments: 48 }),
    matDefs.steamer
  );
  lidPlate.position.z = 0.0;
  lidCenter.add(lidPlate);

  // Raised frustum stiffener cone (open center)
  const lidCone = new THREE.Mesh(new THREE.CylinderGeometry(0.18, R * 0.90, 0.055, 56, 1, true), matDefs.steamer);
  lidCone.rotation.x = Math.PI / 2;
  lidCone.position.z = 0.048;
  lidCenter.add(lidCone);

  // Radial ribs (outside center port)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.028, R * 0.68, 0.025), matDefs.tire);
    rib.position.set(Math.cos(a) * 0.54, Math.sin(a) * 0.54, 0.045);
    rib.rotation.z = a + Math.PI / 2;
    lidCenter.add(rib);
  }

  // 8 Animated Over-Center Toggle Clamps around rim
  const clampArms = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const clampBase = new THREE.Group();
    clampBase.position.set(Math.cos(a) * (R + 0.032), Math.sin(a) * (R + 0.032), -0.01);
    clampBase.rotation.z = a;
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.045), matDefs.darkIron);
    clampBase.add(bracket);
    const armPivot = new THREE.Group();
    armPivot.position.set(0.015, 0, 0.02);
    const lever = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.026, 0.085), matDefs.clampRed);
    lever.position.set(0.015, 0, -0.025);
    armPivot.add(lever);
    clampBase.add(armPivot);
    clampArms.push(armPivot);
    lidCenter.add(clampBase);
  }
  g07.add(lidCenter);
  davitHinge.add(registerPart(g07, "07"));

  // 08: Working Center Twist-Lock Sample Inspection Cap (mounted on door center!)
  const capHinge = new THREE.Group();
  capHinge.position.set(0.16, 0, 0.065);
  lidCenter.add(capHinge);

  const g08Cap = new THREE.Group();
  const capBody = new THREE.Group();
  capBody.position.set(-0.16, 0, 0);
  const capSeal = new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.016, 10, 32), matDefs.epdm);
  capBody.add(capSeal);
  const capDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.165, 0.032, 32), matDefs.brass);
  capDisc.rotation.x = Math.PI / 2;
  capDisc.position.z = 0.016;
  capBody.add(capDisc);
  const capHandle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.032, 0.035), matDefs.clampRed);
  capHandle.position.z = 0.042;
  capBody.add(capHandle);
  g08Cap.add(capBody);
  capHinge.add(registerPart(g08Cap, "08"));

  // =========================================================================
  // 10 & 11: CONNECTED COMPOUND GEARBOX, #50 CHAIN, 90° BEVEL CRANK & PEDAL
  // =========================================================================
  const GB_X = -1.18;
  const GB_Y = -0.56;
  const GB_Z = -0.28;

  const g10 = new THREE.Group();
  g10.position.set(GB_X, GB_Y, GB_Z);
  // Main gearbox housing bolted onto cradle mount plate
  const gbHousing = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.28), matDefs.darkIron);
  g10.add(gbHousing);
  const gbFoot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.32), matDefs.steelFrame);
  gbFoot.position.set(0, -0.13, 0);
  g10.add(gbFoot);
  // 90° Miter Bevel Housing bolted flush to left (-X) side of Gearbox for Hand Crank & Pedal Input
  const bevelBox = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, 0.16), matDefs.darkIron);
  bevelBox.position.set(-0.14, 0.0, 0.08);
  g10.add(bevelBox);
  const bevelSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.10, 14), matDefs.tire);
  bevelSleeve.rotation.z = Math.PI / 2;
  bevelSleeve.position.set(-0.22, 0.0, 0.08);
  g10.add(bevelSleeve);

  // Slotted Clutch Selector Gate + Lever
  const clutchLever = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.24, 12), matDefs.tire);
  clutchLever.position.set(0, 0.22, 0.04);
  g10.add(clutchLever);
  const clutchKnob = new THREE.Mesh(new THREE.SphereGeometry(0.034, 16, 12), matDefs.clampRed);
  clutchKnob.position.set(0, 0.33, 0.04);
  g10.add(clutchKnob);

  // Coaxial Output Sprocket (18T) in front of Z-box aligned directly to Z_CHAIN!
  const gbOutShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.18, 14), matDefs.tire);
  gbOutShaft.rotation.x = Math.PI / 2;
  gbOutShaft.position.set(0, 0, -0.05);
  g10.add(gbOutShaft);
  const interGear = makeGearMesh(18, 0.068, 0.024, matDefs.brass, 0.022);
  g10.add(interGear);

  // Bolted Flexible Shaft Coupling bridging rear of Gearbox directly into Motor/Engine input!
  const couplingHub = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.16, 16), matDefs.tire);
  couplingHub.rotation.x = Math.PI / 2;
  couplingHub.position.set(0, 0, -0.19);
  g10.add(couplingHub);

  // Pedal Input Sprocket coaxial on bevel cross-shaft
  const bevelPedalSprocket = makeGearMesh(18, 0.065, 0.018, matDefs.brass, 0.022);
  bevelPedalSprocket.rotation.y = Math.PI / 2;
  bevelPedalSprocket.position.set(-0.25, 0.0, 0.08);
  g10.add(bevelPedalSprocket);
  cradlePivot.add(registerPart(g10, "10"));

  // Visible Animated #50 Roller Chain connecting Gearbox (GB_X, GB_Y) -> Pinion Jackshaft (PINION_X, PINION_Y)!
  const chainLoop50 = makeChainDriveLoop(
    [GB_X, GB_Y],
    0.068,
    [PINION_X, PINION_Y],
    0.112,
    Z_CHAIN,
    matDefs.darkIron,
    matDefs.brass
  );
  cradlePivot.add(registerPart(chainLoop50.group, "10"));

  // 3 HP Electric + WPWDX Worm Reducer / GX160 Engine mounted inline right behind Gearbox coupling
  const g11 = new THREE.Group();
  g11.position.set(GB_X, GB_Y, -0.58);
  const motorUnit = new THREE.Group();
  const wormHousing = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.22, 0.16), matDefs.darkIron);
  wormHousing.position.set(0, 0, 0.10);
  motorUnit.add(wormHousing);
  const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.28, 24), matDefs.motor);
  motorBody.rotation.x = Math.PI / 2;
  motorBody.position.set(0, 0.02, -0.12);
  motorUnit.add(motorBody);
  for (let f = 0; f < 10; f++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.011, 0.22), matDefs.motor);
    fin.rotation.z = (f / 10) * Math.PI;
    fin.position.set(0, 0.02, -0.12);
    motorUnit.add(fin);
  }
  g11.add(motorUnit);

  const petrolUnit = new THREE.Group();
  petrolUnit.add(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.28), matDefs.darkIron));
  const tankMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.11, 0.22), matDefs.clampRed);
  tankMesh.position.set(0, 0.16, 0);
  petrolUnit.add(tankMesh);
  const shroudMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.07, 18), matDefs.clampRed);
  shroudMesh.rotation.z = Math.PI / 2;
  shroudMesh.position.set(-0.15, -0.02, 0);
  petrolUnit.add(shroudMesh);
  petrolUnit.visible = false;
  g11.add(petrolUnit);

  // Hand Crank mounted directly onto the 90° bevel sleeve output shaft!
  const crankPivot = new THREE.Group();
  crankPivot.position.set(GB_X - 0.26, GB_Y, GB_Z + 0.08);
  const crankBoss = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.09, 16), matDefs.tire);
  crankBoss.rotation.z = Math.PI / 2;
  crankPivot.add(crankBoss);
  const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.38, 0.045), matDefs.brass);
  crankArm.position.set(-0.045, MACHINE.crankRadiusM / 2, 0);
  crankPivot.add(crankArm);
  const crankHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.16, 16), matDefs.humanApron);
  crankHandle.rotation.z = Math.PI / 2;
  crankHandle.position.set(-0.125, MACHINE.crankRadiusM, 0);
  crankPivot.add(crankHandle);

  const crankTwin = new THREE.Group();
  const arm2 = crankArm.clone();
  arm2.position.y = -MACHINE.crankRadiusM / 2;
  crankTwin.add(arm2);
  const handle2 = crankHandle.clone();
  handle2.position.y = -MACHINE.crankRadiusM;
  crankTwin.add(handle2);
  crankTwin.visible = false;
  crankPivot.add(crankTwin);

  // Seated Bicycle Pedal Frame anchored to floor + vertical cycling plane + live taut drive chain!
  const pedalModule = new THREE.Group();
  pedalModule.position.set(-1.62, 0, -0.18);
  const seatPost = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.86, 12), matDefs.steelFrame);
  seatPost.position.set(-0.28, 0.43, 0);
  seatPost.rotation.z = -0.16;
  pedalModule.add(seatPost);
  const baseBar = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.24), matDefs.steelFrame);
  baseBar.position.set(-0.08, 0.025, 0);
  pedalModule.add(baseBar);
  const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.24), matDefs.epdm);
  seatBase.position.set(-0.36, 0.86, 0);
  pedalModule.add(seatBase);
  const bbStrut = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.54, 0.045), matDefs.steelFrame);
  bbStrut.position.set(0.06, 0.28, 0);
  bbStrut.rotation.z = -0.18;
  pedalModule.add(bbStrut);

  const pedalBB = new THREE.Group();
  pedalBB.position.set(0.08, 0.52, 0);
  const pedalWheel = makeGearMesh(24, 0.11, 0.02, matDefs.brass, 0.022);
  pedalWheel.position.z = -0.02;
  pedalBB.add(pedalWheel);
  for (const s of [-1, 1]) {
    const pArm = new THREE.Mesh(new THREE.BoxGeometry(0.175, 0.024, 0.018), matDefs.tire);
    pArm.position.set(s * 0.0875, 0, s * 0.085);
    pedalBB.add(pArm);
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.022, 0.08), matDefs.epdm);
    pad.position.set(s * 0.17, 0, s * 0.115);
    pedalBB.add(pad);
  }
  pedalModule.add(pedalBB);

  // Two taut upper/lower bicycle chain spans updated dynamically to gearbox bevel sprocket!
  const pedalChainTop = new THREE.Mesh(new THREE.BoxGeometry(1, 0.012, 0.016), matDefs.darkIron);
  const pedalChainBot = new THREE.Mesh(new THREE.BoxGeometry(1, 0.012, 0.016), matDefs.darkIron);
  pedalModule.add(pedalChainTop, pedalChainBot);
  pedalModule.visible = false;

  cradlePivot.add(registerPart(g11, "11"));
  cradlePivot.add(registerPart(crankPivot, "11"));
  scene.add(registerPart(pedalModule, "11"));

  // =========================================================================
  // 171 cm HUMAN SCALE FIGURE (ALDI) — STANDING, CRANKING OR PEDALING
  // =========================================================================
  const humanGroup = new THREE.Group();
  humanGroup.position.set(-1.70, 0, 0.14);
  const addHumanLimb = (parent, rTop, rBot, len, mat, yOffset = -len / 2) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, len, 14), mat);
    m.position.y = yOffset;
    parent.add(m);
    return m;
  };
  const legs = [];
  for (const zSide of [-0.11, 0.11]) {
    const hipPivot = new THREE.Group();
    hipPivot.position.set(0, 0.88, zSide);
    humanGroup.add(hipPivot);
    const thigh = addHumanLimb(hipPivot, 0.068, 0.056, 0.42, matDefs.humanBody);
    const kneePivot = new THREE.Group();
    kneePivot.position.set(0, -0.42, 0);
    hipPivot.add(kneePivot);
    addHumanLimb(kneePivot, 0.054, 0.046, 0.42, matDefs.humanBody);
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.10), matDefs.epdm);
    boot.position.set(0.04, -0.44, 0);
    kneePivot.add(boot);
    legs.push({ hipPivot, kneePivot, thigh });
  }

  const torsoPivot = new THREE.Group();
  torsoPivot.position.set(0, 0.90, 0);
  humanGroup.add(torsoPivot);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.135, 0.50, 14), matDefs.humanBody);
  torso.scale.set(0.75, 1, 1.22);
  torso.position.set(0, 0.25, 0);
  torsoPivot.add(torso);
  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.165, 14, 12), matDefs.humanBody);
  shoulders.scale.set(0.72, 0.42, 1.45);
  shoulders.position.set(0, 0.46, 0);
  torsoPivot.add(shoulders);
  const apron = new THREE.Mesh(
    new THREE.CylinderGeometry(0.165, 0.145, 0.40, 14, 1, false, -Math.PI * 0.45, Math.PI * 0.9),
    matDefs.humanApron
  );
  apron.scale.set(0.78, 1, 1.18);
  apron.rotation.y = Math.PI / 2;
  apron.position.set(0.015, 0.19, 0);
  torsoPivot.add(apron);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.07, 12), matDefs.humanSkin);
  neck.position.set(0, 0.555, 0);
  torsoPivot.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 18, 16), matDefs.humanSkin);
  head.scale.set(0.95, 1.12, 0.9);
  head.position.set(0, 0.692, 0);
  torsoPivot.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.108, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), matDefs.epdm);
  hair.position.set(-0.005, 0.70, 0);
  torsoPivot.add(hair);

  const rShoulder = new THREE.Group();
  rShoulder.position.set(0, 0.48, 0.23);
  torsoPivot.add(rShoulder);
  addHumanLimb(rShoulder, 0.048, 0.042, 0.28, matDefs.humanBody);
  const rElbow = new THREE.Group();
  rElbow.position.set(0, -0.28, 0);
  rShoulder.add(rElbow);
  addHumanLimb(rElbow, 0.04, 0.032, 0.26, matDefs.humanSkin);

  const lShoulder = new THREE.Group();
  lShoulder.position.set(0, 0.48, -0.23);
  torsoPivot.add(lShoulder);
  addHumanLimb(lShoulder, 0.048, 0.042, 0.28, matDefs.humanBody);
  const lElbow = new THREE.Group();
  lElbow.position.set(0, -0.28, 0);
  lShoulder.add(lElbow);
  addHumanLimb(lElbow, 0.04, 0.032, 0.26, matDefs.humanSkin);

  scene.add(registerPart(humanGroup, "human"));

  // Height Comparison Ruler (171 cm Human vs 179 cm Drum)
  const rulerGroup = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.71, 10), new THREE.MeshBasicMaterial({ color: 0x42c88a }));
  pole.position.set(-2.02, 0.855, 0.14);
  rulerGroup.add(pole);
  const capBar = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.012, 0.012), new THREE.MeshBasicMaterial({ color: 0x42c88a }));
  capBar.position.set(-1.84, 1.71, 0.14);
  rulerGroup.add(capBar);
  const humanBadge = makeScaleRulerSprite("ALDI: 171 cm", "#42c88a");
  humanBadge.position.set(-1.42, 1.94, 0.14);
  rulerGroup.add(humanBadge);
  const drumBadge = makeScaleRulerSprite("STEAMER: 179×179 cm", "#d99b38");
  drumBadge.position.set(0.35, 2.38, 0.08);
  rulerGroup.add(drumBadge);
  scene.add(rulerGroup);

  // =========================================================================
  // WOVEN BAMBOO KERANJANG + RISING BLENDED TOBACCO PILE INSIDE BASKET
  // =========================================================================
  const keranjang = new THREE.Group();
  keranjang.position.set(0, 0, 1.54);
  const basketWall = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.30, 0.42, 24, 1, true), matDefs.bamboo);
  basketWall.position.y = 0.21;
  keranjang.add(basketWall);
  const basketBase = new THREE.Mesh(new THREE.CircleGeometry(0.30, 24), matDefs.bamboo);
  basketBase.rotation.x = -Math.PI / 2;
  basketBase.position.y = 0.01;
  keranjang.add(basketBase);
  const basketRim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.018, 8, 28), matDefs.bamboo);
  basketRim.rotation.x = Math.PI / 2;
  basketRim.position.y = 0.42;
  keranjang.add(basketRim);

  const tobTexObj = createTobaccoBedTexture(maxAniso);
  const basketPileMat = new THREE.MeshStandardMaterial({
    map: tobTexObj.tex,
    bumpMap: tobTexObj.bumpTex,
    bumpScale: 0.018,
    roughness: 0.94,
    metalness: 0.01,
  });
  const basketPile = new THREE.Mesh(new THREE.ConeGeometry(0.37, 0.32, 32), basketPileMat);
  basketPile.position.y = 0.15;
  basketPile.scale.set(1, 0.02, 1);
  basketPile.visible = false;
  keranjang.add(basketPile);
  scene.add(keranjang);

  // =========================================================================
  // DUAL-LAYER REALISTIC RAJANGAN TOBACCO INSIDE DRUM:
  // 1) Cohesive Sloped Bulk Bed Mesh (Tri-planar UV, 1536x1536 fiber + bump)
  // 2) 2,200 Cascading Shredded Tobacco Strands
  // =========================================================================
  const tobaccoHolder = new THREE.Group();
  tobaccoHolder.position.set(0, 0, DRUM_Z_OFF);
  cradlePivot.add(tobaccoHolder);

  // Curved-top circular-segment bulk bed strictly bounded inside r = R - 0.065
  function buildBedGeo(fillFrac) {
    const rb = R - 0.065;
    const halfSpan = Math.max(0.45, Math.min(Math.PI * 0.48, 0.52 + fillFrac * 1.72));
    const startA = -Math.PI / 2 - halfSpan;
    const endA = -Math.PI / 2 + halfSpan;
    const shape = new THREE.Shape();
    const steps = 36;
    for (let i = 0; i <= steps; i++) {
      const a = startA + (i / steps) * (endA - startA);
      const px = Math.cos(a) * rb;
      const py = Math.sin(a) * rb;
      if (i === 0) shape.moveTo(px, py);
      else shape.lineTo(px, py);
    }
    const xEnd = Math.cos(endA) * rb;
    const yTop = Math.sin(endA) * rb;
    const xStart = Math.cos(startA) * rb;
    for (let j = 1; j < 10; j++) {
      const f = j / 10;
      const px = xEnd + (xStart - xEnd) * f;
      const py = yTop + 0.042 * Math.sin(Math.PI * f);
      shape.lineTo(px, py);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: L * 0.80, bevelEnabled: false, curveSegments: 1 });
    geo.translate(0, 0, -L * 0.40);
    geo.computeVertexNormals();
    const pos = geo.attributes.position;
    const norm = geo.attributes.normal;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      const nz = Math.abs(norm.getZ(i));
      if (nz > 0.6) {
        uvs[i * 2] = (pos.getX(i) + rb) / (2 * rb);
        uvs[i * 2 + 1] = (pos.getY(i) + rb) / (2 * rb);
      } else {
        uvs[i * 2] = (pos.getZ(i) + L * 0.40) / (L * 0.80);
        uvs[i * 2 + 1] = (pos.getX(i) + rb) / (2 * rb);
      }
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    return geo;
  }

  let currentBedBucket = -1;
  const bedMat = new THREE.MeshStandardMaterial({
    map: tobTexObj.tex,
    bumpMap: tobTexObj.bumpTex,
    bumpScale: 0.022,
    roughness: 0.94,
    metalness: 0.01,
    side: THREE.DoubleSide,
  });
  const bulkBedMesh = new THREE.Mesh(buildBedGeo(0.22), bedMat);
  bulkBedMesh.receiveShadow = true;
  tobaccoHolder.add(bulkBedMesh);

  const PARTICLE_COUNT = 2600;
  // Shredded tembakau rajangan cluster + ribbon geometry
  const strandGeo = new THREE.BoxGeometry(0.056, 0.0085, 0.016);
  const strandMat = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0.01 });
  const strandMesh = new THREE.InstancedMesh(strandGeo, strandMat, PARTICLE_COUNT);
  strandMesh.receiveShadow = true;
  tobaccoHolder.add(strandMesh);

  const pPos = new Float32Array(PARTICLE_COUNT * 3);
  const pVel = new Float32Array(PARTICLE_COUNT * 3);
  const pType = new Uint8Array(PARTICLE_COUNT);
  const pRot = new Float32Array(PARTICLE_COUNT * 2);
  const pScale = new Float32Array(PARTICLE_COUNT);
  const pState = new Uint8Array(PARTICLE_COUNT); // 0 inside drum, 1 poured into keranjang
  const dummy = new THREE.Object3D();

  function resetTobaccoBatch(batchKg = 150) {
    const fillFrac = Math.min(0.65, Math.max(0.08, batchKg / 720));
    const maxAngle = 0.85 + fillFrac * 1.45;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const variety = i < PARTICLE_COUNT / 3 ? 0 : i < (PARTICLE_COUNT * 2) / 3 ? 1 : 2;
      pType[i] = variety;
      strandMesh.setColorAt(i, TOBACCO_COLORS[variety]);

      const theta = -Math.PI / 2 + (hash01(i * 9 + 1) - 0.42) * maxAngle;
      const radFrac = i % 4 === 0 ? 0.86 + 0.10 * hash01(i * 9 + 2) : 0.70 + 0.24 * hash01(i * 9 + 2);
      const r = R * radFrac;
      const zBand =
        variety === 0
          ? -L * 0.35 + hash01(i * 9 + 3) * (L * 0.25)
          : variety === 1
          ? -L * 0.08 + hash01(i * 9 + 3) * (L * 0.24)
          : L * 0.16 + hash01(i * 9 + 3) * (L * 0.26);

      pPos[i * 3] = Math.cos(theta) * r;
      pPos[i * 3 + 1] = Math.sin(theta) * r;
      pPos[i * 3 + 2] = zBand;
      pVel[i * 3] = pVel[i * 3 + 1] = pVel[i * 3 + 2] = 0;
      pRot[i * 2] = hash01(i * 9 + 4) * Math.PI * 2;
      pRot[i * 2 + 1] = hash01(i * 9 + 5) * Math.PI * 2;
      pScale[i] = 0.7 + hash01(i * 9 + 6) * 0.6;
      pState[i] = 0;
    }
    if (strandMesh.instanceColor) strandMesh.instanceColor.needsUpdate = true;
    state.pouredCount = 0;
    state.mixPct = 14;
    tobTexObj.update(0.12);
    basketPile.visible = false;
  }

  function computeMixingUniformity() {
    const bins = new Int16Array(24 * 3);
    const activeMax = state.activeCount;
    for (let i = 0; i < activeMax; i++) {
      if (pState[i] !== 0) continue;
      const x = pPos[i * 3];
      const y = pPos[i * 3 + 1];
      const z = pPos[i * 3 + 2];
      const bx = x < -0.25 ? 0 : x > 0.25 ? 2 : 1;
      const by = y < -0.42 ? 0 : 1;
      const bz = Math.max(0, Math.min(3, Math.floor(((z + L / 2) / L) * 4)));
      bins[(bz * 6 + by * 3 + bx) * 3 + pType[i]]++;
    }
    let scoreSum = 0;
    let activeBins = 0;
    for (let b = 0; b < 24; b++) {
      const c0 = bins[b * 3];
      const c1 = bins[b * 3 + 1];
      const c2 = bins[b * 3 + 2];
      const tot = c0 + c1 + c2;
      if (tot < 8) continue;
      activeBins++;
      const dev = Math.abs(c0 / tot - 1 / 3) + Math.abs(c1 / tot - 1 / 3) + Math.abs(c2 / tot - 1 / 3);
      scoreSum += Math.max(0, 1 - dev / 1.15);
    }
    return activeBins === 0 ? 0 : Math.min(99, Math.round((scoreSum / activeBins) * 100));
  }

  // =========================================================================
  // STATE, EXPLODE & ANATOMY HIGHLIGHTING
  // =========================================================================
  const state = {
    driveId: "engine-electric",
    gearId: "12:1",
    drumRpm: 10.6,
    gearRatio: 12,
    tiltDeg: 25,
    batchKg: 150,
    activeCount: Math.round(PARTICLE_COUNT * (150 / 380)),
    explode: 0,
    cutaway: true,
    lidOpen: false,
    sampleCapOpen: false,
    showRuler: true,
    running: true,
    drumAngle: 0,
    crankAngle: 0,
    lidAngle: 0,
    clampOpenFrac: 0,
    capOpenFrac: 0,
    mixPct: 14,
    pouredCount: 0,
    frameCounter: 0,
    stalled: false,
    hoveredPart: null,
    selectedPart: null,
    pressPulse: 0,
    anatomyIsolate: false,
  };

  resetTobaccoBatch(state.batchKg);

  function setCutaway(enabled) {
    state.cutaway = enabled;
    shellFull.visible = !enabled;
    cutawaySolid.visible = enabled;
    cutawayGlass.visible = enabled;
    interiorLight.intensity = enabled ? 1.85 : 0.7;
  }
  setCutaway(true);

  function setExplode(val) {
    state.explode = Math.max(0, Math.min(1, val));
    const e = state.explode;
    g01.position.y = -e * 0.16;
    g02.position.y = -e * 0.05;
    g04.position.y = -e * 0.25;
    g06.position.z = e * 0.92;
    davitHinge.position.z = L / 2 + DRUM_Z_OFF + 0.03 + e * 1.15;
    g09Drum.position.z = -e * 0.42;
    pinionGroup.position.x = PINION_X - e * 0.35;
    pinionBearings.position.x = -e * 0.35;
    chainLoop50.group.position.x = -e * 0.46;
    g10.position.x = GB_X - e * 0.52;
    g11.position.x = GB_X - e * 0.72;
    crankPivot.position.x = GB_X - 0.26 - e * 0.78;
    capHinge.position.z = 0.065 + e * 0.45;
  }

  function updatePartFocusVisuals() {
    const sel = state.selectedPart;
    const hov = state.hoveredPart;
    const isolate = state.anatomyIsolate && !!sel;
    const flash = state.pressPulse;
    for (const [pid, mats] of Object.entries(partMaterials)) {
      const isSelected = sel === pid;
      const isHovered = hov === pid;
      for (const m of mats) {
        if (isSelected) {
          m.emissive?.setHex(flash > 0.1 ? 0xd99b38 : 0x8f5b12);
          m.emissiveIntensity = 1.0 + flash * 0.85;
          m.opacity = m.userData.baseOpacity;
          m.transparent = m.userData.baseTransparent;
        } else if (isHovered) {
          m.emissive?.setHex(0x6e4710);
          m.emissiveIntensity = 1.15;
          m.opacity = m.userData.baseOpacity;
          m.transparent = m.userData.baseTransparent;
        } else if (isolate) {
          m.emissive?.setHex(0x000000);
          m.emissiveIntensity = 1.0;
          m.transparent = true;
          m.opacity = Math.min(m.userData.baseOpacity, 0.22);
        } else {
          m.emissive?.setHex(0x000000);
          m.emissiveIntensity = 1.0;
          m.opacity = m.userData.baseOpacity;
          m.transparent = m.userData.baseTransparent;
        }
        m.needsUpdate = true;
      }
    }
  }

  function focusPart(partId, { glideCamera = true, isolate = true } = {}) {
    state.selectedPart = partId;
    state.pressPulse = 1.0;
    state.anatomyIsolate = isolate;
    updatePartFocusVisuals();
    const info = PIECE_INFO[partId];
    if (glideCamera && info?.cam) {
      // Snap cradle tilt & closed lid to target pose before Box3 so camera frames exact destination immediately
      cradlePivot.rotation.x = -(state.tiltDeg * Math.PI) / 180;
      if (!state.lidOpen && state.lidAngle > 0.05) {
        state.lidAngle = 0;
        state.clampOpenFrac = 0;
        davitHinge.rotation.y = 0;
      }
      // Measure true live world center of the focused piece (handles tilt & explode automatically!)
      const groups = partGroups[partId] || [];
      if (groups.length) {
        scene.updateMatrixWorld(true);
        const box = new THREE.Box3();
        for (const g of groups) box.expandByObject(g);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const offset = new THREE.Vector3(...info.cam.pos).sub(new THREE.Vector3(...info.cam.target));
        camAnim.goalTarget.copy(center);
        camAnim.goalPos.copy(center).add(offset);
      } else {
        camAnim.goalPos.set(...info.cam.pos);
        camAnim.goalTarget.set(...info.cam.target);
      }
      camAnim.active = true;
    }
    if (onPartSelect) onPartSelect(partId, info);
  }

  function clearPartFocus() {
    state.selectedPart = null;
    state.anatomyIsolate = false;
    updatePartFocusVisuals();
  }

  function applyState(next) {
    Object.assign(state, next);
    state.activeCount = Math.max(260, Math.min(PARTICLE_COUNT, Math.round(PARTICLE_COUNT * (state.batchKg / 360))));
    if (next.cutaway !== undefined) setCutaway(next.cutaway);
    if (next.explode !== undefined) setExplode(next.explode);
    if (next.showRuler !== undefined) rulerGroup.visible = !!next.showRuler;

    const isPetrol = state.driveId === "engine-petrol";
    const isHuman = state.driveId.startsWith("human");
    const isPedal = state.driveId === "human-pedal";
    motorUnit.visible = !isPetrol;
    petrolUnit.visible = isPetrol;
    crankTwin.visible = state.driveId === "human-2";
    pedalModule.visible = isPedal;

    // Shift selector dog-clutch lever visibly between 3 positions!
    const leverAngle = isHuman ? (state.gearId === "72:1" ? -0.38 : -0.18) : 0.34;
    clutchLever.rotation.z = leverAngle;
    clutchKnob.position.x = -Math.sin(leverAngle) * 0.24;
  }

  function setCameraPreset(preset) {
    const presets = {
      overview: { pos: [-3.95, 2.52, 4.45], target: [-0.22, 1.42, 0.12] },
      cutaway: { pos: [-2.85, 2.58, -0.25], target: [0.0, 1.32, 0.10] },
      gearbox: { pos: [-2.45, 1.32, 1.95], target: [-1.05, 1.05, -0.05] },
      lid: { pos: [1.75, 2.15, 3.35], target: [0.10, 1.65, 1.05] },
      unload: { pos: [-2.25, 1.35, 3.05], target: [0.0, 0.65, 1.18] },
    };
    const p = presets[preset] || presets.overview;
    camAnim.goalPos.set(...p.pos);
    camAnim.goalTarget.set(...p.target);
    camAnim.active = true;
    if (preset === "cutaway" && !state.cutaway) setCutaway(true);
  }

  // Direct 3D clicking + hover cursor feedback
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downPos = null;

  function isAncestryVisible(obj) {
    for (let cur = obj; cur; cur = cur.parent) {
      if (!cur.visible) return false;
    }
    return true;
  }

  function pickPart(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pointer.x = (x / rect.width) * 2 - 1;
    pointer.y = -(y / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    const hit = hits.find((h) => h.object?.userData?.partId && isAncestryVisible(h.object));
    return { id: hit ? hit.object.userData.partId : null, x, y };
  }

  renderer.domElement.addEventListener("pointermove", (e) => {
    const { id: nextHover, x, y } = pickPart(e);
    renderer.domElement.style.cursor = nextHover ? "pointer" : "grab";
    if (nextHover !== state.hoveredPart) {
      state.hoveredPart = nextHover;
      updatePartFocusVisuals();
    }
    if (onPartHover) {
      onPartHover(nextHover ? { id: nextHover, info: PIECE_INFO[nextHover], x, y } : null);
    }
  });

  renderer.domElement.addEventListener("pointerleave", () => {
    if (state.hoveredPart !== null) {
      state.hoveredPart = null;
      updatePartFocusVisuals();
    }
    if (onPartHover) onPartHover(null);
  });

  renderer.domElement.addEventListener("pointerdown", (e) => {
    downPos = [e.clientX, e.clientY];
  });
  renderer.domElement.addEventListener("pointerup", (e) => {
    if (!downPos) return;
    const dist = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
    downPos = null;
    if (dist > 6) return;
    const { id } = pickPart(e);
    if (id) {
      focusPart(id, { glideCamera: false, isolate: state.anatomyIsolate });
      if (onPartAction) onPartAction(id);
    }
  });

  const tmpBasketW = new THREE.Vector3();
  const tmpBevelW = new THREE.Vector3();

  function stepTobaccoParticles(dt, omegaDrum, tiltRad) {
    const sinT = Math.sin(tiltRad);
    const cosT = Math.cos(tiltRad);
    const gravY = -9.81 * cosT;
    const gravZ = -9.81 * sinT;
    const effR = R - 0.05;
    const fillLimit = 0.08 + Math.min(0.55, state.batchKg / 720);
    const activeCutoffY = -effR + fillLimit * 1.8 * effR;
    const isPouring = state.lidOpen && state.tiltDeg < -4;

    // Update circular-segment core bed slightly recessed so loose 3D strands stay visible above it!
    const pourRatio = Math.min(1, state.pouredCount / Math.max(1, state.activeCount * 0.72));
    const effectiveFill = Math.max(0.03, Math.min(0.46, (state.batchKg / 880) * (1 - pourRatio * 0.92)));
    const bedBucket = Math.round(effectiveFill * 40);
    if (bedBucket !== currentBedBucket) {
      currentBedBucket = bedBucket;
      bulkBedMesh.geometry.dispose();
      bulkBedMesh.geometry = buildBedGeo(effectiveFill);
    }
    bulkBedMesh.visible = pourRatio < 0.94;
    const targetSlopeZ = Math.sign(omegaDrum || 1) * Math.min(0.58, Math.abs(omegaDrum) * 0.46);
    bulkBedMesh.rotation.z += (targetSlopeZ - bulkBedMesh.rotation.z) * Math.min(1, dt * 4);
    const targetBedZ = Math.max(-0.08, Math.min(0.14, -sinT * 0.16 + (isPouring ? 0.12 : 0)));
    bulkBedMesh.position.z += (targetBedZ - bulkBedMesh.position.z) * Math.min(1, dt * 2.5);
    tobTexObj.update(Math.min(1, (state.mixPct - 10) / 86));
    const bedCoreTopY = -effR + effectiveFill * 1.45 * effR;

    // Transform woven basket center into tobaccoHolder coordinates for realistic dump trajectories
    tmpBasketW.set(0, 0.24, 1.54);
    tobaccoHolder.worldToLocal(tmpBasketW);
    const floorBasketY = tmpBasketW.y - 0.10;

    let pouredNow = 0;
    const activeMax = state.activeCount;
    const spinSign = Math.sign(omegaDrum || 1);
    const absOmega = Math.abs(omegaDrum);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (i >= activeMax) {
        dummy.position.set(0, -100, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        strandMesh.setMatrixAt(i, dummy.matrix);
        continue;
      }

      const ix = i * 3;
      if (pState[i] === 1) {
        pouredNow++;
        pVel[ix] += (tmpBasketW.x - pPos[ix]) * 1.4 * dt;
        pVel[ix + 1] += gravY * dt;
        pVel[ix + 2] += gravZ * dt + (tmpBasketW.z - pPos[ix + 2]) * 1.1 * dt;
        pPos[ix] += pVel[ix] * dt;
        pPos[ix + 1] += pVel[ix + 1] * dt;
        pPos[ix + 2] += pVel[ix + 2] * dt;

        // Rest cleanly inside woven keranjang mound
        if (pPos[ix + 1] < floorBasketY) {
          pPos[ix + 1] = floorBasketY + (i % 9) * 0.014;
          pVel[ix] *= 0.12;
          pVel[ix + 1] = 0;
          pVel[ix + 2] *= 0.12;
        }
      } else {
        let x = pPos[ix];
        let y = pPos[ix + 1];
        let z = pPos[ix + 2];
        let vx = pVel[ix];
        let vy = pVel[ix + 1];
        let vz = pVel[ix + 2];

        const r = Math.hypot(x, y);
        const ang = Math.atan2(y, x);
        const tZ = Math.max(0, Math.min(1, (z + L * 0.45) / (L * 0.88)));

        // True angular capture by any of the 4 helical steel lifting scoops!
        let bestDAng = Math.PI;
        let bestPitchDir = 1;
        for (let f = 0; f < 4; f++) {
          const pitchTwist = (f % 2 === 0 ? 1 : -1) * 0.45;
          const flightAng = state.drumAngle + (f * Math.PI) / 2 + tZ * pitchTwist;
          const dA = Math.atan2(Math.sin(ang - flightAng), Math.cos(ang - flightAng));
          if (Math.abs(dA) < Math.abs(bestDAng)) {
            bestDAng = dA;
            bestPitchDir = f % 2 === 0 ? 1 : -1;
          }
        }

        const nearWall = r > effR - 0.24;
        const onRisingSide = x * spinSign > -0.34 * effR;
        const belowRelease = y < 0.48;
        const caughtInFlight = absOmega > 0.005 && nearWall && onRisingSide && belowRelease && Math.abs(bestDAng) < 0.34;

        if (caughtInFlight) {
          const tangentX = -Math.sin(ang);
          const tangentY = Math.cos(ang);
          const carrySpeed = omegaDrum * r;
          vx += (tangentX * carrySpeed - vx) * Math.min(1, dt * 15);
          vy += (tangentY * carrySpeed - vy) * Math.min(1, dt * 15);
          // Slight radial tuck onto the scoop shelf & real helical axial transfer
          const rPull = (effR - 0.085 - r) * 3.8;
          vx += Math.cos(ang) * rPull * dt;
          vy += Math.sin(ang) * rPull * dt;
          vz += (bestPitchDir * absOmega * 0.78 + (isPouring ? 3.2 : 0)) * dt;
        } else {
          // Real free-fall waterfall curtain & buoyant top-bed tumble above core
          vx += (gravY * 0.025 * Math.sin(i * 1.9 + state.drumAngle) - vx * 0.45) * dt;
          vy += gravY * dt;
          vz += (gravZ + (isPouring ? 3.6 : 0) - vz * (isPouring ? 0.35 : 1.0)) * dt;
          if (y < bedCoreTopY + 0.04 && vy < 0 && !caughtInFlight) {
            y = bedCoreTopY + 0.04 + (i % 7) * 0.008;
            vy *= -0.15;
            vx += spinSign * absOmega * 0.18 * (i % 3 === 0 ? 1 : 0.4);
          }
        }

        x += vx * dt;
        y += vy * dt;
        z += vz * dt;

        const nr = Math.hypot(x, y);
        if (nr > effR) {
          const nx = x / nr;
          const ny = y / nr;
          x = nx * effR;
          y = ny * effR;
          const vRad = vx * nx + vy * ny;
          if (vRad > 0) {
            vx -= 1.25 * vRad * nx;
            vy -= 1.25 * vRad * ny;
          }
          if (absOmega <= 0.005) {
            vx *= 0.82;
            vy *= 0.82;
            vz *= 0.82;
          }
        }
        if (absOmega < 0.005 && y > activeCutoffY + 0.04) vy += gravY * 0.4 * dt;
        if (z < -L / 2 + 0.05) {
          z = -L / 2 + 0.05;
          vz = Math.abs(vz) * 0.3;
        }
        if (z > L / 2 - 0.08) {
          if (isPouring && y < 0.25) {
            pState[i] = 1;
            vz = Math.max(0.85, vz);
          } else {
            z = L / 2 - 0.05;
            vz = -Math.abs(vz) * 0.3;
          }
        }
        pPos[ix] = x;
        pPos[ix + 1] = y;
        pPos[ix + 2] = z;
        pVel[ix] = vx;
        pVel[ix + 1] = vy;
        pVel[ix + 2] = vz;
      }

      dummy.position.set(pPos[ix], pPos[ix + 1], pPos[ix + 2]);
      dummy.rotation.set(pRot[i * 2] + state.drumAngle * 0.35, pRot[i * 2 + 1], 0);
      const sc = pScale[i];
      dummy.scale.set(sc, sc, sc);
      dummy.updateMatrix();
      strandMesh.setMatrixAt(i, dummy.matrix);
    }
    state.pouredCount = pouredNow;
    strandMesh.instanceMatrix.needsUpdate = true;

    // Grow blended tobacco pile inside keranjang as strands pour out!
    if (pouredNow > 15) {
      basketPile.visible = true;
      const grow = Math.min(1, pouredNow / (activeMax * 0.55));
      basketPile.scale.set(0.65 + 0.35 * grow, 0.1 + 0.9 * grow, 0.65 + 0.35 * grow);
      basketPile.position.y = 0.08 + 0.14 * grow;
    }
  }

  function resize() {
    const w = container.clientWidth || 640;
    const h = container.clientHeight || 440;
    const aspect = w / h;
    camera.aspect = aspect;
    camera.fov = aspect < 1 ? Math.min(62, 42 / Math.max(0.68, aspect)) : 42;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  let rafId = 0;
  let lastT = performance.now();

  function animate(now) {
    rafId = requestAnimationFrame(animate);
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;

    if (state.pressPulse > 0) {
      state.pressPulse = Math.max(0, state.pressPulse - dt * 3.5);
      updatePartFocusVisuals();
    }

    // Smooth camera glide when POV preset or Anatomy part changes
    if (camAnim.active) {
      const kLerp = Math.min(1, dt * 6.5);
      camera.position.lerp(camAnim.goalPos, kLerp);
      controls.target.lerp(camAnim.goalTarget, kLerp);
      if (camera.position.distanceTo(camAnim.goalPos) < 0.015) camAnim.active = false;
    }

    // Smooth cradle tilt & worm handwheel spin
    const targetTiltRad = (state.tiltDeg * Math.PI) / 180;
    cradlePivot.rotation.x += (-targetTiltRad - cradlePivot.rotation.x) * Math.min(1, dt * 8);
    tiltHandwheel.rotation.x = cradlePivot.rotation.x * 10;

    // Staged Vault Lid Unlock: 8 clamps flip open FIRST, then davit swings door 104°!
    const targetClamp = state.lidOpen ? 1 : 0;
    state.clampOpenFrac += (targetClamp - state.clampOpenFrac) * Math.min(1, dt * 8);
    for (const cArm of clampArms) cArm.rotation.y = state.clampOpenFrac * 1.65;

    const targetLidAngle = state.lidOpen && state.clampOpenFrac > 0.55 ? 1.82 : 0;
    state.lidAngle += (targetLidAngle - state.lidAngle) * Math.min(1, dt * 6);
    davitHinge.rotation.y = state.lidAngle;

    // Center Twist-Lock Sample Cap: twists 75 deg then flips open 110 deg!
    const targetCap = state.sampleCapOpen ? 1 : 0;
    state.capOpenFrac += (targetCap - state.capOpenFrac) * Math.min(1, dt * 8);
    capBody.rotation.z = state.capOpenFrac * 1.25;
    capHinge.rotation.y = Math.max(0, state.capOpenFrac - 0.2) * 2.1;

    // Safety Door Interlock: cap open-mouth spin at 1.8 RPM!
    const safeCapRpm = state.lidOpen ? Math.min(1.8, state.drumRpm) : state.drumRpm;
    const effectiveRpm = state.running && !state.stalled ? safeCapRpm : 0;
    const omegaDrum = (effectiveRpm * 2 * Math.PI) / 60;
    state.drumAngle += omegaDrum * dt;
    state.crankAngle += omegaDrum * state.gearRatio * dt;

    drumSpinGroup.rotation.z = state.drumAngle;
    pinionGroup.rotation.z = -state.drumAngle * 12;
    const gbAngle = -state.drumAngle * (12 * (0.112 / 0.068));
    interGear.rotation.z = gbAngle;
    couplingHub.rotation.z = gbAngle;
    bevelPedalSprocket.rotation.x = state.crankAngle;
    chainLoop50.advance(state.drumAngle * 12 * 0.112);
    crankPivot.rotation.x = state.crankAngle;
    pedalBB.rotation.z = -state.crankAngle;
    for (const rMesh of rollerMeshes) rMesh.rotation.y = state.drumAngle * (R / 0.085);

    // Update dynamic bicycle drive chain straight from pedal chainring to gearbox bevel sprocket!
    if (pedalModule.visible) {
      cradlePivot.updateMatrixWorld(true);
      bevelPedalSprocket.getWorldPosition(tmpBevelW);
      pedalModule.worldToLocal(tmpBevelW);
      const dxC = tmpBevelW.x - pedalBB.position.x;
      const dyC = tmpBevelW.y - pedalBB.position.y;
      const dLen = Math.max(0.05, Math.hypot(dxC, dyC));
      const cAng = Math.atan2(dyC, dxC);
      const nx = -Math.sin(cAng);
      const ny = Math.cos(cAng);
      const mx = (pedalBB.position.x + tmpBevelW.x) / 2;
      const my = (pedalBB.position.y + tmpBevelW.y) / 2;
      const zC = tmpBevelW.z;
      pedalChainTop.scale.set(dLen, 1, 1);
      pedalChainTop.position.set(mx + nx * 0.082, my + ny * 0.082, zC);
      pedalChainTop.rotation.z = cAng;
      pedalChainBot.scale.set(dLen, 1, 1);
      pedalChainBot.position.set(mx - nx * 0.082, my - ny * 0.082, zC);
      pedalChainBot.rotation.z = cAng;
    }

    // Human Pose: Standing (Engine), Hand Cranking, or Seated Cycling in X-Y plane!
    const isPedal = state.driveId === "human-pedal";
    const isHandCrank = state.driveId === "human-1" || state.driveId === "human-2";
    if (isPedal) {
      humanGroup.position.x += (-1.98 - humanGroup.position.x) * Math.min(1, dt * 5);
      humanGroup.position.y += (-0.12 - humanGroup.position.y) * Math.min(1, dt * 5);
      humanGroup.position.z += (-0.18 - humanGroup.position.z) * Math.min(1, dt * 5);
      torsoPivot.rotation.z += (-0.28 - torsoPivot.rotation.z) * Math.min(1, dt * 5);
      rShoulder.rotation.z = 0.65;
      rElbow.rotation.z = 0.25;
      lShoulder.rotation.z = 0.65;
      lElbow.rotation.z = 0.25;
      legs.forEach((leg, idx) => {
        const phase = state.crankAngle + idx * Math.PI;
        leg.hipPivot.rotation.z = 1.05 + Math.sin(phase) * 0.30;
        leg.kneePivot.rotation.z = -1.25 - Math.cos(phase) * 0.36;
      });
    } else if (isHandCrank) {
      humanGroup.position.x += (-1.78 - humanGroup.position.x) * Math.min(1, dt * 5);
      humanGroup.position.y += (0 - humanGroup.position.y) * Math.min(1, dt * 5);
      humanGroup.position.z += ((GB_Z + 0.08) - humanGroup.position.z) * Math.min(1, dt * 5);
      legs.forEach((leg) => {
        leg.hipPivot.rotation.z += (0 - leg.hipPivot.rotation.z) * Math.min(1, dt * 5);
        leg.kneePivot.rotation.z += (0 - leg.kneePivot.rotation.z) * Math.min(1, dt * 5);
      });
      const th = cradlePivot.rotation.x;
      const crankWorldY =
        PIVOT_Y +
        GB_Y * Math.cos(th) -
        (GB_Z + 0.08) * Math.sin(th) +
        Math.cos(state.crankAngle) * MACHINE.crankRadiusM;
      const crankWorldZ =
        GB_Y * Math.sin(th) +
        (GB_Z + 0.08) * Math.cos(th) +
        Math.sin(state.crankAngle) * MACHINE.crankRadiusM;

      torsoPivot.rotation.z = -0.14 - Math.sin(state.crankAngle) * 0.06;
      const dy = crankWorldY - 1.32;
      const dz = crankWorldZ - (GB_Z + 0.08);
      rShoulder.rotation.z = 1.05 + dy * 1.1;
      rShoulder.rotation.y = -dz * 0.7;
      rElbow.rotation.z = 0.45 - Math.cos(state.crankAngle) * 0.28;
      lShoulder.rotation.z = 0.85 + dy * 0.6;
      lElbow.rotation.z = 0.55;
    } else {
      humanGroup.position.x += (-1.92 - humanGroup.position.x) * Math.min(1, dt * 5);
      humanGroup.position.y += (0 - humanGroup.position.y) * Math.min(1, dt * 5);
      humanGroup.position.z += (0.14 - humanGroup.position.z) * Math.min(1, dt * 5);
      legs.forEach((leg) => {
        leg.hipPivot.rotation.z += (0 - leg.hipPivot.rotation.z) * Math.min(1, dt * 5);
        leg.kneePivot.rotation.z += (0 - leg.kneePivot.rotation.z) * Math.min(1, dt * 5);
      });
      torsoPivot.rotation.z += (0 - torsoPivot.rotation.z) * Math.min(1, dt * 5);
      rShoulder.rotation.z += (0.08 - rShoulder.rotation.z) * Math.min(1, dt * 5);
      rShoulder.rotation.y += (0 - rShoulder.rotation.y) * Math.min(1, dt * 5);
      rElbow.rotation.z += (0.15 - rElbow.rotation.z) * Math.min(1, dt * 5);
      lShoulder.rotation.z += (0.08 - lShoulder.rotation.z) * Math.min(1, dt * 5);
      lElbow.rotation.z += (0.15 - lElbow.rotation.z) * Math.min(1, dt * 5);
    }

    stepTobaccoParticles(dt, omegaDrum, -cradlePivot.rotation.x);
    state.frameCounter++;
    if (state.frameCounter % 15 === 0) {
      state.mixPct = computeMixingUniformity();
      if (onMetrics) onMetrics({ mixPct: state.mixPct });
    }

    controls.update();
    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(animate);

  return {
    applyState,
    resetTobaccoBatch: (kg) => {
      resetTobaccoBatch(kg);
      state.mixPct = computeMixingUniformity();
      if (onMetrics) onMetrics({ mixPct: state.mixPct });
    },
    setCameraPreset,
    focusPart,
    clearPartFocus,
    getParts: () => PIECE_INFO,
    destroy: () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      pmrem?.dispose();
      envTex?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    },
  };
}
