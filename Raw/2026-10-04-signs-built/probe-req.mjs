/* 2026-10-04 19:35 - the open request BUILT (his "B is good", cleared by a Request done press): on the production lab build
   (kpm dist-ponderlab, ?shell&journey&exp&admin&visits&boss - today's New Request reports carry one, and shop 1-2 still has
   Friday's). Real presses through CDP. Checks: the "!" is on chests and bubbles that hold a request (count > 0, a floor),
   never on the red flag or the name tag; pressing a request chest opens its popup with the Request done key; the key asks
   first (the dialog gate); confirming sends ONE update that deletes openRequest; cancelling sends nothing.
   Usage: node probe-req.mjs */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../kpm-inventory-main/dist-ponderlab');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => { const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4218);
const LAB = 'http://localhost:4218/tools/ponder-lab.html?shell&journey&exp&admin&visits&boss';
const prof = path.join(HERE, 'profile-r'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9428', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9428/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 200)); return r.result?.result?.value; };
const click = async (expr) => { const c = await js(`(() => { const e = ${expr}; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`); if (!c) return false;
  for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 }); await sleep(450); return true; };
const shot = async (file, clip) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip } : {}) }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const out = { errs };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 2, mobile: false });
await send('Page.navigate', { url: LAB });
for (let i = 0; i < 100 && !(await js('!!document.querySelector(".leaflet-marker-icon")')); i++) await sleep(200);
await sleep(2500);
const COUNT = `(() => { const R = (e) => e.getBoundingClientRect(), hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  const chests = [...document.querySelectorAll('.leaflet-marker-icon > .kx-c5 > .kx-req')], slots = [...document.querySelectorAll('.kx-slot > .kx-req')];
  const clash = chests.filter((q) => { const c = q.parentElement, r = R(q); return [...c.querySelectorAll(':scope > .kx-free, :scope > .kx-otag')].some((e) => hit(r, R(e))); }).length
    + slots.filter((q) => { const f = q.parentElement.querySelector(':scope > .kx-free'); return f && hit(R(q), R(f)); }).length;
  return { onChests: chests.length, onBubbles: slots.length, clash, newOnes: document.querySelectorAll('.kx-req.new').length }; })()`;
out.atLoad = await js(COUNT);
/* zoom into a bubble that holds a request until a request chest stands alone */
for (let i = 0; i < 5 && !(await js('!!document.querySelector(".leaflet-marker-icon > .kx-c5 > .kx-req")')); i++) { await click(`document.querySelector('.kx-slot > .kx-req')?.closest('.leaflet-marker-icon')`); await sleep(900); }
out.zoomed = await js(COUNT);
await shot('req-map.png', await js(`(() => { const b = document.querySelector('.leaflet-container').getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: b.height, scale: 1 }; })()`));
/* press the request chest: its popup carries the Request done key */
await click(`document.querySelector('.leaflet-marker-icon > .kx-c5 > .kx-req')?.closest('.leaflet-marker-icon')`); await sleep(500);
out.popup = await js(`(() => { const k = document.querySelector('.leaflet-popup .kx-reqkey'); return k ? { text: k.innerText.replace(/\\s+/g, ' ').trim(), h: Math.round(k.getBoundingClientRect().height) } : null; })()`);
if (out.popup) await shot('req-popup.png', await js(`(() => { const b = document.querySelector('.leaflet-popup').getBoundingClientRect(); return { x: b.left - 10, y: b.top - 10, width: b.width + 20, height: b.height + 20, scale: 1 }; })()`));
/* cancel first: nothing is written */
const writes = () => js(`(globalThis.__labWrites || []).filter((w) => w.op === 'update' && 'openRequest' in (w.data || {})).map((w) => ({ path: w.path.split('/').slice(-1)[0], keys: Object.keys(w.data) }))`);
const before = (await writes()).length;
await click(`document.querySelector('.leaflet-popup .kx-reqkey')`);
out.dialog = await js(`(() => { const d = [...document.querySelectorAll('[role="dialog"], [role="alertdialog"]')].find((e) => e.offsetParent); return d ? d.innerText.replace(/\\s+/g, ' ').trim().slice(0, 160) : null; })()`);
await click(`[...document.querySelectorAll('[role="dialog"] button, [role="alertdialog"] button')].filter((b) => b.offsetParent)[0]`);
out.afterCancel = (await writes()).length - before;
/* then confirm: one update that deletes openRequest */
await click(`document.querySelector('.leaflet-popup .kx-reqkey')`);
await click(`[...document.querySelectorAll('[role="dialog"] button, [role="alertdialog"] button')].filter((b) => b.offsetParent).slice(-1)[0]`);
const w = await writes(); out.afterConfirm = w.length - before; out.lastWrite = w.slice(-1)[0];
fs.writeFileSync(path.join(HERE, 'req.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
