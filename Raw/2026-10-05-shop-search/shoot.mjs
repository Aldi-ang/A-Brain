/* 2026-10-05 - his ask: drop the Journey "Global Fleet" filter, add a shop search that shows the location, on Journey AND
   on the regular map (Map System). Frames of the PRODUCTION lab build (kpm dist-ponderlab) at 1440 and 390 (touch media
   emulated, (hover: none) asserted - lessons 2026-10-03). Every frame is deleted before it is shot (lessons 2026-09-22).
   Usage: node shoot.mjs <tag>   -> <tag>-journey-pc.png, <tag>-journey-ph.png, <tag>-map-pc.png, <tag>-map-ph.png */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../kpm-inventory-main/dist-ponderlab');
const TAG = process.argv[2] || 'now';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => { const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4232);
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9432', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9432/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value; };
const shot = async (file) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const open = async (flags) => { await send('Page.navigate', { url: 'about:blank' }); await sleep(100); await send('Page.navigate', { url: 'http://localhost:4232/tools/ponder-lab.html?' + flags });
  for (let i = 0; i < 100 && !(await js('!!document.querySelector(".leaflet-container")')); i++) await sleep(200); await sleep(3000); };
await send('Page.enable'); await send('Runtime.enable');
const out = { errs };
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await open('shell&journey&exp&admin&visits'); await shot(`${TAG}-journey-pc.png`);
await open('shell&map'); await shot(`${TAG}-map-pc.png`);
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
await open('shell&journey&exp&admin&visits'); out.phoneMedia = await js(`matchMedia('(hover: none)').matches`);
await js(`document.querySelector('.kx-feed-head button')?.click(); 1`); await sleep(500); await shot(`${TAG}-journey-ph.png`);
await open('shell&map'); await shot(`${TAG}-map-ph.png`);
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
