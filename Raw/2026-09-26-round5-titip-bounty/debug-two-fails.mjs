// Debug the two failing steps of test-all-today.mjs: (1) the EOD Back step under phone emulation WITH touch vs
// without; (2) the roster swipe - a touch drag through real touch events, and what the stage can scroll at all.
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'debug-shots'); fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9342',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9342/json/list')).json(); } catch { /* up soon */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable');

for (const touch of [false, true]) {
  await send('Emulation.setDeviceMetricsOverride', { width: 430, height: 930, deviceScaleFactor: 1, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: touch });
  await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&eod' }); await sleep(3800);
  await js(`localStorage.clear(); true`); await send('Page.reload'); await sleep(3800);
  const f = await js(`(() => { const i = document.querySelector('input[inputmode="numeric"]:not([disabled])'); if (!i) return 'no input'; i.scrollIntoView({ block: 'center' }); i.focus(); return document.activeElement === i; })()`);
  await send('Input.insertText', { text: '150000' }); await sleep(300);
  console.log(`touch=${touch}`, 'focused', f, 'value', await js(`document.querySelector('input[inputmode="numeric"]:not([disabled])')?.value`),
    'buttons', await js(`JSON.stringify([...document.querySelectorAll('button')].map(b => b.textContent.trim()).filter(t => /letter|Enter what|Back/.test(t)))`));
}

/* the roster: how far can it scroll, and does a real touch drag move it one card */
await send('Emulation.setTouchEmulationEnabled', { enabled: true });
await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&fleet' }); await sleep(3800);
const s = await js(`(() => { const st = document.querySelector('.kpm-stage'); st.scrollIntoView({ block: 'center' }); const r = st.getBoundingClientRect();
  return { cards: st.querySelectorAll('.kpm-actor').length, scrollW: st.scrollWidth, clientW: st.clientWidth, left: st.scrollLeft, y: Math.round(r.top + r.height / 2), x: Math.round(r.left + r.width * 0.8) }; })()`);
console.log('stage', JSON.stringify(s));
const touch = (type, x) => send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y: s.y }] });
await touch('touchStart', s.x); for (let i = 1; i <= 10; i++) { await touch('touchMove', s.x - i * 30); await sleep(16); } await touch('touchEnd'); await sleep(1200);
console.log('after a 300 px touch drag, scrollLeft =', await js(`document.querySelector('.kpm-stage').scrollLeft`));
ws.close(); chrome.kill();
