/* TEST ONLY: wipe the demo origin's storage in the phone's Chrome (IndexedDB = Firestore's cache + the sign-in, local
   storage = the mission line) and reload - a first-time visitor, for the small-vs-big timing. node clear.mjs */
import { execFileSync } from 'node:child_process';

execFileSync('C:/Users/ASUS/AppData/Local/Android/Sdk/platform-tools/adb.exe', ['forward', 'tcp:9223', 'localabstract:chrome_devtools_remote']);
const list = await (await fetch('http://127.0.0.1:9223/json/list')).json();
const page = list.find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.navigate', { url: 'about:blank' });
await new Promise((r) => setTimeout(r, 800));
const c = await send('Storage.clearDataForOrigin', { origin: 'http://localhost:5176', storageTypes: 'indexeddb,local_storage,cache_storage,service_workers' });
await send('Page.navigate', { url: 'http://localhost:5176/' });
console.log('cleared', c.error ? JSON.stringify(c.error) : 'ok');
process.exit(0);
