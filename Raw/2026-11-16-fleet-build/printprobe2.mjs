/* under print media: the boxes around the Surat Jalan paper (wrapper, inner column, paper) and what is hit at the table */
const list = await (await fetch('http://127.0.0.1:9557/json/list')).json();
const page = list.find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const w = m.id && wait.get(m.id); if (w) { wait.delete(m.id); w(m.result); } });
const send = (method, params = {}) => new Promise((res) => { const i = ++id; wait.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });
await send('Emulation.setEmulatedMedia', { media: 'print' });
await new Promise((r) => setTimeout(r, 500));
const expr = `(() => { const sj = document.querySelector('.kpm-sj'), w = sj.closest('.print-modal-wrapper'), col = sj.parentElement;
  const d = (el) => { const cs = getComputedStyle(el), b = el.getBoundingClientRect(); return [el.className.slice(0, 40), cs.position, cs.overflow, cs.height, cs.maxHeight, Math.round(b.top), Math.round(b.height), cs.opacity, cs.transform.slice(0, 20), cs.contain].join(' | '); };
  const hit = document.elementFromPoint(300, 300); const tableTop = sj.querySelector('table').getBoundingClientRect().top;
  return { wrap: d(w), col: d(col), paper: d(sj), atTable: (hit?.className || hit?.tagName || '').toString().slice(0, 60), tableTop: Math.round(tableTop), html: d(document.documentElement), body: d(document.body), root: d(document.getElementById('root')) }; })()`;
const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
console.log(JSON.stringify(r.result.value, null, 1));
await send('Emulation.setEmulatedMedia', { media: '' });
ws.close(); setTimeout(() => process.exit(0), 50);
