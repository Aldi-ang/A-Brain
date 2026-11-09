// node vanload.mjs <shot-name> - as the signed-in T4 (drive.mjs Chrome 9555, phone), load 50 into Dika's van with REAL taps,
// then read what the Loading Bay says (the report line, any "Gagal: ..." under a product, the toasts). LOCAL demo emulator only.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const list = (await (await fetch('http://127.0.0.1:9555/json/list')).json()).filter((t) => t.type === 'page');
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => { const r = await send('Runtime.evaluate', { expression: `(async () => { ${x} })()`, returnByValue: true, awaitPromise: true }); return r.result?.exceptionDetails ? { EXC: r.result.exceptionDetails.exception?.description?.slice(0, 200) } : r.result?.result?.value; };
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
const tap = async (finder, label) => {
  const p = await ev(`const e = ${finder}; if (!e) return null; e.scrollIntoView({ block: 'center' }); await new Promise((r) => setTimeout(r, 350)); const r = e.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2), (e.innerText || e.getAttribute('aria-label') || e.className || '').toString().trim().replace(/\\n+/g, ' ').slice(0, 40)];`);
  if (!p) { log.push(label + ': NOT FOUND'); return false; }
  const pt = [{ x: p[0], y: p[1], radiusX: 4, radiusY: 4, force: 1, id: 1 }];
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  log.push(label + ': tapped "' + p[2] + '"'); await sleep(1300); return true;
};
const log = [];
await send('Page.enable'); await send('Page.reload'); await sleep(9000);   // a clean bay: no product left picked from an earlier run
await ev(`for (let i = 0; i < 14; i++) { const ct = document.querySelector('.kpm-ct'); if (!ct) break; const ch = [...ct.querySelectorAll('.choices button')]; if (ch.length) ch[ch.length - 1].click(); else ct.querySelector('.box')?.click(); await new Promise((r) => setTimeout(r, 700)); } return 1;`);
log.push('who: ' + await ev(`return document.querySelector('.kpm-demo-bar')?.innerText.replace(/\\n+/g, ' / ');`));
await ev(`document.querySelector('[data-mark="fleet"]')?.click(); await new Promise((r) => setTimeout(r, 3500)); return 1;`);
await tap(`document.querySelector('.kpm-actor[data-agent="demo-agent-2"]')`, 'Dika');
await tap(`document.querySelector('[data-guide="wh"] .slot.has[role="button"]')`, 'a product in the warehouse');
await tap(`document.querySelector('[data-guide="van"] .slot:not(.has)')`, 'an empty van square');
log.push('sheet: ' + await ev(`const s = document.querySelector('.kpm-bay-sheet'); return s ? s.innerText.replace(/\\n+/g, ' / ').slice(0, 120) : 'no sheet';`));
await tap(`document.querySelector('.kpm-bay-sheet input')`, 'qty box');
await send('Input.insertText', { text: '50' }); await sleep(500);
await tap(`[...document.querySelectorAll('.kpm-bay-sheet button')].find((b) => /masukkan|van/i.test(b.innerText))`, 'Masukkan ke van');
await tap(`document.querySelector('[data-ponder="go"]')`, 'Muat van');
await sleep(4000);
const out = await ev(`const t = document.body.innerText; return {
  failedLines: [...document.querySelectorAll('small.why')].map((s) => s.innerText),
  report: t.split('\\n').filter((l) => /dimuat|kembali|gagal|tidak tercatat|tersimpan|SJ-|ditolak|izin/i.test(l)).slice(0, 8),
  toasts: [...document.querySelectorAll('[role="status"],[role="alert"],[data-sonner-toast]')].map((x) => x.innerText.trim().replace(/\\n+/g, ' / ')).filter(Boolean).slice(0, 4),
  rawRulesText: /@ L\\d|evaluation error|false for '/.test(t) };`);
const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(DIR + 'van-' + (process.argv[2] || 'run') + '.png', Buffer.from(shot.result.data, 'base64'));
console.log(JSON.stringify({ log, out }, null, 1)); process.exit(0);
