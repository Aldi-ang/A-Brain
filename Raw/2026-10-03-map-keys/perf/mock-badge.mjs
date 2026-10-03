/* MOCK for his pick (2026-10-03 20:10), not app code: look B = a salesman whose spot is inside a bubble is not drawn
   on top of it; instead his small head sits on the bubble's top-left corner (several = a row of heads). Same lab build,
   same phone (390 x 844, touch), zoomed out 1 and 3 steps. Writes mock-a-out<z>.png (today, fixed) and mock-b-out<z>.png. */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../../kpm-inventory-main/dist-ponderlab');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };
const server = http.createServer((q, s) => { const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4198);
const prof = path.join(HERE, 'profile-mock'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9407', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9407/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shot = async (f) => fs.writeFileSync(path.join(HERE, f), Buffer.from((await send('Page.captureScreenshot', { format: 'png' })).result.data, 'base64'));
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
const BADGE = `(() => {
  const st = document.createElement('style'); st.textContent = '.mk-heads{position:absolute;left:-6px;top:-14px;display:flex;gap:1px;z-index:2}.mk-heads i{width:20px;height:20px;overflow:hidden;display:block;border:2px solid #0A0908;background:#1B1917}.mk-heads i svg{width:20px!important;height:28px!important;position:static!important}';
  document.head.append(st);
  const slots = [...document.querySelectorAll('.kx-slot')];
  let hid = 0;
  document.querySelectorAll('.kx-sm').forEach((p) => {
    const icon = p.closest('.leaflet-marker-icon'), ir = icon.getBoundingClientRect();
    const x = ir.left - parseFloat(icon.style.marginLeft), y = ir.top - parseFloat(icon.style.marginTop);   // his true spot
    const s = slots.find((e) => { const r = e.querySelector('.hop').getBoundingClientRect(); return x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6; });
    if (!s) return;
    icon.style.display = 'none'; hid++;
    const row = s.querySelector('.mk-heads') || s.appendChild(Object.assign(document.createElement('span'), { className: 'mk-heads' }));
    const head = document.createElement('i'); head.innerHTML = p.querySelector('.body svg').outerHTML; row.append(head);
  });
  return hid; })()`;
for (const z of [1, 3]) {
  await send('Page.navigate', { url: 'http://localhost:4198/tools/ponder-lab.html?shell&journey&exp&admin&visits' });
  for (let i = 0; i < 100; i++) { await sleep(200); if (await js('!!document.querySelector(".kx-keys .k-full")')) break; }
  await sleep(1500);
  await js(`document.querySelector('.kx-keys .k-full').click(); 1`); await sleep(1500);
  for (let k = 0; k < z; k++) { await js(`document.querySelector('.leaflet-control-zoom-out').click(); 1`); await sleep(900); }
  await sleep(1200);
  await shot(`mock-a-out${z}.png`);
  console.log('out' + z, 'salesmen moved onto a bubble corner:', await js(BADGE));
  await sleep(300); await shot(`mock-b-out${z}.png`);
}
ws.close(); chrome.kill(); server.close(); await sleep(800); try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
