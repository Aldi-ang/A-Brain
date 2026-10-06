/* 2026-10-06 - proves the customer presentation (showcase.html) scene by scene, at a real 390 phone (CDP metrics, touch,
   dpr 2) and at 1440, in the still frame (= Lite). Per scene: every element's right/left edge against the screen (a page
   whose scenes clip hides a 107 px overflow from scrollWidth - the note's "Found while drawing"), text that spills out of
   its own box, the smallest visible text, small tap targets; then a frame of the scene. Map pieces inside .rig (the 3D
   table, bigger than the phone on purpose and clipped by the scene) are left out of the edge check; its flat tags are in.
   Output: results-showcase.json, frames sc-p-NN.png / sc-d-NN.png (each deleted before it is shot).
   Usage: node shoot-showcase.mjs [still|moving]  (default still) */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MODE = process.argv[2] === 'moving' ? 'moving' : 'still';
/* the publish skeleton adds charset + viewport; the lab copy needs them or it lays out at 980 px */
const lab = path.join(HERE, 'lab-showcase.html');
fs.writeFileSync(lab, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>\n'
  + fs.readFileSync(path.join(HERE, 'showcase.html'), 'utf8') + '\n</body></html>');
const URL0 = pathToFileURL(lab).href + (MODE === 'still' ? '#shot' : '');   /* #shot = the still frame without the fixed bar, which a clipped capture draws over a scene's first line */
const prof = path.join(HERE, 'profile-sc'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9398',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9398/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 200));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 200)); return r.result?.result?.value; };
const shot = async (file, clip) => {
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });
  const s = await send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 }, captureBeyondViewport: true });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const MEASURE = (id) => `(() => {
  const sc = document.getElementById(${JSON.stringify(id)}), vw = document.documentElement.clientWidth;
  const vis = (e) => { const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  const name = (e) => (e.id ? '#' + e.id : e.tagName.toLowerCase() + (e.classList.length ? '.' + [...e.classList].join('.') : '')) + ' "' + (e.textContent || '').trim().slice(0, 24) + '"';
  const all = [...sc.querySelectorAll('*')].filter((e) => !e.closest('.rig') && !e.closest('details:not([open]) .pop') && vis(e));
  const out = [], spill = [], small = [], taps = [];
  let minFont = 99;
  for (const e of all) {
    const b = e.getBoundingClientRect();
    if (!b.width || !b.height) continue;
    if (b.right > vw + 0.5 || b.left < -0.5) out.push(name(e) + ' L' + Math.round(b.left) + ' R' + Math.round(b.right));
    const cs = getComputedStyle(e);
    if (cs.overflow === 'visible' && e.children.length === 0 && e.scrollWidth > e.clientWidth + 1 && cs.display !== 'inline') spill.push(name(e) + ' ' + e.scrollWidth + '>' + e.clientWidth);
    if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) { const fz = parseFloat(cs.fontSize); if (fz < minFont) minFont = fz; if (fz < 12) small.push(name(e) + ' ' + fz + 'px'); }
    if (e.matches('button, summary, [role=button]') && (b.height < 30 || b.width < 30)) taps.push(name(e) + ' ' + Math.round(b.width) + 'x' + Math.round(b.height));
  }
  /* things drawn ON each other (his 2026-10-06 shots at 1920: the tilted map over the leaderboard, a cube over its label) */
  const clash = [], R = (e) => e.getBoundingClientRect();
  const plate = sc.querySelector('.s3 .plate, #omzet .plate'), lb = sc.querySelector('#lb');
  if (plate && lb && R(plate).bottom > R(lb).top + 1) clash.push('map over leaderboard by ' + Math.round(R(plate).bottom - R(lb).top) + ' px');
  sc.querySelectorAll('.pk').forEach((p) => { const lab = p.nextElementSibling; if (lab && R(p).bottom + 4 > R(lab).top + 1) clash.push('box over its label by ' + Math.round(R(p).bottom + 4 - R(lab).top) + ' px'); });
  const cp = sc.querySelector('.copy'), vs = sc.querySelector('.vis, .stage');
  if (vw >= 1024 && cp && vs && R(cp).right > R(vs).left + 1 && !sc.classList.contains('s10')) clash.push('words over the picture');
  const r = sc.getBoundingClientRect();
  return { id: ${JSON.stringify(id)}, h: Math.round(r.height), vw, clash, out: out.slice(0, 12), outN: out.length, spill: spill.slice(0, 8), minFont, small: small.slice(0, 8), smallN: small.length, taps: taps.slice(0, 6),
    font: document.fonts.check('700 40px "Rajdhani"'), docW: document.documentElement.scrollWidth };
})()`;

await send('Page.enable'); await send('Runtime.enable');
const results = [];
const SIZES = { 390: [390, 844, 2, true, 'p'], 1440: [1440, 900, 1, false, 'd'], 1920: [1920, 1080, 1, false, 'w'] };
for (const [w, h, dpr, mobile, tag] of (process.argv[3] || '390,1440,1920').split(',').map((x) => SIZES[x])) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
  await send('Page.navigate', { url: URL0 });
  for (let i = 0; i < 60; i++) { await sleep(200); if (await js('document.readyState === "complete" && !!document.querySelector(".plate")')) break; }
  await js('document.fonts.ready.then(() => 1)'); await sleep(900);
  const ids = await js(`[...document.querySelectorAll('.scene')].map((s) => s.id)`);
  for (const [n, id] of ids.entries()) {
    await js(`document.getElementById(${JSON.stringify(id)}).scrollIntoView({ block: 'start' }); 1`); await sleep(MODE === 'still' ? 500 : 2500);
    const m = await js(MEASURE(id)); m.w = w; results.push(m);
    const top = await js(`document.getElementById(${JSON.stringify(id)}).getBoundingClientRect().top + scrollY`);
    await shot(`sc-${tag}-${String(n + 1).padStart(2, '0')}.png`, { x: 0, y: Math.round(top), width: w, height: Math.min(m.h, mobile ? 1800 : 1100) });
    console.log(w, String(n + 1).padStart(2, '0'), id, 'clash', JSON.stringify(m.clash), 'out', m.outN, 'spill', m.spill.length, 'min', m.minFont, 'small', m.smallN, 'taps', m.taps.length, m.font ? '' : 'NO-FONT');
  }
}
fs.writeFileSync(path.join(HERE, 'results-showcase.json'), JSON.stringify({ errs, results }, null, 1));
console.log('errors', JSON.stringify(errs));
ws.close(); chrome.kill(); process.exit(0);
