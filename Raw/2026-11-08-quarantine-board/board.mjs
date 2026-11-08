// node board.mjs  (lab on 4190) -> the Quarantine "sell again" board: the crate button, the price box, and two places on the
// terminal shelf for a damaged pack put back on sale. Drawn on the real screens; only injected DOM, no app code changed.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
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
const run = (fn, arg) => ev(`(${fn.toString()})(${JSON.stringify(arg)})`);
await send('Page.enable'); await send('Runtime.enable');

const device = async (phone) => {
  await send('Storage.clearDataForOrigin', { origin: 'http://localhost:4190', storageTypes: 'local_storage,indexeddb' }).catch(() => {});
  await send('Emulation.setDeviceMetricsOverride', phone ? { width: 390, height: 844, deviceScaleFactor: 2, mobile: true } : { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setTouchEmulationEnabled', { enabled: phone, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: phone ? [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] : [] });
};
const shot = async (name, clip) => { const f = `${DIR}${name}.png`; rmSync(f, { force: true });
  const r = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { x: Math.max(0, Math.round(clip.x)), y: Math.max(0, Math.round(clip.y)), width: Math.round(clip.w), height: Math.round(clip.h), scale: 1 } } : {}) });
  writeFileSync(f, Buffer.from(r.result.data, 'base64')); };

const TAG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>';

/* 1. THE CRATE: Stock Opname > Quarantine > BANDUNG > Cello Green 16, a Sell Again button after Convert to Sample, in the
   siblings' own box (RTV's classes), with a gold edge. */
async function crate(TAG) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const click = (sel, re) => { const b = [...document.querySelectorAll(sel)].find((x) => re.test(x.getAttribute('aria-label') || x.innerText)); if (b) b.click(); return !!b; };
  for (let i = 0; i < 120 && ![...document.querySelectorAll('button')].some((x) => /^\s*quarantine\s*$/i.test(x.innerText)); i++) await sleep(150);
  await sleep(600);
  const o = {};
  o.tab = click('button', /^\s*quarantine\s*$/i); await sleep(1300);
  o.crate = click('button[aria-label^="Quarantine crate"]', /BANDUNG/); await sleep(1300);
  o.pick = click('[role="button"][aria-label$="Bks damaged"]', /Cello Green/); await sleep(900);
  const btns = [...document.querySelectorAll('button')];
  const conv = btns.find((x) => /convert to sample/i.test(x.innerText)), rtv = btns.find((x) => /rtv factory/i.test(x.innerText));
  if (!conv || !rtv) return o;
  const sell = rtv.cloneNode(true); sell.id = 'sell-again'; sell.style.borderColor = 'var(--accent-edge)';
  sell.innerHTML = TAG + ' Sell Again'; conv.after(sell);
  sell.scrollIntoView({ block: 'center' }); await sleep(500);
  const row = conv.parentElement.getBoundingClientRect();
  const line = [...document.querySelectorAll('*')].filter((e) => e.children.length === 0 && /Total HPP Loss/.test(e.textContent)).map((e) => e.getBoundingClientRect())[0];
  o.row = [row.left, row.top, row.width, row.height].map(Math.round); o.line = line && [line.left, line.top, line.width, line.height].map(Math.round);
  return o;
}

/* 2. THE PRICE BOX: the real Convert to Sample box, its words and its Reason field turned into the Sell Again box. */
async function priceBox(TAG) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  [...document.querySelectorAll('button')].find((x) => /convert to sample/i.test(x.innerText))?.click(); await sleep(900);
  const f = document.querySelector('form'); const box = f?.closest('.rounded-2xl'); if (!box) return 'no box';
  box.querySelector('h3').innerHTML = TAG.replace(/14/g, '16') + ' Sell Again';
  const k = [...f.children];
  k[1].querySelector('label').textContent = 'Quantity to put on sale (Bks)'; k[1].querySelector('input').value = '8';
  k[2].innerHTML = 'Goes on sale as <span class="text-[var(--ink)] font-black">CELLO GREEN 16 · RUSAK</span>, with the damaged mark. It waits in BANDUNG until a van loads it.';
  const opt = (t, on, first) => `<span class="text-[11px] font-black uppercase tracking-widest" style="flex:1;text-align:center;padding:8px 12px 9px;position:relative;color:var(${on ? '--ink' : '--ink-dim'});${first ? '' : 'border-left:1px solid var(--line);'}">${t}${on ? '<i style="position:absolute;left:6px;right:6px;bottom:-1px;height:2px;background:var(--accent-edge)"></i>' : ''}</span>`;
  k[3].innerHTML = '<label class="text-[11px] lg:text-[10px] text-[var(--ink-dim)] uppercase tracking-widest mb-2 block">Price per Bks</label>' +
    `<div style="display:flex;border-bottom:1px solid var(--line);margin-bottom:12px">${opt('Full price · 11,1 rb', false, true)}${opt('Cheaper', true, false)}</div>` +
    '<div class="w-full bg-[var(--sunk)] border border-[var(--accent-edge)] p-3 rounded-lg" style="display:flex;align-items:baseline;gap:8px"><span class="text-[var(--ink-dim)] font-mono">Rp</span><span class="text-[var(--ink)] font-mono text-lg font-black">8.500</span></div>' +
    '<p class="text-[11px] lg:text-[10px] text-[var(--ink-dim)] uppercase tracking-widest" style="margin-top:10px">Only Tier 3 and up can set this price</p>';
  const b = k[4]; [...b.childNodes].filter((n) => n.nodeType === 3).forEach((n) => n.remove()); b.append(' Put on sale');
  const r = box.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round);
}

/* 3. THE SHELF: a copy of the Cello Green 16 card as the lot on sale (8 Bks, a cheaper price, the hazard mark of HazardMark.jsx),
   look 1 right after its pack, look 2 at the end of the shelf under a thin line. */
async function shelf({ look, phone }) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let i = 0; i < 120 && !(document.querySelector('.kpm-wares-3up')?.children.length > 3); i++) await sleep(150);
  await sleep(1200);
  const { HAZARD_SIGN } = await import('/src/utils/vanBay.js');
  const g = document.querySelector('.kpm-wares-3up');
  const src = [...g.children].find((c) => c.querySelector('h4')?.textContent.trim() === 'Cello Green 16'); if (!src) return 'no card';
  const leafRb = (el) => [...el.querySelectorAll('*')].find((e) => e.children.length === 0 && /rb$/.test(e.textContent.trim()));
  const price = leafRb(src)?.textContent.trim();
  const t = src.cloneNode(true); t.id = 'rusak';
  t.querySelector('h4').textContent = 'Cello Green 16 · Rusak';
  t.querySelectorAll('.kpm-flip-face').forEach((x) => { x.textContent = '8 Bks'; });
  const pe = leafRb(t); if (pe) pe.textContent = '8,5 rb';
  const m = document.createElement('span');
  m.className = 'pointer-events-none absolute grid place-items-center rounded-[22%] bg-[#f2c200] border border-[#141414]';
  m.style.cssText = phone ? 'width:22px;height:22px;right:2px;bottom:2px;z-index:20' : 'width:44px;height:44px;left:14px;bottom:14px;z-index:20';
  m.innerHTML = '<svg viewBox="0 0 15 15" shape-rendering="crispEdges" style="width:74%;height:74%">' + HAZARD_SIGN.map(([x, y]) => `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="#141414"/>`).join('') + '</svg>';
  t.querySelector('.kpm-cube-stage').parentElement.appendChild(m);
  if (look === 1) src.after(t);
  else {
    const d = document.createElement('div'); d.style.cssText = 'grid-column:1/-1;display:flex;align-items:center;gap:10px;padding:4px 2px 0';
    d.innerHTML = '<span style="flex:1;height:1px;background:var(--duke-edge-1)"></span><span class="text-[11px] font-black uppercase tracking-widest" style="color:var(--duke-ink-3)">Damaged, still sellable</span><span style="flex:1;height:1px;background:var(--duke-edge-1)"></span>';
    g.append(d, t);
  }
  t.scrollIntoView({ block: 'center' }); await sleep(600);
  const r = t.getBoundingClientRect(), gr = g.getBoundingClientRect();
  return { price, card: [r.left, r.top, r.width, r.height].map(Math.round), grid: [gr.left, gr.top, gr.width, gr.height].map(Math.round) };
}

const out = {};
for (const phone of [false, true]) {
  const k = phone ? 'phone' : 'pc';
  await device(phone);
  await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&opname&admin' }); await sleep(2500);
  const c = out[k + 'Crate'] = await run(crate, TAG);
  if (c.row && c.line) { const x = Math.min(c.line[0], c.row[0]) - 20, y = c.line[1] - 110, r = Math.max(c.line[0] + c.line[2], c.row[0] + c.row[2]) + 20;
    await shot(`${k}-crate`, { x, y, w: Math.min(r, phone ? 390 : 1280) - Math.max(0, x), h: c.row[1] + c.row[3] + 20 - y }); }
  if (!phone) { const b = out.box = await run(priceBox, TAG); if (Array.isArray(b)) await shot('pc-price', { x: b[0] - 16, y: b[1] - 16, w: b[2] + 32, h: b[3] + 32 }); }
  for (const look of [1, 2]) {
    await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&terminal&many&promo&admin' }); await sleep(2500);
    const s = out[`${k}Shelf${look}`] = await run(shelf, { look, phone });
    if (s.card) await shot(`${k}-shelf${look}`, phone ? null : { x: s.grid[0], y: Math.max(0, s.card[1] - 300), w: s.grid[2], h: 640 });
  }
}

const img = (f, w) => `<img src="${f}.png" style="width:${w}px">`;
const col = (label, inner) => `<div class="c"><small>${label}</small>${inner}</div>`;
writeFileSync(DIR + 'board.html', `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#141210;color:#e8e4dc;font:600 15px Segoe UI,sans-serif;padding:18px;width:1180px}h2{font-size:16px;margin:22px 0 4px}p{margin:0 0 8px;color:#a79f93;font-weight:500;font-size:13px}.r{display:flex;gap:18px;align-items:flex-start}.c{display:flex;flex-direction:column;gap:4px}small{color:#a79f93;font-weight:500}img{display:block;border:1px solid #3a3530}.d{border:1px solid #d08a2e;border-radius:10px;padding:4px 14px 14px;margin-top:22px}</style>
<h2>A. On the crate: a Sell Again button, after Convert to Sample</h2><p>Stock Opname &gt; Quarantine &gt; a warehouse &gt; a damaged product. Same box as the buttons next to it, with a gold edge.</p>
<div class="r">${col('PC', img('pc-crate', 720))}${col('Phone', img('phone-crate', 300))}</div>
<h2>B. The price box: full price or cheaper</h2><p>Only Tier 3 and up can set the price: a new key in the Access Matrix. The packs keep the damaged mark and wait in that warehouse until a van loads them, like any pack.</p>
<div class="r">${col('PC (the phone shows the same box)', img('pc-price', 460))}</div>
<div class="d"><h2>🔴 C. Where the damaged pack sits on the Sales Terminal shelf</h2>
<h2>1 &nbsp;Right after its own pack</h2><div class="r">${col('Phone', img('phone-shelf1', 300))}${col('PC', img('pc-shelf1', 760))}</div>
<h2>2 &nbsp;All damaged packs together at the end, under a thin line</h2><div class="r">${col('Phone', img('phone-shelf2', 300))}${col('PC', img('pc-shelf2', 760))}</div></div>`);
await send('Emulation.setDeviceMetricsOverride', { width: 1216, height: 900, deviceScaleFactor: 1, mobile: false }); await send('Emulation.setTouchEmulationEnabled', { enabled: false }); await send('Emulation.setEmulatedMedia', { features: [] });
await send('Page.navigate', { url: 'file:///' + (DIR + 'board.html').replace(/\\/g, '/') }); await sleep(1200);
const H = await ev('document.documentElement.scrollHeight');
const b = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1216, height: H, scale: 1 } }); rmSync(DIR + 'board.png', { force: true }); writeFileSync(DIR + 'board.png', Buffer.from(b.result.data, 'base64'));
out.errors = errors;
console.log(JSON.stringify(out));
chrome.kill(); process.exit(0);
