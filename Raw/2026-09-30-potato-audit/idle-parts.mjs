/* The two idle costs, on the real components (ponder-lab vite on :4190):
   1. ShipmentPlanTable re-rendered with the SAME numbers: how many DOM nodes are thrown away and rebuilt.
   2. FrameFilters: are its SMIL animations paused with no Platinum/Mythic frame on the page, running with one. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const prof = path.join(HERE, 'idle-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9391',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9391/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300) : r.result?.result?.value; };

await send('Page.enable');
await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html' });
await sleep(4000);
const out = await js(`(async () => {
  const src = await (await fetch('/src/config/rankBorders.jsx')).text();
  const reactUrl = src.match(/from "(\\/node_modules\\/\\.vite\\/deps\\/react\\.js\\?v=[^"]+)"/)[1];
  const v = reactUrl.split('?v=')[1];
  const RM = await import(reactUrl); const R = RM.default || RM;
  const RDM = await import('/node_modules/.vite/deps/react-dom_client.js?v=' + v); const RD = RDM.createRoot ? RDM : RDM.default;
  const { flushSync } = await import('/node_modules/.vite/deps/react-dom.js?v=' + v).then(m => m.default || m);
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* 1. the table */
  const { default: ShipmentPlanTable } = await import('/src/ponder/stages/ShipmentPlanTable.jsx');
  const rows = () => [
    { id: 'p1', name: 'Cello Chocolate', hq: 900, byBranch: { BANDUNG: 500, MUNTILAN: 600 }, needed: 1100, short: 200 },
    { id: 'p2', name: 'Cello Mild', hq: 400, byBranch: { BANDUNG: 120, MUNTILAN: null }, needed: 120, short: 0 },
  ];
  const box = document.createElement('div'); document.body.appendChild(box);
  const root = RD.createRoot(box);
  flushSync(() => root.render(R.createElement(ShipmentPlanTable, { rows: rows(), branches: ['BANDUNG', 'MUNTILAN'] })));
  let added = 0, removed = 0;
  const mo = new MutationObserver(ms => ms.forEach(m => { added += m.addedNodes.length; removed += m.removedNodes.length; }));
  mo.observe(box, { childList: true, subtree: true });
  for (let i = 0; i < 3; i++) flushSync(() => root.render(R.createElement(ShipmentPlanTable, { rows: rows(), branches: ['BANDUNG', 'MUNTILAN'] })));
  await wait(50); mo.disconnect();
  const cells = box.querySelectorAll('span.text-right.font-mono').length;
  root.unmount(); box.remove();

  /* 2. the filters */
  const { FrameFilters } = await import('/src/config/rankBorders.jsx');
  const fbox = document.createElement('div'); document.body.appendChild(fbox);
  const froot = RD.createRoot(fbox);
  flushSync(() => froot.render(R.createElement(FrameFilters)));
  await wait(100);
  const svg = fbox.querySelector('svg');
  const noFrame = svg.animationsPaused();
  const f = document.createElement('div'); f.className = 'sframe s-mythic'; document.body.appendChild(f);
  await wait(100);
  const withMythic = svg.animationsPaused();
  f.remove(); await wait(100);
  const afterRemoved = svg.animationsPaused();
  froot.unmount(); fbox.remove();
  return JSON.stringify({ table: { cellsOnScreen: cells, nodesRebuiltIn3SameRenders: { added, removed } }, filters: { pausedWithNoFrame: noFrame, pausedWithMythic: withMythic, pausedAfterItLeaves: afterRemoved } });
})()`);
console.log(out);
ws.close(); chrome.kill();
