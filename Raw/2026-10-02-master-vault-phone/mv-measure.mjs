/* Master Vault on the phone - MEASURE before drawing (his 2026-10-01: "the mastervault need to be redesign and make it
   compatible on the phone, and make sure all the features is there, and the picture insert submission for the 3D
   cigarette box is incompatible in phone as well"). The REAL built app on the emulator (prod-emu outDir, served by a
   static server here), the owner signed in, the Master Vault tab at 390 css (touch phone) and at 1440. Measures every
   control's size, sideways overflow, and whether a TOUCH drag moves the 3D box and the photo cropper (a mouse drag is the
   control). Frames mv-*.png next to this file. Needs the emulator up and a prod-emu build in the outDir. */
import { spawn, execSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main';
const DIST = 'C:/Users/ASUS/AppData/Local/Temp/kpm-prod-emu';
const BASE = 'http://127.0.0.1:8080/v1/projects/cello-inventory-manager/databases/(default)/documents';
const APP_ID = 'cello-inventory-manager';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(DIST, p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html');
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(f).pipe(res);
}).listen(4175);

const prof = path.join(HERE, 'mv-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9399',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9399/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const log = [];
ws.addEventListener('message', m => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') log.push('EXC ' + (d.params.exceptionDetails.exception?.description || '').slice(0, 160));
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300) : r.result?.result?.value; };
const typeInto = (ph, v) => js(`(() => { const i = document.querySelector('input[placeholder="${ph}"]'); if (!i) return 'no ' + ${JSON.stringify(ph)}; const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ${JSON.stringify(v)}); i.dispatchEvent(new Event('input', { bubbles: true })); return 'ok'; })()`);
const signIn = (sub, email, name) => js(`(async () => { const h = window.__kpmEmulatorAuth; await h.auth.signOut(); const c = await h.signIn(h.auth, h.credential(JSON.stringify({ sub: '${sub}', email: '${email}', email_verified: true, name: '${name}' }))); return c.user.uid; })()`);
const click = (re) => js(`(() => { const b = [...document.querySelectorAll('button, a, [role=button]')].find(x => ${re}.test((x.textContent || '') + ' ' + (x.getAttribute('aria-label') || '') + ' ' + (x.title || ''))); if (!b) return 'none'; b.click(); return 'clicked'; })()`);
const shot = async (name, full = true) => {
  const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full });
  fs.writeFileSync(path.join(HERE, 'mv-' + name + '.png'), Buffer.from(s.result.data, 'base64'));
};
const phone = async () => {
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
};
/* every visible control: size, and whether it pokes out of the viewport sideways */
const audit = () => js(`(() => {
  const vw = innerWidth, out = { vw, docW: document.documentElement.scrollWidth, small: [], offscreen: [], sideScroll: [] };
  for (const e of document.querySelectorAll('button, input, select, textarea, label, [role=button]')) {
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const name = ((e.textContent || '').trim() || e.getAttribute('placeholder') || e.getAttribute('aria-label') || e.title || e.type || e.tagName).slice(0, 28);
    if (e.type !== 'file' && e.type !== 'hidden' && (r.width < 44 || r.height < 44)) out.small.push(name + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    if (r.right > vw + 1 || r.left < -1) out.offscreen.push(name + ' x' + Math.round(r.left) + '-' + Math.round(r.right));
  }
  for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (/(auto|scroll)/.test(cs.overflowX) && e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0) out.sideScroll.push((e.className + '').slice(0, 50) + ' ' + e.clientWidth + '<' + e.scrollWidth); }
  return out; })()`);
const drag = async (kind, x, y, dx, dy) => {
  if (kind === 'touch') {
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 8; i++) { await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 8, y: y + dy * i / 8 }] }); await sleep(30); }
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    for (let i = 1; i <= 8; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x + dx * i / 8, y: y + dy * i / 8, button: 'left', buttons: 1 }); await sleep(30); }
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: x + dx, y: y + dy, button: 'left', clickCount: 1 });
  }
  await sleep(300);
};
const out = {};

await send('Page.enable'); await send('Runtime.enable'); await send('DOM.enable');
/* a virtual fingerprint, or the first-password save waits on this PC's real Windows Hello prompt */
await send('WebAuthn.enable', { enableUI: false });
await send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true } });
await phone();
await send('Page.navigate', { url: 'http://localhost:4175/' });
await sleep(7000);
const owner = await signIn('potato', 'adikaryasukses99@gmail.com', 'Lab Owner');
execSync(`node tools/seed-emulator.mjs --uid ${owner}`, { cwd: REPO, stdio: 'ignore' });
await fetch(`${BASE}/artifacts/${APP_ID}/users/${owner}/settings/admin`, { method: 'DELETE', headers: { Authorization: 'Bearer owner' } });
await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
await send('Page.reload'); await sleep(9000);
await typeInto('CREATE MASTER PASSWORD', 'Owner-Test-1!'); await typeInto('SECRET RECOVERY WORD', 'kopi'); await sleep(300);
out.save = await click('/Save Credentials/i');
for (let i = 0; i < 40; i++) { await sleep(500); if ((await click('/Master Vault/i')) === 'clicked') { out.nav = 'clicked'; break; } }
out.nav = out.nav || 'none';
if (out.nav === 'none') out.navLabels = await js(`[...document.querySelectorAll('nav button, nav a')].map(b => (b.textContent || b.getAttribute('aria-label') || b.title || '').trim().slice(0, 20)).join(' | ')`);
await sleep(4000);
await shot('390-today');
out.audit390 = await audit();

/* the 3D box: drag on the stage, read the box's transform */
const boxT = () => js(`(() => { const e = [...document.querySelectorAll('[style*="preserve-3d"]')][0]; return e ? e.style.transform : 'no box'; })()`);
const stage = await js(`(() => { const e = document.querySelector('.cursor-move'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
if (stage) {
  await sleep(400);
  const s2 = await js(`(() => { const r = document.querySelector('.cursor-move').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
  const t0 = await boxT(); await drag('touch', s2.x, s2.y, 120, 0); const t1 = await boxT();
  await drag('mouse', s2.x, s2.y, 120, 0); const t2 = await boxT();
  out.box = { before: t0, afterTouch: t1, afterMouse: t2, touchMoved: t0 !== t1, mouseMoved: t1 !== t2 };
}

/* the photo: Edit -> the FRONT face tile -> a real file -> the cropper */
out.edit = await click('/^\\s*Edit\\s*$/');
await sleep(1500);
await shot('390-edit', false);
out.auditEdit = await audit();
const docRoot = (await send('DOM.getDocument', { depth: -1 })).result.root.nodeId;
const inp = (await send('DOM.querySelector', { nodeId: docRoot, selector: '#file-edit-front' })).result?.nodeId;
out.fileInput = !!inp;
if (inp) {
  await send('DOM.setFileInputFiles', { nodeId: inp, files: [path.join(REPO, 'public/icon-512.png')] });
  await sleep(2500);
  await shot('390-crop', false);
  out.auditCrop = await audit();
  const imgT = () => js(`(() => { const i = document.querySelector('.fixed img.max-w-none'); return i ? i.style.transform : 'no cropper img'; })()`);
  const area = await js(`(() => { const e = document.querySelector('.fixed .cursor-move'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height }; })()`);
  out.cropArea = area;
  if (area) {
    const c0 = await imgT(); await drag('touch', area.x, area.y, 40, 30); const c1 = await imgT();
    await drag('mouse', area.x, area.y, 40, 30); const c2 = await imgT();
    out.crop = { touchMoved: c0 !== c1, mouseMoved: c1 !== c2 };
  }
  out.saveBtn = await js(`(() => { const b = [...document.querySelectorAll('button')].find(x => /Crop & Save/i.test(x.textContent)); if (!b) return 'none'; const r = b.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight, inView: r.bottom <= innerHeight && r.top >= 0 }; })()`);
  await click('/^\\s*Cancel\\s*$/'); await sleep(800);
  await click('/^$/'); /* noop */
}
/* the desk: a fresh load (the 5-minute pass skips the vault), the tab opened again */
await send('Emulation.setTouchEmulationEnabled', { enabled: false });
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.reload'); await sleep(6000);
for (let i = 0; i < 40; i++) { await sleep(500); if ((await click('/Master Vault/i')) === 'clicked') break; }
await sleep(3000);
await shot('1440-today', false);
out.audit1440 = await audit();
out.log = [...new Set(log)].filter(l => !/PERMISSION_DENIED/.test(l)).slice(0, 8);
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); server.close();
