// The Loading Bay ponder page (kpm fcaad9c), frozen on two beats: 7 = the muatan fills (the plan), 30 = the Titip tab
// behind the shut van chest. 1440 and 430, dark and light, plus one Lite Mode frame on the phone.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9341',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9341/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shoot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(s.result.data, 'base64')); return name; };
const probe = `JSON.stringify({ bay: !!document.querySelector('.kpm-bay'), keys: [...document.querySelectorAll('.kpm-bay-wrap [data-ponder]')].map(e => e.dataset.ponder).join(','),
  overflowX: document.documentElement.scrollWidth > innerWidth, slip: document.querySelector('.kpm-bay .slip.van .tab.on')?.innerText || '-',
  lines: document.querySelectorAll('.kpm-bay-wrap .man .lines li').length })`;

await send('Page.enable');
const runs = [];
for (const [w, h] of [[1440, 900], [430, 930]]) for (const look of ['dark', 'light']) for (const step of [7, 30]) runs.push({ w, h, look, step });
runs.push({ w: 430, h: 930, look: 'lite', step: 30 });
if (process.argv[2] === 'fix') { runs.length = 0; for (const look of ['dark', 'light']) runs.push({ w: 1440, h: 900, look, step: 7 }, { w: 1440, h: 900, look, step: 12 }); }
for (const { w, h, look, step } of runs) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: `http://localhost:4190/tools/ponder-lab.html?scene=loading-bay&step=${step}` + (look === 'light' ? '&light' : look === 'lite' ? '&lite' : '') });
  await sleep(3800);
  console.log(await shoot(`bay-${w}-${look}-step${step}`), await js(probe));
}
ws.close(); chrome.kill();
