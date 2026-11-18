import { ANATOMY_CSS, ANATOMY_PARTS, buildAnatomySvg } from "./anatomy-builder.mjs";
import { computeSimulationState, DRIVE_MODES } from "./physics.mjs";
import { createMixerSimulation, PIECE_INFO } from "./sim3d.mjs";

const PIECE_ORDER = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "human"];

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
  sampleCapOpen: false,
  showRuler: true,
  running: true,
  mixPct: 14,
  activeCam: "overview",
  tourActive: false,
  isolateMode: true,
  anatomyTheme: "dark",
  anatomyExplode: 0,
  anatomyAnimated: true,
  selectedPartId: null,
};

// Inject Anatomy CSS once
const anatStyle = document.createElement("style");
anatStyle.textContent = ANATOMY_CSS;
document.head.appendChild(anatStyle);

const hoverTip = document.getElementById("hover-tip");
const INTERACTIVE_HINT = {
  "08": "Click to twist open/close sample cap",
  "07": "Click to unlatch & swing vault lid",
  "03": "Click to cycle drum tilt (+25° / +32° / -12°)",
};
let hoverTipId = null;
const tipIdEl = document.createElement("span");
tipIdEl.className = "hover-tip-id";
const tipNameEl = document.createElement("span");
tipNameEl.className = "hover-tip-name";
const tipHintEl = document.createElement("span");
tipHintEl.className = "hover-tip-hint";
hoverTip.append(tipIdEl, tipNameEl, tipHintEl);

// Tab switching
const tabBtns = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-panel]");
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    appState.tab = target;
    hoverTip.hidden = true;
    window.scrollTo(0, 0);
    tabBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.tab === target));
    tabPanels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === target));
    if (target === "anatomy") renderAnatomy();
    if (target === "bom") renderVerificationMatrix();
  });
});

// Piece-by-Piece 3D Card Helpers
const pieceCard = document.getElementById("piece-card");
function showPieceCard(id) {
  const info = PIECE_INFO[id];
  if (!info) return;
  appState.selectedPartId = id;
  pieceCard.hidden = false;
  document.getElementById("pc-badge").textContent =
    id === "human" ? "SCALE 171 CM" : `PART ${id} / ${PIECE_ORDER.length - 1}`;
  document.getElementById("pc-title").textContent = info.name;
  document.getElementById("pc-indo").textContent = info.indo;
  document.getElementById("pc-fn").textContent = info.fn;
  document.getElementById("pc-spec").textContent = info.spec;
  document.getElementById("pc-isolate").classList.toggle("is-active", appState.isolateMode);
}

// Mount 3D Simulator with defensive WebGL guard
const canvasHost = document.getElementById("canvas-host");
const stageStatus = document.getElementById("stage-status");
let sim = null;
try {
  sim = createMixerSimulation(canvasHost, {
    onPartSelect: (id) => showPieceCard(id),
    onPartHover: (hit) => {
      if (!hit || !hit.info) {
        hoverTipId = null;
        hoverTip.hidden = true;
        return;
      }
      if (hoverTipId !== hit.id) {
        hoverTipId = hit.id;
        tipIdEl.textContent = hit.id === "human" ? "SCALE 171 CM" : `PART ${hit.id}`;
        tipNameEl.textContent = hit.info.name;
        tipHintEl.textContent = INTERACTIVE_HINT[hit.id] || "Click to inspect specs";
      }
      const w = canvasHost.clientWidth || 640;
      const h = canvasHost.clientHeight || 440;
      const tx = Math.max(12, Math.min(w - 256, hit.x + 16));
      const ty = Math.max(64, Math.min(h - 78, hit.y - 52));
      hoverTip.style.transform = `translate(${Math.round(tx)}px, ${Math.round(ty)}px)`;
      hoverTip.hidden = false;
    },
    onPartAction: (id) => {
      if (id === "08") {
        appState.sampleCapOpen = !appState.sampleCapOpen;
        updateControlButtons();
        syncSimulation();
      } else if (id === "07") {
        appState.lidOpen = !appState.lidOpen;
        updateControlButtons();
        syncSimulation();
      } else if (id === "03" && !appState.tourActive) {
        const nextTilt = appState.tiltDeg < 10 ? 25 : appState.tiltDeg < 30 ? 32 : -12;
        setTilt(nextTilt);
      }
    },
    onMetrics: ({ mixPct }) => {
      appState.mixPct = mixPct;
      const el = document.getElementById("m-mix");
      if (el) el.textContent = `${mixPct}%`;
    },
    onContextLost: () => {
      if (stageStatus) {
        stageStatus.textContent = "3D WebGL context paused by browser — reload tab to restore.";
        stageStatus.hidden = false;
      }
    },
  });
  if (stageStatus) stageStatus.hidden = true;
} catch (err) {
  if (stageStatus) {
    stageStatus.textContent = `3D unavailable (${err?.message || "WebGL error"}). Anatomy & Physics tabs active.`;
    stageStatus.hidden = false;
  }
}

function setTilt(deg) {
  appState.tiltDeg = Math.max(-15, Math.min(35, deg));
  document.getElementById("sl-tilt").value = String(appState.tiltDeg);
  document.getElementById("val-tilt").textContent = `${appState.tiltDeg}°`;
  document.getElementById("val-tilt-inline").textContent = `${appState.tiltDeg > 0 ? "+" : ""}${appState.tiltDeg}°`;
  document.getElementById("wheel-icon").style.transform = `rotate(${appState.tiltDeg * 10}deg)`;
  if (appState.tiltDeg < -5 && !appState.lidOpen) {
    appState.lidOpen = true;
  }
  updateControlButtons();
  syncSimulation();
}

function syncSimulation() {
  const simOut = computeSimulationState({
    driveId: appState.driveId,
    gearId: appState.gearId,
    batchKg: appState.batchKg,
    tiltDeg: appState.tiltDeg,
    throttle: appState.throttle,
  });

  sim?.applyState({
    driveId: appState.driveId,
    gearId: appState.gearId,
    drumRpm: simOut.drumRpm,
    gearRatio: simOut.gearRatio,
    tiltDeg: appState.tiltDeg,
    batchKg: appState.batchKg,
    explode: appState.explode,
    cutaway: appState.cutaway,
    lidOpen: appState.lidOpen,
    sampleCapOpen: appState.sampleCapOpen,
    showRuler: appState.showRuler,
    running: appState.running,
    stalled: simOut.stalled,
  });

  const shownRpm = appState.lidOpen && !simOut.stalled ? Math.min(1.8, simOut.drumRpm) : simOut.drumRpm;
  document.getElementById("m-rpm").textContent = simOut.stalled ? "0.00" : shownRpm.toFixed(2);
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
  if (simOut.stalled) {
    statusPill.textContent = simOut.statusText;
  } else if (appState.lidOpen && appState.running && appState.tiltDeg >= -4) {
    statusPill.textContent = "Door Interlock · Jog Capped @ 1.8 RPM";
  } else if (appState.sampleCapOpen) {
    statusPill.textContent = "Sample Cap Open · Aroma / Blend Check Ready";
  } else {
    statusPill.textContent = `${simOut.regime} · ${simOut.bubukRisk}`;
  }
  statusPill.classList.toggle("is-stall", simOut.stalled);

  const etaText = simOut.estMixMinutes ? `~${simOut.estMixMinutes.toFixed(1)} min/batch` : "Stalled / Too Fast";
  document.getElementById("physics-note").textContent =
    `Critical Nc ${simOut.criticalRpm.toFixed(1)} RPM (${simOut.pctCritical.toFixed(0)}%) · Tip ${simOut.tipSpeedMs.toFixed(2)} m/s · Est. ${etaText}`;
}

function updateControlButtons() {
  document.querySelectorAll("[data-drive]").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.drive === appState.driveId)
  );
  document.querySelectorAll("[data-gear]").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.gear === appState.gearId)
  );
  document.querySelectorAll("[data-batch]").forEach((b) =>
    b.classList.toggle("is-active", Number(b.dataset.batch) === appState.batchKg)
  );
  document.querySelectorAll("[data-tilt]").forEach((b) =>
    b.classList.toggle("is-active", Number(b.dataset.tilt) === appState.tiltDeg)
  );
  document.querySelectorAll("[data-cam]").forEach((b) =>
    b.classList.toggle("is-active", !appState.tourActive && b.dataset.cam === appState.activeCam)
  );

  const btnCap = document.getElementById("btn-cap");
  btnCap.classList.toggle("is-active", appState.sampleCapOpen);
  btnCap.textContent = appState.sampleCapOpen ? "Close Sample Cap" : "Open Sample Cap";

  const btnLid = document.getElementById("btn-lid");
  btnLid.classList.toggle("is-active", appState.lidOpen);
  btnLid.textContent = appState.lidOpen ? "Close & Latch Lid" : "Open Vault Lid";

  document.getElementById("btn-cutaway").classList.toggle("is-active", appState.cutaway);
  document.getElementById("btn-ruler").classList.toggle("is-active", appState.showRuler);
  document.getElementById("btn-run").textContent = appState.running ? "Pause Spin" : "Run Spin";
  document.getElementById("btn-tour-3d").classList.toggle("is-active", appState.tourActive);
  document.getElementById("btn-tour-rail").classList.toggle("is-active", appState.tourActive);
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

// Batch presets & slider
document.querySelectorAll("[data-batch]").forEach((btn) => {
  btn.addEventListener("click", () => {
    appState.batchKg = Number(btn.dataset.batch);
    document.getElementById("sl-batch").value = String(appState.batchKg);
    document.getElementById("val-batch").textContent = `${appState.batchKg} kg`;
    sim?.resetTobaccoBatch(appState.batchKg);
    updateControlButtons();
    syncSimulation();
  });
});

document.getElementById("sl-batch").addEventListener("input", (e) => {
  appState.batchKg = Number(e.target.value);
  document.getElementById("val-batch").textContent = `${appState.batchKg} kg`;
  updateControlButtons();
  syncSimulation();
});

// Tilt wheel controls & presets
document.querySelectorAll("[data-tilt]").forEach((btn) => {
  btn.addEventListener("click", () => setTilt(Number(btn.dataset.tilt)));
});
document.getElementById("btn-tilt-down").addEventListener("click", () => setTilt(appState.tiltDeg - 5));
document.getElementById("btn-tilt-zero").addEventListener("click", () => setTilt(0));
document.getElementById("btn-tilt-up").addEventListener("click", () => setTilt(appState.tiltDeg + 5));
document.getElementById("sl-tilt").addEventListener("input", (e) => setTilt(Number(e.target.value)));

// Throttle & Explode sliders
document.getElementById("sl-throttle").addEventListener("input", (e) => {
  const v = Number(e.target.value);
  appState.throttle = v / 100;
  document.getElementById("val-throttle").textContent = `${v}%`;
  syncSimulation();
});

document.getElementById("sl-explode").addEventListener("input", (e) => {
  const v = Number(e.target.value);
  appState.explode = v / 100;
  document.getElementById("val-explode").textContent = `${v}%`;
  syncSimulation();
});

// Vault Door, Sample Cap, Cutaway, Ruler, Run, Reset
document.getElementById("btn-cap").addEventListener("click", () => {
  appState.sampleCapOpen = !appState.sampleCapOpen;
  updateControlButtons();
  syncSimulation();
});
document.getElementById("btn-lid").addEventListener("click", () => {
  appState.lidOpen = !appState.lidOpen;
  updateControlButtons();
  syncSimulation();
});
document.getElementById("btn-cutaway").addEventListener("click", () => {
  appState.cutaway = !appState.cutaway;
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
  sim?.resetTobaccoBatch(appState.batchKg);
});

// Camera POV presets (smooth animated glide + smart defaults)
document.querySelectorAll("[data-cam]").forEach((btn) => {
  btn.addEventListener("click", () => {
    appState.tourActive = false;
    appState.activeCam = btn.dataset.cam;
    sim?.clearPartFocus();
    pieceCard.hidden = true;
    if (appState.activeCam === "cutaway" && !appState.cutaway) {
      appState.cutaway = true;
    }
    if (appState.activeCam === "unload" && appState.tiltDeg > -5) {
      setTilt(-12);
    }
    appState.showRuler = appState.activeCam === "overview";
    sim?.setCameraPreset(appState.activeCam);
    updateControlButtons();
    syncSimulation();
  });
});

// 3D Anatomy Tour & Piece-by-Piece Stepper
function startOrToggle3DTour() {
  appState.tourActive = !appState.tourActive;
  if (appState.tourActive) {
    const startId = appState.selectedPartId || "07";
    appState.explode = Math.max(0.45, appState.explode);
    appState.showRuler = false;
    document.getElementById("sl-explode").value = String(Math.round(appState.explode * 100));
    document.getElementById("val-explode").textContent = `${Math.round(appState.explode * 100)}%`;
    syncSimulation();
    sim?.focusPart(startId, { glideCamera: true, isolate: appState.isolateMode });
  } else {
    appState.explode = 0;
    appState.showRuler = appState.activeCam === "overview";
    document.getElementById("sl-explode").value = "0";
    document.getElementById("val-explode").textContent = "0%";
    sim?.clearPartFocus();
    pieceCard.hidden = true;
    sim?.setCameraPreset(appState.activeCam);
    syncSimulation();
  }
  updateControlButtons();
}

document.getElementById("btn-tour-3d").addEventListener("click", startOrToggle3DTour);
document.getElementById("btn-tour-rail").addEventListener("click", startOrToggle3DTour);

function stepPiece(delta) {
  const idx = Math.max(0, PIECE_ORDER.indexOf(appState.selectedPartId || "01"));
  const nextId = PIECE_ORDER[(idx + delta + PIECE_ORDER.length) % PIECE_ORDER.length];
  sim?.focusPart(nextId, { glideCamera: true, isolate: appState.isolateMode });
}
document.getElementById("pc-prev").addEventListener("click", () => stepPiece(-1));
document.getElementById("pc-next").addEventListener("click", () => stepPiece(1));
document.getElementById("pc-isolate").addEventListener("click", () => {
  appState.isolateMode = !appState.isolateMode;
  if (appState.selectedPartId) sim?.focusPart(appState.selectedPartId, { glideCamera: false, isolate: appState.isolateMode });
  document.getElementById("pc-isolate").classList.toggle("is-active", appState.isolateMode);
});
document.getElementById("pc-close").addEventListener("click", () => {
  appState.tourActive = false;
  sim?.clearPartFocus();
  pieceCard.hidden = true;
  updateControlButtons();
});

// =========================================================================
// ANATOMY TAB RENDERER (ANIMATED + PIECE-BY-PIECE)
// =========================================================================
function renderAnatomy() {
  const stage = document.getElementById("anatomy-plate-wrap");
  stage.setAttribute("data-theme", appState.anatomyTheme);
  const svgHtml = buildAnatomySvg({
    explode: appState.anatomyExplode,
    selectedPartId: appState.selectedPartId,
    animated: appState.anatomyAnimated,
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

  const setAnatomyHover = (id, on) => {
    stage.querySelectorAll(`[data-part="${id}"]`).forEach((el) => el.classList.toggle("is-hover", on));
    listWrap.querySelectorAll(`[data-anat-row="${id}"]`).forEach((el) => el.classList.toggle("is-hover", on));
  };
  const bindPartEl = (el, id) => {
    el.addEventListener("mouseenter", () => setAnatomyHover(id, true));
    el.addEventListener("mouseleave", () => setAnatomyHover(id, false));
    el.addEventListener("click", () => {
      appState.selectedPartId = appState.selectedPartId === id ? null : id;
      renderAnatomy();
    });
  };
  stage.querySelectorAll(".anat-part").forEach((g) => bindPartEl(g, g.dataset.part));
  listWrap.querySelectorAll("[data-anat-row]").forEach((row) => bindPartEl(row, row.dataset.anatRow));
}

function stepAnatomyPart(delta) {
  const idx = ANATOMY_PARTS.findIndex((p) => p.id === appState.selectedPartId);
  const next = idx < 0 ? 0 : (idx + delta + ANATOMY_PARTS.length) % ANATOMY_PARTS.length;
  appState.selectedPartId = ANATOMY_PARTS[next].id;
  renderAnatomy();
}
document.getElementById("btn-anat-prev").addEventListener("click", () => stepAnatomyPart(-1));
document.getElementById("btn-anat-next").addEventListener("click", () => stepAnatomyPart(1));
document.getElementById("btn-anat-anim").addEventListener("click", () => {
  appState.anatomyAnimated = !appState.anatomyAnimated;
  document.getElementById("btn-anat-anim").textContent = appState.anatomyAnimated ? "Pause Motion" : "Play Motion";
  renderAnatomy();
});
document.getElementById("sl-anat-explode").addEventListener("input", (e) => {
  appState.anatomyExplode = Number(e.target.value) / 100;
  document.getElementById("val-anat-explode").textContent = `${e.target.value}%`;
  renderAnatomy();
});
document.getElementById("btn-anat-theme").addEventListener("click", () => {
  appState.anatomyTheme = appState.anatomyTheme === "dark" ? "light" : "dark";
  document.getElementById("btn-anat-theme").textContent =
    appState.anatomyTheme === "dark" ? "Light Paper" : "Dark Blueprint";
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
