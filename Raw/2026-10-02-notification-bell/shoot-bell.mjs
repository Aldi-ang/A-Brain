/* The two-part bell, drawn for his pick (2026-10-02). Shoots today's bell and proposals A / B in the
   REAL app shell through the ponder lab (tools/lab-bell.jsx, `?shell&bell=…`) at a real 390 phone
   (CDP device metrics, touch) and at 1440, measures each open panel, then composes the two boards
   from board-*.html next to this file. Needs the lab up on :4190 (preview "ponder-lab"). */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell&bell';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9398',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9398/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 160));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); return r.result?.result?.value; };
const shot = async (file, clip) => {
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });   /* a stale png must not survive a failed capture */
  const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 }, captureBeyondViewport: true } : {}) });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const go = async (url) => {
  await send('Page.navigate', { url });
  for (let i = 0; i < 60; i++) { await sleep(250); if (await js('!!document.querySelector(".kpm-bell") && document.readyState === "complete"')) break; }
  await js('document.fonts.ready.then(() => 1)'); await sleep(900);
};
const measure = () => js(`(() => {
  const r = (e) => e && (({ left, top, width, height }) => [left, top, width, height].map(Math.round))(e.getBoundingClientRect());
  const panel = document.querySelector('[data-lab-panel]') || [...document.body.children].find((c) => c.style.position === 'fixed' && c.querySelector('h3'));
  const missed = document.querySelector('[data-lab-missed]');
  return { vw: innerWidth, vh: innerHeight, docW: document.documentElement.scrollWidth, bell: r(document.querySelector('.kpm-bell')),
    panel: r(panel), missedHeadTop: missed ? Math.round(missed.getBoundingClientRect().top) : null,
    small: [...(panel?.querySelectorAll('button') || [])].map((b) => [b.textContent.trim().slice(0, 14), Math.round(b.getBoundingClientRect().height)]) };
})()`);

await send('Page.enable'); await send('Runtime.enable');
const out = {};
for (const [w, h, dpr, mobile, tag] of [[390, 844, 2, true, 'p'], [1440, 900, 1, false, 'd']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
  await go(LAB); await js('document.querySelector(".kpm-bell").click()'); await sleep(500);
  out[tag + '-today'] = await measure(); await shot(tag + '-today.png');
  const frames = tag === 'p' ? [['a', '&open'], ['a-missed', '&open&side=missed'], ['b', '&open']] : [['a', '&open'], ['b', '&open']];
  for (const [name, extra] of frames) {
    await go(LAB + '=' + name.slice(0, 1) + extra);
    out[tag + '-' + name] = await measure(); await shot(tag + '-' + name + '.png');
  }
}
/* the boards: plain html that lays the frames side by side with one caption each */
for (const b of ['board-phone', 'board-pc']) {
  const f = path.join(HERE, b + '.html'); if (!fs.existsSync(f)) continue;
  await send('Emulation.setDeviceMetricsOverride', { width: 1800, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: pathToFileURL(f).href }); await sleep(1200);
  const [bw, bh] = await js('[document.body.scrollWidth, document.body.scrollHeight]');
  await shot(b + '.png', { x: 0, y: 0, width: bw, height: bh });
  out[b] = [bw, bh];
}
out.errors = errs;
fs.writeFileSync(path.join(HERE, 'measure.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill();
