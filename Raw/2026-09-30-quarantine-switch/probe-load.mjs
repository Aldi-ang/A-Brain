// Fleet & Roster quarantine switch (v21 build, 2026-09-30): frames + a walk over the lab `?shell&fleet`.
// Chrome DevTools protocol, same harness as Raw/2026-09-24-round4-chests-stage/shoot-round4.mjs.
// Mid-flight frames are FROZEN (every animation paused) before the capture - a sleep alone is not a moment.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = 'http://localhost:4190/tools/ponder-lab.html?shell&fleet';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9337',
  '--user-data-dir=' + path.join(HERE, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9337/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) console.log('JS ERROR', JSON.stringify(r.result.exceptionDetails).slice(0, 400)); return r.result?.result?.value; };
const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 });
const click = async (x, y) => { await mouse('mousePressed', x, y); await sleep(60); await mouse('mouseReleased', x, y); };
const drag = async (a, b) => { await mouse('mousePressed', ...a); for (let i = 1; i <= 14; i++) await mouse('mouseMoved', a[0] + (b[0] - a[0]) * i / 14, a[1] + (b[1] - a[1]) * i / 14); await mouse('mouseReleased', ...b); };
const shoot = async (name, clip) => {
  const shot = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) });
  const file = path.join(OUT, name + '.png');
  if (fs.existsSync(file)) fs.unlinkSync(file);
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  return path.basename(file);
};
const C = (sel) => `(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`;
const bayClip = async () => js(`(() => { const r = document.querySelector('.kpm-bay').getBoundingClientRect(); return { x: Math.max(0, r.left - 6), y: Math.max(0, r.top - 6), width: r.width + 12, height: r.height + 12 }; })()`);
const state = () => js(`JSON.stringify({ iw: innerWidth, cls: document.querySelector('.kpm-bay').className, title: document.querySelector('.kpm-bay .gui.wh .title').textContent,
  say: document.querySelector('.kpm-bay .gui.wh .say')?.textContent, skin: document.querySelector('.kpm-hatch').dataset.skin, lbl: document.querySelector('.kpm-hatch .lbl').textContent,
  aria: document.querySelector('.kpm-hatch').getAttribute('aria-label'), wh: (r => [Math.round(r.width), Math.round(r.height)])(document.querySelector('.kpm-bay .gui.wh').getBoundingClientRect()),
  squares: [...document.querySelectorAll('.kpm-bay .gui.wh .grid .slot.has')].map(s => s.textContent), anims: document.getAnimations().filter(a => a.playState === 'running').length })`);
const freezeAt = async (ms) => { await sleep(ms); await js(`document.getAnimations().forEach(a => a.pause()); true`); };
const thaw = () => js(`document.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); }); true`);

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: URL_ });
await sleep(3500);
await js(`[...document.querySelectorAll('.kpm-actor')].find(a => a.querySelector('.kpm-actor-name')?.textContent.trim() === 'Budi Santoso')?.click(); true`);
await sleep(1500);
await js(`document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); true`); await sleep(400);
const a = await js(C('.kpm-bay .gui.wh .grid .slot.has:not(.out)')), b = await js(C('.kpm-bay .vanc .chest'));
await drag(a, b); await sleep(700);
await send('Input.insertText', { text: '2' });
await sleep(150);
await js(`document.querySelector('.kpm-bay-sheet .ok')?.click(); true`); await sleep(1300);
await js(`document.querySelector('.kpm-bay-duo .go')?.click(); true`); await sleep(1800);
console.log(await js(`JSON.stringify({ report: document.querySelector('.kpm-bay-duo .report')?.textContent, why: [...document.querySelectorAll('.kpm-bay-duo .lines li')].map(l => l.textContent), writes: (globalThis.__labWrites || []).length })`));
ws.close(); chrome.kill();
