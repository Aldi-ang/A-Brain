/* Day Replay v2 (his 2026-10-04 16:10: "make sure that all the stores is interactable when press ... notes or status ... a
   button to review the receipt from that sales ... see as a whole in pc and follow on phone"). REAL presses (mouse events
   at the element's centre through CDP, not .click()), on the Artifact-skeleton copy:
   PC: opens on Whole day; press each of the 9 shops -> its card names it, shows its status + note, the replay pauses;
   the sale's card has Review receipt -> the nota opens; Esc closes; Play from here plays. Phone: opens on Follow him; a
   shop press = the bottom sheet; the receipt fits 390 with no sideways scroll.
   Usage: node shoot-v2.mjs <dir-with-index.html> */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[2];
const OUT = path.join(HERE, 'shots2'); fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const page = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>'
  + fs.readFileSync(path.join(SRC, 'index.html'), 'utf8') + '</body></html>';
const server = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/') { s.writeHead(200, { 'content-type': 'text/html' }); s.end(page); return; }
  fs.readFile(path.join(SRC, u), (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': u.endsWith('.png') ? 'image/png' : 'image/jpeg' }); s.end(b); });
}).listen(4211);
const prof = path.join(HERE, 'profile2'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9421', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9421/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 300));
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errs.push('console: ' + JSON.stringify(d.params.args.map((a) => a.value ?? a.description)).slice(0, 300));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300)); return r.result?.result?.value; };
const shot = async (file) => { const f = path.join(OUT, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const tap = async (sel, touch) => {
  const c = await js(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
  if (!c) return false; await sleep(120);
  const c2 = await js(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
  if (touch) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: c2.x, y: c2.y }] }); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c2.x, y: c2.y, button: 'left', clickCount: 1 }); }
  await sleep(300); return true;
};
const load = async () => { await send('Page.navigate', { url: 'http://localhost:4211/' }); for (let i = 0; i < 60; i++) { if (await js('!!window.__replay')) break; await sleep(150); } await js('document.fonts.ready.then(() => 1)'); await sleep(600); };
const CARD = `(() => { const c = document.getElementById('shopcard'); return c.hidden ? null : { name: c.querySelector('.sc-top b')?.textContent, status: c.querySelector('.sc-status')?.textContent, note: c.querySelector('.sc-note')?.textContent,
  receipt: !!c.querySelector('[data-rc]'), playing: window.__replay.playing, picked: document.querySelector('.stop.picked')?.dataset.k }; })()`;
const out = { errs, pc: {}, phone: {} };
await send('Page.enable'); await send('Runtime.enable');

/* ---- PC ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await load();
out.pc.cam = await js('window.__replay.cam');
await js(`window.__replay.pause(); window.__replay.seek(window.__replay.sceneSeg(4).t1 + 50); 1`); await sleep(200);
out.pc.cards = [];
for (let k = 0; k <= 8; k++) { await tap(`.stop[data-k="${k}"]`); out.pc.cards.push(await js(CARD)); if (k === 3) await shot('pc-card-swap.png'); }
await tap('.stop[data-k="1"]'); await shot('pc-card-sale.png');
await tap('#shopcard [data-rc]'); out.pc.receipt = await js(`(() => { const r = document.getElementById('rcpt'); return { open: !r.hidden, rows: r.querySelectorAll('tbody tr').length, total: r.querySelector('.tot')?.textContent, sheetW: Math.round(document.getElementById('sheetbox').getBoundingClientRect().width) }; })()`);
await shot('pc-receipt.png');
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }); await sleep(200);
out.pc.receiptClosedByEsc = await js(`document.getElementById('rcpt').hidden`);
await tap('#shopcard [data-from]'); await sleep(400);
out.pc.playFromHere = await js(`({ playing: window.__replay.playing, cardHidden: document.getElementById('shopcard').hidden, now: document.querySelector('.row.now .s b')?.textContent })`);
await tap('.rc[data-rc="1"]'); out.pc.rowReceipt = await js(`!document.getElementById('rcpt').hidden`);
await tap('#rcptx');
await js(`window.__replay.pause(); window.__replay.seek(window.__replay.sceneSeg(6).t0 + 900); 1`); await sleep(200);
await shot('pc-whole-mid.png');

/* ---- phone ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
await load();
out.phone.cam = await js('window.__replay.cam');
await js(`window.__replay.pause(); window.__replay.seek(window.__replay.sceneSeg(1).t1 + 100); 1`); await sleep(300);
await tap('.stop[data-k="1"]', true); out.phone.card = await js(CARD);
await js(`document.getElementById('box').scrollIntoView({ block: 'start' }); 1`); await sleep(150);
await shot('ph-card-sale.png');
await tap('#shopcard [data-rc]', true);
out.phone.receipt = await js(`({ open: !document.getElementById('rcpt').hidden, overflow: document.documentElement.scrollWidth - innerWidth, sheetW: Math.round(document.getElementById('sheetbox').getBoundingClientRect().width) })`);
await shot('ph-receipt.png');
fs.writeFileSync(path.join(OUT, 'measure2.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); server.close(); await sleep(1000);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
