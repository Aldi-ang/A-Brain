/* 2026-10-06 - his shot: the Terminal scene's receipt faded to nothing (it looped every 7 s and faded out at the end).
   Moving mode at 1920: the receipt and the three wares are read every second for 12 s after the scene comes on screen;
   they must print / drop once and then stay fully visible. Usage: node probe-nota.mjs */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lab = path.join(HERE, 'lab-showcase.html');
const prof = path.join(HERE, 'profile-nota'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9393', '--user-data-dir=' + prof, '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9393/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(lab).href });
for (let i = 0; i < 60; i++) { await sleep(200); if (await js('document.readyState === "complete" && document.documentElement.classList.contains("moving")')) break; }
await js(`document.getElementById('terminal').scrollIntoView({ block: 'start' }); 1`);
const rows = [];
for (let s = 0; s <= 12; s++) {
  rows.push(await js(`(() => { const n = document.querySelector('.nota'), slot = document.querySelector('.slot').getBoundingClientRect(), r = n.getBoundingClientRect();
    return { s: ${s}, nota: +getComputedStyle(n).opacity, shown: Math.round(Math.max(0, Math.min(r.bottom, slot.bottom) - Math.max(r.top, slot.top)) / r.height * 100),
      wares: [...document.querySelectorAll('#terminal .bx')].map((b) => +(+getComputedStyle(b).opacity).toFixed(2)).join('/') }; })()`));
  await sleep(1000);
}
const late = rows.filter((r) => r.s >= 3);
console.log(rows.map((r) => `${r.s}s nota ${r.nota} shown ${r.shown}% wares ${r.wares}`).join('\n'));
console.log(late.every((r) => r.nota === 1 && r.shown === 100 && r.wares === '1/1/1') ? 'PASS from 3 s on the receipt and the wares stay fully visible' : 'FAIL');
ws.close(); chrome.kill(); process.exit(0);
