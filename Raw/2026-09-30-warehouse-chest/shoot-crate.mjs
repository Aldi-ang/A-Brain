// Agent Inventory's crate box in look C, English words (2026-09-30): ?shell&agent&admin, the crate pressed for real,
// the box read back at 1440 and 430, dark and light.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = 'http://localhost:4190/tools/ponder-lab.html?shell&agent&admin';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9344',
  '--user-data-dir=' + path.join(HERE, 'profile-c'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9344/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 });

await send('Page.enable');
const out = [];
for (const [w, h] of [[1440, 900], [430, 932]]) for (const light of [false, true]) {
  const tag = `${w}-${light ? 'light' : 'dark'}`;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(3500);
  await js(`document.documentElement.classList.toggle('light', ${light}); document.querySelector('.kpm-bay .qc').scrollIntoView({ block: 'end' }); window.scrollBy(0, 120); true`);
  await sleep(500);
  const p = await js(`(() => { const r = document.querySelector('.kpm-bay .qc .chest').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
  await mouse('mousePressed', ...p); await sleep(60); await mouse('mouseReleased', ...p);
  await sleep(1200);
  const info = await js(`JSON.stringify({ iw: innerWidth, cls: document.querySelector('.kpm-bay').className, title: document.querySelector('.kpm-bay .gui.q .title').textContent, band: !!document.querySelector('.kpm-bay .gui.q .kpm-qband.tape'), cap: document.querySelector('.kpm-bay .qc .cap').textContent, aria: document.querySelector('.kpm-bay .qc').getAttribute('aria-label'), gui: (r => [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)])(document.querySelector('.kpm-bay .gui.q').getBoundingClientRect()), titleH: Math.round(document.querySelector('.kpm-bay .gui.q .title').getBoundingClientRect().height * 10) / 10 })`);
  const g = JSON.parse(info).gui, bay = await js(`(() => { const r = document.querySelector('.kpm-bay').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; })()`);
  const top = Math.max(0, Math.min(g[1], bay[0]) - 8), clip = { x: 0, y: top, width: w, height: Math.min(h - top, Math.max(g[1] + g[3], bay[1]) - top + 8) };
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 } });
  const file = path.join(OUT, `${tag}-agent-crate-C.png`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  out.push([tag, path.basename(file), info]);
}
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
