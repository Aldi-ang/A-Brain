/* 2026-10-10 - the Master Vault's small 3D box (his pick A + "add the view in fullscreen button"), walked with a real
   finger at a 390 phone in the kpm component lab (dist-ponderlab, ?vault3d). Checks: (1) a finger drag that STARTS on the
   box scrolls the page and does not turn the box; (2) "View in fullscreen" opens the sales terminal's viewer (fixed,
   z 10000) showing the description; (3) its close works; (4) a tap on the box opens it too.
   Needs: node node_modules/vite/bin/vite.js build --config tools/ponder-lab.config.mjs. Output: vault3d-*.png + a pass list. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/dist-ponderlab';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' };
const server = http.createServer((req, res) => {
  let f = path.join(DIST, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'tools/ponder-lab.html');
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(4177);
const prof = path.join(HERE, 'profile-walk'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9401', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9401/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 160)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(HERE, `vault3d-${name}.png`), Buffer.from(s.result.data, 'base64')); };
const touch = (type, x, y) => send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
const tap = async (x, y) => { await touch('touchStart', x, y); await sleep(60); await touch('touchEnd', x, y); await sleep(500); };
const out = [];
const ok = (name, pass, got) => { out.push(`${pass ? 'PASS' : 'FAIL'} ${name}${pass ? '' : ' -> ' + JSON.stringify(got)}`); };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Page.navigate', { url: 'http://localhost:4177/tools/ponder-lab.html?vault3d' }); await sleep(3000);
const box = await js(`(() => { const s = document.querySelector('[style*="perspective: 1200px"]'); const r = s.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 - 40, h: r.height }; })()`);
await shot('1-page');
const turn = () => js(`document.querySelector('[style*="perspective: 1200px"] > div[style*="rotateX"]')?.style.transform || 'none'`);
const t0 = await turn(), y0 = await js('scrollY');
/* a finger-speed drag that starts ON the box: many small steps, upward (lesson 2026-10-06: one instant move is a fling) */
await touch('touchStart', box.x, box.y);
for (let i = 1; i <= 20; i++) { await touch('touchMove', box.x + i * 2, box.y - i * 12); await sleep(16); }
await touch('touchEnd', box.x + 40, box.y - 240); await sleep(800);
const y1 = await js('scrollY'), t1 = await turn();
ok('a drag that starts on the box scrolls the page', y1 > y0 + 50, { y0, y1 });
ok('the drag does not turn the small box', t1 === t0, { t0, t1 });
ok('it did not open the fullscreen viewer by itself', !(await js(`!!document.querySelector('.fixed.inset-0')`)), 'opened');
await js('scrollTo(0, 0), 1'); await sleep(300);
const btn = await js(`(() => { const b = [...document.querySelectorAll('button')].find((x) => /View in fullscreen/.test(x.textContent)); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, h: r.height }; })()`);
ok('the "View in fullscreen" button is there, at least 44 px tall', !!btn && btn.h >= 44, btn);
if (btn) await tap(btn.x, btn.y);
const modal = () => js(`(() => { const m = document.querySelector('.fixed.inset-0'); if (!m) return null; const cs = getComputedStyle(m); return { z: cs.zIndex, pos: cs.position, text: m.innerText.replace(/\\s+/g, ' ').slice(0, 200) }; })()`);
const m1 = await modal();
ok('the button opens the fullscreen viewer (fixed, z 10000)', !!m1 && m1.pos === 'fixed' && m1.z === '10000', m1);
ok('the viewer shows the product description', !!m1 && /Kretek 16 batang/.test(m1.text), m1?.text);
await shot('2-fullscreen');
const x = await js(`(() => { const b = document.querySelector('.fixed.inset-0 button'); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
await tap(x.x, x.y);
ok('the close button closes it', !(await modal()), 'still open');
await tap(box.x, box.y);
ok('a tap on the box opens it too', !!(await modal()), 'not opened');
ok('no page errors', errs.length === 0, errs);
console.log(out.join('\n')); console.log(`${out.filter((l) => l.startsWith('PASS')).length}/${out.length} pass`);
ws.close(); chrome.kill(); server.close(); process.exit(0);
