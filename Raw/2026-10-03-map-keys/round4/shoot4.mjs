/* Round 4 shooter (the chest with signs). Frames at 1440 + 390, the secure moment frozen frame by frame, a
   SMOOTHNESS sample (the chest and lid position every 20 ms with the clock frozen: a jump cut shows as one big
   step), Lite end states, then board.html -> board.png. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const URL0 = pathToFileURL(path.join(HERE, 'index.html')).href;
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9403',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9403/json/list')).json(); } catch { /* not up */ } }
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
const load = async () => { await send('Page.navigate', { url: URL0 }); for (let i = 0; i < 60; i++) { await sleep(200); if (await js('document.readyState === "complete"')) break; } await js('document.fonts.ready.then(() => 1)'); await sleep(500); };

await send('Page.enable'); await send('Runtime.enable');
const out = {};
for (const [w, h, dpr, mobile, view] of [[1440, 900, 1, false, 'pc'], [390, 844, 2, true, 'phone']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile }); await load();
  for (const look of ['today', 'chest3']) {
    await setLook({ view, marks: look, ergo: look === 'today' ? 'today' : 'new', glow: 'sale' }); await sleep(300);
    out[`${view}-${look}`] = await js(`(() => { const m = document.querySelector('#map').getBoundingClientRect(); const e = [...document.querySelectorAll('#marks .m')].map((x) => x.getBoundingClientRect());
      return { docW: document.documentElement.scrollWidth, marks: e.length, outside: e.filter((b) => b.left < m.left || b.right > m.right || b.top < m.top || b.bottom > m.bottom).length, small: [...document.querySelectorAll('#marks [data-p]')].filter((x) => x.getBoundingClientRect().width < 20).length }; })()`);
    await shot(`f-${view}-${look}.png`, await clipOf('#map'));
  }
}

/* smoothness: shop 0 goes open -> sold; every 20 ms, with every animation frozen at that time, read where the chest
   body, the lid and the sign actually are on screen */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 3, mobile: false }); await load();
/* where the chest stands BEFORE the tap, after the whole moment (animations finished, fill still on), and under the
   mouse - a moment that moves the chest's resting place is a bug even if every step of it is small */
await setLook({ view: 'pc', marks: 'chest3', ergo: 'new', glow: 'sale' });
const before = await js(`document.querySelector('[data-p="0"] svg.chest').getBoundingClientRect().bottom`);
await js(`securePin(0); 1`); await sleep(1500);
const after = await js(`document.querySelector('[data-p="0"] svg.chest').getBoundingClientRect().bottom`);
const pc = await js(`(() => { const b = document.querySelector('[data-p="0"]').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; })()`);
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pc[0], y: pc[1] }); await sleep(400);
const hovered = await js(`document.querySelector('[data-p="0"] svg.chest').getBoundingClientRect().bottom`);
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5 });
out.rest = { before: +before.toFixed(2), afterMoment: +(after - before).toFixed(2), underMouse: +(hovered - before).toFixed(2) };
const samples = [];
for (let T = 0; T <= 1000; T += 20) {
  await setLook({ view: 'pc', marks: 'chest3', ergo: 'new', glow: 'sale' });
  samples.push(await js(`(() => { securePin(0); document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ${T}; });
    const el = document.querySelector('[data-p="0"]'), r = (s) => el.querySelector(s).getBoundingClientRect();
    const sign = el.querySelector('.sign'), fOp = +getComputedStyle(el.querySelector('.lidF')).opacity, uOp = +getComputedStyle(el.querySelector('.lidU')).opacity;
    const lidTop = fOp > .5 ? r('.lidF').top : uOp > .5 && r('.lidU').height > .2 ? r('.lidU').top : r('svg.chest').bottom - 10;   /* edge-on: the hinge line */
    return { T: ${T}, body: +r('svg.chest').bottom.toFixed(2), lid: +lidTop.toFixed(2), front: fOp, under: +r('.lidU').height.toFixed(2), sign: +r('.sign').top.toFixed(2), signOp: +getComputedStyle(sign).opacity }; })()`));
}
const steps = (k) => samples.slice(1).map((s, i) => Math.abs(s[k] - samples[i][k]));
out.smooth = { maxBodyStep: Math.max(...steps('body')).toFixed(2), maxLidStep: Math.max(...steps('lid')).toFixed(2),
  lidStartsAt: samples.find((s, i) => i && Math.abs(s.lid - samples[i - 1].lid) > .3 && s.T > 150)?.T,
  hopTopAt: samples.reduce((a, s) => (s.body < a.body ? s : a)).T, hopHeight: (samples[0].body - Math.min(...samples.map((s) => s.body))).toFixed(1),
  signVisibleAt: samples.find((s) => s.signOp > .05)?.T, restAt: samples.findIndex((s, i) => i > 5 && samples.slice(i).every((q) => Math.abs(q.lid - s.lid) < .05 && Math.abs(q.body - s.body) < .05)) * 20 };
out.samples = samples;
/* frames of the moment */
const TIMES = [0, 100, 260, 380, 520, 680, 1000];
for (const T of TIMES) {
  await setLook({ view: 'pc', marks: 'chest3', ergo: 'new', glow: 'sale' });
  await js(`(() => { securePin(0); document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ${T}; }); return 1; })()`);
  const c = await clipOf('[data-p="0"] .ring');
  await shot(`m-${T}.png`, { x: c.x + c.width / 2 - 40, y: c.y + c.height - 72, width: 80, height: 80 });
}
/* one chest per outcome, side by side, 3x */
await setLook({ view: 'pc', marks: 'chest3', ergo: 'new', glow: 'sale' });
await js(`(() => { const order = ['open', 'sold', 'order', 'routine', 'full', 'issue', 'request', 'closed']; order.forEach((st, k) => { PINS[k].st = st; PINS[k].x = 14 + k * 9.5; PINS[k].y = 50; }); PINS.length = 8; CL.length = 0; drawMarks(); document.querySelectorAll('.chip').forEach((c) => c.remove()); return 1; })()`);
await sleep(300);
const m = await clipOf('#map'); await shot('chart.png', { x: m.x + 90, y: m.y + 205, width: 800, height: 80 });

/* Lite: end states only */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }); await load();
await setLook({ view: 'pc', marks: 'chest3', ergo: 'new', glow: 'sale' });
out.lite = await js(`(() => { document.documentElement.classList.add('lite'); securePin(0); securePin(3); bumpCluster(6); return document.getAnimations().filter((a) => a.playState === 'running').length; })()`);
out.liteLidOpen = await js(`getComputedStyle(document.querySelector('[data-p="0"] .lidU')).opacity`);
await shot('f-lite.png', await clipOf('#map'));
const rc = { x: (await clipOf('#map')).x + 150, y: (await clipOf('#map')).y + 110, width: 370, height: 280 };
await js(`document.documentElement.classList.remove('lite'); setLook0 = 1`).catch(() => 0);
await setLook({ view: 'pc', marks: 'chest3', ergo: 'new', glow: 'sale' }); await sleep(300);
await shot('rs.png', rc);

/* ---- the board ---- */
const S = out.smooth;
fs.writeFileSync(path.join(HERE, 'board.html'), '<!doctype html><meta charset=utf-8><link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800;900&display=swap"><style>body{margin:0;padding:28px;background:#0A0908;color:#E8E4DE;font:15px/1.4 system-ui;width:1544px}h1{margin:0 0 6px;font:900 34px/1 "Barlow Condensed";letter-spacing:.08em}h1+p{margin:0 0 18px;color:#A39B90}h2{font:900 22px/1 "Barlow Condensed";letter-spacing:.1em;margin:22px 0 10px;color:#E4B04A}.g{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start}figure{margin:0}figcaption{margin-top:6px;color:#A39B90;font-size:14px}figcaption b{color:#E8E4DE}.strip{display:flex;gap:10px}.strip img{width:150px;height:150px;border-radius:10px;border:1px solid #3E3A35;display:block}.lab{position:relative;height:22px;width:1500px;color:#A39B90;font-size:14px;margin-top:6px}</style>'
  + '<h1>JOURNEY PLAN · THE CHEST WITH SIGNS</h1><p>A visited shop gets a sign beside its chest saying what happened. Light comes out only where money came in. The lid swings on its hinge (the front tilts away, the inside face comes up) and the hop moves like gravity.</p>'
  + '<h2>ONE CHEST PER OUTCOME (3x zoom)</h2><img src="chart.png" style="width:1500px;display:block;border-radius:10px;image-rendering:pixelated"><div class="lab">' + ['not visited', 'sold today', 'repeat order', 'routine check', 'stock full (no order)', 'competitor issue', 'new request', 'store closed'].map((t, k) => `<span style="position:absolute;left:${94 + k * 178 - 80}px;width:160px;text-align:center">${t}</span>`).join('') + '</div>'
  + `<h2>THE SECURE MOMENT · frozen frame by frame</h2><div class="strip">${TIMES.map((T) => `<figure><img src="m-${T}.png"><figcaption>${T} ms</figcaption></figure>`).join('')}</div>`
  + `<p style="color:#A39B90">Measured every 20 ms: biggest move of the chest in one step ${S.maxBodyStep} px, of the lid ${S.maxLidStep} px (no jump: a picture swap would move 6 px at once). Hop ${S.hopHeight} px high, top at ${S.hopTopAt} ms; lid starts at ${S.lidStartsAt} ms; sign appears at ${S.signVisibleAt} ms; everything still by ${S.restAt} ms.</p>`
  + '<h2>REAL SIZE · PC 1440</h2><div class=g><figure><img src="rs.png" style="width:555px"><figcaption>no zoom</figcaption></figure><figure><img src="f-pc-chest3.png" style="width:900px"><figcaption><b>CHEST</b> the whole map</figcaption></figure></div>'
  + '<h2>PHONE · 390</h2><div class=g><figure><img src="f-phone-today.png" style="width:300px"><figcaption><b>TODAY</b></figcaption></figure><figure><img src="f-phone-chest3.png" style="width:300px"><figcaption><b>CHEST</b></figcaption></figure></div>');
await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(path.join(HERE, 'board.html')).href }); await sleep(1800);
const H = await js('document.documentElement.scrollHeight');
await shot('board.png', { x: 0, y: 0, width: 1600, height: H });
out.errs = errs;
fs.writeFileSync(path.join(HERE, 'measure4.json'), JSON.stringify(out, null, 1));
const { samples: _s, ...brief } = out; console.log(JSON.stringify(brief));
ws.close(); chrome.kill();
