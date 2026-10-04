/* Visit signs, three looks (his 2026-10-04 17:10 ask: "better sign and animation ... more clear to understand and memorize").
   Serves day-replay.html wrapped in the Artifact skeleton (doctype + charset + viewport) and shoots:
   board-pc.png (Today / A / B / C, map size + zoomed), board-grey.png (no colour), moments.png (each act frozen at 7
   times, A and B, built in the page and frozen with getAnimations().currentTime), map-B.png / map-C.png (the replay map at
   the day's end, Whole day), board-phone.png (390, touch media asserted). Checks: console errors, 32 cells x 2 signs,
   every stop has a sign + act, silhouette overlap (today vs B), Lite = 0 running, brightness over 24 s of playback
   (today vs B). Usage: node shoot-signs.mjs */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots3'); fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const page = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>'
  + fs.readFileSync(path.join(HERE, 'day-replay.html'), 'utf8') + '</body></html>';
const server = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/') { s.writeHead(200, { 'content-type': 'text/html' }); s.end(page); return; }
  fs.readFile(path.join(HERE, u), (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': u.endsWith('.png') ? 'image/png' : 'image/jpeg' }); s.end(b); });
}).listen(4213);
const prof = path.join(HERE, 'profile3'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9423', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9423/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = []; const frames = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Page.screencastFrame') { frames.push(d.params); ws.send(JSON.stringify({ id: ++seq, method: 'Page.screencastFrameAck', params: { sessionId: d.params.sessionId } })); }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 300));
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errs.push('console: ' + JSON.stringify(d.params.args.map((a) => a.value ?? a.description)).slice(0, 300));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300)); return r.result?.result?.value; };
const clipOf = (sel) => js(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height, scale: 1 }; })()`);
const shot = async (file, clip) => { const f = path.join(OUT, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); return fs.statSync(f).size; };
const load = async () => { await send('Page.navigate', { url: 'http://localhost:4213/' }); for (let i = 0; i < 60; i++) { if (await js('!!window.__replay')) break; await sleep(150); } await js('document.fonts.ready.then(() => 1)'); await sleep(900); };
const STILL = `(() => { window.__replay.pause(); document.querySelectorAll('.sgrid svg.sg').forEach((s) => s.getAnimations({ subtree: true }).forEach((a) => a.finish())); return 1; })()`;
const out = { errs, pc: {}, phone: {} };
await send('Page.enable'); await send('Runtime.enable');

/* ---- PC, 1440 ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 2, mobile: false });
await load();
out.pc.set = await js('window.__replay.set');
await js(STILL);
out.pc.board = await js(`({ cells: document.querySelectorAll('.sgrid .cell').length, signs: document.querySelectorAll('.sgrid .cell svg.sg').length,
  words: document.querySelectorAll('.sgrid .cell[data-set="C"] .sw').length, on: document.querySelector('.sgrid .hd.on')?.dataset.set })`);
out.pc.boardBytes = await shot('board-pc.png', await clipOf('.signs'));
await js(`document.getElementById('grey').click(); 1`); await sleep(150);
out.pc.greyBytes = await shot('board-grey.png', await clipOf('.signs'));
await js(`document.getElementById('grey').click(); 1`);
/* silhouette overlap: share of filled pixels two signs have in common (1 = same outline). Today's whole sign vs B's object */
out.pc.overlap = await js(`(() => {
  const mask = (rows) => rows.map((r) => r.split('').map((c) => c !== '.'));
  const today = (k) => mask(BOARD5.map((r, y) => y >= 1 && y <= 6 ? r.split('').map((c, x) => (PIC5[k][y - 1] || '')[x - 1] && PIC5[k][y - 1][x - 1] !== '.' ? 'K' : c).join('') : r));
  const b = (k) => { if (k === 'sold') { const g = Array.from({ length: 12 }, (_, y) => Array.from({ length: 12 }, (_, x) => Math.hypot(x - 5.5, (y - 5.5) * .78) < 4.6)); return g; }
    const p = BPIC[k], layers = [p.body, p.m, p.xHide ? null : p.x].filter(Boolean), g = Array.from({ length: 12 }, () => Array(12).fill(false));
    layers.forEach((rows) => rows.forEach((r, y) => r.split('').forEach((c, x) => { if (c !== '.' && y < 12 && x < 12) g[y][x] = true; }))); return g; };
  const iou = (A, B) => { let i = 0, u = 0; A.forEach((r, y) => r.forEach((v, x) => { const w = B[y] && B[y][x]; if (v && w) i++; if (v || w) u++; })); return i / u; };
  const worst = (f) => { let m = 0, pair = ''; KINDS.forEach((a, i) => KINDS.slice(i + 1).forEach((c) => { const v = iou(f(a), f(c)); if (v > m) { m = v; pair = a + '/' + c; } })); return { max: +m.toFixed(2), pair }; };
  return { today: worst(today), B: worst(b) }; })()`);
/* moments: each act frozen at 7 times, in A and in B, built in the page from its own pictures and acts */
await js(`(() => {
  const T = [0, .12, .25, .4, .55, .75, 1];
  const box = document.createElement('section'); box.id = 'moments';
  box.style.cssText = 'display:grid;grid-template-columns:120px repeat(14, 76px);gap:4px 4px;align-items:center;padding:12px;background:#3A3A3C url(ground.jpg) -760px -520px / 1640px auto;border-radius:12px;font:700 11px/1.2 Silkscreen,monospace;color:#E8E4DE';
  box.innerHTML = '<span></span>' + ['A', 'B'].map((s) => T.map((v, i) => '<span style="text-align:center;color:' + (s === 'B' ? '#E4B04A' : '#A39B90') + '">' + s + ' ' + (v * .7).toFixed(2) + 's</span>').join('')).join('')
    + KINDS.map((k) => '<span>' + NAMES[k][0] + '</span>' + ['A', 'B'].map((s) => T.map((v) => '<span class="mo" data-s="' + s + '" data-k="' + k + '" data-v="' + v + '" style="display:grid;place-items:center;width:76px;height:56px">' + SETS[s].svg(k) + '</span>').join('')).join('')).join('');
  document.querySelector('main').prepend(box);
  box.querySelectorAll('.mo').forEach((m) => { const svg = m.querySelector('svg'); svg.style.cssText = 'width:' + (svg.classList.contains('s12') ? 48 : 44) + 'px;height:' + (svg.classList.contains('s12') ? 48 : 44) + 'px;overflow:visible';
    runAct(svg, m.dataset.s, m.dataset.k).forEach((a) => { a.pause(); a.currentTime = +m.dataset.v * ACT_MS * .9999; }); });
  window.__frozenMoments = box; return 1; })()`);
await sleep(300);
out.pc.momentsLive = await js(`(() => { const b = window.__frozenMoments; return { connected: b.isConnected, anims: b.getAnimations({ subtree: true }).length, running: b.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length }; })()`);
out.pc.momentsBytes = await shot('moments.png', await clipOf('#moments'));
await js(`document.getElementById('moments').remove(); 1`);
/* the replay map at the day's end, Whole day, in B and in C */
for (const s of ['B', 'C', 'today']) {
  await js(`window.__replay.setSet('${s}'); window.__replay.seek(window.__replay.TOTAL - 1); 1`); await sleep(250);
  out.pc['map' + s] = await js(`({ signs: document.querySelectorAll('#things .stop .sgv svg.sg').length, acts: [1,2,3,4,5,6,7,8].map((k) => document.getElementById('s' + k).querySelector('.sgv').getAnimations({ subtree: true }).length) })`);
  await shot('map-' + s + '.png', await clipOf('#box'));
}
/* follow camera on the competitor scene, mid-act (1.6 s) in B */
await js(`window.__replay.setSet('B'); document.querySelector('[data-cam="follow"]').click(); window.__replay.seek(window.__replay.sceneSeg(4).t0 + 1650); 1`); await sleep(400);
await js(`window.__replay.seek(window.__replay.sceneSeg(4).t0 + 1650); 1`); await sleep(100);
await shot('map-B-follow-issue.png', await clipOf('#box'));
await js(`document.querySelector('[data-cam="whole"]').click(); 1`);
/* Lite: nothing runs, the board shows end pictures */
await js(`document.getElementById('playall').click(); 1`); await sleep(100);
await js(`document.getElementById('lite').click(); 1`); await sleep(200);
out.pc.lite = await js(`({ running: document.getAnimations().filter((a) => a.playState === 'running').length })`);
await js(`document.getElementById('lite').click(); 1`);
/* brightness: 24 s of real playback at 1x from the first scene, map only - today's signs, then B */
const box = await js(`(() => { document.getElementById('box').scrollIntoView({ block: 'start' }); const b = document.getElementById('box').getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()`);
const caps = {};
for (const s of ['today', 'B']) {
  await js(`window.__replay.setSet('${s}'); window.__replay.seek(window.__replay.sceneSeg(1).t0 - 300); window.__replay.play(); 1`);
  frames.length = 0; await send('Page.startScreencast', { format: 'jpeg', quality: 70, everyNthFrame: 1 }); await sleep(24000); await send('Page.stopScreencast');
  caps[s] = frames.slice();
}
await send('Page.navigate', { url: 'about:blank' }); await sleep(200);
for (const s of ['today', 'B']) {
  let worst = 0; const means = []; await js('window.__l = null; 1');
  for (const f of caps[s]) {
    const v = await js(`new Promise((ok) => { const i = new Image(); i.onload = () => { const k = i.naturalWidth / 1440, c = document.createElement('canvas'); c.width = Math.round(${box.w} / 4); c.height = Math.round(${box.h} / 4);
      const g = c.getContext('2d'); g.drawImage(i, ${box.x} * k, ${box.y} * k, ${box.w} * k, ${box.h} * k, 0, 0, c.width, c.height); const d = g.getImageData(0, 0, c.width, c.height).data; let s = 0; const px = [];
      for (let j = 0; j < d.length; j += 4) { const l = .2126 * d[j] + .7152 * d[j + 1] + .0722 * d[j + 2]; s += l; px.push(l); } const last = window.__l; window.__l = px; let big = 0; if (last) px.forEach((l, j) => { if (Math.abs(l - last[j]) > 40) big++; });
      ok({ mean: s / px.length, big: big / px.length }); }; i.src = 'data:image/jpeg;base64,${f.data}'; })`);
    means.push(v.mean); worst = Math.max(worst, v.big);
  }
  out.pc['bright_' + s] = { frames: caps[s].length, meanMin: +Math.min(...means).toFixed(1), meanMax: +Math.max(...means).toFixed(1), worstFrameShare: +worst.toFixed(3) };
}

/* ---- phone, 390 ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
await load();
out.phone.hoverNone = await js(`matchMedia('(hover: none)').matches`);
out.phone.phoneClass = await js(`document.body.classList.contains('phone')`);
await js(STILL);
out.phone.layout = await js(`({ innerWidth, overflow: document.documentElement.scrollWidth - innerWidth, cols: getComputedStyle(document.getElementById('sgrid')).gridTemplateColumns,
  shown: [...document.querySelectorAll('.sgrid .hd[data-set]')].filter((h) => getComputedStyle(h).display !== 'none').map((h) => h.dataset.set),
  sectionRight: Math.round(document.querySelector('.signs').getBoundingClientRect().right) })`);
out.phone.boardBytes = await shot('board-phone.png', await clipOf('.signs'));
fs.writeFileSync(path.join(OUT, 'measure3.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); server.close(); await sleep(1000);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
