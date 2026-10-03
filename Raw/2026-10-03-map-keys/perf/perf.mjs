/* Journey map, ZOOMED OUT, on a phone-speed CPU (his "when the map is zoomed out usually its making so much lag ...
   on the phone", 2026-10-03 17:30). Serves the PRODUCTION lab build (kpm dist-ponderlab/, `npx vite build --config
   tools/ponder-lab.config.mjs`) from a throwaway static server inside this script, drives headless Chrome at 390 x 844
   with the CPU slowed 6x, and measures per variant: idle cost at rest, the cost of one zoom in + out, the longest
   frame, the marker DOM, and how many salesmen overlap a chest or a bubble. Variants switch one suspect off at a time.
   Usage: node perf.mjs <label>   (writes perf-<label>.json and zoomed-out-<label>.png next to this file) */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../../kpm-inventory-main/dist-ponderlab');
const LABEL = process.argv[2] || 'run';
const OUT_STEPS = +(process.argv[3] || 3);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.webp': 'image/webp', '.ico': 'image/x-icon' };
const server = http.createServer((q, s) => {
  const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); });
}).listen(4197);
const LAB = 'http://localhost:4197/tools/ponder-lab.html?shell&journey&exp&admin&visits';

const prof = path.join(HERE, 'profile-' + LABEL); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9406',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9406/json/list')).json(); } catch { /* not up */ } }
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
const metrics = async () => Object.fromEntries((await send('Performance.getMetrics')).result.metrics.map((m) => [m.name, m.value]));
const delta = (a, b) => ({ taskMs: Math.round((b.TaskDuration - a.TaskDuration) * 1000), scriptMs: Math.round((b.ScriptDuration - a.ScriptDuration) * 1000),
  layoutMs: Math.round((b.LayoutDuration - a.LayoutDuration) * 1000), styleMs: Math.round((b.RecalcStyleDuration - a.RecalcStyleDuration) * 1000) });

const VARIANTS = {
  base: '',
  noAnim: '*, *::before, *::after { animation: none !important; transition: none !important; }',
  noPeople: '.kx-sm { display: none !important; }',
  noMarch: '.kx-march { animation: none !important; }',
  marchSteps: '.kx-march { animation-timing-function: steps(16) !important; }',
  marchOne: '.kx-march ~ .kx-march { animation: none !important; }',
  noLoopsPeople: '.kx-sm, .kx-sm * { animation: none !important; }',
  pausedInZoom: '.leaflet-zoom-anim .kx-march, .leaflet-zoom-anim .kx-sm, .leaflet-zoom-anim .kx-sm * { animation-play-state: paused !important; }',
};
await send('Page.enable'); await send('Runtime.enable'); await send('Performance.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
const out = { label: LABEL, outSteps: OUT_STEPS, variants: {} };
const ONLY = (process.argv[4] || "").split(",").filter(Boolean);
for (const [name, css] of Object.entries(VARIANTS).filter(([n]) => !ONLY.length || ONLY.includes(n))) {
  await send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await send('Page.navigate', { url: LAB });
  for (let i = 0; i < 100; i++) { await sleep(200); if (await js('!!document.querySelector(".kx-keys .k-full")')) break; }
  await sleep(1500);
  if (css) await js(`(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.append(s); return 1; })()`);
  await js(`document.querySelector('.kx-keys .k-full').click(); 1`); await sleep(1500);
  for (let k = 0; k < OUT_STEPS; k++) { await js(`document.querySelector('.leaflet-control-zoom-out').click(); 1`); await sleep(700); }
  await sleep(1500);
  await send('Emulation.setCPUThrottlingRate', { rate: 6 });
  await sleep(500);
  /* idle at rest: 3 s */
  const i0 = await metrics(); await sleep(3000); const i1 = await metrics();
  const idle = delta(i0, i1);
  /* one zoom in + one zoom out, frames recorded in the page */
  await js(`(() => { window.__f = []; let last = performance.now(); const tick = (t) => { window.__f.push(t - last); last = t; if (window.__on) requestAnimationFrame(tick); }; window.__on = true; requestAnimationFrame(tick); return 1; })()`);
  const z0 = await metrics();
  await js(`document.querySelector('.leaflet-control-zoom-in').click(); 1`); await sleep(2200);
  await js(`document.querySelector('.leaflet-control-zoom-out').click(); 1`); await sleep(2200);
  const z1 = await metrics();
  const frames = await js(`(() => { window.__on = false; const f = window.__f.slice(1); return { n: f.length, max: Math.round(Math.max(...f)), over50: f.filter((x) => x > 50).length, over100: f.filter((x) => x > 100).length }; })()`);
  await send('Emulation.setCPUThrottlingRate', { rate: 1 });
  const domExpr = `(() => { const pane = document.querySelector('.leaflet-marker-pane');
    const box = (e) => e.getBoundingClientRect(); const hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const vis = (r) => r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
    const people = [...document.querySelectorAll('.kx-sm')].map((e) => { const b = box(e.querySelector('.body')), t = box(e.querySelector('.tag')); return { left: Math.min(b.left, t.left), right: Math.max(b.right, t.right), top: t.top, bottom: b.bottom, cls: e.className + ' @' + (e.style.translate || '0') + ' box ' + [b.left, t.top, b.right, b.bottom].map(Math.round).join(',') }; }).filter(vis);
    const things = [...document.querySelectorAll('.leaflet-marker-icon .kx-c5:not(.kx-slot .kx-c5), .kx-slot')].map((e) => box(e.matches('.kx-slot') ? e.querySelector('.hop') : e.querySelector('svg.chest') || e)).filter(vis);
    return { markerPaneNodes: pane.querySelectorAll('*').length, rects: pane.querySelectorAll('rect').length, icons: pane.children.length, slots: document.querySelectorAll('.kx-slot').length,
      chests: document.querySelectorAll('.leaflet-marker-icon .kx-c5:not(.kx-slot .kx-c5)').length, people: people.length,
      allPeople: people.map((p) => p.cls).join(' || '), allThings: things.map((t) => [t.left, t.top, t.right, t.bottom].map(Math.round).join(',')).join(' '),
      peopleOnThings: people.filter((p) => things.some((t) => hit(p, t))).length, onWhat: people.filter((p) => things.some((t) => hit(p, t))).map((p) => p.cls).join('|'), peopleOnPeople: people.filter((p, i) => people.some((q, j) => i !== j && hit(p, q))).length,
      running: Object.entries(document.getAnimations().filter((a) => a.playState === 'running').reduce((m, a) => { const k = a.animationName || a.transitionProperty || 'other'; m[k] = (m[k] || 0) + 1; return m; }, {})).map(([k, v]) => k + ':' + v).join(' ') }; })()`;
  const dom = await js(domExpr);
  /* one more step-aside pass, forced, then measure again: separates "ran too early" from "found no free spot" */
  await js(`document.querySelector('.leaflet-marker-pane').dispatchEvent(new Event('transitionend')); 1`); await sleep(900);
  const dom2 = await js(domExpr);
  out.variants[name] = { idle3s: idle, zoomInOut: { ...delta(z0, z1), frames }, dom, dom2, docNodes: (await metrics()).Nodes };
  if (name === 'base') {
    const s = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(HERE, `zoomed-out-${LABEL}.png`), Buffer.from(s.result.data, 'base64'));
  }
  console.log(name, JSON.stringify(out.variants[name]));
}
out.errors = errs;
fs.writeFileSync(path.join(HERE, `perf-${LABEL}.json`), JSON.stringify(out, null, 2));
ws.close(); chrome.kill(); server.close();
await sleep(800); try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* chrome still closing */ }
process.exit(0);
