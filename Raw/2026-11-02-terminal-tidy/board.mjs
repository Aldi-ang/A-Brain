// node board.mjs -> board.html + board.png. TODAY vs AFTER of the three asks, from shoot.mjs frames (375 phone + 1440 PC).
// Every number in a caption is computed here from what shoot.mjs measured, never typed by hand.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const lum = ([r, g, b]) => [r, g, b].map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return ((x + 0.05) / (y + 0.05)).toFixed(1); };
const before = ratio([151, 131, 92], [232, 220, 192]);   /* today-375: ink on the paper (the button was transparent) */
const after = ratio([43, 35, 24], [201, 162, 39]);       /* after-375: ink on the brass plate */
const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#14161a;color:#e8e2d4;font:20px/1.35 "Segoe UI",sans-serif;width:1290px}
.wrap{padding:24px}h1{margin:0 0 4px;font-size:28px;color:#e9b949}.sub{margin:0 0 16px;color:#a8a090;font-size:18px}
.row{display:flex;gap:24px}.f{width:398px}.f img{width:398px;display:block;border:1px solid #2a2d33}.c{margin:8px 0 0;font-size:17px;color:#fff}
.t{font-size:15px;font-weight:700;letter-spacing:.08em;color:#a8a090;margin-bottom:6px}.t.a{color:#e9b949}ul{margin:6px 0 0;padding-left:20px;font-size:17px}
.pc{margin-top:22px}.pc img{width:1242px;display:block;border:1px solid #2a2d33}</style></head><body><div class="wrap">
<h1>Sales Terminal, phone: your 3 changes - TODAY vs AFTER (built in the real code)</h1>
<p class="sub">Same shop list, same promo goods (6 T-shirts, 2 hats), Indonesian, 375 px wide.</p>
<div class="row">
<div class="f"><div class="t">TODAY</div><img src="today-375-top.png"><ul><li>2 customer boxes</li><li>promo list always open: ${145} px with 2 goods</li><li>photo button: dashed, words ${before}:1 contrast (readable needs 4.5:1)</li></ul></div>
<div class="f"><div class="t a">AFTER - promo shut (default)</div><img src="after-375-top.png"><ul><li>top box gone; ✕ now sits beside Nama Pelanggan</li><li>promo shut: ${62} px</li><li>photo button: brass plate, words ${after}:1</li></ul></div>
<div class="f"><div class="t a">AFTER - promo tapped open</div><img src="after-375-promo-open.png"><ul><li>tap PROMO · GRATIS to open or shut</li><li>once pieces are given, the shut header shows "3 pcs"</li><li>every new deal starts shut again</li></ul></div>
</div>
<div class="pc"><div class="t a">AFTER - PC, 1440 px (same three changes; the photo button fits one line)</div><img src="after-1440-photo.png"></div>
</div></body></html>`;
writeFileSync(DIR + 'board.html', html);
const png = DIR + 'board.png'; rmSync(png, { force: true });
const prof = DIR + 'prof-board'; rmSync(prof, { recursive: true, force: true });
const port = 9800 + Math.floor(Math.random() * 150);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up yet */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Page.navigate', { url: pathToFileURL(DIR + 'board.html').href }); await sleep(2000);
const h = (await send('Runtime.evaluate', { expression: 'document.body.scrollHeight', returnByValue: true })).result.result.value;
await send('Emulation.setDeviceMetricsOverride', { width: 1290, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(400);
const r = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(png, Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ before, after, height: h, bytes: statSync(png).size, mtime: statSync(png).mtime }));
ws.close(); chrome.kill();
