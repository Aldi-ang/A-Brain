/* where does a press on the book's X go? Log every pointer/mouse/click event (capture phase) during one real CDP click. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const OUT = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(OUT, 'profile-ev'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9406', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9406/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EVAL ERROR ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300) : r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://localhost:4187/tools/ponder-lab.html?book&tab=restock_vault' }); await sleep(2200);
await js(`(() => { window.__ev = []; const d = (e) => { const t = e.target; window.__ev.push(e.type + ' -> ' + (t.closest && t.closest('button') ? 'BUTTON[' + (t.closest('button').getAttribute('aria-label') || t.closest('button').innerText.trim().slice(0, 14)) + ']' : t.tagName + '.' + String(t.className).slice(0, 25)) + (e.defaultPrevented ? ' (prevented)' : '')); };
  for (const ty of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click', 'lostpointercapture', 'gotpointercapture']) window.addEventListener(ty, d, true); })()`);
const xy = await js(`(() => { for (const b of document.querySelectorAll('[role=dialog] button[aria-label="Close"]')) { const q = b.getBoundingClientRect(); const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); if (e && b.contains(e)) return [q.left + q.width / 2, q.top + q.height / 2]; } return null; })()`);
console.log('X at', xy);
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: xy[0], y: xy[1] });
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: xy[0], y: xy[1], button: 'left', buttons: 1, clickCount: 1 }); await sleep(60);
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: xy[0], y: xy[1], button: 'left', buttons: 0, clickCount: 1 }); await sleep(300);
console.log('events (real press):', JSON.stringify(await js('window.__ev'), null, 0));
console.log('after 1.2 s:', await (async () => { await sleep(1200); return js(`document.querySelector('[role=dialog][aria-label="Tutorial book"]') ? 'STILL OPEN' : 'closed'`); })());
/* the same button pressed by script, to split "the handler is dead" from "the press never reaches it" */
await js('window.__ev = []');
console.log('script .click():', await js(`(() => { for (const b of document.querySelectorAll('[role=dialog] button[aria-label="Close"]')) { const q = b.getBoundingClientRect(); const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); if (e && b.contains(e)) { b.click(); return 'clicked'; } } return 'none'; })()`));
await sleep(1500);
console.log('after script click 1.5 s:', await js(`document.querySelector('[role=dialog][aria-label="Tutorial book"]') ? 'STILL OPEN' : 'closed'`), JSON.stringify(await js('window.__ev')));
ws.close(); chrome.kill();
