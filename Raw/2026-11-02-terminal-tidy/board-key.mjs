// node board-key.mjs -> board-key.html + board-key.png. The camera key (his "make the button 3D for that camera") beside
// the brass plate he hated ("that button is really bad quality change that i hate it even the fill color is bad").
// Frames from shoot.mjs: after-* = the brass plate (a79c0ca), key-* = the camera key.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#14161a;color:#e8e2d4;font:20px/1.35 "Segoe UI",sans-serif;width:1290px}
.wrap{padding:24px}h1{margin:0 0 4px;font-size:28px;color:#e9b949}.sub{margin:0 0 16px;color:#a8a090;font-size:18px}
.row{display:flex;gap:24px;align-items:flex-start}.f img{display:block;border:1px solid #2a2d33}.t{font-size:15px;font-weight:700;letter-spacing:.08em;color:#a8a090;margin-bottom:6px}
.t.a{color:#e9b949}.c{margin:8px 0 0;font-size:17px;color:#fff;max-width:600px}.close img{width:600px}</style></head><body><div class="wrap">
<h1>The camera button, 3D - built in the real terminal</h1>
<p class="sub">A black key with its side showing. Pressed, it sinks into its side and the amber line runs along it. No amber fill anywhere.</p>
<div class="row">
<div class="f"><div class="t">WHAT YOU HATED (brass plate)</div><img src="after-375-photo.png" style="width:300px"></div>
<div class="f"><div class="t a">NOW (camera key)</div><img src="key-375-photo.png" style="width:300px"></div>
<div class="f close"><div class="t a">CLOSE UP - at rest</div><img src="key-375-key.png">
<div class="t a" style="margin-top:18px">CLOSE UP - held down by the thumb</div><img src="key-375-key-press.png">
<div class="t a" style="margin-top:18px">PC (1440 px)</div><img src="key-1440-key.png"></div>
</div></div></body></html>`;
writeFileSync(DIR + 'board-key.html', html);
const png = DIR + 'board-key.png'; rmSync(png, { force: true });
const prof = DIR + 'prof-board-key'; rmSync(prof, { recursive: true, force: true });
const port = 9800 + Math.floor(Math.random() * 150);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up yet */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Page.navigate', { url: pathToFileURL(DIR + 'board-key.html').href }); await sleep(2000);
const h = (await send('Runtime.evaluate', { expression: 'document.body.scrollHeight', returnByValue: true })).result.result.value;
await send('Emulation.setDeviceMetricsOverride', { width: 1290, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(400);
const r = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(png, Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ height: h, bytes: statSync(png).size, mtime: statSync(png).mtime }));
ws.close(); chrome.kill();
