// node built.mjs -> the BUILT nixie count badge (his pick 1) on the real HQ Audits tab + the bell, lab 4187, phone,
// dark + light; samples the reel's translate from page start to prove the roll-in; makes BUILT.png
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LAB = 'http://localhost:4187/tools/ponder-lab.html?shell&opname&admin&bell';
const SAMPLER = `window.__s = []; (function tick(t0) { const r = document.querySelector('.kpm-opname-tabs .kpm-nixie-reel');
  if (r) { const v = getComputedStyle(r).translate; if (!window.__s.length || window.__s[window.__s.length - 1].v !== v) window.__s.push({ ms: Math.round(performance.now()), v }); }
  if (performance.now() < 6000) requestAnimationFrame(() => tick()); })();`;
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
await send('Page.addScriptToEvaluateOnNewDocument', { source: SAMPLER });
const cells = [];
for (const [key, q] of [['dark', ''], ['light', '&light']]) {
  await send('Page.navigate', { url: LAB + q }); await sleep(3000);
  console.log(key, 'reel translate over time:', JSON.stringify(await ev('window.__s')));
  for (const [what, sel, pad] of [['tab', `[...document.querySelectorAll('.kpm-opname-tabs button')].find((b) => /HQ Audits/i.test(b.textContent))`, 10], ['bell', `document.querySelector('.kpm-bell')`, 14]]) {
    await ev(`(${sel})?.scrollIntoView({block:'center'})`); await sleep(300);
    const clip = await ev(`(() => { const e = ${sel}; if (!e) return null; const r = e.getBoundingClientRect(); const x = Math.max(0, r.left - ${pad});
      return { x, y: Math.max(0, r.top + scrollY - ${pad}), width: Math.min(390 - x, r.width + ${pad} * 2), height: r.height + ${pad} * 2, scale: 1 }; })()`);
    if (!clip) { console.log(key, what, 'not found'); continue; }
    const s = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
    const f = `built-${key}-${what}.png`; rmSync(DIR + f, { force: true }); writeFileSync(DIR + f, Buffer.from(s.result.data, 'base64'));
    cells.push({ key, what, f, w: clip.width });
  }
}
const img = (f) => `data:image/png;base64,${readFileSync(DIR + f).toString('base64')}`;
writeFileSync(DIR + '_built.html', `<html><body style="margin:0;background:#1b1a18;color:#eee;font:15px sans-serif;padding:10px">
<div style="font-size:19px;font-weight:700;margin-bottom:8px">Built: the nixie counter (your pick 1), real screen, phone</div>
<div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">${cells.map((c) => `<div><img src="${img(c.f)}" style="width:${Math.round(c.w * 1.4)}px;display:block;border:1px solid #444"><div style="padding:3px 0">${c.key} - ${c.what === 'tab' ? 'HQ Audits tab' : 'bell'}</div></div>`).join('')}</div></body></html>`);
await send('Emulation.setDeviceMetricsOverride', { width: 760, height: 100, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'file:///' + (DIR + '_built.html').replace(/\\/g, '/') }); await sleep(800);
const h = await ev('document.documentElement.scrollHeight');
await send('Emulation.setDeviceMetricsOverride', { width: 760, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(300);
const b = await send('Page.captureScreenshot', { format: 'png' });
rmSync(DIR + 'BUILT.png', { force: true }); writeFileSync(DIR + 'BUILT.png', Buffer.from(b.result.data, 'base64'));
console.log('BUILT.png', h); chrome.kill(); process.exit(0);
