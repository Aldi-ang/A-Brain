// His 08:35: the boss's EOD list - one card per night, a LATE EOD panel, the bounty payback its own plate, no false
// "short count". ?shell&eod&admin: Budi has tonight (cash & stock, stamps, a Rp 39.000 bounty payment) and last night
// still waiting with its stock line sent back.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'eod-nights-shots');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9339',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9339/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shoot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(s.result.data, 'base64')); return name; };
const probe = `JSON.stringify([...document.querySelectorAll('.pc')].map(c => ({
  late: !!c.closest('[aria-label="Late EOD"]'),
  head: c.querySelector('.pc-head p')?.textContent,
  closed: [...c.querySelectorAll('.pc-head p')].map(p => p.textContent).find(t => /Closed/.test(t)),
  diode: c.querySelector('.pc-head .kpm-led-line')?.textContent,
  revenue: [...c.querySelectorAll('.pc-body span')].find(s => /Revenue/.test(s.textContent))?.parentElement?.innerText.replace(/\\s+/g, ' '),
  lines: [...c.querySelectorAll('.pc-line')].filter(l => !l.closest('[aria-label="Bounty payback"]')).map(l => l.querySelector('.kpm-led-line')?.textContent),
  payback: c.querySelector('[aria-label="Bounty payback"]')?.innerText.replace(/\\s+/g, ' ') || null })))`;

await send('Page.enable');
for (const [w, h] of [[1440, 1000], [430, 930]]) for (const light of [false, true]) {
  const tag = `${w}-${light ? 'light' : 'dark'}`;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&eod&admin' + (light ? '&light' : '') });
  await sleep(3800);
  await js(`[...document.querySelectorAll('.pc-head')].forEach(h => h.click()); true`);
  await sleep(900);
  await js(`document.querySelector('.pc')?.scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); true`); await sleep(300);
  console.log(await shoot(`1-tonight-${tag}`), await js(probe));
  await js(`document.querySelector('[aria-label="Late EOD"]')?.scrollIntoView({ block: 'start' }); window.scrollBy(0, -20); true`); await sleep(300);
  console.log(await shoot(`2-late-${tag}`));
}
ws.close(); chrome.kill();
