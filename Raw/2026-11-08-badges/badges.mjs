// node badges.mjs  -> renders the HQ Audits tab (real StockOpnameView in the lab, port 4187) with each
// count-badge option, phone 390 wide, dark / light / lite, tab off and on; measures contrast; makes BOARD.png
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LAB = 'http://localhost:4187/tools/ponder-lab.html?shell&opname&admin&bell';

const S = '.kpm-opname-tabs button span.rounded-full, .kpm-bell > span.bg-red-600';
const BASE = `{display:inline-flex!important;align-items:center;justify-content:center;width:auto!important;min-width:20px!important;height:20px!important;padding:0 6px!important;border-radius:10px!important;font-size:13px!important;font-weight:800!important;line-height:1!important;font-variant-numeric:tabular-nums;letter-spacing:0!important;box-shadow:none!important;`;
const OPTIONS = [
  { key: 'today', title: 'TODAY', cap: 'what you see now', css: '' },
  { key: 'A', title: 'A - Solid', cap: 'red circle, white bold number', css: `${S}${BASE}background:var(--danger-plate)!important;color:var(--danger-plate-ink)!important;border:0!important}` },
  { key: 'B', title: 'B - Ring', cap: 'no fill, red ring + red number', css: `${S}${BASE}background:transparent!important;color:var(--danger-ink)!important;border:1.5px solid var(--danger-ink)!important}` },
  { key: 'C', title: 'C - Soft', cap: 'pale red fill, red number', css: `${S}${BASE}background:color-mix(in srgb, var(--danger) 24%, transparent)!important;color:var(--danger-ink)!important;border:0!important}` },
];
const STATES = [
  { key: 'dark', label: 'Dark theme', q: '', on: false },
  { key: 'dark-on', label: 'Dark, tab open', q: '', on: true },
  { key: 'light', label: 'Light theme', q: '&light', on: false },
  { key: 'light-on', label: 'Light, tab open', q: '&light', on: true },
  { key: 'lite', label: 'Lite Mode', q: '&lite', on: false },
];

const MEASURE = `(() => {
  const parse = (s) => { let m = s.match(/rgba?\\(([^)]+)\\)/); if (m) { const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; }
    m = s.match(/color\\(srgb ([^)]+)\\)/); if (m) { const p = m[1].split(/[ /]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p[3] ?? 1]; } return [0, 0, 0, 0]; };
  const over = (top, under) => { const a = top[3]; return [top[0] * a + under[0] * (1 - a), top[1] * a + under[1] * (1 - a), top[2] * a + under[2] * (1 - a), 1]; };
  const groundOf = (el) => { const stack = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c[3] > 0) stack.push(c); if (c[3] >= 1) break; }
    let g = [255, 255, 255, 1]; for (let i = stack.length - 1; i >= 0; i--) g = over(stack[i], g); return g; };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const tab = [...document.querySelectorAll('.kpm-opname-tabs button')].find((b) => /HQ Audits/i.test(b.textContent));
  if (!tab) return { err: 'no HQ Audits tab' };
  const badge = tab.querySelector('span.rounded-full');
  if (!badge) return { err: 'no badge' };
  const bg = groundOf(badge); const ink = over(parse(getComputedStyle(badge).color), bg);
  const r = badge.getBoundingClientRect(); const t = tab.getBoundingClientRect(); const x = Math.max(0, t.left - 10);
  return { text: badge.textContent, ratio: Math.round(ratio(ink, bg) * 100) / 100, h: Math.round(r.height), font: getComputedStyle(badge).fontSize + ' ' + getComputedStyle(badge).fontWeight,
    clip: { x, y: Math.max(0, t.top + scrollY - 8), width: Math.min(390 - x, t.width + 20), height: t.height + 16 } };
})()`;

const port = 9700 + Math.floor(Math.random() * 100);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, 'about:blank']);
let list = []; for (let i = 0; i < 40 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.result?.value;
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'pointer', value: 'coarse' }, { name: 'hover', value: 'none' }] });

mkdirSync(DIR + 'f', { recursive: true });
const rows = {};
for (const st of STATES) for (const op of OPTIONS) {
  const url = LAB + st.q + (op.css ? '&css=' + encodeURIComponent(op.css) : '');
  await send('Page.navigate', { url }); await sleep(2200);
  if (st.on) { await ev(`[...document.querySelectorAll('.kpm-opname-tabs button')].find((b) => /HQ Audits/i.test(b.textContent))?.click()`); await sleep(700); }
  await ev(`document.querySelector('.kpm-opname-tabs')?.scrollIntoView({block:'center'})`); await sleep(400);
  const m = await ev(MEASURE);
  if (!m || m.err) { console.log(st.key, op.key, m); continue; }
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...m.clip, scale: 1 }, captureBeyondViewport: true });
  const f = `f/${st.key}-${op.key}.png`; rmSync(DIR + f, { force: true }); writeFileSync(DIR + f, Buffer.from(shot.result.data, 'base64'));
  (rows[st.key] ||= {})[op.key] = { f, ...m };
  console.log(st.key, op.key, m.text, m.ratio + ':1', m.h + 'px', m.font);
}
writeFileSync(DIR + 'measure.json', JSON.stringify(rows, null, 1));

const img = (f) => `data:image/png;base64,${readFileSync(DIR + f).toString('base64')}`;
const verdict = (r) => (r >= 4.5 ? `<b style="color:#e8d9a8">${r}:1</b>` : `<b style="color:#ff8a7a">${r}:1 - too low</b>`);
const html = `<html><body style="margin:0;background:#1b1a18;color:#eee;font:15px sans-serif;padding:10px">
<div style="font-size:20px;font-weight:700;margin:4px 0 10px">Count badge on the HQ Audits tab - phone width. Pick A, B or C.</div>
<div style="display:grid;grid-template-columns:120px repeat(${OPTIONS.length},300px);gap:14px;align-items:center">
<div></div>${OPTIONS.map((o) => `<div style="padding:4px 0"><div style="font-size:18px;font-weight:700">${o.title}</div><div style="opacity:.8">${o.cap}</div></div>`).join('')}
${STATES.map((st) => `<div style="font-weight:700">${st.label}</div>` + OPTIONS.map((o) => { const c = rows[st.key]?.[o.key]; return c ? `<div><img src="${img(c.f)}" style="width:${Math.min(300, Math.round(c.clip.width * 1.4))}px;display:block;border:1px solid #444"><div style="padding:3px 2px">number vs its circle: ${verdict(c.ratio)}</div></div>` : '<div>missing</div>'; }).join('')).join('')}
</div><div style="margin-top:10px;opacity:.85">Readable small text needs 4.5:1 or more. Lite Mode: none of the options glow or move, so it looks the same. The amber counters (cart, missed alerts) would get the same shape in amber.</div></body></html>`;
writeFileSync(DIR + '_board.html', html);
await send('Emulation.setDeviceMetricsOverride', { width: 120 + OPTIONS.length * 314 + 40, height: 800, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'file:///' + (DIR + '_board.html').replace(/\\/g, '/') }); await sleep(1500);
const h = await ev('document.documentElement.scrollHeight');
await send('Emulation.setDeviceMetricsOverride', { width: 120 + OPTIONS.length * 314 + 40, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(500);
const b = await send('Page.captureScreenshot', { format: 'png' });
rmSync(DIR + 'BOARD.png', { force: true }); writeFileSync(DIR + 'BOARD.png', Buffer.from(b.result.data, 'base64'));
console.log('BOARD.png', h); chrome.kill(); process.exit(0);
