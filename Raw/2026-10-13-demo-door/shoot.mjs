/* shoots board-door.html + board-inside.html (next to this file) to PNGs; needs the lab served on 4187
   (launch.json "ponder-lab-built"). Deletes each png first, prints mtime after; writes measure.json with each
   frame's card box and scroll size so captions carry measured numbers, never planned ones. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(os.tmpdir(), 'kpm-demo-door-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9431', '--user-data-dir=' + prof, '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9431/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const ev = async (expression) => (await send('Runtime.evaluate', { returnByValue: true, expression })).result.result.value;
await send('Page.enable'); await send('Runtime.enable');
const only = process.argv[2];
/* same origin as the lab, or Chrome refuses the Rajdhani files (a file:// page is origin null): copy the pages into the lab's served folder */
const LAB = path.join(HERE, '../../../kpm-inventory-main/dist-ponderlab/demo-door'); fs.mkdirSync(LAB, { recursive: true });
for (const f of fs.readdirSync(HERE).filter((n) => n.endsWith('.html'))) fs.copyFileSync(path.join(HERE, f), path.join(LAB, f));
const measure = {};
for (const [file, width, wait] of [['board-door', 1580, 3500], ['board-inside', 1990, 14000]]) {
  if (only && only !== file) continue;
  const png = path.join(HERE, file + '.png'); fs.rmSync(png, { force: true });
  await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:4187/demo-door/' + file + '.html' }); await sleep(wait);
  measure[file] = await ev(`Object.fromEntries([...document.querySelectorAll('iframe')].map(f => { const d = f.contentDocument;
    const c = d.querySelector('.kpm-mod.gate, .sheet, .barA, .tapeB, .dockC'); const r = c && c.getBoundingClientRect();
    const inner = d.querySelector('iframe.app'); const shell = inner && inner.contentDocument ? inner.contentDocument.body.innerText.length : null;
    return [f.id, { frame: f.width + 'x' + f.height, doc: d.documentElement.scrollWidth + 'x' + d.documentElement.scrollHeight,
      box: r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] : null,
      font: d.fonts ? d.fonts.check('700 13px Rajdhani') : null, shellText: shell }]; }))`);
  const h = await ev('document.documentElement.scrollHeight');
  await send('Emulation.setDeviceMetricsOverride', { width, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(1500);
  const s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(png, Buffer.from(s.result.data, 'base64'));
  console.log(file + '.png', width + 'x' + h, fs.statSync(png).mtime.toISOString());
}
fs.writeFileSync(path.join(HERE, 'measure.json'), JSON.stringify(measure, null, 1));
console.log(JSON.stringify(measure));
chrome.kill(); await sleep(400); fs.rmSync(prof, { recursive: true, force: true }); process.exit(0);
