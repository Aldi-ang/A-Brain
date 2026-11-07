// node tabs-looks.mjs  (kpm-emulator + kpm-dev-http on 5174) -> the REAL Stock Opname tabs, today and two drawn looks for the chosen tab,
// dark and light, PC and phone, with each look's tab positions measured against today's. Nothing in the app is changed: the looks are injected styles.
import { spawn, spawnSync } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const KPM = fileURLToPath(new URL('../../../kpm-inventory-main/', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 300000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text).slice(0, 200)); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push(String(r.result.exceptionDetails.exception?.description || 'eval').slice(0, 200)); return r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
const ORIGIN = 'http://localhost:5174';
const pc = async (w = 1280, h = 800) => { await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false }); await send('Emulation.setTouchEmulationEnabled', { enabled: false }); await send('Emulation.setEmulatedMedia', { features: [] }); };
const phone = async () => { await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }); await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }); await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] }); };
const HELP = `window.__h = (() => { const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const set = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); };
  const btn = (re) => [...document.querySelectorAll('button')].filter((b) => b.offsetParent && re.test((b.getAttribute('aria-label') || b.textContent).trim()));
  const any = (re) => [...document.querySelectorAll('button')].filter((b) => re.test((b.getAttribute('aria-label') || b.textContent).trim()));
  return { sleep, set, btn, any }; })();`;
const load = async () => { await send('Page.navigate', { url: ORIGIN + '/' }); await sleep(900);
  await ev(`(async () => { for (let i = 0; i < 80 && !window.__kpmEmulatorAuth; i++) await new Promise((r) => setTimeout(r, 150)); ${HELP} })()`); };
const ready = () => ev(`(async () => { const { sleep, set, btn, any } = __h; for (let i = 0; i < 60; i++) { const g = document.querySelector('input[placeholder="MASTER PASSWORD"]'); if (g) { set(g, 'Emulator-1!'); await sleep(200); btn(/Open the vault/i)[0].click(); for (let j = 0; j < 60 && document.querySelector('input[placeholder="MASTER PASSWORD"]'); j++) await sleep(300); await sleep(1500); break; } if (any(/^Stok Opname|^Stock Opname/i).length) break; await sleep(300); } await sleep(1200); return any(/^Stok Opname|^Stock Opname/i).length; })()`);
const clip = async (name, rect, scale = 1) => { const f = `${DIR}${name}.png`; rmSync(f, { force: true }); const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...rect, scale } }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return statSync(f).size; };

/* the fake company, fresh in the emulator: the seed's own directory row, a sign-in, then the company under that uid */
spawnSync('node', ['tools/seed-emulator.mjs'], { cwd: KPM });
await pc(); await load();
const uid = await ev(`(async () => { const { auth, credential, signIn } = window.__kpmEmulatorAuth; const r = await signIn(auth, credential(JSON.stringify({ sub: 'g-aldi-local', email: 'adikaryasukses99@gmail.com', email_verified: true }))); return r.user.uid; })()`);
spawnSync('node', ['tools/seed-emulator.mjs', '--uid', uid], { cwd: KPM });
await load(); await ready();
await ev(`(async () => { const { any, btn, sleep } = __h; any(/^Stok Opname|^Stock Opname/i)[0].click(); await sleep(1600); btn(/^HQ Audits/)[0].click(); await sleep(800); })()`);

/* the chosen tab is the one carrying the amber classes today; the drawn looks only restyle that one */
const SEL = `.kpm-opname-tabs button[class*="bg-[var(--gold)]"]`;
const LOOKS = {
  today: '',
  bar: `.kpm-opname-tabs button { position: relative; } ${SEL} { background: var(--raised) !important; color: var(--accent-ink) !important; box-shadow: none !important; } ${SEL}::after { content: ''; position: absolute; left: 10px; right: 10px; bottom: 0; height: 3px; border-radius: 2px 2px 0 0; background: var(--accent-edge); }`,
  line: `.kpm-opname-tabs button { position: relative; } ${SEL} { background: transparent !important; color: var(--ink) !important; box-shadow: none !important; } ${SEL}::after { content: ''; position: absolute; left: 6px; right: 6px; bottom: -1px; height: 2px; background: var(--accent-edge); }`,
};
const look = (css) => ev(`(() => { document.getElementById('draw')?.remove(); const s = document.createElement('style'); s.id = 'draw'; s.textContent = ${JSON.stringify(css)}; document.head.appendChild(s); return true; })()`);
const theme = (light) => ev(`(async () => { document.documentElement.classList.toggle('light', ${light}); await __h.sleep(500); return document.documentElement.classList.contains('light'); })()`);
const where = () => ev(`(() => { const g = document.querySelector('.kpm-opname-tabs').getBoundingClientRect(); const b = [...document.querySelectorAll('.kpm-opname-tabs button')].map((x) => { const r = x.getBoundingClientRect(); return Math.round(r.left) + '/' + Math.round(r.top) + '/' + Math.round(r.width) + 'x' + Math.round(r.height); }).join(' '); const c = document.querySelector('${SEL.replace(/"/g, '\\"')}'); const cs = c && getComputedStyle(c); return { box: { x: Math.round(g.left), y: Math.round(g.top), w: Math.round(g.width), h: Math.round(g.height) }, buttons: b, chosen: cs && { bg: cs.backgroundColor, ink: cs.color } }; })()`);

const out = { uid, pc: {}, phone: {} };
for (const light of [false, true]) {
  await theme(light);
  for (const [name, css] of Object.entries(LOOKS)) {
    await look(css); await sleep(300);
    const w = await where(); out.pc[`${name}-${light ? 'light' : 'dark'}`] = w;
    await clip(`pc-${name}-${light ? 'light' : 'dark'}`, { x: w.box.x - 24, y: w.box.y - 20, width: Math.min(1280 - (w.box.x - 24), w.box.w + 48), height: w.box.h + 40 });
  }
}
await theme(false); await phone(); await sleep(800);
for (const [name, css] of Object.entries(LOOKS)) {
  await look(css); await sleep(300);
  const w = await where(); out.phone[name] = w;
  await clip(`ph-${name}`, { x: 0, y: w.box.y - 16, width: 390, height: w.box.h + 32 });
}
out.samePlace = { pc: new Set(Object.values(out.pc).map((w) => w.buttons)).size === 1, phone: new Set(Object.values(out.phone).map((w) => w.buttons)).size === 1 };

/* the board: one row per look, his eye goes across */
const rows = [['today', 'Today: amber fill'], ['bar', '1  Dark plate + gold bar (your Settings switches)'], ['line', '2  Gold underline (the warehouse tabs below it)']];
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#141210;color:#e8e4dc;font:600 15px Segoe UI,sans-serif;padding:16px}h2{font-size:15px;margin:14px 0 6px}.r{display:flex;gap:14px;align-items:flex-start}.r div{display:flex;flex-direction:column;gap:4px}small{color:#a79f93;font-weight:500}img{display:block;border:1px solid #3a3530}.ph{width:300px}</style>` +
  rows.map(([k, t]) => `<h2>${t}</h2><div class="r"><div><small>PC, dark</small><img src="pc-${k}-dark.png"></div><div><small>PC, light</small><img src="pc-${k}-light.png"></div><div><small>Phone</small><img class="ph" src="ph-${k}.png"></div></div>`).join('');
writeFileSync(DIR + 'board.html', html);
await pc(1560, 560); await send('Page.navigate', { url: 'file:///' + (DIR + 'board.html').replace(/\\/g, '/') }); await sleep(900);
const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); rmSync(DIR + 'board.png', { force: true }); writeFileSync(DIR + 'board.png', Buffer.from(r.result.data, 'base64'));
out.board = statSync(DIR + 'board.png').size;
out.errors = errors;
console.log(JSON.stringify(out, null, 1));
chrome.kill(); process.exit(0);
