/**
 * Real mechanical & biomechanical physics model for the 179cm x 179cm
 * Oyster Mushroom Baglog Steamer -> Tobacco Dry-Blending Tumbler Mixer.
 * All SI units internally (meters, kg, rad/s, N*m, Watts); UI formats cm / kgf / RPM.
 */

export const MACHINE = {
  drumDiameterM: 1.79,
  drumRadiusM: 0.895,
  drumLengthM: 1.79,
  drumMassKg: 295, // ~235kg steamer cylinder + ~60kg tire bands, 144T ring gear, 4 flights, vault rim
  lidMassKg: 48,   // 181cm reinforced lid + EPDM U-channel Tupperware gasket + toggle hardware
  humanHeightM: 1.71, // Aldi's exact height
  pivotHeightM: 1.35, // Trunnion cradle pivot height above workshop floor
  ringTeeth: 144,
  pinionTeeth: 12,
  ringRatio: 12, // 144 / 12 = 12:1 final stage on drum barrel
  crankRadiusM: 0.35,
  pedalCrankRadiusM: 0.175,
  tobaccoBulkDensityKgM3: 185, // Shredded dry tembakau rajangan (loose fluffed)
  dynamicReposeDeg: 36,
  rollingFrictionCoeff: 0.012,
  thrustFrictionCoeff: 0.015,
  thrustRadiusM: 0.09,
  sealDragNm: 18,
  maxGentleTipSpeedMs: 1.25, // Above ~1.25 m/s rajangan strands crumble into bubuk dust
  g: 9.81,
};

export const DRUM_VOLUME_M3 =
  Math.PI * MACHINE.drumRadiusM * MACHINE.drumRadiusM * MACHINE.drumLengthM; // 4.5048 m^3

export const DRIVE_MODES = {
  "engine-electric": {
    id: "engine-electric",
    label: "Electric Motor 3 HP (2.2 kW)",
    kind: "engine",
    ratedPowerW: 2200,
    peakTorqueMotorNm: 32, // breakdown ~2.2x rated 14.5 Nm
    ratedTorqueMotorNm: 14.5,
    baseInputRpm: 1450,
    reducerRatio: 10, // WPWDX-100 worm/helical 1:10 -> 145 RPM at pinion shaft
    efficiency: 0.78,
    defaultGear: "12:1",
    minThrottle: 0.25,
    maxThrottle: 1.4,
    defaultThrottle: 0.92,
  },
  "engine-petrol": {
    id: "engine-petrol",
    label: "Petrol Engine GX160 (5.5 HP)",
    kind: "engine",
    ratedPowerW: 4050,
    peakTorqueMotorNm: 10.3, // GX160 peak @ 2500 RPM
    ratedTorqueMotorNm: 8.8,
    baseInputRpm: 2500,
    reducerRatio: 15, // 6:1 wet clutch + 2.5:1 chain -> 166 RPM max at pinion
    efficiency: 0.74,
    defaultGear: "12:1",
    minThrottle: 0.4, // centrifugal clutch engages above ~1100 engine RPM
    maxThrottle: 1.45,
    defaultThrottle: 0.85,
  },
  "human-1": {
    id: "human-1",
    label: "1 Person Hand Crank",
    kind: "human",
    workers: 1,
    sustainedPowerW: 95,
    burstPowerW: 175,
    comfortableForceN: 115, // ~11.7 kgf continuous
    stallForceN: 225,       // ~22.9 kgf hard mechanical stall limit
    armRadiusM: MACHINE.crankRadiusM,
    nominalCadenceRpm: 45,
    defaultGear: "72:1",
  },
  "human-2": {
    id: "human-2",
    label: "2 People Twin Cranks",
    kind: "human",
    workers: 2,
    sustainedPowerW: 185,
    burstPowerW: 340,
    comfortableForceN: 220, // combined across opposed handles
    stallForceN: 430,
    armRadiusM: MACHINE.crankRadiusM,
    nominalCadenceRpm: 45,
    defaultGear: "72:1",
  },
  "human-pedal": {
    id: "human-pedal",
    label: "1 Person Pedal Drive",
    kind: "human",
    workers: 1,
    sustainedPowerW: 180,
    burstPowerW: 340,
    comfortableForceN: 260, // legs on 17.5cm crank
    stallForceN: 520,
    armRadiusM: MACHINE.pedalCrankRadiusM,
    nominalCadenceRpm: 60,
    defaultGear: "72:1",
  },
};

export const GEARS = {
  "12:1": {
    id: "12:1",
    label: "12:1 Direct Ring (Engine / Test)",
    totalRatio: 12,
    chainStageRatio: 1,
    efficiency: 0.86,
  },
  "24:1": {
    id: "24:1",
    label: "24:1 Fast Manual (2:1 x 12:1)",
    totalRatio: 24,
    chainStageRatio: 2,
    efficiency: 0.80,
  },
  "72:1": {
    id: "72:1",
    label: "72:1 Heavy Low (6:1 x 12:1)",
    totalRatio: 72,
    chainStageRatio: 6,
    efficiency: 0.74,
  },
};

/**
 * Solve central angle beta (rad) of circular segment for fill fraction f in [0, 1]:
 * (beta - sin(beta)) / (2 * pi) = f
 */
export function solveSegmentAngle(fillFraction) {
  const f = Math.max(0, Math.min(0.95, fillFraction));
  if (f <= 1e-6) return 0;
  const target = 2 * Math.PI * f;
  let beta = Math.PI * Math.pow(f, 0.35);
  for (let i = 0; i < 16; i++) {
    const err = beta - Math.sin(beta) - target;
    const deriv = 1 - Math.cos(beta);
    if (Math.abs(deriv) > 1e-6) beta -= err / deriv;
    beta = Math.max(0.01, Math.min(2 * Math.PI - 0.01, beta));
  }
  return beta;
}

/**
 * Exact centroid radius r_cm (m) from drum centerline of a circular segment fill f.
 */
export function segmentCentroidRadiusM(fillFraction) {
  const R = MACHINE.drumRadiusM;
  if (fillFraction <= 0.002) return R * 0.92;
  const beta = solveSegmentAngle(fillFraction);
  const denom = 3 * (beta - Math.sin(beta));
  if (denom < 1e-6) return R * 0.9;
  const sinHalf = Math.sin(beta / 2);
  return Math.min(R * 0.94, (4 * R * sinHalf * sinHalf * sinHalf) / denom);
}

/**
 * Compute full steady-state & dynamic performance snapshot.
 */
export function computeSimulationState({
  driveId = "engine-electric",
  gearId = "12:1",
  batchKg = 150,
  tiltDeg = 25,
  throttle = 0.92, // Engine throttle (0..1.45) or Human effort multiplier (0.4..1.8 of sustained)
}) {
  const drive = DRIVE_MODES[driveId] || DRIVE_MODES["engine-electric"];
  const gear = GEARS[gearId] || GEARS[drive.defaultGear] || GEARS["72:1"];
  const massTob = Math.max(5, Math.min(450, batchKg));
  const totalMass = MACHINE.drumMassKg + massTob;
  const tiltRad = (tiltDeg * Math.PI) / 180;
  const cosTilt = Math.max(0.25, Math.cos(tiltRad));
  const sinTiltAbs = Math.abs(Math.sin(tiltRad));

  const volumeM3 = massTob / MACHINE.tobaccoBulkDensityKgM3;
  const fillFraction = Math.min(0.85, volumeM3 / DRUM_VOLUME_M3);
  const rCm = segmentCentroidRadiusM(fillFraction);
  const reposeRad = (MACHINE.dynamicReposeDeg * Math.PI) / 180;

  // Torque at drum barrel
  const torqueLiftNm = massTob * MACHINE.g * cosTilt * rCm * Math.sin(reposeRad);
  const torqueRadialFrictionNm =
    MACHINE.rollingFrictionCoeff * totalMass * MACHINE.g * cosTilt * MACHINE.drumRadiusM;
  const torqueAxialFrictionNm =
    MACHINE.thrustFrictionCoeff * totalMass * MACHINE.g * sinTiltAbs * MACHINE.thrustRadiusM;
  const torqueTotalNm =
    torqueLiftNm + torqueRadialFrictionNm + torqueAxialFrictionNm + MACHINE.sealDragNm;

  // Critical speed Nc = (42.3 / sqrt(D)) * sqrt(cos(tilt))
  const criticalRpm = (42.3 / Math.sqrt(MACHINE.drumDiameterM)) * Math.sqrt(cosTilt);

  let drumRpm = 0;
  let inputRpm = 0;
  let shaftPowerW = 0;
  let inputPowerW = 0;
  let handleForceN = 0;
  let stalled = false;
  let overloadWarning = false;
  let statusText = "Optimal";
  let eta = gear.efficiency;

  if (drive.kind === "engine") {
    eta = drive.efficiency;
    const totalReduction = drive.reducerRatio * gear.totalRatio;
    const maxDrumTorqueCapNm = drive.peakTorqueMotorNm * totalReduction * eta;
    const ratedDrumTorqueCapNm = drive.ratedTorqueMotorNm * totalReduction * eta;

    if (torqueTotalNm > maxDrumTorqueCapNm) {
      stalled = true;
      drumRpm = 0;
      inputRpm = 0;
      statusText = "ENGINE STALLED — Reduce batch or add reduction";
    } else {
      // Slight speed droop under load (realistic slip / governor droop ~5-12%)
      const loadRatio = torqueTotalNm / ratedDrumTorqueCapNm;
      const droop = Math.min(0.22, loadRatio * 0.08);
      const targetEngineRpm = drive.baseInputRpm * throttle * (1 - droop);
      drumRpm = Math.max(0, targetEngineRpm / totalReduction);
      inputRpm = drumRpm * gear.totalRatio;
      const omega = (drumRpm * 2 * Math.PI) / 60;
      shaftPowerW = torqueTotalNm * omega;
      inputPowerW = shaftPowerW / eta;
      overloadWarning = loadRatio > 1.05;
      if (overloadWarning) statusText = "High Load (>105% rated torque)";
    }
  } else {
    // Human mode
    eta = gear.efficiency;
    const arm = drive.armRadiusM;
    const requiredCrankTorqueNm = torqueTotalNm / (gear.totalRatio * eta);
    handleForceN = requiredCrankTorqueNm / arm;

    if (handleForceN > drive.stallForceN) {
      stalled = true;
      drumRpm = 0;
      inputRpm = 0;
      statusText = "STALLED — Force exceeds human limit; shift to 72:1";
    } else {
      // Power-limited vs cadence-limited speed
      const availHumanPowerW = drive.sustainedPowerW * throttle;
      const maxOmegaFromPower = (availHumanPowerW * eta) / torqueTotalNm;
      const maxDrumRpmFromPower = (maxOmegaFromPower * 60) / (2 * Math.PI);
      const maxHumanCadenceRpm = drive.nominalCadenceRpm * Math.min(1.4, 0.75 + 0.45 * throttle);
      const maxDrumRpmFromCadence = maxHumanCadenceRpm / gear.totalRatio;

      drumRpm = Math.min(maxDrumRpmFromPower, maxDrumRpmFromCadence);
      inputRpm = drumRpm * gear.totalRatio;
      const omega = (drumRpm * 2 * Math.PI) / 60;
      shaftPowerW = torqueTotalNm * omega;
      inputPowerW = shaftPowerW / eta;

      if (handleForceN > drive.comfortableForceN) {
        overloadWarning = true;
        statusText = "Heavy Effort — Shift to 72:1 Low Gear";
      } else {
        statusText = "Human Turnable (Sustainable)";
      }
    }
  }

  const omegaDrum = (drumRpm * 2 * Math.PI) / 60;
  const tipSpeedMs = omegaDrum * MACHINE.drumRadiusM;
  const froude = (omegaDrum * omegaDrum * MACHINE.drumRadiusM) / (MACHINE.g * cosTilt);
  const pctCritical = (drumRpm / criticalRpm) * 100;

  let regime = "Stopped";
  if (!stalled && drumRpm > 0.01) {
    if (froude >= 0.70) regime = "Centrifuging (No Mixing!)";
    else if (froude >= 0.28) regime = "Cataracting (Bubuk Risk!)";
    else if (froude >= 0.08) regime = "Optimal Cascading";
    else if (froude >= 0.002) regime = "Gentle Rolling";
    else regime = "Slow Slumping";
  }

  // Strand damage (bubuk risk) rises above tip speed 1.25 m/s
  let bubukRisk = "Minimal (<1%)";
  if (tipSpeedMs > 1.85) bubukRisk = "SEVERE — Crushing Rajangan";
  else if (tipSpeedMs > MACHINE.maxGentleTipSpeedMs) bubukRisk = "Moderate — Slow Down";
  else if (drumRpm > 0.01) bubukRisk = "Safe (Gentle Cascade)";

  // Estimated revolutions to reach 95% homogeneity (~22 turns optimal cascade, ~16 gentle turns)
  const targetRevs = froude >= 0.7 ? Infinity : froude >= 0.08 ? 22 : 16;
  const estMixMinutes = drumRpm > 0.05 && Number.isFinite(targetRevs) ? targetRevs / drumRpm : null;

  return {
    massTob,
    totalMass,
    fillPct: fillFraction * 100,
    rCm,
    tiltDeg,
    torqueLiftNm,
    torqueFrictionNm: torqueRadialFrictionNm + torqueAxialFrictionNm + MACHINE.sealDragNm,
    torqueTotalNm,
    criticalRpm,
    drumRpm,
    inputRpm,
    tipSpeedMs,
    froude,
    pctCritical,
    shaftPowerW,
    inputPowerW,
    handleForceN,
    handleForceKgf: handleForceN / MACHINE.g,
    comfortableForceKgf: (drive.comfortableForceN || 0) / MACHINE.g,
    stallForceKgf: (drive.stallForceN || 0) / MACHINE.g,
    stalled,
    overloadWarning,
    statusText,
    regime,
    bubukRisk,
    estMixMinutes,
    gearRatio: gear.totalRatio,
    driveKind: drive.kind,
  };
}
