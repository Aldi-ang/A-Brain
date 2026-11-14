// Drive Chrome inside the Android emulator over its DevTools socket.
// node cdp.mjs nav <url> | eval '<js expr>' | tap '<js expr giving [x,y] in page CSS px>'
import { execFileSync } from 'node:child_process';

const ADB = 'C:/Users/ASUS/AppData/Local/Android/Sdk/platform-tools/adb.exe';
const [mode, arg] = process.argv.slice(2);
execFileSync(ADB, ['forward', 'tcp:9223', 'localabstract:chrome_devtools_remote']);
const list = await (await fetch('http://127.0.0.1:9223/json/list')).json();
const page = list.find((p) => p.type === 'page' && /localhost:4187/.test(p.url)) || list.find((p) => p.type === 'page');
if (!page) { console.log('NO PAGE', JSON.stringify(list.map((p) => [p.type, p.url]))); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const wait = new Map();
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; wait.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
await new Promise((r) => ws.addEventListener('open', r));
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const w = m.id && wait.get(m.id); if (w) { wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); } });
const js = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
try {
  if (mode === 'nav') { await send('Page.navigate', { url: arg }); console.log('navigated', arg); }
  if (mode === 'eval') console.log(JSON.stringify(await js(arg)));
  if (mode === 'tap') {
    const p = await js(arg);
    if (!p) console.log('NOT FOUND');
    else {
      await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p[0], y: p[1] }] });
      await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      console.log('tapped at', p.map(Math.round));
    }
  }
} catch (e) { console.log('ERROR', e.message); } finally { ws.close(); }
