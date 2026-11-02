// node board-look.mjs -> board-look.html + board-look.png: a damaged pack turned promo, drawn as its own 3D pack with the
// biohazard mark (shoot-look.mjs frames, real components in the lab)
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#14161a;color:#e8e2d4;font:20px/1.35 "Segoe UI",sans-serif;width:1290px}
.wrap{padding:24px}h1{margin:0 0 4px;font-size:28px;color:#e9b949}.sub{margin:0 0 16px;color:#a8a090;font-size:18px}
.row{display:flex;gap:18px;align-items:flex-start}.t{font-size:15px;font-weight:700;letter-spacing:.06em;color:#e9b949;margin-bottom:6px}
img{display:block;border:1px solid #2a2d33}.c{margin:8px 0 0;font-size:16px;color:#fff}</style></head><body><div class="wrap">
<h1>"CELLO GREEN 16 · RUSAK": the same 3D pack, with the biohazard mark</h1>
<p class="sub">Real components in the lab. The lab Cello has drawn faces; in the app it is your own pack photos.</p>
<div class="t">MASTER VAULT, PC - the 3D pack (mark bottom-right) and the list icon (mark on the corner)</div>
<img src="look-1440-vault.png" style="width:1242px">
<div class="row" style="margin-top:18px">
<div><div class="t">MASTER VAULT, PHONE</div><img src="look-375-vault.png" style="width:300px"></div>
<div><div class="t">SALES TERMINAL, PROMO · GRATIS</div><img src="look-375-terminal.png" style="width:300px"><p class="c" style="width:300px">The salesman sees the pack with the mark, so they know it is a damaged pack being given away.</p></div>
</div></div></body></html>`;
writeFileSync(DIR + 'board-look.html', html);
const png = DIR + 'board-look.png'; rmSync(png, { force: true });
const prof = DIR + 'prof-board-look'; rmSync(prof, { recursive: true, force: true });
const port = 9800 + Math.floor(Math.random() * 150);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up yet */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Page.navigate', { url: pathToFileURL(DIR + 'board-look.html').href }); await sleep(2000);
const h = (await send('Runtime.evaluate', { expression: 'document.body.scrollHeight', returnByValue: true })).result.result.value;
await send('Emulation.setDeviceMetricsOverride', { width: 1290, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(400);
const r = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(png, Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ height: h, bytes: statSync(png).size, mtime: statSync(png).mtime }));
ws.close(); chrome.kill();
