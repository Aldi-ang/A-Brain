/* why the 390 run found no Map System pin: what is on the phone map after load */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), DIST = path.resolve(HERE, '../../../kpm-inventory-main/dist-ponderlab');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp3': 'audio/mpeg' };
const server = http.createServer((q, s) => { const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4213);
const prof = path.join(HERE, 'profile-p'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9413', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9413/json/list')).json(); } catch { /* */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Page.navigate', { url: 'http://localhost:4213/tools/ponder-lab.html?shell&map' });
await sleep(6000);
console.log(JSON.stringify(await js(`(() => { const m = document.querySelector('.leaflet-container'); const b = m?.getBoundingClientRect();
  return { map: b && { top: Math.round(b.top), h: Math.round(b.height), w: Math.round(b.width) }, vh: innerHeight, pins: document.querySelectorAll('.ms-pin').length, groups: document.querySelectorAll('.custom-cluster-icon').length,
    groupTops: [...document.querySelectorAll('.custom-cluster-icon')].slice(0, 5).map((e) => Math.round(e.getBoundingClientRect().top)), markers: document.querySelectorAll('.leaflet-marker-icon').length,
    classes: [...new Set([...document.querySelectorAll('.leaflet-marker-icon')].map((e) => e.className.split(' ').filter((c) => !c.startsWith('leaflet')).join('.')))] }; })()`)));
ws.close(); chrome.kill(); server.close(); process.exit(0);
