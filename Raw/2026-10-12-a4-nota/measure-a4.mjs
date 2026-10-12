/* the A4 nota's info block, measured: does a label wrap onto two lines, does the KEPADA YTH box stretch empty, does the
   value column overlap the box. Lab ?share (the real SaleReceipt), A4 picked. Args: out dir, then widths. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const OUT = process.argv[2], WIDTHS = (process.argv[3] || '960,1280').split(',').map(Number), TAG = process.argv[4] || 'now';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(OUT, 'profile-a4'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9409', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9409/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EVAL ERROR ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300) : r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
for (const W of WIDTHS) {
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: 800, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:4187/tools/ponder-lab.html?share' }); await sleep(1800);
  const m = await js(`(async () => {
    const r = [...document.querySelectorAll('input[type=radio]')][1]; r.click(); await new Promise(z => setTimeout(z, 400));
    const jail = document.querySelector('.a4-print-jail'); const J = jail.getBoundingClientRect();
    const tbl = jail.querySelector('table'); const T = tbl.getBoundingClientRect();
    const labels = [...tbl.querySelectorAll('tr > td:first-child')].map(td => { const s = getComputedStyle(td); const lh = parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.5; const inner = td.getBoundingClientRect().height - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom); return { label: td.innerText.trim(), lines: Math.round(inner / lh) }; });
    const box = [...jail.querySelectorAll('p')].find(p => /KEPADA YTH/.test(p.innerText)).parentElement; const B = box.getBoundingClientRect();
    const content = [...box.children].reduce((h, c) => h + c.getBoundingClientRect().height, 0);
    const h1 = getComputedStyle(jail.querySelector('h1')).fontSize, cust = getComputedStyle(box.children[1]).fontSize;
    return { sheetW: Math.round(J.width), wrapped: labels.filter(l => l.lines > 1).map(l => l.label), boxH: Math.round(B.height), boxContentH: Math.round(content), gapTableToBox: Math.round(B.left - T.right), h1, cust };
  })()`);
  const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, `a4-${TAG}-${W}.png`), Buffer.from(s.result.data, 'base64'));
  console.log(W, JSON.stringify(m));
}
ws.close(); chrome.kill();
