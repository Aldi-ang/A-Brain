// v27 doors: the healthy door (silver + Eye of Ender) and the quarantine door held shut at PC + phone, each seal's centre
// and the seam's centre measured against the stage's middle, one real run frozen mid-close, the state after the run.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots-hdoor');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = pathToFileURL(path.join(HERE, 'index.html')).href;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9350',
  '--user-data-dir=' + path.join(HERE, 'profile-hdoor'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9350/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(), errors = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push('EVAL ' + JSON.stringify(r.result.exceptionDetails.exception?.description)); return r.result?.result?.value; };
const shoot = async (name, sel, pad = 6) => {
  const c = await js(`(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: Math.max(0, r.left - ${pad}), y: r.top + scrollY - ${pad}, width: r.width + ${pad * 2}, height: r.height + ${pad * 2} }; })()`);
  const file = path.join(OUT, name + '.png'); fs.rmSync(file, { force: true });
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...c, scale: 1 }, captureBeyondViewport: true });
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64')); return name;
};
/* centres, in px from the stage's exact middle: the lock (whichever door carries it) and the seam (tape strips or teeth) */
const centres = () => js(`(() => { const d = document.querySelector('#rwD .kpm-doors'), L = d.children[0], R = d.children[1], s = document.querySelector('#rwD .stg').getBoundingClientRect(), mid = s.left + s.width / 2;
  const at = (el, p) => { const r = el.getBoundingClientRect(), c = getComputedStyle(el, p); return c.content === 'none' ? null : [r.left + parseFloat(c.left), r.left + parseFloat(c.left) + parseFloat(c.width)]; };
  const lk = at(L, '::before') || at(R, '::before'), ls = at(L, '::after'), rs = at(R, '::after');
  const f = (v) => (v >= 0 ? '+' : '') + v.toFixed(2);
  const seam = d.dataset.kind === 'tape' ? [Math.min(ls[0], rs[0]), Math.max(ls[1], rs[1])] : ls;
  return 'kind ' + (d.dataset.kind || 'none') + ' / stage ' + s.width.toFixed(1) + ' / lock centre ' + (lk ? f((lk[0] + lk[1]) / 2 - mid) + ' (' + (lk[1] - lk[0]).toFixed(0) + ' px)' : 'none') + ' / seam ' + f(seam[0] - mid) + '..' + f(seam[1] - mid) + ' centre ' + f((seam[0] + seam[1]) / 2 - mid); })()`);

await send('Page.enable'); await send('Runtime.enable');
const out = [];
for (const [w, h, tag] of [[1100, 900, 'pc'], [430, 932, 'phone']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(1500);
  if (tag === 'phone') { await js(`document.querySelector('[data-rw-w="hp"]').click(); true`); await sleep(300); }
  await js(`document.querySelector('#rw .frame').scrollIntoView({ block: 'start' }); true`); await sleep(600);
  for (const k of ['steel', 'tape']) {
    await js(`document.querySelector('[data-see="${k}"]').click(); true`); await sleep(600);
    out.push([tag, k + ' held', await centres()]);
    await shoot(`${tag}-${k}-shut`, '#rwBox .stg', 4);
    if (tag === 'pc') {   /* the lock close up, 4x */
      const c = await js(`(() => { const r = document.querySelector('#rwD .stg').getBoundingClientRect(); return { x: r.left + r.width / 2 - 40, y: r.top + scrollY + r.height / 2 - 40, width: 80, height: 80 }; })()`);
      const file = path.join(OUT, `zoom-${k}-lock.png`); fs.rmSync(file, { force: true });
      const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...c, scale: 4 }, captureBeyondViewport: true });
      fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
    }
  }
  /* one real run into the Quarantine and back, each frozen mid-close (a fresh press each time) */
  await js(`document.querySelector('#rwD .kpm-hatch').click(); true`);
  await js(`new Promise(res => { const t0 = performance.now(); (function f() { if (performance.now() - t0 > 300) { document.getAnimations().forEach(a => a.pause()); res(1); } else requestAnimationFrame(f); })(); })`);
  await shoot(`${tag}-tape-closing`, '#rwBox .stg', 4);
  await js(`document.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); }); true`); await sleep(2300);
  out.push([tag, 'in Q, open', await centres().catch(() => 'n/a')]);
  await js(`document.querySelector('#rwD .kpm-hatch').click(); true`);
  await js(`new Promise(res => { const t0 = performance.now(); (function f() { if (performance.now() - t0 > 300) { document.getAnimations().forEach(a => a.pause()); res(1); } else requestAnimationFrame(f); })(); })`);
  await shoot(`${tag}-steel-closing`, '#rwBox .stg', 4);
  await js(`document.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); }); true`); await sleep(1500);
  out.push([tag, 'after run', await js(`(() => { const d = document.querySelector('#rwD .kpm-doors'), s = document.querySelector('#rwD .stg').getBoundingClientRect(), l = d.children[0].getBoundingClientRect(), r = d.children[1].getBoundingClientRect(); return 'kind ' + (d.dataset.kind || 'none') + ' / L right ' + Math.round(l.right - s.left) + ' R left ' + Math.round(r.left - s.right) + ' (px past the stage edges; lock 36 + teeth 14 must stay outside)'; })()`)]);
}
out.push(['errors', errors.length ? errors.join(' || ') : 'none']);
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
