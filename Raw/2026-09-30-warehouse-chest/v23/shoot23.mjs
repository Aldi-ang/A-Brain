// v23 frames: the regional warehouse box + 3D ender chest, each blast-door look frozen SHUT (fresh press each), box A,
// Stock Opname B in box A, and the enchanting book's gap to the table.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots23');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = pathToFileURL(path.join(HERE, 'index.html')).href;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9346',
  '--user-data-dir=' + path.join(HERE, 'profile23'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9346/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(), errors = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push('EVAL ' + JSON.stringify(r.result.exceptionDetails).slice(0, 200)); return r.result?.result?.value; };
const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 });
const where = (sel) => js(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
const click = async (sel) => { const p = await where(sel); if (!p) return 'NO ' + sel; await mouse('mousePressed', ...p); await sleep(50); await mouse('mouseReleased', ...p); return 'ok'; };
const shoot = async (name, sel) => {
  const c = await js(`(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: Math.max(0, r.left - 6), y: r.top + scrollY - 6, width: r.width + 12, height: r.height + 12 }; })()`);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...c, scale: 1 }, captureBeyondViewport: true });
  const file = path.join(OUT, name + '.png'); if (fs.existsSync(file)) fs.unlinkSync(file);
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64')); return name;
};
const toTop = (sel) => js(`document.querySelector(${JSON.stringify(sel)}).scrollIntoView({ block: 'start' }); true`);

await send('Page.enable'); await send('Runtime.enable');
const out = [];
for (const [w, h, tag] of [[1100, 900, 'pc'], [430, 932, 'phone']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(1500);
  if (tag === 'phone') { await js(`document.querySelector('[data-rw-w="hp"]').click(); document.querySelector('[data-so-w="hp"]').click(); true`); await sleep(300); }
  await toTop('#rw .frame'); await sleep(300);
  out.push([tag, 'rw rest', await shoot(`${tag}-rw-rest`, '#rw .frame'), await js(`Math.round(document.getElementById('rwD').getBoundingClientRect().height)`)]);
  const doors = tag === 'pc' ? ['today', 'd1', 'd2', 'd3'] : ['d1'];
  for (const d of doors) {
    await js(`document.querySelector('[data-door="${d}"]').click(); true`); await sleep(200);
    await toTop('#rw .frame'); await sleep(200);
    await click('#rwD .kpm-hatch');
    await js(`new Promise(res => { const t0 = performance.now(); (function f() { const m = getComputedStyle(document.querySelector('#rwD .kpm-doors .dr')).transform; if ((m === 'matrix(1, 0, 0, 1, 0, 0)' && performance.now() - t0 > 250) || performance.now() - t0 > 1500) { document.getAnimations().forEach(a => a.pause()); res(m); } else requestAnimationFrame(f); })(); })`);
    out.push([tag, 'door ' + d + ' shut', await shoot(`${tag}-door-${d}`, '#rw .frame'), await js(`JSON.stringify({ look: document.querySelector('#rwD .kpm-doors').dataset.look, dr: getComputedStyle(document.querySelector('#rwD .kpm-doors .dr')).transform })`)]);
    await js(`document.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); }); true`);
    await sleep(1900);
    if (d === 'd1') out.push([tag, 'rw q (box A)', await shoot(`${tag}-rw-q-boxA`, '#rw .frame'), await js(`Math.round(document.getElementById('rwD').getBoundingClientRect().height)`)]);
    await click('#rwD .kpm-hatch'); await sleep(1900);
  }
  await click('#rwChest'); await sleep(500);
  out.push([tag, 'chest shut', await shoot(`${tag}-rw-chest-shut`, '#rw .frame'), await js(`Math.round(document.getElementById('rwD').getBoundingClientRect().height)`), await js(`document.getElementById('rwM').textContent`)]);
  await toTop('#so .frame'); await sleep(200);
  await click('#soV .chestCell[data-fac="BANDUNG"]'); await sleep(500);
  await click('#soV .sbx .slot.has'); await sleep(300);
  out.push([tag, 'so B box A', await shoot(`${tag}-so-B-boxA`, '#so .frame')]);
  /* the enchanting book: its lowest point against the table top */
  await toTop('#frame'); await sleep(400);
  out.push([tag, 'book gap', await js(`(() => { const b = document.querySelector('.ebook').getBoundingClientRect(), t = document.querySelector('.tcube .tp').getBoundingClientRect(); return JSON.stringify({ bookBottom: Math.round(b.bottom), tableTop: Math.round(t.top), gap: Math.round(t.top - b.bottom) }); })()`)]);
  out.push([tag, 'room', await shoot(`${tag}-room`, '#room')]);
}
out.push(['errors', errors.length ? errors.join(' || ') : 'none']);
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
