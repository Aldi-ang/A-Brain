/* TEST ONLY: a first-time visitor on the phone for <origin> - open it if no tab has it, wipe EVERYTHING the origin keeps
   (IndexedDB = Firestore cache + sign-in, local storage, caches, the service worker an older build installed), load it again.
   node fresh.mjs http://localhost:4195 */
import { execFileSync } from 'node:child_process';

const ORIGIN = process.argv[2] || 'http://localhost:4195';
const ADB = 'C:/Users/ASUS/AppData/Local/Android/Sdk/platform-tools/adb.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
execFileSync(ADB, ['forward', 'tcp:9223', 'localabstract:chrome_devtools_remote']);
const find = async () => (await (await fetch('http://127.0.0.1:9223/json/list')).json()).filter((p) => p.type === 'page' && p.url.startsWith(ORIGIN));
let tabs = await find();
if (!tabs.length) { execFileSync(ADB, ['shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', ORIGIN + '/', 'com.android.chrome']); for (let i = 0; i < 30 && !tabs.length; i++) { await sleep(500); tabs = await find(); } }
for (const p of tabs.slice(1)) await fetch(`http://127.0.0.1:9223/json/close/${p.id}`);
const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.navigate', { url: 'about:blank' });
await sleep(800);
const c = await send('Storage.clearDataForOrigin', { origin: ORIGIN, storageTypes: 'all' });
await send('Page.navigate', { url: ORIGIN + '/' });
await sleep(4000);
const r = await send('Runtime.evaluate', { expression: '({ sw: !!navigator.serviceWorker?.controller, hook: !!window.__kpmEmulatorAuth, text: document.body.innerText.replace(/\\s+/g, " ").slice(0, 90) })', returnByValue: true });
console.log('cleared', c.error ? JSON.stringify(c.error) : 'ok', JSON.stringify(r.result?.result?.value));
process.exit(0);
