// node emu-walk.mjs <ownerUid>   (kpm-emulator + kpm-dev-http on 5174, seeded by tools/seed-emulator.mjs + the scratch seed-t3.mjs)
// The REAL app on the local emulator, the real firestore.rules: a Tier 3 account (tono.t3@example.com) on Quarantine, its
// Sell Again box, then the owner's Sales Terminal showing the RUSAK lot after its pack. Nothing is written by this walk.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 240000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text).slice(0, 200));
  if (d.method === 'Runtime.consoleAPICalled' && /permission|denied/i.test(JSON.stringify(d.params.args))) errors.push('console: ' + JSON.stringify(d.params.args).slice(0, 200)); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push(String(r.result.exceptionDetails.exception?.description || 'eval').slice(0, 200)); return r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
const ORIGIN = 'http://localhost:5174';
const pc = async () => { await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false }); await send('Emulation.setTouchEmulationEnabled', { enabled: false }); await send('Emulation.setEmulatedMedia', { features: [] }); };
const phone = async () => { await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }); await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }); await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] }); };
const HELP = `window.__h = (() => { const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const set = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); };
  const any = (re) => [...document.querySelectorAll('button')].filter((b) => re.test((b.getAttribute('aria-label') || b.textContent).trim()));
  return { sleep, set, any }; })();`;
const load = async () => { await send('Page.navigate', { url: ORIGIN + '/' }); await sleep(1200);
  await ev(`(async () => { for (let i = 0; i < 80 && !window.__kpmEmulatorAuth; i++) await new Promise((r) => setTimeout(r, 150)); ${HELP} })()`); };
const signInAs = async (sub, email) => { await load();
  await ev(`(async () => { const { auth, credential, signIn } = window.__kpmEmulatorAuth; await auth.signOut(); await signIn(auth, credential(JSON.stringify({ sub: '${sub}', email: '${email}', email_verified: true }))); })()`);
  await load();
  return ev(`(async () => { const { sleep, set, any } = __h; for (let i = 0; i < 60; i++) { const g = document.querySelector('input[placeholder="MASTER PASSWORD"]'); if (g) { set(g, 'Emulator-1!'); await sleep(200); any(/Open the vault/i)[0].click(); for (let j = 0; j < 60 && document.querySelector('input[placeholder="MASTER PASSWORD"]'); j++) await sleep(300); await sleep(1500); break; } if (any(/^Stok Opname|^Stock Opname/i).length) break; await sleep(300); } await sleep(1200); return any(/^Stok Opname|^Stock Opname/i).length; })()`); };
const shot = async (name) => { const f = `${DIR}${name}.png`; rmSync(f, { force: true }); const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return statSync(f).size; };
const out = {};

/* Tier 3: Stock Opname > Quarantine > BANDUNG > SURYA 12 */
await pc();
out.t3In = await signInAs('g-tono-t3', 'tono.t3@example.com');
const openCrate = `(async () => { const { sleep, any } = __h; any(/^Stok Opname|^Stock Opname/i)[0].click(); await sleep(1800); any(/^Quarantine$/i)[0].click(); await sleep(1800);
  document.querySelector('button[aria-label^="Quarantine crate BANDUNG"]')?.click(); await sleep(900);
  document.querySelector('[role="button"][aria-label^="SURYA 12,"]').click(); await sleep(900);
  const sell = any(/^Sell Again$/i)[0]; sell.scrollIntoView({ block: 'center' }); await sleep(500);
  return { tabs: any(/^(Monitor|HQ Audits|Quarantine|New Count|Audit history)$/i).map((b) => b.textContent.trim()), subTabs: any(/Liquidation History|^Active$/i).length,
    actions: any(/^(Convert to Sample|Sell Again|RTV Factory|Penalty|Repair)/i).map((b) => b.textContent.trim()) }; })()`;
out.t3Pc = await ev(openCrate); out.t3PcShot = await shot('emu-t3-pc-crate');
out.t3Box = await ev(`(async () => { const { sleep, set, any } = __h; any(/^Sell Again$/i)[0].click(); await sleep(900); any(/^Cheaper$/i)[0].click(); await sleep(500); set(document.querySelector('input[name="price"]'), 17000); await sleep(400);
  return document.querySelector('form').innerText.replace(/\\n+/g, ' / ').slice(0, 400); })()`);
out.t3BoxShot = await shot('emu-t3-pc-box');
await ev(`(async () => { const c = __h.any(/^Cancel$/i)[0]; if (c) c.click(); await __h.sleep(600); })()`);
await phone(); await sleep(1200);
out.t3Phone = await ev(`(async () => { const s = __h.any(/^Sell Again$/i)[0]; s.scrollIntoView({ block: 'center' }); await __h.sleep(500); return { w: document.documentElement.scrollWidth, vw: innerWidth }; })()`);
out.t3PhoneShot = await shot('emu-t3-phone-box');

/* the owner's Sales Terminal (Master Vault mode, the default): the RUSAK lot right after its pack */
await pc();
out.ownerIn = await signInAs('g-aldi-local', 'adikaryasukses99@gmail.com');
out.terminal = await ev(`(async () => { const { sleep, any } = __h; any(/^Terminal Penjualan|^Sales Terminal/i)[0].click(); await sleep(2500);
  const names = [...document.querySelectorAll('*')].filter((e) => e.children.length === 0 && /^(SURYA 12|SURYA 16|GUDANG GARAM FI|SAMPOERNA MILD)( · RUSAK)?$/.test(e.textContent.trim())).map((e) => e.textContent.trim());
  const lot = [...document.querySelectorAll('*')].find((e) => e.children.length === 0 && e.textContent.trim() === 'GUDANG GARAM FI · RUSAK');
  lot?.scrollIntoView({ block: 'center' }); await sleep(600);
  const card = lot?.closest('button,[role="button"],div[class*="rounded"]');
  return { order: [...new Set(names)], card: card?.innerText.replace(/\\n+/g, ' / ').slice(0, 160) || null }; })()`);
out.terminalShot = await shot('emu-owner-terminal');
out.errors = errors;
console.log(JSON.stringify(out, null, 1));
chrome.kill(); process.exit(0);
