/* 2026-10-04 - the Day Replay prototype (his "sure do replay first i want to see it"). Serves the page from the
   scratchpad folder wrapped in the Artifact skeleton (doctype + viewport meta - lessons 2026-10-03), then: frozen frames
   of every scene at a set time (window.__replay.seek, never a sleep), the whole-day camera, the phone layout (touch
   media), Lite (0 animations running), console errors, and a brightness check over 12 s of real playback (his epilepsy
   rule: no frame may change more than a small share of the map at once).
   Usage: node shoot-replay.mjs <dir-with-index.html> */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[2];
const OUT = path.join(HERE, 'shots'); fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const page = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>'
  + fs.readFileSync(path.join(SRC, 'index.html'), 'utf8') + '</body></html>';
const TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/' || u === '/index.html') { s.writeHead(200, { 'content-type': 'text/html' }); s.end(page); return; }
  fs.readFile(path.join(SRC, u), (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(u)] || 'application/octet-stream' }); s.end(b); });
}).listen(4210);
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9420', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9420/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = []; const frames = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 300));
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errs.push('console: ' + JSON.stringify(d.params.args.map((a) => a.value ?? a.description)).slice(0, 300));
  if (d.method === 'Page.screencastFrame') { frames.push({ t: d.params.metadata.timestamp, data: d.params.data }); send('Page.screencastFrameAck', { sessionId: d.params.sessionId }); }
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300)); return r.result?.result?.value; };
const shot = async (file, clip, scale = 1) => { const f = path.join(OUT, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale } } : {}) }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const clipOf = (sel) => js(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: b.left, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
const out = { errs };
await send('Page.enable'); await send('Runtime.enable');

const load = async () => { await send('Page.navigate', { url: 'http://localhost:4210/' }); for (let i = 0; i < 60; i++) { if (await js('!!window.__replay')) break; await sleep(150); } await js('document.fonts.ready.then(() => 1)'); await sleep(500); };
const freeze = async (k, local) => { await js(`window.__replay.pause(); window.__replay.seek(window.__replay.sceneSeg(${k}).t0 + ${local}); 1`); await sleep(120); };

/* PC */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await load();
out.total = await js('window.__replay.TOTAL');
await js('window.__replay.pause(); window.__replay.seek(400); 1'); await sleep(150);
await shot('pc-page.png');
const SCENES = [[1, 'sold', 1300], [2, 'full', 950], [3, 'swap', 900], [4, 'issue', 1100], [5, 'order', 760], [6, 'request', 820], [7, 'closed', 520], [8, 'routine', 1750]];
for (const [k, kind, local] of SCENES) { await freeze(k, local); await shot(`pc-${k}-${kind}.png`, await clipOf('#box')); }
/* the end state of every scene, and the man holding what he got */
out.heldAt = {};
for (const [k, kind] of SCENES) { await freeze(k, 1900); out.heldAt[kind] = await js(`(() => { const m = document.getElementById('man'); return m.dataset.held + (m.classList.contains('up') ? ' up' : ''); })()`); }
await freeze(4, 1900); await shot('pc-after4.png', await clipOf('#box'));
/* whole-day camera mid-walk */
await js(`document.querySelector('[data-cam="whole"]').click(); 1`);
await js(`(() => { const w = window.__replay.SEGS.find((s) => s.kind === 'walk' && s.k === 5); window.__replay.seek((w.t0 + w.t1) / 2); })()`); await sleep(200);
await shot('pc-whole.png', await clipOf('#box'));
await js(`document.querySelector('[data-cam="follow"]').click(); 1`);
/* Lite: nothing running, a scene is its end picture */
await js(`document.getElementById('lite').click(); 1`); await freeze(1, 300); await sleep(200);
out.lite = await js(`({ running: document.getAnimations().filter((a) => a.playState === 'running').length, held: document.getElementById('man').dataset.held })`);
await shot('pc-lite.png', await clipOf('#box'));
await js(`document.getElementById('lite').click(); 1`);
/* the log row of the current stop is the gold one */
await freeze(3, 500); out.rowNow = await js(`document.querySelector('.row.now .s b')?.textContent`);
/* brightness: 12 s of real playback at 1x from the first scene, map only */
await js(`window.__replay.seek(window.__replay.sceneSeg(1).t0 - 300); window.__replay.play(); 1`);
const box = await js(`(() => { const b = document.getElementById('box').getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()`);
frames.length = 0; await send('Page.startScreencast', { format: 'jpeg', quality: 70, everyNthFrame: 1 }); await sleep(12000); await send('Page.stopScreencast');
const fr = frames.slice();
await send('Page.navigate', { url: 'about:blank' }); await sleep(200);
let worst = { big: 0, mean: 0 }, means = [];
for (const f of fr) {
  const v = await js(`new Promise((ok) => { const i = new Image(); i.onload = () => { const k = i.naturalWidth / 1440, c = document.createElement('canvas'); c.width = Math.round(${box.w} / 4); c.height = Math.round(${box.h} / 4);
    const g = c.getContext('2d'); g.drawImage(i, ${box.x} * k, ${box.y} * k, ${box.w} * k, ${box.h} * k, 0, 0, c.width, c.height); const d = g.getImageData(0, 0, c.width, c.height).data; let s = 0; const px = [];
    for (let j = 0; j < d.length; j += 4) { const l = .2126 * d[j] + .7152 * d[j + 1] + .0722 * d[j + 2]; s += l; px.push(l); } const last = window.__l; window.__l = px; let big = 0; if (last) px.forEach((l, j) => { if (Math.abs(l - last[j]) > 40) big++; });
    ok({ mean: s / px.length, big: big / px.length }); }; i.src = 'data:image/jpeg;base64,${f.data}'; })`);
  means.push(v.mean); if (v.big > worst.big) worst = v;
}
out.brightness = { frames: fr.length, meanMin: Math.min(...means).toFixed(1), meanMax: Math.max(...means).toFixed(1), worstFrameShare: worst.big.toFixed(3) };

/* phone */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
await load();
out.phone = await js(`({ phoneClass: document.body.classList.contains('phone'), overflow: document.documentElement.scrollWidth - innerWidth, hoverNone: matchMedia('(hover: none)').matches, logHidden: getComputedStyle(document.querySelector('.log')).display === 'none' })`);
await freeze(1, 1300); await shot('ph-1-sold.png');
await freeze(3, 900); await shot('ph-3-swap.png');
await freeze(6, 820); await shot('ph-6-request.png');

fs.writeFileSync(path.join(OUT, 'measure.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); server.close(); await sleep(1000);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
