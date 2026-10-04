/* Board for Aldi (2026-10-04): what was fixed, the pass/fail table from results.json, and the frames - one tall PNG
   (board.png), 1080 wide so it reads on his phone. Deletes the old board before shooting (lessons 2026-09-22). */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const results = JSON.parse(fs.readFileSync(path.join(HERE, 'results.json'), 'utf8'));
const pass = results.filter((r) => r.pass).length;

const FIXED = [
  ['Road switch carried over', '"All shops" stayed on for the NEXT salesman pressed', 'each new press opens on Today'],
  ['Only the owner out', 'camera dived to street level on him - 4 of 32 shops in view', 'keeps all 32 shops in view'],
  ['Two salesmen on one shop', 'they overlapped by 12 px', 'side by side, the seller nearest the chest'],
  ['Brush on + press a salesman', 'screen showed Budi, the brush painted for Ari', 'the brush follows the pressed man; tap him again = brush off'],
  ['Phone: tap the bubble he sells in', 'he was thrown onto the chest\'s sign (2 spider lines)', 'zooms in to the selling scene; a pile of shops still spreads out'],
  ['Pressed salesman: other men\'s lines', 'stayed bright, pointing at hidden shops', 'fade with the other men'],
  ['"Today\'s round" rule', 'a shop with no visit frequency: Journey Plan said due, Expedition said not', 'same rule as Journey Plan (no frequency = every day)'],
  ['Sale at a shop not on today\'s route', 'his road bent at empty ground - 4 stops, 0 chests', 'its chest shows when he is pressed'],
  ['No round today: next shop', 'suggested the shop he was already selling in', 'never a shop he sold at today'],
];
const NOT = [
  ['A shop with no pin', 'drawn at Muntilan centre (the app\'s old default). The road skips it. Left as is: it is how the boss finds pinless shops to set their pin.'],
  ['Phone, zoomed out', 'a crowd on one bubble can touch the next bubble\'s bar. Bubble spacing is the cluster\'s; changing it changes the whole look and the speed.'],
  ['Real app', 'not checked: npm run dev was not running, so every check ran on the production lab build.'],
];
const FRAMES = [
  ['pc-out.png', 'PC zoomed out: men stand on the bubbles'], ['pc-in.png', 'PC zoomed in: each man at his spot'],
  ['pc-budi-today.png', 'Budi pressed: his shops only, tags, road; other men + lines faded'], ['pc-pen.png', 'Brush pen Budi: the rest fade, not hidden'],
  ['pc-free-in.png', 'Red flag on a shop nobody owns'], ['pc-fullscreen.png', 'PC fullscreen: whole team under the keys'],
  ['break-pair.png', 'FIXED: two men on one shop, side by side'], ['break-noround.png', 'FIXED: off-route sale has its chest; next shop is a new one'],
  ['break-owner-only.png', 'FIXED: only the owner out, shops stay in view'], ['break-brush-press.png', 'FIXED: brush follows the pressed man'],
  ['break-exitfs.png', 'Leave fullscreen with Budi pressed: still his'], ['break-nobody.png', 'Nobody out: no men, team list all dimmed'],
];
const PHONE = [['ph-page.png', 'Phone page'], ['ph-out.png', 'Phone zoomed out'], ['ph-budi.png', 'Phone: Budi pressed'], ['ph-budi-in.png', 'FIXED: tap his bubble = selling scene']];
const SCENE = [['pc-seller.png', 'Seller holds the coin'], ['m-1050.png', 'The selling moment, frozen at 1.05 s'], ['lite-seller.png', 'Lite: still, front face']];

const html = `<!doctype html><meta charset="utf-8"><style>
:root { --bg:#121110; --card:#1B1917; --line:#2E2A26; --ink:#E8E4DE; --dim:#A39B90; --gold:#E4B04A; --crit:#E0583A; }
* { box-sizing:border-box } body { margin:0; background:var(--bg); color:var(--ink); font:16px/1.45 system-ui, Segoe UI, sans-serif; width:1080px; padding:36px }
h1 { font-size:34px; margin:0 0 6px } h2 { font-size:22px; margin:34px 0 12px; color:var(--gold); text-transform:uppercase; letter-spacing:.06em }
.sub { color:var(--dim); font-size:18px } table { width:100%; border-collapse:collapse; background:var(--card); border:1px solid var(--line) }
td, th { padding:9px 12px; border-top:1px solid var(--line); vertical-align:top; text-align:left } th { color:var(--dim); font-weight:600; font-size:14px; text-transform:uppercase }
.ok { color:var(--gold); font-weight:700; white-space:nowrap } .no { color:var(--crit); font-weight:700 } .was { color:var(--dim) }
.grid { display:grid; grid-template-columns:1fr 1fr; gap:14px } .grid4 { display:grid; grid-template-columns:repeat(4, 1fr); gap:12px } .grid3 { display:grid; grid-template-columns:repeat(3, 1fr); gap:12px }
figure { margin:0; background:var(--card); border:1px solid var(--line) } figure img { width:100%; display:block } figcaption { padding:8px 10px; font-size:15px }
</style>
<h1>Journey map - tested end to end</h1>
<div class="sub">2026-10-04 · production lab build · PC 1440 + phone 390 (touch) · <b style="color:var(--gold)">${pass}/${results.length} checks pass</b> · 9 bugs found and fixed · phone speed (CPU 6x slower): 116 ms busy per 3 s at rest, longest zoom frame 97 ms · 0 console errors</div>
<h2>Fixed today (9)</h2>
<table><tr><th>What</th><th>Before</th><th>Now</th></tr>${FIXED.map(([a, b, c]) => `<tr><td><b>${esc(a)}</b></td><td class="was">${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</table>
<h2>Every check (${pass}/${results.length})</h2>
<table>${results.map((r) => `<tr><td class="${r.pass ? 'ok' : 'no'}">${r.pass ? 'PASS' : 'FAIL'}</td><td>${esc(r.name)}</td></tr>`).join('')}</table>
<h2>Not fixed, and why</h2>
<table>${NOT.map(([a, b]) => `<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td></tr>`).join('')}</table>
<h2>PC frames</h2><div class="grid">${FRAMES.map(([f, c]) => `<figure><img src="${f}"><figcaption>${esc(c)}</figcaption></figure>`).join('')}</div>
<h2>The selling scene (zoomed x3)</h2><div class="grid3">${SCENE.map(([f, c]) => `<figure><img src="${f}"><figcaption>${esc(c)}</figcaption></figure>`).join('')}</div>
<h2>Phone frames</h2><div class="grid4">${PHONE.map(([f, c]) => `<figure><img src="${f}"><figcaption>${esc(c)}</figcaption></figure>`).join('')}</div>`;
fs.writeFileSync(path.join(HERE, 'board.html'), html);

const out = path.join(HERE, 'board.png'); fs.rmSync(out, { force: true });
const prof = path.join(HERE, 'profile-board'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9411', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9411/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pend = new Map(); ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pend.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1200, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(path.join(HERE, 'board.html')).href }); await sleep(2500);
const h = (await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })).result.result.value;
const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1080, height: h, scale: 1 } });
fs.writeFileSync(out, Buffer.from(s.result.data, 'base64'));
console.log('board', h, fs.statSync(out).mtime.toISOString());
ws.close(); chrome.kill(); await sleep(1000); try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
