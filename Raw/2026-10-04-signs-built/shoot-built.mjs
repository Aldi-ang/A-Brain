/* 2026-10-04 19:05 - look C BUILT (his "C is the best because it is really clear"): the 8 visit signs as the app draws them
   (kpm src/utils/mapSprites.js chestHtml, the real built CSS of dist-ponderlab), each inside a real Leaflet marker on the
   Journey lab map, the chest's moment ('burst') frozen at set times with getAnimations().currentTime on held elements
   (lessons 2026-09-29), plus the rest picture and Lite. Prints per frame what each part's opacity / transform is, the
   running count, and checks the words never overlap. Writes moments-built.png + rest-built.png.
   Usage: node shoot-built.mjs */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const KPM = path.resolve(HERE, '../../../kpm-inventory-main');
const DIST = path.join(KPM, 'dist-ponderlab');
const { chestHtml, SIGNS } = await import(pathToFileURL(path.join(KPM, 'src/utils/mapSprites.js')).href);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => {
  const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); });
}).listen(4216);
const LAB = 'http://localhost:4216/tools/ponder-lab.html?shell&journey&exp&admin&visits&boss';
const prof = path.join(HERE, 'profile-b'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9426', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9426/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 200)); return r.result?.result?.value; };
const shot = async (file, sel) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true });
  const c = await js(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: b.height, scale: 1 }; })()`);
  const s = await send('Page.captureScreenshot', { format: 'png', clip: c }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); return fs.statSync(f).size; };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 3, mobile: false });
await send('Page.navigate', { url: LAB });
for (let i = 0; i < 100 && !(await js('!!document.querySelector(".leaflet-marker-pane")')); i++) await sleep(200);
await sleep(2500);
const T = [0, 560, 650, 760, 900, 1050, 1250];
const out = { errs, T };
/* a board of real markers: one row per status, one column per moment, all inside the map's own marker pane */
const cells = SIGNS.map((k) => T.map((t) => ({ k, t, html: chestHtml(k, '#a855f7', 'burst') })));
await js(`(() => { const pane = document.querySelector('.leaflet-marker-pane'); const box = document.createElement('div'); box.id = 'kx-board';
  box.style.cssText = 'position:fixed;left:20px;top:20px;z-index:99999;display:grid;grid-template-columns:110px repeat(${T.length}, 86px);gap:10px 4px;padding:14px 14px 22px;background:#474749;border-radius:12px;font:700 12px/1.2 system-ui;color:#E8E4DE';
  box.innerHTML = '<span></span>' + ${JSON.stringify(T)}.map((t) => '<span style="text-align:center">' + (t / 1000).toFixed(2) + ' s</span>').join('')
    + ${JSON.stringify(cells)}.map((row) => '<span>' + row[0].k + '</span>' + row.map((c) => '<div class="leaflet-marker-icon kx-mk" style="position:relative;width:86px;height:72px"><div style="position:absolute;left:24px;top:8px">' + c.html + '</div></div>').join('')).join('');
  pane.closest('.leaflet-container').appendChild(box); window.__board = box; return 1; })()`);
await sleep(300);
/* freeze every animation in each cell at its column's time */
out.frozen = await js(`(() => { const b = window.__board; const cols = ${JSON.stringify(T)}; let n = 0;
  b.querySelectorAll('.kx-mk').forEach((m, i) => { const t = cols[i % cols.length]; m.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = t; n++; }); });
  return { connected: b.isConnected, anims: n, running: b.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length }; })()`);
await sleep(200);
/* what each part shows at the end column (must equal the rest picture) and mid-act */
out.parts = await js(`(() => { const b = window.__board, rows = [...b.querySelectorAll('.kx-mk')], n = ${T.length}; const o = {};
  ${JSON.stringify(SIGNS)}.forEach((k, r) => { const at = (c) => { const m = rows[r * n + c]; const p = [...m.querySelectorAll('.sign5 .m, .sign5 .x, .sign5 .kpm-coin')];
    return p.map((e) => (e.classList.contains('kpm-coin') ? 'coin' : e.getAttribute('class')) + ':' + (+getComputedStyle(e).opacity).toFixed(2) + ':' + getComputedStyle(e).transform.replace(/matrix\\(|\\)/g, '').split(',').map((v) => (+v).toFixed(1)).join(' ')).join(' | '); };
    o[k] = { mid: at(3), end: at(n - 1) }; }); return o; })()`);
out.boardBytes = await shot('moments-built.png', '#kx-board');
/* the rest picture (no moment): the app's own still markup, chestHtml(k, ring) */
const REST = SIGNS.map((k) => [k, chestHtml(k, '#a855f7')]);
await js(`(() => { const b = window.__board; b.style.gridTemplateColumns = '110px 86px';
  b.innerHTML = '<span></span><span>rest</span>' + ${JSON.stringify(REST)}.map(([k, h]) => '<span>' + k + '</span><div class="leaflet-marker-icon kx-mk" style="position:relative;width:86px;height:72px"><div style="position:absolute;left:24px;top:8px">' + h + '</div></div>').join(''); return 1; })()`);
await sleep(300);
out.rest = await js(`(() => { const b = window.__board; const kx = [...b.querySelectorAll('.kx-mk')];
  return { shown: kx.length, rects: kx.map((m) => m.querySelectorAll('rect').length),
    pic: kx.map((m) => { const e = m.querySelector('.sign5 .kx-sgn, .sign5 .kpm-coin'); return e ? (e.classList.contains('kx-sgn') ? getComputedStyle(e).backgroundImage.slice(0, 24) : 'coin ' + getComputedStyle(e, '::before').transform) : null; }),
    words: kx.map((m) => m.querySelector('.kx-sw')?.textContent), running: b.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length }; })()`);
out.restBytes = await shot('rest-built.png', '#kx-board');
await js(`document.documentElement.classList.add('lite-mode'); 1`); await sleep(200);
out.lite = await js(`({ running: document.getAnimations().filter((a) => a.playState === 'running').length, coin: getComputedStyle(document.querySelector('#kx-board .kpm-coin'), '::before').transform })`);
fs.writeFileSync(path.join(HERE, 'built.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
