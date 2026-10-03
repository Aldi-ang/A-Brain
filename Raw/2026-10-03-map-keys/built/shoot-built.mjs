/* The BUILT Journey map (kpm src/, 2026-10-03), shot from the ponder lab (preview `ponder-lab`, port 4190):
   PC 1440 frames (toolbar, chests + signs, slots, pixel salesmen, the brush list), the secure moment sampled against
   the chest's rest position BEFORE the change (lessons.md 2026-10-03), and Lite = end states with nothing running. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell&journey&exp&admin&visits';
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9405',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9405/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 200));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push(r.result.exceptionDetails.exception?.description?.slice(0, 200)); return r.result?.result?.value; };
const shot = async (file, clip) => {
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });
  const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}), captureBeyondViewport: !!clip });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const clipOf = (sel, pad = 0) => js(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: b.left + scrollX - ${pad}, y: b.top + scrollY - ${pad}, width: b.width + ${2 * pad}, height: b.height + ${2 * pad} }; })()`);
const load = async (url) => {
  await send('Page.navigate', { url });
  for (let i = 0; i < 80; i++) { await sleep(200); if (await js('!!document.querySelector(".kx-keys .k-full") && document.readyState === "complete"')) break; }
  await sleep(1500);
};
const zoomIn = (n) => js(`(async () => { for (let i = 0; i < ${n}; i++) { document.querySelector('.leaflet-control-zoom-in').click(); await new Promise((r) => setTimeout(r, 500)); } await new Promise((r) => setTimeout(r, 900)); return 1; })()`);
await send('Page.enable'); await send('Runtime.enable');
const out = {};

/* ---- PC 1440: the 500 px map with the toolbar, then full screen + zoomed, then the brush list ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await load(LAB);
await js(`document.querySelector('.kx-map').scrollIntoView({ block: 'center' }); 1`); await sleep(400);
out.pc = await js(`(() => { const r = (s) => [...document.querySelectorAll(s)].map((e) => { const b = e.getBoundingClientRect(); return Math.round(b.width) + 'x' + Math.round(b.height); });
  return { keys: r('.kx-keys .kx-mapkey'), labels: [...document.querySelectorAll('.kx-keys .kx-mapkey > span')].map((s) => getComputedStyle(s).display + ':' + s.innerText),
    chests: document.querySelectorAll('.leaflet-marker-icon .kx-c5:not(.kx-slot .kx-c5)').length, visited: document.querySelectorAll('.kx-c5.v').length, slots: document.querySelectorAll('.kx-slot').length,
    people: [...document.querySelectorAll('.kx-sm')].map((e) => e.className), dock: document.querySelectorAll('.kx-dock').length, docW: document.documentElement.scrollWidth }; })()`);
await shot('pc-1440-map.png', await clipOf('.kx-map', 8));
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 3, mobile: false }); await sleep(600);
await shot('pc-1440-slot-3x.png', await js(`(() => { const all = [...document.querySelectorAll('.leaflet-marker-icon')].map((m) => m.getBoundingClientRect()); const hit = (a, b) => a !== b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; const s = [...document.querySelectorAll('.kx-slot')].map((e) => e.getBoundingClientRect()).sort((a, b) => all.filter((r) => hit(r, a) && !(r.x === a.x && r.y === a.y)).length - all.filter((r) => hit(r, b) && !(r.x === b.x && r.y === b.y)).length)[0]; return { x: s.left - 14, y: s.top - 14, width: s.width + 28, height: s.height + 28 }; })()`));
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }); await sleep(400);
await js(`document.querySelector('.kx-keys .k-full').click(); 1`); await sleep(900); await zoomIn(2);
await shot('pc-1440-full.png');
await js(`document.querySelector('.kx-brushwrap .k-brush').click(); 1`); await sleep(600);
out.pcBrush = await js(`[...document.querySelectorAll('.kx-brush .kx-pen')].map((p) => Math.round(p.getBoundingClientRect().height) + ':' + p.innerText.trim())`);
await shot('pc-1440-brush.png', await clipOf('.kx-brushwrap', 12));
await shot('pc-1440-chests-3x.png', await js(`(() => { const e = [...document.querySelectorAll('.kx-c5.v')].find((c) => { const b = c.getBoundingClientRect(); return b.left > 300 && b.top > 150 && b.bottom < 700; }); const b = e.getBoundingClientRect(); return { x: b.left - 110, y: b.top - 80, width: 260, height: 170 }; })()`)
  .then((c) => (send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 3, mobile: false }).then(() => sleep(600)).then(() => c))));
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

/* ---- phone 390: the strip, the full map with the dock, the brush list above the dock ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await load(LAB);
await js(`document.querySelector('.kx-map').scrollIntoView({ block: 'center' }); 1`); await sleep(400);
await shot('phone-390-strip.png', await clipOf('.kx-map', 8));
await js(`document.querySelector('.kx-keys .k-full').click(); 1`); await sleep(900); await zoomIn(2);
out.phone = await js(`(() => { const d = document.querySelector('.kx-dock').getBoundingClientRect();
  return { docW: document.documentElement.scrollWidth, dock: [...document.querySelectorAll('.kx-dock .kx-mapkey')].map((b) => Math.round(b.getBoundingClientRect().width) + 'x' + Math.round(b.getBoundingClientRect().height) + ' ' + b.innerText),
    labelsFit: [...document.querySelectorAll('.kx-dock .kx-mapkey > span')].every((s) => s.scrollWidth <= s.parentElement.clientWidth), dockBottomGap: Math.round(innerHeight - d.bottom),
    topKeysShown: getComputedStyle(document.querySelector('.kx-keys')).display, roundLocateShown: getComputedStyle(document.querySelector('.k-loc.round').parentElement).display }; })()`);
await shot('phone-390-full.png');
await js(`document.querySelector('.kx-dock .k-brush').click(); 1`); await sleep(700);
out.phoneBrush = await js(`(() => { const b = document.querySelector('.kx-brush').getBoundingClientRect(), d = document.querySelector('.kx-dock').getBoundingClientRect();
  return { gapAboveDock: Math.round(d.top - b.bottom), left: Math.round(b.left), right: Math.round(innerWidth - b.right), rows: [...document.querySelectorAll('.kx-brush .kx-pen')].map((p) => Math.round(p.getBoundingClientRect().height)).join(),
    namesClipped: [...document.querySelectorAll('.kx-pen .nm')].filter((n) => n.scrollWidth > n.clientWidth + 1).length }; })()`);
await shot('phone-390-brush.png');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

/* ---- the secure moment, live: &tick visits one more of Budi's shops every 2.5 s ---- */
const probe = (label) => js(`(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const snap = () => { const m = {}; document.querySelectorAll('.leaflet-marker-icon .kx-c5:not(.kx-slot .kx-c5)').forEach((c) => { m[c.closest('.leaflet-marker-icon').style.transform] = c.querySelector('svg.chest').getBoundingClientRect().bottom; }); return m; };
  let pre = snap(), found = null; const t0 = performance.now();
  while (performance.now() - t0 < 9000) { found = document.querySelector('.kx-c5.burst'); if (found) break; pre = snap(); await new Promise((r) => requestAnimationFrame(r)); }
  if (!found) return 'no burst within 9 s';
  const T = found.closest('.leaflet-marker-icon').style.transform, rest = pre[T], s0 = performance.now(), dy = [];
  while (performance.now() - s0 < 1400) { dy.push(Math.round(performance.now() - s0) + ':' + (found.querySelector('svg.chest').getBoundingClientRect().bottom - rest).toFixed(1)); await sleep(40); }
  const runningKx = document.getAnimations().filter((a) => a.playState === 'running' && /^kx-(hop|lid|fade|plant|lamp|spark)/.test(a.animationName)).length;
  await sleep(600);
  const now = snap()[T], el = [...document.querySelectorAll('.leaflet-marker-icon .kx-c5:not(.kx-slot .kx-c5)')].find((c) => c.closest('.leaflet-marker-icon').style.transform === T);
  return { cls: found.className, restBefore: rest, restAfter: now, moved: +(now - rest).toFixed(2), swappedToStill: el !== found && !/burst|resign/.test(el?.className || ''),
    lidOpenAfter: el ? getComputedStyle(el.querySelector('.lidU')).opacity : null, signAfter: !!el?.querySelector('.sign5'), runningKxAt1400: runningKx, dy: dy.join(' ') };
})()`);
await load(LAB + '&tick');
await js(`document.querySelector('.kx-keys .k-full').click(); 1`); await sleep(900); await zoomIn(2);
out.moment = await probe('normal');
out.moment2 = await probe('normal-2');

/* ---- Lite Mode: the app's own class; the moment and every loop end at once ---- */
await load(LAB + '&tick');
await js(`document.documentElement.classList.add('lite-mode'); 1`);
await js(`document.querySelector('.kx-keys .k-full').click(); 1`); await sleep(900); await zoomIn(2);
out.lite = await probe('lite');
out.liteRunning = await js(`document.getAnimations().filter((a) => a.playState === 'running' && /^kx-/.test(a.animationName)).map((a) => a.animationName)`);
await shot('pc-1440-lite.png');

out.errors = errs;
fs.writeFileSync(path.join(HERE, 'measure-built.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
ws.close(); chrome.kill();
await sleep(800); try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* chrome still closing */ }
