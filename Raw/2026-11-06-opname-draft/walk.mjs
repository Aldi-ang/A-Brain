// node walk.mjs  (lab on 4190) -> a team leader's typed numbers through a reload, on the REAL StockOpnameView: Submit, Reset, full storage, a closed week, a recount
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
const HELP = `window.__h = (() => { const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const vis = () => [...document.querySelectorAll('input[type=number]')].filter((e) => e.offsetParent);
  const set = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); };
  const key = () => Object.keys(localStorage).find((k) => k.startsWith('kpm-opname-draft'));
  const draft = () => { const k = key(); return k ? JSON.parse(localStorage.getItem(k)) : null; };
  const toast = () => [...document.querySelectorAll('[aria-live]')].map((e) => e.innerText).join(' | ');
  const btn = (re) => [...document.querySelectorAll('button')].filter((b) => b.offsetParent && re.test(b.textContent));
  return { sleep, vis, set, key, draft, toast, btn }; })();`;
const BASE = 'http://localhost:4190/tools/ponder-lab.html?shell&opname';
const load = async (extra = '', want = '') => { await send('Page.navigate', { url: BASE + extra }); await sleep(700);
  await ev(`(async () => { for (let i = 0; i < 80 && !${want ? `document.body.innerText.includes(${JSON.stringify(want)})` : `document.querySelector('input[type=number]')`}; i++) await new Promise((r) => setTimeout(r, 150)); ${HELP} })()`); await sleep(500); };
const fresh = () => send('Storage.clearDataForOrigin', { origin: 'http://localhost:4190', storageTypes: 'local_storage,indexeddb' }).catch(() => {});
const snap = async (name) => { const f = `${DIR}${name}.png`; rmSync(f, { force: true }); const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return statSync(f).size; };
const out = {};
const confirmYes = `(async () => { const { sleep } = __h; await sleep(250); const d = document.querySelector('[role=dialog],[role=alertdialog]'); if (!d) return 'no dialog'; const b = [...d.querySelectorAll('button')]; const yes = b.find((x) => /confirm|yes|ok|proceed|submit|lanjut/i.test(x.textContent)) || b[b.length - 1]; const t = yes.textContent.trim(); yes.click(); await sleep(700); return t; })()`;

// 1. type, reload: the numbers, the frozen target and the message
await fresh(); await load();
out.phone = await ev(`({ hoverNone: matchMedia('(hover: none)').matches, coarse: matchMedia('(pointer: coarse)').matches, width: innerWidth })`);
await ev(`(async () => { const { set, vis, sleep } = __h; set(vis()[0], 97); await sleep(80); set(vis()[1], 2); await sleep(150); })()`);
out.typed = await ev(`__h.draft()`);
await load();
out.reload = await ev(`({ vals: __h.vis().map((n) => n.value).join(), toast: __h.toast(), frozen: [__h.draft()?.counts['p-cg16'].expStock, __h.draft()?.counts['p-cg16'].expDamaged] })`);
out.frame = await snap('phone-came-back');

// 2. every row typed wrong, Submit flags them, a reload keeps them locked; one recount banks an attempt and survives too
await ev(`(async () => { const { set, vis, sleep, btn } = __h; const n = vis().length; for (let i = 2; i < n; i++) { set(vis()[i], i % 2 ? 0 : 5); await sleep(50); } await sleep(150); btn(/Submit to HQ/)[0].click(); await sleep(400); })()`);
out.flagged = await ev(`({ checked: Object.keys(__h.draft().checkedRows).length, locked: __h.vis().filter((i) => i.disabled || i.readOnly).length })`);
await load();
out.lockedAfterReload = await ev(`({ locked: __h.vis().filter((i) => i.disabled || i.readOnly).length, buttons: __h.btn(/count again/i).length, toast: __h.toast() })`);
out.typedHiddenOnBlind = await ev(`document.body.innerText.includes('420')`);
await ev(`(async () => { const { btn, sleep } = __h; btn(/count again/i)[0].click(); await sleep(200); })()`);
await load();
out.bankedAfterReload = await ev(`({ passes: __h.draft().counts['p-cg16'].passes, boxes: __h.vis().slice(0, 2).map((n) => n.value).join(), frozen: __h.draft().counts['p-cg16'].expStock })`);

// 3. recount everything to the frozen figures, Submit: the audit carries the banked pass and the frozen target, and the draft is gone
await ev(`(async () => { const { btn, sleep } = __h; while (btn(/count again/i).length) { btn(/count again/i)[0].click(); await sleep(120); } })()`);
out.typeExact = await ev(`(async () => { const { set, vis, draft, sleep } = __h; const rows = Object.values(draft().counts); for (let r = 0; r < rows.length; r++) { set(vis()[r * 2], rows[r].expStock); await sleep(60); set(vis()[r * 2 + 1], rows[r].expDamaged); await sleep(60); } await sleep(150); return vis().map((n) => n.value).join(); })()`);
await ev(`globalThis.__labWrites = []; __h.btn(/Submit to HQ/)[0].click(); 1`);
out.confirm = await ev(confirmYes);
out.afterSubmit = await ev(`({ key: __h.key() || null, boxes: __h.vis().map((n) => n.value).join(), toast: __h.toast(), audit: (() => { const w = (globalThis.__labWrites || []).find((x) => /pending_audits/.test(x.path)); return w && w.data.items.map((i) => ({ id: i.productId, exp: i.expectedStock, passes: i.countPasses.length })); })() })`);
await load();
out.reloadAfterSubmit = await ev(`({ boxes: __h.vis().map((n) => n.value).join(), toast: __h.toast(), key: __h.key() || null })`);

// 4. Reset leaves nothing
await fresh(); await load();
await ev(`(async () => { const { set, vis, sleep, btn } = __h; set(vis()[0], 5); await sleep(100); const had = !!__h.key(); btn(/^\\s*Reset/)[0].click(); await sleep(150); window.__had = had; })()`);
out.reset = await ev(`({ hadDraft: window.__had, key: __h.key() || null })`);

// 5. full storage: the numbers stay, the photo goes, and the leader is told. Then nothing fits at all: counting goes on
await fresh(); await load();
await ev(`(async () => { const { set, vis, sleep, draft, key } = __h; set(vis()[0], 7); await sleep(120); const k = key(), d = draft(); d.counts['p-cg16'].photo = 'data:image/jpeg;base64,' + 'A'.repeat(20000); localStorage.setItem(k, JSON.stringify(d)); })()`);
await load();
out.photoKept = await ev(`({ photoLen: __h.draft().counts['p-cg16'].photo?.length, toast: __h.toast() })`);
await ev(`(async () => { const { set, vis, sleep } = __h; const o = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k.startsWith('kpm-opname-draft') && v.length > 5000) throw new DOMException('full', 'QuotaExceededError'); return o.call(this, k, v); }; set(vis()[1], 3); await sleep(150); })()`);
out.fullNoPhoto = await ev(`(() => { const d = __h.draft(); return { noPhotos: d.noPhotos, photo: d.counts['p-cg16'].photo, good: d.counts['p-cg16'].good, damaged: d.counts['p-cg16'].damaged, shownBoxes: __h.vis().slice(0, 2).map((n) => n.value).join() }; })()`);
await load();
out.fullToast = await ev(`__h.toast()`);
await ev(`(async () => { const { set, vis, sleep } = __h; Storage.prototype.setItem = function () { throw new DOMException('full', 'QuotaExceededError'); }; set(vis()[2], 9); await sleep(150); })()`);
out.nothingFits = await ev(`({ box: __h.vis()[2].value, footer: (document.body.innerText.match(/\\d+ of \\d+ counted/i) || [''])[0] })`);

// 6. the week's count is already in: the draft ends, nobody is told their numbers came back
await fresh(); await load();
await ev(`(async () => { const { set, vis, sleep } = __h; set(vis()[0], 5); await sleep(120); })()`);
await load('&done', 'count is in');
out.closedWeek = await ev(`({ key: __h.key() || null, toast: __h.toast(), says: (document.body.innerText.match(/This week's count is in[^\\n]*/) || [''])[0].slice(0, 70) })`);

// 7. a recount sends only the reopened product, whatever else came back
await fresh(); await load();
await ev(`(async () => { const { set, vis, sleep } = __h; set(vis()[0], 5); await sleep(120); })()`);
await load('&recount');
out.recountOpen = await ev(`({ rows: __h.vis().length / 2, restored: Object.keys(__h.draft().counts) })`);
await ev(`(async () => { const { set, vis, sleep, draft } = __h; set(vis()[0], 1); await sleep(100); const e = draft().counts['p-djar']; set(vis()[0], e.expStock); await sleep(60); set(vis()[1], e.expDamaged); await sleep(120); globalThis.__labWrites = []; __h.btn(/Submit to HQ/)[0].click(); })()`);
out.recountConfirm = await ev(confirmYes);
out.recountSent = await ev(`(globalThis.__labWrites || []).find((x) => /pending_audits/.test(x.path))?.data.items.map((i) => i.productId)`);

// 8. what one save costs: 100 rows and 5 photos of 150 KB, phone CPU at 4x slower
await send('Emulation.setCPUThrottlingRate', { rate: 4 });
out.saveCost = await ev(`(() => { const counts = {}; for (let i = 0; i < 100; i++) counts['p' + i] = { good: i, damaged: 0, photo: i < 5 ? 'data:image/jpeg;base64,' + 'A'.repeat(150000) : null, expStock: 100, expDamaged: 0 };
  const t = []; for (let i = 0; i < 10; i++) { const a = performance.now(); localStorage.setItem('kpm-cost-probe', JSON.stringify({ counts, checkedRows: {} })); t.push(performance.now() - a); } localStorage.removeItem('kpm-cost-probe'); t.sort((x, y) => x - y); return { medianMs: Math.round(t[5]), worstMs: Math.round(t[9]) }; })()`);
await send('Emulation.setCPUThrottlingRate', { rate: 1 });

out.errors = errors;
console.log(JSON.stringify(out, null, 1));
chrome.kill(); process.exit(0);
