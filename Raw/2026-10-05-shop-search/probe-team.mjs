/* 2026-10-05 08:40 - his "for regional command just add selection of team instead to make it simpler" + "test it yourself".
   On the PRODUCTION lab build (kpm dist-ponderlab, ?shell&journey&exp&admin&visits), REAL input through CDP: the Team
   picker is focused and moved with real ArrowDown keys (a native select's popup is not in the page). At 1440 and at 390
   with the touch media ((hover: none) asserted). The lab's teams: MUNTILAN = Budi + Ari (+ Cahyo, typed "muntilan "),
   MAGELANG = Dewi + Rini. Checks: the region pickers are gone; the options are exactly All Teams / MAGELANG / MUNTILAN;
   MUNTILAN = only its salesmen in the panel and on the map, fewer shops in the count (> 0, a floor), the header says it;
   All Teams = everyone back. Usage: node probe-team.mjs -> team.json + t-*.png */
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
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4234);
const prof = path.join(HERE, 'profile-t'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9434', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9434/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 200)); return r.result?.result?.value; };
const shot = async (file) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); };
const open = async () => { await send('Page.navigate', { url: 'about:blank' }); await sleep(100); await send('Page.navigate', { url: 'http://localhost:4234/tools/ponder-lab.html?shell&journey&exp&admin&visits' });
  for (let i = 0; i < 100 && !(await js('!!document.querySelector(".leaflet-container")')); i++) await sleep(200); await sleep(3000); };
const key = async (k, code, vk) => { for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: k, code, windowsVirtualKeyCode: vk }); await sleep(120); };
/* what the screen says right now */
const STATE = `(() => { const sel = document.querySelector('select[aria-label="Team"]');
  const count = (document.querySelector('.kx-feed-count')?.textContent || '').match(/(\\d+)\\/(\\d+)/);
  const panel = document.querySelector('.kx-panel, [class*="kx-exp"]');
  const names = [...document.querySelectorAll('.kx-nm')].filter((e) => e.offsetParent).map((e) => e.childNodes[0]?.textContent.trim()).filter(Boolean);
  return { team: sel?.value, options: sel ? [...sel.options].map((o) => o.textContent) : null, shops: count ? +count[2] : null,
    panelNames: [...new Set(names)],
    /* men stand inside the cluster bubbles at this zoom (the first run counted 0 .kx-sm both times): read the initials the
       map prints anywhere (chips, men, crowds) instead */
    mapInitials: [...new Set((document.querySelector('.leaflet-container')?.innerText || '').match(/\\b(AR|BS|CP|DW|RS)\\b/g) || [])].sort(),
    meta: document.querySelector('.kx-feed-meta.hidden')?.textContent || document.querySelectorAll('.kx-feed-meta')[1]?.textContent || '',
    regionPickers: document.querySelectorAll('select[aria-label="Province"], select[aria-label="Kabupaten"], select[aria-label="Kecamatan"]').length }; })()`;
const run = async (w, touch) => {
  const r = {};
  await open();
  if (touch) { r.media = await js(`matchMedia('(hover: none)').matches`); await js(`document.querySelector('.kx-feed-head button')?.click(); 1`); await sleep(500); }
  r.all = await js(STATE);
  await js(`document.querySelector('select[aria-label="Team"]').focus(); 1`);
  await key('ArrowDown', 'ArrowDown', 40); await key('ArrowDown', 'ArrowDown', 40); await sleep(1500);
  r.picked = await js(STATE);
  await shot(`t-${w}.png`);
  await key('ArrowUp', 'ArrowUp', 38); await key('ArrowUp', 'ArrowUp', 38); await sleep(1500);
  r.back = await js(STATE);
  return r;
};
const out = { errs };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
out.pc = await run('pc', false);
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
out.phone = await run('ph', true);
const MUN = ['Budi Santoso', 'Ari Rahman', 'Cahyo Putra'];
out.pass = {};
for (const k of ['pc', 'phone']) { const r = out[k];
  out.pass[k] = {
    regionPickersGone: r.all.regionPickers === 0,
    options: JSON.stringify(r.all.options) === JSON.stringify(['All Teams', 'MAGELANG', 'MUNTILAN']),
    pickedMuntilan: r.picked.team === 'MUNTILAN',
    onlyItsSalesmen: r.picked.panelNames.length > 0 && r.picked.panelNames.every((n) => MUN.includes(n)) && !r.picked.panelNames.some((n) => /Dewi|Rini/.test(n)),
    fewerShops: r.picked.shops > 0 && r.picked.shops < r.all.shops,
    mapOnlyItsMen: r.all.mapInitials.some((i) => ['DW', 'RS'].includes(i)) ? r.picked.mapInitials.length > 0 && !r.picked.mapInitials.some((i) => ['DW', 'RS'].includes(i)) : `unchecked - no DW/RS initials on the map with All Teams (${r.all.mapInitials})`,
    headerSaysIt: k === 'phone' || /MUNTILAN/.test(r.picked.meta),
    allBack: r.back.team === 'All' && r.back.shops === r.all.shops && JSON.stringify(r.back.mapInitials) === JSON.stringify(r.all.mapInitials),
  }; }
out.pass.phoneMedia = out.phone.media === true;
out.pass.noErrors = errs.length === 0;
fs.writeFileSync(path.join(HERE, 'team.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.pass), '\n', JSON.stringify({ pc: { all: out.pc.all, picked: out.pc.picked }, ph: { picked: out.phone.picked } }));
ws.close(); chrome.kill(); server.close(); await sleep(800);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* closing */ }
process.exit(0);
