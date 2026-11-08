// node emu-terminal-low.mjs   (kpm-emulator + kpm-dev-http on 5174, emulator empty or not)
// His "yes" (2026-11-08): a RUSAK lot is never LOW and never the "Running low" pick on the Sales Terminal. The REAL app on the
// local emulator: seeds the fake company (tools/seed-emulator.mjs) + one lot `rsk-p_gudgar` at 1 Bks, signs in as the fake owner
// (Master Vault mode, the default) and reads the lot's card, a normal low pack's card (SAMPOERNA MILD, 8 Bks) and the panel.
import { spawn, spawnSync } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const KPM = fileURLToPath(new URL('../../../kpm-inventory-main/', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 180000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text).slice(0, 200)); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push(String(r.result.exceptionDetails.exception?.description || 'eval').slice(0, 200)); return r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
const HELP = `window.__h = (() => { const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const set = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); };
  const any = (re) => [...document.querySelectorAll('button')].filter((b) => re.test((b.getAttribute('aria-label') || b.textContent).trim()));
  return { sleep, set, any }; })();`;
const load = async () => { await send('Page.navigate', { url: 'http://localhost:5174/' }); await sleep(1200);
  await ev(`(async () => { for (let i = 0; i < 80 && !window.__kpmEmulatorAuth; i++) await new Promise((r) => setTimeout(r, 150)); ${HELP} })()`); };

spawnSync('node', ['tools/seed-emulator.mjs'], { cwd: KPM });
await load();
const uid = await ev(`(async () => { const { auth, credential, signIn } = window.__kpmEmulatorAuth; const r = await signIn(auth, credential(JSON.stringify({ sub: 'g-aldi-local', email: 'adikaryasukses99@gmail.com', email_verified: true }))); return r.user.uid; })()`);
spawnSync('node', ['tools/seed-emulator.mjs', '--uid', uid], { cwd: KPM });
/* the lot a Sell Again from the Master Vault makes (emulator admin token, meaningless to live Firebase) */
const s = (v) => ({ stringValue: v }), n = (v) => ({ integerValue: String(v) });
const lotRes = await fetch(`http://127.0.0.1:8080/v1/projects/cello-inventory-manager/databases/(default)/documents/artifacts/cello-inventory-manager/users/${uid}/products/rsk-p_gudgar`, {
  method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
  body: JSON.stringify({ fields: { name: s('GUDANG GARAM FI · RUSAK'), damagedFrom: s('p_gudgar'), category: s('SKM'), sticksPerPack: n(12), stock: n(1),
    priceRetail: n(30500), priceGrosir: n(29000), priceEcer: n(32000), priceDistributor: n(27000) } }) });
await load();
await ev(`(async () => { const { sleep, set, any } = __h; for (let i = 0; i < 60; i++) { const g = document.querySelector('input[placeholder="MASTER PASSWORD"]'); if (g) { set(g, 'Emulator-1!'); await sleep(200); any(/Open the vault/i)[0].click(); for (let j = 0; j < 60 && document.querySelector('input[placeholder="MASTER PASSWORD"]'); j++) await sleep(300); await sleep(1500); break; } if (any(/^Terminal Penjualan|^Sales Terminal/i).length) break; await sleep(300); } })()`);
const out = { uid, lotSeeded: lotRes.ok };
out.terminal = await ev(`(async () => { const { sleep, any } = __h; any(/^Terminal Penjualan|^Sales Terminal/i)[0].click(); await sleep(2500);
  const card = (name) => { const t = [...document.querySelectorAll('*')].find((e) => e.children.length === 0 && e.textContent.trim() === name); let c = t; for (let i = 0; i < 8 && c && !/HARGA|PRICE/i.test(c.innerText || ''); i++) c = c.parentElement; return c ? c.innerText.replace(/\\n+/g, ' / ').slice(0, 140) : null; };
  const lot = [...document.querySelectorAll('*')].find((e) => e.children.length === 0 && e.textContent.trim() === 'GUDANG GARAM FI · RUSAK'); lot?.scrollIntoView({ block: 'center' }); await sleep(600);
  const panel = [...document.querySelectorAll('div')].find((d) => /^(Stok menipis|Running low)$/i.test(d.textContent.trim()));
  return { lotCard: card('GUDANG GARAM FI · RUSAK'), sampoernaCard: card('SAMPOERNA MILD'), runningLow: panel ? panel.nextElementSibling?.textContent.trim() : null }; })()`);
const f = DIR + 'emu-terminal-no-low.png'; rmSync(f, { force: true });
const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); out.shot = statSync(f).size;
out.errors = errors;
console.log(JSON.stringify(out, null, 1));
chrome.kill(); process.exit(0);   // prof/ is removed at the next start: Chrome still holds it for a moment after kill
