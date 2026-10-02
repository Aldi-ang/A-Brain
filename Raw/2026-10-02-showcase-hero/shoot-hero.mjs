/* The customer showcase's hero, three looks (2026-10-02). Shoots hero-options.html at a real 390 phone
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
  + fs.readFileSync(path.join(HERE, 'hero-options.html'), 'utf8') + '\n</body></html>');
const URL0 = pathToFileURL(lab).href;

const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9399',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9399/json/list')).json(); } catch { /* not up */ } }
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
  for (let i = 0; i < 60; i++) { await sleep(200); if (await js('document.readyState === "complete" && !!document.querySelector(".plate")')) break; }
  await js(`location.hash = ${JSON.stringify(hash)}; dispatchEvent(new HashChangeEvent('hashchange')); 1`);
  await js('document.fonts.ready.then(() => 1)'); await sleep(700);
};
const measure = () => js(`(() => {
  const r = (e) => e && (({ left, top, right, bottom }) => [left, top, right, bottom].map(Math.round))(e.getBoundingClientRect());
  const tags = [...document.querySelectorAll('.tag, .man b, .num')].map((t) => t.getBoundingClientRect());
  return { vw: innerWidth, vh: innerHeight, docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight,
    font: document.fonts.check('900 40px "Barlow Condensed"'),
    copy: r(document.querySelector('.copy')), stage: r(document.querySelector('.stage')), dock: r(document.querySelector('.dock')),
    plates: [...document.querySelectorAll('.plate')].map(r),
    tagsOut: tags.filter((b) => b.left < 0 || b.right > innerWidth || b.top < 0).length, tags: tags.length,
    h1: r(document.querySelector('h1')), html: document.documentElement.className };
})()`);

await send('Page.enable'); await send('Runtime.enable');
const out = {};
for (const [w, h, dpr, mobile, tag] of [[390, 844, 2, true, 'p'], [1440, 900, 1, false, 'd']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
  for (const look of ['a', 'b', 'c']) {
    await go(look + '-shot');
    out[tag + '-' + look] = await measure(); await shot(tag + '-' + look + '.png');
  }
  /* motion: the same look moving; a salesman must travel and (B) the counter must change */
  await go('a'); const m1 = await js('[...document.querySelectorAll(".man")].map((m) => m.getBoundingClientRect().x)');
  await sleep(1500); const m2 = await js('[...document.querySelectorAll(".man")].map((m) => m.getBoundingClientRect().x)');
  out[tag + '-motionA'] = { moved: m1.map((x, i) => Math.round(Math.abs(m2[i] - x))), html: await js('document.documentElement.className') };
  await go('b'); const n1 = await js('document.querySelector("#hitN").textContent'); await sleep(4500);
  out[tag + '-motionB'] = { hitsBefore: n1, hitsAfter: await js('document.querySelector("#hitN").textContent') };
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
