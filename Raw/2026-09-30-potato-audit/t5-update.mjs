/* t5-update: "is this the latest version?" on the sign-in card and the vault (his 2026-10-01 pick B). Build A: the
   sign-in card and the vault read "Latest version"; build B on the same address: the old copy's vault reads "New version
   found - updating…" and the page reloads itself into B, which reads "Latest version" with B's id. Frames t5upd-*.png
   (390 css @2x, clipped to the card). Needs build A in the outDir (vite build --mode httpdev --configLoader runner
   --config prod-emu.config.mjs) and the emulator up. Built from t5-push.mjs. */
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main';
const VITE = path.join(REPO, 'node_modules/vite/bin/vite.js');
const BASE = 'http://127.0.0.1:8080/v1/projects/cello-inventory-manager/databases/(default)/documents';
const APP_ID = 'cello-inventory-manager';
const PW = 'Budi-Test-1!';
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* Our own static server for the outDir instead of vite preview: it reads files at request time (build B lands without a
   restart) and can be SLOW - a phone downloads the new build for seconds, which is when "updating…" is on screen. */
import http from 'node:http';
const DIST = 'C:/Users/ASUS/AppData/Local/Temp/kpm-prod-emu';
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
let slow = 0;
const server = http.createServer(async (req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(DIST, p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html');
  if (slow && p === '/sw.js') await sleep(1500);
  else if (slow && /^\/(assets|sprites|sounds)\//.test(p)) await sleep(slow);
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(f).pipe(res);
}).listen(4175);
await sleep(300);
const prof = path.join(HERE, 't5upd-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9398',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9398/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const log = []; let loads = 0;
ws.addEventListener('message', m => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Page.loadEventFired') loads++;
  if (d.method === 'Runtime.exceptionThrown') log.push(`[${loads}] EXC ` + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 200));
  if (d.method === 'Runtime.consoleAPICalled' && /error/.test(d.params.type)) log.push(`[${loads}] ${d.params.type} ` + d.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 200));
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300) : r.result?.result?.value; };
const typeInto = (ph, v) => js(`(() => { const i = document.querySelector('input[placeholder="${ph}"]'); if (!i) return 'no ' + ${JSON.stringify(ph)}; const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ${JSON.stringify(v)}); i.dispatchEvent(new Event('input', { bubbles: true })); return 'ok'; })()`);
const signIn = (sub, email, name) => js(`(async () => { const h = window.__kpmEmulatorAuth; await h.auth.signOut(); const c = await h.signIn(h.auth, h.credential(JSON.stringify({ sub: '${sub}', email: '${email}', email_verified: true, name: '${name}' }))); return c.user.uid; })()`);
const build = () => js(`[...document.scripts].map(s => s.src.match(/index-[^.]+/)?.[0]).filter(Boolean).join() + ' sw:' + !!navigator.serviceWorker.controller`);
const status = () => js(`(document.querySelector('[role=status]')?.innerText || '').split(String.fromCharCode(10)).join(' ').trim()`);
const out = { states: [] };
const shotCard = async (name, sel) => {
  const r = await js(`(() => { const e = document.querySelector('${sel}'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; })()`);
  const clip = r && r.w ? { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: r.w + 16, height: r.h + 16, scale: 1 } : undefined;
  const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip } : {}) });
  fs.writeFileSync(path.join(HERE, 't5upd-' + name + '.png'), Buffer.from(s.result.data, 'base64'));
};
/* poll the line; shoot the first frame of every new wording */
const watch = async (ms, sel, tag) => {
  const seen = new Set();
  for (let t = 0; t < ms; t += 150) {
    const s = await status();
    if (s && !seen.has(s)) { seen.add(s); out.states.push(`${tag}: ${s}`); await sleep(400); await shotCard(`${tag}-${seen.size}`, sel); }
    await sleep(150);
  }
};
const gateCard = 'form:has(input[placeholder="MASTER PASSWORD"])';

await send('Page.enable'); await send('Runtime.enable');
await send('WebAuthn.enable', { enableUI: false });
await send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true } });
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: 'http://localhost:4175/' });
await sleep(4000);
await send('Page.reload');   /* the second open is the one the helper controls */
await watch(6000, '.kpm-mod.gate', 'A-signin');
const owner = await signIn('potato', 'adikaryasukses99@gmail.com', 'Lab Owner');
execSync(`node tools/seed-emulator.mjs --uid ${owner}`, { cwd: REPO, stdio: 'ignore' });
const row = { fields: { email: { stringValue: 'budi.test@example.com' }, role: { stringValue: 'TIER_5' }, userRole: { stringValue: 'TIER_5' },
  bossUid: { stringValue: owner }, agentId: { stringValue: 'm_budi' }, name: { stringValue: 'BUDI SANTOSO' }, status: { stringValue: 'ACTIVE' } } };
await fetch(`${BASE}/artifacts/${APP_ID}/employee_directory/${encodeURIComponent('budi.test@example.com')}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' }, body: JSON.stringify(row) });
await fetch(`${BASE}/artifacts/${APP_ID}/users/${owner}/vault_keys/m_budi`, { method: 'DELETE', headers: { Authorization: 'Bearer owner' } });
await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
await signIn('budi', 'budi.test@example.com', 'Budi Santoso');
await sleep(9000);
await typeInto('CREATE MASTER PASSWORD', PW); await typeInto('SECRET RECOVERY WORD', 'kopi'); await sleep(300);
out.save = await js(`(() => { const b = [...document.querySelectorAll('button')].find(x => /Save Credentials/i.test(x.textContent)); if (!b) return 'no button'; b.click(); return 'clicked'; })()`);
await sleep(6000);
await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
await send('Page.reload'); await sleep(6000);
await watch(5000, gateCard, 'A-vault');

/* the push: B replaces A on the same address, and the vault is opened again */
execSync(`node "${VITE}" build --mode httpdev --configLoader runner --config "${path.join(HERE, 'prod-emu-b.config.mjs')}"`, { cwd: REPO, stdio: 'ignore' });
slow = 700;   /* every new piece takes 0.7 s to arrive (about 6 at a time) */
await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
const before = loads;
await send('Page.reload');
await watch(60000, gateCard, 'B-vault');
out.loadsSinceReopen = loads - before;
out.buildNow = await build();
out.log = [...new Set(log)].filter(l => !/PERMISSION_DENIED|GPS/.test(l));
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); server.close();
