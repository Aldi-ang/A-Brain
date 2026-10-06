/* 2026-10-06 - the presentation's Day Replay scene (03) driven with REAL presses (mouse at 1440, touch at 390), moving and
   still. Reads the scene's own clock (`drT`, `drPlaying` - top-level in the page script) after each press. Checks ->
   results-replay-scene.json; frames rs-*.png. Usage: node walk-replay-scene.mjs */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lab = path.join(HERE, 'lab-showcase.html');
fs.writeFileSync(lab, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>\n'
  + fs.readFileSync(path.join(HERE, 'showcase.html'), 'utf8') + '\n</body></html>');
const prof = path.join(HERE, 'profile-rs'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9396', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9396/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(), errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 200)); return r.result?.result?.value; };
const shot = async (file) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const results = []; const ok = (name, pass, data) => { results.push({ name, pass: !!pass, data }); console.log(pass ? 'PASS' : 'FAIL', name, data !== undefined ? JSON.stringify(data).slice(0, 240) : ''); };
let phone = false;
const pressAt = async (c) => { await sleep(100);
  if (phone) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
  await sleep(450); };
const at = (sel, i = 0) => js(`(() => { const e = document.querySelectorAll(${JSON.stringify(sel)})[${i}]; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
const press = async (sel, i = 0) => { const c = await at(sel, i); if (!c) throw new Error('no ' + sel + ' ' + i); await pressAt(c); };
const top = (sel, i = 0) => js(`(() => { const e = document.querySelectorAll(${JSON.stringify(sel)})[${i}]; if (!e) return 'missing'; const b = e.getBoundingClientRect(); const h = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return h && (e === h || e.contains(h)) ? 'top' : String(h?.className?.baseVal ?? h?.className ?? h?.tagName); })()`);
const S = `({ t: Math.round(drT), playing: drPlaying, picked: drPicked, card: document.querySelector('#drcard .top b')?.textContent, pickCard: document.getElementById('drcard').classList.contains('pick'),
  clock: document.getElementById('drClock').textContent, man: document.querySelector('.drman').style.left + ',' + document.querySelector('.drman').style.top, play: document.getElementById('drPlay').getAttribute('aria-label'),
  now: [...document.querySelectorAll('#drTl .tick')].findIndex((b) => b.classList.contains('now')), open: document.querySelectorAll('.drpt .kx-spr-open').length })`;
const load = async (hash) => {
  await send('Page.navigate', { url: 'about:blank' }); await sleep(100);
  await send('Page.navigate', { url: pathToFileURL(lab).href + hash });
  for (let i = 0; i < 60; i++) { await sleep(200); if (await js('document.readyState === "complete" && typeof drT === "number"')) break; }
  await js('document.fonts.ready.then(() => 1)');
  await js(`document.getElementById('ulang').scrollIntoView({ block: 'start' }); window.scrollBy(0, ${'${OFF}'}); 1`.replace('${OFF}', 'innerWidth < 1024 ? 380 : 0')); await sleep(900);
};
await send('Page.enable'); await send('Runtime.enable');
for (const [w, h, dpr, mobile, tag] of [[1440, 900, 1, false, 'pc'], [390, 844, 2, true, 'ph']]) {
  phone = mobile;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
  await load('');
  const a = await js(S); await sleep(700); const b = await js(S);
  ok(`${tag}: on screen it plays by itself - the clock runs and the man moves`, a.playing && b.t > a.t + 300 && a.man !== b.man, { a, b });
  ok(`${tag}: every chest and every bar key is the top element where it sits`, (await js(`[...document.querySelectorAll('.drchest')].length`)) === 7
    && (await Promise.all([0, 1, 2, 3, 4, 5, 6].map((i) => top('.drchest', i)))).every((x) => x === 'top')
    && [await top('#drPlay'), await top('#drNext'), await top('#drbar .speed button', 2)].every((x) => x === 'top'));
  await press('#drPlay'); const p1 = await js(S); await sleep(600); const p2 = await js(S);
  ok(`${tag}: Pause stops the day where it is`, !p1.playing && p1.t === p2.t && p1.man === p2.man && p1.play === 'Play', { p1, p2 });
  await press('#drTl .tick', 3); const j = await js(S);
  ok(`${tag}: a tick jumps to its stop - stop 3 Toko Makmur on the card, its tick marked, three chests open`, j.card === 'Toko Makmur' && j.now === 3 && j.open === 3 && j.clock === '09:18', j);
  await press('.drchest', 3); const k = await js(S);
  ok(`${tag}: pressing a chest (stop 4, not reached yet) opens ITS card with a Close and a Play-from-here, the clock stays`, k.card === 'Warung Bu Sri' && k.pickCard && k.t === j.t && !k.playing, k);
  ok(`${tag}: the card's keys are the top element`, [await top('#drX'), await top('#drFrom')].every((x) => x === 'top'));
  await shot(`rs-${tag}-card.png`);
  await press('#drFrom'); await sleep(1200); const f = await js(S);
  ok(`${tag}: Play from here = the card lets go and the day plays on from Warung Bu Sri`, !f.pickCard && f.playing && f.t >= 3 * 2700 + 1400 && f.card === 'Warung Bu Sri', f);
  await press('#drbar .speed button', 2); const s1 = await js(S); await sleep(1000); const s2 = await js(S);
  ok(`${tag}: 4x runs the clock about four times as fast`, s2.t - s1.t > 2800 || s2.t >= 18900, { d: s2.t - s1.t });
  await press('#drbar .speed button', 0);
  const tl = await js(`(() => { const b = document.getElementById('drTl').getBoundingClientRect(); return { x0: b.left + b.width * 0.15, x1: b.left + b.width * 0.47, y: b.top + 6 }; })()`);
  /* a drag at a finger's speed (12 steps over 300 ms, then still): one instant jump reads as a FLING, and the next tap only
     stops the fling - no click, on a real phone too (probe-tap.mjs vs probe-tap-slow.mjs, 2026-10-06) */
  const xs = Array.from({ length: 12 }, (_, i) => tl.x0 + (tl.x1 - tl.x0) * (i + 1) / 12);
  if (phone) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: tl.x0, y: tl.y }] }); for (const x of xs) { await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: tl.y }] }); await sleep(25); } await sleep(120); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else { await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: tl.x0, y: tl.y, button: 'left', clickCount: 1 }); for (const x of xs) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y: tl.y, button: 'left' }); await sleep(25); } await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: tl.x1, y: tl.y, button: 'left', clickCount: 1 }); }
  await sleep(150); const d0 = await js(S); await press('#drPlay'); const d1 = await js(S); await press('#drPlay'); const d2 = await js(S);
  ok(`${tag}: dragging along the timeline to the middle lands the clock near the middle of the day (09:32 + the time it played on)`, ['09:2', '09:3', '09:4'].some((x) => d0.clock.startsWith(x)), d0);
  ok(`${tag}: after a drag, Play / Pause still flips each press`, d1.playing !== d0.playing && d2.playing === d0.playing, { d0: d0.playing, d1: d1.playing, d2: d2.playing });
  if (d2.playing) await press('#drPlay');
  /* still / Lite: the frame stands at stop 5; Play cuts - the man is only ever ON a stop, never between */
  await load('#still');
  const st = await js(S);
  ok(`${tag} still: the frame stands at stop 5 (Toko Sinar Abadi), five chests open, not playing`, !st.playing && st.card === 'Toko Sinar Abadi' && st.open === 5, st);
  const run = await js(`document.getElementById('drmap').getAnimations({ subtree: true }).filter((x) => x.playState === 'running').length`);
  ok(`${tag} still: nothing animates on the scene's map (coins stand on their face)`, run === 0, run);
  await shot(`rs-${tag}-still.png`);
  await press('#drPlay');
  const spots = new Set(['8%,88%', '20%,70%', '36%,86%', '48%,58%', '63%,80%', '78%,62%', '60%,36%', '90%,30%']), seen = [];
  for (let i = 0; i < 32; i++) { seen.push((await js(S)).man.replace(/ /g, '')); await sleep(130); }
  ok(`${tag} still: Play cuts between stops - the man is only ever standing on a stop`, seen.every((m) => spots.has(m)) && new Set(seen).size >= 2, [...new Set(seen)]);
}
console.log('errors', JSON.stringify(errs));
ok('no page errors', errs.length === 0, errs);
fs.writeFileSync(path.join(HERE, 'results-replay-scene.json'), JSON.stringify(results, null, 1));
console.log(`${results.filter((r) => r.pass).length}/${results.length} pass`);
ws.close(); chrome.kill(); process.exit(0);
