// node shoot.mjs <width> <height>   -> q-<w>-actions / -convert-master / -repair / -convert-region .png
// His 2026-11-02 "A and B, when damaged good enter the master vault they should have option to repair or convert it as
// sampling": the real Stock Opname (lab ?shell&opname&admin, the boss), Quarantine tab - the Master Vault crate's four
// actions, its Convert window (pick a regional warehouse), its Repair window, and a regional crate's Convert window.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const [, , w = '1440', h = '900'] = process.argv;
const phone = +w < 1024;
const prof = `${DIR}prof-${w}`; rmSync(prof, { recursive: true, force: true });
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log(JSON.stringify({ w, error: 'watchdog: 60 s' })); chrome.kill(); process.exit(1); }, 60000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up yet */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 2, mobile: phone });
if (phone) {
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
}
await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&opname&admin' }); await sleep(6000);
const shot = async (name) => { const file = `${DIR}q-${w}-${name}.png`; rmSync(file, { force: true });
  const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(file, Buffer.from(r.result.data, 'base64')); return statSync(file).size; };
const click = (sel, re) => ev(`(() => { const b = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => ${re}.test(x.getAttribute('aria-label') || x.innerText)); if (b) b.click(); return !!b; })()`);
const out = { w, media: await ev(`matchMedia('(hover: none)').matches`), errors };
out.tab = await click('button', /^\s*quarantine\s*$/i); await sleep(1500);
out.crateM = await click('button[aria-label^="Quarantine crate"]', /Master Vault/); await sleep(900);
out.pickM = await click('[role="button"][aria-label$="Bks damaged"]', /Djarum/); await sleep(700);
out.actions = await ev(`(() => { const b = [...document.querySelectorAll('button')].find((x) => /^repair$/i.test(x.innerText.trim())); if (b) b.scrollIntoView({ block: 'center' }); return [...document.querySelectorAll('button')].filter((x) => /convert to sample|rtv factory|penalty charge|^repair$/i.test(x.innerText.trim())).map((x) => x.innerText.trim()); })()`);
await sleep(400); out.s1 = await shot('actions');
await click('button', /convert to sample/i); await sleep(700);
await ev(`(() => { const s = document.querySelector('select[name="toWarehouse"]'); if (s) s.value = 'SEMARANG'; })()`);
out.s2 = await shot('convert-master');
await ev(`document.querySelector('form')?.closest('.rounded-2xl')?.querySelector('button')?.click()`); await sleep(500);
await click('button', /^repair$/i); await sleep(700); out.s3 = await shot('repair');
await ev(`document.querySelector('form')?.closest('.rounded-2xl')?.querySelector('button')?.click()`); await sleep(500);
out.crateB = await click('button[aria-label^="Quarantine crate"]', /BANDUNG/); await sleep(1200);
out.pickB = await click('[role="button"][aria-label$="Bks damaged"]', /Cello/); await sleep(700);
out.repairOnB = await ev(`[...document.querySelectorAll('button')].some((x) => /^repair$/i.test(x.innerText.trim()))`);
await click('button', /convert to sample/i); await sleep(700); out.s4 = await shot('convert-region');
console.log(JSON.stringify(out));
ws.close(); chrome.kill();
