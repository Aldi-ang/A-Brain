/* 2026-10-06 probe: on the phone, the first tap on Play right after a timeline drag is lost. Logs every pointer / touch /
   click event that reaches the page through the drag and the next two taps. Usage: node probe-tap.mjs */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lab = path.join(HERE, 'lab-showcase.html');
const prof = path.join(HERE, 'profile-probe'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9395', '--user-data-dir=' + prof, '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9395/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Page.navigate', { url: pathToFileURL(lab).href });
for (let i = 0; i < 60; i++) { await sleep(200); if (await js('typeof drT === "number"')) break; }
await js(`document.getElementById('ulang').scrollIntoView({ block: 'start' }); scrollBy(0, 380);
  window.__log = []; const nm = (e) => e.target?.id || e.target?.className?.baseVal || e.target?.className || e.target?.tagName;
  for (const t of ['pointerdown', 'pointerup', 'pointercancel', 'touchstart', 'touchend', 'touchcancel', 'click', 'gotpointercapture', 'lostpointercapture'])
    document.addEventListener(t, (e) => __log.push(t + ':' + String(nm(e)).slice(0, 14) + ':' + drPlaying), true); 1`);
await sleep(1500);
const tl = await js(`(() => { const b = document.getElementById('drTl').getBoundingClientRect(); return { x0: b.left + b.width * 0.15, x1: b.left + b.width * 0.47, y: b.top + 6 }; })()`);
const pb = await js(`(() => { const b = document.getElementById('drPlay').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: tl.x0, y: tl.y }] });
await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: tl.x1, y: tl.y }] });
await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await js(`__log.push('--- drag done, playing ' + drPlaying); 1`);
for (const gap of [150, 700]) {
  await sleep(gap);
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pb] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(450);
  await js(`__log.push('--- tap after ${gap} ms, playing ' + drPlaying); 1`);
}
console.log((await js('__log')).join('\n'));
ws.close(); chrome.kill(); process.exit(0);
