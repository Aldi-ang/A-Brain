/* Agent Profile opens on YOUR profile, and yours is first in the directory - the real component on the ponder-lab
   vite server (:4190, Firestore stubbed), 1440 wide so the directory is open. Three people: the owner (T1, no roster
   profile), a T2 manager (Rina, m4), a T5 salesman (Budi, m2). Then a press on another name must still move it. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const prof = path.join(HERE, 'profile-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9393',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9393/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300) : r.result?.result?.value; };

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html' });
await sleep(4000);
const out = await js(`(async () => {
  const src = await (await fetch('/src/config/rankBorders.jsx')).text();
  const reactUrl = src.match(/from "(\\/node_modules\\/\\.vite\\/deps\\/react\\.js\\?v=[^"]+)"/)[1];
  const v = reactUrl.split('?v=')[1];
  const RM = await import(reactUrl); const R = RM.default || RM;
  const RDM = await import('/node_modules/.vite/deps/react-dom_client.js?v=' + v); const RD = RDM.createRoot ? RDM : RDM.default;
  const { default: AgentProfileView } = await import('/src/AgentProfileView.jsx');
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const roster = [
    { id: 'm1', name: 'Adi Nugroho', location: 'BANDUNG', userRole: 'FLEET_CAPTAIN' },
    { id: 'm2', name: 'Budi Santoso', location: 'MUNTILAN', userRole: 'FIELD_OPERATIVE' },
    { id: 'm3', name: 'Cahyo Putra', location: 'SEMARANG', userRole: 'ROOKIE' },
    { id: 'm4', name: 'Rina Wijaya', location: 'SEMARANG', userRole: 'COMPANY_OWNER' },
  ];
  const read = box => {
    const btns = [...box.querySelectorAll('.w-72 .space-y-2 > button')];
    const name = b => (b.querySelector('p') || b).textContent.trim().slice(0, 24);
    const sel = btns.find(b => b.querySelector('div.absolute.bg-gold'));
    return { first: btns[0] ? name(btns[0]) : null, selected: sel ? name(sel) : null, count: btns.length };
  };
  const res = {};
  for (const [who, role, own] of [['T1 owner', 'ADMIN', null], ['T2 Rina', 'COMPANY_OWNER', 'm4'], ['T5 Budi', 'FIELD_OPERATIVE', 'm2']]) {
    const box = document.createElement('div'); box.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000'; document.body.appendChild(box);
    const root = RD.createRoot(box);
    root.render(R.createElement(AgentProfileView, { motorists: roster, inventory: [], transactions: [], userRole: role, agentProfileId: own,
      db: {}, appId: 'lab', userId: 'lab-boss', storage: {}, appSettings: { useCareerLedger: true }, career: {}, logAudit: () => {}, customers: [] }));
    await wait(1500);
    const opened = { ...read(box), pageShows: (box.innerText.match(/Budi Santoso|Rina Wijaya|Master Owner|Adi Nugroho|Cahyo Putra/i) || [null])[0] };
    const other = [...box.querySelectorAll('.w-72 .space-y-2 > button')].find(b => /Cahyo/.test(b.textContent));
    if (other) other.click();
    await wait(400);
    res[who] = { opened, afterPressingCahyo: read(box).selected };
    root.unmount(); box.remove();
  }
  return JSON.stringify(res);
})()`);
console.log(out);
ws.close(); chrome.kill();
