// A kept-open headless Chrome for the mission walk (one browser = one visitor: the mission line lives in its storage).
//   node drive.mjs start            start Chrome on 9555 (profile prof-today), phone, open the demo on 5176
//   node drive.mjs run <file.js> [shot] [pc]   run the file's body (an async function body, `__h` helpers inside) and print
//                                    what it returns; [shot] = frame name -> mission-<shot>.png
//   node drive.mjs stop
// Emulation belongs to the DevTools session, so every run sets the phone again before it does anything.
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const PORT = 9561; const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const [cmd, file, name, mode] = process.argv.slice(2);
if (cmd === 'start') {
  rmSync(DIR + 'prof-today', { recursive: true, force: true });
  spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${DIR}prof-today`, '--hide-scrollbars', 'about:blank'], { detached: true, stdio: 'ignore' }).unref();
  await sleep(2500);
}
let list = [];
for (let i = 0; i < 40 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
if (cmd === 'stop') { try { await fetch(`http://127.0.0.1:${PORT}/json/version`); const ws = new WebSocket((await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; }); ws.send(JSON.stringify({ id: 1, method: 'Browser.close' })); await sleep(500); } catch { /* gone */ } process.exit(0); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push('throw: ' + String(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text).slice(0, 220));
  if (d.method === 'Runtime.consoleAPICalled' && (d.params.type === 'error' || /permission|denied|insufficient/i.test(JSON.stringify(d.params.args))))
    errors.push(d.params.type + ': ' + d.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 220)); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable'); await send('Page.enable');
if (mode === 'pc') await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
else { await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true }); await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] }); }
if (cmd === 'start') { await send('Page.navigate', { url: 'http://localhost:5176/' }); await sleep(3000); console.log('started'); process.exit(0); }
const HELP = readFileSync(DIR + 'help.js', 'utf8');
const body = readFileSync(file, 'utf8');
await sleep(400);
const r = await send('Runtime.evaluate', { expression: `(async () => { ${HELP}; const { sleep, set, any, wait, stat, vis, cap, click } = window.__h; ${body} })()`, awaitPromise: true, returnByValue: true });
let val = r.result?.exceptionDetails ? 'EXCEPTION ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 400) : r.result?.result?.value;
/* a body that returns { tap: [x, y] } gets a real finger tap there (touch events -> pointer events, as on a phone), then
   the guide is read again */
if (val && val.tap) {
  const [x, y] = val.tap; const pt = [{ x, y, radiusX: 4, radiusY: 4, force: 1, id: 1 }];
  if (mode === 'pc') { for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 }); }
  else { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  await sleep(Number(val.after) || 1500);
  const r2 = await send('Runtime.evaluate', { expression: `(async () => { const { cap, stat } = window.__h; return { cap: cap(), stat: stat() }; })()`, awaitPromise: true, returnByValue: true });
  val = { ...val, then: r2.result?.result?.value };
}
if (val && val.type) { await send('Input.insertText', { text: String(val.type) }); await sleep(800); }
let shotInfo = '';
if (name) { await sleep(300); const f = `${DIR}today-${name}.png`; rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(f, Buffer.from(s.result.data, 'base64')); shotInfo = `today-${name}.png ${statSync(f).size}`; }
console.log(JSON.stringify({ val, errors: [...new Set(errors)].slice(0, 8), shot: shotInfo }, null, 1));
process.exit(0);
