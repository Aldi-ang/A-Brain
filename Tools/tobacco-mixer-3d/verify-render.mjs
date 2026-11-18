import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(HERE, "dist");
const OUT = join(HERE, "..", "..", "Raw", "2026-11-18-tobacco-mixer-3d");
mkdirSync(OUT, { recursive: true });

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer((req, res) => {
  const path = (req.url || "/").split("?")[0];
  const file = path === "/" ? "index.html" : path.replace(/^\/+/, "");
  try {
    const data = readFileSync(join(DIST, file));
    res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const url = `http://127.0.0.1:${port}/`;

const userDir = join(OUT, "_prof");
mkdirSync(userDir, { recursive: true });
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9559;
const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--enable-webgl",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${userDir}`,
    `--remote-debugging-port=${CDP_PORT}`,
    "--window-size=1440,900",
    url,
  ],
  { stdio: ["ignore", "pipe", "pipe"] }
);

let cdpUrl = null;
const deadline = Date.now() + 12000;
const stderrBuf = [];
chrome.stderr.on("data", (d) => stderrBuf.push(d.toString()));

while (Date.now() < deadline && !cdpUrl) {
  const ok = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`).then((r) => r.ok, () => false);
  if (ok) {
    cdpUrl = `http://127.0.0.1:${CDP_PORT}`;
    break;
  }
  await new Promise((r) => setTimeout(r, 150));
}

if (!cdpUrl) {
  chrome.kill();
  server.close();
  console.error("Chrome failed to open CDP:", stderrBuf.join(""));
  process.exit(1);
}

const targets = await (await fetch(`${cdpUrl}/json/list`)).json();
const pageTarget = targets.find((t) => t.type === "page");
const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));

let msgId = 0;
const pending = new Map();
const errors = [];

ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.method === "Runtime.exceptionThrown") {
    const d = msg.params.exceptionDetails;
    errors.push(d.exception?.description || d.text || JSON.stringify(d));
  }
  if (msg.method === "Console.messageAdded" && msg.params.message.level === "error") {
    errors.push(msg.params.message.text);
  }
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) rej(new Error(msg.error.message));
    else res(msg.result);
  }
});

const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const id = ++msgId;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params }));
  });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const evalJs = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) errors.push(r.exceptionDetails.exception?.description || "eval error");
  return r.result?.value;
};
const shot = async (name) => {
  const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 82 });
  const p = join(OUT, `${name}.jpg`);
  writeFileSync(p, Buffer.from(data, "base64"));
  console.log("Saved", p);
};

try {
  await send("Runtime.enable");
  await send("Console.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await sleep(1600);

  // 1. Overview POV + real 3D hover & press test
  await shot("shot-pc-overview");

  let hoverHit = null;
  for (const [hx, hy] of [
    [545, 450],
    [520, 460],
    [580, 440],
    [490, 490],
  ]) {
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: hx, y: hy });
    await sleep(150);
    const tip = await evalJs(`(() => {
      const el = document.getElementById('hover-tip');
      return { visible: !!el && !el.hidden, text: el?.textContent?.trim() || '' };
    })()`);
    if (tip?.visible) {
      hoverHit = { x: hx, y: hy, ...tip };
      break;
    }
  }
  console.log("3D Hover test:", hoverHit);
  if (!hoverHit?.visible) errors.push("3D hover tooltip failed to appear over machine");
  await shot("shot-pc-hover-highlight");

  if (hoverHit) {
    await send("Input.dispatchMouseEvent", { type: "mousePressed", x: hoverHit.x, y: hoverHit.y, button: "left", clickCount: 1 });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: hoverHit.x, y: hoverHit.y, button: "left", clickCount: 1 });
    await sleep(160);
    const pressCheck = await evalJs(`({
      cardVisible: !document.getElementById('piece-card')?.hidden,
      title: document.getElementById('pc-title')?.textContent
    })`);
    console.log("3D Click/Press highlight test:", pressCheck);
    if (!pressCheck?.cardVisible) errors.push("3D click failed to open piece card");
    await evalJs(`(() => {
      document.getElementById('pc-close').click();
      if (document.getElementById('btn-lid')?.textContent.includes('Close')) document.getElementById('btn-lid').click();
    })()`);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 10, y: 10 });
  }

  // 2. Inside Flights POV (realistic fibrous rajangan bed + glowing helical flights)
  await evalJs(`document.querySelector('[data-cam="cutaway"]').click()`);
  await sleep(1000);
  await shot("shot-pov-flights");

  // 3. Gearbox & Crank POV + 1P Hand Crank + 300kg + Tilt Wheel Jog buttons
  await evalJs(`(() => {
    document.querySelector('[data-batch="300"]').click();
    document.querySelector('[data-drive="human-1"]').click();
    document.querySelector('[data-cam="gearbox"]').click();
  })()`);
  await sleep(1000);
  const wheelTest = await evalJs(`(() => {
    document.getElementById('btn-tilt-up').click();
    const afterUp = document.getElementById('val-tilt')?.textContent;
    document.getElementById('btn-tilt-down').click();
    const afterDown = document.getElementById('val-tilt')?.textContent;
    return { afterUp, afterDown, rpm: document.getElementById('m-rpm')?.textContent, force: document.getElementById('m-force')?.textContent };
  })()`);
  console.log("Gearbox + Tilt Wheel test:", wheelTest);
  if (wheelTest.afterUp !== "30°" || wheelTest.afterDown !== "25°") errors.push("Tilt wheel jog failed");
  await shot("shot-pc-human-low");

  // 4. Tupperware Lid & Sample Cap POV + Open Sample Cap!
  await evalJs(`(() => {
    document.querySelector('[data-cam="lid"]').click();
    document.getElementById('btn-cap').click();
  })()`);
  await sleep(1000);
  const capStatus = await evalJs(`document.getElementById('status-pill')?.textContent`);
  console.log("Sample Cap status:", capStatus);
  await shot("shot-pov-lid-cap");

  // 5. Open Vault Lid + Keranjang Dump POV (-12° pouring into basket)
  await evalJs(`(() => {
    document.getElementById('btn-cap').click(); // close cap
    document.querySelector('[data-drive="engine-electric"]').click();
    document.querySelector('[data-cam="unload"]').click();
  })()`);
  await sleep(1400);
  await shot("shot-pc-exploded-dump");

  // 6. 3D Anatomy Tour + Piece-by-Piece Card + Next/Isolate
  await evalJs(`(() => {
    document.querySelector('[data-tilt="25"]').click();
    document.getElementById('btn-lid').click();
    document.getElementById('btn-tour-3d').click();
    document.getElementById('pc-next').click(); // steps to 08 Sample Cap or next piece
  })()`);
  await sleep(1000);
  const tourInfo = await evalJs(`({
    visible: !document.getElementById('piece-card')?.hidden,
    title: document.getElementById('pc-title')?.textContent,
    explode: document.getElementById('val-explode')?.textContent
  })`);
  console.log("3D Anatomy Tour test:", tourInfo);
  if (!tourInfo.visible) errors.push("3D Anatomy piece card failed to open");
  await shot("shot-3d-anatomy-tour");

  // 7. Test 1P Pedal Drive mode + Anatomy Tab + Light Theme + BOM Matrix
  await evalJs(`(() => {
    document.getElementById('pc-close').click();
    document.querySelector('[data-drive="human-pedal"]').click();
    document.querySelector('[data-tab="anatomy"]').click();
    document.getElementById('btn-anat-next').click();
    document.getElementById('btn-anat-theme').click();
  })()`);
  await sleep(500);
  const anatRowRect = await evalJs(`(() => {
    const el = document.querySelector('[data-anat-row="08"]');
    el?.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = el?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
  })()`);
  if (anatRowRect) {
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: anatRowRect.x, y: anatRowRect.y });
    await sleep(120);
  }
  const anatHoverOk = await evalJs(`({
    rowHover: document.querySelector('[data-anat-row="08"]')?.classList.contains('is-hover'),
    svgHover: document.querySelector('[data-part="08"]')?.classList.contains('is-hover')
  })`);
  console.log("Anatomy bidirectional hover test:", anatHoverOk);
  if (!anatHoverOk?.rowHover || !anatHoverOk?.svgHover) errors.push("Anatomy bidirectional hover failed");
  await shot("shot-pc-anatomy-light");

  await evalJs(`document.querySelector('[data-tab="bom"]').click()`);
  await sleep(300);
  const bomRows = await evalJs(`document.querySelectorAll('#matrix-body tr').length`);
  console.log("BOM rows:", bomRows);
  if (bomRows < 8) errors.push("BOM rows missing");

  // 8. Mobile 390x844 check
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await sleep(250);
  await evalJs(`(() => {
    document.querySelector('[data-drive="engine-electric"]').click();
    document.querySelector('[data-tab="sim3d"]').click();
    document.querySelector('[data-cam="overview"]').click();
  })()`);
  await sleep(1100);
  const mobileMetrics = await evalJs(`({
    innerW: window.innerWidth,
    scrollW: document.documentElement.scrollWidth,
    canvasH: document.querySelector('#canvas-host')?.clientHeight
  })`);
  console.log("Mobile 390 check:", mobileMetrics);
  await shot("shot-phone-sim");

  // 9. Standalone single-file HTML via file://
  const standaloneUrl = "file:///" + join(DIST, "tobacco-mixer-3d-standalone.html").replace(/\\/g, "/");
  await send("Page.navigate", { url: standaloneUrl });
  await sleep(1000);
  const fileCheck = await evalJs(`(() => ({
    hasCanvas: !!document.querySelector('#canvas-host canvas'),
    rpm: document.getElementById('m-rpm')?.textContent
  }))()`);
  console.log("Standalone file:// check:", fileCheck);
  if (!fileCheck?.hasCanvas) errors.push("Standalone file:// failed to mount WebGL canvas");

  console.log("Console/Runtime errors:", errors.length, errors);
  if (errors.length > 0) process.exitCode = 1;
} finally {
  ws.close();
  chrome.kill();
  server.close();
  await sleep(400);
  try {
    rmSync(userDir, { recursive: true, force: true });
  } catch {}
}
