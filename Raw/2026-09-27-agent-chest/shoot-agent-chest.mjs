// The Agent Inventory chest (kpm, 2026-09-27): the REAL screen in the lab as a regional admin (?shell&agent&admin), the
// salesman's list kept (?shell&agent), and the book's Agent Chest page (?scene=agent-chest). 1440 and 430, dark and
// light, one Lite Mode frame. Plus two REAL drags on the real screen - a mouse at 1440, a finger at 430 - each read back
// from the lab's recorded writes: the layout lands in vanLayout, nothing else is written.
// Copied from Raw/2026-09-26-ponder-loading-bay/shoot-loading-bay.mjs (fileURLToPath output path).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'shots');
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.png')) fs.unlinkSync(path.join(OUT, f));   // never leave an old frame in place
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9342',
  '--user-data-dir=' + path.join(OUT, '..', 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9342/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errors = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails?.exception?.description?.split('\n')[0] || 'exception');
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shoot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(s.result.data, 'base64')); return name; };
const probe = `JSON.stringify({ solo: !!document.querySelector('.kpm-bay.solo'), wh: !!document.querySelector('.kpm-bay .gui.wh, .kpm-bay .whc'),
  man: !!document.querySelector('.kpm-bay-duo .man'), open: !!document.querySelector('.kpm-bay.van-open'),
  filled: document.querySelectorAll('.kpm-bay .gui.van .grid .slot.has').length + '/' + document.querySelectorAll('.kpm-bay .gui.van .grid .slot').length,
  pages: [...document.querySelectorAll('.kpm-bay .gui.van .pg')].map(b => b.innerText).join('|'), q: document.querySelectorAll('.kpm-bay .gui.q .slot.has').length, ob: document.querySelector('.kpm-ob')?.className || '',
  title: document.querySelector('.kpm-bay .gui.van .title')?.innerText.replace(/\\s+/g, ' '), list: document.querySelectorAll('h4.lg\\\\:truncate').length,
  guiW: Math.round(document.querySelector('.kpm-bay .gui.van')?.getBoundingClientRect().width || 0),
  slotW: Math.round(document.querySelector('.kpm-bay .gui.van .grid .slot')?.getBoundingClientRect().width || 0),
  overflowX: document.documentElement.scrollWidth > innerWidth })`;
const toChest = `(document.querySelector('.kpm-bay .gui.van') || document.body).scrollIntoView({ block: 'start' }), 1`;
const rect = (sel) => js(`(() => { const r = document.querySelector(${JSON.stringify(sel)})?.getBoundingClientRect(); return r && { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);

await send('Page.enable'); await send('Runtime.enable');
const LAB = 'http://localhost:4190/tools/ponder-lab.html?';
const look = (l) => (l === 'light' ? '&light' : l === 'lite' ? '&lite' : '');
const runs = [];
for (const [w, h] of [[1440, 900], [430, 930]]) for (const l of ['dark', 'light']) {
  runs.push({ w, h, l, name: `screen-admin-${w}-${l}`, url: 'shell&agent&admin', chest: true });
  runs.push({ w, h, l, name: `book-open-${w}-${l}`, url: 'shell&agent&admin', book: true });
  for (const step of [7, 16, 20]) runs.push({ w, h, l, name: `book-${w}-${l}-step${step}`, url: `scene=agent-chest&step=${step}` });
}
runs.push({ w: 430, h: 930, l: 'dark', name: 'screen-salesman-430-dark', url: 'shell&agent' });
runs.push({ w: 430, h: 930, l: 'lite', name: 'book-430-lite-step7', url: 'scene=agent-chest&step=7' });
runs.push({ w: 430, h: 930, l: 'dark', name: 'book-430-dark-step23', url: 'scene=agent-chest&step=23' });
for (const r of runs) {
  await send('Emulation.setDeviceMetricsOverride', { width: r.w, height: r.h, deviceScaleFactor: 1, mobile: r.w < 768 });
  await send('Page.navigate', { url: LAB + r.url + look(r.l) });
  await sleep(3800);
  if (r.chest) { await js(toChest); await js("document.querySelector('.kpm-bay .vanc').click(), 1"); await sleep(900); }   // v4.1: the chest waits shut
  if (r.book) { await js(`document.querySelector('.kpm-nbBtn').click(), 1`); await sleep(1700); }
  await sleep(300);
  console.log(await shoot(r.name), await js(probe));
}

/* THE REAL DRAGS: the first filled square onto the first empty one on page 1 - an empty square takes the box and the old
   one goes empty. Read back from globalThis.__labWrites (the stub records every write, nothing is sent). */
async function drag(w, h, finger) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Emulation.setTouchEmulationEnabled', { enabled: finger, maxTouchPoints: finger ? 5 : 1 });
  await send('Page.navigate', { url: LAB + 'shell&agent&admin' });
  await sleep(3800); await js(toChest); await sleep(400);
  const before = await js(`[...document.querySelectorAll('.kpm-bay .gui.van .grid .slot')].map(s => s.dataset.id || '-').join(',')`);
  const a = await rect('.kpm-bay .gui.van .grid .slot.has'), b = await rect('.kpm-bay .gui.van .grid .slot:not(.has)');
  const lift = finger ? 46 : 0;             // on a finger the carried box rides 46 px above it (LoadingBay startDrag)
  const pts = Array.from({ length: 12 }, (_, i) => ({ x: a.x + (b.x - a.x) * (i + 1) / 12, y: a.y + (b.y + lift - a.y) * (i + 1) / 12 }));
  if (finger) {
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: a.x, y: a.y }] });
    for (const p of pts) { await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [p] }); await sleep(16); }
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: a.x, y: a.y, button: 'left', buttons: 1, clickCount: 1 });
    for (const p of pts) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...p, button: 'left', buttons: 1 }); await sleep(16); }
    const e = pts[pts.length - 1];
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...e, button: 'left', buttons: 0, clickCount: 1 });
  }
  await sleep(700);
  const after = await js(`[...document.querySelectorAll('.kpm-bay .gui.van .grid .slot')].map(s => s.dataset.id || '-').join(',')`);
  const writes = await js(`JSON.stringify((globalThis.__labWrites || []).map(x => ({ op: x.op, path: x.path, keys: Object.keys(x.data || {}), vanLayout: (x.data || {}).vanLayout })))`);
  const said = await js(`document.querySelector('.kpm-bay .gui.van .say')?.innerText || ''`);
  console.log(await shoot(`drag-${w}-${finger ? 'finger' : 'mouse'}`), JSON.stringify({ before, after, said, writes: JSON.parse(writes || '[]') }));
}
await drag(1440, 900, false);
await drag(430, 930, true);

/* SHUT AND OPEN AGAIN, with real clicks on the chest: the panel must still SHRINK (visible while it goes), be hidden once
   it has shrunk, and be back at once when it opens - the visibility rule added for the book's speck */
{
  await send('Emulation.setTouchEmulationEnabled', { enabled: false, maxTouchPoints: 1 });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: LAB + 'shell&agent&admin' });
  await sleep(3800); await js(`document.querySelector('.kpm-bay .vanc').scrollIntoView({ block: 'end' }), 1`); await sleep(300);
  const c = await rect('.kpm-bay .vanc .chest');
  const click = async () => { for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1 }); };
  const state = `(() => { const g = document.querySelector('.kpm-bay .gui.van'), s = getComputedStyle(g); return s.visibility + ' ' + (+s.opacity).toFixed(2) + ' ' + s.transform; })()`;
  const t = {};
  await click(); await sleep(60); t.shut60 = await js(state); await sleep(440); t.shut500 = await js(state);
  await shoot('shut-1440-dark');
  await click(); await sleep(30); t.open30 = await js(state); await sleep(570); t.open600 = await js(state);
  console.log('shut/open', JSON.stringify(t));
}
console.log('page errors:', errors.length ? errors : 'none');
ws.close(); chrome.kill();
