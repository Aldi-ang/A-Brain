/* one real finger tap on the phone's demo page, then a probe: node tap.mjs <x> <y> [<probe.js>] - debugging only */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const [x, y, probeFile] = process.argv.slice(2);
execFileSync('C:/Users/ASUS/AppData/Local/Android/Sdk/platform-tools/adb.exe', ['forward', 'tcp:9223', 'localabstract:chrome_devtools_remote']);
const list = await (await fetch('http://127.0.0.1:9223/json/list')).json();
const page = list.find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && wait.has(d.id)) { wait.get(d.id)(d.result); wait.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pt = [{ x: Number(x), y: Number(y), radiusX: 4, radiusY: 4, force: 1, id: 1 }];
const hit = await send('Runtime.evaluate', { expression: `(() => { const e = document.elementFromPoint(${Number(x)}, ${Number(y)}); return e ? (e.closest('button')?.getAttribute('aria-label') || e.tagName + '.' + String(e.className).slice(0, 60)) : null; })()`, returnByValue: true });
console.log('under the finger:', hit.result.value);
await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt });
await sleep(70);
await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await sleep(1200);
if (probeFile) {
    const r = await send('Runtime.evaluate', { expression: `(async () => { ${readFileSync(probeFile, 'utf8')} })()`, awaitPromise: true, returnByValue: true });
    console.log(JSON.stringify(r.result.value));
}
process.exit(0);
