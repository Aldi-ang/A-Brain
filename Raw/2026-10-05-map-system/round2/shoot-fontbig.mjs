/* 2026-10-05 11:50 - big font frames for his pick; harness copied from shoot-round2.mjs */
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
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4238);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-fb-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9438', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9438/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value; };
const shot = async (file, clip) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const open = async () => { await send('Page.navigate', { url: 'about:blank' }); await sleep(100); await send('Page.navigate', { url: 'http://localhost:4238/tools/ponder-lab.html?shell&map&admin' });
  for (let i = 0; i < 100 && !(await js('!!document.querySelector(".leaflet-container")')); i++) await sleep(200); await sleep(2500); };
const centre = (sel, re) => js(`(() => { const b = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => { const r = x.getBoundingClientRect(); return r.width > 0 && ${re ? `${re}.test(x.innerText)` : 'true'}; }); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
let touch = false;
const press = async (sel, re) => { const c = await centre(sel, re); if (!c) return false;
  if (touch) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
  await sleep(900); return true; };
const FONTS = { B: ['Barlow+Condensed', 'Barlow Condensed'], C: ['Rajdhani', 'Rajdhani'] };
const useFont = (k) => !FONTS[k] ? js('document.fonts.ready.then(() => getComputedStyle(document.querySelector(".ms-totals b")).fontFamily)') : js(`(async () => {
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=${FONTS[k][0]}:wght@500;600;700;800;900&display=block'; document.head.appendChild(l);
  await new Promise((r) => { l.onload = r; l.onerror = r; });
  const s = document.createElement('style'); s.textContent = ':root { --font-display: "${FONTS[k][1]}", "Arial Narrow", sans-serif !important; }${k === 'C' ? ' :root { --font-mono: "Rajdhani", sans-serif !important; }' : ''}'; document.head.appendChild(s);
  await Promise.all(['900 22px', '800 22px', '700 16px'].map((w) => document.fonts.load(w + ' "${FONTS[k][1]}"'))); await document.fonts.ready; await new Promise((r) => setTimeout(r, 400));
  return [...document.fonts].filter((f) => f.family.includes('${FONTS[k][1]}') && f.status === 'loaded').length + ' faces loaded'; })()`);
/* BIG font frames (his 11:50 "i cant see the fonts the example u are giving me is too small"): the totals bar, one area
   row and the phone's Areas header, each cropped tight and shot at 3x pixels, so a letter is ~3x its app size */
const out = { errs, fonts: {} };
await send('Page.enable'); await send('Runtime.enable');
const rect = (sel, pad = 6) => js(`(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: r.left - ${pad}, y: r.top - ${pad}, width: r.width + ${pad * 2}, height: r.height + ${pad * 2} }; })()`);
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 3, mobile: false });
for (const k of ['A', 'B', 'C']) {
  await open(); out.fonts['pc' + k] = await useFont(k);
  await shot(`big-${k}-totals.png`, await rect('.ms-totals'));
  await shot(`big-${k}-area.png`, await rect('.ms-areas .ms-area'));
}
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
touch = true;
for (const k of ['A', 'B', 'C']) {
  await open(); await press('.ms-dock .kx-mapkey', '/areas/i'); out.fonts['ph' + k] = await useFont(k);
  await shot(`big-${k}-ph.png`, await js(`(() => { const s = document.querySelector('.ms-sheet').getBoundingClientRect(), a = document.querySelector('.ms-sheet .ms-area').getBoundingClientRect(); return { x: 0, y: s.top, width: 390, height: a.bottom - s.top + 8 }; })()`));
}
fs.writeFileSync(path.join(HERE, 'fontbig.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
