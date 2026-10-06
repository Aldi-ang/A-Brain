/* Lays scene frames side by side into one PNG (a contact sheet) with a caption per frame.
   Usage: node board-showcase.mjs <out.png> <colWidthPx> <file:caption>...   (captions in plain words) */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const [out, colW, ...items] = process.argv.slice(2);
const cells = items.map((it) => { const i = it.indexOf(':'); return { f: it.slice(0, i), c: it.slice(i + 1) }; });
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#0A0908;color:#E8E4DE;font:600 15px/1.3 system-ui;padding:16px}
.g{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start}.c{width:${colW}px}.c img{width:100%;display:block;border:1px solid #3E3A35;border-radius:8px}.c p{margin:8px 2px 0}</style>
<div class="g">${cells.map((x) => `<div class="c"><img src="${pathToFileURL(path.join(HERE, x.f)).href}"><p>${x.c}</p></div>`).join('')}</div>`;
const page = path.join(HERE, '_board.html'); fs.writeFileSync(page, html);
const prof = path.join(HERE, 'profile-board'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9397', '--user-data-dir=' + prof, '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9397/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const W = Math.min(2800, 32 + cells.length * (+colW + 16));
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 800, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(page).href }); for (let i = 0; i < 50; i++) { await sleep(200); const d = await send('Runtime.evaluate', { expression: '[...document.images].every((m) => m.complete && m.naturalWidth)', returnByValue: true }); if (d.result.result.value) break; } await sleep(300);
const r = await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true });
const H = r.result.result.value;
const f = path.join(HERE, out); fs.rmSync(f, { force: true });
const s = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: W, height: H, scale: 1 }, captureBeyondViewport: true });
fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); console.log('board', out, W + 'x' + H);
ws.close(); chrome.kill(); fs.rmSync(page, { force: true }); process.exit(0);
