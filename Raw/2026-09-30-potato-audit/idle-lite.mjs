/* FrameFilters with a Mythic frame on the page: running normally, frozen in Lite Mode, running again when Lite Mode
   goes off, frozen under prefers-reduced-motion. Real component on the ponder-lab vite server (:4190). */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const prof = path.join(HERE, 'lite-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9392',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9392/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300) : r.result?.result?.value; };

await send('Page.enable');
await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html' });
await sleep(4000);
const paused = () => js('window.__svg.animationsPaused()');
await js(`(async () => {
  const src = await (await fetch('/src/config/rankBorders.jsx')).text();
  const reactUrl = src.match(/from "(\\/node_modules\\/\\.vite\\/deps\\/react\\.js\\?v=[^"]+)"/)[1];
  const v = reactUrl.split('?v=')[1];
  const RM = await import(reactUrl); const R = RM.default || RM;
  const RDM = await import('/node_modules/.vite/deps/react-dom_client.js?v=' + v); const RD = RDM.createRoot ? RDM : RDM.default;
  const { FrameFilters } = await import('/src/config/rankBorders.jsx');
  document.documentElement.classList.remove('lite-mode');
  const f = document.createElement('div'); f.className = 'sframe s-mythic'; document.body.appendChild(f);
  const box = document.createElement('div'); document.body.appendChild(box);
  RD.createRoot(box).render(R.createElement(FrameFilters));
  await new Promise(r => setTimeout(r, 200));
  window.__svg = box.querySelector('svg');
  return 1;
})()`);
const out = { mythicShown: await paused() };
await js(`document.documentElement.classList.add('lite-mode'), 1`); await sleep(150);
out.liteModeOn = await paused();
await js(`document.documentElement.classList.remove('lite-mode'), 1`); await sleep(150);
out.liteModeOff = await paused();
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }); await sleep(300);
out.reducedMotion = await paused();
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] }); await sleep(300);
out.reducedMotionOff = await paused();
console.log(JSON.stringify({ animationsPaused: out }));
ws.close(); chrome.kill();
