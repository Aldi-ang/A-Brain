/* t5-stuck (2026-10-06): his "update keep spinning but not finished but ... the app is updated". Build A is served and
   opened twice (the second open is controlled by A's helper); build B lands on the same address; then a HARD refresh
   (Page.reload ignoreCache) - the page loads B from the network with NO controlling helper, so vite-plugin-pwa's
   autoUpdate never reloads it (isUpdate false). The sign-in card's line must not stay on "updating…".
   Prints the line's wordings in order + whether the page reloaded by itself. No emulator needed (the sign-in card).
   Usage: node t5-stuck.mjs   (builds both itself) */
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main';
const VITE = path.join(REPO, 'node_modules/vite/bin/vite.js');
const DIST = 'C:/Users/ASUS/AppData/Local/Temp/kpm-prod-emu';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
const buildWith = (cfg) => execSync(`node "${VITE}" build --mode httpdev --configLoader runner --config "${path.join(HERE, cfg)}"`, { cwd: REPO, stdio: 'ignore' });
let slow = 0;
const server = http.createServer(async (req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(DIST, p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html');
  if (slow && /^\/(assets|sprites|sounds)\//.test(p)) await sleep(slow);
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(f).pipe(res);
}).listen(4176);
buildWith('prod-emu.config.mjs');
const prof = path.join(HERE, 't5stuck-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9399',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9399/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0, loads = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; } if (d.method === 'Page.loadEventFired') loads++; });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
const status = () => js(`(document.querySelector('[role=status]')?.innerText || '').split(String.fromCharCode(10)).join(' ').trim()`);
const watch = async (ms) => { const seen = []; for (let t = 0; t < ms; t += 200) { const s = await status(); if (s && seen[seen.length - 1] !== s) seen.push(s); await sleep(200); } return seen; };
await send('Page.enable'); await send('Runtime.enable');
await send('Page.navigate', { url: 'http://localhost:4176/' }); await sleep(5000);
await send('Page.reload'); await sleep(1500);
const a = await watch(5000);
const ctlA = await js('!!navigator.serviceWorker.controller');
buildWith('prod-emu-b.config.mjs'); slow = 300;
const before = loads;
await send('Page.reload', { ignoreCache: true });   /* the hard refresh: B from the network, no controlling helper */
const b = await watch(30000);
const out = { A: a, controlledOnA: ctlA, B: b, selfReloadsAfterHardRefresh: loads - before - 1, endsLatest: /Latest version/.test(b[b.length - 1] || ''), stuck: /updating/.test(b[b.length - 1] || '') };
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); server.close(); process.exit(0);
