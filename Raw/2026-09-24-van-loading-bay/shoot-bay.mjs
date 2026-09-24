// Shoots the van-loading bay in the lab through Chrome's DevTools protocol (no puppeteer here).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), 'bay-shots');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = 'http://localhost:4190/tools/ponder-lab.html?shell&fleet';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9333',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9333/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 });

for (const [w, h] of [[2000, 1000], [518, 1000]]) for (const light of [false, true]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(3500);
  await js(`document.documentElement.classList.toggle('light', ${light}); [...document.querySelectorAll('h1,h2,h3,h4,p,span')].find(e => e.textContent.trim() === 'Budi Santoso')?.click(); true`);
  await sleep(2600);
  const pts = await js(`(async () => { document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); await new Promise(r => setTimeout(r, 300));
    const c = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    return { a: c(document.querySelector('.kpm-bay .gui.wh .slot.has')), b: c(document.querySelector('.kpm-bay .vanc .chest')) }; })()`);
  await mouse('mousePressed', ...pts.a);
  for (let i = 1; i <= 12; i++) await mouse('mouseMoved', pts.a[0] + (pts.b[0] - pts.a[0]) * i / 12, pts.a[1] + (pts.b[1] - pts.a[1]) * i / 12);
  await mouse('mouseReleased', ...pts.b);
  await sleep(700);
  await send('Input.insertText', { text: '3' });
  await js(`[...document.querySelectorAll('.kpm-bay-sheet .units .key')].find(b => b.textContent.startsWith('Slop'))?.click(); true`);
  await sleep(200);
  await js(`document.querySelector('.kpm-bay-sheet .ok')?.click(); true`);
  await sleep(1800);
  await js(`document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); window.scrollBy(0, -60); true`);
  await sleep(400);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const file = path.join(OUT, `bay-${w}-${light ? 'light' : 'dark'}.png`);
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  console.log(file, await js(`document.querySelectorAll('.kpm-bay .lines li').length + ' line(s), ' + document.querySelectorAll('.kpm-bay .slot.has').length + ' boxes'`));
}
ws.close(); chrome.kill();
