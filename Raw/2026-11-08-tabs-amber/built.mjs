// node built.mjs (head from tabs-looks.mjs)  (kpm-emulator + kpm-dev-http on 5174) -> the REAL Stock Opname tabs, today and two drawn looks for the chosen tab,
// dark and light, PC and phone, with each look's tab positions measured against today's. Nothing in the app is changed: the looks are injected styles.
import { spawn, spawnSync } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const KPM = fileURLToPath(new URL('../../../kpm-inventory-main/', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 300000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text).slice(0, 200)); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push(String(r.result.exceptionDetails.exception?.description || 'eval').slice(0, 200)); return r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
const ORIGIN = 'http://localhost:5174';
const pc = async (w = 1280, h = 800) => { await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false }); await send('Emulation.setTouchEmulationEnabled', { enabled: false }); await send('Emulation.setEmulatedMedia', { features: [] }); };
const phone = async () => { await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }); await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }); await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] }); };
const HELP = `window.__h = (() => { const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const set = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); };
  const btn = (re) => [...document.querySelectorAll('button')].filter((b) => b.offsetParent && re.test((b.getAttribute('aria-label') || b.textContent).trim()));
  const any = (re) => [...document.querySelectorAll('button')].filter((b) => re.test((b.getAttribute('aria-label') || b.textContent).trim()));
  return { sleep, set, btn, any }; })();`;
const load = async () => { await send('Page.navigate', { url: ORIGIN + '/' }); await sleep(900);
  await ev(`(async () => { for (let i = 0; i < 80 && !window.__kpmEmulatorAuth; i++) await new Promise((r) => setTimeout(r, 150)); ${HELP} })()`); };
const ready = () => ev(`(async () => { const { sleep, set, btn, any } = __h; for (let i = 0; i < 60; i++) { const g = document.querySelector('input[placeholder="MASTER PASSWORD"]'); if (g) { set(g, 'Emulator-1!'); await sleep(200); btn(/Open the vault/i)[0].click(); for (let j = 0; j < 60 && document.querySelector('input[placeholder="MASTER PASSWORD"]'); j++) await sleep(300); await sleep(1500); break; } if (any(/^Stok Opname|^Stock Opname/i).length) break; await sleep(300); } await sleep(1200); return any(/^Stok Opname|^Stock Opname/i).length; })()`);
const clip = async (name, rect, scale = 1) => { const f = `${DIR}${name}.png`; rmSync(f, { force: true }); const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...rect, scale } }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return statSync(f).size; };

/* the fake company, fresh in the emulator: the seed's own directory row, a sign-in, then the company under that uid */
spawnSync('node', ['tools/seed-emulator.mjs'], { cwd: KPM });
await pc(); await load();
const uid = await ev(`(async () => { const { auth, credential, signIn } = window.__kpmEmulatorAuth; const r = await signIn(auth, credential(JSON.stringify({ sub: 'g-aldi-local', email: 'adikaryasukses99@gmail.com', email_verified: true }))); return r.user.uid; })()`);
spawnSync('node', ['tools/seed-emulator.mjs', '--uid', uid], { cwd: KPM });
await load(); await ready();
await ev(`(async () => { const { any, btn, sleep } = __h; any(/^Stok Opname|^Stock Opname/i)[0].click(); await sleep(1600);  })()`);


/* AS BUILT: his "2 all". Each of the four tab rows, read off the page: the chosen tab's surface, word and line, any amber left, and where the buttons sit. */
const ROW = {
  stock: `document.querySelector('.kpm-opname-tabs')`,
  quar: `[...document.querySelectorAll('button')].find((b) => /Active Quarantine/i.test(b.textContent))?.parentElement`,
  eod: `document.querySelector('[data-guide="eod-review"]')?.parentElement`,
  samp: `[...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'daily')?.parentElement`,
};
const read = (k) => ev(`(() => { const g = ${ROW[k]}; if (!g) return null; const r = g.getBoundingClientRect(); const on = g.querySelector('.kpm-tab-on'); const cs = on && getComputedStyle(on), af = on && getComputedStyle(on, '::after');
  return { box: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }, buttons: [...g.querySelectorAll('button')].map((b) => { const q = b.getBoundingClientRect(); return Math.round(q.left) + '/' + Math.round(q.top) + '/' + Math.round(q.width) + 'x' + Math.round(q.height); }).join(' '),
    on: on && on.textContent.trim().slice(0, 24), bg: cs && cs.backgroundColor, ink: cs && cs.color, line: af && (af.height + ' ' + af.backgroundColor), amberLeft: [...g.querySelectorAll('button')].filter((b) => b.className.includes('bg-[var(--gold)]')).length }; })()`);
const go = (re, extra = '') => ev(`(async () => { const { any, btn, sleep } = __h; any(${re})[0]?.click(); await sleep(1500); ${extra} })()`);
const theme = (light) => ev(`(async () => { document.documentElement.classList.toggle('light', ${light}); await __h.sleep(500); return true; })()`);
const shoot = async (name, k) => { const w = await read(k); if (w) await clip(name, { x: Math.max(0, w.box.x - 16), y: Math.max(0, w.box.y - 14), width: w.box.w + 32, height: w.box.h + 28 }); return w; };
const out = { uid, before: '761/145/102x40 865/145/115x40 982/145/120x40 1104/145/120x40' };
const visit = async (tag) => {
  const o = {};
  await go(`/^Stok Opname|^Stock Opname/i`, `btn(/^HQ Audits/)[0]?.click(); await sleep(700);`); o.stock = await shoot(`b-stock-${tag}`, 'stock');
  await go(`/^Stok Opname|^Stock Opname/i`, `btn(/^Quarantine/)[0]?.click(); await sleep(900);`); o.quar = await shoot(`b-quar-${tag}`, 'quar');
  await ev(`(async () => { __h.btn(/Liquidation History/i)[0]?.click(); await __h.sleep(500); })()`); o.quarHistory = await read('quar');
  await go(`/^Setoran Sore|^EOD/i`); o.eod = await shoot(`b-eod-${tag}`, 'eod');
  await go(`/^Sampel|^Sampling/i`, `btn(/View Analytics/i)[0]?.click(); await sleep(1500);`); o.samp = await shoot(`b-samp-${tag}`, 'samp');
  return o;
};
await pc(1280, 800);
out.dark = await visit('dark');
await theme(true); out.light = await visit('light'); await theme(false);
await phone(); await sleep(800); out.phone = await visit('phone');
await pc(1280, 800); await sleep(500);
out.stockSamePlace = (await (async () => { await go(`/^Stok Opname|^Stock Opname/i`, `btn(/^HQ Audits/)[0]?.click(); await sleep(700);`); return (await read('stock')).buttons; })()) === out.before;

const rows = [['stock', 'Stock Opname, HQ Audits chosen'], ['quar', 'Quarantine, Active Quarantine chosen'], ['eod', 'EOD Setoran'], ['samp', 'Sampel']];
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#141210;color:#e8e4dc;font:600 15px Segoe UI,sans-serif;padding:16px}h2{font-size:15px;margin:14px 0 6px}.r{display:flex;gap:14px;align-items:flex-start}.r div{display:flex;flex-direction:column;gap:4px}small{color:#a79f93;font-weight:500}img{display:block;border:1px solid #3a3530;max-width:520px}.ph{max-width:300px}</style><h2 style="margin-top:0">As built: a gold line under the chosen tab, no fill</h2>` +
  rows.map(([k, t]) => `<h2>${t}</h2><div class="r"><div><small>PC, dark</small><img src="b-${k}-dark.png"></div><div><small>PC, light</small><img src="b-${k}-light.png"></div><div><small>Phone</small><img class="ph" src="b-${k}-phone.png"></div></div>`).join('');
writeFileSync(DIR + 'built.html', html);
await pc(1400, 900); await send('Page.navigate', { url: 'file:///' + (DIR + 'built.html').replace(/\\/g, '/') }); await sleep(900);
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); rmSync(DIR + 'built.png', { force: true }); writeFileSync(DIR + 'built.png', Buffer.from(shot.result.data, 'base64'));
out.board = statSync(DIR + 'built.png').size;
out.errors = errors;
console.log(JSON.stringify(out, null, 1));
chrome.kill(); process.exit(0);
