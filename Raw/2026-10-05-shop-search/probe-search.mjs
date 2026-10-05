/* 2026-10-05 - the shop search, on the PRODUCTION lab build (kpm dist-ponderlab), REAL input through CDP: a real press on
   the box (mouse at 1440, finger at 390 with the touch media emulated and (hover: none) asserted), real typed text
   (Input.insertText) and a real Enter key. Checks per screen and width:
   Journey: the Global Fleet filter is gone; a part of a name + Enter = the box holds the full name and the map sits on that
            shop at zoom 16; a shop off today's round = the map goes there AND says so; nonsense = "No shop called".
   Map System: a part of a name + Enter = that shop's card opens and the map flies in; nonsense = "No shop called".
   Usage: node probe-search.mjs  -> search.json + s-*.png */
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
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4233);
const prof = path.join(HERE, 'profile-s'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9433', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9433/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 200)); return r.result?.result?.value; };
const shot = async (file) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const open = async (flags) => { await send('Page.navigate', { url: 'about:blank' }); await sleep(100); await send('Page.navigate', { url: 'http://localhost:4233/tools/ponder-lab.html?' + flags });
  for (let i = 0; i < 100 && !(await js('!!document.querySelector(".leaflet-container")')); i++) await sleep(200); await sleep(3000); };
const centre = (sel) => js(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
const press = async (c, touch) => { if (touch) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 }); await sleep(300); };
const enter = async () => { for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: type === 'keyDown' ? '\r' : undefined }); };
/* type into the shop box: press it, clear it, type, Enter */
const search = async (text, touch) => {
  const c = await centre('input[aria-label="Find a shop"]'); if (!c) return 'no box';
  await press(c, touch);
  await js(`(() => { const i = document.querySelector('input[aria-label="Find a shop"]'); i.focus(); i.select(); 1 })()`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 });
  await send('Input.insertText', { text }); await sleep(150); await enter(); await sleep(2200); return 'typed';
};
const toast = (re) => js(`[...document.querySelectorAll('body *')].some((e) => e.childElementCount === 0 && ${re}.test(e.textContent || ''))`);
const shopAt = (name) => js(`(() => { const want = ${JSON.stringify(name)}; const ic = [...document.querySelectorAll('.leaflet-marker-icon')].find((e) => e.querySelector('.kx-snm > i')?.textContent === want);
  if (!ic) return null; const b = ic.getBoundingClientRect(), m = document.querySelector('.leaflet-container').getBoundingClientRect();
  return { dx: Math.round(b.left + b.width / 2 - (m.left + m.width / 2)), dy: Math.round(b.top + b.height / 2 - (m.top + m.height / 2)) }; })()`);
const near = (a) => !!a && Math.abs(a.dx) <= 20 && Math.abs(a.dy) <= 40;
const out = { errs };
await send('Page.enable'); await send('Runtime.enable');

const journey = async (w, touch) => {
  const r = {};
  await open('shell&journey&exp&admin&visits');
  if (touch) { r.media = await js(`matchMedia('(hover: none)').matches`); await press(await centre('.kx-feed-head button'), true); await sleep(500); }
  r.filterGone = await js(`!/Operational Filter|Global Fleet/i.test(document.querySelector('.kx-feed')?.innerText || 'x')`);
  r.options = await js(`document.querySelectorAll('#kx-journey-shops option').length`);
  r.typed = await search('sinar', touch);
  r.box = await js(`document.querySelector('input[aria-label="Find a shop"]').value`);
  r.at = await shopAt(r.box);   // the found shop's chest sits at the map's centre
  await shot(`s-journey-${w}.png`);
  /* a shop off today's round: after the fly, no chest of that name stands at the centre (a shop only off-screen when it
     was picked lands under the centre and is skipped - the first run took one of those for off-round); then the box
     must have SAID so, or said it has no GPS pin */
  const names = await js(`[...document.querySelectorAll('#kx-journey-shops option')].map((o) => o.value)`);
  /* every lab shop rides today's round, so press the day with the fewest chests first (a real press on its key) */
  const days = await js(`[...document.querySelectorAll('.kx-days button')].filter((b) => b.offsetParent).map((b) => b.textContent.trim())`);
  r.dayChests = {};
  for (const d of days) {
    await press(await js(`(() => { const b = [...document.querySelectorAll('.kx-days button')].find((x) => x.offsetParent && x.textContent.trim() === ${JSON.stringify(d)}); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`), touch);
    await sleep(900); r.dayChests[d] = await js(`(() => { const t = document.querySelector('.kx-feed-count')?.textContent || ''; return t; })()`);
  }
  r.day = days.reduce((a, d) => (parseInt(String(r.dayChests[d]).split('/')[1]) < parseInt(String(r.dayChests[a]).split('/')[1]) ? d : a), days[0]);
  await press(await js(`(() => { const b = [...document.querySelectorAll('.kx-days button')].find((x) => x.offsetParent && x.textContent.trim() === ${JSON.stringify(r.day)}); const q = b.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; })()`), touch);
  await sleep(1200);
  r.tried = [];
  for (const n of names) {
    if (r.tried.length >= 10) break;
    if (await js(`[...document.querySelectorAll('.leaflet-marker-icon .kx-snm > i')].some((e) => e.textContent === ${JSON.stringify(n)})`)) continue;
    await search(n, touch); r.tried.push(n);
    if (!near(await shopAt(n))) { r.offName = n; r.offSaid = await toast(/is not on .*'s round/); r.noPinSaid = await toast(/has no GPS pin/); break; }
  }
  await search('zzqq nothing', touch); r.missSaid = await toast(/No shop called "zzqq nothing"/);
  return r;
};
const mapsys = async (w, touch) => {
  const r = {};
  await open('shell&map');
  r.options = await js(`document.querySelectorAll('#kx-map-shops option').length`);
  r.typed = await search('sinar', touch);
  r.box = await js(`document.querySelector('input[aria-label="Find a shop"]').value`);
  r.cardOpen = await js(`(() => { const n = document.querySelector('input[aria-label="Find a shop"]').value; return !!n && [...document.querySelectorAll('h1, h2, h3')].some((h) => h.offsetParent && h.textContent.includes(n)); })()`);
  await shot(`s-map-${w}.png`);
  await search('zzqq nothing', touch); r.missSaid = await toast(/No shop called "zzqq nothing"/);
  return r;
};

await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
out.journeyPC = await journey('pc', false);
out.mapPC = await mapsys('pc', false);
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
out.journeyPhone = await journey('ph', true);
out.mapPhone = await mapsys('ph', true);

out.pass = {};
for (const k of ['journeyPC', 'journeyPhone']) { const r = out[k];
  out.pass[k] = { filterGone: r.filterGone, options: r.options > 0, fullName: /sinar/i.test(r.box || ''), chestAtCentre: near(r.at), offRoundSaid: r.offName ? !!(r.offSaid || r.noPinSaid) : `no off-round shop in ${r.tried.length} tried`, missSaid: r.missSaid }; }
for (const k of ['mapPC', 'mapPhone']) { const r = out[k];
  out.pass[k] = { options: r.options > 0, fullName: /sinar/i.test(r.box || ''), cardOpen: r.cardOpen, missSaid: r.missSaid }; }
out.pass.phoneMedia = out.journeyPhone.media === true;
out.pass.noErrors = errs.length === 0;
fs.writeFileSync(path.join(HERE, 'search.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
