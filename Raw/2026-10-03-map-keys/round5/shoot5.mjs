/* Round 5 shooter: the 14 x 14 chest with lit signs + the pixel salesman. Frames at 1440 + 390, the status chart at
   3x and 6x (his "even when it is zoomed"), salesman close-ups (walk frames frozen), the motion sampled against the
   chest's rest position BEFORE the tap (lessons.md 2026-10-03), Lite end states, then board.png. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const URL0 = pathToFileURL(path.join(HERE, 'index.html')).href;
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9404',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9404/json/list')).json(); } catch { /* not up */ } }
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
const NEW = { marks: 'chest5', sm: 'player', ergo: 'new' }, OLD = { marks: 'today', sm: 'pin', ergo: 'today' };

await send('Page.enable'); await send('Runtime.enable');
const out = {};
for (const [w, h, dpr, mobile, view] of [[1440, 900, 1, false, 'pc'], [390, 844, 2, true, 'phone']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile }); await load();
  for (const [tag, o] of [['today', OLD], ['new', NEW]]) {
    await setLook({ view, ...o }); await sleep(300);
    out[`${view}-${tag}`] = await js(`(() => { const m = document.querySelector('#map').getBoundingClientRect(); const e = [...document.querySelectorAll('#marks .m, #marks .sm')].map((x) => x.getBoundingClientRect());
      return { docW: document.documentElement.scrollWidth, marks: e.length, outside: e.filter((b) => b.left < m.left || b.right > m.right || b.top < m.top || b.bottom > m.bottom).length,
        tagClipped: [...document.querySelectorAll('.sm .tag')].filter((t) => t.scrollWidth > t.clientWidth + 1).length, pixel: document.fonts.check('10px Silkscreen') }; })()`);
    await shot(`f-${view}-${tag}.png`, await clipOf('#map'));
  }
}

/* rest position before the tap, after the moment, under the mouse */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 3, mobile: false }); await load();
await setLook({ view: 'pc', ...NEW });
const B = () => js(`document.querySelector('[data-p="0"] svg.chest').getBoundingClientRect().bottom`);
const before = await B(); await js('securePin(0); 1'); await sleep(1800); const after = await B();
const pc = await js(`(() => { const b = document.querySelector('[data-p="0"] svg.chest').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; })()`);
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pc[0], y: pc[1] }); await sleep(400); const hov = await B();
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5 });
out.rest = { afterMoment: +(after - before).toFixed(2), underMouse: +(hov - before).toFixed(2) };
/* the moment every 20 ms, against that rest position */
const samples = [];
for (let T = 0; T <= 1400; T += 20) {
  await setLook({ view: 'pc', ...NEW });
  samples.push(await js(`(() => { securePin(0); document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ${T}; });
    const el = document.querySelector('[data-p="0"]'), r = (s) => el.querySelector(s).getBoundingClientRect();
    const op = (s) => +getComputedStyle(el.querySelector(s)).opacity;
    const lid = op('.lidF') > .5 ? r('.lidF').top : op('.lidU') > .5 && r('.lidU').height > .2 ? r('.lidU').top : r('svg.chest').bottom - 24;
    return { T: ${T}, body: +(r('svg.chest').bottom - ${before}).toFixed(2), lid: +lid.toFixed(2), sign: op('.sign5'), lamp: op('.sign5 .lamp') }; })()`));
}
const st = (k) => samples.slice(1).map((s, i) => Math.abs(s[k] - samples[i][k]));
out.smooth = { startOffset: samples[0].body, maxBodyStep: Math.max(...st('body')).toFixed(2), maxLidStep: Math.max(...st('lid')).toFixed(2),
  hopTop: Math.min(...samples.map((s) => s.body)).toFixed(1), signAt: samples.find((s) => s.sign > .05)?.T, lampAt: samples.find((s) => s.lamp > .05)?.T,
  stillAt: samples.findIndex((s, i) => i > 5 && samples.slice(i).every((q) => Math.abs(q.lid - s.lid) < .05 && Math.abs(q.body - s.body) < .05 && Math.abs(q.lamp - s.lamp) < .01)) * 20 };
out.samples = samples;
const TIMES = [0, 120, 260, 400, 560, 760, 1000, 1400];
for (const T of TIMES) {
  await setLook({ view: 'pc', ...NEW });
  await js(`(() => { securePin(0); document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ${T}; }); return 1; })()`);
  const c = await clipOf('[data-p="0"] .ring');
  await shot(`m-${T}.png`, { x: c.x + c.width / 2 - 34, y: c.y + c.height - 66, width: 84, height: 80 });
}
/* one chest per outcome at 3x, then two of them at 6x */
const lineUp = `(() => { const order = ['open', 'sold', 'order', 'routine', 'full', 'issue', 'request', 'closed']; order.forEach((s, k) => { PINS[k].st = s; PINS[k].x = 12 + k * 10; PINS[k].y = 50; }); PINS.length = 8; CL.length = 0; SALESMEN.length = 0; drawMarks(); return 1; })()`;
await setLook({ view: 'pc', ...NEW }); await js(lineUp); await sleep(300);
let m = await clipOf('#map'); await shot('chart.png', { x: m.x + 80, y: m.y + 200, width: 840, height: 84 });
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 6, mobile: false }); await load();
await setLook({ view: 'pc', ...NEW }); await js(lineUp); await sleep(300);
m = await clipOf('#map'); await shot('zoom6.png', { x: m.x + 96, y: m.y + 210, width: 140, height: 66 });
/* the salesman close up (4x): walking frame A, frame B, standing, off, and the head look */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 4, mobile: false }); await load();
await setLook({ view: 'pc', ...NEW }); await js(`(() => { CL.length = 0; PINS.length = 0; SALESMEN[0].x = 30; SALESMEN[1].x = 50; SALESMEN[2].x = 70; SALESMEN.forEach((s) => { s.y = 60; }); drawMarks(); return 1; })()`);
for (const [T, f] of [[0, 'sm-a'], [220, 'sm-b']]) {
  await js(`(() => { document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ${T}; }); return 1; })()`);
  m = await clipOf('#map'); await shot(`${f}.png`, { x: m.x + 220, y: m.y + 220, width: 560, height: 100 });
}
await js(`(() => { document.documentElement.dataset.sm = 'head'; drawMarks(); document.getAnimations().forEach((a) => a.pause()); return 1; })()`);
m = await clipOf('#map'); await shot('sm-head.png', { x: m.x + 220, y: m.y + 220, width: 560, height: 100 });

/* Lite: nothing runs, every end state shows */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }); await load();
await setLook({ view: 'pc', ...NEW });
out.lite = await js(`(() => { document.documentElement.classList.add('lite'); securePin(0); bumpCluster(6); const run = document.getAnimations().filter((a) => a.playState === 'running').length;
  const el = document.querySelector('[data-p="0"]'); return { running: run, lidOpen: getComputedStyle(el.querySelector('.lidU')).opacity, signShown: getComputedStyle(el.querySelector('.sign5')).display, lamp: getComputedStyle(el.querySelector('.sign5 .lamp')).opacity }; })()`);
await shot('f-lite.png', await clipOf('#map'));

/* ---- the board ---- */
const S = out.smooth;
const labels = ['not visited', 'sold today', 'repeat order', 'routine check', 'stock full', 'competitor issue', 'new request', 'store closed'];
fs.writeFileSync(path.join(HERE, 'board.html'), '<!doctype html><meta charset=utf-8><link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800;900&display=swap"><style>body{margin:0;padding:28px;background:#0A0908;color:#E8E4DE;font:15px/1.4 system-ui;width:1544px}h1{margin:0 0 6px;font:900 34px/1 "Barlow Condensed";letter-spacing:.08em}h1+p{margin:0 0 18px;color:#A39B90}h2{font:900 22px/1 "Barlow Condensed";letter-spacing:.1em;margin:22px 0 10px;color:#E4B04A}.g{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start}figure{margin:0}figcaption{margin-top:6px;color:#A39B90;font-size:14px}figcaption b{color:#E8E4DE}.strip{display:flex;gap:8px}.strip img{width:176px;height:168px;border-radius:10px;border:1px solid #3E3A35;display:block}.lab{position:relative;height:22px;width:1500px;color:#A39B90;font-size:14px;margin-top:6px}img{image-rendering:pixelated}</style>'
  + '<h1>JOURNEY PLAN · CHEST v5 + THE SALESMAN</h1><p>Every visited chest opens DARK inside; the light is in the sign. The chest is 14 x 14 pixels now (Minecraft\'s own chest is 14 wide). The pin for the salesman is a pixel person with a name tag.</p>'
  + '<h2>ONE CHEST PER OUTCOME (3x)</h2><img src="chart.png" style="width:1500px;display:block;border-radius:10px"><div class="lab">' + labels.map((t, k) => `<span style="position:absolute;left:${(40 + k * 100) * 1500 / 840 - 80}px;width:160px;text-align:center">${t}</span>`).join('') + '</div>'
  + '<h2>ZOOMED 6x · "still a good 8-bit chest"</h2><img src="zoom6.png" style="width:840px;display:block;border-radius:10px">'
  + `<h2>THE MOMENT · frozen frame by frame</h2><div class="strip">${TIMES.map((T) => `<figure><img src="m-${T}.png"><figcaption>${T} ms</figcaption></figure>`).join('')}</div>`
  + `<p style="color:#A39B90">Measured every 20 ms against where the chest stood BEFORE the tap: start offset ${S.startOffset} px, after the moment ${out.rest.afterMoment} px, under the mouse ${out.rest.underMouse} px. Biggest step ${S.maxBodyStep} px (chest), ${S.maxLidStep} px (lid). Hop ${S.hopTop} px. Sign lands ${S.signAt} ms, sign lights ${S.lampAt} ms, all still by ${S.stillAt} ms.</p>`
  + '<h2>THE SALESMAN (4x) · BS walking (two steps), RS at a shop, CP not out today</h2><div class="g"><figure><img src="sm-a.png" style="width:740px"><figcaption><b>A PLAYER</b> step 1</figcaption></figure><figure><img src="sm-b.png" style="width:740px"><figcaption><b>A PLAYER</b> step 2 - legs swap, body bobs; the amber arrow = the salesman you picked</figcaption></figure><figure><img src="sm-head.png" style="width:740px"><figcaption><b>B HEAD</b> - the head floats over its shadow</figcaption></figure></div>'
  + '<h2>THE MAP · PC 1440, today vs new</h2><div class=g><figure><img src="f-pc-today.png" style="width:750px"><figcaption><b>TODAY</b></figcaption></figure><figure><img src="f-pc-new.png" style="width:750px"><figcaption><b>NEW</b></figcaption></figure></div>'
  + '<h2>PHONE · 390</h2><div class=g><figure><img src="f-phone-today.png" style="width:300px"><figcaption><b>TODAY</b></figcaption></figure><figure><img src="f-phone-new.png" style="width:300px"><figcaption><b>NEW</b></figcaption></figure></div>');
await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(path.join(HERE, 'board.html')).href }); await sleep(1800);
const H = await js('document.documentElement.scrollHeight');
await shot('board.png', { x: 0, y: 0, width: 1600, height: H });
out.errs = errs;
fs.writeFileSync(path.join(HERE, 'measure5.json'), JSON.stringify(out, null, 1));
const { samples: _s, ...brief } = out; console.log(JSON.stringify(brief));
ws.close(); chrome.kill();
