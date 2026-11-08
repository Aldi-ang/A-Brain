// node looks.mjs  (lab on 4190) -> the Same as last time buttons, today and two drawn looks, phone + PC (head from 2026-11-06 walk.mjs)
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 240000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push(r.result.exceptionDetails.exception?.description || 'eval'); return r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });

/* THE TWO "SAME AS LAST TIME" BUTTONS, on the real terminal in the lab: today's amber gradient and two drawn looks, the no-fill one first (his 2026-11-08 pick of
   the quietest tab look over my plate). Only the button's paint changes: same box, same 2px border, nothing that moves. */
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell&terminal&many&promo&admin&history';
const SEL = 'button[class*="from-[var(--duke-amber)]"]';
const LOOKS = {
  today: '',
  edge: `${SEL} { background: transparent !important; background-image: none !important; border-color: var(--accent-edge) !important; color: var(--ink) !important; box-shadow: none !important; }`,
  plate: `${SEL} { position: relative; background: var(--raised) !important; background-image: none !important; border-color: var(--line) !important; color: var(--accent-ink) !important; box-shadow: none !important; }`,
};
const toShop = async (phone) => {
  await send('Storage.clearDataForOrigin', { origin: 'http://localhost:4190', storageTypes: 'local_storage,indexeddb' }).catch(() => {});
  await send('Emulation.setDeviceMetricsOverride', phone ? { width: 390, height: 844, deviceScaleFactor: 2, mobile: true } : { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setTouchEmulationEnabled', { enabled: phone, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: phone ? [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] : [] });
  await send('Page.navigate', { url: LAB });
  await ev(`(async () => { for (let i = 0; i < 120 && !document.querySelector('[data-guide="products"] button'); i++) await new Promise((r) => setTimeout(r, 150)); })()`); await sleep(1200);
  if (phone) { await ev(`document.querySelector('[aria-label^="Manifest,"]')?.click()`); await sleep(1000); }
  await ev(`(() => { const e = [...document.querySelectorAll('button, input')].find((x) => /Choose customer|Ketuk untuk memilih pelanggan/i.test(x.placeholder || x.innerText || x.getAttribute('aria-label') || '') && x.offsetParent !== null); e?.click(); })()`); await sleep(900);
  const shop = await ev(`(() => { const b = [...document.querySelectorAll('[data-guide="shops"] button')].find((e) => /TOKO BERKAH/i.test(e.innerText)); if (!b) return 'NONE: ' + [...document.querySelectorAll('[data-guide="shops"] button')].map((e) => e.innerText.split(String.fromCharCode(10))[0]).slice(0, 12).join(' | '); b.click(); return b.innerText.replace(/\\s+/g, ' ').slice(0, 30); })()`); await sleep(1500);
  if (phone) { await ev(`document.querySelector('[aria-label^="Manifest,"]')?.click()`); await sleep(1000); }
  return shop;
};
const find = () => ev(`(async () => { const bs = [...document.querySelectorAll(${JSON.stringify(SEL)})].filter((b) => b.offsetParent); bs[0]?.scrollIntoView({ block: 'center' }); await new Promise((r) => setTimeout(r, 400)); return bs.map((b) => { const r = b.getBoundingClientRect(), c = b.parentElement.getBoundingClientRect(), s = getComputedStyle(b); return { text: b.innerText.trim(), disabled: b.disabled, btn: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)].join('/'), card: { x: Math.max(0, Math.round(c.left) - 12), y: Math.max(0, Math.round(Math.min(c.top, r.top - 150)) - 12), width: Math.min(innerWidth, Math.round(c.width) + 24), height: Math.round(r.bottom - Math.min(c.top, r.top - 150)) + 24 }, bg: s.backgroundImage.slice(0, 30) + ' ' + s.backgroundColor, ink: s.color, edge: s.borderColor }; }); })()`);
const out = { phone: {}, pc: {} };
for (const phone of [true, false]) {
  const key = phone ? 'phone' : 'pc';
  out[key].shop = await toShop(phone);
  for (const [name, css] of Object.entries(LOOKS)) {
    await ev(`(() => { document.getElementById('draw')?.remove(); const s = document.createElement('style'); s.id = 'draw'; s.textContent = ${JSON.stringify(css)}; document.head.appendChild(s); })()`); await sleep(350);
    const b = await find();
    out[key][name] = b.map(({ card, ...rest }) => rest);
    if (b[0]) { const f = `${DIR}${key}-${name}.png`; rmSync(f, { force: true }); const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...b[0].card, scale: 1 } }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); }
  }
}
out.samePlace = ['phone', 'pc'].every((k) => new Set(['today', 'edge', 'plate'].map((n) => JSON.stringify((out[k][n] || []).map((b) => b.btn)))).size === 1);
const rows = [['today', 'Today: amber gradient'], ['edge', '1  No fill: gold edge, plain word'], ['plate', '2  Dark plate, gold word']];
writeFileSync(DIR + 'board.html', `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#141210;color:#e8e4dc;font:600 15px Segoe UI,sans-serif;padding:16px}h2{font-size:15px;margin:14px 0 6px}.r{display:flex;gap:16px;align-items:flex-start}.r div{display:flex;flex-direction:column;gap:4px}small{color:#a79f93;font-weight:500}img{display:block;border:1px solid #3a3530}.p{width:320px}.c{width:520px}</style>` +
  rows.map(([k, t]) => `<h2>${t}</h2><div class="r"><div><small>Phone</small><img class="p" src="phone-${k}.png"></div><div><small>PC</small><img class="c" src="pc-${k}.png"></div></div>`).join(''));
await send('Emulation.setDeviceMetricsOverride', { width: 900, height: 600, deviceScaleFactor: 1, mobile: false }); await send('Emulation.setTouchEmulationEnabled', { enabled: false }); await send('Emulation.setEmulatedMedia', { features: [] });
await send('Page.navigate', { url: 'file:///' + (DIR + 'board.html').replace(/\\/g, '/') }); await sleep(900);
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); rmSync(DIR + 'board.png', { force: true }); writeFileSync(DIR + 'board.png', Buffer.from(shot.result.data, 'base64'));
out.errors = errors;
console.log(JSON.stringify(out, null, 1));
chrome.kill(); process.exit(0);
