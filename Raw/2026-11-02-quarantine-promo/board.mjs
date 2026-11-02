// node board.mjs -> board.html + board.png: the four quarantine frames from shoot.mjs at 375, built in the real Stock Opname
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const f = (src, t, c) => `<div class="f"><div class="t">${t}</div><img src="${src}"><p class="c">${c}</p></div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#14161a;color:#e8e2d4;font:20px/1.35 "Segoe UI",sans-serif;width:1290px}
.wrap{padding:24px}h1{margin:0 0 4px;font-size:28px;color:#e9b949}.sub{margin:0 0 16px;color:#a8a090;font-size:18px}
.row{display:flex;gap:18px}.f{width:297px}.f img{width:297px;display:block;border:1px solid #2a2d33}.t{font-size:15px;font-weight:700;letter-spacing:.06em;color:#e9b949;margin-bottom:6px}
.c{margin:8px 0 0;font-size:16px;color:#fff}</style></head><body><div class="wrap">
<h1>Quarantine: damaged packs become promo goods; Master Vault gets REPAIR</h1>
<p class="sub">Stock Opname &rsaquo; Quarantine, the boss's screen, phone 375 px. Built in the real code; every press checked in the lab.</p>
<div class="row">
${f('q-375-actions.png', '1. MASTER VAULT CRATE', 'Four buttons now: REPAIR is new, only on the Master Vault crate.')}
${f('q-375-convert-master.png', '2. CONVERT (MASTER VAULT)', 'You pick the regional warehouse. 5 Bks become "DJARUM COKLAT 12 · RUSAK" 5 pcs in its promo goods.')}
${f('q-375-repair.png', '3. REPAIR', 'The packs go back to good stock in the Master Vault, ready to sell. Nothing written off.')}
${f('q-375-convert-region.png', '4. CONVERT (BANDUNG CRATE)', 'No picker: they become promo goods in Bandung itself. No REPAIR here.')}
</div></div></body></html>`;
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
console.log(JSON.stringify({ height: h, bytes: statSync(png).size, mtime: statSync(png).mtime }));
ws.close(); chrome.kill();
