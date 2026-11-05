// node drafts.mjs  (lab running on 4190) -> draft frames + drafts-phone.png + drafts-pc.png + tokens.json
// His 2026-11-05 "professional where real factory and business can use it": three drafts on the REAL screen, phone + PC, Indonesian shell.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 400000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push(r.result.exceptionDetails.exception?.description || 'eval'); return r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', 'id'); } catch (e) {}` });
const BASE = 'http://localhost:4190/tools/ponder-lab.html?shell&opname&admin&tab=hq%20audits&draft=';
const open = async (extra, w, h, phone) => {
  await send('Storage.clearDataForOrigin', { origin: 'http://localhost:4190', storageTypes: 'local_storage,indexeddb' }).catch(() => {});
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: phone ? 2 : 1, mobile: phone });
  await send('Emulation.setTouchEmulationEnabled', { enabled: phone, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: phone ? [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] : [] });
  await send('Page.navigate', { url: BASE + extra });
  await ev(`(async () => { for (let i = 0; i < 100 && !document.querySelector('.bz-head'); i++) await new Promise((r) => setTimeout(r, 150)); })()`); await sleep(1000);
};
const snap = async (name) => { const f = `${DIR}${name}.png`; rmSync(f, { force: true }); const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return statSync(f).size; };
const SCROLLER = `let sc = document.querySelector('.bz'); while (sc && sc.scrollHeight <= sc.clientHeight + 2) sc = sc.parentElement;`;
const toEl = (sel, off) => ev(`(async () => { const r = document.querySelector(${JSON.stringify(sel)}); ${SCROLLER} if (r && sc) sc.scrollTop += r.getBoundingClientRect().top - ${off}; await new Promise((d) => setTimeout(d, 300)); return sc ? Math.round(sc.scrollTop) : null; })()`);
const press = (sel) => ev(`(async () => { const b = document.querySelector(${JSON.stringify(sel)}); if (!b) return 'MISS ' + ${JSON.stringify(sel)}; b.click(); await new Promise((d) => setTimeout(d, 420)); return 'ok'; })()`);
const measure = () => ev(`(() => { const q = (s) => document.querySelector(s), row = q('.bz-row, .bz-q'), host = q('.bz'); ${SCROLLER}
  const over = [...document.querySelectorAll('.bz *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && !e.closest('.bz-tabs') && !e.closest('.bz-filters'); }).slice(0, 5).map((e) => String(e.className || e.tagName).slice(0, 24));
  const clipped = [...document.querySelectorAll('.bz-row > *, .bz-led-row > *, .bz-kgrid > div, .bz-q .l1, .bz-qp .l1')].filter((e) => e.offsetParent && e.scrollWidth > e.clientWidth + 1).slice(0, 5).map((e) => String(e.className || e.tagName).slice(0, 16) + ':' + e.textContent.slice(0, 22));
  const small = [...document.querySelectorAll('.bz button')].filter((b) => { const r = b.getBoundingClientRect(); return r.width && r.height < (innerWidth < 700 ? 40 : 28); }).slice(0, 5).map((b) => (b.getAttribute('aria-label') || b.textContent).slice(0, 16) + ' ' + Math.round(b.getBoundingClientRect().height));
  return { hoverNone: matchMedia('(hover: none)').matches, font: getComputedStyle(host).fontFamily.slice(0, 18), iw: innerWidth, hostY: Math.round(host.getBoundingClientRect().y), firstRowY: row && Math.round(row.getBoundingClientRect().y), firstBtnY: q('.bz-acc') && Math.round(q('.bz-acc').getBoundingClientRect().y), rows: document.querySelectorAll('.bz-row').length, sh: sc && sc.scrollHeight, over, clipped, small }; })()`);
/* one real press, in a visible page: how long until nothing on the board is still moving, and what moved */
const swapMs = (sel) => ev(`(async () => { const t0 = performance.now(); const kinds = new Set(); document.querySelector(${JSON.stringify(sel)}).click(); let quiet = 0, last = 0; while (performance.now() - t0 < 1500) { await new Promise((r) => setTimeout(r, 10)); const a = [...document.querySelector('.bz').getAnimations({ subtree: true })].filter((x) => x.playState === 'running'); a.forEach((x) => kinds.add(x.id || x.transitionProperty || x.animationName || 'anim')); if (a.length) { last = performance.now() - t0; quiet = 0; } else if (++quiet > 12 && last) break; } return { ms: Math.round(last), kinds: [...kinds] }; })()`);

const log = {};
await open('1', 375, 812, true);
log.tokens = {};
const NAMES = ['--raised', '--sunk', '--ground', '--panel', '--inset', '--ink', '--ink-dim', '--ink-muted', '--gold', '--gold-ink', '--accent-ink', '--accent-edge', '--danger', '--danger-ink', '--danger-well', '--duke-fill-plank', '--duke-fill-plank-2', '--font-body'];
const readTok = () => ev(`(() => { const c = getComputedStyle(document.documentElement), o = {}; ${JSON.stringify(NAMES)}.forEach((n) => { o[n] = c.getPropertyValue(n).trim(); }); o.__page = getComputedStyle(document.body).backgroundColor; return o; })()`);
const dark = await readTok();
await open('1&light', 375, 812, true);
const light = await readTok();
writeFileSync(DIR + 'tokens.json', JSON.stringify({ dark, light }, null, 1));
const PHONE = {
  1: async () => { await snap('d1-phone-top'); log.d1 = { phone: await measure() }; log.d1.scroll = await toEl('.d1 .bz-row', 130); await snap('d1-phone-rows'); await press('.bz-grp.open .bz-rejb'); await toEl('.bz-grp.open .bz-rej', 180); await snap('d1-phone-reject'); },
  2: async () => { await snap('d2-phone-top'); log.d2 = { phone: await measure() }; log.d2.scroll = await toEl('.d2 .bz-row', 130); await snap('d2-phone-rows'); await press('.d2 .bz-rejb'); await toEl('.d2 .bz-rej', 180); await snap('d2-phone-reject'); },
  3: async () => { await snap('d3-phone-top'); log.d3 = { phone: await measure() }; log.d3.a = await press('[data-wh="BDG"]'); await snap('d3-phone-rows'); log.d3.b = await press('.bz-qp'); log.d3.phone2 = await measure(); await snap('d3-phone-detail'); log.d3.c = await press('.bz-bar .bz-rejb'); await toEl('.bz-bar', 300); await snap('d3-phone-reject'); },
};
const SWAP = { 1: '[data-wh="SMG"]', 2: '[data-wh="SMG"]', 3: '[data-wh="SMG"]' };
for (const d of ['1', '2', '3']) {
  await open(d, 375, 812, true);
  await PHONE[d]();
  await open(d, 375, 812, true);
  if (d === '3') log.d3.pushBack = await swapMs('[data-wh="BDG"]'); else log[`d${d}`].phoneSwap = await swapMs(SWAP[d]);
  await open(d + '&light', 375, 812, true);
  await snap(`d${d}-phone-light`);
  await open(d, 1440, 900, false);
  log[`d${d}`].pc = await measure();
  await snap(`d${d}-pc`);
  log[`d${d}`].pcSwap = await swapMs(SWAP[d]);
  await sleep(300);
  log[`d${d}`].afterSwap = await ev(`document.querySelector('.bz').innerText.includes('Semarang')`);
  await open(d + '&light', 1440, 900, false);
  await snap(`d${d}-pc-light`);
}
log.errors = errors.slice(0, 6);
console.log(JSON.stringify(log));

const sec = (k) => (log[k].pcSwap.ms / 1000).toFixed(2);
const DRAFTS = [
  ['1', 'DRAFT 1 - THE LEDGER', `One table, like a report in a spreadsheet. Every warehouse is a row with its numbers and a total at the bottom. Press a row and its products open under it. Nothing slides sideways: the row opens in ${sec('d1')} seconds.`],
  ['2', 'DRAFT 2 - THE WORKLIST', `Warehouses are tabs with their loss and how many wait. The numbers sit on top, and the list shows only what still needs you, biggest loss first. A line glides under the tab and the list fades in. Full swap ${sec('d2')} seconds.`],
  ['3', 'DRAFT 3 - THE QUEUE', `Warehouses, then products, then one product with its full evidence and the money worked out line by line. Each Accept or Reject moves to the next product. On the PC, keys A, R and the arrows work. On the phone the buttons stay in thumb reach. Change ${sec('d3')} seconds.`],
];
const ROWS = { 1: [['phone-top', 'What you see first'], ['phone-rows', 'The products'], ['phone-reject', 'Reject asks why, in the row'], ['phone-light', 'Light theme']],
  2: [['phone-top', 'What you see first'], ['phone-rows', 'The products'], ['phone-reject', 'Reject asks why, in the row'], ['phone-light', 'Light theme']],
  3: [['phone-top', 'What you see first'], ['phone-rows', 'Press a warehouse: its products'], ['phone-detail', 'Press a product: its evidence'], ['phone-light', 'Light theme']] };
const CSSB = `body{margin:0;background:#14161a;color:#e8e2d4;font:18px/1.35 "Segoe UI",sans-serif}.wrap{padding:24px}h1{margin:0 0 4px;font-size:28px;color:#e9b949}.sub{margin:0 0 16px;color:#a8a090}.row{display:flex;gap:22px;align-items:flex-start}.f{width:420px}.f img{display:block;width:100%;border:1px solid #2a2d33}.t{font-size:17px;font-weight:700;letter-spacing:.05em;color:#e9b949}.c{margin:4px 0 0;color:#fff;font-size:16px;min-height:150px}.s{font-size:13px;color:#a8a090;margin:14px 0 4px}.w{width:1240px;margin-bottom:26px}.w img{display:block;width:100%;border:1px solid #2a2d33;margin-top:8px}.w .c{min-height:0}`;
const head = '<!doctype html><html><head><meta charset="utf-8"><style>' + CSSB + '</style></head><body><div class="wrap">';
const phone = head + `<h1>Stock Opname board on the phone - 3 business drafts (real screen, made-up numbers)</h1><p class="sub">Your colors, no game parts: plain font, flat panels, real table columns. The big title and double tabs fold into one row, so the work starts higher.</p><div class="row">`
  + DRAFTS.map(([k, t, c]) => `<div class="f"><div class="t">${t}</div><p class="c">${c}</p>` + ROWS[k].map(([r, s]) => `<div class="s">${s}</div><img src="d${k}-${r}.png">`).join('') + '</div>').join('') + '</div></div></body></html>';
const pc = head + `<h1>Stock Opname board on the PC - 3 business drafts (real screen, made-up numbers)</h1><p class="sub">Your phone and your PC can have different answers.</p>`
  + DRAFTS.map(([k, t, c]) => `<div class="w"><div class="t">${t}</div><p class="c">${c}</p><img src="d${k}-pc.png"><img src="d${k}-pc-light.png"></div>`).join('') + '</div></body></html>';
await send('Emulation.setTouchEmulationEnabled', { enabled: false });
await send('Emulation.setEmulatedMedia', { features: [] });
for (const [name, html, width] of [['drafts-phone', phone, 1400], ['drafts-pc', pc, 1290]]) {
  writeFileSync(`${DIR}${name}.html`, html);
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file:///' + (DIR + name + '.html').replace(/\\/g, '/') }); await sleep(1800);
  const h = await ev('document.body.scrollHeight');
  await send('Emulation.setDeviceMetricsOverride', { width, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(600);
  console.log(name, h, await snap(name));
}
ws.close(); chrome.kill(); process.exit(0);
