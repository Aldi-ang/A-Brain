/* 2026-10-05 19:55 - his "show me first and let me review": the Day Replay in FULLSCREEN drawn two ways (A bar / B side
   column) out of the REAL app on the lab build - the real replay panel, player, card and fullscreen Expedition list, moved
   into the fullscreen map by DOM + inline CSS for the frame only. Nothing in the app changes; these are drafts for his pick.
   Frames: fs-A-pc.png, fs-A-pc-card.png, fs-B-pc.png, fs-B-pc-card.png, fs-ph.png, fs-ph-card.png. Usage: node draw-fullscreen.mjs */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '../../../kpm-inventory-main'), DIST = path.join(SRC, 'dist-ponderlab');
const newest = (dir) => fs.readdirSync(dir, { recursive: true }).filter((f) => /\.(jsx?|css)$/.test(f)).reduce((m, f) => Math.max(m, fs.statSync(path.join(dir, f)).mtimeMs), 0);
if (Math.max(newest(path.join(SRC, 'src')), newest(path.join(SRC, 'tools'))) > fs.statSync(path.join(DIST, 'tools/ponder-lab.html')).mtimeMs) { console.log('STALE LAB BUNDLE - build first'); process.exit(1); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => { const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4214);
const prof = path.join(HERE, 'profile-fs'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9414', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9414/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(), errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 200)); return r.result?.result?.value; };
const shot = async (file) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); console.log('shot', file); };
const waitFor = async (e, ms = 20000) => { for (let t = 0; t < ms; t += 150) { if (await js(e)) return true; await sleep(150); } return false; };
const at = (sel, re) => js(`(() => { const e = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => ${re || '/./'}.test(x.textContent) && x.getClientRects().length); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
const press = async (sel, re, phone) => { const c = await at(sel, re); if (!c) throw new Error('no ' + sel + ' ' + re); await sleep(150);
  if (phone) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
  await sleep(700); };
const RP = `document.querySelector('.kx-rp').__rp`;
await send('Page.enable'); await send('Runtime.enable');

/* open Budi's replay, freeze it mid request scene (stop 8, 1.1 s), optionally with Toko Berkah Jaya's card open, then fullscreen */
const setup = async (phone, card) => {
  await send('Page.navigate', { url: 'about:blank' }); await sleep(100);
  await send('Page.navigate', { url: 'http://localhost:4214/tools/ponder-lab.html?shell&journey&exp&admin' });
  await waitFor('!!document.querySelector(".kx-map .leaflet-marker-icon")'); await sleep(1200);
  await press(phone ? '.kx-pick button' : '.kx-row', phone ? '/BS/' : '/Budi/', phone);
  await press('.kx-rp-go', null, phone);
  await waitFor(`!!(document.querySelector('.kx-rp') && document.querySelector('.kx-rp').__rp && document.querySelector('.kx-rp').__rp.tl)`, 8000); await sleep(800);
  const r = await js(`(() => { const rp = ${RP}; const want = rp.tl.sceneSeg(8).t0 + 1100; rp.seek(want, false); return Math.abs(rp.t.current - want) < 1; })()`);
  if (!r) throw new Error('seek did not take');
  await sleep(500);
  if (card) { await js(`window.scrollTo(0, 0); 1`); const c = await js(`(() => { const e = [...document.querySelectorAll('.kx-rp-mk')].find((x) => x.querySelector('.kx-snm i')?.textContent === 'Toko Berkah Jaya'); const b = e.querySelector('.art').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (phone) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
    else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
    await sleep(800); }
  await js(`[...document.querySelectorAll('.k-full')].find((b) => b.offsetParent)?.click(); 1`); await sleep(1800);
  /* the Replay key the fullscreen list would get (his 19:50 answer) */
  await js(`(() => { const host = document.querySelector('.kx-mini') || document.querySelector('.kx-mbar'); if (!host) return 0; const b = document.querySelector('.kx-rp-go')?.cloneNode(true) || Object.assign(document.createElement('button'), { className: 'kx-rp-go', innerHTML: '<svg viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z"/></svg>Replay his day' }); b.innerHTML = '<svg viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z"/></svg>Replay his day'; b.style.marginTop = '6px'; b.setAttribute('aria-pressed', 'true'); b.style.borderColor = '#E4B04A'; host.append(b); return 1; })()`);
};

/* A - the player as a bar along the map's bottom; the card under the Expedition list (PC) / a sheet (phone) */
const lookA = (phone) => js(`(() => {
  const map = document.querySelector('.kx-map'), p = document.querySelector('.kx-rp'), player = p.querySelector('.kx-rp-player');
  const bar = document.createElement('div'); bar.className = 'kx-rp'; map.append(bar); bar.append(player);
  const dock = document.querySelector('.kx-dock'), dockTop = dock && dock.getClientRects().length ? innerHeight - dock.getBoundingClientRect().top + 8 : 16;
  bar.style.cssText = 'position:absolute;z-index:10000;left:${phone ? 8 : 16}px;right:${phone ? 8 : 232}px;bottom:' + dockTop + 'px;background:var(--panel);border:1px solid var(--line-3);border-radius:14px;padding:10px 14px;box-shadow:0 8px 28px rgba(0,0,0,.55)';
  player.style.cssText = ${phone ? `'display:grid;gap:4px'` : `'display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:18px;row-gap:2px;align-items:center'`};
  const q = (s) => player.querySelector(s);
  ${phone ? `q('.kx-rp-note').style.display = 'none'; q('.kx-roadsw').style.margin = '0';`
    : `Object.assign(q('.kx-rp-tl').style, { gridColumn: '1', gridRow: '1' }); Object.assign(q('.kx-rp-hours').style, { gridColumn: '1', gridRow: '2' });
       Object.assign(q('.kx-rp-ctl').style, { gridColumn: '2', gridRow: '1 / span 2', flexWrap: 'nowrap' }); Object.assign(q('.kx-roadsw').style, { gridColumn: '2', gridRow: '3', margin: '0', justifySelf: 'end' });
       Object.assign(q('.kx-rp-note').style, { gridColumn: '1', gridRow: '3' });`}
  const card = p.querySelector('.kx-rp-card:not(.now)');
  if (card) { ${phone ? `const sh = document.createElement('div'); sh.className = 'kx-rp'; sh.style.cssText = 'position:absolute;z-index:10001;left:0;right:0;bottom:0;padding:14px 12px 22px;background:var(--panel);border-top:1px solid var(--line-3);border-radius:16px 16px 0 0;box-shadow:0 -10px 30px rgba(0,0,0,.6)'; map.append(sh); sh.append(card);`
    : `const mini = document.querySelector('.kx-mini'); const w = document.createElement('div'); w.className = 'kx-rp'; w.style.marginTop = '8px'; w.append(card); mini.append(w);`} }
  return 1; })()`);

/* B - the whole replay panel as a column on the map's right, the Expedition list on top of it */
const lookB = () => js(`(() => {
  const map = document.querySelector('.kx-map'), p = document.querySelector('.kx-rp'), keys = document.querySelector('.kx-keys'), mini = document.querySelector('.kx-mini');
  map.append(p); p.style.cssText = 'position:absolute;z-index:10000;top:0;right:0;bottom:0;width:380px;height:auto;border-radius:0;border-width:0 0 0 1px;overflow-y:auto';
  if (mini) { mini.style.width = 'auto'; mini.style.marginBottom = '4px'; p.prepend(mini); }
  if (keys) keys.style.right = '396px';
  return 1; })()`);

/* PC 1440 */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await setup(false, false); await lookA(false); await sleep(400); await shot('fs-A-pc.png');
await setup(false, true); await lookA(false); await sleep(400); await shot('fs-A-pc-card.png');
await setup(false, false); await lookB(); await sleep(400); await shot('fs-B-pc.png');
await setup(false, true); await lookB(); await sleep(600); await shot('fs-B-pc-card.png');
/* phone 390 - A and B are the same here */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
await setup(true, false); console.log('phone media', await js(`matchMedia('(hover: none)').matches`)); await lookA(true); await sleep(400); await shot('fs-ph.png');
await setup(true, true); await lookA(true); await sleep(400); await shot('fs-ph-card.png');
console.log('errors', JSON.stringify(errs));
ws.close(); chrome.kill(); server.close(); process.exit(0);
