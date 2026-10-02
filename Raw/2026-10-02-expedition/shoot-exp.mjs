/* The expedition map, looks A (squad list) and B (travel card), 2026-10-02. Adapted from the showcase hero shooter.
   (CDP device metrics, touch, dpr 2) and at 1440, still (= the Lite Mode frame), measures each frame for
   sideways scroll and clipped labels, checks the motion actually moves, then composes board-*.html.
   Run: node shoot-hero.mjs  (no server: the page is a file; a lab copy gets the skeleton's meta tags). */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* the publish skeleton adds charset + viewport; the lab copy needs them or it lays out at 980 px */
const lab = path.join(HERE, 'lab.html');
fs.writeFileSync(lab, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>\n'
  + fs.readFileSync(path.join(HERE, 'expedition.html'), 'utf8') + '\n</body></html>');
const URL0 = pathToFileURL(lab).href;

const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9401',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9401/json/list')).json(); } catch { /* not up */ } }
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
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });   /* a stale png must not survive a failed capture */
  const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 }, captureBeyondViewport: true } : {}) });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const go = async (hash) => {
  await send('Page.navigate', { url: URL0 + '#' + hash });
  for (let i = 0; i < 60; i++) { await sleep(200); if (await js('document.readyState === "complete" && !!document.querySelector(".chip")')) break; }
  await js(`location.hash = ${JSON.stringify(hash)}; dispatchEvent(new HashChangeEvent('hashchange')); 1`);
  await js('document.fonts.ready.then(() => 1)'); await sleep(700);
};
const measure = () => js(`(() => {
  const r = (e) => e && (({ left, top, right, bottom }) => [left, top, right, bottom].map(Math.round))(e.getBoundingClientRect());
  const box = document.querySelector('.mapbox').getBoundingClientRect();
  const chips = [...document.querySelectorAll('.chip:not(.off), .target, .base')].filter((t) => getComputedStyle(t).display !== 'none').map((t) => t.getBoundingClientRect());
  const panelKids = [...document.querySelectorAll('.panel *')].map((e) => e.getBoundingClientRect()).filter((b) => b.width);
  return { vw: innerWidth, vh: innerHeight, docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight,
    font: document.fonts.check('900 40px "Barlow Condensed"'), img: document.querySelector('.world img').naturalWidth,
    map: r(document.querySelector('.mapbox')), panel: r(document.querySelector('.panel')),
    panelRight: Math.round(Math.max(...panelKids.map((b) => b.right))), panelBottom: Math.round(Math.max(...panelKids.map((b) => b.bottom))),
    chipsOutsideMap: chips.filter((b) => b.left < box.left || b.right > box.right || b.top < box.top || b.bottom > box.bottom).length, chips: chips.length,
    html: document.documentElement.className };
})()`);

await send('Page.enable'); await send('Runtime.enable');
const out = {};
for (const [w, h, dpr, mobile, tag] of [[390, 844, 2, true, 'p'], [1440, 900, 1, false, 'd']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
  for (const look of ['a', 'b']) {
    await go(look + '-shot');
    out[tag + '-' + look] = await measure(); await shot(tag + '-' + look + '.png');
  }
  /* motion: a sale "arrives" every 3.4 s - a chip must move and the shop count must rise */
  await go('a'); const m1 = await js('[...document.querySelectorAll(".chip")].map((m) => Math.round(m.getBoundingClientRect().x)).join(",") + " | " + document.querySelector(".ph em").textContent');
  await sleep(5200); const m2 = await js('[...document.querySelectorAll(".chip")].map((m) => Math.round(m.getBoundingClientRect().x)).join(",") + " | " + document.querySelector(".ph em").textContent');
  out[tag + '-motion'] = { before: m1, after: m2, html: await js('document.documentElement.className') };
}
/* the boards: plain html laying the frames side by side, one caption each */
for (const b of ['board-phone', 'board-pc']) {
  const f = path.join(HERE, b + '.html'); if (!fs.existsSync(f)) continue;
  await send('Emulation.setDeviceMetricsOverride', { width: 1800, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setTouchEmulationEnabled', { enabled: false, maxTouchPoints: 1 });
  await send('Page.navigate', { url: pathToFileURL(f).href }); await sleep(1500);
  await js('document.fonts.ready.then(() => 1)');
  const [bw, bh] = await js('[document.body.scrollWidth, document.body.scrollHeight]');
  await shot(b + '.png', { x: 0, y: 0, width: bw, height: bh });
  out[b] = [bw, bh];
}
out.errors = errs;
fs.writeFileSync(path.join(HERE, 'measure.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill();
