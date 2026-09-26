// The exact EOD sequence of test-all-today.mjs, printing the state after every action.
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'debug-shots'); fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9343',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9343/json/list')).json(); } catch { /* up soon */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const open = async (q) => { await send('Emulation.setDeviceMetricsOverride', { width: 430, height: 930, deviceScaleFactor: 1, mobile: true, hasTouch: true }); await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?' + q }); await sleep(3800); };
const state = (tag) => js(`JSON.stringify({ tag: ${JSON.stringify(tag)}, inputs: [...document.querySelectorAll('input[inputmode="numeric"]')].map(i => (i.disabled ? 'x' : '') + i.value),
  keys: [...document.querySelectorAll('button')].map(b => b.textContent.trim()).filter(t => /letter|Enter what|Back|Check all/.test(t)), draft: localStorage.getItem('kpm-eod-draft:m2:' + new Date().toISOString().slice(0, 10))?.length || 0 })`);
const btn = (re) => js(`(() => { const b = [...document.querySelectorAll('button')].find(x => ${re}.test(x.textContent) && !x.disabled); if (!b) return false; b.scrollIntoView({ block: 'center' }); b.click(); return b.textContent.trim(); })()`);
await send('Page.enable');
await open('shell&agent');
await open('shell&eod');
await js(`localStorage.clear(); true`); await send('Page.reload'); await sleep(3800);
console.log(await state('loaded'));
await js(`(() => { const i = document.querySelector('input[inputmode="numeric"]:not([disabled])'); i.scrollIntoView({ block: 'center' }); i.focus(); return true; })()`);
await send('Input.insertText', { text: '150000' }); await sleep(300);
console.log(await state('typed'));
console.log('pressed', await btn('/in the letter/')); await sleep(1200);
console.log(await state('in letter'));
console.log('pressed', await btn('/← Back$/')); await sleep(900);
console.log(await state('after back'));
ws.close(); chrome.kill();
