/* mv-walk.mjs - his pick C + the cropper on the built app, 390 touch + 1440 (setup copied from mv-measure.mjs).
 Master Vault on the phone - MEASURE before drawing (his 2026-10-01: "the mastervault need to be redesign and make it
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

const prof = path.join(HERE, 'mv2-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9400',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9400/json/list')).json(); } catch { /* not up */ } }
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
const shot = async (name, full = false) => {
  const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full });
  fs.writeFileSync(path.join(HERE, 'mv2-' + name + '.png'), Buffer.from(s.result.data, 'base64'));
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

/* ---- mv-walk: his pick C + the cropper, walked on the built app (2026-10-02). Setup above is mv-measure.mjs's. ---- */
const pinch = async (x, y, from, to) => {
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x - from, y, id: 1 }, { x: x + from, y, id: 2 }] });
  for (let i = 1; i <= 8; i++) { const s = from + (to - from) * i / 8; await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x - s, y, id: 1 }, { x: x + s, y, id: 2 }] }); await sleep(30); }
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(300);
};
const visible = (sel) => js(`(() => { const e = document.querySelector('${sel}'); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; })()`);
const rowsSideScroll = () => js(`[...document.querySelectorAll('[id^=mv-row-] *')].filter(e => e.scrollWidth > e.clientWidth + 2 && /(auto|scroll)/.test(getComputedStyle(e).overflowX)).length`);

await send('Page.enable'); await send('Runtime.enable'); await send('DOM.enable');
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
await sleep(3500);

/* 1. the list, full width */
out.searchBoxes = await js(`document.querySelectorAll('input[placeholder*="Search"]').length`);
out.rows = await js(`document.querySelectorAll('[id^=mv-row-]').length`);
out.rowsVisibleInView = await js(`[...document.querySelectorAll('[id^=mv-row-]')].filter(r => { const b = r.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0; }).length`);
out.rowSideScroll = await rowsSideScroll();
out.stageHiddenOnList = !(await visible('.cursor-move'));
await js(`document.querySelector('[id^=mv-row-]').scrollIntoView({ block: 'start' }), 1`); await sleep(300);
await shot('390-list');

/* 2. tap a product -> its own screen */
await js(`document.querySelector('[id^=mv-row-]').click(), 1`); await sleep(800);
out.productOpen = { stage: await visible('.cursor-move'), listHidden: !(await visible('[id^=mv-row-]')), back: await js(`!![...document.querySelectorAll('button')].find(b => /^\\s*Back\\s*$/.test(b.textContent) && b.getBoundingClientRect().width)`) };
await shot('390-product');
const boxT = () => js(`(() => { const e = document.querySelector('.cursor-move [style*="preserve-3d"]'); return e ? e.style.transform : 'no box'; })()`);
const st = await js(`(() => { const r = document.querySelector('.cursor-move').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, h: Math.round(r.height) }; })()`);
const t0 = await boxT(); await drag('touch', st.x, st.y, 120, 0); const t1 = await boxT();
out.box = { stageH: st.h, before: t0, afterTouch: t1, touchTurns: t0 !== t1 };
out.fold = await js(`(() => { const d = [...document.querySelectorAll('details')].find(x => /3D size/.test(x.textContent) && x.getBoundingClientRect().width); if (!d) return 'none'; d.querySelector('summary').click(); return d.open ? 'opens' : 'stays shut'; })()`);
await sleep(300);
out.prices = await js(`['Dist','Retail','Grosir','Ecer'].every(p => document.body.innerText.includes(p.toUpperCase()) || document.body.innerText.includes(p))`);
await shot('390-product-size');

/* 3. Back -> the list again, at the row */
await click('/^\\s*Back\\s*$/'); await sleep(700);
out.back = { list: await visible('[id^=mv-row-]'), stageHidden: !(await visible('.cursor-move')) };

/* 4. Edit -> FRONT photo -> the cropper */
await js(`document.querySelector('[id^=mv-row-]').click(), 1`); await sleep(700);
out.edit = await click('/^\\s*Edit\\s*$/'); await sleep(1500);
const docRoot = (await send('DOM.getDocument', { depth: -1 })).result.root.nodeId;
const inp = (await send('DOM.querySelector', { nodeId: docRoot, selector: '#file-edit-front' })).result?.nodeId;
if (inp) {
  await send('DOM.setFileInputFiles', { nodeId: inp, files: [path.join(REPO, 'public/icon-512.png')] });
  await sleep(2500);
  await shot('390-crop');
  const imgT = () => js(`(() => { const i = document.querySelector('.fixed img.max-w-none'); return i ? i.style.transform : 'none'; })()`);
  const boxW = () => js(`(() => { const i = document.querySelector('.fixed img.max-w-none'); return i ? Math.round(i.parentElement.parentElement.getBoundingClientRect().width) : 0; })()`);
  const zoomTxt = () => js(`(document.body.innerText.match(/(\\d+\\.\\d\\d)x/i) || [])[1] || 'none'`);   /* innerText is the RENDERED text: the label is uppercase */
  const area = await js(`(() => { const e = document.querySelector('.fixed .cursor-move'); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: Math.round(r.width), h: Math.round(r.height) }; })()`);
  out.photoArea = area;
  const c0 = await imgT(); await drag('touch', area.x + 60, area.y - 60, 40, 30); const c1 = await imgT();
  const w0 = await boxW();
  const hr = await js(`(() => { const h = document.querySelector('.fixed .cursor-ew-resize').getBoundingClientRect(); return { x: h.x + h.width / 2, y: h.y + h.height / 2, w: Math.round(h.width) }; })()`);
  await drag('touch', hr.x, hr.y, -40, 0); const w1 = await boxW();
  const z0 = await zoomTxt(); await pinch(area.x, area.y, 30, 90); const z1 = await zoomTxt();
  out.crop = { touchPans: c0 !== c1, handleSize: hr.w, handleResizes: w0 !== w1, boxW: [w0, w1], pinch: [z0, z1], pinchZooms: z0 !== z1 && parseFloat(z1) > parseFloat(z0) };
  out.cropSave = await js(`(() => { const b = [...document.querySelectorAll('button')].find(x => /Crop & Save/i.test(x.textContent)); const r = b.getBoundingClientRect(); const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { bottom: Math.round(r.bottom), vh: innerHeight, inView: r.bottom <= innerHeight, onTop: b.contains(hit) }; })()`);
  out.toolsKept = await js(`['Zoom','Rotate','3D size','Cancel','Crop & Save'].filter(t => !document.body.innerText.toLowerCase().includes(t.toLowerCase()))`);
  await shot('390-crop-after-moves');
  await click('/^\\s*Cancel\\s*$/'); await sleep(600);
}

/* 5. the desk: both side by side, every tool there */
await send('Emulation.setTouchEmulationEnabled', { enabled: false });
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.reload'); await sleep(6000);
for (let i = 0; i < 40; i++) { await sleep(500); if ((await click('/Master Vault/i')) === 'clicked') break; }
await sleep(3000);
out.desk = { list: await visible('[id^=mv-row-]'), stage: await visible('.cursor-move'), rowSideScroll: await rowsSideScroll(),
  tools: await js(`({ search: document.querySelectorAll('input[placeholder*="Search"]').length, add: !![...document.querySelectorAll('button')].find(b => /Add/.test(b.textContent) && b.getBoundingClientRect().width), edit: !![...document.querySelectorAll('button')].find(b => /^Edit$/.test(b.textContent.trim()) && b.getBoundingClientRect().width), discard: !![...document.querySelectorAll('button')].find(b => /Discard/.test(b.textContent) && b.getBoundingClientRect().width), size: !![...document.querySelectorAll('.controls-panel button')].find(b => b.getBoundingClientRect().width), bgUpload: !!document.querySelector('label input[type=file][accept="image/*"]') })`) };
/* probes: who wins display on the Back button at 1440, and what a mouse drag reaches */
out.desk.backBtn = await js(`(() => { const b = [...document.querySelectorAll('button')].find(x => /^\\s*Back\\s*$/.test(x.textContent)); if (!b) return 'none';
  const rules = []; for (const s of document.styleSheets) { let rs; try { rs = s.cssRules; } catch { continue; } const walk = (list, media) => { for (const r of list) { if (r.cssRules && r.media) walk(r.cssRules, r.media.mediaText); else if (r.selectorText && r.style?.display && b.matches(r.selectorText)) rules.push((media ? '@' + media + ' ' : '') + r.selectorText + '{display:' + r.style.display + (r.style.getPropertyPriority('display') ? ' !important' : '') + '}'); } }; walk(rs, ''); }
  return { display: getComputedStyle(b).display, cls: b.className, rules }; })()`);
const s0 = await js(`(() => { const r = document.querySelector('.cursor-move').getBoundingClientRect(); const x = r.x + r.width / 2, y = r.y + r.height / 2; const h = document.elementFromPoint(x, y); return { x, y, hit: h.tagName + '.' + (h.className + '').slice(0, 40) }; })()`);
await js(`window.__pe = []; ['pointerdown','pointermove','pointerup','mousedown'].forEach(t => document.addEventListener(t, e => window.__pe.push(t + ':' + (e.target.className + '').slice(0, 20)), true)), 1`);
const d0 = await boxT(); await drag('mouse', s0.x, s0.y, 120, 0); const d1 = await boxT();
out.desk.mouse = { hit: s0.hit, before: d0, after: d1, events: await js(`[...new Set(window.__pe)].slice(0, 8)`) };
out.desk.mouseTurns = d0 !== d1;
await shot('1440');
out.log = [...new Set(log)].filter(l => !/PERMISSION_DENIED/.test(l)).slice(0, 8);
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); server.close();
