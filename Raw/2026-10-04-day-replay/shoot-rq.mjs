/* 2026-10-04 19:10 - the open-request mark, two looks (his 18:30 "for request since it is very important we need more
   visible ... maybe add some flag on that stores until order is fullfilled"). Shoots the #rq block of day-replay.html
   (wrapped in the Artifact skeleton) at PC 1440 at rest, in grey, frozen mid-arrival (300 ms, on held elements), and at
   phone 390 with the touch media. Checks: 0 console errors, 8 marks, the mark never overlaps the name tag or the red flag,
   phone has no sideways scroll. Usage: node shoot-rq.mjs */
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
const server = http.createServer((q, s) => { const u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') { s.writeHead(200, { 'content-type': 'text/html' }); s.end(page); return; }
  fs.readFile(path.join(HERE, u), (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': u.endsWith('.png') ? 'image/png' : 'image/jpeg' }); s.end(b); }); }).listen(4217);
const prof = path.join(HERE, 'profile5'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9427', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9427/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 300));
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errs.push('console: ' + JSON.stringify(d.params.args.map((a) => a.value ?? a.description)).slice(0, 300)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300)); return r.result?.result?.value; };
const clipOf = (sel) => js(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, width: b.width, height: b.height, scale: 1 }; })()`);
const shot = async (file, sel) => { const f = path.join(OUT, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png', clip: await clipOf(sel), captureBeyondViewport: true }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); return fs.statSync(f).size; };
const load = async () => { await send('Page.navigate', { url: 'http://localhost:4217/' }); for (let i = 0; i < 60; i++) { if (await js('!!window.__replay && !!document.querySelector("#rq .mk")')) break; await sleep(150); } await js('document.fonts.ready.then(() => 1)'); await sleep(1200); };
const STILL = `(() => { window.__replay.pause(); document.querySelectorAll('.rq .mk svg, .sgrid svg.sg').forEach((s) => s.getAnimations({ subtree: true }).forEach((a) => a.finish())); return 1; })()`;
const CHECK = `(() => { const R = (e) => e.getBoundingClientRect(), hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  const cells = [...document.querySelectorAll('#rq .rqrow .rqc')]; const o = { marks: document.querySelectorAll('#rq .mk').length, clashes: [] };
  cells.forEach((c, i) => { const mk = c.querySelector('.mk'); if (!mk) return; const r = R(mk);
    for (const sel of ['.otag', '.free']) { const e = c.querySelector(sel); if (e && hit(r, R(e))) o.clashes.push(i + ':' + sel); } });
  o.overflow = document.documentElement.scrollWidth - innerWidth; return o; })()`;
const out = { errs };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 2, mobile: false });
await load(); await js(STILL);
out.pc = await js(CHECK);
out.pcBytes = await shot('rq-pc.png', '#rq');
await js(`document.getElementById('grey').click(); 1`); await sleep(150);
out.greyBytes = await shot('rq-grey.png', '#rq');
await js(`document.getElementById('grey').click(); 1`);
/* mid-arrival: both looks frozen at 300 ms on held elements */
out.mid = await js(`(() => { playRq('a'); playRq('b'); const els = [...document.querySelectorAll('#rq .mk svg')]; window.__held = els; let n = 0;
  els.forEach((s) => s.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = 300; n++; })); return { anims: n, connected: els.every((e) => e.isConnected) }; })()`);
await sleep(150);
out.midBytes = await shot('rq-mid.png', '#rq');
/* phone */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
await load(); await js(STILL);
out.phone = { hoverNone: await js(`matchMedia('(hover: none)').matches`), phoneClass: await js(`document.body.classList.contains('phone')`), cols: await js(`getComputedStyle(document.getElementById('rq')).gridTemplateColumns`), ...(await js(CHECK)) };
out.phoneBytes = await shot('rq-phone.png', '#rq');
fs.writeFileSync(path.join(OUT, 'measure-rq.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
