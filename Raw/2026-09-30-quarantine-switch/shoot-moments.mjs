// True mid-flight moments of the quarantine switch: each frame comes from a FRESH press, frozen at t ms (every animation
// paused) before the capture - freezing a second moment in the same press is late, because the switch's timers keep
// running while its animations are paused.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = 'http://localhost:4190/tools/ponder-lab.html?shell&fleet';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9338',
  '--user-data-dir=' + path.join(HERE, 'profile-m'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9338/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 });
const click = async (x, y) => { await mouse('mousePressed', x, y); await sleep(60); await mouse('mouseReleased', x, y); };
const C = (sel) => `(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`;
const shoot = async (name, clip) => {
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 } });
  const file = path.join(OUT, name + '.png');
  if (fs.existsSync(file)) fs.unlinkSync(file);
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  return path.basename(file);
};

await send('Page.enable');
const out = [];
for (const [w, h] of [[1440, 900], [430, 932]]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(3500);
  await js(`[...document.querySelectorAll('.kpm-actor')].find(a => a.querySelector('.kpm-actor-name')?.textContent.trim() === 'Budi Santoso')?.click(); true`);
  await sleep(1500);
  await js(`document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); true`); await sleep(400);
  const clip = await js(`(() => { const r = document.querySelector('.kpm-bay .gui.wh').getBoundingClientRect(); return { x: r.left - 4, y: r.top - 4, width: r.width + 8, height: r.height + 8 }; })()`);
  for (const [dir, t] of [['in', 380], ['in', 560], ['in', 1080], ['in', 1250], ['back', 380], ['back', 1080]]) {
    if (dir === 'back') { await click(...await js(C('.kpm-hatch'))); await sleep(2200); }   // put the Quarantine on show first
    await click(...await js(C('.kpm-hatch')));
    await sleep(t);
    await js(`document.getAnimations().forEach(a => a.pause()); true`);
    out.push([w, dir, t, await shoot(`${w}-m-${dir}-${t}`, clip), await js(`JSON.stringify({ lift: getComputedStyle(document.querySelector('.kpm-hatch .lift')).transform, d2: getComputedStyle(document.querySelector('.kpm-hatch .d2')).transform, box: getComputedStyle(document.querySelector('.kpm-doors .dr')).transform, kind: document.querySelector('.kpm-doors').dataset.kind, skin: document.querySelector('.kpm-hatch').dataset.skin })`)]);
    await js(`document.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); }); true`);
    await sleep(2200);
    if (dir === 'in') { await click(...await js(C('.kpm-hatch'))); await sleep(2200); }   // back to healthy for the next moment
  }
}
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
