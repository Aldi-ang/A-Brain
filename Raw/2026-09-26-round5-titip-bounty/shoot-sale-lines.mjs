// His 07:50: the agent's sale row opens to its lines. ?shell&agent, tap the Warung Bu Sri row, PC and phone.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sale-lines-shots');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9337',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9337/json/list')).json(); } catch { /* not up yet */ } }
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
  await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&agent' + (light ? '&light' : '') });
  await sleep(3500);
  const r = await js(`(async () => { const b = [...document.querySelectorAll('button[aria-expanded]')].find(x => /Warung Bu Sri/i.test(x.textContent));
    if (!b) return 'no row'; b.scrollIntoView({ block: 'center' }); b.click(); await new Promise(r => setTimeout(r, 400));
    const ul = b.nextElementSibling; return JSON.stringify({ expanded: b.getAttribute('aria-expanded'), lines: ul ? [...ul.querySelectorAll('li')].map(l => l.innerText.replace(/\\s+/g, ' ')) : null,
      spill: document.documentElement.scrollWidth > innerWidth }); })()`);
  console.log(await shoot(`sale-open-${tag}`), r);
}
ws.close(); chrome.kill();
