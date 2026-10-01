/* The gate's unlock on a phone whose screen changes size mid-sequence (Android keyboard closing after Enter).
   Needs the ponder-lab vite server on :4190. Writes gate-<case>.png next to this file. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const prof = path.join(HERE, 'gate-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9362',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9362/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400)); return r.result?.result?.value; };
const screen = (w, h) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 3, mobile: true });

await send('Page.enable'); await send('Runtime.enable'); ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.method === 'Runtime.exceptionThrown' || (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error')) console.log('PAGE', d.params.exceptionDetails?.exception?.description || JSON.stringify(d.params).slice(0, 300)); });
await screen(360, 740);
await send('Page.navigate', { url: 'http://localhost:4190/' });
await sleep(2500);
await js(`(async () => {
  const src = await (await fetch('/src/components/VaultGate.jsx')).text();
  const reactUrl = src.match(/from "(\\/node_modules\\/\\.vite\\/deps\\/react\\.js\\?v=[^"]+)"/)[1];
  const v = reactUrl.split('?v=')[1];
  const RM = await import(reactUrl); const RDM = await import('/node_modules/.vite/deps/react-dom_client.js?v=' + v);
  window.__R = RM.default || RM; window.__RD = RDM.createRoot ? RDM : RDM.default;
  const st = document.createElement('style'); st.textContent = '.absolute{position:absolute}.inset-0{inset:0}.w-full{width:100%}.h-full{height:100%}.overflow-hidden{overflow:hidden}.hidden{display:none}.flex{display:flex}'; document.head.appendChild(st);
  window.__VG = (await import('/src/components/VaultGate.jsx')).default;
  window.__count = () => { const cv = window.__box.querySelector('canvas'); const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; let hi = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 200) hi++; return hi; };
  return 1;
})()`);

const out = {};
for (const [name, startH, resizeAt] of [['still', 740, null], ['keyboard', 400, 150], ['late', 400, 3000]]) {
  await screen(360, startH);
  await js(`(async () => {
    const box = window.__box = document.createElement('div');
    box.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#000';
    document.body.appendChild(box);
    const R = window.__R; window.__root = window.__RD.createRoot(box);
    window.__root.render(R.createElement(window.__VG, { playing: false, agentName: 'Aldi' }));
    await new Promise(r => setTimeout(r, 300));
    window.__root.render(R.createElement(window.__VG, { playing: true, agentName: 'Aldi' }));
    return 1;
  })()`);
  if (resizeAt != null) { await sleep(resizeAt); await screen(360, 740); }
  await sleep(4700 - (resizeAt || 0));
  console.log(await js('JSON.stringify({ inBody: document.body.contains(window.__box), html: window.__box.innerHTML.slice(0, 200), err: window.__err })')); const hi = await js('window.__count()');
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(HERE, 'gate-' + name + '.png'), Buffer.from(shot.result.data, 'base64'));
  out[name] = hi;
  await js('(() => { window.__root.unmount(); window.__box.remove(); return 1; })()');
}
console.log(JSON.stringify(out));
ws.close(); chrome.kill();
