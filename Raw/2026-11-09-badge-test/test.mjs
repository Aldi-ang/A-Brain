// node test.mjs  - his "i want u to test it" (2026-11-09): the nixie count badges + the 3 red buttons in the REAL app,
// DEMO build on the LOCAL emulator, signed in as the owner (drive.mjs session on Chrome 9555, phone 390x844).
// Records arrive while the screen is open (seed.mjs) so the roll-in is sampled live. Crops -> f/, BOARD.png.
import { spawnSync } from 'node:child_process';
import { writeFileSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const list = (await (await fetch('http://127.0.0.1:9555/json/list')).json()).filter((t) => t.type === 'page');
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push('throw: ' + String(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text).slice(0, 200)); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => { const r = await send('Runtime.evaluate', { expression: `(async () => { ${expression} })()`, returnByValue: true, awaitPromise: true });
  return r.result?.exceptionDetails ? { EXC: (r.result.exceptionDetails.exception?.description || '').slice(0, 300) } : r.result?.result?.value; };
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
const seed = (what) => spawnSync('node', [DIR + 'seed.mjs', what], { encoding: 'utf8' }).stdout.trim().split('\n').pop();

// page helpers, installed once
await ev(`window.__t = {
  vis: (e) => { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; },
  btn: (re) => [...document.querySelectorAll('button')].find((b) => window.__t.vis(b) && re.test(b.innerText.trim())),
  parse: (s) => { let m = s.match(/rgba?\\(([^)]+)\\)/); if (m) { const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; }
    m = s.match(/color\\(srgb ([^)]+)\\)/); if (m) { const p = m[1].split(/[ /]+/).filter(Boolean).map(Number); return [p[0] * 255, p[1] * 255, p[2] * 255, p[3] ?? 1]; } return [0, 0, 0, 0]; },
  ratio: (el) => { const t = window.__t; const over = (a, b) => [a[0] * a[3] + b[0] * (1 - a[3]), a[1] * a[3] + b[1] * (1 - a[3]), a[2] * a[3] + b[2] * (1 - a[3]), 1];
    const st = []; for (let e = el; e; e = e.parentElement) { const c = t.parse(getComputedStyle(e).backgroundColor); if (c[3] > 0) st.push(c); if (c[3] >= 1) break; }
    let g = [255, 255, 255, 1]; for (let i = st.length - 1; i >= 0; i--) g = over(st[i], g); const ink = over(t.parse(getComputedStyle(el).color), g);
    const L = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
    const a = L(ink), b = L(g); return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100; },
  go: async (mark) => { document.querySelector('[data-mark="' + mark + '"]')?.click(); await new Promise((r) => setTimeout(r, 3500)); },
  calm: async () => { for (let i = 0; i < 14; i++) { const ct = document.querySelector('.kpm-ct'); if (!ct) return 'calm';
    const ch = [...ct.querySelectorAll('.choices button')]; if (ch.length) { ch[ch.length - 1].click(); } else ct.querySelector('.box')?.click(); await new Promise((r) => setTimeout(r, 700)); } return 'still talking'; },
}; return 'ok';`);

mkdirSync(DIR + 'f', { recursive: true });
const cells = [], out = {};
async function crop(name, finder, pad = 10, cap = '') {
  const clip = await ev(`const e = ${finder}; if (!e) return null; e.scrollIntoView({ block: 'center' }); await new Promise((r) => setTimeout(r, 400)); const r = e.getBoundingClientRect();
    const x = Math.max(0, r.left - ${pad}); return { x, y: Math.max(0, r.top + scrollY - ${pad}), width: Math.min(390 - x, r.width + ${pad} * 2), height: Math.min(300, r.height + ${pad} * 2), scale: 1 };`);
  if (!clip || clip.EXC) { out[name] = 'NOT FOUND ' + JSON.stringify(clip); return; }
  const s = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
  const f = `f/${name}.png`; rmSync(DIR + f, { force: true }); writeFileSync(DIR + f, Buffer.from(s.result.data, 'base64')); cells.push({ name, f, w: clip.width, cap });
}
const nix = (scope) => `(() => { const s = ${scope}; return s ? [...s.querySelectorAll('.kpm-nixie')].map((n) => n.getAttribute('aria-label')) : null; })()`;

out.calm = await ev(`return await __t.calm();`);
// 1 bell
out.bell = await ev(`return ${nix(`document.querySelector('.kpm-bell')`)};`);
await crop('dark-bell', `document.querySelector('.kpm-bell')`, 14, 'Bell: needs you (top) / missed (bottom)');
// 2 EOD: HQ Verification count, then a report's Less chip
await ev(`await __t.go('eod'); return 1;`); out.calm2 = await ev(`return await __t.calm();`);
out.eodTab = await ev(`const b = __t.btn(/HQ Verification/i); return b ? { text: b.innerText.trim(), nixie: ${nix('b')} } : null;`);
await crop('dark-eod-tab', `__t.btn(/HQ Verification/i)`, 10, 'EOD: HQ Verification');
out.eodOpen = await ev(`__t.btn(/HQ Verification/i)?.click(); await new Promise((r) => setTimeout(r, 2500));
  const less = __t.btn(/^Less$/i); if (!less) return { noLess: [...document.querySelectorAll('button')].filter(__t.vis).map((b) => b.innerText.trim()).filter(Boolean).slice(0, 30) };
  less.click(); await new Promise((r) => setTimeout(r, 600)); const on = __t.btn(/^Less$/i); return { cls: on.className.includes('danger-plate'), ratio: __t.ratio(on) };`);
await crop('dark-eod-less', `__t.btn(/^Less$/i)?.parentElement`, 8, 'EOD card: Less (red, chosen)');
// 3 Stock Opname: a count ARRIVES while the HQ Audits tab is on screen; sample the reel from that moment
await ev(`await __t.go('stock_opname'); return 1;`); out.calm3 = await ev(`return await __t.calm();`);
out.opnameBefore = await ev(`const b = __t.btn(/HQ Audits|Review/i); return b ? { text: b.innerText.trim().replace(/\\n+/g, ' '), nixie: ${nix('b')} } : [...document.querySelectorAll('button')].filter(__t.vis).map((x) => x.innerText.trim()).slice(0, 20);`);
await ev(`window.__s = []; const t0 = performance.now(); (function tick() { const r = document.querySelector('.kpm-opname-tabs .kpm-nixie-reel');
  if (r) { const v = getComputedStyle(r).translate; if (!window.__s.length || window.__s[window.__s.length - 1].v !== v) window.__s.push({ ms: Math.round(performance.now() - t0), v }); }
  if (performance.now() - t0 < 9000) requestAnimationFrame(tick); })(); return 1;`);
out.seedAudit = seed('audit'); await sleep(4000);
out.opnameAfter = await ev(`const b = __t.btn(/HQ Audits|Review/i); return { text: b?.innerText.trim().replace(/\\n+/g, ' '), nixie: ${nix('b')}, samples: window.__s };`);
await crop('dark-opname-tab', `__t.btn(/HQ Audits|Review/i)`, 10, 'Stock Opname: HQ Audits (arrived live)');
// 4 Customers: a pending store arrives
out.seedCustomer = seed('customer');
await ev(`await __t.go('customers'); return 1;`); out.calm4 = await ev(`return await __t.calm();`);
out.customers = await ev(`const tags = [...document.querySelectorAll('span')].filter((s) => __t.vis(s) && /Pending$/i.test(s.innerText.trim()) && s.querySelector('.kpm-nixie'));
  return tags.map((s) => s.innerText.trim().replace(/\\n+/g, ' ')).slice(0, 5);`);
await crop('dark-customers-pending', `[...document.querySelectorAll('span')].find((s) => __t.vis(s) && /Pending$/i.test(s.innerText.trim()) && s.querySelector('.kpm-nixie'))?.parentElement`, 8, 'Customers: folder with a pending store');
// 5 Customers: duplicates -> the red Delete button (the seeded store is a copy of a real one)
out.dupes = await ev(`const f = __t.btn(/duplicate/i); if (!f) return 'no duplicates button'; f.click(); await new Promise((r) => setTimeout(r, 3000));
  const del = __t.btn(/^Delete$/i); return del ? { ratio: __t.ratio(del), plate: del.className.includes('danger-plate') } : { noDelete: [...document.querySelectorAll('button')].filter(__t.vis).map((b) => b.innerText.trim()).filter(Boolean).slice(0, 25) };`);
await crop('dark-customers-delete', `__t.btn(/^Delete$/i)?.parentElement`, 8, 'Customers duplicates: Delete (red)');
// 6 Sales Terminal: the cart count on the order drawer's handle
await ev(`await __t.go('sales'); return 1;`); out.calm6 = await ev(`return await __t.calm();`);
out.cart = await ev(`const h = [...document.querySelectorAll('.kpm-nixie')].find((n) => n.parentElement && /Manifest|Pesanan/i.test(n.parentElement.innerText)); return h ? { label: h.getAttribute('aria-label') } : { nixies: [...document.querySelectorAll('.kpm-nixie')].map((n) => n.getAttribute('aria-label')) };`);
await crop('dark-cart', `[...document.querySelectorAll('.kpm-nixie')].find((n) => n.parentElement && /Manifest|Pesanan/i.test(n.parentElement.innerText))?.parentElement`, 6, 'Sales Terminal: cart count on the drawer handle');
// 7 light theme: the same counters again
await ev(`document.documentElement.classList.remove('dark'); document.documentElement.classList.add('light'); await new Promise((r) => setTimeout(r, 600)); return 1;`);
await crop('light-cart', `[...document.querySelectorAll('.kpm-nixie')].find((n) => n.parentElement && /Manifest|Pesanan/i.test(n.parentElement.innerText))?.parentElement`, 6, 'Light: cart count');
await crop('light-bell', `document.querySelector('.kpm-bell')`, 14, 'Light: bell');
await ev(`await __t.go('stock_opname'); return 1;`); await ev(`return await __t.calm();`);
await crop('light-opname-tab', `__t.btn(/HQ Audits|Review/i)`, 10, 'Light: HQ Audits');
await ev(`await __t.go('eod'); return 1;`); await ev(`return await __t.calm();`);
await crop('light-eod-tab', `__t.btn(/HQ Verification/i)`, 10, 'Light: HQ Verification');
out.lightLess = await ev(`__t.btn(/HQ Verification/i)?.click(); await new Promise((r) => setTimeout(r, 2500)); const less = __t.btn(/^Less$/i); if (!less) return 'no Less';
  if (!less.className.includes('danger-plate')) { less.click(); await new Promise((r) => setTimeout(r, 600)); } const on = __t.btn(/^Less$/i); return { ratio: __t.ratio(on) };`);
await crop('light-eod-less', `__t.btn(/^Less$/i)?.parentElement`, 8, 'Light: EOD card Less');
await ev(`document.documentElement.classList.remove('light'); document.documentElement.classList.add('dark'); return 1;`);
out.errors = [...new Set(errors)].slice(0, 10);
writeFileSync(DIR + 'result.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1).slice(0, 6000));

const img = (f) => `data:image/png;base64,${readFileSync(DIR + f).toString('base64')}`;
writeFileSync(DIR + '_board.html', `<html><body style="margin:0;background:#1b1a18;color:#eee;font:15px sans-serif;padding:10px;width:900px">
<div style="font-size:19px;font-weight:700;margin-bottom:8px">Tested in the real app (demo, signed in as the owner, phone)</div>
<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">${cells.map((c) => `<div><img src="${img(c.f)}" style="width:${Math.round(c.w * 1.3)}px;max-width:430px;display:block;border:1px solid #444"><div style="padding:3px 0;max-width:430px">${c.cap}</div></div>`).join('')}</div></body></html>`);
const L2 = (await (await fetch('http://127.0.0.1:9555/json/new?about:blank', { method: 'PUT' })).json());
const w2 = new WebSocket(L2.webSocketDebuggerUrl); await new Promise((r) => { w2.onopen = r; });
let j = 0; const p2 = new Map(); w2.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && p2.has(d.id)) { p2.get(d.id)(d); p2.delete(d.id); } };
const s2 = (method, params = {}) => new Promise((r) => { const i = ++j; p2.set(i, r); w2.send(JSON.stringify({ id: i, method, params })); });
await s2('Page.enable'); await s2('Emulation.setDeviceMetricsOverride', { width: 920, height: 100, deviceScaleFactor: 1, mobile: false });
await s2('Page.navigate', { url: 'file:///' + (DIR + '_board.html').replace(/\\/g, '/') }); await sleep(1200);
const h = (await s2('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })).result.result.value;
await s2('Emulation.setDeviceMetricsOverride', { width: 920, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(400);
const b = await s2('Page.captureScreenshot', { format: 'png' }); rmSync(DIR + 'BOARD.png', { force: true }); writeFileSync(DIR + 'BOARD.png', Buffer.from(b.result.data, 'base64'));
await s2('Page.close'); console.log('BOARD.png', h); process.exit(0);
