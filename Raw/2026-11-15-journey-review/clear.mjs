// node clear.mjs - the phone's Chrome (CDP 9223): wipe localhost:5176's site data (a sign-in kept from an older auth emulator
// is refused by the demo server with 401) and reload
const page = (await (await fetch('http://127.0.0.1:9223/json/list')).json()).find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const w = m.id && wait.get(m.id); if (w) { wait.delete(m.id); w(m); } });
const send = (method, params = {}) => new Promise((res) => { const i = ++id; wait.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
console.log('clear', JSON.stringify(await send('Storage.clearDataForOrigin', { origin: 'http://localhost:5176', storageTypes: 'all' })).slice(0, 80));
await send('Page.reload', { ignoreCache: true });
ws.close();
console.log('reloaded');
