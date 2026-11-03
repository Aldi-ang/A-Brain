// node photo-probe.mjs - the TAKEN-photo frame as built (MerchantSalesView: <div className="kpm-photo kpm-corners"><img
// className="w-full h-32 object-contain">), on the real manifest paper with the real CSS. A PROBE: the lab's terminal tier
// has no file picker and headless has no camera, so the frame's exact markup is placed under the button with a stand-in
// picture drawn on a canvas. Proves the look of the CSS, not the capture flow.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 60000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 1150, deviceScaleFactor: 2, mobile: true });
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', 'id'); } catch (e) {}` });
await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&terminal&many&promo' });
await ev(`(async () => { for (let i = 0; i < 100 && !document.querySelector('[aria-label^="Manifest,"]'); i++) await new Promise((r) => setTimeout(r, 150)); })()`); await sleep(800);
await ev(`document.querySelector('[aria-label^="Manifest,"]')?.click()`); await sleep(1000);
const got = await ev(`(() => {
  const btn = document.querySelector('[data-guide="photo"]'); if (!btn) return 'no button';
  const c = document.createElement('canvas'); c.width = 480; c.height = 300; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 480, 300); gr.addColorStop(0, '#6b5a44'); gr.addColorStop(1, '#2e261d'); g.fillStyle = gr; g.fillRect(0, 0, 480, 300);
  g.fillStyle = '#c9b48a'; g.fillRect(150, 90, 180, 120); g.fillStyle = '#2e261d'; g.font = 'bold 28px Georgia'; g.fillText('TOKO', 200, 160);
  btn.insertAdjacentHTML('afterend', '<div class="kpm-photo kpm-corners" id="probe" style="margin-top:10px"><img src="' + c.toDataURL() + '" alt="Proof" class="block max-w-full max-h-40 w-auto h-auto"></div>');
  document.getElementById('probe').scrollIntoView({ block: 'start' }); scrollBy(0, -140); return 'ok'; })()`);
await sleep(400);
const box = await ev(`(() => { const a = document.querySelector('[data-guide="photo"]').getBoundingClientRect(), b = document.getElementById('probe').getBoundingClientRect(); return { x: Math.max(0, a.x - 18), y: a.y - 30, width: a.width + 36, height: b.bottom - a.y + 50 }; })()`);
const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } }); writeFileSync(DIR + 'built-phone-photo-probe.png', Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ got, box }));
ws.close(); chrome.kill(); process.exit(0);
