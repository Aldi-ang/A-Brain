/* Round 7 BUILT (kpm, 2026-10-04): the real Journey Plan from the production lab build (dist-ponderlab). At 1440:
   Budi pressed (his Expedition row) -> his name tags, the others faded, the road + arrows; "All shops"; his Paintbrush pen
   does the same; the owner listed with his title (&boss); a colour-blind frame; fullscreen = the small Expedition under
   the keys. At 390 (touch media): fullscreen = the chips + one line, clear of the zoom keys and the dock. */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../../kpm-inventory-main/dist-ponderlab');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => {
  const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); });
}).listen(4199);
const BASE = 'http://localhost:4199/tools/ponder-lab.html?shell&journey&exp&admin&visits&boss';
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9409',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9409/json/list')).json(); } catch { /* not up */ } }
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
const shot = async (file, clip, scale = 1) => {
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });
  const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale } } : {}) });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const waitFor = async (expr, ms = 15000) => { for (let t = 0; t < ms; t += 150) { if (await js(expr)) return true; await sleep(150); } return false; };
const load = async () => { await send('Page.navigate', { url: BASE }); await waitFor('!!document.querySelector(".kx-keys .k-full")', 20000); await sleep(1800); };
const clipOf = (sel) => js(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: b.height }; })()`);
const STATE = `(() => { const r = (e) => e.getBoundingClientRect();
  const mine = [...document.querySelectorAll('.leaflet-marker-icon > .kx-c5.mine')], others = [...document.querySelectorAll('.leaflet-marker-icon > .kx-c5:not(.mine)')];
  return { tags: mine.map((e) => e.querySelector('.kx-otag')?.textContent).join(' | '), mine: mine.length, others: others.length,
    othersFaded: others.length > 0 && others.every((e) => +getComputedStyle(e).opacity < .3), road: document.querySelectorAll('path.kx-road').length,
    arrows: document.querySelectorAll('.kx-arrow').length, focus: !!document.querySelector('.kx-map.kx-focus'),
    sw: [...document.querySelectorAll('.kx-roadsw button')].map((b) => b.textContent + ':' + b.getAttribute('aria-pressed')).join(' '),
    boss: [...document.querySelectorAll('.kx-row')].map((e) => e.textContent).find((t) => /Aldi/.test(t)) || null,
    chestsOnMap: document.querySelectorAll('.leaflet-marker-icon > .kx-c5').length, inBubbles: [...document.querySelectorAll('.kx-slot .cnt')].reduce((n, e) => n + +e.dataset.n, 0),
    redFlags: document.querySelectorAll('.leaflet-marker-icon > .kx-c5 > .kx-free').length, bubbleFlags: document.querySelectorAll('.kx-slot > .kx-free').length,
    flagPicture: (() => { const f = document.querySelector('.kx-free'); return f ? getComputedStyle(f).backgroundImage.startsWith('url(') : null; })() }; })()`;
const out = { errs };
await send('Page.enable'); await send('Runtime.enable');

/* ---- PC ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
/* nobody's shops (&free = every 7th shop unassigned): red flags on the chests and on the bubbles that hold them */
await send('Page.navigate', { url: BASE + '&free' }); await waitFor('!!document.querySelector(".kx-keys .k-full")', 20000); await sleep(1800);
out.free = await js(STATE);
await shot('pc-free.png', await clipOf('.kx-map'));
for (let k = 0; k < 2; k++) { await js(`document.querySelector('.leaflet-control-zoom-in').click(); 1`); await sleep(900); }
out.freeZoom = await js(STATE);
await shot('pc-free-zoom.png', await clipOf('.kx-map'));
await load();
out.before = await js(STATE);
await js(`[...document.querySelectorAll('.kx-row')].find((e) => /Budi/.test(e.textContent)).click(); 1`); await sleep(1500);
out.budiToday = await js(STATE);
await shot('pc-budi-today.png', await clipOf('.kx-map'));
await js(`document.documentElement.style.filter = 'url(#kxcb)'; document.body.insertAdjacentHTML('beforeend', '<svg width="0" height="0" style="position:absolute"><filter id="kxcb" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/></filter></svg>'); 1`); await sleep(400);
await shot('pc-budi-today-colourblind.png', await clipOf('.kx-map'));
await js(`document.documentElement.style.filter = ''; 1`);
await js(`[...document.querySelectorAll('.kx-roadsw button')].find((b) => /All/.test(b.textContent)).click(); 1`); await sleep(900);
out.budiAll = await js(STATE);
await shot('pc-budi-all.png', await clipOf('.kx-map'));
await shot('pc-panel.png', await clipOf('.kx-panel'));
/* tap him again = let go */
await js(`[...document.querySelectorAll('.kx-row')].find((e) => /Budi/.test(e.textContent)).click(); 1`); await sleep(900);
out.letGo = await js(STATE);
/* his Paintbrush pen does the same */
await js(`document.querySelector('.k-brush').click(); 1`); await sleep(500);
await js(`[...document.querySelectorAll('.kx-pen')].find((e) => /Budi/.test(e.textContent))?.click(); 1`); await sleep(1200);
out.pen = await js(STATE);
await js(`[...document.querySelectorAll('.kx-pen')].find((e) => /Disable/.test(e.textContent))?.click(); document.querySelector('.k-brush').click(); 1`); await sleep(500);
/* fullscreen */
await js(`document.querySelector('.kx-keys .k-full').click(); 1`); await sleep(1500);
await js(`[...document.querySelectorAll('.kx-mrow')].find((e) => /Budi/.test(e.textContent))?.click(); 1`); await sleep(1200);
out.fsPc = await js(`(() => { const m = document.querySelector('.kx-mini'); if (!m) return null; const b = m.getBoundingClientRect(); const keys = [...document.querySelectorAll('.kx-keys > button')].map((e) => e.getBoundingClientRect());
  return { rows: m.querySelectorAll('.kx-mrow').length, dimRows: m.querySelectorAll('.kx-mrow.off').length, team: document.querySelectorAll('.kx-panel .kx-row').length, head: m.querySelector('header')?.textContent, rect: [b.left, b.top, b.right, b.bottom].map(Math.round), underKeys: keys.every((k) => k.bottom <= b.top + 1), focus: !!document.querySelector('.kx-map.kx-focus') }; })()`);
await shot('pc-fullscreen.png');

/* ---- phone ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
await load();
out.hoverNone = await js(`matchMedia('(hover: none)').matches`);
await js(`document.querySelector('.kx-keys .k-full, .kx-dock .k-full')?.click(); 1`); await sleep(1500);
if (!(await js(`!!document.querySelector('.kx-mbar')`))) { await js(`[...document.querySelectorAll('.k-full')].forEach((b) => b.offsetParent && b.click()); 1`); await sleep(1500); }
await js(`[...document.querySelectorAll('.kx-mchips button')].find((e) => /BS/.test(e.textContent))?.click(); 1`); await sleep(1200);
out.fsPhone = await js(`(() => { const m = document.querySelector('.kx-mbar'); if (!m) return null; const r = (e) => e && e.getBoundingClientRect(); const b = r(m), z = r(document.querySelector('.leaflet-control-zoom')), d = r(document.querySelector('.kx-dock'));
  const hit = (a, c) => a && c && a.left < c.right && a.right > c.left && a.top < c.bottom && a.bottom > c.top;
  return { chips: m.querySelectorAll('.kx-mchips button').length, line: m.querySelector('.kx-mline')?.textContent, rect: [b.left, b.top, b.right, b.bottom].map(Math.round), overZoom: hit(b, z), overDock: hit(b, d), overflow: document.documentElement.scrollWidth - innerWidth, focus: !!document.querySelector('.kx-map.kx-focus') }; })()`);
await shot('phone-fullscreen.png');
/* the lab's own notice ("... assigned to a name not on the roster") sits over the top bar: HIDE it for one frame, never
   remove an element the app rendered (lessons) */
out.noticeHidden = await js(`(() => { const t = [...document.querySelectorAll('body *')].filter((e) => /not on the roster/.test(e.textContent) && e.children.length < 3).pop();
  let el = t; while (el && el.parentElement && !['fixed', 'absolute'].includes(getComputedStyle(el).position)) el = el.parentElement; if (el) el.style.visibility = 'hidden'; return !!el; })()`);
await sleep(200);
await shot('phone-fullscreen-bar.png', { x: 0, y: 0, width: 390, height: 260 }, 2);

fs.writeFileSync(path.join(HERE, 'measure-built7.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); server.close(); await sleep(1200);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* Chrome still closing */ }
process.exit(0);
