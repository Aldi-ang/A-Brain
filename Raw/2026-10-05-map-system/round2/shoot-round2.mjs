/* 2026-10-05 11:30 - his "the fonts is really bad i want u to change it, make sure all the animation is on theme with ours,
   make sure that symbol for wholesale hub is more visible than other stores and i think i need new logo for unranked tier".
   On the PRODUCTION lab build (kpm dist-ponderlab, ?shell&map&admin):
   (1) the real Map System in three display fonts: A = today (the app names Barlow Condensed but never loads it, so Windows
       draws Arial Narrow), B = Barlow Condensed actually loaded (the face every drawing he approved used), C = Rajdhani;
   (2) the key acts sampled on the live page (a real mouse press held 260 ms; Lite Mode = no transform);
   (3) a clean street-level map patch (no UI, no pins) to draw the hub / unranked options on.
   Usage: node shoot-round2.mjs -> font-*.png, ground.png, round2.json */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../../kpm-inventory-main/dist-ponderlab');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => { const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4237);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-r2-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9437', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9437/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value; };
const shot = async (file, clip) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const open = async () => { await send('Page.navigate', { url: 'about:blank' }); await sleep(100); await send('Page.navigate', { url: 'http://localhost:4237/tools/ponder-lab.html?shell&map&admin' });
  for (let i = 0; i < 100 && !(await js('!!document.querySelector(".leaflet-container")')); i++) await sleep(200); await sleep(2500); };
const centre = (sel, re) => js(`(() => { const b = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => { const r = x.getBoundingClientRect(); return r.width > 0 && ${re ? `${re}.test(x.innerText)` : 'true'}; }); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
let touch = false;
const press = async (sel, re) => { const c = await centre(sel, re); if (!c) return false;
  if (touch) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
  await sleep(900); return true; };
const FONTS = { B: ['Barlow+Condensed', 'Barlow Condensed'], C: ['Rajdhani', 'Rajdhani'] };
const useFont = (k) => !FONTS[k] ? js('document.fonts.ready.then(() => getComputedStyle(document.querySelector(".ms-totals b")).fontFamily)') : js(`(async () => {
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=${FONTS[k][0]}:wght@500;600;700;800;900&display=block'; document.head.appendChild(l);
  await new Promise((r) => { l.onload = r; l.onerror = r; });
  const s = document.createElement('style'); s.textContent = ':root { --font-display: "${FONTS[k][1]}", "Arial Narrow", sans-serif !important; }${k === 'C' ? ' :root { --font-mono: "Rajdhani", sans-serif !important; }' : ''}'; document.head.appendChild(s);
  await Promise.all(['900 22px', '800 22px', '700 16px'].map((w) => document.fonts.load(w + ' "${FONTS[k][1]}"'))); await document.fonts.ready; await new Promise((r) => setTimeout(r, 400));
  return [...document.fonts].filter((f) => f.family.includes('${FONTS[k][1]}') && f.status === 'loaded').length + ' faces loaded'; })()`);
const out = { errs, fonts: {} };
await send('Page.enable'); await send('Runtime.enable');

/* (1) fonts - PC: the top bar, the totals and the top areas */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
for (const k of ['A', 'B', 'C']) { await open(); out.fonts['pc' + k] = await useFont(k); await shot(`font-${k}-pc.png`, { x: 0, y: 0, width: 900, height: 372 }); }

/* (2) the acts, sampled 260 ms into a held press (mouse) on a fresh page each (a tool key opens its window over the bar), then Lite Mode */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const sample = async (sel, part, lite) => {
  await open(); if (lite) await js(`document.documentElement.classList.add('lite-mode')`);
  const c = await centre(sel); if (!c) return 'no key';
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 450 }); await sleep(300);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c.x, y: c.y }); await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: c.x, y: c.y, button: 'left', clickCount: 1 }); await sleep(260);
  /* Lite Mode: the pose may snap, but nothing may MOVE - read the running animations and the transition time instead */
  const t = await js(lite ? `(() => { const e = document.querySelector(${JSON.stringify(sel + ' ' + part)}); return 'running ' + document.getAnimations().filter((a) => a.playState === 'running' && e.closest('button').contains(a.effect?.target)).length + ', transition ' + getComputedStyle(e).transitionDuration; })()`
    : `getComputedStyle(document.querySelector(${JSON.stringify(sel + ' ' + part)})).transform`);
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: c.x, y: c.y, button: 'left', clickCount: 1 }); await sleep(500);
  if (lite) await js(`document.documentElement.classList.remove('lite-mode')`);
  return t; };
out.acts = {
  borders: await sample('.ms-layers .m-bord', 'svg path:nth-child(2)'), heat: await sample('.ms-layers .m-heat', 'svg path'),
  supply: await sample('.ms-layers .m-supply', 'svg circle:last-of-type'), catchment: await sample('.ms-layers .m-catch', 'svg circle:last-child'),
  tier: await sample('.ms-tools .m-tier', 'svg path'), setup: await sample('.ms-tools .m-imp', 'svg path:nth-child(3)'), sector: await sample('.ms-tools .m-sector', 'svg path'),
  liteSupply: await sample('.ms-layers .m-supply', 'svg circle:last-of-type', true),
};
await open();

/* (3) a clean street-level patch: fly to a shop, hide every overlay and marker */
await press('input[aria-label="Find a shop"]'); await send('Input.insertText', { text: 'sinar' });
for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: type === 'keyDown' ? '\r' : undefined }); await sleep(2500);
await js(`(() => { const s = document.createElement('style'); s.textContent = '.ms-top, .ms-totals, .ms-card, .ms-levels, .ms-layers, .ms-tools, .ms-store, .ms-heatkey, .leaflet-marker-pane, .leaflet-shadow-pane, .leaflet-tooltip-pane, .leaflet-control-container, .fixed { display: none !important; }'; document.head.appendChild(s); })()`); await sleep(600);
await shot('ground.png', { x: 520, y: 300, width: 720, height: 360 });

/* (1b) fonts - phone: the Areas sheet over the dock */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
touch = true;
for (const k of ['A', 'B', 'C']) { await open(); await press('.ms-dock .kx-mapkey', '/areas/i'); out.fonts['ph' + k] = await useFont(k); await shot(`font-${k}-ph.png`, { x: 0, y: 380, width: 390, height: 464 }); }

fs.writeFileSync(path.join(HERE, 'round2.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
