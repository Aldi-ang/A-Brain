// node built.mjs  (lab on 4190) -> the REAL worklist in the real StockOpnameView, pressed through its whole flow, phone + PC, every tier
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 300000).unref();
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
const BASE = 'http://localhost:4190/tools/ponder-lab.html?shell&opname&many&worklist&';
const open = async (extra, w, h, phone, want = '.kpm-wl-head') => {
  await send('Storage.clearDataForOrigin', { origin: 'http://localhost:4190', storageTypes: 'local_storage,indexeddb' }).catch(() => {});
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: phone ? 2 : 1, mobile: phone });
  await send('Emulation.setTouchEmulationEnabled', { enabled: phone, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: phone ? [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] : [] });
  await send('Page.navigate', { url: BASE + extra });
  await ev(`(async () => { for (let i = 0; i < 100 && !document.querySelector(${JSON.stringify(want)}); i++) await new Promise((r) => setTimeout(r, 150)); })()`); await sleep(1000);
};
const snap = async (name) => { const f = `${DIR}${name}.png`; rmSync(f, { force: true }); const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return statSync(f).size; };
const SC = `let sc = document.querySelector('.kpm-wl') || document.querySelector('[data-guide=count]'); while (sc && sc.scrollHeight <= sc.clientHeight + 2) sc = sc.parentElement;`;
const toEl = (sel, off) => ev(`(async () => { const r = document.querySelector(${JSON.stringify(sel)}); ${SC} if (r && sc) sc.scrollTop += r.getBoundingClientRect().top - ${off}; await new Promise((d) => setTimeout(d, 300)); return !!r; })()`);
const checkFit = () => ev(`(() => { const q = (s) => document.querySelector(s);
  const over = [...document.querySelectorAll('.kpm-wl *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && !e.closest('.kpm-wl-tabs') && !e.closest('.kpm-wl-filters'); }).slice(0, 5).map((e) => String(e.className || e.tagName).slice(0, 24));
  const clipped = [...document.querySelectorAll('.kpm-wl-row > *, .kpm-wl-kgrid > div')].filter((e) => e.offsetParent && e.scrollWidth > e.clientWidth + 1).slice(0, 5).map((e) => String(e.className || e.tagName).slice(0, 16) + ':' + e.textContent.slice(0, 24));
  const small = [...document.querySelectorAll('.kpm-wl button')].filter((b) => { const r = b.getBoundingClientRect(); return r.width && r.height < (innerWidth < 700 ? 40 : 24); }).slice(0, 5).map((b) => (b.getAttribute('aria-label') || b.textContent).slice(0, 16) + ' ' + Math.round(b.getBoundingClientRect().height));
  return { hoverNone: matchMedia('(hover: none)').matches, font: getComputedStyle(q('.kpm-wl')).fontFamily.slice(0, 12), firstRowY: q('.kpm-wl-row') && Math.round(q('.kpm-wl-row').getBoundingClientRect().y), over, clipped, small }; })()`);

/* the whole flow on the REAL handlers; the stub records each write and keeps the counts live */
const WALK = `(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms)), q = (s) => document.querySelector(s), qq = (s) => [...document.querySelectorAll(s)], out = {};
  const row = (n) => qq('.kpm-wl-row').find((e) => e.textContent.includes(n));
  const fil = () => qq('.kpm-wl-fil').map((b) => b.textContent.replace(/\\s+/g, ' ').trim()).join(' | ');
  const toast = () => q('.kpm-wl-toast span')?.textContent || null;
  const wr = (from) => (globalThis.__labWrites || []).slice(from).map((w) => ({ op: w.op, path: w.path.split('/').slice(-3).join('/'), keys: w.data && Object.fromEntries(Object.entries(w.data).map(([k, v]) => [k, typeof v === 'number' ? v : v === undefined ? 'DEL' : typeof v])) }));
  const tab = (t) => qq('.kpm-wl-tab').find((b) => b.textContent.includes(t));
  tab('Bandung').click(); await sleep(400);
  out.start = { open: q('[role=tab][aria-selected=true] b')?.textContent, filters: fil(), rows: qq('.kpm-wl-row').map((e) => e.querySelector('b').textContent).join(', '), lost: q('.kpm-wl-kgrid .big b').textContent, all: q('.kpm-wl-alltot b').textContent };
  let n = (globalThis.__labWrites || []).length;
  row('Sampoerna Mild').querySelector('.kpm-wl-acc').click(); await sleep(300);
  out.accept = { toast: toast(), filters: fil(), goneFromWaiting: !row('Sampoerna Mild'), writes: wr(n), lost: q('.kpm-wl-kgrid .big b').textContent };
  n = globalThis.__labWrites.length;
  q('.kpm-wl-toast button').click(); await sleep(300);
  out.undo = { toast: toast(), filters: fil(), back: !!row('Sampoerna Mild'), writes: wr(n) };
  row('Djarum Coklat').querySelector('.kpm-wl-rejb').click(); await sleep(120);
  out.rejectOpen = !!q('.kpm-wl-rej');
  q('.kpm-wl-rej .kpm-wl-rejb').click(); await sleep(100);
  out.rejectEmpty = q('.kpm-wl-err')?.textContent || null;
  n = globalThis.__labWrites.length;
  q('.kpm-wl-chip').click(); await sleep(60);
  q('.kpm-wl-rej .kpm-wl-rejb').click(); await sleep(300);
  out.reject = { toast: toast(), filters: fil(), writes: wr(n), reopened: (globalThis.__labWrites.slice(n).find((w) => w.path.includes('motorists')) || {}).data?.lastOpname?.reopened || null };
  const stuck = row('Cello Merah');
  out.stuck = { hasAccept: !!stuck?.querySelector('.kpm-wl-acc'), hasReject: !!stuck?.querySelector('.kpm-wl-rejb'), note: stuck?.querySelector('.kpm-wl-ico.wide')?.textContent || null };
  n = globalThis.__labWrites.length;
  q('.kpm-wl-sub .kpm-wl-acc').click(); await sleep(300);
  out.acceptAll = { toast: toast(), filters: fil(), stockWrites: wr(n).filter((w) => !w.path.includes('pending_audits')).length, auditWrites: wr(n).filter((w) => w.path.includes('pending_audits')).map((w) => Object.keys(w.keys)) };
  const fp = qq('.kpm-wl-fil').find((b) => b.textContent.includes('All')); fp.click(); await sleep(150);
  out.allRows = qq('.kpm-wl-row').map((e) => e.querySelector('b').textContent + ':' + e.className.replace('kpm-wl-row', '').trim()).join(' / ');
  qq('.kpm-wl-fil')[0].click(); await sleep(100);
  n = globalThis.__labWrites.length;
  /* finish the warehouse: its count closes */
  for (const name of ['Sampoerna Mild', 'Cello Green']) { row(name).querySelector('.kpm-wl-acc').click(); await sleep(250); }
  row('Cello Merah').querySelector('.kpm-wl-rejb').click(); await sleep(100); q('.kpm-wl-chip').click(); await sleep(40); q('.kpm-wl-rej .kpm-wl-rejb').click(); await sleep(300);
  const closing = wr(n).filter((w) => w.path.includes('pending_audits') && w.keys.status);
  out.close = { closing, empty: q('.kpm-wl-none')?.textContent || null, tabBadge: tab('Bandung')?.querySelector('.kpm-wl-count')?.textContent || 'none' };
  /* the swap: which things move, and that the board follows */
  const t0 = performance.now(); const kinds = new Set(); tab('Semarang').click(); let last = 0, quiet = 0;
  while (performance.now() - t0 < 1200) { await sleep(10); const a = document.getAnimations().filter((x) => x.playState === 'running' && x.effect?.target?.closest?.('.kpm-wl')); a.forEach((x) => kinds.add(x.transitionProperty || x.animationName || 'list fade')); if (a.length) { last = performance.now() - t0; quiet = 0; } else if (++quiet > 15 && last) break; }
  out.swap = { ms: Math.round(last), kinds: [...kinds], open: q('[role=tab][aria-selected=true] b').textContent, who: q('.kpm-wl-who').textContent, filters: fil() };
  return out; })()`;

const log = {};
const T1 = 'admin&tab=hq%20audits';
const bandung = async () => { await ev(`[...document.querySelectorAll('.kpm-wl-tab')].find((b) => b.textContent.includes('Bandung')).click()`); await sleep(450); };
await open(T1, 375, 812, true); await bandung(); log.phone = await checkFit(); await snap('built-phone-top');
await toEl('.kpm-wl-row', 130); await snap('built-phone-rows');
await ev(`document.querySelector('.kpm-wl-row .kpm-wl-rejb').click()`); await sleep(200); await toEl('.kpm-wl-rej', 180); await snap('built-phone-reject');
await open(T1 + '&light', 375, 812, true); await bandung(); await snap('built-phone-light');
await open(T1 + '&lite', 375, 812, true); await bandung(); log.lite = await ev(`document.documentElement.classList.contains('lite-mode')`); await snap('built-phone-lite');
await open(T1, 1440, 900, false); await bandung(); log.pc = await checkFit(); await snap('built-pc');
await open(T1, 1440, 900, false); log.walk = await ev(WALK); await sleep(200); await snap('built-pc-after');
await open(T1 + '&light', 1440, 900, false); await bandung(); await snap('built-pc-light');
await open(T1, 375, 812, true); log.walkPhone = await ev(WALK);
/* a rejected product on a real leader's card: only that product reopens */
await open(T1 + '&done', 1440, 900, false); await bandung();
log.card = await ev(`(async () => { const row = [...document.querySelectorAll('.kpm-wl-row')].find((e) => e.textContent.includes('Djarum Coklat')); row.querySelector('.kpm-wl-rejb').click(); await new Promise((r) => setTimeout(r, 120)); document.querySelector('.kpm-wl-chip').click(); await new Promise((r) => setTimeout(r, 60)); document.querySelector('.kpm-wl-rej .kpm-wl-rejb').click(); await new Promise((r) => setTimeout(r, 300));
  const w = globalThis.__labWrites.filter((x) => x.path.includes('motorists')); const n = globalThis.__labWrites.length; const body = { cardWrites: w.length, path: w[0]?.path.split('/').slice(-2).join('/'), keys: Object.keys(w[0]?.data || {}), reopened: w[0]?.data?.lastOpname?.reopened, by: w[0]?.data?.lastOpname?.by };
  document.querySelector('.kpm-wl-toast button').click(); await new Promise((r) => setTimeout(r, 300)); const back = globalThis.__labWrites.slice(n).find((x) => x.path.includes('motorists')); body.undoReopened = back?.data?.lastOpname?.reopened ?? 'none'; return body; })()`);
/* a T3 at headquarters: lands on the review, every warehouse, may decide */
await open('role=AREA_ADMIN&at=Headquarters', 375, 812, true);
log.t3 = await ev(`({ landed: !!document.querySelector('.kpm-wl'), tabs: document.querySelectorAll('.kpm-wl-tab').length, accept: document.querySelectorAll('.kpm-wl-acc').length > 0, modes: [...document.querySelectorAll('.kpm-wl-fold button')].map((b) => b.textContent.trim()) })`);
await snap('built-t3');
/* a T4: their own warehouse, read only */
await open('role=FLEET_CAPTAIN&at=BANDUNG&tab=review', 375, 812, true);
log.t4 = await ev(`({ landed: !!document.querySelector('.kpm-wl'), tabs: document.querySelectorAll('.kpm-wl-tab').length, accept: document.querySelectorAll('.kpm-wl-acc').length, reject: document.querySelectorAll('.kpm-wl-rejb').length, modes: [...document.querySelectorAll('.kpm-wl-fold button')].map((b) => b.textContent.trim()), rows: document.querySelectorAll('.kpm-wl-row').length })`);
await snap('built-t4');
/* a T5 has no review */
await open('role=FIELD_OPERATIVE&at=BANDUNG', 375, 812, true, '[data-guide=count]');
log.t5 = await ev(`({ board: !!document.querySelector('.kpm-wl'), modes: [...document.querySelectorAll('button')].filter((b) => /HQ Audits|Review/.test(b.textContent)).length })`);
/* the T4's recount: only what was rejected */
await open('role=FLEET_CAPTAIN&at=BANDUNG&recount&tab=new count', 375, 812, true, '[data-guide=count]');
log.recount = await ev(`({ banner: document.querySelector('[data-guide="week-count"]')?.textContent.slice(0, 120), inputs: document.querySelectorAll('[data-guide=count] input[inputmode], [data-guide=count] input[type=number]').length, names: document.querySelector('[data-guide=count]').innerText.includes('Djarum'), other: document.querySelector('[data-guide=count]').innerText.includes('Sampoerna Kretek') })`);
await snap('built-recount');
/* history keeps working behind its button */
await open(T1, 1440, 900, false);
log.history = await ev(`(async () => { document.querySelector('.kpm-wl-hist').click(); await new Promise((r) => setTimeout(r, 400)); return { rows: [...document.querySelectorAll('h3')].map((h) => h.textContent.trim()).filter(Boolean).slice(0, 4), back: [...document.querySelectorAll('button')].some((b) => /Back to the review/i.test(b.textContent)) }; })()`);
await ev(`(async () => { [...document.querySelectorAll('h3')].find((h) => /SEMARANG/.test(h.textContent))?.closest('.cursor-pointer')?.click(); await new Promise((r) => setTimeout(r, 300)); })()`);
await snap('built-history');
log.errors = errors.slice(0, 6);
console.log(JSON.stringify(log, null, 0));
const cell = (f, t, w) => `<div style="width:${w}px"><div style="font-size:14px;color:#a8a090;margin:0 0 4px">${t}</div><img src="${f}.png" style="display:block;width:100%;border:1px solid #2a2d33"></div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#14161a;color:#e8e2d4;font:18px/1.35 'Segoe UI',sans-serif"><div style="padding:24px;width:1500px"><h1 style="margin:0 0 14px;font-size:26px;color:#e9b949">Stock count review, as built (the real screen, made-up numbers)</h1><div style="display:flex;gap:18px;margin-bottom:18px">${cell('built-phone-top', 'Phone, first view', 360)}${cell('built-phone-rows', 'Phone, the products', 360)}${cell('built-phone-reject', 'Reject asks why in the row', 360)}${cell('built-t4', 'A Tier 4: their own warehouse, read only', 360)}</div><div style="display:flex;gap:18px;margin-bottom:18px">${cell('built-pc', 'PC, dark', 741)}${cell('built-pc-light', 'PC, light', 741)}</div><div style="display:flex;gap:18px">${cell('built-recount', 'The team leader: only the rejected product comes back', 360)}${cell('built-history', 'Audit History, with each decision', 1122)}</div></div></body></html>`;
writeFileSync(DIR + 'built-board.html', html);
await send('Emulation.setTouchEmulationEnabled', { enabled: false }); await send('Emulation.setEmulatedMedia', { features: [] });
await send('Emulation.setDeviceMetricsOverride', { width: 1550, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'file:///' + (DIR + 'built-board.html').replace(/\\/g, '/') }); await sleep(1500);
const bh = await ev('document.body.scrollHeight'); await send('Emulation.setDeviceMetricsOverride', { width: 1550, height: bh, deviceScaleFactor: 1, mobile: false }); await sleep(500);
console.log('board', bh, await snap('built-board'));
ws.close(); chrome.kill(); process.exit(0);
