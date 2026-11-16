/* what window.print() puts on paper: the lab page (CDP 9557) rendered with print media at A4 width, shot, then put back */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const list = await (await fetch('http://127.0.0.1:9557/json/list')).json();
const page = list.find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const w = m.id && wait.get(m.id); if (w) { wait.delete(m.id); w(m.result); } });
const send = (method, params = {}) => new Promise((res) => { const i = ++id; wait.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });
await send('Emulation.setEmulatedMedia', { media: 'print' });
await new Promise((r) => setTimeout(r, 600));
const s = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 794, height: 1123, scale: 0.8 } });
writeFileSync(DIR + 'sj-print.png', Buffer.from(s.data, 'base64'));
await send('Emulation.setEmulatedMedia', { media: '' });
console.log('ok'); ws.close(); setTimeout(() => process.exit(0), 50);
