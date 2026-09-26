// His "test it yourself" on the Loading Bay ponder page (kpm fcaad9c, 13f34fb): every beat walked at 1440 and 430 - the
// sentence on screen, the part it points at really there, the chests / tabs / muatan as the beat says - then the book's
// touches (a drag does nothing, a tap on a chest jumps to its beat, Muat van writes nothing), Lite Mode, and the REAL bay
// in Fleet & Roster (both chests still open on their own, a tap-tap load still opens the HOW MANY sheet). PASS / FAIL.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KPM = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/';
const { loadingBay } = await import(pathToFileURL(KPM + 'src/ponder/scenes/loading-bay.js').href);
const steps = loadingBay.steps;
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'test-shots');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9342',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9342/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(), errors = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push(d.params.args.map(a => a.value ?? a.description).join(' '));
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shoot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(s.result.data, 'base64')); };
const mouse = async (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 });
const tap = async (x, y) => { await mouse('mousePressed', x, y); await mouse('mouseReleased', x, y); };
const center = (sel) => js(`(() => { const e = document.querySelector('${sel}'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
const open = async (q, w, h) => {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768, hasTouch: w < 768 });
  await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?' + q }); await sleep(3800);
};
const beat = async (n) => { await js(`document.querySelector('[aria-label="Step ${n}"]').click(); true`); await sleep(750); };
const shown = () => js(`+((document.body.innerText.match(/(\\d+) \\/ ${steps.length}/) || [])[1] || 0)`);
const results = [];
const step = (name, pass, got) => { results.push({ name, pass: !!pass }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${got !== undefined ? '  ->  ' + JSON.stringify(got) : ''}`); };
await send('Page.enable'); await send('Runtime.enable');

/* the stage's own replay, re-done here from the scene data */
const poseAt = (i) => {
  const p = { open: { wh: true, van: true }, tabs: { wh: 'preset', van: 'geo' }, lines: 'none' };
  for (let k = 0; k <= i; k++) {
    const [verb, side, tab] = String(steps[k].act || '').split(':');
    if (verb === 'shut' || verb === 'open') p.open[side] = verb === 'open';
    else if (verb === 'tab') p.tabs[side] = tab;
    else if (verb === 'lines') p.lines = side;
  }
  return p;
};
const LINES = { none: 0, plan: 3, failed: 1, preset: 3 };
const TAB = { preset: 'Muatan biasa', team: 'Tim', geo: 'Geofence', titip: 'Titip', bounty: 'Bounty' };
const plain = (s) => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

/* ── every beat, PC and phone ── */
for (const [w, h] of process.argv[2] === 'drag' ? [] : [[1440, 900], [430, 930]]) {
  await open('scene=loading-bay&step=0', w, h);
  const bad = [];
  for (let i = 0; i < steps.length; i++) {
    await beat(i + 1);
    const s = steps[i], p = poseAt(i), keys = [].concat(s.focus).filter(k => k !== '*');
    const g = await js(`(() => { const bay = document.querySelector('.kpm-bay'); const on = q => (document.querySelector(q)?.textContent || '').trim();
      const vis = k => { const e = document.querySelector('[data-ponder="' + k + '"]'); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      return { text: document.body.innerText.replace(/\\s+/g, ' '), whShut: bay.classList.contains('wh-shut'), vanShut: bay.classList.contains('van-shut'),
        whTab: on('.kpm-bay .slip.wh .tab.on'), vanTab: on('.kpm-bay .slip.van .tab.on'), lines: document.querySelectorAll('.kpm-bay-wrap .man .lines li').length,
        keys: ${JSON.stringify(keys)}.map(vis) }; })()`);
    const miss = [];
    if (!g.text.includes(plain(s.text))) miss.push('sentence');
    if (g.whShut !== !p.open.wh || g.vanShut !== !p.open.van) miss.push('chests');
    if (!p.open.wh && !g.whTab.startsWith(TAB[p.tabs.wh])) miss.push('wh tab ' + g.whTab);
    if (!p.open.van && !g.vanTab.startsWith(TAB[p.tabs.van])) miss.push('van tab ' + g.vanTab);
    if (g.lines !== LINES[p.lines]) miss.push('muatan ' + g.lines);
    if (!g.keys.every(Boolean)) miss.push('points at nothing');
    if (miss.length) bad.push({ beat: i + 1, miss });
  }
  step(`${w}: all ${steps.length} beats - the sentence shows, the part it points at is there, chests / tabs / muatan as the beat says`, bad.length === 0, bad.slice(0, 6));
}

/* ── the book's touches, PC ── */
await open('scene=loading-bay&step=0', 1440, 900);
await beat(8);
const [sx, sy] = await center('.kpm-bay .gui.wh .slot.has:not(.out)');
await mouse('mousePressed', sx, sy); for (let k = 1; k <= 6; k++) await mouse('mouseMoved', sx + k * 40, sy + k * 10); await mouse('mouseReleased', sx + 240, sy + 60); await sleep(600);
const dragged = await js(`JSON.stringify({ beat: +((document.body.innerText.match(/(\\d+) \\/ 37/) || [])[1] || 0), sheet: !!document.querySelector('.kpm-bay-sheet'), ghost: !!document.querySelector('.kpm-bay-ghost'), lines: document.querySelectorAll('.kpm-bay-wrap .man .lines li').length })`);
step('Book: a drag inside the page opens no hidden HOW MANY sheet and leaves no box in the air', /"sheet":false,"ghost":false/.test(dragged), dragged);
if (process.argv[2] === 'drag') { ws.close(); chrome.kill(); process.exit(0); }
await beat(8);
await tap(...await center('.kpm-bay .vanc')); await sleep(900);
step('Book: tapping the van chest jumps to the beat about the chests', (await shown()) === 2, await shown());
await beat(13);
await tap(...await center('.kpm-bay-wrap .man .go')); await sleep(1800);
const loaded = await js(`JSON.stringify({ report: (document.querySelector('.kpm-bay-wrap .man .report')?.textContent || '').trim().slice(0, 60), sj: document.querySelectorAll('.kpm-bay-wrap .man .sj').length, writes: (globalThis.__labWrites || []).length })`);
step('Book: Muat van inside the page shows a surat jalan and a bukti kembali, and writes nothing', /tercatat/.test(loaded) && /"sj":2/.test(loaded) && /"writes":0/.test(loaded), loaded);
await shoot('book-muat-van-1440');

/* ── Lite Mode, phone: every word readable ── */
await open('scene=loading-bay&step=0&lite', 430, 930);
await beat(31);
const lite = await js(`(() => { const t = ${JSON.stringify(plain(steps[30].text))}; const e = [...document.querySelectorAll('p, div, span')].find(x => x.children.length < 3 && x.textContent.replace(/\\s+/g, ' ').trim() === t);
  if (!e) return 'caption not found'; let o = 1; for (let n = e; n; n = n.parentElement) o *= +getComputedStyle(n).opacity; return { lite: document.documentElement.classList.contains('lite-mode'), opacity: Math.round(o * 100) / 100 }; })()`);
step('Lite Mode: the sentence is fully visible', lite?.lite && lite.opacity >= 0.99, lite);
await shoot('book-lite-430');

/* ── the REAL bay in Fleet & Roster ── */
await open('shell&fleet', 1440, 900);
await js(`[...document.querySelectorAll('.kpm-actor')].find(a => a.querySelector('.kpm-actor-name')?.textContent.trim() === 'Budi Santoso')?.click(); true`); await sleep(1800);
const real = await js(`(() => { const b = document.querySelector('.kpm-bay'); return b ? { whOpen: b.classList.contains('wh-open'), vanOpen: b.classList.contains('van-open'), lines: document.querySelectorAll('.kpm-bay-wrap .man .lines li').length } : 'no bay'; })()`);
step('Fleet & Roster: the real bay still opens both chests on its own, with an empty muatan', real?.whOpen && real.vanOpen && real.lines === 0, real);
await open('shell&fleet', 430, 930);
await js(`[...document.querySelectorAll('.kpm-actor')].find(a => a.querySelector('.kpm-actor-name')?.textContent.trim() === 'Budi Santoso')?.click(); true`); await sleep(1800);
await tap(...await center('.kpm-bay .gui.wh .slot.has:not(.out)')); await sleep(400);
await tap(...await center('.kpm-bay .gui.van .slot:not(.has)')); await sleep(700);
const sheet = await js(`JSON.stringify({ sheet: !!document.querySelector('.kpm-bay-sheet'), writes: (globalThis.__labWrites || []).length })`);
step('Fleet & Roster phone: tap a product, tap an empty van box - the HOW MANY sheet opens, nothing written', sheet === '{"sheet":true,"writes":0}', sheet);
await shoot('fleet-sheet-430');

step('no page errors anywhere in the walk', errors.length === 0, errors.slice(0, 4));
console.log(`\n${results.filter(r => r.pass).length}/${results.length} pass`);
ws.close(); chrome.kill();
