import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
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
    errors.push(msg.params.exceptionDetails.text || JSON.stringify(msg.params));
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
  if (r.exceptionDetails) errors.push(r.exceptionDetails.text || "eval error");
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
  await sleep(1800); // Let WebGL render & tobacco particles tumble

  const checkCanvas = await evalJs(`(() => {
    const c = document.querySelector('#canvas-host canvas');
    return c ? { w: c.width, h: c.height, rpm: document.getElementById('m-rpm')?.textContent, mix: document.getElementById('m-mix')?.textContent } : null;
  })()`);
  console.log("PC overview check:", checkCanvas);
  await shot("shot-pc-overview");

  // 2. Switch to Human 1P Hand Crank + 72:1 Low + 300 kg batch
  await evalJs(`(() => {
    document.querySelector('[data-batch="300"]').click();
    document.querySelector('[data-drive="human-1"]').click();
    document.querySelector('[data-cam="gearbox"]').click();
  })()`);
  await sleep(1200);
  const humanCheck = await evalJs(`({
    rpm: document.getElementById('m-rpm')?.textContent,
    force: document.getElementById('m-force')?.textContent,
    status: document.getElementById('status-pill')?.textContent
  })`);
  console.log("Human 72:1 check:", humanCheck);
  await shot("shot-pc-human-low");

  // 3. Exploded + Open Lid + Dump -12 deg
  await evalJs(`(() => {
    document.querySelector('[data-cam="unload"]').click();
    document.querySelector('[data-tilt="-12"]').click();
    const exp = document.getElementById('sl-explode');
    exp.value = '65';
    exp.dispatchEvent(new Event('input'));
  })()`);
  await sleep(1000);
  await shot("shot-pc-exploded-dump");

  // 4. Anatomy Dark + Explode 40%
  await evalJs(`(() => {
    document.querySelector('[data-tab="anatomy"]').click();
    const ae = document.getElementById('sl-anat-explode');
    ae.value = '40';
    ae.dispatchEvent(new Event('input'));
    document.querySelector('[data-anat-row="06"]').click();
  })()`);
  await sleep(500);
  await shot("shot-pc-anatomy-dark");

  // 5. Anatomy Light
  await evalJs(`document.getElementById('btn-anat-theme').click()`);
  await sleep(400);
  await shot("shot-pc-anatomy-light");

  // 6. BOM & Physics Matrix
  await evalJs(`document.querySelector('[data-tab="bom"]').click()`);
  await sleep(400);
  await shot("shot-pc-bom");

  // 7. Mobile 390x844 check
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await evalJs(`(() => {
    const exp = document.getElementById('sl-explode');
    exp.value = '0';
    exp.dispatchEvent(new Event('input'));
    document.querySelector('[data-tilt="25"]').click();
    document.getElementById('btn-lid').click();
    document.querySelector('[data-drive="engine-electric"]').click();
    document.querySelector('[data-tab="sim3d"]').click();
    document.querySelector('[data-cam="overview"]').click();
  })()`);
  await sleep(1200);
  const mobileMetrics = await evalJs(`({
    innerW: window.innerWidth,
    scrollW: document.documentElement.scrollWidth,
    canvasH: document.querySelector('#canvas-host')?.clientHeight
  })`);
  console.log("Mobile 390 check:", mobileMetrics);
  await shot("shot-phone-sim");

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
