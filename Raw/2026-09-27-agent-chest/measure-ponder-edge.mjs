// His 2026-09-27 screenshot: a white line standing on the right while the tutorial (ponder) book shuts. Measures the
// paper block's fore-edge strip against the spine through a REAL close (the Close key), sampling every 80 ms, and shoots
// the frame where the strip is furthest from the spine. PASS = the strip travels to the spine with the pages.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'test-shots');
const tag = process.argv[2] || 'run';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const PROFILE = path.join(path.dirname(OUT), 'profile-edge');
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9346',
  '--user-data-dir=' + PROFILE, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9346/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?book' }); await sleep(3500);
const sample = `(() => { const f = document.querySelector('[data-fold]'); if (!f) return null; const st = f.closest('[style*="preserve-3d"]');
  const edge = [...document.querySelectorAll('[data-fold], [data-fold] span')].map(e => e.getBoundingClientRect()).filter(r => r.width > 0 && r.width < 20 && r.height > 100)[0];
  const spine = f.parentElement.getBoundingClientRect().left; return edge ? Math.round(edge.left - spine) : 'none'; })()`;
const open = await js(sample);
await js(`document.querySelector('[aria-label="Close"]').click(), 1`);
const seen = [];
let worst = -1, worstAt = 0;
for (let t = 0; t < 14; t++) {
  await sleep(80);
  const d = await js(sample);
  seen.push(d);
  if (typeof d === 'number' && d > worst) { worst = d; worstAt = t; }
  if (t === 5) { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, `ponder-close-${tag}.png`), Buffer.from(s.result.data, 'base64')); }
}
console.log(JSON.stringify({ tag, openDistance: open, duringClose: seen }));
ws.close(); chrome.kill();
await sleep(1200); try { fs.rmSync(PROFILE, { recursive: true, force: true }); } catch { /* still held */ }
