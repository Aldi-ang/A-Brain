// node board.mjs -> board.png (the whole board page, 1272 wide). Prints mtime + every image's natural size so a missing frame shows.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof-board`,
  '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 60000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1272, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(DIR + 'board.html').href }); await sleep(3500);
const info = (await send('Runtime.evaluate', { expression: `({ h: document.documentElement.scrollHeight, font: document.fonts.check('700 13px Rajdhani'),
  imgs: [...document.images].map((i) => i.getAttribute('src') + ':' + i.naturalWidth) })`, returnByValue: true })).result.result.value;
const file = DIR + 'board.png'; rmSync(file, { force: true });
const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1272, height: info.h, scale: 1 } });
writeFileSync(file, Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ ...info, mtime: statSync(file).mtime, bytes: statSync(file).size }));
ws.close(); chrome.kill();
