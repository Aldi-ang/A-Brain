/* under print media: where every part of the Surat Jalan paper sits and whether it is displayed - finds what print hides */
const list = await (await fetch('http://127.0.0.1:9557/json/list')).json();
const page = list.find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const w = m.id && wait.get(m.id); if (w) { wait.delete(m.id); w(m.result); } });
const send = (method, params = {}) => new Promise((res) => { const i = ++id; wait.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });
await send('Emulation.setEmulatedMedia', { media: 'print' });
await new Promise((r) => setTimeout(r, 500));
const expr = `(() => { const sj = document.querySelector('.kpm-sj'); if (!sj) return 'no paper';
  const one = (sel) => { const el = sj.querySelector(sel); if (!el) return sel + ': none'; const cs = getComputedStyle(el), b = el.getBoundingClientRect();
    return sel + ' ' + cs.display + ' ' + cs.visibility + ' ' + [Math.round(b.top), Math.round(b.height)].join('/'); };
  return ['.hd', '.meta', 'table', 'thead', 'tbody', 'tbody td', '.stmt', '.sign'].map(one).concat('paper ' + Math.round(sj.getBoundingClientRect().height)); })()`;
const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
console.log(JSON.stringify(r.result.value));
await send('Emulation.setEmulatedMedia', { media: '' });
ws.close(); setTimeout(() => process.exit(0), 50);
