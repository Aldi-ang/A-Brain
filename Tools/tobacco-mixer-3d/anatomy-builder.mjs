import * as k from "./lib/iso-kit.mjs";

export const ANATOMY_PARTS = [
  {
    id: "01",
    name: "Steel Base Skid & Rubber Feet",
    indonesian: "Rangka Bawah UNP 100 + Kaki Karet",
    role: "Anchors the 650 kg loaded machine flat on workshop floor; absorbs vibration from engine and cascading tobacco.",
    spec: "UNP 100 / Hollow 100x50x3.2 mm steel, 220 x 215 cm footprint, 4 bolted rubber pads.",
    explode: [0, 0, -22],
  },
  {
    id: "02",
    name: "Twin A-Frame Trunnion Stanchions",
    indonesian: "Tiang Penyangga A-Frame + Pillow Block",
    role: "Carries pivoting U-cradle at 154 cm pivot height (CoG height) so tilting requires minimal force.",
    spec: "Hollow 80x80x3 mm A-legs, 2x UCP-210 50 mm trunnion pillow-block bearings.",
    explode: [0, 14, -8],
  },
  {
    id: "03",
    name: "Tilting U-Cradle & Worm Tilt Wheel",
    indonesian: "Rangka Ayun (Cradle) + Roda Kemiringan",
    role: "Holds drum, rollers, and gearbox together at all angles (-12 deg unload to +32 deg deep mix). Self-locking worm prevents sudden drops.",
    spec: "Curved channel cradle ring + self-locking worm quadrant handwheel (click in 3D to tilt).",
    explode: [0, 18, 8],
  },
  {
    id: "04",
    name: "4 Trunnion Rollers & Rear Thrust Hub",
    indonesian: "4 Roda Penumpu + Bearing Dorong Belakang",
    role: "Supports drum weight cleanly on external rolling tire tracks with mu=0.012 friction instead of stressing thin steamer bottom.",
    spec: "4x 150 mm polyurethane-on-steel guide rollers (206 bearings) + rear 51112 axial thrust hub.",
    explode: [-16, 0, 4],
  },
  {
    id: "05",
    name: "179x179 cm Baglog Steamer Cylinder",
    indonesian: "Tabung Steamer Baglog Jamur (179 x 179 cm)",
    role: "Existing mushroom steamer body (4,505 L). Modified only with bolt-on rolling tire bands and top flange lip.",
    spec: "179 cm diameter x 179 cm length (~2.5 mm stainless/mild steel), rolled stiffening chimes.",
    explode: [0, 0, 18],
  },
  {
    id: "06",
    name: "4 Helical Lifting Flights & Cross-Deflectors",
    indonesian: "4 Sirip Pengangkat Heliks + Pembelah Halus",
    role: "Lifts shredded rajangan gently to 11 o'clock and waterfalls it radially + axially for even blending with <1% bubuk dust.",
    spec: "4x 14 cm curved smooth SS304 scoops (18 deg helix) + 4x staggered cross-vanes; NO sharp blades.",
    explode: [0, 0, 38],
  },
  {
    id: "07",
    name: "181 cm Tupperware Vault Lid & Davit Hinge",
    indonesian: "Tutup Vault Model Tupperware + 8 Pengunci + Engsel Ayun",
    role: "Full-area sealing lid with EPDM U-gasket locks out dust and aroma; 8 toggle latches pop open before the gas-strut davit swings the 48 kg door aside.",
    spec: "181 cm flanged lid + EPDM U-channel gasket + 8 over-center toggle clamps + swing-davit arm.",
    explode: [-26, -16, 32],
  },
  {
    id: "08",
    name: "Center Twist-Lock Sample Inspection Cap",
    indonesian: "Tutup Kecil Cek Sampel & Aroma (Tengah Pintu)",
    role: "28 cm Tupperware-style twist cap right in the center of the main vault door. Lets grader check blend evenness & aroma without opening the 48 kg door.",
    spec: "28 cm quick-twist quarter-turn collar + silicone O-ring + knurled T-handle + safety chain.",
    explode: [-36, -24, 52],
  },
  {
    id: "09",
    name: "144T Bolt-On Ring Gear & 12T Pinion",
    indonesian: "Roda Gigi Cincin 144T + Pinion 12T (12:1)",
    role: "12:1 final reduction around the 179 cm barrel cuts gearbox torque by 12x and keeps mesh aligned at any tilt angle.",
    spec: "#60 roller-chain sprocket ring or segmented steel spur gear (PCD 184 cm, 144T : 12T).",
    explode: [26, 0, 12],
  },
  {
    id: "10",
    name: "Dual-Drive Compound Gearbox & Ratchet",
    indonesian: "Gearbox 2-Kecepatan + Kopling Pemilih + Ratchet",
    role: "Dog-clutch locks out crank when engine runs; offers 24:1 Fast Manual (50 kg) and 72:1 Heavy Low (300 kg) with anti-kickback ratchet.",
    spec: "Selector dog-clutch + 2:1 / 6:1 #50 roller chain stage + one-way ratchet pawl.",
    explode: [40, 14, 10],
  },
  {
    id: "11",
    name: "3 HP Engine / GX160 & 35 cm Crank / Pedal",
    indonesian: "Dudukan Mesin 3HP / GX160 + Engkol & Pedal",
    role: "Swappable 2.2 kW electric motor (1:10 reducer) or GX160 petrol engine, plus 35 cm hand crank or 180 W seated pedal module.",
    spec: "2.2 kW 4-pole motor (10.6 RPM drum), 35 cm crank (4.6 kgf @ 72:1), or seated foot pedal.",
    explode: [54, 24, 6],
  },
];

export function buildAnatomySvg({ explode = 0, selectedPartId = null, animated = true } = {}) {
  const W = 700;
  const H = 450;
  const BASE = { x: -72, y: -56, w: 168, d: 132, r: 4 };
  const P = k.fitProjection(
    [...k.boxCorners(BASE, -10, 140), [-92, -62, 0], [112, 92, 142]],
    W,
    H,
    { pad: 22, azimuth: 42, elevation: 30 }
  );

  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (pts, style) => k.dotsSvg(pts, style);
  const at = (p) => k.iso(p, P);
  const shiftFor = (part) => {
    if (explode <= 0.001) return "";
    const [ex, ey, ez] = part.explode.map((v) => v * explode);
    const o = k.iso([0, 0, 0], P);
    const p = k.iso([ex, ey, ez], P);
    return `transform="translate(${(p[0] - o[0]).toFixed(2)} ${(p[1] - o[1]).toFixed(2)})"`;
  };
  const wrap = (part, innerSvg, extraClass = "") => {
    const isSel = selectedPartId === part.id;
    const isDim = selectedPartId && !isSel;
    return `<g class="anat-part ${extraClass}${isSel ? " is-selected" : ""}${isDim ? " is-dim" : ""}" data-part="${part.id}" ${shiftFor(part)}>${innerSvg}</g>`;
  };

  // 01: Base skid & rubber feet
  const p01 = (() => {
    const out = [`<path fill="var(--anatomy-halo)" opacity="0.22" d="${k.haloOf(BASE, -5.5, 1, P)}"/>`];
    for (const [cx, cy] of k.corners(BASE, 14)) {
      out.push(S(k.cylinder(cx, cy, 4.8, -5, 1.8, P, 24), { tone: "lo" }));
      out.push(S(k.cylinder(cx, cy, 3.4, -3.2, 3.2, P, 24), { tone: "mid" }));
    }
    out.push(S(k.slabOf({ x: -66, y: -52, w: 158, d: 10, r: 1.5 }, 0, 6, P, 4, 0.8), { tone: "mid" }));
    out.push(S(k.slabOf({ x: -66, y: 44, w: 158, d: 10, r: 1.5 }, 0, 6, P, 4, 0.8), { tone: "mid" }));
    out.push(S(k.slabOf({ x: -66, y: -42, w: 10, d: 86, r: 1.2 }, 0, 6, P, 4, 0.6), { tone: "mid" }));
    out.push(S(k.slabOf({ x: 82, y: -42, w: 10, d: 86, r: 1.2 }, 0, 6, P, 4, 0.6), { tone: "mid" }));
    const strip = { x: -58, y: 55.5, w: 138, d: 5.5, r: 1 };
    out.push(S(k.slabOf(strip, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
    const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.6, 0.8, [1.6, 3.0], P);
    out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
    out.push(D(k.corners({ x: -66, y: -52, w: 158, d: 106 }, 5).map(([x, y]) => at([x, y, 6])), { size: 0.55, tone: "hi" }));
    return wrap(ANATOMY_PARTS[0], out.join(""));
  })();

  const p02Back = (() => {
    const out = [];
    out.push(S(k.slabOf({ x: -24, y: -51, w: 8, d: 8, r: 1 }, 6, 62, P, 4, 0.5), { tone: "mid" }));
    out.push(S(k.slabOf({ x: 16, y: -51, w: 8, d: 8, r: 1 }, 6, 62, P, 4, 0.5), { tone: "mid" }));
    out.push(S(k.slabOf({ x: -26, y: -52, w: 52, d: 10, r: 2 }, 66, 8, P, 4, 0.7), { tone: "mid" }));
    out.push(S(k.cylinder(0, -47, 6, 74, 4, P, 24), { tone: "hi" }));
    return wrap(ANATOMY_PARTS[1], out.join(""));
  })();

  const p04 = (() => {
    const out = [];
    out.push(S(k.cylinder(-48, 0, 8.5, 58, 8, P, 28), { tone: "hi" }));
    out.push(L(k.sideArc(-48, 0, 8.5, 62, P, 20), { tone: "faint" }));
    for (const [rx, ry] of [[-26, -34], [-26, 34], [22, -34], [22, 34]]) {
      out.push(S(k.cylinder(rx, ry, 5.5, 32, 6, P, 24), { tone: "hi" }));
      out.push(D([at([rx, ry, 38])], { size: 0.5, tone: "hi" }));
    }
    return wrap(ANATOMY_PARTS[3], out.join(""));
  })();

  const DR = 44.75;
  const p05 = (() => {
    const out = [];
    out.push(
      S(k.cylinder(0, 0, DR, 36, 22, P, 56, 0.8), {
        tone: "hi",
        inner: L(k.sideArc(0, 0, DR, 47, P, 30), { tone: "faint" }),
      })
    );
    out.push(S(k.cylinder(0, 0, DR + 1.8, 58, 6, P, 56), { tone: "mid" }));
    out.push(
      S(k.cylinder(0, 0, DR, 64, 34, P, 56, 0.8), {
        tone: "hi",
        inner: L(k.sideArc(0, 0, DR, 81, P, 30), { tone: "faint" }),
      })
    );
    out.push(S(k.cylinder(0, 0, DR + 1.8, 98, 6, P, 56), { tone: "mid" }));
    out.push(S(k.cylinder(0, 0, DR + 1.2, 104, 10, P, 56, 0.6), { tone: "hi" }));
    out.push(`<path class="iso-shade" data-shade="0" d="${k.ring(0, 0, DR - 2.2, 114, P, 56)}"/>`);
    out.push(L(k.ring(0, 0, DR - 2.2, 114, P, 56), { tone: "mid" }));
    const rimBolts = Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return at([(DR - 0.5) * Math.cos(a), (DR - 0.5) * Math.sin(a), 114]);
    });
    out.push(D(rimBolts, { size: 0.55, tone: "hi" }));
    return wrap(ANATOMY_PARTS[4], out.join(""));
  })();

  const [drumCx, drumCy] = at([0, 0, 104]);
  const p06 = (() => {
    const out = [];
    out.push(S(k.cylinder(0, 0, 5.5, 92, 22, P, 24), { tone: "lit", lit: true }));
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2 + 0.35;
      const vx = Math.cos(ang);
      const vy = Math.sin(ang);
      const tx = -vy;
      const ty = vx;
      const ring = [
        [vx * 7 + tx * 2, vy * 7 + ty * 2],
        [vx * 39 + tx * 4.5, vy * 39 + ty * 4.5],
        [vx * 41 - tx * 2, vy * 41 - ty * 2],
        [vx * 8 - tx * 2, vy * 8 - ty * 2],
      ];
      out.push(S(k.extrude(ring, 96, 17, P, { convex: true, bevel: 0.6 }), { tone: "lit", lit: true }));
    }
    return wrap(ANATOMY_PARTS[5], `<g class="${animated ? "anat-bob" : ""}" style="--cx:${drumCx.toFixed(1)}px;--cy:${drumCy.toFixed(1)}px">${out.join("")}</g>`);
  })();

  // 07: Vault Lid (hollow collar center for Sample Cap!)
  const p07 = (() => {
    const out = [];
    const LR = 46.2;
    out.push(S(k.cylinder(0, 0, LR + 0.6, 115.5, 2.2, P, 56), { tone: "lo" }));
    out.push(S(k.cylinder(0, 0, LR, 117.7, 3.8, P, 56, 0.9), { tone: "hi" }));
    out.push(S(k.cylinder(0, 0, LR * 0.72, 121.5, 3.2, P, 48, 0.8), { tone: "hi" }));
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.2;
      const cx = (LR + 1.5) * Math.cos(a);
      const cy = (LR + 1.5) * Math.sin(a);
      out.push(S(k.slabOf({ x: cx - 2.2, y: cy - 2.2, w: 4.4, d: 4.4, r: 0.8 }, 114, 5.2, P, 3), { tone: "hi" }));
    }
    out.push(S(k.slabOf({ x: -56, y: -3, w: 48, d: 6, r: 1.5 }, 124.5, 3.5, P, 4, 0.5), { tone: "mid" }));
    out.push(S(k.cylinder(-52, 0, 4.2, 86, 42, P, 24), { tone: "mid", crease: "none" }));
    const assistCoil = k.coil(-44, -14, [5, 119], 2.5, 5, "x", P);
    out.push(L(assistCoil.back, { tone: "lo" }));
    out.push(L(assistCoil.front, { tone: "mid" }));
    return wrap(ANATOMY_PARTS[6], out.join(""));
  })();

  // 08: Center Twist-Lock Sample Inspection Cap (LIT!)
  const p08Cap = (() => {
    const out = [];
    out.push(S(k.cylinder(0, 0, 11.5, 124.7, 2.0, P, 32), { tone: "lo" })); // Silicone gasket collar
    out.push(S(k.cylinder(0, 0, 10.2, 126.7, 3.2, P, 32, 0.7), { tone: "lit", lit: true }));
    out.push(L(k.knurl(0, 0, 10.2, 126.7, 129.9, 24, P, 0.2), { tone: "hi" }));
    out.push(S(k.slabOf({ x: -8, y: -2, w: 16, d: 4, r: 1.2 }, 129.9, 2.8, P, 3, 0.4), { tone: "lit", lit: true })); // T-handle
    return wrap(ANATOMY_PARTS[7], `<g class="${animated ? "anat-cap-pulse" : ""}">${out.join("")}</g>`);
  })();

  // 09: Ring Gear & Pinion
  const p09Gear = (() => {
    const out = [];
    out.push(S(k.cylinder(0, 0, 47.4, 49, 4.2, P, 64), { tone: "hi" }));
    out.push(L(k.knurl(0, 0, 47.4, 49, 53.2, 72, P, 0.2), { tone: "mid" }));
    out.push(S(k.cylinder(52.5, 0, 6.2, 48.5, 5.2, P, 24), { tone: "lit", lit: true }));
    out.push(L(k.knurl(52.5, 0, 6.2, 48.5, 53.7, 16, P, 0.2), { tone: "hi" }));
    return wrap(ANATOMY_PARTS[8], out.join(""));
  })();

  // 03: Front Cradle + Tilt Wheel
  const p03 = (() => {
    const out = [];
    out.push(S(k.slabOf({ x: -50, y: 40, w: 102, d: 6, r: 1.5 }, 28, 8, P, 4, 0.6), { tone: "mid" }));
    out.push(S(k.slabOf({ x: 46, y: -42, w: 7, d: 88, r: 1.5 }, 28, 8, P, 4, 0.6), { tone: "mid" }));
    out.push(S(k.cylinder(0, 60, 10, 62, 5, P, 32), { tone: "hi" }));
    out.push(L(k.knurl(0, 60, 10, 62, 67, 28, P), { tone: "lo" }));
    out.push(L(k.radialTicks(0, 60, 9, 24, 6, 67, [1.5, 3], P).major, { tone: "mid" }));
    return wrap(ANATOMY_PARTS[2], out.join(""));
  })();

  // 02 Front + 171cm Aldi Pole
  const p02Front = (() => {
    const out = [];
    out.push(S(k.slabOf({ x: -24, y: 45, w: 8, d: 8, r: 1 }, 6, 62, P, 4, 0.5), { tone: "mid" }));
    out.push(S(k.slabOf({ x: 16, y: 45, w: 8, d: 8, r: 1 }, 6, 62, P, 4, 0.5), { tone: "mid" }));
    out.push(S(k.slabOf({ x: -26, y: 44, w: 52, d: 10, r: 2 }, 66, 8, P, 4, 0.7), { tone: "mid" }));
    out.push(S(k.cylinder(0, 49, 6, 74, 4, P, 24), { tone: "hi" }));
    out.push(D([at([-16, 49, 74]), at([16, 49, 74])], { size: 0.55, tone: "hi" }));
    out.push(S(k.cylinder(-32, 74, 7, 0, 2.5, P, 24), { tone: "lo" }));
    out.push(S(k.cylinder(-32, 74, 1.8, 2.5, 83, P, 20), { tone: "mid", crease: "none" }));
    out.push(S(k.cylinder(-32, 74, 4.8, 84.5, 1.6, P, 24), { tone: "lit", lit: true }));
    out.push(D([at([-32, 74, 86.1])], { size: 0.75, tone: "hi" }));
    return wrap(ANATOMY_PARTS[1], out.join(""));
  })();

  // 10: Dual-Drive Gearbox
  const p10Box = (() => {
    const out = [];
    const BOX = { x: 54, y: -16, w: 28, d: 32, r: 2.5 };
    out.push(
      S(k.slabOf(BOX, 34, 24, P, 4, 0.8), {
        tone: "mid",
        inner: L(k.sideSeam(BOX, 46, P, 4), { tone: "faint" }),
      })
    );
    out.push(S(k.slabOf({ x: 48, y: -4.5, w: 15, d: 9, r: 2 }, 46, 8, P, 4, 0.4), { tone: "mid" }));
    out.push(S(k.cylinder(68, 0, 2.0, 58, 12, P, 18), { tone: "hi", crease: "none" }));
    out.push(S(k.cylinder(68, 0, 4.2, 70, 4.5, P, 24), { tone: "lit", lit: true }));
    out.push(L(k.knurl(68, 0, 4.2, 70, 74.5, 22, P), { tone: "lo" }));
    out.push(D(k.corners(BOX, 3).map(([x, y]) => at([x, y, 58])), { size: 0.45, tone: "hi" }));
    return wrap(ANATOMY_PARTS[9], out.join(""));
  })();

  // 11: Motor & Crank
  const p11Drive = (() => {
    const out = [];
    out.push(S(k.cylinder(82, -24, 9, 34, 18, P, 28, 0.5), { tone: "hi" }));
    out.push(L(k.knurl(82, -24, 9, 36, 50, 28, P), { tone: "mid" }));
    out.push(S(k.cylinder(82, -24, 5.5, 52, 4, P, 24), { tone: "mid" }));
    out.push(k.wireSvg(at([82, -15, 42]), at([76, -10, 42]), { tone: "mid", size: 1.3, flow: animated }));
    out.push(S(k.cylinder(78, 18, 2.2, 42, 4, P, 18), { tone: "hi" }));
    out.push(S(k.slabOf({ x: 76, y: 18, w: 4, d: 20, r: 1.5 }, 42, 3.2, P, 3), { tone: "lit", lit: true }));
    out.push(S(k.cylinder(78, 36, 2.4, 45.2, 10, P, 20), { tone: "lit", lit: true }));
    out.push(L(k.knurl(78, 36, 2.4, 46, 54, 16, P), { tone: "lo" }));
    return wrap(ANATOMY_PARTS[10], out.join(""));
  })();

  const body = [p01, p02Back, p04, p05, p06, p09Gear, p03, p02Front, p10Box, p11Drive, p07, p08Cap];
  return k.figureSvg({
    width: W,
    height: H,
    label: "Animated Isometric Anatomy cutaway of the 179x179cm Baglog Steamer Tobacco Mixer",
    body,
  });
}

export const ANATOMY_CSS =
  k.ISO_CSS +
  `
.iso{
  --anatomy-card:#15181e;--anatomy-page:#0f1115;--anatomy-lit:#d99b38;
  --anatomy-lit-top:#3a2c18;--anatomy-lit-shade:#292014;
}
.iso[data-theme="light"]{
  --anatomy-card:#faf8f4;--anatomy-page:#efede7;--anatomy-lit:#b45309;
  --anatomy-lit-top:#fef3c7;--anatomy-lit-shade:#fde68a;
  --anatomy-hi:#1f242c;--anatomy-mid:#5b6472;--anatomy-lo:#949ca8;--anatomy-faint:#d4d8df;
  --anatomy-halo:#cbd0d8;
}
.anat-part{cursor:pointer;transition:opacity 180ms ease,transform 420ms cubic-bezier(.32,.72,0,1)}
.anat-part.is-dim{opacity:.35}
.anat-part:hover,.anat-part.is-hover{opacity:1!important}
.anat-part:hover .iso-edge,.anat-part.is-hover .iso-edge{stroke:var(--anatomy-lit,#e5a93c)!important;stroke-width:1.4px!important}
.anat-part.is-selected .iso-edge{stroke:#e5a93c!important;stroke-width:1.5px!important}
@keyframes anatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes anatCap{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.anat-bob{animation:anatBob 2.8s ease-in-out infinite}
.anat-cap-pulse{animation:anatCap 3.2s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.anat-bob,.anat-cap-pulse{animation:none}}
`;
