/* 2026-10-04 12:30 - his "the flash where i change the expedition user must be fix, because people with epilepsy may
   suffer from that". Records what the screen does when the pressed salesman CHANGES (Budi -> Ari), on the production lab
   build: a screencast (every frame Chrome paints, with its time) -> mean brightness of the map per frame and how much of
   it changed since the frame before; plus, per animation frame, how many tiles / chests / bubbles / men are visible and
   how many marker nodes were swapped. Saves the frames around the biggest jump.
   Usage: node probe-flash.mjs [pc|pcfull|phone] [label] */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../../kpm-inventory-main/dist-ponderlab');
const MODE = process.argv[2] || 'pc', LABEL = process.argv[3] || 'before';
const OUT = path.join(HERE, 'flash'); fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => {
  const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); });
}).listen(4201);
const LAB = 'http://localhost:4201/tools/ponder-lab.html?shell&journey&exp&admin&visits&boss';
const prof = path.join(HERE, 'profile-flash'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9412',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9412/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const frames = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Page.screencastFrame') { frames.push({ t: d.params.metadata.timestamp, data: d.params.data }); send('Page.screencastFrameAck', { sessionId: d.params.sessionId }); }
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const waitFor = async (expr, ms = 15000) => { for (let t = 0; t < ms; t += 150) { if (await js(expr)) return true; await sleep(150); } return false; };
await send('Page.enable'); await send('Runtime.enable');
/* `slow` (4th arg): a phone on mobile data - 300 ms per request, ~1.5 Mbit/s - so the tiles arrive late, as on his phone */
if (process.argv[4] === 'slow') { await send('Network.enable'); await send('Network.emulateNetworkConditions', { offline: false, latency: 300, downloadThroughput: 190000, uploadThroughput: 90000 }); }
if (MODE === 'phone') {
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
} else await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: LAB }); await waitFor('!!document.querySelector(".kx-keys .k-full")', 20000); await sleep(2000);
if (MODE !== 'pc') { await js(`[...document.querySelectorAll('.k-full')].find((b) => b.offsetParent)?.click(); 1`); await sleep(1500); }
const press = (who) => MODE === 'phone' ? `[...document.querySelectorAll('.kx-mchips button')].find((e) => /${who}/.test(e.textContent))?.click()`
  : MODE === 'pcfull' ? `[...document.querySelectorAll('.kx-mrow')].find((e) => /${who}/.test(e.textContent))?.click()`
  : `[...document.querySelectorAll('.kx-panel .kx-row')].find((e) => /${who}/.test(e.textContent))?.click()`;
await js(press(MODE === 'phone' ? 'BS' : 'Budi') + '; 1'); await sleep(3000);   // Budi pressed and settled

/* per animation frame: what is visible. Marker swaps counted by a MutationObserver on the marker pane */
await js(`(() => { const box = document.querySelector('.kx-map').getBoundingClientRect();
  const vis = (e) => { const b = e.getBoundingClientRect(); if (b.right < box.left || b.left > box.right || b.bottom < box.top || b.top > box.bottom) return false; let o = 1, n = e; while (n && n !== document.body) { o *= +getComputedStyle(n).opacity; n = n.parentElement; } return o > 0.5; };
  window.__rows = []; window.__mut = { add: 0, rem: 0 }; const t0 = performance.now();
  new MutationObserver((ms) => ms.forEach((m) => { window.__mut.add += m.addedNodes.length; window.__mut.rem += m.removedNodes.length; })).observe(document.querySelector('.leaflet-marker-pane'), { childList: true });
  const tick = () => { const t = performance.now() - t0; if (t > 2600) return;
    window.__rows.push({ t: Math.round(t), tiles: [...document.querySelectorAll('.leaflet-tile')].filter(vis).length, loaded: [...document.querySelectorAll('.leaflet-tile-loaded')].filter(vis).length,
      chests: [...document.querySelectorAll('.leaflet-marker-icon > .kx-c5')].filter(vis).length, bubbles: [...document.querySelectorAll('.kx-slot')].filter(vis).length,
      men: [...document.querySelectorAll('.leaflet-marker-icon > .kx-sm')].filter(vis).length, add: window.__mut.add, rem: window.__mut.rem,
      anims: document.getAnimations().filter((a) => a.playState === 'running').length, zoomAnim: document.querySelector('.leaflet-container').classList.contains('leaflet-zoom-anim') });
    requestAnimationFrame(tick); };
  window.__go = () => { requestAnimationFrame(tick); }; return 1; })()`);
const clip = await js(`(() => { const b = document.querySelector('.kx-map').getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height) }; })()`);
await send('Page.startScreencast', { format: 'jpeg', quality: 70, everyNthFrame: 1 });
await sleep(600);
const pressAt = (await js('performance.timeOrigin + performance.now()')) / 1000;
const TO = process.argv[5] || (MODE === 'phone' ? 'AR' : 'Ari');   // 5th arg: who is pressed next (DW = Dewi, far from Budi)
await js(`window.__go(); ${press(TO)}; 1`);   // CHANGE the pressed salesman
await sleep(2700);
await send('Page.stopScreencast');
const rows = await js('window.__rows');
const anims = await js(`[...new Set(document.getAnimations().map((a) => (a.animationName || a.transitionProperty || '?') + '@' + (a.effect?.target?.className?.baseVal ?? a.effect?.target?.className ?? '').toString().slice(0, 30)))].slice(0, 30)`);

/* brightness per frame, measured by the page itself (a canvas over each JPEG), map area only */
await send('Page.navigate', { url: 'about:blank' }); await sleep(300);
const VW = MODE === "phone" ? 390 : 1440;   // a screencast frame comes at its own size: scale the map box by naturalWidth / viewport width
const lum = [];
for (const f of frames) {
  lum.push(await js(`new Promise((ok) => { const i = new Image(); i.onload = () => { const c = document.createElement('canvas'); const k = i.naturalWidth / ${VW}, sx = ${clip.x} * k, sy = ${clip.y} * k, w = ${clip.w} * k, h = ${clip.h} * k;
    c.width = Math.round(w / 4); c.height = Math.round(h / 4); const g = c.getContext('2d'); g.drawImage(i, sx, sy, w, h, 0, 0, c.width, c.height); const d = g.getImageData(0, 0, c.width, c.height).data;
    let s = 0; const px = []; for (let k = 0; k < d.length; k += 4) { const l = 0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]; s += l; px.push(l); } window.__last = window.__cur; window.__cur = px;
    let diff = 0, big = 0; if (window.__last && window.__last.length === px.length) px.forEach((l, k) => { const dl = Math.abs(l - window.__last[k]); diff += dl; if (dl > 40) big++; });
    ok({ mean: +(s / px.length).toFixed(1), diff: +(diff / px.length).toFixed(1), bigShare: +(big / px.length).toFixed(3) }); }; i.src = 'data:image/jpeg;base64,${f.data}'; })`));
}
const tl = frames.map((f, k) => ({ ms: Math.round((f.t - pressAt) * 1000), ...lum[k] }));
const worst = tl.reduce((w, r, k) => (r.bigShare > (tl[w]?.bigShare ?? -1) && r.ms > 0 ? k : w), 0);
for (const k of [worst - 2, worst - 1, worst, worst + 1, worst + 2].filter((k) => k >= 0 && k < frames.length)) {
  const f = path.join(OUT, `${MODE}-${LABEL}-f${k}-${tl[k].ms}ms.jpg`); fs.rmSync(f, { force: true }); fs.writeFileSync(f, Buffer.from(frames[k].data, 'base64'));
}
const res = { mode: MODE, label: LABEL, frames: tl.length, worst: tl[worst], timeline: tl.filter((r) => r.ms > -100), rows: rows.filter((r, k) => k % 3 === 0 || r.loaded !== rows[k - 1]?.loaded || r.chests !== rows[k - 1]?.chests), anims };
fs.writeFileSync(path.join(OUT, `${MODE}-${LABEL}.json`), JSON.stringify(res, null, 1));
console.log(JSON.stringify({ worst: res.worst, frames: res.frames }));
console.log('timeline', tl.filter((r) => r.ms > -50 && r.ms < 1800).map((r) => `${r.ms}:${r.mean}/${r.bigShare}`).join(' '));
console.log('rows', rows.filter((r, k) => k % 4 === 0).map((r) => `${r.t}:t${r.loaded}/${r.tiles} c${r.chests} b${r.bubbles} m${r.men} +${r.add}-${r.rem} a${r.anims}${r.zoomAnim ? 'Z' : ''}`).join(' '));
ws.close(); chrome.kill(); server.close(); await sleep(1000);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
