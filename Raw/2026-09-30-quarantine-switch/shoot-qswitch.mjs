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

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9336',
  '--user-data-dir=' + path.join(HERE, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9336/json/list')).json(); } catch { /* not up yet */ } }
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
const results = [];
for (const [w, h] of [[1440, 900], [430, 932]]) {
  const tag = String(w);
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(3500);
  await js(`[...document.querySelectorAll('.kpm-actor')].find(a => a.querySelector('.kpm-actor-name')?.textContent.trim() === 'Budi Santoso')?.click(); true`);
  await sleep(1500);
  await js(`document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); true`);
  await sleep(500);
  results.push([tag, 'rest', await shoot(`${tag}-1-rest-dark`, await bayClip()), await state()]);
  await js(`document.documentElement.classList.add('light'); true`); await sleep(400);
  results.push([tag, 'rest-light', await shoot(`${tag}-1-rest-light`, await bayClip())]);
  await js(`document.documentElement.classList.remove('light'); true`); await sleep(400);

  /* INTO the Quarantine: a real press on the hatch, frames frozen mid-flight */
  const hatch = await js(C('.kpm-hatch'));
  await click(...hatch);
  await freezeAt(200);
  results.push([tag, 'in@200 dome down, box doors closing', await shoot(`${tag}-2-in-200`, await bayClip()), await js(`document.querySelector('.kpm-doors').dataset.kind`)]);
  await thaw(); await freezeAt(260);
  results.push([tag, 'in@~500 both shut', await shoot(`${tag}-3-in-500`, await bayClip()), await state()]);
  await thaw(); await freezeAt(450);
  results.push([tag, 'in@~1000 doors open, platform rising', await shoot(`${tag}-4-in-1000`, await bayClip())]);
  await thaw(); await sleep(1200);
  results.push([tag, 'quarantine rest', await shoot(`${tag}-5-q-rest`, await bayClip()), await state()]);

  /* the eye lives: sample the pupil and the lid for 6 s */
  const eye = [];
  for (let i = 0; i < 24; i++) { eye.push(await js(`(() => { const e = document.querySelector('.kpm-hatch .ico.eye'); return e ? (e.classList.contains('blink') ? 'BLINK' : e.firstChild.style.transform || 'centre') : 'no eye'; })()`)); await sleep(250); }
  results.push([tag, 'eye 6 s', [...new Set(eye)].length + ' distinct', eye.join(' | ')]);

  /* a tap on a Quarantine square tells */
  await js(`document.querySelector('.kpm-bay .gui.wh .grid .slot.has').click(); true`); await sleep(200);
  results.push([tag, 'q tap', await js(`document.querySelector('.kpm-bay .gui.wh .say').textContent`)]);

  /* a RETURN with the Quarantine showing lands in the healthy stock: drag a van box onto the ender chest */
  const vs = await js(`(() => { const s = document.querySelector('.kpm-bay .gui.van .grid .slot.has'); if (!s) return null; s.scrollIntoView({ block: 'center' }); const r = s.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
  if (vs) {
    await sleep(300);
    const vs2 = await js(C('.kpm-bay .gui.van .grid .slot.has')), ender = await js(C('.kpm-bay .whc .chest'));
    await drag(vs2, ender);
    await sleep(1600);
    results.push([tag, 'return drop', await js(`JSON.stringify({ title: document.querySelector('.kpm-bay .gui.wh .title').textContent, sheet: document.querySelector('.kpm-bay-sheet .lbl')?.textContent })`)]);
    await js(`[...document.querySelectorAll('.kpm-bay-sheet .shKeys .key')].find(b => /Batal/.test(b.textContent))?.click(); true`);
    await sleep(500);
  } else results.push([tag, 'return drop', 'NO VAN BOX']);

  /* a real drag warehouse -> van still loads, and MUAT VAN writes */
  await js(`document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); true`); await sleep(400);
  const a = await js(C('.kpm-bay .gui.wh .grid .slot.has:not(.out)')), b = await js(C('.kpm-bay .vanc .chest'));
  await drag(a, b); await sleep(700);
  await send('Input.insertText', { text: '2' });
  await sleep(150);
  await js(`document.querySelector('.kpm-bay-sheet .ok')?.click(); true`); await sleep(1300);
  await js(`document.querySelector('.kpm-bay-duo .go')?.click(); true`); await sleep(1500);
  results.push([tag, 'load', await js(`JSON.stringify({ report: document.querySelector('.kpm-bay-duo .report')?.textContent, writes: (globalThis.__labWrites || []).length })`)]);

  /* the crate: open it - the van box shuts, the crate's box takes its place */
  await js(`document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); true`); await sleep(300);
  await click(...await js(C('.kpm-bay .qc .chest')));
  await sleep(900);
  results.push([tag, 'crate open', await shoot(`${tag}-6-crate-open`, await bayClip()), await js(`JSON.stringify({ cls: document.querySelector('.kpm-bay').className, q: document.querySelector('.kpm-bay .gui.q').textContent.slice(0, 80), slip: !!document.querySelector('.kpm-bay .slip.van'), bayH: Math.round(document.querySelector('.kpm-bay').getBoundingClientRect().height) })`)]);
  await click(...await js(C('.kpm-bay .vanc .chest')));
  await sleep(900);
  results.push([tag, 'van again', await js(`JSON.stringify({ cls: document.querySelector('.kpm-bay').className, bayH: Math.round(document.querySelector('.kpm-bay').getBoundingClientRect().height) })`)]);

  /* back to the healthy stock with a press, then Lite Mode: the switch swaps at once, nothing moves */
  await click(...await js(C('.kpm-hatch'))); await sleep(1700);
  results.push([tag, 'back', await state()]);
  await js(`document.documentElement.classList.add('lite-mode'); true`);
  await click(...await js(C('.kpm-hatch'))); await sleep(40);
  results.push([tag, 'lite press +40ms', await state()]);
  await js(`document.documentElement.classList.remove('lite-mode'); true`);
}
console.log(JSON.stringify(results, null, 1));
ws.close(); chrome.kill();
