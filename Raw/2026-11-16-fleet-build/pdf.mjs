/* print the lab page (CDP 9557, the 5176 tab) to A4 PDF the way window.print() would - proof of what the Surat Jalan
   puts on paper. Writes sj-print.pdf next to this file. */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const list = await (await fetch('http://127.0.0.1:9557/json/list')).json();
const page = list.find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
if (!page) { console.log('NO PAGE'); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const w = m.id && wait.get(m.id); if (w) { wait.delete(m.id); w(m); } });
const send = (method, params = {}) => new Promise((res) => { const i = ++id; wait.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const out = await send('Page.printToPDF', { paperWidth: 8.27, paperHeight: 11.69, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, printBackground: false, preferCSSPageSize: true });
if (out.error) { console.log('ERR', out.error.message); process.exit(1); }
const buf = Buffer.from(out.result.data, 'base64'); writeFileSync(DIR + 'sj-print.pdf', buf);
console.log('pdf bytes', buf.length, 'pages~', (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length);
ws.close(); setTimeout(() => process.exit(0), 50);
