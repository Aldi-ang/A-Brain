/* 2026-10-05 - his 2026-10-04 19:45 ask: the word under a visit sign shows only while that shop is hovered (PC) or held
   (phone). On the PRODUCTION lab build (kpm dist-ponderlab, ?shell&journey&exp&admin&visits), REAL input through CDP:
   PC 1440 = mouse moves and presses; phone 390 = touch events with the touch media emulated and (hover: none) asserted
   first (lessons 2026-10-03, 2026-09-20: a .click() never exercises a hold). Every count carries a floor (words in the
   DOM > 0), lessons 2026-10-04.
   Checks: rest = 0 words visible; PC hover one chest = exactly its word; phone hold one chest = its word and no popup,
   gone on release; phone tap = popup, no word. Usage: node probe-hold.mjs  -> hold.json */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../kpm-inventory-main/dist-ponderlab');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => { const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4231);
const LAB = 'http://localhost:4231/tools/ponder-lab.html?shell&journey&exp&admin&visits';
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9431', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9431/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 200)); return r.result?.result?.value; };
const shot = async (file, clip) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip } : {}) }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const mapClip = () => js(`(() => { const b = document.querySelector('.leaflet-container').getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: Math.min(b.height, 900), scale: 1 }; })()`);

/* what is on screen: words in the DOM (the floor), words visible (which), popups open */
const STATE = `(() => { const sw = [...document.querySelectorAll('.leaflet-marker-icon .kx-sw')];
  const vis = sw.filter((e) => getComputedStyle(e).visibility === 'visible' && e.getBoundingClientRect().width > 0);
  return { words: sw.length, visible: vis.map((e) => e.textContent), visibleIds: vis.map((e) => e.closest('.leaflet-marker-icon').dataset.probe || '?'),
    popups: document.querySelectorAll('.leaflet-popup').length }; })()`;
/* a visited chest that a finger at its centre really lands on (nothing else on top), tagged so the state can name it */
const PICK = `(() => { const W = innerWidth, H = innerHeight;
  for (const ic of document.querySelectorAll('.leaflet-marker-icon')) { if (!ic.querySelector('.kx-sw')) continue;
    const b = ic.querySelector('.art').getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
    if (x < 40 || y < 120 || x > W - 40 || y > H - 120) continue;
    if (document.elementFromPoint(x, y)?.closest('.leaflet-marker-icon') !== ic) continue;
    ic.dataset.probe = 'picked'; return { x, y, word: ic.querySelector('.kx-sw').textContent }; } return null; })()`;
const mouse = async (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: type === 'mouseMoved' ? 0 : 1 });
const touch = (type, x, y) => send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
const press = async (x, y, ms, isTouch) => { if (isTouch) { await touch('touchStart', x, y); await sleep(ms); await touch('touchEnd', x, y); }
  else { await mouse('mouseMoved', x, y); await mouse('mousePressed', x, y); await sleep(ms); await mouse('mouseReleased', x, y); } };

/* zoom into bubbles (with the same input the width uses) until at least 2 visited chests stand alone */
const open = async (isTouch) => {
  await send('Page.navigate', { url: 'about:blank' }); await sleep(100);
  await send('Page.navigate', { url: LAB });
  for (let i = 0; i < 100 && !(await js('!!document.querySelector(".leaflet-marker-icon")')); i++) await sleep(200);
  await sleep(2500);
  for (let i = 0; i < 6 && (await js(`document.querySelectorAll('.leaflet-marker-icon .kx-sw').length`)) < 2; i++) {
    const c = await js(`(() => { const e = [...document.querySelectorAll('.kx-slot')].map((s) => s.closest('.leaflet-marker-icon')).find((ic) => { const b = ic.getBoundingClientRect(); return b.top > 120 && b.bottom < innerHeight - 60; }); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!c) break; await press(c.x, c.y, 60, isTouch); await sleep(1400);
  }
  await sleep(600);
};

const out = { errs };
await send('Page.enable'); await send('Runtime.enable');

/* ---- PC 1440, a mouse ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await open(false);
await mouse('mouseMoved', 5, 500);
out.pcRest = await js(STATE);
const pc = await js(PICK); out.pcPicked = pc;
if (pc) {
  await mouse('mouseMoved', pc.x, pc.y); await sleep(300);
  out.pcHover = await js(STATE);
  await shot('pc-hover.png', await mapClip());
  await mouse('mouseMoved', 5, 500); await sleep(300);
  out.pcAway = await js(STATE);
  await press(pc.x, pc.y, 80, false); await sleep(600);
  out.pcClick = await js(STATE);
}
await shot('pc-rest.png', await mapClip());

/* ---- phone 390, a finger ---- */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
await open(true);
out.phoneMedia = await js(`matchMedia('(hover: none)').matches && matchMedia('(pointer: coarse)').matches`);
out.phRest = await js(STATE);
await shot('ph-rest.png', await mapClip());
const ph = await js(PICK); out.phPicked = ph;
if (ph) {
  await touch('touchStart', ph.x, ph.y); await sleep(650);
  out.phHolding = await js(STATE);
  await shot('ph-hold.png', await mapClip());
  await touch('touchEnd', ph.x, ph.y); await sleep(700);
  out.phReleased = await js(STATE);
  await press(ph.x, ph.y, 70, true); await sleep(700);
  out.phTap = await js(STATE);
  await shot('ph-tap.png', await mapClip());
}

const one = (s, word) => s && s.words > 0 && s.visible.length === 1 && s.visible[0] === word && s.visibleIds[0] === 'picked';
out.pass = {
  pcRest0: !!(out.pcRest?.words > 0 && out.pcRest.visible.length === 0),
  pcHoverOnlyIts: one(out.pcHover, pc?.word) && out.pcHover.popups === 0,
  pcAway0: out.pcAway?.visible.length === 0,
  pcClickPopup: out.pcClick?.popups === 1,
  phoneMedia: out.phoneMedia === true,
  phRest0: !!(out.phRest?.words > 0 && out.phRest.visible.length === 0),
  phHoldOnlyIts: one(out.phHolding, ph?.word) && out.phHolding.popups === 0,
  phHoldNoPopup: out.phReleased?.popups === 0 && out.phReleased?.visible.length === 0,
  phTapPopupNoWord: out.phTap?.popups === 1 && out.phTap?.visible.length === 0,
  noErrors: errs.length === 0,
};
fs.writeFileSync(path.join(HERE, 'hold.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.pass, null, 1), '\n', JSON.stringify({ pcRest: out.pcRest, pcHover: out.pcHover, phRest: out.phRest, phHolding: out.phHolding, phReleased: out.phReleased, phTap: out.phTap, errs }, null, 0));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
