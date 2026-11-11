// node shot.mjs <url> <out.png> <width> <height> [phone] [fullpage]
// One headless Chrome, one frame. phone = 375-class emulation (touch + hover none, DPR 2). The old png is deleted first.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const [url, out, w, h, ...flags] = process.argv.slice(2);
const phone = flags.includes('phone'), full = flags.includes('fullpage');
const port = 9600 + Math.floor(Math.random() * 300);
const prof = `${DIR}prof-shot-${port}`;
rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank']);
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: Number(w), height: Number(h), deviceScaleFactor: phone ? 2 : 1, mobile: phone });
if (phone) { await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] }); }
await send('Page.navigate', { url }); await sleep(2500);
const info = (await send('Runtime.evaluate', { expression: `JSON.stringify({ w: innerWidth, sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight, imgs: [...document.images].filter((i) => !i.complete || !i.naturalWidth).length, hoverNone: matchMedia('(hover: none)').matches, fit: window.__fit || null })`, returnByValue: true })).result.result.value;
rmSync(out, { force: true });
const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full });
writeFileSync(out, Buffer.from(s.result.data, 'base64'));
console.log(out.split(/[\\/]/).pop(), statSync(out).size, info);
await send('Browser.close').catch(() => {}); chrome.kill(); await sleep(600); try { rmSync(prof, { recursive: true, force: true }); } catch { /* Chrome still holds it; swept later */ }
process.exit(0);
