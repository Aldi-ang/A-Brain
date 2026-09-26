// His 08:55: the salesman sees his own LATE EOD. ?shell&eod&late: Budi (salesman) with Friday still waiting, its stock
// line sent back.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'eod-late-agent-shots');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9340',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9340/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shoot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(s.result.data, 'base64')); return name; };

await send('Page.enable');
for (const [w, h] of [[1440, 900], [430, 930]]) for (const light of [false, true]) {
  const tag = `${w}-${light ? 'light' : 'dark'}`;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&eod&late' + (light ? '&light' : '') });
  await sleep(3800);
  await js(`document.querySelector('[aria-label="Your late EOD"]')?.scrollIntoView({ block: 'start' }); window.scrollBy(0, -90); true`); await sleep(400);
  console.log(await shoot(`late-agent-${tag}`), await js(`(document.querySelector('[aria-label="Your late EOD"]')?.innerText || 'NO PANEL').replace(/\\s+/g, ' ')`));
}
ws.close(); chrome.kill();
