// the healthy blast door (v26): each look held shut at PC (+ two at phone), one real run frozen mid-close, and the doors'
// state read back after the run (no face left, both doors past the stage edges).
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
const doorState = () => js(`(() => { const d = document.querySelector('#rwD .kpm-doors'), L = d.children[0], R = d.children[1], s = document.querySelector('#rwD .stg').getBoundingClientRect(), l = L.getBoundingClientRect(), r = R.getBoundingClientRect(), b = getComputedStyle(L, '::before');
  return 'kind ' + (d.dataset.kind || 'none') + ' hl ' + d.dataset.hl + ' / stage ' + Math.round(s.left) + '-' + Math.round(s.right) + ' / L ' + Math.round(l.left) + '-' + Math.round(l.right) + ' R ' + Math.round(r.left) + '-' + Math.round(r.right) + ' / lock ' + b.content + ' ' + b.width + ' ' + b.transform; })()`);

await send('Page.enable'); await send('Runtime.enable');
const out = [];
for (const [w, h, tag, looks] of [[1100, 900, 'pc', ['h1', 'h2', 'h3']], [430, 932, 'phone', ['h1', 'h2']]]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(1500);
  if (tag === 'phone') { await js(`document.querySelector('[data-rw-w="hp"]').click(); true`); await sleep(300); }
  await js(`document.querySelector('#rw .frame').scrollIntoView({ block: 'start' }); true`); await sleep(600);
  for (const k of looks) {
    await js(`document.querySelector('[data-hl="${k}"]').click(); true`); await sleep(900);
    out.push([tag, k + ' held', await doorState()]);
    await shoot(`${tag}-${k}-shut`, '#rwBox .stg', 4);
  }
  /* one real run back to healthy, frozen mid-close (the first freeze of a press is the true moment) */
  await js(`document.querySelector('[data-hl="h1"]').click(); true`); await sleep(300);
  await js(`document.querySelector('#rwD .kpm-hatch').click(); true`); await sleep(2300);
  out.push([tag, 'into Q', await doorState()]);
  await js(`document.querySelector('#rwD .kpm-hatch').click(); true`);
  await js(`new Promise(res => { const t0 = performance.now(); (function f() { if (performance.now() - t0 > 300) { document.getAnimations().forEach(a => a.pause()); res(1); } else requestAnimationFrame(f); })(); })`);
  out.push([tag, 'mid-close', await doorState()]);
  await shoot(`${tag}-h1-closing`, '#rwBox .stg', 4);
  await js(`document.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); }); true`); await sleep(1500);
  out.push([tag, 'after run', await doorState()]);
}
out.push(['errors', errors.length ? errors.join(' || ') : 'none']);
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
