// v24 checks: the seal is gone once the doors are open; the End scene behind the ender chest (box open and shut);
// the Quarantine Vault box shrinks into the old crate and grows out of the new one (sampled every frame).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots24');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = pathToFileURL(path.join(HERE, 'index.html')).href;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9348',
  '--user-data-dir=' + path.join(HERE, 'profile24'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9348/json/list')).json(); } catch { /* not up yet */ } }
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
const click = async (sel) => { const p = await js(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`); if (!p) return 'NO ' + sel; await mouse('mousePressed', ...p); await sleep(40); await mouse('mouseReleased', ...p); return 'ok'; };
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
  await toTop('#rw .frame'); await sleep(900);
  out.push([tag, 'end scene', await shoot(`${tag}-end-open`, '#rw .frame')]);
  /* into the Quarantine and back out: after each run the doors carry no face and the right door is past the edge */
  await click('#rwD .kpm-hatch'); await sleep(2100);
  out.push([tag, 'after open', await js(`(() => { const d = document.querySelector('#rwD .kpm-doors'), s = document.querySelector('#rwD .stg').getBoundingClientRect(), r = d.querySelector('.dr').getBoundingClientRect(); return JSON.stringify({ kind: d.dataset.kind || 'none', drLeftMinusStageRight: Math.round(r.left - s.right) }); })()`)]);
  out.push([tag, 'q rest', await shoot(`${tag}-q-rest`, '#rw .frame')]);
  await click('#rwD .kpm-hatch'); await sleep(2100);
  await click('#rwChest'); await sleep(700);
  out.push([tag, 'chest shut (his sc1)', await shoot(`${tag}-end-shut`, '#rw .frame')]);
  /* the Quarantine Vault: Bandung, then Pusat - sample the box's scale every frame for 700 ms */
  await toTop('#so .frame'); await sleep(300);
  await click('#soV .chestCell[data-fac="PUSAT"]'); await sleep(900);
  await js(`window.__s = []; (function f(t0) { const m = getComputedStyle(document.getElementById('soBelow')).transform; window.__s.push(m === 'none' ? 1 : +m.split('(')[1].split(',')[0]); if (performance.now() - t0 < 700) requestAnimationFrame(() => f(t0)); })(performance.now()); true`);
  await click('#soV .chestCell[data-fac="BANDUNG"]');
  await sleep(800);
  out.push([tag, 'box scale per frame', await js(`window.__s.map(v => v.toFixed(2)).join(' ')`)]);
  /* one frozen moment mid-growth, from a fresh swap */
  await click('#soV .chestCell[data-fac="PUSAT"]');
  await js(`new Promise(res => { const t0 = performance.now(); (function f() { if (performance.now() - t0 > 290) { document.getAnimations().forEach(a => a.pause()); res(1); } else requestAnimationFrame(f); })(); })`);
  out.push([tag, 'swap mid-growth', await shoot(`${tag}-so-swap`, '#so .frame')]);
  await js(`document.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); }); true`);
}
out.push(['errors', errors.length ? errors.join(' || ') : 'none']);
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
