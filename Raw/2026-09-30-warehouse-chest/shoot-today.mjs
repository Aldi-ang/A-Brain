// TODAY frames + measurements for the next two quarantine-chest jobs (2026-09-30):
// the regional warehouse desk's Stock tab (?shell&gudang) and Stock Opname's quarantine area (?shell&opname&admin).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:4190/tools/ponder-lab.html';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9340',
  '--user-data-dir=' + path.join(HERE, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9340/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) console.log('JS ERROR', JSON.stringify(r.result.exceptionDetails).slice(0, 300)); return r.result?.result?.value; };
const shoot = async (name, clip) => {
  const shot = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}), captureBeyondViewport: true });
  const file = path.join(OUT, name + '.png');
  if (fs.existsSync(file)) fs.unlinkSync(file);
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  return path.basename(file);
};
const clickText = (sel, re) => js(`(() => { const b = [...document.querySelectorAll(${JSON.stringify(sel)})].find(e => ${re}.test(e.textContent.trim())); if (!b) return 'NOT FOUND'; b.click(); return b.textContent.trim().slice(0, 40); })()`);
const rect = (sel) => `(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)]; })()`;

await send('Page.enable');
const out = [];
for (const [w, h] of [[1440, 900], [430, 932]]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });

  /* the regional warehouse: the Stock tab */
  await send('Page.navigate', { url: BASE + '?shell&gudang' });
  await sleep(3500);
  out.push([w, 'gudang tab', await clickText('section.mb-6 button', '/^Stock/')]);
  await sleep(700);
  const m = await js(`JSON.stringify({ iw: innerWidth, desk: ${rect('section.mb-6')}, cards: [...document.querySelectorAll('section.mb-6 .grid > div')].map(c => { const r = c.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), c.textContent.trim().slice(0, 40)]; }), nav: ${rect('section.mb-6 > *:first-child')} })`);
  out.push([w, 'gudang measure', m]);
  const d = JSON.parse(m).desk;
  out.push([w, 'gudang shot', d ? await shoot(`${w}-gudang-stock-today`, { x: Math.max(0, d[0] - 8), y: Math.max(0, d[1] - 8), width: Math.min(w, d[2] + 16), height: d[3] + 16 }) : 'NO DESK']);

  /* Stock Opname, the boss: the quarantine area */
  await send('Page.navigate', { url: BASE + '?shell&opname&admin' });
  await sleep(3500);
  out.push([w, 'opname tabs', await js(`[...document.querySelectorAll('button')].map(b => b.textContent.trim()).filter(t => t && t.length < 30).slice(0, 30).join(' | ')`)]);
  out.push([w, 'opname tab', await clickText('button', '/quarantine/i')]);
  await sleep(900);
  out.push([w, 'opname measure', await js(`JSON.stringify({ iw: innerWidth, h: document.documentElement.scrollHeight, text: document.body.innerText.slice(0, 900) })`)]);
  out.push([w, 'opname shot', await shoot(`${w}-opname-quarantine-today`, { x: 0, y: 0, width: w, height: Math.min(2400, await js('document.documentElement.scrollHeight')) })]);
}
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
