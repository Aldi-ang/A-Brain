// node tests.mjs <outDir> - Journey Plan phone tests in the Android emulator's Chrome (real touches over CDP).
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const ADB = 'C:/Users/ASUS/AppData/Local/Android/Sdk/platform-tools/adb.exe';
const OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:4187/tools/ponder-lab.html?shell&journey&exp&admin';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const adb = (...a) => execFileSync(ADB, a, { maxBuffer: 64 << 20 });
const cap = (name) => writeFileSync(`${OUT}/${name}.png`, adb('exec-out', 'screencap', '-p'));
const focusWin = () => (adb('shell', 'dumpsys', 'window').toString().match(/mCurrentFocus=Window\{\S+ \S+ ([^}]+)\}/) || [])[1] || '?';
adb('forward', 'tcp:9223', 'localabstract:chrome_devtools_remote');

let ws, id = 0; const wait = new Map(), errs = [];
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; wait.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
const touch = async (p, holdMs = 60) => {
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p[0], y: p[1] }] });
  await sleep(holdMs);
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
};
const at = (sel) => js(`(() => { const el = ${sel}; if (!el) return null; el.scrollIntoView({ block: 'center' }); const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
const btn = (re) => `[...document.querySelectorAll('button')].find((b) => ${re}.test(b.innerText))`;
const inFrame = (bid) => js(`(() => { const f = document.querySelector('.kx-paper iframe'); const b = f && f.contentDocument.getElementById('${bid}'); if (!b) return null; const fr = f.getBoundingClientRect(), br = b.getBoundingClientRect(); return [fr.left + br.left + br.width / 2, fr.top + br.top + br.height / 2]; })()`);
const results = [];
const check = (name, ok, detail) => { results.push({ name, ok: !!ok, detail }); console.log(ok ? 'PASS' : 'FAIL', '|', name, '|', detail); };
const tap = async (label, sel) => { const p = await at(sel); if (!p) { console.log('  (not found:', label + ')'); return false; } await touch(p); return true; };

try {
  const list = await (await fetch('http://127.0.0.1:9223/json/list')).json();
  const page = list.find((p) => p.type === 'page' && /localhost:4187/.test(p.url)) || list.find((p) => p.type === 'page');
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data); const w = m.id && wait.get(m.id);
    if (w) { wait.delete(m.id); return m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); }
    if (m.method === 'Runtime.exceptionThrown') errs.push('exception: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 160));
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errs.push('console: ' + m.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 160));
  });
  await send('Runtime.enable'); await send('Page.enable');

  // 1. HOLD: a finger held on a flag shows the name the crowd hid (52386fc9)
  await send('Page.navigate', { url: `${BASE}&tick&focus=${encodeURIComponent('Warung Bu Sri')}` }); await sleep(11000);
  const probe = await js(`(() => { const ms = [...document.querySelectorAll('.kx-mk')].filter((m) => m.querySelector('.kx-snm > i'));
    const hid = ms.filter((m) => { const r = m.getBoundingClientRect(); return getComputedStyle(m.querySelector('.kx-snm > i')).visibility === 'hidden' && r.top > 70 && r.bottom < innerHeight - 70 && r.left > 12 && r.right < innerWidth - 12; });
    const m = hid[0]; if (!m) return { named: ms.length, hidden: 0 };
    const r = m.getBoundingClientRect(); return { named: ms.length, hidden: hid.length, name: m.querySelector('.kx-snm > i').textContent, p: [r.left + r.width / 2, r.top + r.height * 0.55] }; })()`);
  console.log('flags with a name:', probe.named, '| names hidden in view:', probe.hidden, '| holding:', probe.name || '-');
  if (probe.p) {
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: probe.p[0], y: probe.p[1] }] });
    await sleep(1600);
    const during = await js(`(() => { const h = document.querySelector('.kx-mk.held .kx-snm > i'); return h ? [getComputedStyle(h).visibility, h.textContent] : null; })()`);
    cap('1-hold');
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(500);
    const after = await js(`document.querySelectorAll('.kx-mk.held').length`);
    check('Hold a crowded flag shows its hidden name', during && during[0] === 'visible' && during[1] === probe.name && after === 0,
      `during the hold: ${JSON.stringify(during)}; after letting go: ${after} held`);
  } else check('Hold a crowded flag shows its hidden name', false, 'no flag with a hidden name in view at this zoom');

  // 2. DAY REPLAY: press a pin, its card opens and names the same shop
  await send('Page.navigate', { url: BASE }); await sleep(9000);
  await tap('BS chip', btn('/^\\s*BS\\b/')); await sleep(1500);
  await tap('Replay his day', btn('/Replay his day/i')); await sleep(4000);
  await tap('Pause', `document.querySelector('button[aria-label="Pause"]')`); await sleep(600);
  await tap('Whole day', btn('/^\\s*WHOLE DAY\\s*$/i')); await sleep(800);
  await tap('Full screen', `document.querySelector('.kx-mapkey.k-full')`); await sleep(3500);
  const full = await js(`!!document.querySelector('.kx-mapkey.k-full') + '|' + !![...document.querySelectorAll('button')].find((b) => /^\\s*EXIT\\s*$/i.test(b.innerText))`);
  check('Full screen opens', full.endsWith('true'), `exit key present: ${full}`);
  const pin = await js(`(() => { const ms = [...document.querySelectorAll('.kx-rp-mk')]; for (const m of ms) { const r = m.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height * 0.4;
    const top = document.elementFromPoint(x, y)?.closest('.kx-rp-mk'); if (top && y > 140 && y < innerHeight - 260) return { p: [x, y], name: top.getAttribute('title') }; } return null; })()`);
  if (pin) {
    await touch(pin.p); await sleep(1800);
    const card = await js(`(document.querySelector('.kx-rp-card:not(.now)')?.innerText || '').split('\\n')[0]`);
    const picked = await js(`document.querySelector('.kx-rp-mk.picked')?.getAttribute('title') || ''`);
    cap('2-replay-pin');
    check('Day Replay: pressing a pin opens its card', card && card.toLowerCase() === pin.name.toLowerCase() && picked === pin.name, `pressed ${pin.name}; card says "${card}"; marked pin: "${picked}"`);
  } else check('Day Replay: pressing a pin opens its card', false, 'no pin in a free spot to press');
  await tap('Exit', btn('/^\\s*EXIT\\s*$/i')); await sleep(2500);
  check('Full screen closes again', await js(`![...document.querySelectorAll('button')].find((b) => /^\\s*EXIT\\s*$/i.test(b.innerText))`), 'no EXIT key after pressing it');

  // 3. DAY REPLAY PRINT: the paper prints alone from the third entry point
  await tap('Replay PRINT', `[...document.querySelectorAll('button.kx-rp-x')].find((b) => /^\\s*PRINT\\s*$/i.test(b.innerText))`); await sleep(7000);
  const title = await js(`document.querySelector('.kx-paper iframe')?.contentDocument?.title || ''`);
  const pp = await inFrame('kx-print');
  if (pp) { await touch(pp); await sleep(6000); }
  const win = focusWin(); cap('3-replay-print');
  check('Day Replay Print: Android print screen opens on the paper', /printspooler/.test(win) && /Day Log/.test(title), `paper "${title}"; window: ${win}`);
  adb('shell', 'input', 'keyevent', 'KEYCODE_BACK'); await sleep(1500);
  const close = await inFrame('kx-close'); if (close) { await touch(close); await sleep(800); }
  check('Close takes the paper away', await js(`!document.querySelector('.kx-paper')`), 'no .kx-paper after Close');
} catch (e) { console.log('ERROR', e.message); }
finally {
  console.log('page errors:', errs.length ? errs.join(' || ') : 'none');
  writeFileSync(`${OUT}/results.json`, JSON.stringify({ results, errs }, null, 1));
  ws?.close();
}
