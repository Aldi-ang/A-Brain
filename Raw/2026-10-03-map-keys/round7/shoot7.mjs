/* Round 7 shooter: Today / A / B / C with Budi pressed, in normal and colour-blind view, map close-ups at x2; the phone
   page at 390 (touch media, lessons 2026-10-03) loaded inside the publish skeleton (lessons 2026-10-03); board7.png. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.writeFileSync(path.join(HERE, 'lab.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'
  + fs.readFileSync(path.join(HERE, 'roadmap-r7.html'), 'utf8') + '</body></html>');
const URL0 = pathToFileURL(path.join(HERE, 'lab.html')).href;
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9408',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9408/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 200));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push(r.result.exceptionDetails.exception?.description?.slice(0, 200)); return r.result?.result?.value; };
const shot = async (file, clip, scale = 1) => {
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });
  const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale } } : {}), captureBeyondViewport: true });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const clipOf = (sel) => js(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
const load = async () => { await send('Page.navigate', { url: URL0 }); for (let i = 0; i < 60; i++) { await sleep(150); if (await js('document.readyState === "complete"')) break; } await js('document.fonts.ready.then(() => 1)'); await sleep(500); };
await send('Page.enable'); await send('Runtime.enable');
const out = { errs };

await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await load();
for (const cb of [false, true]) {
  if (cb) await js(`document.getElementById('cb').click(); 1`);
  for (const l of ['T', 'A', 'B', 'C']) {
    await js(`document.querySelector('[data-look="${l}"]').click(); 1`); await sleep(900);
    await shot(`f-${l}${cb ? '-cb' : ''}.png`, await clipOf('#mapbox'), 2);
  }
}
/* every one of Budi's chests carries a mark in A/B/C; nobody else's does; the others are faded */
for (const l of ['A', 'B', 'C']) {
  await js(`document.querySelector('[data-look="${l}"]').click(); 1`); await sleep(900);
  out[l] = await js(`({ marked: document.querySelectorAll('.mk.mine .add').length, mine: document.querySelectorAll('.mk.mine').length, otherMarked: document.querySelectorAll('.mk:not(.mine) .add').length,
    faded: [...document.querySelectorAll('.mk:not(.mine)')].every((e) => getComputedStyle(e).opacity < .4), roadParts: document.querySelectorAll('#route > *').length })`);
}
await js(`document.getElementById('lite').click(); document.querySelector('[data-look="A"]').click(); 1`); await sleep(200);
out.liteRunning = await js(`document.getAnimations().filter((a) => a.playState === 'running').length`);
out.pcOverflow = await js('document.documentElement.scrollWidth - innerWidth');
await shot('f-fs-pc.png', await clipOf('#fspc'), 1);

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
await load();
out.phone = await js(`({ overflow: document.documentElement.scrollWidth - innerWidth, squadCols: getComputedStyle(document.getElementById('squad')).gridTemplateColumns, mapW: document.getElementById('mapbox').clientWidth })`);
await shot('f-fs-phone.png', await clipOf('#fsph'), 1);
const h = await js('document.documentElement.scrollHeight');
await shot('f-phone.png', { x: 0, y: 0, width: 390, height: h }, 1);

const cell = (f, t) => `<figure><img src="${f}"><figcaption>${t}</figcaption></figure>`;
fs.writeFileSync(path.join(HERE, 'board7.html'), '<!doctype html><meta charset=utf-8><link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800;900&display=swap"><style>body{margin:0;padding:24px;background:#0A0908;color:#E8E4DE;font:15px/1.4 system-ui;width:1700px}h1{margin:0 0 4px;font:900 32px/1 "Barlow Condensed";letter-spacing:.06em}h1+p{margin:0 0 12px;color:#A39B90}h2{font:900 22px/1 "Barlow Condensed";letter-spacing:.08em;margin:16px 0 8px;color:#E4B04A}.g{display:flex;gap:10px}figure{margin:0}img{width:412px;border-radius:10px;border:1px solid #3E3A35;display:block}figcaption{margin-top:4px;color:#A39B90;font-size:14px}figcaption b{color:#E8E4DE}</style>'
  + '<h1>Budi pressed · whose chest, which way</h1><p>Top row: normal eyes. Bottom row: the same map as a red-green colour-blind eye sees it (purple Budi and pink Ari turn into the same blue).</p>'
  + '<h2>Normal</h2><div class="g">' + cell('f-T.png', '<b>Today</b> - rings only') + cell('f-A.png', '<b>A</b> quest flags') + cell('f-B.png', '<b>B</b> name tags') + cell('f-C.png', '<b>C</b> his face') + '</div>'
  + '<h2>Colour-blind view</h2><div class="g">' + cell('f-T-cb.png', '<b>Today</b>') + cell('f-A-cb.png', '<b>A</b>') + cell('f-B-cb.png', '<b>B</b>') + cell('f-C-cb.png', '<b>C</b>') + '</div>');
await send('Emulation.setDeviceMetricsOverride', { width: 1748, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Emulation.setTouchEmulationEnabled', { enabled: false });
await send('Page.navigate', { url: pathToFileURL(path.join(HERE, 'board7.html')).href }); await sleep(1500);
const bh = await js('document.documentElement.scrollHeight');
await shot('board7.png', { x: 0, y: 0, width: 1748, height: bh }, 1);
fs.writeFileSync(path.join(HERE, 'measure7.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); await sleep(1200);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* Chrome still closing */ }
