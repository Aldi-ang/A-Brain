import assert from "node:assert/strict";
import { computeSimulationState, DRUM_VOLUME_M3, MACHINE, segmentCentroidRadiusM } from "./physics.mjs";

// 1. Exact steamer cylinder volume: pi * (0.895)^2 * 1.79 = 4.5048 m^3
assert.ok(Math.abs(DRUM_VOLUME_M3 - 4.5048) < 0.01, `Unexpected volume: ${DRUM_VOLUME_M3}`);

// 2. Centroid radius sanity: tiny fill near outer radius, half-full at 4R/(3pi) = 0.3798m
assert.ok(segmentCentroidRadiusM(0.05) > 0.78, "Small fill centroid must sit near drum wall");
const halfFull = segmentCentroidRadiusM(0.5);
assert.ok(Math.abs(halfFull - (4 * MACHINE.drumRadiusM) / (3 * Math.PI)) < 0.02, `Half-full centroid off: ${halfFull}`);

// 3. Direct 12:1 human crank on 300 kg MUST stall (proves why 72:1 compound gear is needed)
const directHeavy = computeSimulationState({
  driveId: "human-1",
  gearId: "12:1",
  batchKg: 300,
  tiltDeg: 25,
  throttle: 1.0,
});
assert.equal(directHeavy.stalled, true, "12:1 direct human crank at 300kg must stall");
assert.ok(directHeavy.handleForceKgf > 23, `Expected >23 kgf stall, got ${directHeavy.handleForceKgf}`);

// 4. Heavy Low 72:1 human crank on 300 kg MUST succeed cleanly under 7 kgf handle force
const lowGearHeavy = computeSimulationState({
  driveId: "human-1",
  gearId: "72:1",
  batchKg: 300,
  tiltDeg: 25,
  throttle: 1.0,
});
assert.equal(lowGearHeavy.stalled, false, "72:1 human crank at 300kg must turn");
assert.equal(lowGearHeavy.overloadWarning, false, "72:1 human crank at 300kg must be within comfortable force");
assert.ok(lowGearHeavy.handleForceKgf > 4 && lowGearHeavy.handleForceKgf < 8, `Handle force out of expected 4-8 kgf range: ${lowGearHeavy.handleForceKgf}`);
assert.ok(lowGearHeavy.drumRpm > 0.45 && lowGearHeavy.drumRpm < 1.0, `Expected slow realistic 0.5-0.9 RPM, got ${lowGearHeavy.drumRpm}`);

// 5. Light 50 kg batch on 24:1 Fast Manual MUST work easily for 1 person
const fastLight = computeSimulationState({
  driveId: "human-1",
  gearId: "24:1",
  batchKg: 50,
  tiltDeg: 25,
  throttle: 1.0,
});
assert.equal(fastLight.stalled, false);
assert.ok(fastLight.handleForceKgf < 6, `50kg at 24:1 should be light (<6 kgf), got ${fastLight.handleForceKgf}`);
assert.ok(fastLight.drumRpm > 1.5, `50kg at 24:1 should turn >1.5 RPM, got ${fastLight.drumRpm}`);

// 6. Electric 3HP Engine at 300 kg runs right in Optimal Cascading zone (9-14 RPM, safe tip speed)
const engineHeavy = computeSimulationState({
  driveId: "engine-electric",
  gearId: "12:1",
  batchKg: 300,
  tiltDeg: 25,
  throttle: 0.92,
});
assert.equal(engineHeavy.stalled, false);
assert.equal(engineHeavy.regime, "Optimal Cascading", `Got regime: ${engineHeavy.regime}`);
assert.ok(engineHeavy.drumRpm >= 9.5 && engineHeavy.drumRpm <= 13.5, `Got RPM: ${engineHeavy.drumRpm}`);
assert.ok(engineHeavy.tipSpeedMs <= MACHINE.maxGentleTipSpeedMs, `Tip speed too fast for rajangan: ${engineHeavy.tipSpeedMs}`);

// 7. Petrol GX160 5.5HP Engine at 300 kg runs cleanly without stalling
const petrolHeavy = computeSimulationState({
  driveId: "engine-petrol",
  gearId: "12:1",
  batchKg: 300,
  tiltDeg: 25,
  throttle: 0.85,
});
assert.equal(petrolHeavy.stalled, false);
assert.ok(petrolHeavy.drumRpm >= 10 && petrolHeavy.drumRpm <= 14);

console.log("physics.test.mjs: ALL 7 CHECKS PASSED");
console.log({
  direct300kg_forceKgf: +directHeavy.handleForceKgf.toFixed(1),
  low72_300kg_forceKgf: +lowGearHeavy.handleForceKgf.toFixed(1),
  low72_300kg_rpm: +lowGearHeavy.drumRpm.toFixed(2),
  fast24_50kg_forceKgf: +fastLight.handleForceKgf.toFixed(1),
  fast24_50kg_rpm: +fastLight.drumRpm.toFixed(2),
  electric_300kg_rpm: +engineHeavy.drumRpm.toFixed(2),
  electric_300kg_watts: Math.round(engineHeavy.inputPowerW),
});
