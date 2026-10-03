/* Round 6 shooter: the crowd on the bubble + the selling scenes A/B/C. Full pages at 1440 and 390 (phone with touch
   media, lessons 2026-10-03), Lite end state with 0 running animations, frozen moments per scene at x3 (clock set with
   getAnimations().currentTime, never a sleep - lessons 2026-09-29), the chest's rest position read BEFORE the replay and
   after it (lessons 2026-10-03), then board6.png. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/* the lab copy = the page inside the publish skeleton (doctype + viewport meta), or a phone lays it out at 980 px */
fs.writeFileSync(path.join(HERE, 'lab.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'
  + fs.readFileSync(path.join(HERE, 'crowd-sell-r6.html'), 'utf8') + '</body></html>');
const URL0 = pathToFileURL(path.join(HERE, 'lab.html')).href;
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9406',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9406/json/list')).json(); } catch { /* not up */ } }
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
const full = async (file) => { const h = await js('document.documentElement.scrollHeight'); const w = await js('innerWidth'); await shot(file, { x: 0, y: 0, width: w, height: h }); };
const clipOf = (sel, pad = 0) => js(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: b.left + scrollX - ${pad}, y: b.top + scrollY - ${pad}, width: b.width + ${pad * 2}, height: b.height + ${pad * 2} }; })()`);
const load = async () => { await send('Page.navigate', { url: URL0 }); for (let i = 0; i < 60; i++) { await sleep(200); if (await js('document.readyState === "complete"')) break; } await js('document.fonts.ready.then(() => 1)'); await sleep(2900); };
const rect = (sel) => js(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map((v) => +v.toFixed(2)); })()`);

await send('Page.enable'); await send('Runtime.enable');
const out = { errs };

/* ---- PC ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await load();
await full('f-pc.png');
out.pcOverflow = await js('document.documentElement.scrollWidth - innerWidth');
/* end pictures: who must not touch the chest in A and B (the whole point), C stands behind it on purpose */
for (const v of ['T', 'A', 'B', 'C']) {
  const who = await rect(`.s${v} .who .body`), chest = await rect(`.s${v} .c5 .hop`);
  out['end' + v] = { who, chest, gapPx: +(chest[0] - who[2]).toFixed(2) };
}
/* replay: chest rest BEFORE, then after the fill ends - must be identical */
for (const v of ['A', 'B', 'C']) {
  const before = await rect(`.s${v} .c5 .hop`), whoBefore = await rect(`.s${v} .who`);
  await js(`(() => { const el = document.querySelector('.s${v}'); el.classList.remove('play'); void el.offsetWidth; el.classList.add('play'); return 1; })()`);
  await sleep(2400);
  out['rest' + v] = { chestMoved: (await rect(`.s${v} .c5 .hop`)).map((n, i) => +(n - before[i]).toFixed(2)), whoMoved: (await rect(`.s${v} .who`)).map((n, i) => +(n - whoBefore[i]).toFixed(2)) };
}

/* frozen moments at x3 */
await js(`document.documentElement.dataset.size = '3'`); await sleep(300);
const T = [0, 200, 450, 700, 950, 1200, 1800];
for (const v of ['A', 'B', 'C']) {
  for (const t of T) {
    await js(`(() => { const el = document.querySelector('.s${v}'); el.classList.remove('play'); void el.offsetWidth; el.classList.add('play');
      el.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = ${t}; }); return 1; })()`);
    await sleep(60);
    if (v === 'A') {   /* the box: its visible bottom must never pass the chest's front edge (row 8 of the chest = 16 px of 34 at x1) */
      const r = await js(`(() => { const s = 3, cy = document.querySelector('.sA .cy'), b = cy.getBoundingClientRect(), c = document.querySelector('.sA .c5 .hop').getBoundingClientRect();
        const m = /inset\\(0px 0px ([\\d.]+)px/.exec(getComputedStyle(cy).clipPath); const cut = m ? +m[1] * s : 0;
        return { op: +getComputedStyle(cy).opacity, visBottomBelowRim: +((b.bottom - cut) - (c.top + 16 * s)).toFixed(1), boxTop: +(b.top - c.top).toFixed(1) }; })()`);
      (out.crate ||= {})[t] = r;
    }
    await shot(`m-${v}-${t}.png`, await clipOf(`.card:has(.s${v}) .tile`));
  }
}
await js(`document.documentElement.dataset.size = '1'`);

/* Lite: end pictures, nothing running */
await load();
await js(`document.documentElement.classList.add('lite')`); await js(`document.querySelectorAll('.scene').forEach((el) => { el.classList.remove('play'); void el.offsetWidth; el.classList.add('play'); }); 1`);
await sleep(300);
out.liteRunning = await js(`document.getAnimations().filter((a) => a.playState === 'running').length`);
await shot('f-pc-lite.png', await clipOf('#scenes', 4));

/* ---- phone ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
await load();
out.phoneHoverNone = await js(`matchMedia('(hover: none)').matches`);
out.phoneOverflow = await js('document.documentElement.scrollWidth - innerWidth');
out.phoneGroundCols = await js(`getComputedStyle(document.getElementById('ground')).gridTemplateColumns`);
await full('f-phone.png');

/* ---- the board ---- */
const strip = (v, name) => `<h2>${v} · ${name}</h2><div class="strip">${T.map((t) => `<figure><img src="m-${v}-${t}.png"><figcaption>${(t / 1000).toFixed(2)} s</figcaption></figure>`).join('')}</div>`;
fs.writeFileSync(path.join(HERE, 'board6.html'), '<!doctype html><meta charset=utf-8><link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800;900&display=swap"><style>body{margin:0;padding:28px;background:#0A0908;color:#E8E4DE;font:15px/1.4 system-ui;width:1560px}h1{margin:0 0 6px;font:900 34px/1 "Barlow Condensed";letter-spacing:.06em}h1+p{margin:0 0 10px;color:#A39B90}h2{font:900 24px/1 "Barlow Condensed";letter-spacing:.08em;margin:22px 0 10px;color:#E4B04A}.strip{display:flex;gap:8px}figure{margin:0}figure img{width:212px;height:auto;border-radius:10px;border:1px solid #3E3A35;display:block}figcaption{margin-top:4px;color:#A39B90;font-size:14px}</style>'
  + '<h1>Selling scene · frozen moments, zoomed x3</h1><p>The man and the shop\'s chest as ONE picture. Each row ends on the picture the map shows when opened later.</p>'
  + strip('A', 'Restock') + strip('B', 'Paid') + strip('C', 'Stall'));
await send('Emulation.setDeviceMetricsOverride', { width: 1616, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(path.join(HERE, 'board6.html')).href }); await sleep(1800);
await full('board6.png');

fs.writeFileSync(path.join(HERE, 'measure6.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); await sleep(1500);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* Chrome still closing */ }
