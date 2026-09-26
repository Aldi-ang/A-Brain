// His 07:50: the agent's EOD goes back a card and keeps a draft. ?shell&eod (Budi, m2): count cash, put it in the
// letter, press Back (the cash card returns holding 150000), put it in again, then RELOAD - leaving the tab unmounts the
// screen the same way - and the draft must bring him back to the transfer card with cash still in the letter.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'eod-draft-shots');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9338',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9338/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shoot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(s.result.data, 'base64')); return name; };
const btn = (re) => js(`(() => { const b = [...document.querySelectorAll('button')].find(x => ${re}.test(x.textContent) && !x.disabled); if (!b) return false; b.scrollIntoView({ block: 'center' }); b.click(); return true; })()`);
const state = () => js(`JSON.stringify({
  input: document.querySelector('input[inputmode="numeric"]:not([disabled])')?.value ?? null,
  top: [...document.querySelectorAll('button')].map(b => b.textContent.trim()).find(t => /in the letter|Enter what you counted|Check all|Count all/.test(t)) || null,
  back: [...document.querySelectorAll('button')].some(b => /← Back$/.test(b.textContent.trim())),
  draft: Object.keys(localStorage).filter(k => k.startsWith('kpm-eod-draft:')) })`);

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 430, height: 930, deviceScaleFactor: 1, mobile: true });
await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&eod' });
await sleep(3500);
await js(`localStorage.clear(); true`);
await send('Page.reload'); await sleep(3500);

await js(`(() => { const i = document.querySelector('input[inputmode="numeric"]:not([disabled])'); i.scrollIntoView({ block: 'center' }); i.focus(); return true; })()`);
await send('Input.insertText', { text: '150000' }); await sleep(300);
console.log('1 typed', await state());
await btn('/in the letter/'); await sleep(1200);
console.log('2 cash in, transfer on top', await state());
await btn('/← Back$/'); await sleep(900);
console.log(await shoot('1-back-to-cash-430'), await state());
await btn('/in the letter/'); await sleep(1200);
await send('Page.reload'); await sleep(3800);
await js(`document.querySelector('ol')?.scrollIntoView({ block: 'start' }); true`); await sleep(300);
console.log(await shoot('2-after-reload-430'), await state(), await js(`(document.body.innerText.match(/Cash[^\\n]*\\n?[^\\n]*/) || [''])[0].slice(0, 60)`));
ws.close(); chrome.kill();
