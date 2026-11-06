// node real-app.mjs <ownerUid>  (kpm-emulator + kpm-dev-http on 5174, seeded) -> the REAL App.jsx, signed in on the local emulator with fake people:
// a real Tier 4 login through a reload, the owner wearing a test account as he did, the tabs measured in every mode, and the phone board.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, '--hide-scrollbars=false', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 420000).unref();
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
  const vis = () => [...document.querySelectorAll('input[type=number]')].filter((e) => e.offsetParent);
  const set = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); };
  const drafts = () => Object.fromEntries(Object.keys(localStorage).filter((k) => k.startsWith('kpm-opname-draft')).map((k) => [k.split('|')[2], JSON.parse(localStorage.getItem(k)).counts]));
  const toast = () => [...document.querySelectorAll('[aria-live]')].map((e) => e.innerText).filter((t) => /came back/.test(t)).join(' | ').slice(0, 170);
  const btn = (re) => [...document.querySelectorAll('button')].filter((b) => b.offsetParent && re.test((b.getAttribute('aria-label') || b.textContent).trim()));
  const any = (re) => [...document.querySelectorAll('button')].filter((b) => re.test((b.getAttribute('aria-label') || b.textContent).trim()));
  const place = () => (document.body.innerText.match(/AUDITING: [^\\n]*/) || [''])[0];
  const openCount = async () => { any(/^Stok Opname|^Stock Opname/i)[0].click(); await sleep(1600); const n = btn(/^New Count/); if (n[0]) { n[0].click(); await sleep(700); } };
  return { sleep, vis, set, drafts, toast, btn, any, place, openCount }; })();`;
const load = async () => { await send('Page.navigate', { url: ORIGIN + '/' }); await sleep(900);
  await ev(`(async () => { for (let i = 0; i < 80 && !window.__kpmEmulatorAuth; i++) await new Promise((r) => setTimeout(r, 150)); ${HELP} })()`); };
const fresh = async () => { await send('Page.navigate', { url: ORIGIN + '/' }); await sleep(500); await send('Storage.clearDataForOrigin', { origin: ORIGIN, storageTypes: 'local_storage,indexeddb,cookies' }); };
const signIn = (sub, email) => ev(`(async () => { const { auth, credential, signIn } = window.__kpmEmulatorAuth; const r = await signIn(auth, credential(JSON.stringify({ sub: ${JSON.stringify(sub)}, email: ${JSON.stringify(email)}, email_verified: true }))); return r.user.email; })()`);
/* waits for the shell; opens the vault with the seed's test password when the gate is up */
const ready = () => ev(`(async () => { const { sleep, set, btn, any } = __h; for (let i = 0; i < 60; i++) { const init = document.querySelector('input[placeholder^="create" i]'); if (init) { set(init, 'Emulator-1!'); await sleep(150); set(document.querySelector('input[placeholder*="recovery" i]'), 'emulator'); await sleep(250); btn(/save credentials/i)[0].click(); await sleep(2500); continue; } const g = document.querySelector('input[placeholder="MASTER PASSWORD"]'); if (g) { set(g, 'Emulator-1!'); await sleep(200); btn(/Open the vault/i)[0].click(); for (let j = 0; j < 60 && document.querySelector('input[placeholder="MASTER PASSWORD"]'); j++) await sleep(300); await sleep(1500); break; } if (any(/^Stok Opname|^Stock Opname/i).length) break; await sleep(300); } await sleep(1200); return any(/^Stok Opname|^Stock Opname/i).length; })()`);
const clip = async (name, rect, scale = 1) => { const f = `${DIR}${name}.png`; rmSync(f, { force: true }); const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...rect, scale } }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return statSync(f).size; };
const uid = process.argv[2]; if (!uid) { console.log('owner uid?'); process.exit(1); }
const out = {};

/* 1. A REAL TIER 4 LOGIN, the person this job is for: no costume in the way */
await phone(); await fresh(); await load();
out.t4Login = await signIn('g-sari-local', 'sari.test@example.com'); await sleep(3500);
out.t4Gate = await ev(`({ inputs: [...document.querySelectorAll('input')].map((i) => i.placeholder), buttons: [...document.querySelectorAll('button')].filter((b) => b.offsetParent).map((b) => (b.getAttribute('aria-label') || b.textContent).trim().slice(0, 30)).slice(0, 12), text: document.body.innerText.slice(0, 160) })`);
await ready();
out.t4Phone = await ev(`({ hoverNone: matchMedia('(hover: none)').matches, width: innerWidth })`);
await ev(`__h.openCount()`);
out.t4Before = await ev(`({ place: __h.place(), boxes: __h.vis().length, tabs: __h.btn(/^(Review|New Count)/).map((b) => b.textContent.trim()) })`);
await ev(`(async () => { const { set, vis, sleep } = __h; set(vis()[0], 49); await sleep(120); set(vis()[1], 2); await sleep(250); })()`);
out.t4Saved = await ev(`__h.drafts()`);
await load(); await ready(); await ev(`__h.openCount()`); await sleep(300);
out.t4AfterReopen = await ev(`({ place: __h.place(), vals: __h.vis().slice(0, 4).map((n) => n.value).join(), toast: __h.toast() })`);
out.frameT4 = await clip('real-t4-came-back', { x: 0, y: 0, width: 390, height: 844 });
if (process.argv[3] === 't4') { out.errors = errors; console.log(JSON.stringify(out, null, 1)); chrome.kill(); process.exit(0); }

/* 2. THE OWNER WEARING A TEST ACCOUNT, as he tested */
await pc(); await fresh(); await load();
out.ownerLogin = await signIn('g-aldi-local', 'adikaryasukses99@gmail.com'); await ready();
const wear = () => ev(`(async () => { const { any, btn, sleep } = __h; any(/Lihat sebagai tier lain/i)[0].click(); await sleep(600); const sel = [...document.querySelectorAll('select')].find((s) => [...s.options].some((o) => o.text === 'BANDUNG')); Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(sel, 'BANDUNG'); sel.dispatchEvent(new Event('change', { bubbles: true })); await sleep(200); btn(/REGIONAL ADMIN/i)[0].click(); await sleep(2200); const n = btn(/^New Count/); if (n[0]) { n[0].click(); await sleep(700); } })()`);
await ev(`(async () => { const { openCount, set, vis, sleep } = __h; await openCount(); set(vis()[0], 11); await sleep(120); set(vis()[1], 1); await sleep(250); })()`);
await wear();
out.costumeOn = await ev(`({ place: __h.place(), vals: __h.vis().slice(0, 4).map((n) => n.value).join(), toast: __h.toast() })`);
await ev(`(async () => { const { set, vis, sleep } = __h; set(vis()[0], 49); await sleep(120); set(vis()[1], 2); await sleep(250); })()`);
out.costumeDrafts = await ev(`Object.fromEntries(Object.entries(__h.drafts()).map(([p, c]) => [p, c.p_gudgar]))`);
await load(); await ready(); await ev(`__h.openCount()`); await sleep(300);
out.reopenedAsOwner = await ev(`({ place: __h.place(), banner: (document.body.innerText.match(/MELIHAT SEBAGAI[^\\n]*/) || ['no test account on'])[0], vals: __h.vis().slice(0, 4).map((n) => n.value).join() })`);
await wear(); await sleep(300);
out.sameTestAccountAgain = await ev(`({ place: __h.place(), vals: __h.vis().slice(0, 4).map((n) => n.value).join(), toast: __h.toast() })`);
await ev(`(async () => { const { any, sleep } = __h; any(/^(Kembali|Lepas|Exit|Keluar|KEMBALI|LEPAS)/i)[0]?.click(); await sleep(1500); })()`);
out.costumeOff = await ev(`({ banner: (document.body.innerText.match(/MELIHAT SEBAGAI[^\\n]*/) || ['no test account on'])[0], place: __h.place(), vals: __h.vis().slice(0, 4).map((n) => n.value).join() })`);

/* 3. THE TABS, every mode, the widths a PC can be. A long tab brings the page's scrollbar, so this runs with real scrollbars */
await ev(`window.__read = () => __h.btn(/^(Monitor|HQ Audits|Quarantine|New Count)/).filter((b) => b.closest('.kpm-opname-tabs')).map((b) => { const r = b.getBoundingClientRect(); return Math.round(r.left) + '/' + Math.round(r.top) + '/' + Math.round(r.width); }).join(' ');`);
out.tabs = {};
for (const [w, h] of [[800, 1000], [1024, 768], [1280, 800], [1440, 850], [1920, 1000]]) {
  await pc(w, h); await sleep(500);
  out.tabs[w] = await ev(`(async () => { const { btn, sleep } = __h; const seen = {}; for (const t of ['Monitor', 'HQ Audits', 'Quarantine', 'New Count']) { btn(new RegExp('^' + t))[0].click(); await sleep(450); seen[t] = __read(); } const g = document.querySelector('.kpm-opname-tabs'); const vals = [...new Set(Object.values(seen))]; return { positions: vals.length, at: vals[0], sideways: document.documentElement.scrollWidth > innerWidth, tabsScroll: g.scrollWidth > g.clientWidth + 1 }; })()`);
}
await pc(1280, 800); await sleep(500);
const y = await ev(`(async () => { const { btn, sleep } = __h; btn(/^Monitor/)[0].click(); await sleep(400); return Math.round(document.querySelector('.kpm-opname-tabs').getBoundingClientRect().top); })()`);
const row = { x: 0, y: y - 28, width: 1280, height: 100 };
for (const [t, f] of [['Monitor', 'tab-1'], ['HQ Audits', 'tab-2'], ['Quarantine', 'tab-3'], ['New Count', 'tab-4']]) {
  await ev(`(async () => { __h.btn(new RegExp('^${t}'))[0].click(); await __h.sleep(600); })()`); await clip(f, row);
}

/* 4. THE PHONE, today and drawn: for his decision, nothing built */
await phone(); await sleep(600);
const DRAW = `@media (max-width: 767px) { .kpm-wl-fold.kpm-wl-fold { padding: 1rem; border: 1px solid transparent; } .kpm-opname-tabs.kpm-opname-tabs { display: flex !important; gap: 2px; order: -1; overflow-x: auto; scrollbar-width: none; } .kpm-opname-tabs.kpm-opname-tabs button { font-family: var(--font-body); letter-spacing: normal; text-transform: none; font-size: 13px; font-weight: 600; min-height: 40px; flex: 1 0 auto; } .kpm-opname-tabs svg { display: none; } }`;
const P = { x: 0, y: 0, width: 390, height: 460 };
const tops = {};
for (const [t, f] of [['HQ Audits', 'ph-a1'], ['New Count', 'ph-a2']]) { tops[f] = await ev(`(async () => { __h.btn(new RegExp('^${t}'))[0].click(); await __h.sleep(700); return document.querySelector('.kpm-opname-tabs').getBoundingClientRect().top; })()`); await clip(f, P); }
await ev(`(() => { const s = document.createElement('style'); s.id = 'draw'; s.textContent = ${JSON.stringify(DRAW)}; document.head.appendChild(s); })()`);
for (const [t, f] of [['HQ Audits', 'ph-b1'], ['New Count', 'ph-b2']]) { tops[f] = await ev(`(async () => { __h.btn(new RegExp('^${t}'))[0].click(); await __h.sleep(700); const g = document.querySelector('.kpm-opname-tabs'); return { top: g.getBoundingClientRect().top, scroll: g.scrollWidth > g.clientWidth + 1 }; })()`); await clip(f, P); }
out.phoneTabTop = tops;

/* boards */
const board = async (name, html, w, h) => { const b = `${DIR}${name}.html`; writeFileSync(b, `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#141210;color:#e8e4dc;font:600 15px Segoe UI,sans-serif;padding:14px}figure{margin:0 0 12px}figcaption{margin:0 0 6px}img{display:block;border:1px solid #3a3530}.g{display:flex;gap:12px;align-items:flex-start}.g img{width:300px}.g figure{width:300px}</style>${html}`);
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false }); await send('Page.navigate', { url: 'file:///' + b.replace(/\\/g, '/') }); await sleep(900); const f = `${DIR}${name}.png`; rmSync(f, { force: true }); const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return statSync(f).size; };
out.boardPc = await board('board-tabs-pc', ['Monitor', 'HQ Audits', 'Quarantine', 'New Count'].map((t, i) => `<figure><figcaption>${t} pressed</figcaption><img src="tab-${i + 1}.png"></figure>`).join(''), 1310, 540);
out.boardPhone = await board('board-tabs-phone', `<div class="g">${[['ph-a1', '1 today: HQ Audits'], ['ph-a2', '1 today: New Count'], ['ph-b1', '2 drawn: HQ Audits'], ['ph-b2', '2 drawn: New Count']].map(([f, c]) => `<figure><figcaption>${c}</figcaption><img src="${f}.png"></figure>`).join('')}</div>`, 1280, 400);

out.errors = errors;
console.log(JSON.stringify(out, null, 1));
chrome.kill(); process.exit(0);
