// node board.mjs [probe]  (lab running on 4190) -> <v>-*.png + board.html + board.png
// His 2026-11-03: "why is the button become like this". The real SIMPAN TRANSAKSI button on the real manifest paper, reached
// by the real steps (a product in the cart, a shop picked, a photo set on the hidden input), Indonesian, phone and PC. Each
// option is CSS swapped onto that button. No amber slab (2026-08-21, 2026-10-31, 2026-11-02); depth only as a border (Lite
// Mode strips shadows); it belongs to the paper (2026-11-03 PHOTO CORNER).
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const PROBE = process.argv[2] === 'probe';
const INK = '#2a2118', BROWN = '#3e3226', CREAM = '#efe4c8', BLOOD = '#6e1a14';
const B = 'button[data-mission="4"]';
const BASE = `${B}{white-space:nowrap!important;font-family:Georgia,'Times New Roman',serif!important;font-weight:700!important;font-size:15px!important;letter-spacing:.12em!important;min-height:48px!important;padding:0 10px!important;border-radius:0!important;box-shadow:none!important;background-image:none!important;transition:translate 90ms ease-out,background-color 120ms ease-out!important}
  ${B}:active{translate:0 1px}
  ${B}:disabled{background:transparent!important;color:#6b5a44!important;border:1px solid rgba(62,50,38,.4)!important}
  ${B} > svg{flex:none}
  @media (min-width:1024px){${B}{min-height:56px!important;font-size:16px!important}}`;
const V = {
  today: '',
  a: `${BASE}
    ${B}:enabled{background:${INK}!important;color:${CREAM}!important;border:1px solid ${INK}!important;outline:1px solid rgba(239,228,200,.5);outline-offset:-5px}
    ${B}:enabled > svg{fill:#e0a030!important;color:#e0a030!important}
    ${B}:enabled:active{background:${BROWN}!important}
    ${B}[data-retur]:enabled{background:${BLOOD}!important;border-color:${BLOOD}!important}
    ${B}[data-retur]:enabled > svg{fill:none!important;color:${CREAM}!important}`,
  b: `${BASE}
    ${B}:enabled{background:transparent!important;color:${INK}!important;border:4px double ${INK}!important}
    ${B}:enabled > svg{fill:${INK}!important;color:${INK}!important}
    ${B}:enabled:active{background:rgba(62,50,38,.16)!important}
    ${B}[data-retur]:enabled{color:${BLOOD}!important;border-color:${BLOOD}!important}
    ${B}[data-retur]:enabled > svg{fill:none!important;color:${BLOOD}!important}`,
  c: `${BASE}
    ${B}:enabled{background:rgba(62,50,38,.06)!important;color:${INK}!important;border:2px solid ${INK}!important}
    ${B}:enabled > svg{width:34px!important;height:34px!important;padding:7px;border-radius:50%;background:#d9941a;fill:${INK}!important;color:${INK}!important;border:2px solid rgba(42,33,24,.55)}
    ${B}:enabled:active{background:rgba(62,50,38,.16)!important}
    ${B}[data-retur]:enabled{color:${BLOOD}!important;border-color:${BLOOD}!important}
    ${B}[data-retur]:enabled > svg{background:${BLOOD};fill:none!important;color:${CREAM}!important}`,
};
const BUILT = process.argv[2] === 'built';
if (BUILT) { for (const k of Object.keys(V)) delete V[k]; V.built = ''; }
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, '--hide-scrollbars', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 400000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable'); await send('Runtime.enable'); await send('DOM.enable'); await send('CSS.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', 'id'); } catch (e) {}` });

const state = () => ev(`(() => { const b = document.querySelector('${B}'); if (!b) return null; const r = b.getBoundingClientRect(), s = getComputedStyle(b);
  const tops = new Set(); const walk = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); while (walk.nextNode()) { if (!walk.currentNode.textContent.trim()) continue; const range = document.createRange(); range.selectNodeContents(walk.currentNode); [...range.getClientRects()].forEach((x) => tops.add(Math.round(x.top))); }
  return { text: b.innerText.replace(/\\s+/g, ' ').trim(), disabled: b.disabled, cust: 'cust' in b.dataset, cart: 'cart' in b.dataset, photo: 'photo' in b.dataset, retur: 'retur' in b.dataset,
    w: Math.round(r.width), h: Math.round(r.height), lines: tops.size, overflow: b.scrollWidth > b.clientWidth + 1, font: s.fontFamily.slice(0, 24), rajdhani: document.fonts.check('700 13px Rajdhani') }; })()`);

/* the real steps to a ready button */
const open = async (w, h, phone, extra = '') => {
  await send('Storage.clearDataForOrigin', { origin: 'http://localhost:4190', storageTypes: 'local_storage,indexeddb' }).catch(() => {});
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: phone });
  await send('Emulation.setTouchEmulationEnabled', { enabled: phone, maxTouchPoints: 5 });
  await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&terminal&many&promo&admin' + extra });
  await ev(`(async () => { for (let i = 0; i < 120 && !document.querySelector('[data-guide="products"] button'); i++) await new Promise((r) => setTimeout(r, 150)); })()`); await sleep(1200);
  const out = { first: await state() };
  out.products = await ev(`[...document.querySelectorAll('[data-guide="products"] button')].slice(0, 6).map((b) => (b.getAttribute('aria-label') || b.innerText).replace(/\\s+/g, ' ').slice(0, 38))`);
  /* a product into the cart: the first ware that is not a bundle offer */
  out.ware = await ev(`(() => { const b = [...document.querySelectorAll('[data-guide="products"] button')].find((e) => e.innerText.trim() === '+' && e.offsetParent !== null); if (!b) return null; b.click(); return 'plus'; })()`); await sleep(700);
  out.sheet = await ev(`[...document.querySelectorAll('[role=dialog] button, .kpm-sheet button')].map((b) => (b.getAttribute('aria-label') || b.innerText).replace(/\\s+/g, ' ').slice(0, 24)).slice(0, 12)`);
  out.afterWare = await state();
  if (phone) { await ev(`document.querySelector('[aria-label^="Manifest,"]')?.click()`); await sleep(1000); }
  /* a shop: the manifest's Nama Pelanggan press, then the first row of the list */
  out.custBtn = await ev(`(() => { const e = [...document.querySelectorAll('button, input')].find((x) => /Choose customer|Ketuk untuk memilih pelanggan/i.test(x.placeholder || x.innerText || x.getAttribute('aria-label') || '') && x.offsetParent !== null); if (!e) return null; e.click(); e.focus?.(); return (e.placeholder || e.innerText || e.getAttribute('aria-label')).replace(/\\s+/g, ' ').slice(0, 40); })()`); await sleep(800);
  out.shops = await ev(`[...document.querySelectorAll('[data-guide="shops"] button')].slice(0, 5).map((b) => b.innerText.replace(/\\s+/g, ' ').slice(0, 30))`);
  out.shop = await ev(`(() => { const b = [...document.querySelectorAll('[data-guide="shops"] button')].find((e) => /TOKO BERKAH/i.test(e.innerText)); if (!b) return null; b.click(); return b.innerText.replace(/\\s+/g, ' ').slice(0, 30); })()`); await sleep(900);
  out.afterShop = await state();
  /* the photo: the app's own capture handler, through its hidden input */
  if (phone) { await ev(`(() => { if (!document.querySelector('[data-guide="photo"]')) document.querySelector('[aria-label^="Manifest,"]')?.click(); })()`); await sleep(1000); }
  out.photoSpot = await ev(`({ btn: !!document.querySelector('[data-guide="photo"]'), input: !!document.getElementById('txProof'), manifest: [...document.querySelectorAll('[aria-label^="Manifest"]')].map((e) => e.getAttribute('aria-label').slice(0, 40)) })`);
  const inp = (await send('DOM.querySelector', { nodeId: (await send('DOM.getDocument', { depth: 0 })).result.root.nodeId, selector: '#txProof' })).result.nodeId;
  out.inp = inp || null;
  /* this lab tier has no gallery picker: the real camera sheet, on Chrome's fake camera */
  if (!inp) {
    await ev(`document.querySelector('[data-guide="photo"]').click()`); await sleep(2500);
    out.camButtons = await ev(`[...document.querySelectorAll('button')].filter((b) => b.closest('.fixed') && b.offsetParent !== null).map((b) => (b.getAttribute('aria-label') || b.innerText).replace(/\\s+/g, ' ').slice(0, 30)).slice(-8)`);
    out.shutter = await ev(`(() => { const b = [...document.querySelectorAll('button')].filter((e) => e.closest('.fixed') && e.offsetParent !== null).find((e) => /ambil|capture|jepret|take|shutter/i.test(e.getAttribute('aria-label') || e.innerText)); if (!b) return null; b.click(); return (b.getAttribute('aria-label') || b.innerText).slice(0, 30); })()`); await sleep(1500);
  }
  if (inp) { const set = await send('DOM.setFileInputFiles', { nodeId: inp, files: [resolve(DIR, '../2026-11-03-paper-key/key-today.png')] }); out.setErr = set.error?.message || null;
    await ev(`(async () => { for (let i = 0; i < 60 && !document.querySelector('.kpm-photo img'); i++) await new Promise((r) => setTimeout(r, 100)); })()`); await sleep(500); }
  out.afterPhoto = await state();
  return out;
};

const style = async (css) => { await ev(`(() => { let s = document.getElementById('v'); if (!s) { s = document.createElement('style'); s.id = 'v'; document.head.append(s); } s.textContent = ${JSON.stringify(css)}; })()`); await sleep(350); };
const snap = async (name, box) => { const f = `${DIR}${name}.png`; rmSync(f, { force: true });
  const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return statSync(f).size; };
const around = (pad, up, down) => ev(`(async () => { document.querySelector('${B}').scrollIntoView({ block: 'center' }); await new Promise((d) => setTimeout(d, 200)); const r = document.querySelector('${B}').getBoundingClientRect(); return { x: Math.max(0, r.x - ${pad}), y: Math.max(0, r.y - ${up}), width: Math.min(innerWidth, r.width + ${pad} * 2), height: r.height + ${up} + ${down} }; })()`);
const press = async (on) => { const root = (await send('DOM.getDocument', { depth: 0 })).result.root.nodeId; const node = (await send('DOM.querySelector', { nodeId: root, selector: B })).result.nodeId;
  await send('CSS.forcePseudoState', { nodeId: node, forcedPseudoClasses: on ? ['active'] : [] }); await sleep(300); };

const log = {};
if (PROBE) { log.pc = await open(1440, 900, false);
  const f = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(DIR + 'debug-pc.png', Buffer.from(f.result.data, 'base64'));
  log.rect = await ev(`(() => { const r = document.querySelector('${B}').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, iw: innerWidth, ih: innerHeight }; })()`);
  console.log(JSON.stringify(log)); console.log('errors', errors.slice(0, 3)); ws.close(); chrome.kill(); process.exit(0); }
log.phone = await open(375, 812, true);

for (const [k, css] of Object.entries(V)) {
  await style(css);
  log[k] = { ready: await state() };
  await snap(`${k}-phone-screen`, { x: 0, y: 0, width: 375, height: 812 });
  const box = await around(8, 96, 10);
  await snap(`${k}-phone-ready`, box);
  await press(true); await snap(`${k}-phone-held`, box); await press(false);
}
/* no photo yet: the button says why, dim */
await open(375, 812, true);
await ev(`document.querySelector('.kpm-photo button, button.absolute.top-2')?.click()`); await sleep(500);
log.dimState = await state();
for (const [k, css] of Object.entries(V)) { await style(css); await snap(`${k}-phone-dim`, await around(8, 8, 10)); }
/* retur */
await open(375, 812, true);
log.returBtn = await ev(`(() => { const b = document.querySelector('[data-guide="sale-mode"]')?.nextElementSibling; if (!b) return null; b.click(); return b.innerText.replace(/\\s+/g, ' ').slice(0, 30); })()`); await sleep(900);
log.returReason = await ev(`(() => { const s = document.querySelector('[data-guide="reason"]'); if (!s) return null; Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(s, s.options[1].value); s.dispatchEvent(new Event('change', { bubbles: true })); return s.value; })()`); await sleep(700);
log.returState = await state();
for (const [k, css] of Object.entries(V)) { await style(css); await snap(`${k}-phone-retur`, await around(8, 8, 10)); }
/* Lite Mode: the app's own class strips shadows and motion */
await open(375, 812, true, '&lite');
log.liteOn = await ev(`document.documentElement.className.slice(0, 60)`);
for (const [k, css] of Object.entries(V)) { await style(css); await snap(`${k}-phone-lite`, await around(8, 8, 10)); }
/* PC: his screenshot's width */
log.pcSteps = await open(1440, 900, false);
for (const [k, css] of Object.entries(V)) {
  await style(css);
  log[k].pc = await state();
  await snap(`${k}-pc-ready`, await around(14, 96, 10));
}
log.errors = errors.slice(0, 3);
if (BUILT) {
  const heights = await ev(`(() => { const s = getComputedStyle(document.querySelector('${B}')); return { minHeight: s.minHeight, font: s.fontFamily.slice(0, 16), border: s.borderTopStyle + ' ' + s.borderTopWidth, bg: s.backgroundColor }; })()`);
  console.log(JSON.stringify({ phone: log.built.ready, pc: log.built.pc, computedPc: heights, dim: log.dimState, retur: log.returState, liteOn: log.liteOn, errors: log.errors }));
  const row = (t, f) => `<div class="f"><div class="s">${t}</div><img src="built-${f}.png"></div>`;
  writeFileSync(DIR + 'built-board.html', `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#14161a;color:#e8e2d4;font:18px/1.35 "Segoe UI",sans-serif;width:1300px}
.wrap{padding:24px}h1{margin:0 0 14px;font-size:26px;color:#e9b949}.row{display:grid;grid-template-columns:repeat(3,400px);gap:18px 22px;align-items:start}.f img{display:block;width:400px;border:1px solid #2a2d33}.s{font-size:14px;color:#a8a090;margin:0 0 4px}</style></head><body><div class="wrap">
<h1>B - Rubber stamp, as built (real terminal, Indonesian)</h1><div class="row">${row('Ready, phone', 'phone-ready')}${row('Held down', 'phone-held')}${row('Not ready: it says why', 'phone-dim')}${row('Retur mode', 'phone-retur')}${row('Lite Mode on', 'phone-lite')}${row('PC', 'pc-ready')}</div></div></body></html>`);
  await send('Page.navigate', { url: pathToFileURL(DIR + 'built-board.html').href }); await sleep(1200);
  await send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await send('Emulation.setDeviceMetricsOverride', { width: 1300, height: 700, deviceScaleFactor: 1, mobile: false });
  const bh = await ev('document.body.scrollHeight');
  await send('Emulation.setDeviceMetricsOverride', { width: 1300, height: bh, deviceScaleFactor: 1, mobile: false }); await sleep(400);
  const bp = DIR + 'built-board.png'; rmSync(bp, { force: true });
  const br = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(bp, Buffer.from(br.result.data, 'base64'));
  console.log(JSON.stringify({ builtBoard: statSync(bp).size, bh })); ws.close(); chrome.kill(); process.exit(0);
}
const short = (k) => ({ phone: log[k].ready, pc: log[k].pc });
console.log(JSON.stringify({ today: short('today'), a: short('a'), b: short('b'), c: short('c'), dim: log.dimState, returBtn: log.returBtn, retur: log.returState, returReason: log.returReason, liteOn: log.liteOn, errors: log.errors }));

const cell = (k, row) => `<img src="${k}-${row}.png">`;
const col = (k, t, c) => `<div class="f"><div class="t${k === 'today' ? '' : ' a'}">${t}</div><p class="c">${c}</p>
  <div class="s">Ready to save, phone</div>${cell(k, 'phone-ready')}
  <div class="s">Held down</div>${cell(k, 'phone-held')}
  <div class="s">Not ready: it says why</div>${cell(k, 'phone-dim')}
  <div class="s">Retur mode</div>${cell(k, 'phone-retur')}
  <div class="s">PC, the width of your screenshot</div>${cell(k, 'pc-ready')}
  <div class="s">Lite Mode on</div>${cell(k, 'phone-lite')}
  <div class="s">The whole phone screen</div>${cell(k, 'phone-screen')}</div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#14161a;color:#e8e2d4;font:18px/1.35 "Segoe UI",sans-serif;width:1700px}
.wrap{padding:24px}h1{margin:0 0 4px;font-size:28px;color:#e9b949}.sub{margin:0 0 16px;color:#a8a090}.row{display:flex;gap:22px;align-items:flex-start}
.f{width:400px}.f img{display:block;width:400px;border:1px solid #2a2d33}.t{font-size:16px;font-weight:700;letter-spacing:.06em;color:#a8a090}.t.a{color:#e9b949}
.s{font-size:13px;color:#a8a090;margin:14px 0 4px}.c{margin:4px 0 0;color:#fff;font-size:16px;min-height:92px}</style></head><body><div class="wrap">
<h1>The save button on the manifest paper - 3 ways (real terminal, Indonesian)</h1>
<p class="sub">Each one is the real button with new CSS, on the real paper, reached by the real steps. No big amber fill.</p>
<div class="row">${col('today', 'TODAY', 'The amber fill. On PC the longer word wraps to 2 lines, the button grows from 68 to 100 px, and the bolt is pushed to the edge.')}
${col('a', 'A - PRINTED BLOCK (my pick)', 'A solid block of black ink, the same black as the photo corners, with a thin line inside. Only the bolt is amber. It matches the dark MODE switch at the top of this paper.')}
${col('b', 'B - RUBBER STAMP', 'No fill, a double ink line like a stamped form box. It looks the most like the paper, and it is the easiest of the three to overlook.')}
${col('c', 'C - WAX SEAL', 'A plain ink frame with a small amber wax seal holding the bolt. Keeps a bright amber spark, as a small mark, not a big fill.')}</div></div></body></html>`;
writeFileSync(DIR + 'board.html', html);
await send('Page.navigate', { url: pathToFileURL(DIR + 'board.html').href }); await sleep(1500);
await send('Emulation.setTouchEmulationEnabled', { enabled: false });
await send('Emulation.setDeviceMetricsOverride', { width: 1700, height: 900, deviceScaleFactor: 1, mobile: false });
const h = await ev('document.body.scrollHeight');
await send('Emulation.setDeviceMetricsOverride', { width: 1700, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(500);
const png = DIR + 'board.png'; rmSync(png, { force: true });
const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(png, Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ board: statSync(png).size, h }));
ws.close(); chrome.kill(); process.exit(0);
