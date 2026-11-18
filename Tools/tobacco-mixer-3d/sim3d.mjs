import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
    name: "144T Bolt-On Ring Gear & 12T Pinion",
    indo: "Roda Gigi Cincin 144T + Pinion 12T (12:1)",
    fn: "12:1 final barrel reduction slashes gearbox torque 12× and stays meshed at every tilt angle on the cradle.",
    spec: "#60 roller-chain sprocket ring (PCD 184 cm, 144T) + hardened 12T steel pinion.",
    cam: { pos: [-2.65, 1.55, 2.25], target: [-0.85, 1.12, -0.05] },
  },
  "10": {
    name: "Dual-Drive 2-Speed Gearbox & Ratchet",
    indo: "Gearbox 2-Kecepatan + Kopling Pemilih + Ratchet",
    fn: "Dog-clutch physically locks out crank during engine run; shifts between 24:1 Fast (50 kg) and 72:1 Heavy Low (300 kg) with backstop ratchet.",
    spec: "Sliding dog-clutch + #50 roller-chain 2:1 / 6:1 stages + anti-kickback ratchet pawl.",
    cam: { pos: [-2.75, 1.45, 2.15], target: [-1.15, 1.05, -0.05] },
  },
  "11": {
    name: "3 HP Motor / GX160 & 35 cm Crank / Pedal",
    indo: "Mesin 3 HP / GX160 + Engkol Manual & Pedal",
    fn: "Swappable 2.2 kW motor (10.6 RPM cascade) or GX160 petrol engine, plus waist-high 35 cm hand crank (<5 kgf @ 72:1) or 180 W seated pedal drive.",
    spec: "2.2 kW 4-pole + WPWDX-100 1:10 OR GX160 + 1:6 clutch; 35 cm hand crank / pedal seat.",
    cam: { pos: [-3.05, 1.48, 2.35], target: [-1.35, 1.02, -0.05] },
  },
  human: {
    name: "171 cm Operator Scale Reference (Aldi)",
    indo: "Referensi Tinggi Manusia 171 cm",
    fn: "Exact 171 cm figure beside 179 cm cylinder shows why upright drum (179 cm tall) is over-head and why tilting cradle ergonomics matter.",
    spec: "171.0 cm height · Waist crank shaft at 101 cm · Chest loading lip at 114 cm.",
    cam: { pos: [-3.95, 2.52, 4.45], target: [-0.22, 1.42, 0.12] },
  },
};

function makeGearMesh(teeth, pitchRadius, thickness, mat, holeRadius = 0.03) {
  const shape = new THREE.Shape();
  const addendum = (2 * Math.PI * pitchRadius) / (teeth * 3.4);
  const dedendum = addendum * 1.15;
  const rOut = pitchRadius + addendum;
  const rRoot = Math.max(holeRadius + 0.02, pitchRadius - dedendum);

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
    hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.003,
    bevelSegments: 1,
    curveSegments: 1,
  });
  geo.translate(0, 0, -thickness / 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
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

/**
 * Procedural fibrous shredded tobacco ("tembakau rajangan") texture.
 * Returns canvas + updater so mixProgress smoothly blends 3 origin bands -> mottled blend!
 */
function createTobaccoBedTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d");
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;

  // Deterministic pseudo-random shred table
  const shreds = Array.from({ length: 3400 }, (_, i) => ({
    u: ((i * 7919) % 512),
    v: ((i * 3571) % 512),
    len: 10 + (i % 18),
    wid: 1.5 + (i % 3) * 0.8,
    ang: ((i * 137) % 314) / 100,
    orig: i % 3,
    jitter: ((i * 29) % 100) / 100,
  }));

  const palette = ["#4a2814", "#c58434", "#8a6d36"];
  let lastMixBucket = -1;

  function update(mixFrac) {
    const bucket = Math.round(mixFrac * 20);
    if (bucket === lastMixBucket) return;
    lastMixBucket = bucket;

    // Base bed gradient: 3 bands when unmixed -> uniform warm dark-amber tobacco when mixed
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    if (mixFrac < 0.75) {
      const m = mixFrac / 0.75;
      grad.addColorStop(0, m < 0.4 ? "#3f2211" : "#6c4824");
      grad.addColorStop(0.5, m < 0.4 ? "#9e6927" : "#7b5429");
      grad.addColorStop(1, m < 0.4 ? "#735a2b" : "#744d26");
    } else {
      grad.addColorStop(0, "#754e27");
      grad.addColorStop(1, "#795228");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    for (const s of shreds) {
      // As mixFrac rises, strands migrate smoothly from their origin third across full u width
      const bandBase = (s.orig / 3) * 512 + (s.u / 3);
      const u = bandBase * (1 - mixFrac) + s.u * mixFrac;
      ctx.save();
      ctx.translate(u % 512, s.v);
      ctx.rotate(s.ang);
      ctx.fillStyle = palette[s.orig];
      ctx.globalAlpha = 0.72 + s.jitter * 0.25;
      ctx.fillRect(-s.len / 2, -s.wid / 2, s.len, s.wid);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    tex.needsUpdate = true;
  }

  update(0.12);
  return { tex, update };
}

function makeScaleRulerSprite(label, color = "#d99b38") {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(15,17,21,0.9)";
  ctx.beginPath();
  ctx.roundRect(8, 16, 496, 96, 18);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = "#f4efe6";
  ctx.font = "600 40px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 256, 65);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.95, 0.24, 1);
  return sprite;
}

export function createMixerSimulation(container, { onPartSelect, onPartAction, onMetrics } = {}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f1115);
  scene.fog = new THREE.FogExp2(0x0f1115, 0.042);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

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

  // Lighting
  const hemi = new THREE.HemisphereLight(0xf6eedb, 0x222630, 0.88);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.15);
  keyLight.position.set(-4.5, 6.5, 5.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 18;
  const dCam = 4.2;
  keyLight.shadow.camera.left = -dCam;
  keyLight.shadow.camera.right = dCam;
  keyLight.shadow.camera.top = dCam;
  keyLight.shadow.camera.bottom = -dCam;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xd99b38, 1.0);
  rimLight.position.set(4.5, 3.2, -3.5);
  scene.add(rimLight);

  // Workshop Floor
  const floorMat = new THREE.MeshStandardMaterial({
    map: makeFloorGridTexture(),
    roughness: 0.88,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Base Materials (stored for highlight/dimming in Anatomy Tour!)
  const matDefs = {
    steelFrame: new THREE.MeshStandardMaterial({ color: 0x2a303a, roughness: 0.55, metalness: 0.7 }),
    darkIron: new THREE.MeshStandardMaterial({ color: 0x1b1f26, roughness: 0.65, metalness: 0.75 }),
    steamer: new THREE.MeshStandardMaterial({ color: 0xaab2bd, roughness: 0.36, metalness: 0.84, side: THREE.DoubleSide }),
    steamerCutaway: new THREE.MeshPhysicalMaterial({
      color: 0xc2cbd6,
      roughness: 0.25,
      metalness: 0.2,
      transparent: true,
      opacity: 0.07,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    flight: new THREE.MeshStandardMaterial({ color: 0xd99b38, roughness: 0.42, metalness: 0.65, side: THREE.DoubleSide }),
    tire: new THREE.MeshStandardMaterial({ color: 0x767f8d, roughness: 0.3, metalness: 0.9 }),
    poly: new THREE.MeshStandardMaterial({ color: 0xc77d24, roughness: 0.55, metalness: 0.1 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xd99b38, roughness: 0.34, metalness: 0.82 }),
    epdm: new THREE.MeshStandardMaterial({ color: 0x17181b, roughness: 0.88, metalness: 0.04 }),
    clampRed: new THREE.MeshStandardMaterial({ color: 0xc63c2c, roughness: 0.42, metalness: 0.35 }),
    motor: new THREE.MeshStandardMaterial({ color: 0x3b4859, roughness: 0.48, metalness: 0.65 }),
    humanBody: new THREE.MeshStandardMaterial({ color: 0x39414f, roughness: 0.75, metalness: 0.08 }),
    humanSkin: new THREE.MeshStandardMaterial({ color: 0xc99c74, roughness: 0.72, metalness: 0.02 }),
    humanApron: new THREE.MeshStandardMaterial({ color: 0x8b6232, roughness: 0.82, metalness: 0.05 }),
    bamboo: new THREE.MeshStandardMaterial({ color: 0x9f7b44, roughness: 0.88, metalness: 0.02, side: THREE.DoubleSide }),
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
  const shellFull = new THREE.Mesh(new THREE.CylinderGeometry(R, R, L, 64, 1, true), matDefs.steamer);
  shellFull.rotation.x = Math.PI / 2;
  g05.add(shellFull);

  // Stationary cutaway shell in cradlePivot so cutaway window ALWAYS faces camera while internals spin!
  const cutawayShellHolder = new THREE.Group();
  cutawayShellHolder.position.set(0, 0, DRUM_Z_OFF);

  const cutawaySolid = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R, L, 48, 1, true, Math.PI * 1.92, Math.PI * 0.80),
    matDefs.steamer
  );
  cutawaySolid.rotation.x = Math.PI / 2;
  cutawaySolid.visible = false;
  cutawayShellHolder.add(cutawaySolid);

  const cutawayGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R, L, 32, 1, true, Math.PI * 0.72, Math.PI * 1.20),
    matDefs.steamerCutaway
  );
  cutawayGlass.rotation.x = Math.PI / 2;
  cutawayGlass.visible = false;
  cutawayShellHolder.add(cutawayGlass);
  cradlePivot.add(registerPart(cutawayShellHolder, "05"));

  const bottomPlate = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.02, 56), matDefs.steamer);
  bottomPlate.rotation.x = Math.PI / 2;
  bottomPlate.position.z = -L / 2;
  g05.add(bottomPlate);

  const mouthFlange = new THREE.Mesh(new THREE.TorusGeometry(R + 0.015, 0.032, 12, 64), matDefs.tire);
  mouthFlange.position.z = L / 2;
  g05.add(mouthFlange);

  for (const zBand of [-0.52, 0.42]) {
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.028, R + 0.028, 0.09, 64, 1, true), matDefs.tire);
    tire.rotation.x = Math.PI / 2;
    tire.position.z = zBand;
    g05.add(tire);
    const tireRingA = new THREE.Mesh(new THREE.TorusGeometry(R + 0.014, 0.016, 8, 64), matDefs.tire);
    tireRingA.position.z = zBand - 0.045;
    g05.add(tireRingA);
    const tireRingB = tireRingA.clone();
    tireRingB.position.z = zBand + 0.045;
    g05.add(tireRingB);
  }
  for (const zRib of [-0.15, 0.16, 0.72]) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(R + 0.01, 0.012, 8, 64), matDefs.tire);
    rib.position.z = zRib;
    g05.add(rib);
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
  // 09: 144T RING GEAR & 12T PINION
  // =========================================================================
  const g09Drum = new THREE.Group();
  const ringPitchR = 0.925;
  const ringGear = makeGearMesh(144, ringPitchR, 0.055, matDefs.brass, R + 0.005);
  ringGear.position.z = -0.15;
  g09Drum.add(ringGear);
  drumSpinGroup.add(registerPart(g09Drum, "09"));

  const pinionPos = new THREE.Vector3(-0.856, -0.521, -0.15 + DRUM_Z_OFF);
  const pinionGroup = new THREE.Group();
  pinionGroup.position.copy(pinionPos);
  pinionGroup.add(makeGearMesh(12, ringPitchR / 12, 0.065, matDefs.brass, 0.022));
  const pinionShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.38, 16), matDefs.tire);
  pinionShaft.rotation.x = Math.PI / 2;
  pinionShaft.position.z = -0.05;
  pinionGroup.add(pinionShaft);
  cradlePivot.add(registerPart(pinionGroup, "09"));

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
  // 10 & 11: DUAL-DRIVE GEARBOX, MOTORS, HAND CRANK & PEDAL MODULE
  // =========================================================================
  const g10 = new THREE.Group();
  g10.position.set(-1.12, -0.52, -0.08 + DRUM_Z_OFF);
  g10.add(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 0.44), matDefs.darkIron));
  const clutchLever = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.24, 12), matDefs.tire);
  clutchLever.position.set(0, 0.24, 0.08);
  g10.add(clutchLever);
  const clutchKnob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), matDefs.clampRed);
  clutchKnob.position.set(0, 0.35, 0.08);
  g10.add(clutchKnob);
  const interGear = makeGearMesh(28, 0.14, 0.03, matDefs.tire, 0.02);
  interGear.rotation.y = Math.PI / 2;
  interGear.position.set(-0.13, 0, -0.06);
  g10.add(interGear);
  cradlePivot.add(registerPart(g10, "10"));

  const g11 = new THREE.Group();
  g11.position.set(-1.12, -0.52, -0.45 + DRUM_Z_OFF);
  const motorUnit = new THREE.Group();
  const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.32, 24), matDefs.motor);
  motorBody.rotation.x = Math.PI / 2;
  motorUnit.add(motorBody);
  for (let f = 0; f < 10; f++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.012, 0.24), matDefs.motor);
    fin.rotation.z = (f / 10) * Math.PI;
    motorUnit.add(fin);
  }
  g11.add(motorUnit);

  const petrolUnit = new THREE.Group();
  petrolUnit.add(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.26), matDefs.darkIron));
  const tankMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.11, 0.22), matDefs.clampRed);
  tankMesh.position.set(0, 0.16, 0);
  petrolUnit.add(tankMesh);
  const shroudMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.07, 18), matDefs.clampRed);
  shroudMesh.rotation.z = Math.PI / 2;
  shroudMesh.position.set(-0.15, -0.02, 0);
  petrolUnit.add(shroudMesh);
  petrolUnit.visible = false;
  g11.add(petrolUnit);

  const crankPivot = new THREE.Group();
  crankPivot.position.set(-1.28, -0.52, 0.06 + DRUM_Z_OFF);
  const crankBoss = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.08, 16), matDefs.tire);
  crankBoss.rotation.z = Math.PI / 2;
  crankPivot.add(crankBoss);
  const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.38, 0.045), matDefs.brass);
  crankArm.position.set(-0.04, MACHINE.crankRadiusM / 2, 0);
  crankPivot.add(crankArm);
  const crankHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.16, 16), matDefs.humanApron);
  crankHandle.rotation.z = Math.PI / 2;
  crankHandle.position.set(-0.12, MACHINE.crankRadiusM, 0);
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

  // Seated Pedal Drive Frame (appears when human-pedal is active!)
  const pedalModule = new THREE.Group();
  pedalModule.position.set(-1.62, 0, 0.14);
  const seatPost = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.84, 12), matDefs.steelFrame);
  seatPost.position.set(-0.26, 0.42, 0);
  seatPost.rotation.z = -0.18;
  pedalModule.add(seatPost);
  const seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.24), matDefs.epdm);
  seatBase.position.set(-0.34, 0.84, 0);
  pedalModule.add(seatBase);
  const pedalBB = new THREE.Group();
  pedalBB.position.set(0.18, 0.56, 0);
  const pedalWheel = makeGearMesh(20, 0.10, 0.02, matDefs.brass, 0.02);
  pedalWheel.rotation.y = Math.PI / 2;
  pedalBB.add(pedalWheel);
  for (const s of [-1, 1]) {
    const pArm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.175, 0.028), matDefs.tire);
    pArm.position.set(s * 0.09, s * 0.0875, 0);
    pedalBB.add(pArm);
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.08), matDefs.epdm);
    pad.position.set(s * 0.14, s * 0.175, 0);
    pedalBB.add(pad);
  }
  pedalModule.add(pedalBB);
  const chainStrut = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.52, 0.04), matDefs.steelFrame);
  chainStrut.position.set(0.26, 0.78, 0);
  chainStrut.rotation.z = -0.25;
  pedalModule.add(chainStrut);
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
  keranjang.position.set(0, 0, 1.38);
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

  const tobTexObj = createTobaccoBedTexture();
  const basketPileMat = new THREE.MeshStandardMaterial({
    map: tobTexObj.tex,
    roughness: 0.94,
    metalness: 0.01,
  });
  const basketPile = new THREE.Mesh(new THREE.ConeGeometry(0.37, 0.32, 24), basketPileMat);
  basketPile.position.y = 0.15;
  basketPile.scale.set(1, 0.02, 1);
  basketPile.visible = false;
  keranjang.add(basketPile);
  scene.add(keranjang);

  // =========================================================================
  // DUAL-LAYER REALISTIC RAJANGAN TOBACCO INSIDE DRUM:
  // 1) Cohesive Sloped Bulk Bed Mesh (scales with batchKg, tilts to 36° repose)
  // 2) 2,200 Cascading Shredded Tobacco Strands
  // =========================================================================
  const tobaccoHolder = new THREE.Group();
  tobaccoHolder.position.set(0, 0, DRUM_Z_OFF);
  cradlePivot.add(tobaccoHolder);

  // True circular-segment bulk bed strictly bounded inside r = R - 0.05 (never pokes outside shell!)
  function buildBedGeo(fillFrac) {
    const rb = R - 0.055;
    const halfSpan = Math.max(0.45, Math.min(Math.PI * 0.48, 0.52 + fillFrac * 1.75));
    const startA = -Math.PI / 2 - halfSpan;
    const endA = -Math.PI / 2 + halfSpan;
    const shape = new THREE.Shape();
    const steps = 28;
    for (let i = 0; i <= steps; i++) {
      const a = startA + (i / steps) * (endA - startA);
      const px = Math.cos(a) * rb;
      const py = Math.sin(a) * rb;
      if (i === 0) shape.moveTo(px, py);
      else shape.lineTo(px, py);
    }
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: L * 0.88, bevelEnabled: false, curveSegments: 1 });
    geo.translate(0, 0, -L * 0.44);
    // Normalize UVs smoothly across bed width/length for shredded tobacco texture
    const pos = geo.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uvs[i * 2] = (pos.getZ(i) + L * 0.44) / (L * 0.88);
      uvs[i * 2 + 1] = (pos.getX(i) + rb) / (2 * rb);
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    return geo;
  }

  let currentBedBucket = -1;
  const bedMat = new THREE.MeshStandardMaterial({
    map: tobTexObj.tex,
    roughness: 0.95,
    metalness: 0.01,
    side: THREE.DoubleSide,
  });
  const bulkBedMesh = new THREE.Mesh(buildBedGeo(0.22), bedMat);
  bulkBedMesh.receiveShadow = true;
  tobaccoHolder.add(bulkBedMesh);

  const PARTICLE_COUNT = 2200;
  // Fine fibrous tobacco shred ribbon geometry
  const strandGeo = new THREE.BoxGeometry(0.048, 0.004, 0.009);
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
    const maxAngle = 0.75 + fillFrac * 1.35;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const variety = i < PARTICLE_COUNT / 3 ? 0 : i < (PARTICLE_COUNT * 2) / 3 ? 1 : 2;
      pType[i] = variety;
      strandMesh.setColorAt(i, TOBACCO_COLORS[variety]);

      const theta = -Math.PI / 2 + (((i * 73) % 100) / 100 - 0.5) * maxAngle;
      const radFrac = 0.62 + 0.34 * (((i * 37) % 100) / 100);
      const r = R * radFrac;
      const zBand =
        variety === 0
          ? -L * 0.35 + (((i * 19) % 100) / 100) * (L * 0.25)
          : variety === 1
          ? -L * 0.08 + (((i * 23) % 100) / 100) * (L * 0.24)
          : L * 0.16 + (((i * 29) % 100) / 100) * (L * 0.26);

      pPos[i * 3] = Math.cos(theta) * r;
      pPos[i * 3 + 1] = Math.sin(theta) * r;
      pPos[i * 3 + 2] = zBand;
      pVel[i * 3] = pVel[i * 3 + 1] = pVel[i * 3 + 2] = 0;
      pRot[i * 2] = ((i * 13) % 314) / 50;
      pRot[i * 2 + 1] = ((i * 29) % 314) / 50;
      pScale[i] = 0.7 + ((i * 17) % 60) / 100;
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
    selectedPart: null,
    anatomyIsolate: false,
  };

  resetTobaccoBatch(state.batchKg);

  function setCutaway(enabled) {
    state.cutaway = enabled;
    shellFull.visible = !enabled;
    cutawaySolid.visible = enabled;
    cutawayGlass.visible = enabled;
    interiorLight.intensity = enabled ? 2.6 : 0.8;
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
    pinionGroup.position.x = -0.856 - e * 0.35;
    g10.position.x = -1.12 - e * 0.52;
    g11.position.x = -1.12 - e * 0.72;
    crankPivot.position.x = -1.28 - e * 0.78;
    capHinge.position.z = 0.065 + e * 0.45;
  }

  function updatePartFocusVisuals() {
    const sel = state.selectedPart;
    const isolate = state.anatomyIsolate && !!sel;
    for (const [pid, mats] of Object.entries(partMaterials)) {
      const isSelected = sel === pid;
      for (const m of mats) {
        if (isSelected) {
          m.emissive?.setHex(0x6b4712);
          m.opacity = m.userData.baseOpacity;
          m.transparent = m.userData.baseTransparent;
        } else if (isolate) {
          m.emissive?.setHex(0x000000);
          m.transparent = true;
          m.opacity = Math.min(m.userData.baseOpacity, 0.22);
        } else {
          m.emissive?.setHex(0x000000);
          m.opacity = m.userData.baseOpacity;
          m.transparent = m.userData.baseTransparent;
        }
        m.needsUpdate = true;
      }
    }
  }

  function focusPart(partId, { glideCamera = true, isolate = true } = {}) {
    state.selectedPart = partId;
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

  renderer.domElement.addEventListener("pointermove", (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    const hit = hits.find((h) => h.object?.visible && h.object?.userData?.partId);
    renderer.domElement.style.cursor = hit ? "pointer" : "grab";
  });

  renderer.domElement.addEventListener("pointerdown", (e) => {
    downPos = [e.clientX, e.clientY];
  });
  renderer.domElement.addEventListener("pointerup", (e) => {
    if (!downPos) return;
    const dist = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
    downPos = null;
    if (dist > 6) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    const hit = hits.find((h) => h.object?.visible && h.object?.userData?.partId);
    if (hit) {
      const id = hit.object.userData.partId;
      focusPart(id, { glideCamera: false, isolate: state.anatomyIsolate });
      if (onPartAction) onPartAction(id);
    }
  });

  function stepTobaccoParticles(dt, omegaDrum, tiltRad) {
    const sinT = Math.sin(tiltRad);
    const cosT = Math.cos(tiltRad);
    const gravY = -9.81 * cosT;
    const gravZ = -9.81 * sinT;
    const effR = R - 0.05;
    const fillLimit = 0.08 + Math.min(0.55, state.batchKg / 720);
    const activeCutoffY = -effR + fillLimit * 1.8 * effR;
    const isPouring = state.lidOpen && state.tiltDeg < -4;

    // Update circular-segment bed geometry when fill or pour level changes (stays 100% inside drum wall!)
    const pourRatio = Math.min(1, state.pouredCount / Math.max(1, state.activeCount * 0.72));
    const effectiveFill = Math.max(0.03, Math.min(0.55, (state.batchKg / 720) * (1 - pourRatio * 0.92)));
    const bedBucket = Math.round(effectiveFill * 40);
    if (bedBucket !== currentBedBucket) {
      currentBedBucket = bedBucket;
      bulkBedMesh.geometry.dispose();
      bulkBedMesh.geometry = buildBedGeo(effectiveFill);
    }
    bulkBedMesh.visible = pourRatio < 0.94;
    const targetSlopeZ = Math.sign(omegaDrum || 1) * Math.min(0.45, Math.abs(omegaDrum) * 0.36);
    bulkBedMesh.rotation.z += (targetSlopeZ - bulkBedMesh.rotation.z) * Math.min(1, dt * 4);
    tobTexObj.update(Math.min(1, (state.mixPct - 10) / 86));

    let pouredNow = 0;
    const activeMax = state.activeCount;
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
        pVel[ix + 1] += gravY * dt;
        pVel[ix + 2] += gravZ * dt + 0.95 * dt;
        pPos[ix] += pVel[ix] * dt;
        pPos[ix + 1] += pVel[ix + 1] * dt;
        pPos[ix + 2] += pVel[ix + 2] * dt;

        // Land inside woven keranjang
        if (pPos[ix + 1] < -1.08) {
          pPos[ix + 1] = -1.08 + (i % 9) * 0.02;
          pVel[ix] *= 0.18;
          pVel[ix + 1] = 0;
          pVel[ix + 2] *= 0.18;
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
        const nearWall = r > effR - 0.22;
        const inLiftingQuad = y < 0.55 && x * omegaDrum > -0.25;

        if (nearWall && inLiftingQuad && Math.abs(omegaDrum) > 0.005) {
          const tangentX = -Math.sin(ang);
          const tangentY = Math.cos(ang);
          const carrySpeed = omegaDrum * r;
          vx += (tangentX * carrySpeed - vx) * Math.min(1, dt * 11);
          vy += (tangentY * carrySpeed - vy) * Math.min(1, dt * 11);
          const sector = Math.floor((((ang + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 2))) % 2;
          vz += (sector === 0 ? 1 : -1) * Math.abs(omegaDrum) * 0.50 * dt;
        } else {
          vx += (Math.sin(i * 1.7 + state.drumAngle) * 0.4 - vx * 1.4) * dt;
          vy += gravY * dt;
          vz += (gravZ * 0.65 - vz * 1.8) * dt;
        }

        x += vx * dt;
        y += vy * dt;
        z += vz * dt;

        const nr = Math.hypot(x, y);
        if (nr > effR) {
          const s = effR / nr;
          x *= s;
          y *= s;
          vx *= 0.4;
          vy *= 0.4;
        }
        if (Math.abs(omegaDrum) < 0.005 && y > activeCutoffY) vy -= 4.5 * dt;
        if (z < -L / 2 + 0.05) {
          z = -L / 2 + 0.05;
          vz = Math.abs(vz) * 0.3;
        }
        if (z > L / 2 - 0.05) {
          if (isPouring && y < 0.12) {
            pState[i] = 1;
            vz = 0.65;
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
      dummy.rotation.set(pRot[i * 2] + state.drumAngle * 0.3, pRot[i * 2 + 1], 0);
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
    interGear.rotation.x = state.drumAngle * Math.min(24, state.gearRatio);
    crankPivot.rotation.x = state.crankAngle;
    pedalBB.rotation.x = state.crankAngle;
    for (const rMesh of rollerMeshes) rMesh.rotation.y = -state.drumAngle * (R / 0.085);

    // Human Pose: Standing (Engine), Hand Cranking, or Seated Pedaling!
    const isPedal = state.driveId === "human-pedal";
    const isHandCrank = state.driveId === "human-1" || state.driveId === "human-2";
    if (isPedal) {
      humanGroup.position.x += (-1.94 - humanGroup.position.x) * Math.min(1, dt * 5);
      humanGroup.position.y += (-0.12 - humanGroup.position.y) * Math.min(1, dt * 5);
      torsoPivot.rotation.z += (-0.28 - torsoPivot.rotation.z) * Math.min(1, dt * 5);
      rShoulder.rotation.z = 0.65;
      rElbow.rotation.z = 0.25;
      lShoulder.rotation.z = 0.65;
      lElbow.rotation.z = 0.25;
      legs.forEach((leg, idx) => {
        const phase = state.crankAngle + idx * Math.PI;
        leg.hipPivot.rotation.z = 1.05 + Math.sin(phase) * 0.28;
        leg.kneePivot.rotation.z = -1.25 - Math.cos(phase) * 0.35;
      });
    } else if (isHandCrank) {
      humanGroup.position.x += (-1.70 - humanGroup.position.x) * Math.min(1, dt * 5);
      humanGroup.position.y += (0 - humanGroup.position.y) * Math.min(1, dt * 5);
      legs.forEach((leg) => {
        leg.hipPivot.rotation.z += (0 - leg.hipPivot.rotation.z) * Math.min(1, dt * 5);
        leg.kneePivot.rotation.z += (0 - leg.kneePivot.rotation.z) * Math.min(1, dt * 5);
      });
      const th = cradlePivot.rotation.x;
      const crankWorldY =
        PIVOT_Y +
        (-0.52) * Math.cos(th) -
        (0.06 + DRUM_Z_OFF) * Math.sin(th) +
        Math.cos(state.crankAngle) * MACHINE.crankRadiusM;
      const crankWorldZ =
        (-0.52) * Math.sin(th) +
        (0.06 + DRUM_Z_OFF) * Math.cos(th) +
        Math.sin(state.crankAngle) * MACHINE.crankRadiusM;

      torsoPivot.rotation.z = -0.14 - Math.sin(state.crankAngle) * 0.06;
      const dy = crankWorldY - 1.32;
      const dz = crankWorldZ - 0.14;
      rShoulder.rotation.z = 1.05 + dy * 1.1;
      rShoulder.rotation.y = -dz * 0.7;
      rElbow.rotation.z = 0.45 - Math.cos(state.crankAngle) * 0.28;
      lShoulder.rotation.z = 0.85 + dy * 0.6;
      lElbow.rotation.z = 0.55;
    } else {
      humanGroup.position.x += (-1.92 - humanGroup.position.x) * Math.min(1, dt * 5);
      humanGroup.position.y += (0 - humanGroup.position.y) * Math.min(1, dt * 5);
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
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    },
  };
}
