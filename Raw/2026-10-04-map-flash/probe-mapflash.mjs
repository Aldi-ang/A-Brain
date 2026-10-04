/* 2026-10-04 18:30 - his "yes please fix the map flash as well": Map System (MapMissionControl) keeps Leaflet's light #ddd
   under its dark default map, so every camera move to tiles not loaded yet shows a light patch until they arrive (the same
   flash Journey had, fixed in kpm aa87cd1). This probe, on the production lab build (kpm dist-ponderlab/, `?shell&map`),
   on a slow connection (300 ms per request, like a phone): for each base map it double-clicks the map twice (zoom in
   twice = all new tiles) and screencasts every painted frame. Per frame: mean brightness of the map, the share of the map
   that is LIGHT (luma > 190 - #ddd is 221, the dark land ~85) and the share that changed by more than 40 since the frame
   before. Also prints each map's loaded colour (mean RGB once settled) - the ground a missing tile should show.
   Usage: node probe-mapflash.mjs [label]   (writes result-<label>.json + the worst frame per map) */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../kpm-inventory-main/dist-ponderlab');
const LABEL = process.argv[2] || 'before';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => {
  const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); });
}).listen(4215);
const LAB = 'http://localhost:4215/tools/ponder-lab.html?shell&map';
const prof = path.join(HERE, 'profile-mf'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9425', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9425/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const frames = []; const errs = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Page.screencastFrame') { frames.push({ data: d.params.data, t: d.params.metadata.timestamp }); ws.send(JSON.stringify({ id: ++seq, method: 'Page.screencastFrameAck', params: { sessionId: d.params.sessionId } })); }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const waitFor = async (expr, ms) => { for (let i = 0; i < ms / 200; i++) { if (await js(expr)) return true; await sleep(200); } return false; };
await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: LAB });
const up = await waitFor('!!document.querySelector(".leaflet-container .leaflet-tile-loaded")', 25000); await sleep(3000);
const box = await js(`(() => { const b = document.querySelector('.leaflet-container').getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()`);
const ground = await js(`getComputedStyle(document.querySelector('.leaflet-container')).backgroundColor`);
const out = { label: LABEL, up, box, groundAtLoad: ground, maps: [] };
const MAPS = ['Dark Canvas (Esri)', 'Google Maps (Hybrid)', 'Light Canvas (Esri)'];
const lumOf = async (f) => js(`new Promise((ok) => { const i = new Image(); i.onload = () => { const k = i.naturalWidth / 1440, c = document.createElement('canvas'); c.width = Math.round(${box.w} / 4); c.height = Math.round(${box.h} / 4);
  const g = c.getContext('2d'); g.drawImage(i, ${box.x} * k, ${box.y} * k, ${box.w} * k, ${box.h} * k, 0, 0, c.width, c.height); const d = g.getImageData(0, 0, c.width, c.height).data; let s = 0, light = 0, R = 0, G = 0, B = 0; const px = [];
  for (let j = 0; j < d.length; j += 4) { const l = .2126 * d[j] + .7152 * d[j + 1] + .0722 * d[j + 2]; s += l; px.push(l); if (l > 190) light++; R += d[j]; G += d[j + 1]; B += d[j + 2]; }
  const n = px.length, last = window.__l; window.__l = px; let big = 0; if (last) px.forEach((l, j) => { if (Math.abs(l - last[j]) > 40) big++; });
  ok({ mean: +(s / n).toFixed(1), light: +(light / n).toFixed(3), big: +(big / n).toFixed(3), rgb: [R / n, G / n, B / n].map((v) => Math.round(v)) }); }; i.src = 'data:image/jpeg;base64,${f.data}'; })`);
for (const name of MAPS) {
  /* pick the base map through Leaflet's own control (a click on its radio), let it load at normal speed */
  const picked = await js(`(() => { const l = [...document.querySelectorAll('.leaflet-control-layers-base label')].find((x) => x.textContent.trim() === ${JSON.stringify(name)}); if (!l) return false; l.querySelector('input').click(); return true; })()`);
  await send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  await sleep(4000);
  const groundNow = await js(`getComputedStyle(document.querySelector('.leaflet-container')).backgroundColor`);
  /* settled colour of this map (one screenshot through the same reader) */
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
  await js('window.__l = null; 1'); const settled = await lumOf({ data: shot.result.data });
  /* slow connection, then zoom in twice where nothing is loaded */
  await send('Network.emulateNetworkConditions', { offline: false, latency: 300, downloadThroughput: -1, uploadThroughput: -1 });
  frames.length = 0; await send('Page.startScreencast', { format: 'jpeg', quality: 70, everyNthFrame: 1 }); await sleep(300);
  const cx = box.x + box.w * .42, cy = box.y + box.h * .45;
  for (const n of [1, 2]) {
    for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: cx, y: cy, button: 'left', clickCount: 1 });
    for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: cx, y: cy, button: 'left', clickCount: 2 });
    await sleep(2200);
  }
  await send('Page.stopScreencast');
  const fr = frames.slice(); await js('window.__l = null; 1');
  const rows = []; for (const f of fr) rows.push({ t: f.t, ...(await lumOf(f)) });
  const worst = rows.reduce((a, r) => (r.light > a.light ? r : a), rows[0] || { light: 0 });
  const wi = rows.indexOf(worst);
  if (fr[wi]) { const f = path.join(HERE, `worst-${LABEL}-${name.replace(/\W+/g, '-').toLowerCase()}.jpg`); fs.rmSync(f, { force: true }); fs.writeFileSync(f, Buffer.from(fr[wi].data, 'base64')); }
  out.maps.push({ name, picked, groundNow, settled: { mean: settled.mean, light: settled.light, rgb: settled.rgb }, frames: rows.length,
    meanMin: Math.min(...rows.map((r) => r.mean)), meanMax: Math.max(...rows.map((r) => r.mean)), lightMax: worst.light, bigMax: Math.max(...rows.map((r) => r.big)),
    lightFramesOver5pct: rows.filter((r) => r.light > settled.light + .05).length });
}
out.errs = errs;
const f = path.join(HERE, `result-${LABEL}.json`); fs.writeFileSync(f, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
