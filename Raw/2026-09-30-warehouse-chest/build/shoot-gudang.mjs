// the BUILT regional warehouse chest, in the lab (?shell&gudang on the ponder-lab server): the Stock tab at 1440 and 430 -
// healthy, a real press into the Quarantine (frozen mid-doors, then at rest), a square tapped, the chest shut, Lite Mode.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = 'http://localhost:4190/tools/ponder-lab.html?shell&gudang';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9351',
  '--user-data-dir=' + path.join(HERE, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9351/json/list')).json(); } catch { /* not up yet */ } }
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
const read = () => js(`(() => { const w = document.querySelector('.kpm-wh2'), q = (s) => w.querySelector(s), R = (s) => q(s).getBoundingClientRect();
  return 'box ' + Math.round(R('.sbx').width) + 'x' + Math.round(R('.sbx').height) + ' / ' + getComputedStyle(q('.grid')).gridTemplateColumns.split(' ').length + ' a row, ' + w.querySelectorAll('.slot.has').length + ' full / "' + q('.stl').textContent + '" / say "' + q('.say').textContent + '" / note "' + q('.ddeck .of').textContent + '" / chest bottom ' + Math.round(R('.kpm-c3 .bf').bottom) + ' in top face ' + Math.round(R('.kpm-c3 .it').top) + '-' + Math.round(R('.kpm-c3 .it').bottom) + ', island to ' + Math.round(R('.kpm-c3 .iu').bottom) + ', caption at ' + Math.round(R('.capt').top); })()`);
const stockTab = `[...document.querySelectorAll('button')].find(b => /^Stock/.test(b.textContent.trim()) && !/Opname/.test(b.textContent)).click(); true`;

await send('Page.enable'); await send('Runtime.enable');
const out = [];
for (const [w, h, tag] of [[1440, 900, 'pc'], [430, 932, 'phone']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(3500);
  await js(stockTab); await sleep(900);
  await js(`document.querySelector('.kpm-wh2').scrollIntoView({ block: 'start' }); true`); await sleep(500);
  out.push([tag, 'healthy', await read()]);
  await js(`document.querySelector('.kpm-wh2 .kpm-c3').getAnimations().forEach(a => { a.pause(); a.currentTime = 0; }); true`);
  await shoot(`${tag}-healthy`, '.kpm-wh2');
  await js(`document.querySelector('.kpm-wh2 .kpm-c3').getAnimations().forEach(a => a.play()); true`);
  /* a real press: frozen as the doors meet, then at rest in the Quarantine */
  await js(`document.querySelector('.kpm-wh2 .kpm-hatch').click(); true`);
  await js(`new Promise(res => { const t0 = performance.now(); (function f() { if (performance.now() - t0 > 360) { document.getAnimations().forEach(a => a.pause()); res(1); } else requestAnimationFrame(f); })(); })`);
  out.push([tag, 'doors at 360 ms', await js(`(() => { const d = document.querySelector('.kpm-wh2 .kpm-doors'); return 'kind ' + d.dataset.kind + ' L ' + getComputedStyle(d.children[0]).transform + ' R ' + getComputedStyle(d.children[1]).transform; })()`)]);
  await shoot(`${tag}-doors-in`, '.kpm-wh2 .sbx');
  await js(`document.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); }); true`); await sleep(2200);
  await js(`document.querySelector('.kpm-wh2 .slot.has').click(); true`); await sleep(200);
  out.push([tag, 'quarantine', await read()]);
  await shoot(`${tag}-quarantine`, '.kpm-wh2');
  /* back to healthy, frozen as the doors meet */
  await js(`document.querySelector('.kpm-wh2 .kpm-hatch').click(); true`);
  await js(`new Promise(res => { const t0 = performance.now(); (function f() { if (performance.now() - t0 > 360) { document.getAnimations().forEach(a => a.pause()); res(1); } else requestAnimationFrame(f); })(); })`);
  await shoot(`${tag}-doors-out`, '.kpm-wh2 .sbx');
  await js(`document.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); }); true`); await sleep(2200);
  out.push([tag, 'back', await js(`document.querySelector('.kpm-wh2 .say').textContent + ' / doors ' + (document.querySelector('.kpm-wh2 .kpm-doors').dataset.kind || 'no face')`)]);
  await js(`document.querySelector('.kpm-wh2 .kpm-chest').click(); true`); await sleep(700);
  out.push([tag, 'chest shut', await js(`(() => { const s = document.querySelector('.kpm-wh2 .sbx'); return getComputedStyle(s).visibility + ', box still ' + Math.round(s.getBoundingClientRect().height ? s.offsetHeight : 0) + ' px tall in the flow, aria-expanded ' + document.querySelector('.kpm-wh2 .kpm-chest').getAttribute('aria-expanded'); })()`)]);
  await shoot(`${tag}-shut`, '.kpm-wh2');
  await js(`document.querySelector('.kpm-wh2 .kpm-chest').click(); true`); await sleep(500);
  /* Lite Mode: the switch swaps at once, the scene stands still */
  await js(`document.documentElement.classList.add('lite-mode'); document.querySelector('.kpm-wh2 .kpm-hatch').click(); true`); await sleep(80);
  out.push([tag, 'lite', await js(`(() => { const w = document.querySelector('.kpm-wh2'); return 'say "' + w.querySelector('.say').textContent + '", running animations ' + w.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length; })()`)]);
  await js(`document.documentElement.classList.remove('lite-mode'); true`);
}
out.push(['errors', errors.length ? errors.join(' || ') : 'none']);
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
