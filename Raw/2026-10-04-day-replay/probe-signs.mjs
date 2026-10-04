/* one-off probe: load the wrapped page headless, evaluate argv[2], print the value. Usage: node probe-signs.mjs "<expr>" */
import { spawn } from 'node:child_process'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const page = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(path.join(HERE, 'day-replay.html'), 'utf8') + '</body></html>';
const server = http.createServer((q, s) => { const u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') { s.writeHead(200, { 'content-type': 'text/html' }); s.end(page); return; } fs.readFile(path.join(HERE, u), (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200); s.end(b); }); }).listen(4214);
const prof = path.join(HERE, 'profile4'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9424', '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9424/json/list')).json(); } catch { } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
await send('Page.navigate', { url: 'http://localhost:4214/' }); await sleep(2500);
const r = await send('Runtime.evaluate', { expression: process.argv[2], returnByValue: true, awaitPromise: true });
console.log(JSON.stringify(r.result?.result?.value ?? r.result, null, 1));
ws.close(); chrome.kill(); server.close(); await sleep(800); try { fs.rmSync(prof, { recursive: true, force: true }); } catch { } process.exit(0);
