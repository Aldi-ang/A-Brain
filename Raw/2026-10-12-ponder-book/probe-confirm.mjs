/* confirm the two causes in the lab, changing no app code: (A) the pressed-state transform on buttons inside the 3D page
   loses the click; (B) the opening animation, left attached to the sheets, pins them after a ribbon jump. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const OUT = process.argv[2], W = Number(process.argv[3] || 1280), H = Number(process.argv[4] || 800);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(OUT, 'profile-cf'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9407', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9407/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EVAL ERROR ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300) : r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: W < 768 ? 2 : 1, mobile: W < 768 });
if (W < 768) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
const fresh = async () => { await send('Page.navigate', { url: 'http://localhost:4187/tools/ponder-lab.html?book&tab=restock_vault' }); await sleep(2200); };
const top = (sel) => js(`(() => { for (const b of document.querySelectorAll('[role=dialog] ${sel}')) { const q = b.getBoundingClientRect(); const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); if (e && b.contains(e)) return [q.left + q.width / 2, q.top + q.height / 2]; } return null; })()`);
const press = async (p) => { if (!p) return 'NO TARGET';
  if (W < 768) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p[0], y: p[1] }] }); await sleep(70); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p[0], y: p[1] }); await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: p[0], y: p[1], button: 'left', buttons: 1, clickCount: 1 }); await sleep(70); await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p[0], y: p[1], button: 'left', clickCount: 1 }); }
  return 'pressed'; };
const bookOpen = () => js(`!!document.querySelector('[role=dialog][aria-label="Tutorial book"]')`);
const NO_PRESS_SHRINK = `(() => { const s = document.createElement('style'); s.textContent = '[role=dialog] [style*="perspective"] button:active, [role=dialog] [style*="perspective"] button:hover { transform: none !important; }'; document.head.appendChild(s); return 'injected'; })()`;
const out = [];
for (const fix of [false, true]) {
  const tag = fix ? 'WITH the pressed-shrink switched off' : 'as shipped';
  await fresh(); if (fix) await js(NO_PRESS_SHRINK);
  await press(await top('button[aria-label="Close"]')); await sleep(1400);
  out.push(`X (${tag}): book ${await bookOpen() ? 'STILL OPEN' : 'closed'}`);
  await fresh(); if (fix) await js(NO_PRESS_SHRINK);
  await press(await top('button[aria-label="Next page"]')); await sleep(1000);
  out.push(`Next page (${tag}): counter on top ${JSON.stringify(await js(`[...document.querySelectorAll('[role=dialog] span')].filter(s => /^\\d+ \\/ \\d+$/.test(s.innerText.trim())).filter(s => { const q = s.getBoundingClientRect(); const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return e && s.contains(e); }).map(s => s.innerText.trim())`))}`);
  await fresh(); if (fix) await js(NO_PRESS_SHRINK);
  await press(await top('button:not([aria-label]):not([style*="polygon"])')); await sleep(1400);
  out.push(`a card, Goods Received (${tag}): book ${await bookOpen() ? 'STILL OPEN - the pick was lost' : 'gone - the tutorial was picked'}`);
}
/* B: the blank page after a ribbon, and what clears it */
await fresh();
await js(`[...document.querySelectorAll('[role=dialog] button')].find(x => x.style.clipPath && x.innerText.trim().toUpperCase() === 'VAULT').click()`); await sleep(900);
const leftNow = () => js(`(() => { const st = document.querySelector('[role=dialog] [style*="perspective"]').getBoundingClientRect(); const e = document.elementFromPoint(st.left + st.width * ${W < 1024 ? 0.5 : 0.25}, st.top + st.height * 0.4); const f = e && e.closest('.overflow-hidden'); return f ? f.innerText.replace(/\\s+/g, ' ').slice(0, 40) : 'BLANK (' + (e && e.tagName) + ')'; })()`);
const pinned = () => js(`[...document.querySelectorAll('[role=dialog] [style*="perspective"] div[style*="transform-origin"]')].flatMap(s => s.getAnimations()).filter(a => a.playState === 'finished').length`);
out.push(`ribbon VAULT: ${W < 1024 ? 'page' : 'left page'} = ${await leftNow()}; finished opening animations still holding sheets: ${await pinned()}`);
await js(`[...document.querySelectorAll('[role=dialog] [style*="perspective"] div[style*="transform-origin"]')].flatMap(s => s.getAnimations()).filter(a => a.playState === 'finished').forEach(a => a.cancel())`); await sleep(300);
out.push(`...after cancelling those finished animations by hand: ${W < 1024 ? 'page' : 'left page'} = ${await leftNow()}`);
console.log(`[${W}x${H}]\n` + out.join('\n'));
ws.close(); chrome.kill();
