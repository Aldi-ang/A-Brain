/* Shoots the map-keys prototype: 4 looks at 1440 (PC) and 390 (phone, dpr 2), plus the brush list open,
   measures the keys, then composes board.html -> board.png. Adapted from A-Brain Raw/2026-10-02-expedition/shoot-exp.mjs. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const URL0 = pathToFileURL(path.join(HERE, 'index.html')).href;

const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9402',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9402/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 200));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value; };
const shot = async (file, clip) => {
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });
  const s = await send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 }, captureBeyondViewport: true });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const mapClip = () => js(`(() => { const b = document.querySelector('#map').getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height }; })()`);
const measure = () => js(`(() => {
  const vis = (e) => getComputedStyle(e).display !== 'none' && e.offsetParent !== null;
  const keys = [...document.querySelectorAll('#map .key')].filter(vis).map((k) => { const b = k.getBoundingClientRect(); const s = k.querySelector('span');
    return { k: k.dataset.act, w: Math.round(b.width), h: Math.round(b.height), clipped: !!s && vis(s) && s.scrollWidth > s.clientWidth + 1 }; });
  const map = document.querySelector('#map').getBoundingClientRect();
  const outside = [...document.querySelectorAll('#map .key, #map .brush')].filter(vis).map((e) => e.getBoundingClientRect()).filter((b) => b.left < map.left || b.right > map.right + .5 || b.bottom > map.bottom + .5).length;
  return { vw: innerWidth, docW: document.documentElement.scrollWidth, font: document.fonts.check('900 20px "Barlow Condensed"'), img: getComputedStyle(document.querySelector('#map')).backgroundImage.slice(0, 30), keys, outside };
})()`);

await send('Page.enable'); await send('Runtime.enable');
const out = {};
const LOOKS = [['today', { marks: 'today', keys: 'today', ergo: 'today' }], ['a', { marks: 'a', keys: 'lamp', ergo: 'new' }], ['b', { marks: 'b', keys: 'lamp', ergo: 'new' }], ['c', { marks: 'c', keys: 'lamp', ergo: 'new' }]];
for (const [w, h, dpr, mobile, view] of [[1440, 900, 1, false, 'pc'], [390, 844, 2, true, 'phone']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
  await send('Page.navigate', { url: URL0 });
  for (let i = 0; i < 60; i++) { await sleep(200); if (await js('document.readyState === "complete"')) break; }
  await js('document.fonts.ready.then(() => 1)'); await sleep(600);
  for (const [tag, ds] of LOOKS) {
    await js(`Object.assign(document.documentElement.dataset, ${JSON.stringify({ ...ds, view })}); document.querySelector('#brushwrap').classList.remove('open'); document.querySelectorAll('.seg button')[0].click(); document.documentElement.dataset.view = ${JSON.stringify(view)}; document.querySelector('[data-v="${view}"]').click(); 1`);
    await sleep(500);
    out[`${view}-${tag}`] = await measure();
    await shot(`f-${view}-${tag}.png`, await mapClip());
  }
  /* the brush list open, today vs new */
  for (const [tag, ds] of [LOOKS[0], LOOKS[1]]) {
    await js(`Object.assign(document.documentElement.dataset, ${JSON.stringify({ ...ds, view })}); document.querySelector('[data-v="${view}"]').click(); 1`);
    await js(`document.querySelector('${view === 'phone' && tag !== 'today' ? '.dock' : '.brushwrap'} [data-act="brush"]').click(); 1`);
    await sleep(900);
    out[`${view}-${tag}-brush`] = await measure();
    await shot(`f-${view}-${tag}-brush.png`, await mapClip());
    await js(`document.querySelector('#brushwrap').classList.remove('open'); 1`);
  }
}
/* Lite: every look still draws its marks (the lit lamp, the halo, the edge are shapes, not shadows) */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: URL0 }); await sleep(1500);
await js(`document.documentElement.classList.add('lite'); Object.assign(document.documentElement.dataset, { marks: 'a', keys: 'lamp', ergo: 'new', view: 'pc' }); document.querySelector('[data-v="pc"]').click(); 1`);
await sleep(400);
out.liteAnims = await js(`(() => { document.querySelector('.brushwrap [data-act="brush"]').click(); return document.getAnimations().filter((a) => a.playState === 'running').length; })()`);
await sleep(300);
await shot('f-pc-a-lite.png', await mapClip());
/* ---- the board: still frames + captions (motion lives only in the live page) ---- */
const cap = { today: ['TODAY', 'gold number + gold ring + orange glow on every bubble; emoji pins'], a: ['A · LAMP', 'a secured shop is a LIT lamp; bubble = white number + amber arc of how many are secured'], b: ['B · SURVEY', 'map-maker marks: shop = survey diamond; bubble = a dial, one tick per shop, amber = secured'], c: ['C · TOKEN', 'board-game pieces with a real edge under them; bubble = a small stack + amber arc'] };
const kph = out['phone-a'].keys[0];
const fig = (f, t, d, w) => `<figure style="margin:0;width:${w}px"><img src="${f}" style="width:100%;display:block;border-radius:12px"><figcaption><b>${t}</b> ${d}</figcaption></figure>`;
fs.writeFileSync(path.join(HERE, 'board.html'), '<!doctype html><meta charset=utf-8><link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800;900&display=swap"><style>body{margin:0;padding:28px;background:#0A0908;color:#E8E4DE;font:15px/1.35 system-ui;width:1544px}h1{margin:0 0 6px;font:900 34px/1 "Barlow Condensed";letter-spacing:.08em}h1+p{margin:0 0 20px;color:#A39B90}h2{font:900 22px/1 "Barlow Condensed";letter-spacing:.1em;margin:22px 0 10px;color:#E4B04A}.g{display:flex;flex-wrap:wrap;gap:16px}figcaption{margin-top:6px;color:#A39B90;font-size:14px}figcaption b{color:#E8E4DE;letter-spacing:.06em}</style>'
  + '<h1>JOURNEY PLAN · MAP KEYS + SHOP MARKS</h1><p>Still frames. The motion (keys 1 Lock-on / 2 Icon acts / 3 Lamp) only shows in the live page. A, B, C below use key motion 3 and the new key layout.</p>'
  + '<h2>PC · 1440</h2><div class=g>' + ['today', 'a', 'b', 'c'].map((t) => fig(`f-pc-${t}.png`, cap[t][0], cap[t][1] + (t === 'today' ? '; key names only under the mouse' : ''), 756)).join('') + '</div>'
  + '<h2>PHONE · 390 (full map)</h2><div class=g>' + ['today', 'a', 'b', 'c'].map((t) => fig(`f-phone-${t}.png`, cap[t][0], t === 'today' ? 'keys up top, far from the thumb' : `keys in one bar at the bottom, ${kph.w}×${kph.h} each`, 290)).join('')
  + fig('f-phone-a-brush.png', 'NEW BRUSH LIST', 'rows 44 tall, whole names, no orange slab', 290) + '</div>');
await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(path.join(HERE, 'board.html')).href }); await sleep(1800);
const H = await js('document.documentElement.scrollHeight');
await shot('board.png', { x: 0, y: 0, width: 1600, height: H });
out.errs = errs;
fs.writeFileSync(path.join(HERE, 'measure.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill();
