/* Phone sweep, the screens it had not reached (NEXT-SESSION 2026-10-02 08:20): Command Center, Map System, Reports,
   Settings, and the Leaderboard (Hall of Fame) inside Agent Profile. Same method as mv-measure.mjs: the REAL built app
   (prod-emu outDir) on the emulator, the owner signed in, each screen at 390 css with touch via CDP device metrics (never
   a window crop - a wider frame re-lays-out and hides the defect), scrolled top to bottom in viewport frames, plus one
   1440 frame. audit() per screen: controls under 44 px, anything cut by the screen edge, any sideways scroll. Controls
   seen on EVERY screen are the shell (already swept) and are dropped from the per-screen lists.
   Needs: firebase emulators:start --only auth,firestore, and the prod-emu build in DIST. Frames ps-*.png beside this. */
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
const SCREENS = [
  { key: 'dash', tab: /^\s*Command Center\s*$/i },
  { key: 'map', tab: /^\s*Map System\s*$/i },
  { key: 'reports', tab: /^\s*Reports\s*$/i },
  { key: 'settings', tab: /^\s*Settings\s*$/i },
  { key: 'fame', tab: /^\s*Agent Profile\s*$/i, then: /Leaderboard/i },
  /* what a phone user opens from those screens (run with ONLY=...) */
  { key: 'dashtarget', tab: /^\s*Command Center\s*$/i, then: /Konfigurasi Target/i },
  { key: 'mapmenu', tab: /^\s*Map System\s*$/i, thenJs: `(() => { const b = document.querySelector('svg.lucide-menu')?.closest('button'); if (!b) return 'none'; b.click(); return 'clicked'; })()` },
  { key: 'repanalytics', tab: /^\s*Reports\s*$/i, then: /Context Analytics/i },
  { key: 'settiers', tab: /^\s*Settings\s*$/i, then: /^\s*Tiers & Logic\s*$/i },
  { key: 'setsecurity', tab: /^\s*Settings\s*$/i, then: /^\s*Security & Data\s*$/i },
  { key: 'setarch', tab: /^\s*Settings\s*$/i, then: /^\s*Architect/i },
  /* Reports with rows in it: the seeded sales are 2-4 days old (last month), so the range goes to Yearly first */
  { key: 'repyear', tab: /^\s*Reports\s*$/i, print: true, thenJs: `(async () => {
      const back = [...document.querySelectorAll('button')].find(x => /Back to Folders/i.test(x.innerText)); if (back) { back.click(); await new Promise(r => setTimeout(r, 800)); }
      const s = [...document.querySelectorAll('select')].find(x => x.querySelector('option[value=yearly]')); if (!s) return 'no range select';
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(s, 'yearly'); s.dispatchEvent(new Event('change', { bubbles: true })); await new Promise(r => setTimeout(r, 500)); [...document.querySelectorAll('button')].find(x => /Pull Archive/i.test(x.innerText))?.click(); await new Promise(r => setTimeout(r, 2500));
      await new Promise(r => setTimeout(r, 800)); const b = [...document.querySelectorAll('button')].find(x => /Context Analytics/i.test(x.innerText)); if (!b) return 'no analytics button'; b.click(); return 'clicked'; })()` },
  /* one store's ledger: region -> agent -> province -> regency -> district -> store, preferring the seeded HQ shop */
  { key: 'repstore', tab: /^\s*Reports\s*$/i, thenJs: `(async () => { const has = () => [...document.querySelectorAll('th')].some(t => /Date \\/ Time/.test(t.textContent));
      const pref = [/\\bHEADQUARTERS\\b/, /BUDI SANTOSO/, /TOKO MAKMUR/];
      const back = [...document.querySelectorAll('button')].find(x => /Back to Folders/i.test(x.innerText)); if (back) { back.click(); await new Promise(r => setTimeout(r, 800)); }
      const s = [...document.querySelectorAll('select')].find(x => x.querySelector('option[value=yearly]')); if (!s) return 'no range select';
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(s, 'yearly'); s.dispatchEvent(new Event('change', { bubbles: true })); await new Promise(r => setTimeout(r, 500)); [...document.querySelectorAll('button')].find(x => /Pull Archive/i.test(x.innerText))?.click(); await new Promise(r => setTimeout(r, 2500)); await new Promise(r => setTimeout(r, 800));
      const trail = []; for (let i = 0; i < 8 && !has(); i++) { const cards = [...document.querySelectorAll('div.cursor-pointer.rounded-2xl')].filter(d => d.getBoundingClientRect().height > 40);
        if (!cards.length) return 'no cards at step ' + i + ': ' + trail.join(' > '); const c = pref.map(re => cards.find(d => re.test(d.innerText))).find(Boolean) || cards[0];
        trail.push(c.innerText.trim().split('\\n')[0].slice(0, 24)); c.click(); await new Promise(r => setTimeout(r, 900)); }
      return has() ? 'clicked' : 'no ledger: ' + trail.join(' > '); })()` },
].filter(s => !process.env.ONLY || process.env.ONLY.split(',').includes(s.key));
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* TAG=after keeps a second set of frames + results beside TODAY's instead of deleting them */
const TAG = process.env.TAG ? process.env.TAG + '-' : '';
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(DIST, p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(DIST, 'index.html');
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(f).pipe(res);
}).listen(4175);

for (const f of fs.readdirSync(HERE)) if (/^ps-.*\.png$/.test(f) && SCREENS.some(s => f.startsWith('ps-' + TAG + s.key + '-'))) fs.rmSync(path.join(HERE, f), { force: true });
const prof = path.join(HERE, 'ps-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9401',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9401/json/list')).json(); } catch { /* not up */ } }
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
const click = (re) => js(`(() => { const b = [...document.querySelectorAll('button, a, [role=button]')].find(x => [(x.innerText || x.textContent || '').trim(), x.getAttribute('aria-label') || '', x.title || ''].some(t => ${re}.test(t))); if (!b) return 'none'; b.click(); return 'clicked'; })()`);
const shot = async (name) => {
  const s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(HERE, 'ps-' + TAG + name + '.png'), Buffer.from(s.result.data, 'base64'));
};
const phone = async () => {
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
};
/* the element that scrolls the screen: the page itself, or the tallest inner scroller */
/* an open full-screen sheet (the Leaderboard) scrolls itself, not the page behind it */
const SHEET = `document.querySelector('.fixed.inset-0.overflow-y-auto')`;
const SCROLLER = `(() => { const o = ${SHEET}; if (o) return o; const d = document.scrollingElement; if (d.scrollHeight > innerHeight + 4) return d;
  let best = null; for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (/(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 4 && e.clientHeight > innerHeight * 0.5 && (!best || e.scrollHeight > best.scrollHeight)) best = e; } return best || d; })()`;
/* every visible control: size, cut by the screen edge, sideways scroll. Fully off-canvas (a closed drawer) is listed apart. */
const audit = () => js(`(() => {
  const vw = innerWidth, vh = innerHeight, out = { vw, docW: document.documentElement.scrollWidth, small: [], cut: [], offCanvas: [], sideScroll: [], tall: 0 };
  for (const e of (${SHEET} || document).querySelectorAll('button, input, select, textarea, label, a[href], [role=button]')) {
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
    const name = ((e.innerText || '').trim().replace(/\\s+/g, ' ') || e.getAttribute('placeholder') || e.getAttribute('aria-label') || e.title || e.type || e.tagName).slice(0, 28);
    if (r.right <= 0 || r.left >= vw) { out.offCanvas.push(name); continue; }
    if (e.type !== 'file' && e.type !== 'hidden' && (r.width < 44 || r.height < 44)) out.small.push(name + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    if (r.right > vw + 1 || r.left < -1) out.cut.push(name + ' x' + Math.round(r.left) + '-' + Math.round(r.right));
  }
  for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (/(auto|scroll)/.test(cs.overflowX) && e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0) out.sideScroll.push((e.className + '').slice(0, 50) + ' ' + e.clientWidth + '<' + e.scrollWidth); }
  /* table cells the phone does not show: past the screen edge, or past the box that clips them */
  out.hiddenCells = 0; for (const c of document.querySelectorAll('td, th')) { const r = c.getBoundingClientRect(); if (!r.width || !r.height) continue; let lim = vw;
    for (let p = c.parentElement; p; p = p.parentElement) if (/(auto|scroll|hidden)/.test(getComputedStyle(p).overflowX)) { lim = Math.min(lim, p.getBoundingClientRect().right); break; }
    if (r.right > lim + 1) out.hiddenCells++; }
  const s = ${SCROLLER}; out.tall = +(s.scrollHeight / (s.clientHeight || vh)).toFixed(1);
  /* text that is too small to read on a phone: count of visible text nodes under 11 px */
  let tiny = 0; for (const e of document.querySelectorAll('body *')) { if (!e.childNodes.length || ![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue; const r = e.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > s.scrollHeight) continue; if (parseFloat(getComputedStyle(e).fontSize) < 11) tiny++; }
  out.tinyText = tiny;
  return out; })()`);
/* the screen from top to bottom, one viewport frame per step, max 6 */
const walk = async (key) => {
  const n = await js(`(() => { const s = ${SCROLLER}; s.scrollTop = 0; return Math.min(6, Math.ceil(s.scrollHeight / (s.clientHeight || innerHeight))); })()`);
  for (let i = 0; i < n; i++) {
    await js(`(() => { const s = ${SCROLLER}; s.scrollTop = ${i} * (s.clientHeight || innerHeight) * 0.9; return 1; })()`);
    await sleep(700);
    await shot(`${key}-390-${i}`);
  }
  await js(`(() => { const s = ${SCROLLER}; s.scrollTop = 0; return 1; })()`);
  return n;
};
const open = async (sc) => {
  let r = 'none';
  for (let i = 0; i < 30; i++) { r = await click(sc.tab); if (r === 'clicked') break; await sleep(500); }
  await sleep(4000);
  if (sc.thenJs) { r = await js(sc.thenJs); await sleep(2500); }
  if (sc.then) { r = 'then-none'; for (let i = 0; i < 20; i++) { if ((await click(sc.then)) === 'clicked') { r = 'clicked'; break; } await sleep(500); } await sleep(2500); }
  return r;
};
const out = { screens: {} };

await send('Page.enable'); await send('Runtime.enable'); await send('DOM.enable');
await send('WebAuthn.enable', { enableUI: false });
await send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true } });
await phone();
await send('Page.navigate', { url: 'http://localhost:4175/' });
await sleep(7000);
const owner = await signIn('potato', 'adikaryasukses99@gmail.com', 'Lab Owner');
execSync(`node tools/seed-emulator.mjs --uid ${owner}`, { cwd: REPO, stdio: 'ignore' });
/* sales dated TODAY with a timestamp: the seed's are September and carry none, and the app's live query (ordered by time)
   never loads them - Reports had no rows to measure. Long names and big sums on purpose: the phone layout must hold them. */
{
  const tv = (v) => typeof v === 'number' ? { integerValue: String(v) } : Array.isArray(v) ? { arrayValue: { values: v.map(tv) } }
    : typeof v === 'object' ? { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, tv(x)])) } } : { stringValue: String(v) };
  const today = new Date().toLocaleDateString('sv-SE');
  const line = (productId, name, qty, price) => ({ productId, name, qty, unit: 'Bks', priceTier: 'Retail', calculatedPrice: price });
  const sales = [
    { id: 'lab_t1', customerName: 'TOKO MAKMUR JAYA', paymentType: 'Titip', agentId: 'm_budi', total: 12850000,
      items: [line('p_surya12', 'SURYA 12', 240, 27500), line('p_surya16', 'SURYA 16', 120, 35000), line('p_gudgar', 'GUDANG GARAM FI', 30, 30500)] },
    { id: 'lab_t2', customerName: 'TOKO MAKMUR JAYA', paymentType: 'Cash', agentId: 'm_budi', total: 1225000, items: [line('p_surya16', 'SURYA 16', 35, 35000)] },
    { id: 'lab_t3', customerName: 'WARUNG BERKAH', paymentType: 'Cash', agentId: 'm_budi', total: 550000, items: [line('p_surya12', 'SURYA 12', 20, 27500)] },
  ];
  for (const [i, s] of sales.entries()) {
    const f = Object.fromEntries(Object.entries({ ...s, date: today }).map(([k, x]) => [k, tv(x)]));
    f.timestamp = { timestampValue: new Date(Date.now() - i * 3600e3).toISOString() };
    await fetch(`${BASE}/artifacts/${APP_ID}/users/${owner}/transactions/${s.id}`, { method: 'PATCH', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: f }) });
  }
}
await fetch(`${BASE}/artifacts/${APP_ID}/users/${owner}/settings/admin`, { method: 'DELETE', headers: { Authorization: 'Bearer owner' } });
await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
await send('Page.reload'); await sleep(9000);
await typeInto('CREATE MASTER PASSWORD', 'Owner-Test-1!'); await typeInto('SECRET RECOVERY WORD', 'kopi'); await sleep(300);
out.save = await click('/Save Credentials/i');
await sleep(3000);
if (process.env.LIGHT) { out.light = await click('/Switch to Light Mode/i'); await sleep(1500); }

for (const sc of SCREENS) {
  const o = out.screens[sc.key] = {};
  o.open = await open(sc);
  /* a missed tap measures whatever screen was already up - five "screens" with one audit. Stop instead. */
  if (o.open !== 'clicked') { console.error(sc.key + ' did not open: ' + o.open); chrome.kill(); server.close(); process.exit(1); }
  o.audit = await audit();
  o.frames = await walk(sc.key);
}
/* drop the shell: a control present on every screen */
const keys = Object.keys(out.screens);
if (keys.length > 1) for (const f of ['small', 'cut']) {
  const common = keys.map(k => new Set(out.screens[k].audit[f] || [])).reduce((a, b) => new Set([...a].filter(x => b.has(x))));
  out.shell = { ...(out.shell || {}), [f]: [...common] };
  for (const k of keys) out.screens[k].audit[f] = (out.screens[k].audit[f] || []).filter(x => !common.has(x));
}
/* the desk: one frame per screen */
await send('Emulation.setTouchEmulationEnabled', { enabled: false });
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.reload'); await sleep(8000);
for (const sc of SCREENS) {
  out.screens[sc.key].open1440 = await open(sc);
  await shot(`${sc.key}-1440`);
  const a = await audit(); out.screens[sc.key].desk = { docW: a.docW, cut: a.cut.length, sideScroll: a.sideScroll.length, hiddenCells: a.hiddenCells, tall: a.tall };
  /* the printed PDF: A4's printable width (~718 css px at default margins - md: does NOT apply), print media - the product table's cell boxes must not move when the phone layout changes */
  if (sc.print) {
    await send('Emulation.setDeviceMetricsOverride', { width: 718, height: 1000, deviceScaleFactor: 1, mobile: false });
    await send('Emulation.setEmulatedMedia', { media: 'print' }); await sleep(800);
    /* every box in the printed sheet, relative to it: header, stat cards, product table, agent roster */
    out.screens[sc.key].print = await js(`(() => { const p = document.querySelector('.print-container'); if (!p) return 'no print container'; const r0 = p.getBoundingClientRect();
      return { w: Math.round(r0.width), h: Math.round(r0.height), boxes: [...p.querySelectorAll('*')].slice(0, 160).map(e => { const r = e.getBoundingClientRect();
        return e.tagName + ' ' + [r.left - r0.left, r.top - r0.top, r.width, r.height].map(Math.round).join(','); }) }; })()`);
    await shot(`${sc.key}-print`);
    await send('Emulation.setEmulatedMedia', { media: '' });
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  }
  if (sc.then || sc.thenJs) await send('Page.reload'), await sleep(8000);
}
out.log = [...new Set(log)].filter(l => !/PERMISSION_DENIED/.test(l)).slice(0, 8);
fs.writeFileSync(path.join(HERE, 'ps-result' + (process.env.ONLY ? '-' + process.env.ONLY : '') + (process.env.TAG ? '-' + process.env.TAG : '') + '.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); server.close();
