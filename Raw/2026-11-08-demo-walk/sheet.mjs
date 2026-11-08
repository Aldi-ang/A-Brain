// node sheet.mjs <out.png> <cols> <width> file1.png file2.png ...  -> one contact sheet with each frame's name under it
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const [out, cols, w, ...files] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const html = `<html><body style="margin:0;background:#222;font:12px sans-serif;color:#fff;display:grid;grid-template-columns:repeat(${cols},${w}px);gap:6px;padding:6px">` +
  files.map((fc) => { const [f, cap] = fc.split('|'); return `<div><img src="data:image/png;base64,${readFileSync(DIR + f).toString('base64')}" style="width:${w}px;display:block"><div style="font-size:15px;line-height:1.3;padding:4px 2px 8px">${cap || f.replace(/\.png$/, '')}</div></div>`; }).join('') + '</body></html>';
writeFileSync(DIR + '_sheet.html', html);
const port = 9850 + Math.floor(Math.random() * 100);
rmSync(DIR + 'prof-sheet', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof-sheet`, '--allow-file-access-from-files', 'about:blank']);
let list = []; for (let i = 0; i < 40 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
const W = cols * (Number(w) + 6) + 6;
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 800, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'file:///' + (DIR + '_sheet.html').replace(/\\/g, '/') }); await sleep(1500);
const h = (await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })).result.result.value;
await send('Emulation.setDeviceMetricsOverride', { width: W, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(500);
const s = await send('Page.captureScreenshot', { format: 'png' });
rmSync(DIR + out, { force: true }); writeFileSync(DIR + out, Buffer.from(s.result.data, 'base64'));
console.log(out, W + 'x' + h); chrome.kill(); process.exit(0);
