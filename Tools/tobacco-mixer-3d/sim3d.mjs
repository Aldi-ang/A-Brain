import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MACHINE } from "./physics.mjs";

const TOBACCO_COLORS = [
  new THREE.Color(0x4a2915), // Temanggung Srintil (dark rich brown)
  new THREE.Color(0xc28135), // Madura Campor (warm amber gold)
  new THREE.Color(0x886c36), // Boyolali Tengah (warm olive ochre)
];

const PART_META = {
  "01": { name: "Base Skid & Rubber Feet", desc: "UNP 100 steel frame (220x215 cm) + anti-vibration pads." },
  "02": { name: "A-Frame Stanchions", desc: "Twin 80x80 mm steel towers holding UCP-210 trunnions at 154 cm." },
  "03": { name: "Tilting U-Cradle & Tilt Wheel", desc: "Balanced cradle tilting -12 deg unload to +32 deg mix via worm handwheel." },
  "04": { name: "4 Trunnion Rollers & Thrust Hub", desc: "4x 150 mm polyurethane guide rollers + rear axial thrust bearing." },
  "05": { name: "179x179 cm Steamer Cylinder", desc: "Existing mushroom baglog steamer body + welded tire tracks." },
  "06": { name: "4 Helical Flights & Cross-Vanes", desc: "Smooth curved SS304 lifting scoops for gentle 3D cascade (<1% bubuk)." },
  "07": { name: "181 cm Tupperware Vault Lid", desc: "Full-area EPDM U-gasket cap + 8 toggle clamps + gas-strut swing davit." },
  "08": { name: "144T Ring Gear & 12T Pinion", desc: "12:1 bolt-on barrel ring gear staying meshed at every tilt angle." },
  "09": { name: "2-Speed Dual-Drive Gearbox", desc: "Dog-clutch locks out crank in engine mode; 24:1 Fast / 72:1 Heavy Low + ratchet." },
  "10": { name: "Motor / GX160 & 35 cm Crank", desc: "2.2 kW electric motor / GX160 petrol mount + ergonomic waist-high hand crank." },
  human: { name: "171 cm Operator (Aldi Scale)", desc: "Exact 171 cm human beside the 179 cm diameter/height drum for real scale." },
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

  // Subtle concrete grain
  for (let i = 0; i < 4000; i++) {
    const v = 22 + ((i * 37) % 10);
    ctx.fillStyle = `rgb(${v},${v + 2},${v + 6})`;
    ctx.fillRect((i * 197) % 1024, (i * 419) % 1024, 2, 2);
  }

  // Minor 25cm lines
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
  // Major 1m lines
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

function makeScaleRulerSprite(label, color = "#d99b38") {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "rgba(15,17,21,0.88)";
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

export function createMixerSimulation(container, { onPartSelect, onMetrics } = {}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f1115);
  scene.fog = new THREE.FogExp2(0x0f1115, 0.048);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 45);
  camera.position.set(-3.95, 2.55, 4.45);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.target.set(-0.22, 1.44, 0.12);
  controls.minDistance = 1.6;
  controls.maxDistance = 10.5;
  controls.maxPolarAngle = Math.PI * 0.495;

  // Lighting
  const hemi = new THREE.HemisphereLight(0xf6eedb, 0x20242d, 0.78);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.1);
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

  const rimLight = new THREE.DirectionalLight(0xd99b38, 0.9);
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

  // Materials
  const steelFrameMat = new THREE.MeshStandardMaterial({ color: 0x2a303a, roughness: 0.55, metalness: 0.7 });
  const darkIronMat = new THREE.MeshStandardMaterial({ color: 0x1b1f26, roughness: 0.65, metalness: 0.75 });
  const steamerMat = new THREE.MeshStandardMaterial({
    color: 0xaab2bd,
    roughness: 0.36,
    metalness: 0.84,
    side: THREE.DoubleSide,
  });
  const steamerCutawayMat = new THREE.MeshPhysicalMaterial({
    color: 0xc2cbd6,
    roughness: 0.25,
    metalness: 0.2,
    transparent: true,
    opacity: 0.07,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const interiorFlightMat = new THREE.MeshStandardMaterial({
    color: 0xd99b38,
    roughness: 0.42,
    metalness: 0.65,
    side: THREE.DoubleSide,
  });
  const tireSteelMat = new THREE.MeshStandardMaterial({ color: 0x767f8d, roughness: 0.3, metalness: 0.9 });
  const polyRollerMat = new THREE.MeshStandardMaterial({ color: 0xc77d24, roughness: 0.55, metalness: 0.1 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd99b38, roughness: 0.34, metalness: 0.82 });
  const epdmMat = new THREE.MeshStandardMaterial({ color: 0x17181b, roughness: 0.88, metalness: 0.04 });
  const clampRedMat = new THREE.MeshStandardMaterial({ color: 0xb93829, roughness: 0.45, metalness: 0.35 });
  const motorMat = new THREE.MeshStandardMaterial({ color: 0x3b4859, roughness: 0.48, metalness: 0.65 });
  const humanBodyMat = new THREE.MeshStandardMaterial({ color: 0x39414f, roughness: 0.75, metalness: 0.08 });
  const humanSkinMat = new THREE.MeshStandardMaterial({ color: 0xc99c74, roughness: 0.72, metalness: 0.02 });
  const humanApronMat = new THREE.MeshStandardMaterial({ color: 0x8b6232, roughness: 0.82, metalness: 0.05 });
  const bambooMat = new THREE.MeshStandardMaterial({ color: 0x9f7b44, roughness: 0.88, metalness: 0.02, side: THREE.DoubleSide });

  const tagPart = (obj, partId) => {
    obj.traverse((n) => {
      n.userData.partId = partId;
      if (n.isMesh) {
        n.castShadow = true;
        n.receiveShadow = true;
      }
    });
    return obj;
  };

  // =========================================================================
  // 01: BASE SKID & FEET
  // =========================================================================
  const PIVOT_Y = 1.54;
  const g01 = new THREE.Group();
  const skidGeoX = new THREE.BoxGeometry(2.38, 0.09, 0.11);
  const skidGeoZ = new THREE.BoxGeometry(0.11, 0.09, 2.24);
  for (const zPos of [-1.05, 1.05]) {
    const beam = new THREE.Mesh(skidGeoX, steelFrameMat);
    beam.position.set(0, 0.085, zPos);
    g01.add(beam);
  }
  for (const xPos of [-1.18, 1.18]) {
    const beam = new THREE.Mesh(skidGeoZ, steelFrameMat);
    beam.position.set(xPos, 0.085, 0);
    g01.add(beam);
    for (const zPos of [-1.05, 1.05]) {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.04, 20), epdmMat);
      pad.position.set(xPos, 0.02, zPos);
      g01.add(pad);
    }
  }
  scene.add(tagPart(g01, "01"));

  // =========================================================================
  // 02: TWIN A-FRAME TRUNNION STANCHIONS
  // =========================================================================
  const g02 = new THREE.Group();
  for (const side of [-1, 1]) {
    const xBase = side * 1.18;
    // A-frame angled legs from z = +-0.85 up to (0, PIVOT_Y)
    for (const zSign of [-1, 1]) {
      const p0 = new THREE.Vector3(xBase, 0.12, zSign * 0.85);
      const p1 = new THREE.Vector3(xBase, PIVOT_Y - 0.04, zSign * 0.06);
      const dir = p1.clone().sub(p0);
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.085, dir.length(), 0.085), steelFrameMat);
      leg.position.copy(p0).addScaledVector(dir, 0.5);
      leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      g02.add(leg);
    }
    // Cross brace
    const brace = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.05), steelFrameMat);
    brace.position.set(xBase, 0.72, 0);
    g02.add(brace);
    // Pillow block bearing UCP-210
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.24), darkIronMat);
    block.position.set(xBase, PIVOT_Y, 0);
    g02.add(block);
    const journal = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.22, 20), tireSteelMat);
    journal.rotation.z = Math.PI / 2;
    journal.position.set(xBase - side * 0.06, PIVOT_Y, 0);
    g02.add(journal);
  }
  scene.add(tagPart(g02, "02"));

  // =========================================================================
  // 03: TILTING U-CRADLE + WORM TILT HANDWHEEL (Pivot at 0, PIVOT_Y, 0)
  // =========================================================================
  const cradlePivot = new THREE.Group();
  cradlePivot.position.set(0, PIVOT_Y, 0);
  scene.add(cradlePivot);

  const g03 = new THREE.Group();
  // Cradle side rails + rear crossbeam + curved support ribs
  for (const side of [-1, 1]) {
    const sideBar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 1.88), steelFrameMat);
    sideBar.position.set(side * 1.04, -0.32, 0.05);
    g03.add(sideBar);
    const armUp = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.38, 0.14), steelFrameMat);
    armUp.position.set(side * 1.04, -0.13, 0);
    g03.add(armUp);
    const crossWeb = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, 0.14), steelFrameMat);
    crossWeb.position.set(side * 1.07, 0, 0);
    g03.add(crossWeb);
  }
  // Underside cross beams under drum tires
  for (const zPos of [-0.52, 0.42]) {
    const cross = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.10, 0.11), steelFrameMat);
    cross.position.set(0, -0.96, zPos);
    g03.add(cross);
    // Vertical risers connecting sideBar (-0.32) down to cross (-0.96)
    for (const side of [-1, 1]) {
      const riser = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.66, 0.09), steelFrameMat);
      riser.position.set(side * 1.04, -0.64, zPos);
      g03.add(riser);
    }
  }
  // Rear thrust yoke beam
  const rearBeam = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.10, 0.10), steelFrameMat);
  rearBeam.position.set(0, 0, -0.94);
  g03.add(rearBeam);
  for (const side of [-1, 1]) {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.96), steelFrameMat);
    tie.position.set(side * 1.04, -0.16, -0.46);
    g03.add(tie);
  }
  // Tilt Worm Quadrant & Handwheel on +X stanchion
  const tiltQuadrant = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.025, 10, 28, Math.PI * 0.75), brassMat);
  tiltQuadrant.rotation.y = Math.PI / 2;
  tiltQuadrant.rotation.z = -Math.PI * 0.35;
  tiltQuadrant.position.set(1.13, 0, 0);
  g03.add(tiltQuadrant);
  const tiltHandwheel = new THREE.Group();
  tiltHandwheel.position.set(1.30, PIVOT_Y - 0.32, 0.14); // Fixed to right stanchion in world
  const wheelRing = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.018, 12, 28), brassMat);
  wheelRing.rotation.y = Math.PI / 2;
  tiltHandwheel.add(wheelRing);
  for (let s = 0; s < 3; s++) {
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.36, 8), steelFrameMat);
    spoke.rotation.x = (s * Math.PI) / 3;
    tiltHandwheel.add(spoke);
  }
  g02.add(tagPart(tiltHandwheel, "03"));
  cradlePivot.add(tagPart(g03, "03"));

  // =========================================================================
  // 04: 4 TRUNNION ROLLERS & REAR AXIAL THRUST HUB
  // =========================================================================
  const DRUM_Z_OFF = 0.08; // slight forward bias inside cradle for clean -12 deg dump clearance
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
    // Support bracket
    const brk = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.16), darkIronMat);
    brk.position.set(rx, ry - 0.12, rz);
    g04.add(brk);
    const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.11, 24), polyRollerMat);
    roller.rotation.x = Math.PI / 2;
    roller.position.set(rx, ry, rz);
    g04.add(roller);
    rollerMeshes.push(roller);
  }
  // Rear axial thrust bearing hub
  const thrustHub = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.12, 24), tireSteelMat);
  thrustHub.rotation.x = Math.PI / 2;
  thrustHub.position.set(0, 0, -L / 2 + DRUM_Z_OFF - 0.06);
  g04.add(thrustHub);
  cradlePivot.add(tagPart(g04, "04"));

  // =========================================================================
  // DRUM ROTATING GROUP (rotates around cradle local Z)
  // =========================================================================
  const drumSpinGroup = new THREE.Group();
  drumSpinGroup.position.set(0, 0, DRUM_Z_OFF);
  cradlePivot.add(drumSpinGroup);

  // 05: 179 x 179 cm BAGLOG STEAMER CYLINDER (with front-facing cutaway option!)
  const g05 = new THREE.Group();
  // Full closed solid shell vs Cutaway split (back 225 deg solid + front 135 deg translucent glass!)
  const shellFull = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R, L, 64, 1, true),
    steamerMat
  );
  shellFull.rotation.x = Math.PI / 2;
  g05.add(shellFull);

  // Back solid cutaway shell (220 deg solid on +X/-Y back side) + Front translucent cutaway window (140 deg on -X/+Y camera side)
  // CylinderGeometry thetaStart=0 is +Z (maps to -Y after rotation.x=PI/2); angle increases counter-clockwise (+X -> +Y -> -X -> -Y)
  // Opening from PI*0.75 (+Y/-X top-left) to PI*1.55 (-X/-Y) puts the cutaway window squarely facing camera!
  const cutawaySolid = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R, L, 48, 1, true, Math.PI * 1.55, Math.PI * 1.25),
    steamerMat
  );
  cutawaySolid.rotation.x = Math.PI / 2;
  cutawaySolid.visible = false;
  g05.add(cutawaySolid);

  const cutawayGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(R, R, L, 32, 1, true, Math.PI * 0.80, Math.PI * 0.75),
    steamerCutawayMat
  );
  cutawayGlass.rotation.x = Math.PI / 2;
  cutawayGlass.visible = false;
  g05.add(cutawayGlass);

  // Closed bottom end plate of steamer (at z = -L/2)
  const bottomPlate = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.02, 56), steamerMat);
  bottomPlate.rotation.x = Math.PI / 2;
  bottomPlate.position.z = -L / 2;
  g05.add(bottomPlate);

  // Top hollow rim flange collar (at z = +L/2)
  const mouthFlange = new THREE.Mesh(
    new THREE.TorusGeometry(R + 0.015, 0.032, 12, 64),
    tireSteelMat
  );
  mouthFlange.position.z = L / 2;
  g05.add(mouthFlange);

  // Twin steel rolling tire bands + rolled steamer stiffening chimes
  for (const zBand of [-0.52, 0.42]) {
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.028, R + 0.028, 0.09, 64, 1, true), tireSteelMat);
    tire.rotation.x = Math.PI / 2;
    tire.position.z = zBand;
    g05.add(tire);
    const tireRingA = new THREE.Mesh(new THREE.TorusGeometry(R + 0.014, 0.016, 8, 64), tireSteelMat);
    tireRingA.position.z = zBand - 0.045;
    g05.add(tireRingA);
    const tireRingB = tireRingA.clone();
    tireRingB.position.z = zBand + 0.045;
    g05.add(tireRingB);
  }
  for (const zRib of [-0.15, 0.16, 0.72]) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(R + 0.01, 0.012, 8, 64), tireSteelMat);
    rib.position.z = zRib;
    g05.add(rib);
  }
  drumSpinGroup.add(tagPart(g05, "05"));

  // =========================================================================
  // 06: 4 HELICAL LIFTING FLIGHTS + 4 CROSS-DEFLECTOR RIBS (INSIDE DRUM)
  // =========================================================================
  const g06 = new THREE.Group();
  for (let f = 0; f < 4; f++) {
    const baseAngle = (f * Math.PI) / 2;
    const segments = 22;
    const pitchTwist = (f % 2 === 0 ? 1 : -1) * 0.45; // alternating gentle axial cross-flow
    const geo = new THREE.BufferGeometry();
    const verts = [];
    const indices = [];
    for (let s = 0; s <= segments; s++) {
      const t = s / segments;
      const z = -L * 0.45 + t * L * 0.88;
      const ang = baseAngle + t * pitchTwist;
      const outerX = Math.cos(ang) * (R - 0.01);
      const outerY = Math.sin(ang) * (R - 0.01);
      // Curved scoop lip tilting inward toward rotation direction
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
    const flight = new THREE.Mesh(geo, interiorFlightMat);
    g06.add(flight);

    // Staggered mid-height cross-deflector comb between flights
    const midAng = baseAngle + Math.PI / 4;
    const vane = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.015, 0.34), interiorFlightMat);
    vane.position.set(Math.cos(midAng) * (R - 0.06), Math.sin(midAng) * (R - 0.06), (f % 2 === 0 ? -0.25 : 0.25));
    vane.rotation.z = midAng;
    vane.rotation.y = f % 2 === 0 ? 0.35 : -0.35;
    g06.add(vane);
  }
  drumSpinGroup.add(tagPart(g06, "06"));

  // =========================================================================
  // 08: 144T BOLT-ON RING GEAR (on drum) + 12T PINION (on cradle)
  // =========================================================================
  const g08Drum = new THREE.Group();
  const ringPitchR = 0.925;
  const ringGear = makeGearMesh(144, ringPitchR, 0.055, brassMat, R + 0.005);
  ringGear.position.z = -0.15;
  g08Drum.add(ringGear);
  drumSpinGroup.add(tagPart(g08Drum, "08"));

  // Pinion mounted on cradle at 8 o'clock (-X, -Y) meshing with ring gear!
  // Center distance = R_ring (0.925) + R_pinion (0.925/12 = 0.0771) = 1.0021 m
  // Angle = -148.7 deg -> (-0.856, -0.521)
  const pinionPos = new THREE.Vector3(-0.856, -0.521, -0.15 + DRUM_Z_OFF);
  const pinionGroup = new THREE.Group();
  pinionGroup.position.copy(pinionPos);
  const pinionMesh = makeGearMesh(12, ringPitchR / 12, 0.065, brassMat, 0.022);
  pinionGroup.add(pinionMesh);
  const pinionShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.38, 16), tireSteelMat);
  pinionShaft.rotation.x = Math.PI / 2;
  pinionShaft.position.z = -0.05;
  pinionGroup.add(pinionShaft);
  cradlePivot.add(tagPart(pinionGroup, "08"));

  // =========================================================================
  // 07: 181 cm TUPPERWARE VAULT LID + SWING-DAVIT HINGE (mounted on cradle)
  // =========================================================================
  const davitHinge = new THREE.Group();
  davitHinge.position.set(1.04, 0, L / 2 + DRUM_Z_OFF + 0.03); // Hinge post on right (+X) mouth rim
  cradlePivot.add(davitHinge);

  const g07 = new THREE.Group();
  // Swing arm reaching from hinge (x=0) to lid center (x=-1.04)
  const davitArm = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.06, 0.06), steelFrameMat);
  davitArm.position.set(-0.52, 0, 0.09);
  g07.add(davitArm);
  // Hinge post + gas-strut cylinder
  const hingePost = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.42, 16), tireSteelMat);
  hingePost.position.set(0, 0, -0.12);
  g07.add(hingePost);
  // Domed steel Tupperware-style vault lid (181 cm OD)
  const lidCenter = new THREE.Group();
  lidCenter.position.set(-1.04, 0, 0);
  const lidSkirt = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.025, R + 0.025, 0.05, 64, 1, true), epdmMat);
  lidSkirt.rotation.x = Math.PI / 2;
  lidSkirt.position.z = -0.02;
  lidCenter.add(lidSkirt);
  const lidPlate = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.022, R + 0.022, 0.022, 64), steamerMat);
  lidPlate.rotation.x = Math.PI / 2;
  lidPlate.position.z = 0.01;
  lidCenter.add(lidPlate);
  const lidDome = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.65, R * 0.92, 0.065, 56), steamerMat);
  lidDome.rotation.x = Math.PI / 2;
  lidDome.position.z = 0.048;
  lidCenter.add(lidDome);
  // Radial ribs + 8 Over-center Toggle Latches around lid edge
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.03, R * 1.65, 0.025), tireSteelMat);
    rib.rotation.z = a;
    rib.position.z = 0.06;
    if (i < 4) lidCenter.add(rib);

    const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.09, 0.065), clampRedMat);
    clamp.position.set(Math.cos(a) * (R + 0.035), Math.sin(a) * (R + 0.035), -0.015);
    clamp.rotation.z = a + Math.PI / 2;
    lidCenter.add(clamp);
  }
  g07.add(lidCenter);
  davitHinge.add(tagPart(g07, "07"));

  // =========================================================================
  // 09 & 10: DUAL-DRIVE GEARBOX, MOTOR/GX160 & 35cm HUMAN HAND CRANK
  // Mounted on -X side of cradle so pinion stays aligned & crank sits at waist height!
  // =========================================================================
  const g09 = new THREE.Group();
  g09.position.set(-1.12, -0.52, -0.08 + DRUM_Z_OFF);
  const gbHousing = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 0.44), darkIronMat);
  g09.add(gbHousing);
  // Dog-clutch selector lever on top
  const clutchLever = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.22, 12), tireSteelMat);
  clutchLever.position.set(0, 0.24, 0.08);
  clutchLever.rotation.z = 0.22;
  g09.add(clutchLever);
  const clutchKnob = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 12), clampRedMat);
  clutchKnob.position.set(-0.025, 0.34, 0.08);
  g09.add(clutchKnob);
  // Visible chain sprocket & ratchet wheel on outer face
  const interGear = makeGearMesh(28, 0.14, 0.03, tireSteelMat, 0.02);
  interGear.rotation.y = Math.PI / 2;
  interGear.position.set(-0.13, 0, -0.06);
  g09.add(interGear);
  cradlePivot.add(tagPart(g09, "09"));

  // 10A: Electric Motor / Petrol Engine block behind gearbox
  const g10 = new THREE.Group();
  g10.position.set(-1.12, -0.52, -0.45 + DRUM_Z_OFF);
  const motorUnit = new THREE.Group();
  const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.32, 24), motorMat);
  motorBody.rotation.x = Math.PI / 2;
  motorUnit.add(motorBody);
  for (let f = 0; f < 10; f++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.012, 0.24), motorMat);
    fin.rotation.z = (f / 10) * Math.PI;
    motorUnit.add(fin);
  }
  g10.add(motorUnit);

  // Petrol GX160 visual variant
  const petrolUnit = new THREE.Group();
  const blockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.26), darkIronMat);
  petrolUnit.add(blockMesh);
  const tankMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.11, 0.22), clampRedMat);
  tankMesh.position.set(0, 0.16, 0);
  petrolUnit.add(tankMesh);
  const shroudMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.07, 18), clampRedMat);
  shroudMesh.rotation.z = Math.PI / 2;
  shroudMesh.position.set(-0.15, -0.02, 0);
  petrolUnit.add(shroudMesh);
  petrolUnit.visible = false;
  g10.add(petrolUnit);

  // 10B: Ergonomic 35 cm Hand Crank projecting to -X operator side
  const crankPivot = new THREE.Group();
  crankPivot.position.set(-1.28, -0.52, 0.06 + DRUM_Z_OFF);
  const crankBoss = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.08, 16), tireSteelMat);
  crankBoss.rotation.z = Math.PI / 2;
  crankPivot.add(crankBoss);
  const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.38, 0.045), brassMat);
  crankArm.position.set(-0.04, MACHINE.crankRadiusM / 2, 0);
  crankPivot.add(crankArm);
  const crankHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.16, 16), humanApronMat);
  crankHandle.rotation.z = Math.PI / 2;
  crankHandle.position.set(-0.12, MACHINE.crankRadiusM, 0);
  crankPivot.add(crankHandle);
  // Opposite twin crank (for 2-person mode)
  const crankTwin = new THREE.Group();
  const arm2 = crankArm.clone();
  arm2.position.y = -MACHINE.crankRadiusM / 2;
  crankTwin.add(arm2);
  const handle2 = crankHandle.clone();
  handle2.position.y = -MACHINE.crankRadiusM;
  crankTwin.add(handle2);
  crankTwin.visible = false;
  cradlePivot.add(tagPart(g10, "10"));
  cradlePivot.add(tagPart(crankPivot, "10"));
  crankPivot.add(crankTwin);

  // =========================================================================
  // 171 cm HUMAN SCALE FIGURE (ALDI) + HEIGHT COMPARISON GAUGE
  // Exact total height = 1.710 m from Y = 0.00 to Y = 1.710!
  // =========================================================================
  const humanGroup = new THREE.Group();
  humanGroup.position.set(-1.68, 0, 0.14);
  const addHumanLimb = (parent, rTop, rBot, len, mat, yOffset = -len / 2) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, len, 14), mat);
    m.position.y = yOffset;
    parent.add(m);
    return m;
  };
  // Boots + Legs (0 -> 0.88 m)
  for (const zSide of [-0.11, 0.11]) {
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.10), epdmMat);
    boot.position.set(0.04, 0.04, zSide);
    humanGroup.add(boot);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.82, 12), humanBodyMat);
    leg.position.set(0, 0.48, zSide);
    humanGroup.add(leg);
  }
  // Pelvis + Torso + Work Apron (0.88 -> 1.44 m)
  const torsoPivot = new THREE.Group();
  torsoPivot.position.set(0, 0.90, 0);
  humanGroup.add(torsoPivot);

  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.135, 0.50, 14), humanBodyMat);
  torso.scale.set(0.75, 1, 1.22);
  torso.position.set(0, 0.25, 0);
  torsoPivot.add(torso);
  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.165, 14, 12), humanBodyMat);
  shoulders.scale.set(0.72, 0.42, 1.45);
  shoulders.position.set(0, 0.46, 0);
  torsoPivot.add(shoulders);
  const apron = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.145, 0.40, 14, 1, false, -Math.PI * 0.45, Math.PI * 0.9), humanApronMat);
  apron.scale.set(0.78, 1, 1.18);
  apron.rotation.y = Math.PI / 2;
  apron.position.set(0.015, 0.19, 0);
  torsoPivot.add(apron);

  // Neck & Head (top of head = 1.71 m exact!)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.07, 12), humanSkinMat);
  neck.position.set(0, 0.555, 0);
  torsoPivot.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 18, 16), humanSkinMat);
  head.scale.set(0.95, 1.12, 0.9);
  head.position.set(0, 0.692, 0); // 0.90 + 0.692 + 0.105*1.12 = 1.710 m exact!
  torsoPivot.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.108, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), epdmMat);
  hair.position.set(-0.005, 0.70, 0);
  torsoPivot.add(hair);

  // Articulated Right & Left Arms (reaching toward +X crank handle)
  const rShoulder = new THREE.Group();
  rShoulder.position.set(0, 0.48, 0.23);
  torsoPivot.add(rShoulder);
  addHumanLimb(rShoulder, 0.048, 0.042, 0.28, humanBodyMat);
  const rElbow = new THREE.Group();
  rElbow.position.set(0, -0.28, 0);
  rShoulder.add(rElbow);
  addHumanLimb(rElbow, 0.04, 0.032, 0.26, humanSkinMat);

  const lShoulder = new THREE.Group();
  lShoulder.position.set(0, 0.48, -0.23);
  torsoPivot.add(lShoulder);
  addHumanLimb(lShoulder, 0.048, 0.042, 0.28, humanBodyMat);
  const lElbow = new THREE.Group();
  lElbow.position.set(0, -0.28, 0);
  lShoulder.add(lElbow);
  addHumanLimb(lElbow, 0.04, 0.032, 0.26, humanSkinMat);

  scene.add(tagPart(humanGroup, "human"));

  // Height Comparison Ruler & Clean Non-Overlapping Scale Badges (171 cm Human vs 179 cm Drum)
  const rulerGroup = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.71, 10), new THREE.MeshBasicMaterial({ color: 0x42c88a }));
  pole.position.set(-2.02, 0.855, 0.14);
  rulerGroup.add(pole);

  const capBar = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.012, 0.012), new THREE.MeshBasicMaterial({ color: 0x42c88a }));
  capBar.position.set(-1.84, 1.71, 0.14);
  rulerGroup.add(capBar);
  const humanBadge = makeScaleRulerSprite("ALDI: 171 cm", "#42c88a");
  humanBadge.position.set(-1.72, 1.94, 0.14);
  rulerGroup.add(humanBadge);

  const drumBadge = makeScaleRulerSprite("STEAMER: 179×179 cm", "#d99b38");
  drumBadge.position.set(0.35, 2.52, 0.08);
  rulerGroup.add(drumBadge);
  scene.add(rulerGroup);

  // =========================================================================
  // WOVEN BAMBOO KERANJANG (UNLOAD RECEPTACLE)
  // =========================================================================
  const keranjang = new THREE.Group();
  keranjang.position.set(0, 0, 1.38);
  const basketWall = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.30, 0.42, 24, 1, true), bambooMat);
  basketWall.position.y = 0.21;
  keranjang.add(basketWall);
  const basketBase = new THREE.Mesh(new THREE.CircleGeometry(0.30, 24), bambooMat);
  basketBase.rotation.x = -Math.PI / 2;
  basketBase.position.y = 0.01;
  keranjang.add(basketBase);
  const basketRim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.018, 8, 28), bambooMat);
  basketRim.rotation.x = Math.PI / 2;
  basketRim.position.y = 0.42;
  keranjang.add(basketRim);
  scene.add(keranjang);

  // =========================================================================
  // 1,800 SHREDDED TOBACCO PARTICLES (REAL-TIME CASCADING + MIXING INDEX)
  // =========================================================================
  const PARTICLE_COUNT = 1650;
  const strandGeo = new THREE.BoxGeometry(0.055, 0.012, 0.018);
  const strandMat = new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0.02 });
  const strandMesh = new THREE.InstancedMesh(strandGeo, strandMat, PARTICLE_COUNT);
  strandMesh.castShadow = false;
  strandMesh.receiveShadow = true;
  // Particle mesh lives in cradlePivot local space (translated to drum center) so it tilts WITH the drum!
  const particleHolder = new THREE.Group();
  particleHolder.position.set(0, 0, DRUM_Z_OFF);
  particleHolder.add(strandMesh);
  cradlePivot.add(particleHolder);

  const pPos = new Float32Array(PARTICLE_COUNT * 3);
  const pVel = new Float32Array(PARTICLE_COUNT * 3);
  const pType = new Uint8Array(PARTICLE_COUNT);
  const pRot = new Float32Array(PARTICLE_COUNT * 2);
  const pState = new Uint8Array(PARTICLE_COUNT); // 0 = inside drum, 1 = pouring out into keranjang

  const dummy = new THREE.Object3D();

  function resetTobaccoBatch(batchKg = 150) {
    const fillFrac = Math.min(0.65, Math.max(0.08, batchKg / 750));
    const maxAngle = 0.7 + fillFrac * 1.4;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Stratified initial loading: 3 distinct varieties layered radially & axially!
      const variety = i < PARTICLE_COUNT / 3 ? 0 : i < (PARTICLE_COUNT * 2) / 3 ? 1 : 2;
      pType[i] = variety;
      strandMesh.setColorAt(i, TOBACCO_COLORS[variety]);

      const theta = -Math.PI / 2 + (((i * 73) % 100) / 100 - 0.5) * maxAngle;
      const radFrac = 0.62 + 0.34 * (((i * 37) % 100) / 100);
      const r = R * radFrac;
      // Layer varieties cleanly along Z & height so mixing progress starts near ~15% and climbs to 95%+!
      const zBand =
        variety === 0
          ? -L * 0.34 + (((i * 19) % 100) / 100) * (L * 0.25)
          : variety === 1
          ? -L * 0.08 + (((i * 23) % 100) / 100) * (L * 0.24)
          : L * 0.16 + (((i * 29) % 100) / 100) * (L * 0.26);

      pPos[i * 3] = Math.cos(theta) * r;
      pPos[i * 3 + 1] = Math.sin(theta) * r;
      pPos[i * 3 + 2] = zBand;
      pVel[i * 3] = pVel[i * 3 + 1] = pVel[i * 3 + 2] = 0;
      pRot[i * 2] = ((i * 13) % 314) / 50;
      pRot[i * 2 + 1] = ((i * 29) % 314) / 50;
      pState[i] = 0;
    }
    if (strandMesh.instanceColor) strandMesh.instanceColor.needsUpdate = true;
  }

  function computeMixingUniformity() {
    // 3x2x4 = 24 spatial bins inside drum -> entropy / balance across the 3 varieties
    const bins = new Int16Array(24 * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (pState[i] !== 0) continue;
      const x = pPos[i * 3];
      const y = pPos[i * 3 + 1];
      const z = pPos[i * 3 + 2];
      const bx = x < -0.25 ? 0 : x > 0.25 ? 2 : 1;
      const by = y < -0.42 ? 0 : 1;
      const bz = Math.max(0, Math.min(3, Math.floor(((z + L / 2) / L) * 4)));
      const idx = (bz * 6 + by * 3 + bx) * 3 + pType[i];
      bins[idx]++;
    }
    let scoreSum = 0;
    let activeBins = 0;
    for (let b = 0; b < 24; b++) {
      const c0 = bins[b * 3];
      const c1 = bins[b * 3 + 1];
      const c2 = bins[b * 3 + 2];
      const tot = c0 + c1 + c2;
      if (tot < 10) continue;
      activeBins++;
      const p0 = c0 / tot;
      const p1 = c1 / tot;
      const p2 = c2 / tot;
      // Ideal uniform = 1/3 each; max L1 distance = 4/3
      const dev = Math.abs(p0 - 1 / 3) + Math.abs(p1 - 1 / 3) + Math.abs(p2 - 1 / 3);
      scoreSum += Math.max(0, 1 - dev / 1.15);
    }
    if (activeBins === 0) return 0;
    return Math.min(99, Math.round((scoreSum / activeBins) * 100));
  }

  // =========================================================================
  // INTERACTIVE STATE & ANIMATION LOOP
  // =========================================================================
  const state = {
    driveId: "engine-electric",
    drumRpm: 10.6,
    gearRatio: 12,
    tiltDeg: 25,
    batchKg: 150,
    explode: 0,
    cutaway: true,
    lidOpen: false,
    showRuler: true,
    running: true,
    drumAngle: 0,
    crankAngle: 0,
    lidAngle: 0,
    mixPct: 12,
    frameCounter: 0,
    stalled: false,
    selectedPart: null,
  };

  resetTobaccoBatch(state.batchKg);

  function setCutaway(enabled) {
    state.cutaway = enabled;
    shellFull.visible = !enabled;
    cutawaySolid.visible = enabled;
    cutawayGlass.visible = enabled;
  }
  setCutaway(true);

  function setExplode(val) {
    state.explode = Math.max(0, Math.min(1, val));
    const e = state.explode;
    g01.position.y = -e * 0.16;
    g02.position.y = -e * 0.05;
    g04.position.y = -e * 0.25;
    g06.position.z = e * 0.95; // Helical flights slide straight out mouth!
    davitHinge.position.z = L / 2 + DRUM_Z_OFF + 0.03 + e * 1.15;
    g08Drum.position.z = -e * 0.42;
    pinionGroup.position.x = -0.856 - e * 0.35;
    g09.position.x = -1.12 - e * 0.52;
    g10.position.x = -1.12 - e * 0.72;
    crankPivot.position.x = -1.28 - e * 0.78;
  }

  function applyState(next) {
    const prevBatch = state.batchKg;
    Object.assign(state, next);
    if (next.cutaway !== undefined) setCutaway(next.cutaway);
    if (next.explode !== undefined) setExplode(next.explode);
    if (next.showRuler !== undefined) rulerGroup.visible = !!next.showRuler;

    const isPetrol = state.driveId === "engine-petrol";
    const isHuman = state.driveId.startsWith("human");
    motorUnit.visible = !isPetrol;
    petrolUnit.visible = isPetrol;
    crankTwin.visible = state.driveId === "human-2";
    clutchKnob.position.x = isHuman ? -0.06 : 0.03;

    if (Math.abs(state.batchKg - prevBatch) > 20) {
      resetTobaccoBatch(state.batchKg);
    }
  }

  function setCameraPreset(preset) {
    const presets = {
      overview: { pos: [-3.95, 2.55, 4.45], target: [-0.22, 1.44, 0.12] },
      cutaway: { pos: [-2.15, 2.25, 2.45], target: [0.05, 1.45, 0.08] },
      gearbox: { pos: [-2.25, 1.22, 2.18], target: [-1.08, 1.04, -0.05] },
      lid: { pos: [1.95, 2.25, 2.55], target: [0.1, 1.65, 0.95] },
      unload: { pos: [-2.25, 1.38, 2.95], target: [0.0, 0.65, 1.05] },
    };
    const p = presets[preset] || presets.overview;
    camera.position.set(...p.pos);
    controls.target.set(...p.target);
    controls.update();
  }

  // Click part raycasting
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downPos = null;
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
    const hit = hits.find((h) => h.object?.userData?.partId);
    if (hit && onPartSelect) {
      const id = hit.object.userData.partId;
      state.selectedPart = id;
      onPartSelect(id, PART_META[id]);
    }
  });

  function stepTobaccoParticles(dt, omegaDrum, tiltRad) {
    const sinT = Math.sin(tiltRad);
    const cosT = Math.cos(tiltRad);
    const gravY = -9.81 * cosT;
    const gravZ = -9.81 * sinT; // +tiltDeg lifts mouth (+Z), pulling tobacco back toward -Z! -tiltDeg pours toward +Z!
    const effR = R - 0.05;
    const fillLimit = 0.08 + Math.min(0.55, state.batchKg / 720);
    const activeCutoffY = -effR + fillLimit * 1.8 * effR;
    const isPouring = state.lidOpen && state.tiltDeg < -4;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      if (pState[i] === 1) {
        // Falling into keranjang in cradle space
        pVel[ix + 1] += gravY * dt;
        pVel[ix + 2] += gravZ * dt + 0.9 * dt;
        pPos[ix] += pVel[ix] * dt;
        pPos[ix + 1] += pVel[ix + 1] * dt;
        pPos[ix + 2] += pVel[ix + 2] * dt;

        // Land inside keranjang floor (~y = -1.15 in tilted cradle local at unload)
        if (pPos[ix + 1] < -1.15) {
          pPos[ix + 1] = -1.15 + ((i % 7) * 0.015);
          pVel[ix] *= 0.2;
          pVel[ix + 1] = 0;
          pVel[ix + 2] *= 0.2;
        }
        continue;
      }

      let x = pPos[ix];
      let y = pPos[ix + 1];
      let z = pPos[ix + 2];
      let vx = pVel[ix];
      let vy = pVel[ix + 1];
      let vz = pVel[ix + 2];

      const r = Math.hypot(x, y);
      const ang = Math.atan2(y, x);
      const nearWall = r > effR - 0.20;
      const inLiftingQuad = y < 0.55 && x * omegaDrum > -0.25;

      if (nearWall && inLiftingQuad && Math.abs(omegaDrum) > 0.005) {
        // Carried along rotating drum wall + helical flight push!
        const tangentX = -Math.sin(ang);
        const tangentY = Math.cos(ang);
        const carrySpeed = omegaDrum * r;
        vx += (tangentX * carrySpeed - vx) * Math.min(1, dt * 11);
        vy += (tangentY * carrySpeed - vy) * Math.min(1, dt * 11);
        // Alternating axial helical dispersion (+z on one flight, -z on adjacent)
        const sector = Math.floor((((ang + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 2))) % 2;
        const helixSign = sector === 0 ? 1 : -1;
        vz += helixSign * Math.abs(omegaDrum) * 0.48 * dt;
      } else {
        // Free cascading waterfall avalanche
        vx += (Math.sin(i * 1.7 + state.drumAngle) * 0.4 - vx * 1.4) * dt;
        vy += gravY * dt;
        vz += (gravZ * 0.65 - vz * 1.8) * dt;
      }

      x += vx * dt;
      y += vy * dt;
      z += vz * dt;

      // Cylindrical wall containment
      const nr = Math.hypot(x, y);
      if (nr > effR) {
        const s = effR / nr;
        x *= s;
        y *= s;
        vx *= 0.4;
        vy *= 0.4;
      }
      // Keep pile settled softly in bottom pool when stopped
      if (Math.abs(omegaDrum) < 0.005 && y > activeCutoffY) {
        vy -= 4.5 * dt;
      }
      // Closed bottom end (-L/2)
      if (z < -L / 2 + 0.05) {
        z = -L / 2 + 0.05;
        vz = Math.abs(vz) * 0.3;
      }
      // Mouth (+L/2): closed by Tupperware lid unless open & tilted down!
      if (z > L / 2 - 0.05) {
        if (isPouring && y < 0.1) {
          pState[i] = 1; // Spill out into keranjang!
          vz = 0.55;
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

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      dummy.position.set(pPos[ix], pPos[ix + 1], pPos[ix + 2]);
      dummy.rotation.set(pRot[i * 2] + state.drumAngle * 0.3, pRot[i * 2 + 1], 0);
      dummy.updateMatrix();
      strandMesh.setMatrixAt(i, dummy.matrix);
    }
    strandMesh.instanceMatrix.needsUpdate = true;
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

    // Smooth cradle tilt & lid swing
    const targetTiltRad = (state.tiltDeg * Math.PI) / 180;
    cradlePivot.rotation.x += (-targetTiltRad - cradlePivot.rotation.x) * Math.min(1, dt * 8);
    tiltHandwheel.rotation.x = cradlePivot.rotation.x * 8;

    const targetLidAngle = state.lidOpen ? 1.82 : 0; // Swings 104 deg cleanly open on davit!
    state.lidAngle += (targetLidAngle - state.lidAngle) * Math.min(1, dt * 6);
    davitHinge.rotation.y = state.lidAngle;

    const effectiveRpm = state.running && !state.stalled ? state.drumRpm : 0;
    const omegaDrum = (effectiveRpm * 2 * Math.PI) / 60;
    state.drumAngle += omegaDrum * dt;
    state.crankAngle += omegaDrum * state.gearRatio * dt;

    // Synchronized mechanical rotations (drum, 144T ring, 12T pinion, trunnion rollers, crank)
    drumSpinGroup.rotation.z = state.drumAngle;
    pinionGroup.rotation.z = -state.drumAngle * 12; // 12:1 opposite mesh
    interGear.rotation.x = state.drumAngle * Math.min(24, state.gearRatio);
    crankPivot.rotation.x = state.crankAngle;
    for (const rMesh of rollerMeshes) rMesh.rotation.y = -state.drumAngle * (R / 0.085);

    // Human kinematic posing
    const isHumanMode = state.driveId.startsWith("human");
    if (isHumanMode) {
      // Position operator beside the crank handle
      humanGroup.position.x += (-1.70 - humanGroup.position.x) * Math.min(1, dt * 5);
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
      // Safe inspection stance beside machine
      humanGroup.position.x += (-1.92 - humanGroup.position.x) * Math.min(1, dt * 5);
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
    getParts: () => PART_META,
    destroy: () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    },
  };
}
