/* 2026-10-05 - his two "too small" reports, measured on the production lab build at 1440 and 390 (touch media):
   (1) a notification's text (Toast.jsx) - raised by a "Find a shop" miss on Journey Plan;
   (2) Map System's shop pins (MapMissionControl getIcon) - every pin's drawn medal size.
   Refuses a bundle older than the source (lessons 2026-10-05). Usage: node shoot-small.mjs */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '../../../kpm-inventory-main'), DIST = path.join(SRC, 'dist-ponderlab');
const newest = (dir) => fs.readdirSync(dir, { recursive: true }).filter((f) => /\.(jsx?|css)$/.test(f)).reduce((m, f) => Math.max(m, fs.statSync(path.join(dir, f)).mtimeMs), 0);
if (Math.max(newest(path.join(SRC, 'src')), newest(path.join(SRC, 'tools'))) > fs.statSync(path.join(DIST, 'tools/ponder-lab.html')).mtimeMs) { console.log('STALE LAB BUNDLE - build first'); process.exit(1); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => { const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4212);
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9412', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9412/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(), errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shot = async (file, clip) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const waitFor = async (e, ms = 20000) => { for (let t = 0; t < ms; t += 150) { if (await js(e)) return true; await sleep(150); } return false; };
const results = []; const ok = (n, p, d) => { results.push({ name: n, pass: !!p, data: d }); console.log(p ? 'PASS' : 'FAIL', n, JSON.stringify(d ?? '').slice(0, 220)); };
await send('Page.enable'); await send('Runtime.enable');
const go = async (url) => { await send('Page.navigate', { url: 'about:blank' }); await sleep(100); await send('Page.navigate', { url }); };

for (const [w, h, phone] of [[1440, 1000, false], [390, 844, true]]) {
  const tag = phone ? 'ph' : 'pc';
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: phone ? 2 : 1, mobile: phone });
  await send('Emulation.setTouchEmulationEnabled', { enabled: phone, maxTouchPoints: phone ? 5 : 1 });
  await send('Emulation.setEmulatedMedia', { features: phone ? [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] : [] });
  /* (1) the notification */
  await go('http://localhost:4212/tools/ponder-lab.html?shell&journey&exp&admin');
  await waitFor('!!document.querySelector(".kx-map .leaflet-marker-icon")'); await sleep(1200);
  if (phone) ok(`${tag}: the touch media is live`, await js(`matchMedia('(hover: none)').matches`));
  await js(`(() => { const i = [...document.querySelectorAll('input')].find((x) => /shop name/i.test(x.placeholder || '') && x.getClientRects().length); i.focus(); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, 'Toko Coba Baru Yang Tidak Ada'); i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); return 1; })()`);
  ok(`${tag}: a notification shows`, await waitFor(`!!document.querySelector('[role="status"] .whitespace-pre-line, [role="alert"] .whitespace-pre-line')`, 4000));
  await sleep(500);
  const t = await js(`(() => { const e = document.querySelector('[role="status"] .whitespace-pre-line, [role="alert"] .whitespace-pre-line'); const cs = getComputedStyle(e), b = e.closest('[role]').getBoundingClientRect(); return { px: parseFloat(cs.fontSize), weight: cs.fontWeight, color: cs.color, family: cs.fontFamily.split(',')[0], text: e.textContent, box: { x: Math.max(0, b.left - 8), y: Math.max(0, b.top - 8), width: Math.min(innerWidth, b.width + 16), height: b.height + 16 }, right: b.right, vw: innerWidth }; })()`);
  ok(`${tag}: the notification text is 15 px semibold in the app's ink, inside the screen`, t.px === 15 && +t.weight === 600 && t.color === 'rgb(232, 228, 222)' && t.right <= t.vw, t);
  await shot(`${tag}-toast.png`, t.box);
  /* (2) Map System's pins */
  await go('http://localhost:4212/tools/ponder-lab.html?shell&map&admin');
  await waitFor('!!document.querySelector(".leaflet-container")'); await sleep(2000);
  const tap = async (sel, re) => { const c = await js(`(() => { const e = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => ${re} .test(x.textContent) && x.getClientRects().length); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!c) return false; await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(900); return true; };
  /* the phone opens away from the shops: Areas -> the first area flies the map there (his own way in) */
  if (phone) ok('ph: Areas -> an area flies to its shops', (await tap('.ms-dock .kx-mapkey', '/areas/i')) && (await tap('.ms-sheet .ms-area', '/./')));
  if (phone) for (let k = 0; k < 3 && !(await js(`document.querySelectorAll('.custom-cluster-icon, .ms-pin').length`)); k++) await tap('.leaflet-control-zoom-out', '/./');
  /* a group opens by a press (it zooms to its shops), the way he would get to single pins */
  for (let k = 0; k < 4; k++) {
    const n = await js(`document.querySelectorAll('.ms-pin > .ms-mk').length`);
    if (n >= 5) break;
    const c = await js(`(() => { const m = document.querySelector('.leaflet-container').getBoundingClientRect(); const e = [...document.querySelectorAll('.custom-cluster-icon')].map((x) => x.getBoundingClientRect()).find((b) => b.left > m.left && b.right < m.right && b.top > m.top && b.bottom < Math.min(m.bottom, innerHeight)); return e ? { x: e.left + e.width / 2, y: e.top + e.height / 2 } : null; })()`);
    if (!c) break;
    if (phone) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
    else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
    await sleep(1400);
  }
  const pins = await js(`(() => { const s = [...document.querySelectorAll('.ms-pin > .ms-mk')].map((e) => Math.round(e.getBoundingClientRect().width)); return { n: s.length, min: Math.min(...s), max: Math.max(...s), sizes: [...new Set(s)].sort((a, b) => a - b) }; })()`);
  ok(`${tag}: every map pin is at least 31 px (Unranked was 22)`, pins.n > 0 && pins.min >= 31, pins);
  const mapBox = await js(`(() => { const b = document.querySelector('.leaflet-container').getBoundingClientRect(); return { x: b.left, y: b.top, width: Math.min(b.width, innerWidth), height: Math.min(b.height, innerHeight - b.top) }; })()`);
  await shot(`${tag}-pins.png`, mapBox);
}
ok('no page errors', errs.length === 0, errs);
fs.writeFileSync(path.join(HERE, 'results.json'), JSON.stringify(results, null, 1));
console.log(`${results.filter((r) => r.pass).length}/${results.length} pass`);
ws.close(); chrome.kill(); server.close(); process.exit(0);
