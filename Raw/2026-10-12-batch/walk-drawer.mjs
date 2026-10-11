/* the Stock by Warehouse table after the shared-grid fix, walked in headless Chrome (real frames): the drawer slides open
   and shut, lands on auto, every number column lines up. Lab: ponder-lab-built on :4187, ?minkirim. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const OUT = process.argv[2];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(OUT, 'profile-walk'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9402', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9402/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 160)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
const out = []; const ok = (name, pass, got) => out.push(`${pass ? 'PASS' : 'FAIL'} ${name} -> ${JSON.stringify(got)}`);
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
const H = `[...document.querySelectorAll('[data-ponder^="drawer:"]')].map(d => Math.round(d.parentElement.getBoundingClientRect().height) + '/' + d.parentElement.style.height)`;
const SPREAD = `(() => { const keys = ['shelf','transit','field','sold','permonth','daysleft','minimum'];
  const rows = [...document.querySelectorAll('[data-ponder="col:shelf"]')].map(c => c.parentElement).filter(r => { const b = r.getBoundingClientRect(); return b.height > 0 && b.bottom > 0; });
  const vis = rows.filter(r => { let e = r; while (e) { if (getComputedStyle(e).overflow === 'hidden' && e.getBoundingClientRect().height === 0) return false; e = e.parentElement; } return true; });
  return { rows: vis.length, spread: keys.map(k => { const xs = vis.map(r => r.querySelector('[data-ponder="col:' + k + '"]').getBoundingClientRect().right); return Math.round((Math.max(...xs) - Math.min(...xs)) * 10) / 10; }) }; })()`;
const click = (k) => js(`document.querySelector('[data-ponder="row:${k}"] button[aria-expanded]').click()`);
const samples = async () => { const s = []; for (let i = 0; i < 8; i++) { s.push(await js(H)); await sleep(50); } return s; };
for (const lite of [false, true]) {
  await send('Page.navigate', { url: `http://localhost:4187/tools/ponder-lab.html?minkirim${lite ? '&lite' : ''}` }); await sleep(2500);
  const tag = lite ? 'LITE ' : '';
  const load = await js(H); ok(`${tag}load: BANDUNG open (auto), the others shut at 0`, load[1].endsWith('/auto') && /^0\/0px$/.test(load[0]) && /^0\/0px$/.test(load[2]), load);
  const s0 = await js(SPREAD); ok(`${tag}load: every number column lines up on every visible row`, s0.rows >= 5 && s0.spread.every((v) => v === 0), s0);
  await click('master'); const open = await samples(); await sleep(400); const opened = await js(H);
  ok(`${tag}Master opens${lite ? ' at once' : ' over frames'} and lands on auto; BANDUNG shuts to 0`, /^1\d\d\/auto$/.test(opened[0]) && /^0\/0px$/.test(opened[1]) && (lite || new Set(open.map((x) => x[0])).size > 2), { open, opened });
  const s1 = await js(SPREAD); ok(`${tag}Master open: numbers still line up`, s1.spread.every((v) => v === 0), s1);
  await click('master'); const shut = await samples(); await sleep(400); const closed = await js(H);
  ok(`${tag}Master shuts${lite ? ' at once' : ' over frames'} to 0`, /^0\/0px$/.test(closed[0]) && (lite || new Set(shut.map((x) => x[0])).size > 2), { shut, closed });
  if (!lite) { await click('muntilan'); await sleep(700); const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, 'stock-table-1280.png'), Buffer.from(s.result.data, 'base64')); }
}
ok('no page errors', errs.length === 0, errs);
console.log(out.join('\n'));
ws.close(); chrome.kill();
