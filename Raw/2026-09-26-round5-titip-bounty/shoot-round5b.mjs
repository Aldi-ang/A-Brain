// His 07:50 test of round 5: the bay keeps its height on the PC, the muatan is its own card, the phone shows four in a
// row and takes tap-then-tap, the gold bar stacks, the roster snaps one person per swipe. Same harness as shoot-round5.mjs.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'round5b-shots');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = 'http://localhost:4190/tools/ponder-lab.html?shell&fleet';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9336',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9336/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const tap = async (x, y) => { for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1 }); };
const shoot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'png' }); const f = path.join(OUT, name + '.png'); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); return name; };
const H = `Math.round(document.querySelector('.kpm-bay').getBoundingClientRect().height)`;
const frame = (sel, up = 60) => js(`document.querySelector('${sel}').scrollIntoView({ block: 'start' }); window.scrollBy(0, -${up}); true`);

await send('Page.enable');
for (const [w, h] of [[1440, 900], [430, 930]]) for (const light of [false, true]) {
  const tag = `${w}-${light ? 'light' : 'dark'}`;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(3500);
  await js(`document.documentElement.classList.toggle('light', ${light}); [...document.querySelectorAll('.kpm-actor')].find(a => a.querySelector('.kpm-actor-name')?.textContent.trim() === 'Budi Santoso')?.click(); true`);
  await sleep(1500);

  /* the gold bar + the stage */
  await frame('.kpm-stage', 70); await sleep(300);
  const bar = await js(`(() => { const r = s => document.querySelector(s)?.getBoundingClientRect(); const who = r('.kpm-stage-who'), acts = r('.kpm-stage-acts'), chips = r('.kpm-stage-chips'), counts = r('.kpm-stage-counts');
    const hit = (a, b) => a && b && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    const st = getComputedStyle(document.querySelector('.kpm-stage')), ac = getComputedStyle(document.querySelector('.kpm-actor'));
    return JSON.stringify({ overlap: [hit(who, acts), hit(chips, counts), hit(counts, acts), hit(who, chips)], snap: st.scrollSnapType, stop: ac.scrollSnapStop }); })()`);
  console.log(await shoot(`1-stage-bar-${tag}`), bar);

  /* the bay open, one chest shut, both shut - the PC keeps one height */
  await frame('.kpm-bay'); await sleep(300);
  const open = await js(`JSON.stringify({ bayH: ${H}, cols: getComputedStyle(document.querySelector('.kpm-bay .gui.wh .grid')).gridTemplateColumns.split(' ').length,
    squares: document.querySelectorAll('.kpm-bay .gui.wh .grid .slot').length, vanSquares: document.querySelectorAll('.kpm-bay .gui.van .grid .slot').length,
    gap: (() => { const b = document.querySelector('.kpm-bay').getBoundingClientRect(), m = document.querySelector('.kpm-bay-duo .man')?.getBoundingClientRect(); return m ? Math.round(Math.max(m.left - b.right, m.top - b.bottom)) : null; })() })`);
  console.log(await shoot(`2-bay-open-${tag}`), open);
  const y0 = await js('Math.round(scrollY)');
  await js(`document.querySelector('.kpm-bay .vanc').click(); true`); await sleep(700);
  const oneShut = await js(H);
  await js(`document.querySelector('.kpm-bay .whc').click(); true`); await sleep(700);
  console.log(await shoot(`3-both-shut-${tag}`), JSON.stringify({ open: JSON.parse(open).bayH, vanShut: oneShut, bothShut: await js(H), scrollMoved: (await js('Math.round(scrollY)')) - y0 }));

  /* the phone: tap a product, then an empty van square - the HOW MANY sheet opens, nothing written */
  if (w < 768) {
    await js(`document.querySelector('.kpm-bay .whc').click(); document.querySelector('.kpm-bay .vanc').click(); true`); await sleep(900);
    await frame('.kpm-bay'); await sleep(300);
    const c = (sel) => js(`(() => { const r = document.querySelector('${sel}').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
    await tap(...await c('.kpm-bay .gui.wh .slot.has:not(.out)')); await sleep(400);
    const picking = await js(`JSON.stringify({ picked: !!document.querySelector('.kpm-bay .slot.picked'), picking: document.querySelector('.kpm-bay').classList.contains('picking'), say: document.querySelector('.kpm-bay .gui.wh .say')?.textContent })`);
    await frame('.kpm-bay .gui.van', 120); await sleep(300);
    console.log(await shoot(`4-picked-${tag}`), picking);
    await tap(...await c('.kpm-bay .gui.van .slot:not(.has)')); await sleep(600);
    console.log(await shoot(`5-tapped-van-${tag}`), await js(`JSON.stringify({ sheet: !!document.querySelector('.kpm-bay-sheet'), name: document.querySelector('.kpm-bay-sheet .shName')?.textContent, writes: (globalThis.__labWrites || []).length })`));
  }
}
ws.close(); chrome.kill();
