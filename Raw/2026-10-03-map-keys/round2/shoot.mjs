/* Round 2 shooter: the shop-mark looks (today, banner, chest, beacon) at 1440 (PC) and 390 (phone, dpr 2), the
   SECURE MOMENT of one shop frame by frame (clock frozen with getAnimations, not a sleep), Lite end states, then
   board.html -> board.png. Adapted from A-Brain Raw/2026-10-02-expedition/shoot-exp.mjs. */
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
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push(r.result.exceptionDetails.exception?.description?.slice(0, 200)); return r.result?.result?.value; };
const shot = async (file, clip) => {
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });
  const s = await send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 }, captureBeyondViewport: true });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const clipOf = (sel, pad = 0) => js(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: b.left + scrollX - ${pad}, y: b.top + scrollY - ${pad}, width: b.width + ${2 * pad}, height: b.height + ${2 * pad} }; })()`);
const setLook = (o) => js(`(() => { Object.assign(document.documentElement.dataset, ${JSON.stringify(o)}); PINS = PINS0.map((p) => ({ ...p })); CL = CL0.map((c) => ({ ...c })); sync(); return 1; })()`);
const measure = () => js(`(() => {
  const map = document.querySelector('#map').getBoundingClientRect();
  const marks = [...document.querySelectorAll('#marks .m')].map((e) => e.getBoundingClientRect());
  const tooSmall = [...document.querySelectorAll('#marks [data-p]')].map((e) => e.getBoundingClientRect()).filter((b) => b.width < 20 || b.height < 20).length;
  return { vw: innerWidth, docW: document.documentElement.scrollWidth, pixel: document.fonts.check('700 15px Silkscreen'), marks: marks.length,
    outside: marks.filter((b) => b.left < map.left || b.right > map.right || b.top < map.top || b.bottom > map.bottom).length, tooSmall };
})()`);

await send('Page.enable'); await send('Runtime.enable');
const out = {};
const LOOKS = ['today', 'banner', 'chest', 'beacon'];
for (const [w, h, dpr, mobile, view] of [[1440, 900, 1, false, 'pc'], [390, 844, 2, true, 'phone']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
  await send('Page.navigate', { url: URL0 });
  for (let i = 0; i < 60; i++) { await sleep(200); if (await js('document.readyState === "complete"')) break; }
  await js('document.fonts.ready.then(() => 1)'); await sleep(600);
  for (const look of LOOKS) {
    await setLook({ view, marks: look, ergo: look === 'today' ? 'today' : 'new' }); await sleep(400);
    out[`${view}-${look}`] = await measure();
    await shot(`f-${view}-${look}.png`, await clipOf('#map'));
  }
}

/* the secure moment, frame by frame: shop 0 (open) is secured and the clock is frozen at each time */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 3, mobile: false });
await send('Page.navigate', { url: URL0 }); await sleep(1500); await js('document.fonts.ready.then(() => 1)');
const TIMES = [0, 100, 220, 380, 600, 1400];
for (const look of ['banner', 'chest', 'beacon']) {
  for (const T of TIMES) {
    await setLook({ view: 'pc', marks: look, ergo: 'new' }); await sleep(150);
    const n = await js(`(() => { securePin(0); const a = document.getAnimations(); a.forEach((x) => { x.pause(); x.currentTime = ${T}; }); return a.length; })()`);
    out[`moment-${look}-${T}`] = n;
    const c = await clipOf('[data-p="0"]');
    await shot(`m-${look}-${T}.png`, { x: c.x + c.width / 2 - 38, y: c.y + c.height - 64, width: 76, height: 76 });
  }
  /* a bubble going full: cluster 1 (5 shops, 2 secured) tapped three times, frozen mid-shine */
  await setLook({ view: 'pc', marks: look, ergo: 'new' }); await sleep(150);
  await js(`(() => { bumpCluster(1); bumpCluster(1); bumpCluster(1); document.getAnimations().forEach((x) => { x.pause(); x.currentTime = 450; }); return 1; })()`);
  await shot(`m-${look}-cluster.png`, await clipOf('[data-c="1"]', 22));
}

/* Lite: end states only, nothing running */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: URL0 }); await sleep(1500);
for (const look of ['banner', 'chest', 'beacon']) {
  await setLook({ view: 'pc', marks: look, ergo: 'new' });
  out[`lite-${look}`] = await js(`(() => { document.documentElement.classList.add('lite'); securePin(0); bumpCluster(6); return document.getAnimations().filter((a) => a.playState === 'running').length; })()`);
  await sleep(200);
  await shot(`f-lite-${look}.png`, await clipOf('#map'));
  await js(`document.documentElement.classList.remove('lite'); 1`);
}

/* ---- the board ---- */
const cap = { today: ['TODAY', 'gold number, gold ring and an orange glow on every bubble; emoji pins'], banner: ['1 · BANNER', 'rolled up = not visited; secured = it unrolls in the salesman\'s colour'], chest: ['2 · CHEST', 'closed = not visited; secured = the lid pops open, light inside'], beacon: ['3 · BEACON', 'dark hex = not visited; secured = it switches on, light pillar'] };
const fig = (f, t, d, w) => `<figure style="margin:0;width:${w}px"><img src="${f}" style="width:100%;display:block;border-radius:12px;image-rendering:auto"><figcaption><b>${t}</b> ${d}</figcaption></figure>`;
const strip = (look) => `<div class="strip"><b>${cap[look][0]}</b>` + TIMES.map((T) => `<figure><img src="m-${look}-${T}.png"><figcaption>${T} ms</figcaption></figure>`).join('') + `<figure class="cl"><img src="m-${look}-cluster.png"><figcaption>bubble goes full</figcaption></figure></div>`;
fs.writeFileSync(path.join(HERE, 'board.html'), '<!doctype html><meta charset=utf-8><link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800;900&display=swap"><style>body{margin:0;padding:28px;background:#0A0908;color:#E8E4DE;font:15px/1.35 system-ui;width:1544px}h1{margin:0 0 6px;font:900 34px/1 "Barlow Condensed";letter-spacing:.08em}h1+p{margin:0 0 18px;color:#A39B90}h2{font:900 22px/1 "Barlow Condensed";letter-spacing:.1em;margin:22px 0 10px;color:#E4B04A}.g{display:flex;flex-wrap:wrap;gap:16px}figcaption{margin-top:6px;color:#A39B90;font-size:14px}figcaption b{color:#E8E4DE;letter-spacing:.06em}.strip{display:flex;align-items:flex-end;gap:10px;margin-bottom:12px}.strip>b{width:120px;font:900 20px/1 "Barlow Condensed";letter-spacing:.08em}.strip figure{margin:0;text-align:center}.strip img{width:136px;height:136px;display:block;border-radius:10px;border:1px solid #3E3A35}.strip .cl img{width:auto;height:136px}</style>'
  + '<h1>JOURNEY PLAN · SHOP MARKS, ROUND 2</h1><p>Keys = your pick (the icon acts). Each look has a SECURE MOMENT - it plays when a shop is secured while the map is open. Feel it in the live page; below it is frozen, frame by frame.</p>'
  + '<h2>THE SECURE MOMENT · one shop, frame by frame</h2>' + ['banner', 'chest', 'beacon'].map(strip).join('')
  + '<h2>PC · 1440</h2><div class=g>' + LOOKS.map((t) => fig(`f-pc-${t}.png`, cap[t][0], cap[t][1], 756)).join('') + '</div>'
  + '<h2>PHONE · 390 (full map)</h2><div class=g>' + LOOKS.map((t) => fig(`f-phone-${t}.png`, cap[t][0], cap[t][1], 290)).join('') + '</div>');
await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(path.join(HERE, 'board.html')).href }); await sleep(1800);
const H = await js('document.documentElement.scrollHeight');
await shot('board.png', { x: 0, y: 0, width: 1600, height: H });
out.errs = errs;
fs.writeFileSync(path.join(HERE, 'measure.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill();
