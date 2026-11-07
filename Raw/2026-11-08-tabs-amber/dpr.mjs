// node dpr.mjs <tag> (head from tabs-looks.mjs)  (kpm-emulator + kpm-dev-http on 5174) -> the REAL Stock Opname tabs, today and two drawn looks for the chosen tab,
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


/* HIS SCREEN IS NOT 100%. Frames of the warehouse bar at 175 % (and 100 % beside it), each warehouse pressed, so the line can be checked against the hairlines by eye. */
const TAG = process.argv[2] || 'now';
await fetch(`http://127.0.0.1:8080/v1/projects/cello-inventory-manager/databases/(default)/documents/artifacts/cello-inventory-manager/users/${uid}/motorists/m_muntilan`, { method: 'PATCH', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
  body: JSON.stringify({ fields: { name: { stringValue: 'TEST MUNTILAN' }, location: { stringValue: 'MUNTILAN' }, userRole: { stringValue: 'TIER_5' } } }) });
await sleep(1200);
await ev(`(async () => { const { any, btn, sleep } = __h; any(/^Stok Opname|^Stock Opname/i)[0].click(); await sleep(1500); btn(/^HQ Audits/)[0]?.click(); await sleep(900); })()`);
console.error('opened');
const out = { uid, shots: [] };
for (const dpr of [1.75, 1]) {
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: dpr, mobile: false }); await sleep(700);
  for (const name of ['Gudang Pusat', 'Muntilan', 'Bandung']) {
    const box = await ev(`(async () => { const t = [...document.querySelectorAll('.kpm-wl-tab')].find((b) => b.textContent.includes(${JSON.stringify(name)})); t.click(); await __h.sleep(600); const bar = document.querySelector('.kpm-wl-tabs').getBoundingClientRect(); return { x: Math.round(bar.left), y: Math.round(bar.top) - 4, width: 600, height: Math.round(bar.height) + 10 }; })()`);
    const f = `dpr-${TAG}-${String(dpr).replace('.', '')}-${name.split(' ')[0].toLowerCase()}`;
    await clip(f, box);
    out.shots.push(f);
    console.error('shot', f);
  }
}
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#141210;color:#e8e4dc;font:600 14px Segoe UI,sans-serif;padding:12px}small{display:block;color:#a79f93;margin:8px 0 3px}img{display:block;border:1px solid #3a3530}</style>` +
  out.shots.map((f) => `<small>${f.replace('dpr-' + TAG + '-', '').replace('175', '175 % ').replace(/^1-/, '100 % ')}</small><img src="${f}.png" style="width:600px">`).join('');
writeFileSync(DIR + `dpr-${TAG}.html`, html);
await send('Emulation.setDeviceMetricsOverride', { width: 640, height: 900, deviceScaleFactor: 1.75, mobile: false }); await send('Page.navigate', { url: 'file:///' + (DIR + `dpr-${TAG}.html`).replace(/\\/g, '/') }); await sleep(900);
const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); rmSync(DIR + `dpr-${TAG}.png`, { force: true }); writeFileSync(DIR + `dpr-${TAG}.png`, Buffer.from(shot.result.data, 'base64'));
out.errors = errors;
console.log(JSON.stringify(out));
chrome.kill(); process.exit(0);
