/* 2026-10-05 09:15 - his "continue to redesign the map system first". BEFORE frames: every state of Map System on the
   PRODUCTION lab build (kpm dist-ponderlab, ?shell&map), opened with REAL clicks (CDP mouse at 1440, CDP touch at 390 with
   the touch media emulated and (hover: none) asserted). Every frame is deleted before it is shot.
   States: rest, menu open, each menu toggle on (its frame, then off again), a store's card (via the shop search).
   Usage: node shoot-states.mjs -> <w>-<state>.png + states.json (the menu's button texts, what each state put on screen) */
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
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4235);
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9435', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9435/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value; };
const shot = async (file) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const open = async () => { await send('Page.navigate', { url: 'about:blank' }); await sleep(100); await send('Page.navigate', { url: 'http://localhost:4235/tools/ponder-lab.html?shell&map' });
  for (let i = 0; i < 100 && !(await js('!!document.querySelector(".leaflet-container")')); i++) await sleep(200); await sleep(3000); };
/* a real press on the first visible button whose text matches */
const pressText = async (re, touch) => {
  const c = await js(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.offsetParent && ${re}.test(x.innerText.replace(/\\s+/g, ' '))); if (!b) return null; b.scrollIntoView({ block: 'nearest' }); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  if (!c) return false;
  if (touch) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
  await sleep(1200); return true;
};
const menuBtn = `(() => { const b = document.querySelector('button svg.lucide-menu, button svg.lucide-x')?.closest('button'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`;
const pressAt = async (c, touch) => { if (!c) return false; if (touch) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 }); await sleep(1000); return true; };
const TOGGLES = [['tiers', '/tier engine|automation/i'], ['importer', '/import/i'], ['borders', '/border/i'], ['heatmap', '/heatmap/i'], ['network', '/network/i'], ['catchment', '/catchment/i'], ['tactical', '/tactical|sector/i']];
const out = { errs };
const run = async (w, touch) => {
  const r = { shots: [] };
  await open();
  if (touch) r.media = await js(`matchMedia('(hover: none)').matches`);
  await shot(`${w}-rest.png`); r.shots.push('rest');
  await pressAt(await js(menuBtn), touch);
  r.menu = await js(`[...document.querySelectorAll('button')].filter((b) => b.offsetParent).map((b) => b.innerText.replace(/\\s+/g, ' ').trim()).filter(Boolean)`);
  await shot(`${w}-menu.png`); r.shots.push('menu');
  for (const [name, re] of TOGGLES) {
    if (!(await js(menuBtn + ' && true')) ) break;
    const opened = await js(`[...document.querySelectorAll('button')].some((x) => x.offsetParent && ${re}.test(x.innerText))`);
    if (!opened) await pressAt(await js(menuBtn), touch);
    if (!(await pressText(re, touch))) { r[name] = 'no button'; continue; }
    await sleep(800); await shot(`${w}-${name}.png`); r.shots.push(name);
    await pressText(re, touch);   // off again
  }
  /* a store's card, through the shop search */
  await open();
  const box = await js(`(() => { const i = document.querySelector('input[aria-label="Find a shop"]'); const q = i.getBoundingClientRect(); return { x: q.left + 40, y: q.top + q.height / 2 }; })()`);
  await pressAt(box, touch); await send('Input.insertText', { text: 'sinar' });
  for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: type === 'keyDown' ? '\r' : undefined });
  await sleep(2200); await shot(`${w}-card.png`); r.shots.push('card');
  return r;
};
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
out.pc = await run('pc', false);
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
out.ph = await run('ph', true);
fs.writeFileSync(path.join(HERE, 'states.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
