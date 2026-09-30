// the island redraw: frames at PC + phone (box open / chest shut), the bob frozen at its bottom and its top, the chest's
// front edge vs the island's top face, and Lite Mode read back.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots-isle');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = pathToFileURL(path.join(HERE, 'index.html')).href;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9349',
  '--user-data-dir=' + path.join(HERE, 'profile-isle'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9349/json/list')).json(); } catch { /* not up yet */ } }
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
/* freeze the bob (only the bob) at one moment */
const bobAt = (ms) => js(`(() => { const a = document.querySelector('#rwChest .c3').getAnimations().find(x => x.animationName === 'isleBob'); if (!a) return 'no bob'; a.pause(); a.currentTime = ${ms}; return getComputedStyle(document.querySelector('#rwChest .c3')).transform; })()`);
const edge = () => js(`(() => { const f = document.querySelector('#rwChest .bf').getBoundingClientRect(), t = document.querySelector('#rwChest .it').getBoundingClientRect(), u = document.querySelector('#rwChest .iu').getBoundingClientRect(), c = document.querySelector('#rwChest .capt').getBoundingClientRect();
  return 'chest bottom ' + Math.round(f.bottom) + ' / top face ' + Math.round(t.top) + '-' + Math.round(t.bottom) + ' w' + Math.round(t.width) + ' / island to ' + Math.round(u.bottom) + ' / caption top ' + Math.round(c.top) + ' / chest w' + Math.round(f.width); })()`);

await send('Page.enable'); await send('Runtime.enable');
const out = [];
for (const [w, h, tag] of [[1100, 900, 'pc'], [430, 932, 'phone']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(1500);
  if (tag === 'phone') { await js(`document.querySelector('[data-rw-w="hp"]').click(); true`); await sleep(300); }
  await js(`document.querySelector('#rw .frame').scrollIntoView({ block: 'start' }); true`); await sleep(900);
  out.push([tag, 'bob 0 ms', await bobAt(0)]);
  out.push([tag, 'geometry', await edge()]);
  await shoot(`${tag}-open`, '#rw .frame');
  out.push([tag, 'bob 2500 ms (top)', await bobAt(2500)]);
  await shoot(`${tag}-open-top`, '#rwChest', 30);
  await bobAt(0); await shoot(`${tag}-open-bottom`, '#rwChest', 30);
  await js(`document.querySelector('#rwChest').click(); true`); await sleep(700);
  await bobAt(1200); await shoot(`${tag}-shut`, '#rw .frame');
  out.push([tag, 'geometry shut', await edge()]);
  await js(`document.getElementById('lite').click(); true`); await sleep(200);
  out.push([tag, 'Lite Mode', await js(`(() => { const c = document.querySelector('#rwChest .c3'); return 'animation ' + getComputedStyle(c).animationName + ', transform ' + getComputedStyle(c).transform; })()`)]);
}
out.push(['errors', errors.length ? errors.join(' || ') : 'none']);
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
