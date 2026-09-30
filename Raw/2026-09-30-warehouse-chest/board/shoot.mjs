// Frames of the two new option sections (regional warehouse, Stock Opname) - real clicks, heights, console errors.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = pathToFileURL(path.join(HERE, 'index.html')).href;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9342',
  '--user-data-dir=' + path.join(HERE, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9342/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(), errors = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push(d.params.args.map(a => a.value || a.description).join(' '));
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push('EVAL ' + JSON.stringify(r.result.exceptionDetails).slice(0, 200)); return r.result?.result?.value; };
const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 });
const clickSel = async (sel) => {
  const p = await js(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
  if (!p) return 'NO ' + sel;
  await sleep(150); await mouse('mousePressed', ...p); await sleep(60); await mouse('mouseReleased', ...p); return 'ok';
};
const shootSel = async (name, sel) => {
  await js(`document.querySelector(${JSON.stringify(sel)}).scrollIntoView({ block: 'start' }); window.scrollBy(0, -8); true`);
  await sleep(250);
  const c = await js(`(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: Math.max(0, r.left - 6), y: r.top + scrollY - 6, width: r.width + 12, height: r.height + 12 }; })()`);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...c, scale: 1 }, captureBeyondViewport: true });
  const file = path.join(OUT, (process.env.SCHEME ? process.env.SCHEME + '-' : '') + name + '.png');
  if (fs.existsSync(file)) fs.unlinkSync(file);
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  return name;
};
const H = (sel) => js(`Math.round(document.querySelector(${JSON.stringify(sel)})?.getBoundingClientRect().height || -1)`);

await send('Page.enable'); await send('Runtime.enable'); if (process.env.SCHEME) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: process.env.SCHEME }] });
const out = [];
for (const [w, h, tag] of [[1100, 900, 'pc'], [430, 932, 'phone']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(1500);
  if (tag === 'phone') { await js(`document.querySelector('[data-rw-w="hp"]').click(); document.querySelector('[data-so-w="hp"]').click(); true`); await sleep(300); }
  out.push([tag, 'frame w', await js(`Math.round(document.getElementById('rwF').getBoundingClientRect().width)`)]);
  /* regional warehouse */
  for (const o of ['today', 'A', 'B']) {
    await js(`document.querySelector('[data-rw="${o}"]').click(); true`); await sleep(300);
    const h0 = await H('#rwD');
    out.push([tag, 'rw ' + o, await shootSel(`${tag}-rw-${o}`, '#rw .frame'), 'desk h ' + h0]);
    if (o === 'today') continue;
    out.push([tag, 'rw ' + o + ' press', await clickSel('#rwD .kpm-hatch')]);
    await sleep(1700);
    const h1 = await H('#rwD');
    out.push([tag, 'rw ' + o + ' q', await shootSel(`${tag}-rw-${o}-q`, '#rw .frame'), 'desk h ' + h1, await js(`document.getElementById('rwM').textContent`)]);
    if (o === 'B') { out.push([tag, 'rw B square', await clickSel('#rwD .slot.has')]); await sleep(200); out.push([tag, 'rw B say', await js(`document.querySelector('#rwD .say').textContent`)]); }
    out.push([tag, 'rw ' + o + ' press back', await clickSel('#rwD .kpm-hatch')]);
    await sleep(1700);
    out.push([tag, 'rw ' + o + ' back', 'desk h ' + await H('#rwD'), await js(`document.getElementById('rwM').textContent`)]);
  }
  /* Stock Opname */
  for (const o of ['today', 'A', 'B']) {
    await js(`document.querySelector('[data-so="${o}"]').click(); true`); await sleep(300);
    out.push([tag, 'so ' + o, await shootSel(`${tag}-so-${o}`, '#so .frame'), 'vault h ' + await H('#soV'), 'crates h ' + await H('#soV .crates')]);
    if (o === 'today') continue;
    out.push([tag, 'so ' + o + ' crate', await clickSel(o === 'A' ? '#soV .chestCell[data-fac="BANDUNG"]' : '#soV .chestCell[data-fac="PUSAT"]')]);
    await sleep(600);
    out.push([tag, 'so ' + o + ' after crate', await shootSel(`${tag}-so-${o}-crate`, '#so .frame'), await js(`document.getElementById('soM').textContent`)]);
    if (o === 'B') {
      out.push([tag, 'so B square', await clickSel('#soV .sbx .slot.has')]); await sleep(300);
      out.push([tag, 'so B strip', await shootSel(`${tag}-so-B-square`, '#so .frame'), await js(`document.getElementById('soM').textContent`)]);
    }
  }
}
out.push(['errors', errors.length ? errors.join(' || ') : 'none']);
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
