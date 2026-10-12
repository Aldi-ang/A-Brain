/* shoots board.html (next to this file) to board.png, full page; the Chrome profile lives in the OS temp folder, never
   in the vault. Also reports each frame's scroll size, so a row that spills out of its frame is caught. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(os.tmpdir(), 'kpm-active-tabs-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9423', '--user-data-dir=' + prof, '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9423/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1534, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(path.join(HERE, 'board.html')).href }); await sleep(2500);
const fit = await send('Runtime.evaluate', { returnByValue: true, expression: `[...document.querySelectorAll('iframe')].map(f => { const d = f.contentDocument.documentElement; return f.width + ':' + d.scrollWidth + 'x' + d.scrollHeight + '/' + f.height + (getComputedStyle(f.contentDocument.body).backgroundColor) }).join(' ')` });
console.log('frames', fit.result.result.value);
const h = (await send('Runtime.evaluate', { returnByValue: true, expression: 'document.documentElement.scrollHeight' })).result.result.value;
await send('Emulation.setDeviceMetricsOverride', { width: 1534, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(600);
const s = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync(path.join(HERE, 'board.png'), Buffer.from(s.result.data, 'base64'));
console.log('board.png', h);
chrome.kill(); await sleep(400); fs.rmSync(prof, { recursive: true, force: true }); process.exit(0);
