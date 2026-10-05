/* 2026-10-05 - the BUILT Map System redesign (his "A for phone B for PC") on the PRODUCTION lab build (kpm dist-ponderlab,
   ?shell&map&admin), opened with REAL input: CDP mouse at 1440 / 1024, CDP touch at 390 with the touch media emulated and
   (hover: none) asserted. Every frame is deleted before it is shot. Measures: the floating parts never overlap each other,
   no text spills its box, no sideways scroll, the phone's one-sheet rule, console errors.
   Usage: node shoot-built.mjs -> <w>-<state>.png + built.json */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../../kpm-inventory-main/dist-ponderlab');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => { const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4236);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-shoot-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9436', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9436/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200));
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errs.push(d.params.args.map((a) => a.value || a.description || '').join(' ').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value; };
const shot = async (file) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const open = async (q) => { await send('Page.navigate', { url: 'about:blank' }); await sleep(100); await send('Page.navigate', { url: 'http://localhost:4236/tools/ponder-lab.html?shell&map' + q });
  for (let i = 0; i < 100 && !(await js('!!document.querySelector(".leaflet-container")')); i++) await sleep(200); await sleep(2500); };
/* a real press at the centre of the first VISIBLE element matching a selector (and, optionally, whose text matches) */
let touch = false;
const press = async (sel, re = null) => {
  const c = await js(`(() => { const b = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(x).visibility !== 'hidden' && ${re ? `${re}.test(x.innerText.replace(/\\s+/g, ' '))` : 'true'}; });
    if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  if (!c) return false;
  if (touch) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
  await sleep(900); return true;
};
const search = async (text) => { await press('input[aria-label="Find a shop"]'); await send('Input.insertText', { text });
  for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: type === 'keyDown' ? '\r' : undefined }); await sleep(2200); };
/* what is on screen: the floating parts' boxes, overlaps between them, spilled text, sideways scroll, toasts */
const measure = () => js(`(() => {
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).display !== 'none' ? r : null; };
  const parts = { top: '.ms-top', totals: '.ms-totals', areas: '.ms-areas', zone: '.ms-zone', levels: '.ms-levels', layers: '.ms-layers', tools: '.ms-tools', dock: '.ms-dock', sheet: '.ms-sheet', store: '.ms-store', heat: '.ms-heatkey', zoom: '.leaflet-control-zoom', baselayers: '.leaflet-control-layers' };
  const box = {}; for (const [k, s] of Object.entries(parts)) { const e = document.querySelector(s); const r = e && vis(e); if (r && r.bottom > 0 && r.top < innerHeight) box[k] = [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; }
  const hit = (a, b) => a[0] < b[2] - 1 && b[0] < a[2] - 1 && a[1] < b[3] - 1 && b[1] < a[3] - 1;
  const ks = Object.keys(box), overlaps = [];
  for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) if (hit(box[ks[i]], box[ks[j]]) && !['sheet', 'store'].includes(ks[i]) && !['sheet', 'store'].includes(ks[j])) overlaps.push(ks[i] + '×' + ks[j]);
  const spill = [...document.querySelectorAll('.ms-root *')].filter((e) => vis(e) && e.children.length === 0 && e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible' && !['INPUT', 'SELECT'].includes(e.tagName)).map((e) => e.className + ':' + e.innerText.slice(0, 30)).slice(0, 8);
  const small = [...document.querySelectorAll('.ms-root button, .ms-root a, .ms-root select, .ms-root input')].filter((e) => { const r = vis(e); return r && innerWidth < 1024 && (r.height < 44 || r.width < 44) && !e.closest('.leaflet-control-layers-list'); }).map((e) => (e.getAttribute('aria-label') || e.innerText || e.className).slice(0, 24) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)).slice(0, 10);
  return { box, overlaps, spill, small, sideways: document.documentElement.scrollWidth > innerWidth, face: document.fonts.check('700 22px Rajdhani') && [...document.fonts].some((f) => f.family.includes('Rajdhani') && f.status === 'loaded'), tnum: (() => { const m = (t) => { const e = document.createElement('span'); e.style.cssText = 'position:absolute;visibility:hidden;font:700 20px var(--font-mono);font-variant-numeric:tabular-nums'; e.textContent = t; document.body.appendChild(e); const w = e.getBoundingClientRect().width; e.remove(); return Math.round(w * 10) / 10; }; return m('1111') + '/' + m('8888'); })(), pins: document.querySelectorAll('.ms-pin').length, hubs: [...document.querySelectorAll('.ms-mk.hub')].filter((e) => vis(e)).length, roofs: [...document.querySelectorAll('.ms-mk.hub .roof')].filter((e) => vis(e)).length, sprouts: [...document.querySelectorAll('.ms-mk')].filter((e) => vis(e) && /#B8B0A4/i.test(e.getAttribute('style') || '')).length, clusters: document.querySelectorAll('.ms-cluster').length, sheet: !!document.querySelector('.ms-sheet'),
    toast: [...document.querySelectorAll('.fixed.inset-x-0.top-0 [role=status], .fixed.inset-x-0.top-0 [role=alert]')].map((e) => e.innerText.trim()).filter(Boolean).slice(-2) };
})()`);
const out = { errs };
const run = async (w, q, states) => { const r = {}; await open(q); if (touch) r.media = await js(`matchMedia('(hover: none)').matches && matchMedia('(pointer: coarse)').matches`);
  for (const [name, act] of states) { if (act) await act(); r[name] = await measure(); await shot(`${w}-${name}.png`); } return r; };

await send('Page.enable'); await send('Runtime.enable');
/* PC 1440, the boss */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
out.pc = await run('pc', '&admin', [
  ['rest', null],
  ['seeall', () => press('.ms-areas .ms-link')],
  ['area', () => press('.ms-areas .ms-area')],
  ['levels-off', () => press('.ms-levels .ms-chip', '/bronze/i')],
  ['heat', async () => { await press('.ms-levels .ms-chip.all'); await press('.ms-layers .kx-mapkey', '/sales heat/i'); }],
  ['catch', async () => { await press('.ms-layers .kx-mapkey', '/sales heat/i'); await press('.ms-layers .kx-mapkey', '/catchment/i'); }],
  ['card', async () => { await press('.ms-layers .kx-mapkey', '/catchment/i'); await search('sinar'); }],
  ['card-tools', () => press('.ms-store [aria-label="Boss tools"]')],
  ['card-unpaid', () => press('.ms-store .ms-stats button')],
  ['hub', async () => { await open('&admin'); await search('berkah'); }],
  ['hub-closed', () => press('.ms-store .ms-x')],
]);
/* PC 1024 + a salesman (no money) */
await send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 700, deviceScaleFactor: 1, mobile: false });
out.pc1024 = await run('pc1024', '&admin', [['rest', null], ['card', () => search('sinar')]]);
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
out.pcSales = await run('pcsales', '', [['rest', null], ['card', () => search('sinar')]]);
/* phone 390, touch */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
touch = true;
out.ph = await run('ph', '&admin', [
  ['rest', null],
  ['areas', () => press('.ms-dock .kx-mapkey', '/areas/i')],
  ['areas-again', () => press('.ms-dock .kx-mapkey', '/areas/i')],
  ['levels', () => press('.ms-dock .kx-mapkey', '/levels/i')],
  ['layers', () => press('.ms-dock .kx-mapkey', '/layers/i')],
  ['area-pick', async () => { await press('.ms-dock .kx-mapkey', '/areas/i'); await press('.ms-sheet .ms-area'); await sleep(800); }],
  ['card', () => search('sinar')],
  ['card-tools', () => press('.ms-store [aria-label="Boss tools"]')],
]);
fs.writeFileSync(path.join(HERE, 'built.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
