// node split.mjs (head from tabs-looks.mjs)  (kpm-emulator + kpm-dev-http on 5174) -> the REAL Stock Opname tabs, today and two drawn looks for the chosen tab,
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


/* AS BUILT: his "put some space or line to misah each of the regional warehouse". A third warehouse first (Muntilan, a fake agent), so the lines have neighbours. */
await fetch(`http://127.0.0.1:8080/v1/projects/cello-inventory-manager/databases/(default)/documents/artifacts/cello-inventory-manager/users/${uid}/motorists/m_muntilan`, { method: 'PATCH', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
  body: JSON.stringify({ fields: { name: { stringValue: 'TEST MUNTILAN' }, location: { stringValue: 'MUNTILAN' }, userRole: { stringValue: 'TIER_5' } } }) });
await sleep(1200);
const open = () => ev(`(async () => { const { any, btn, sleep } = __h; any(/^Stok Opname|^Stock Opname/i)[0].click(); await sleep(1500); btn(/^HQ Audits/)[0]?.click(); await sleep(900); [...document.querySelectorAll('.kpm-wl-tab')].find((b) => /Bandung/i.test(b.textContent))?.click(); await sleep(700); })()`);
const read = () => ev(`(() => { const tabs = [...document.querySelectorAll('.kpm-wl-tab')]; const top = document.querySelector('.kpm-opname-tabs').getBoundingClientRect(), bar = document.querySelector('.kpm-wl-tabs').getBoundingClientRect(), on = document.querySelector('.kpm-opname-tabs .kpm-tab-on');
  return { tabs: tabs.map((t) => { const r = t.getBoundingClientRect(), b = getComputedStyle(t, '::before'); return t.querySelector('b').textContent.trim() + ' x' + Math.round(r.left) + ' w' + Math.round(r.width) + ' line:' + (b.content !== 'none' ? b.width + ' ' + b.top + '-' + b.bottom + ' ' + b.backgroundColor : 'none'); }),
    clip: { x: 0, y: Math.round(top.top) - 16, width: innerWidth, height: Math.round(bar.bottom - top.top) + 32 }, topChosen: on && on.textContent.trim(), barScrolls: document.querySelector('.kpm-wl-tabs').scrollWidth > document.querySelector('.kpm-wl-tabs').clientWidth + 1 }; })()`);
const theme = (light) => ev(`(async () => { document.documentElement.classList.toggle('light', ${light}); await __h.sleep(500); return true; })()`);
const out = { uid };
await pc(1280, 800); await open();
out.dark = await read(); await clip('split-dark', out.dark.clip);
await theme(true); out.light = await read(); await clip('split-light', out.light.clip); await theme(false);
await phone(); await sleep(800); await open();
out.phone = await read(); await clip('split-phone', out.phone.clip);
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#141210;color:#e8e4dc;font:600 15px Segoe UI,sans-serif;padding:16px}.r{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap}.r div{display:flex;flex-direction:column;gap:4px}small{color:#a79f93;font-weight:500}img{display:block;border:1px solid #3a3530}</style><h3 style="margin:0 0 10px;font-size:15px">As built: a line between each warehouse, Bandung chosen</h3><div class="r"><div><small>PC, dark</small><img src="split-dark.png" style="width:820px"></div><div><small>PC, light</small><img src="split-light.png" style="width:820px"></div><div><small>Phone</small><img src="split-phone.png" style="width:390px"></div></div>`;
writeFileSync(DIR + 'split.html', html);
await pc(1700, 900); await send('Page.navigate', { url: 'file:///' + (DIR + 'split.html').replace(/\\/g, '/') }); await sleep(900);
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); rmSync(DIR + 'split.png', { force: true }); writeFileSync(DIR + 'split.png', Buffer.from(shot.result.data, 'base64'));
out.board = statSync(DIR + 'split.png').size;
out.errors = errors;
console.log(JSON.stringify(out, null, 1));
chrome.kill(); process.exit(0);
