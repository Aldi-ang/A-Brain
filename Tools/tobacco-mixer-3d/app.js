import { ANATOMY_CSS, ANATOMY_PARTS, buildAnatomySvg } from "./anatomy-builder.mjs";
import { computeSimulationState, DRIVE_MODES, GEARS, MACHINE } from "./physics.mjs";
import { createMixerSimulation } from "./sim3d.mjs";

const appState = {
  tab: "sim3d",
  driveId: "engine-electric",
  gearId: "12:1",
  batchKg: 150,
  tiltDeg: 25,
  throttle: 0.92,
  explode: 0,
  cutaway: true,
  lidOpen: false,
  showRuler: true,
  running: true,
  mixPct: 14,
  anatomyTheme: "dark",
  anatomyExplode: 0,
  selectedPartId: null,
};

// Inject Anatomy CSS once
const anatStyle = document.createElement("style");
anatStyle.textContent = ANATOMY_CSS;
document.head.appendChild(anatStyle);

// Tab switching
const tabBtns = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-panel]");
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    appState.tab = target;
    tabBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.tab === target));
    tabPanels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === target));
    if (target === "anatomy") renderAnatomy();
    if (target === "bom") renderVerificationMatrix();
  });
});

// Mount 3D Simulator
const canvasHost = document.getElementById("canvas-host");
const partToast = document.getElementById("part-toast");
const sim = createMixerSimulation(canvasHost, {
  onPartSelect: (id, meta) => {
    appState.selectedPartId = id;
    if (meta && partToast) {
      partToast.hidden = false;
      partToast.innerHTML = `<strong>${id === "human" ? "171 cm" : "#" + id} · ${meta.name}</strong><span>${meta.desc}</span>`;
    }
  },
  onMetrics: ({ mixPct }) => {
    appState.mixPct = mixPct;
    const el = document.getElementById("m-mix");
    if (el) el.textContent = `${mixPct}%`;
  },
});

function syncSimulation() {
  const simOut = computeSimulationState({
    driveId: appState.driveId,
    gearId: appState.gearId,
    batchKg: appState.batchKg,
    tiltDeg: appState.tiltDeg,
    throttle: appState.throttle,
  });

  sim.applyState({
    driveId: appState.driveId,
    drumRpm: simOut.drumRpm,
    gearRatio: simOut.gearRatio,
    tiltDeg: appState.tiltDeg,
    batchKg: appState.batchKg,
    explode: appState.explode,
    cutaway: appState.cutaway,
    lidOpen: appState.lidOpen,
    showRuler: appState.showRuler,
    running: appState.running,
    stalled: simOut.stalled,
  });

  // Update HUD metrics (tabular-nums)
  document.getElementById("m-rpm").textContent = simOut.stalled ? "0.00" : simOut.drumRpm.toFixed(2);
  document.getElementById("m-torque").textContent = `${Math.round(simOut.torqueTotalNm)} Nm`;
  document.getElementById("m-power").textContent = `${Math.round(simOut.inputPowerW)} W`;
  document.getElementById("m-fill").textContent = `${simOut.fillPct.toFixed(1)}%`;

  const forceChip = document.getElementById("chip-force");
  const forceEl = document.getElementById("m-force");
  if (simOut.driveKind === "human") {
    forceChip.hidden = false;
    forceEl.textContent = `${simOut.handleForceKgf.toFixed(1)} kgf`;
    forceChip.classList.toggle("is-warn", simOut.overloadWarning && !simOut.stalled);
    forceChip.classList.toggle("is-stall", simOut.stalled);
  } else {
    forceChip.hidden = true;
  }

  const statusPill = document.getElementById("status-pill");
  statusPill.textContent = simOut.stalled
    ? simOut.statusText
    : `${simOut.regime} · ${simOut.bubukRisk}`;
  statusPill.classList.toggle("is-stall", simOut.stalled);

  const etaText = simOut.estMixMinutes ? `~${simOut.estMixMinutes.toFixed(1)} min/batch` : "Stalled / Too Fast";
  document.getElementById("physics-note").textContent =
    `Critical Nc ${simOut.criticalRpm.toFixed(1)} RPM (${simOut.pctCritical.toFixed(0)}%) · Tip ${simOut.tipSpeedMs.toFixed(2)} m/s · Est. ${etaText}`;
}

// Drive mode buttons
document.querySelectorAll("[data-drive]").forEach((btn) => {
  btn.addEventListener("click", () => {
    appState.driveId = btn.dataset.drive;
    const drive = DRIVE_MODES[appState.driveId];
    appState.gearId = drive.defaultGear;
    appState.throttle = drive.kind === "engine" ? drive.defaultThrottle : 1.0;
    document.getElementById("sl-throttle").value = String(Math.round(appState.throttle * 100));
    document.getElementById("val-throttle").textContent = `${Math.round(appState.throttle * 100)}%`;
    document.getElementById("lbl-throttle").textContent =
      drive.kind === "engine" ? "Engine Throttle" : "Human Effort (100% = ~95W sustained)";
    updateControlButtons();
    syncSimulation();
  });
});

// Gear ratio buttons
document.querySelectorAll("[data-gear]").forEach((btn) => {
  btn.addEventListener("click", () => {
    appState.gearId = btn.dataset.gear;
    updateControlButtons();
    syncSimulation();
  });
});

// Batch presets
document.querySelectorAll("[data-batch]").forEach((btn) => {
  btn.addEventListener("click", () => {
    appState.batchKg = Number(btn.dataset.batch);
    document.getElementById("sl-batch").value = String(appState.batchKg);
    document.getElementById("val-batch").textContent = `${appState.batchKg} kg`;
    sim.resetTobaccoBatch(appState.batchKg);
    syncSimulation();
  });
});

// Tilt presets
document.querySelectorAll("[data-tilt]").forEach((btn) => {
  btn.addEventListener("click", () => {
    appState.tiltDeg = Number(btn.dataset.tilt);
    document.getElementById("sl-tilt").value = String(appState.tiltDeg);
    document.getElementById("val-tilt").textContent = `${appState.tiltDeg}°`;
    if (appState.tiltDeg < -5) {
      appState.lidOpen = true;
      updateControlButtons();
    }
    syncSimulation();
  });
});

function updateControlButtons() {
  document.querySelectorAll("[data-drive]").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.drive === appState.driveId)
  );
  document.querySelectorAll("[data-gear]").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.gear === appState.gearId)
  );
  document.getElementById("btn-cutaway").classList.toggle("is-active", appState.cutaway);
  document.getElementById("btn-lid").classList.toggle("is-active", appState.lidOpen);
  document.getElementById("btn-ruler").classList.toggle("is-active", appState.showRuler);
  document.getElementById("btn-run").textContent = appState.running ? "Pause Spin" : "Run Spin";
}

// Sliders
const bindRange = (id, valId, suffix, onChange) => {
  const el = document.getElementById(id);
  el.addEventListener("input", () => {
    const v = Number(el.value);
    document.getElementById(valId).textContent = `${v}${suffix}`;
    onChange(v);
    syncSimulation();
  });
};

bindRange("sl-batch", "val-batch", " kg", (v) => {
  appState.batchKg = v;
});
bindRange("sl-tilt", "val-tilt", "°", (v) => {
  appState.tiltDeg = v;
});
bindRange("sl-throttle", "val-throttle", "%", (v) => {
  appState.throttle = v / 100;
});
bindRange("sl-explode", "val-explode", "%", (v) => {
  appState.explode = v / 100;
});

// Toggles
document.getElementById("btn-cutaway").addEventListener("click", () => {
  appState.cutaway = !appState.cutaway;
  updateControlButtons();
  syncSimulation();
});
document.getElementById("btn-lid").addEventListener("click", () => {
  appState.lidOpen = !appState.lidOpen;
  updateControlButtons();
  syncSimulation();
});
document.getElementById("btn-ruler").addEventListener("click", () => {
  appState.showRuler = !appState.showRuler;
  updateControlButtons();
  syncSimulation();
});
document.getElementById("btn-run").addEventListener("click", () => {
  appState.running = !appState.running;
  updateControlButtons();
  syncSimulation();
});
document.getElementById("btn-reset-batch").addEventListener("click", () => {
  sim.resetTobaccoBatch(appState.batchKg);
});

// Camera presets
document.querySelectorAll("[data-cam]").forEach((btn) => {
  btn.addEventListener("click", () => sim.setCameraPreset(btn.dataset.cam));
});

// =========================================================================
// ANATOMY TAB RENDERER
// =========================================================================
function renderAnatomy() {
  const stage = document.getElementById("anatomy-plate-wrap");
  stage.setAttribute("data-theme", appState.anatomyTheme);
  const svgHtml = buildAnatomySvg({
    explode: appState.anatomyExplode,
    selectedPartId: appState.selectedPartId,
  });
  const simOut = computeSimulationState({
    driveId: appState.driveId,
    gearId: appState.gearId,
    batchKg: appState.batchKg,
    tiltDeg: appState.tiltDeg,
    throttle: appState.throttle,
  });
  const selected = ANATOMY_PARTS.find((p) => p.id === appState.selectedPartId);
  const readoutText = selected
    ? `PART ${selected.id}: ${selected.name}`
    : `${appState.batchKg} kg · ${simOut.gearRatio}:1 · ${simOut.drumRpm.toFixed(2)} RPM`;

  stage.innerHTML = `
    <figure class="iso-figure" style="margin:0">
      <div class="iso-plate">
        <div class="iso-plate-corners" aria-hidden="true">
          <span class="iso-plate-corner" data-corner="fig">FIG 01 · STEAMER MIXER</span>
          <span class="iso-plate-corner" data-corner="title">179×179 CM</span>
          <span class="iso-plate-corner" data-corner="hint">CLICK PART OR EXPLODE</span>
          <span class="iso-plate-corner" data-corner="readout" data-readout>${readoutText}</span>
        </div>
        ${svgHtml}
      </div>
    </figure>
  `;

  stage.querySelectorAll(".anat-part").forEach((g) => {
    g.addEventListener("click", () => {
      const id = g.dataset.part;
      appState.selectedPartId = appState.selectedPartId === id ? null : id;
      renderAnatomy();
    });
  });

  const listWrap = document.getElementById("anatomy-part-list");
  listWrap.innerHTML = ANATOMY_PARTS.map(
    (p) => `
    <button type="button" class="part-row${appState.selectedPartId === p.id ? " is-active" : ""}" data-anat-row="${p.id}">
      <span class="part-num">${p.id}</span>
      <div class="part-meta">
        <h4>${p.name}</h4>
        <div class="indo">${p.indonesian}</div>
        <p>${p.role}</p>
        <div class="spec">${p.spec}</div>
      </div>
    </button>`
  ).join("");

  listWrap.querySelectorAll("[data-anat-row]").forEach((row) => {
    row.addEventListener("click", () => {
      const id = row.dataset.anatRow;
      appState.selectedPartId = appState.selectedPartId === id ? null : id;
      renderAnatomy();
    });
  });
}

document.getElementById("sl-anat-explode").addEventListener("input", (e) => {
  appState.anatomyExplode = Number(e.target.value) / 100;
  document.getElementById("val-anat-explode").textContent = `${e.target.value}%`;
  renderAnatomy();
});

document.getElementById("btn-anat-theme").addEventListener("click", () => {
  appState.anatomyTheme = appState.anatomyTheme === "dark" ? "light" : "dark";
  document.getElementById("btn-anat-theme").textContent =
    appState.anatomyTheme === "dark" ? "Switch Light Paper" : "Switch Dark Blueprint";
  renderAnatomy();
});

// =========================================================================
// PHYSICS & WORKSHOP BOM MATRIX
// =========================================================================
function renderVerificationMatrix() {
  const cases = [
    { label: "50 kg (1 Seri) · 1P Fast 24:1", driveId: "human-1", gearId: "24:1", batchKg: 50 },
    { label: "150 kg · 1P Fast 24:1", driveId: "human-1", gearId: "24:1", batchKg: 150 },
    { label: "150 kg · 1P Low 72:1", driveId: "human-1", gearId: "72:1", batchKg: 150 },
    { label: "300 kg · 1P Direct 12:1 (No Gear)", driveId: "human-1", gearId: "12:1", batchKg: 300 },
    { label: "300 kg · 1P Heavy Low 72:1", driveId: "human-1", gearId: "72:1", batchKg: 300 },
    { label: "300 kg · 2P Twin Crank 72:1", driveId: "human-2", gearId: "72:1", batchKg: 300 },
    { label: "300 kg · Electric 3 HP (12:1)", driveId: "engine-electric", gearId: "12:1", batchKg: 300 },
    { label: "300 kg · Petrol GX160 (12:1)", driveId: "engine-petrol", gearId: "12:1", batchKg: 300 },
  ];

  const tbody = document.getElementById("matrix-body");
  tbody.innerHTML = cases
    .map((c) => {
      const r = computeSimulationState({ ...c, tiltDeg: 25, throttle: c.driveId.startsWith("engine") ? 0.9 : 1.0 });
      const forceStr = r.driveKind === "human" ? `${r.handleForceKgf.toFixed(1)} kgf` : `${Math.round(r.inputPowerW)} W`;
      const cls = r.stalled || r.overloadWarning ? "badge-bad" : "badge-ok";
      const verdict = r.stalled ? "STALLED" : r.overloadWarning ? "Too Heavy" : `${r.regime.split(" ")[0]} OK`;
      return `<tr>
        <td>${c.label}</td>
        <td>${Math.round(r.torqueTotalNm)} Nm</td>
        <td>${forceStr}</td>
        <td>${r.drumRpm.toFixed(2)}</td>
        <td>${r.estMixMinutes ? r.estMixMinutes.toFixed(1) + " m" : "—"}</td>
        <td class="${cls}">${verdict}</td>
      </tr>`;
    })
    .join("");
}

updateControlButtons();
syncSimulation();
renderAnatomy();
renderVerificationMatrix();
