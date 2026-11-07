// node line.mjs (head from tabs-looks.mjs)  (kpm-emulator + kpm-dev-http on 5174) -> the REAL Stock Opname tabs, today and two drawn looks for the chosen tab,
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


/* AS BUILT: his "make sure the yellow line doesnt pass the vertical line border for all of those". Three warehouses; each one pressed in turn; the gold line's
   ends against the hairlines either side; then a tab's text grows the way a late font does, and the line must follow without a press. */
await fetch(`http://127.0.0.1:8080/v1/projects/cello-inventory-manager/databases/(default)/documents/artifacts/cello-inventory-manager/users/${uid}/motorists/m_muntilan`, { method: 'PATCH', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
  body: JSON.stringify({ fields: { name: { stringValue: 'TEST MUNTILAN' }, location: { stringValue: 'MUNTILAN' }, userRole: { stringValue: 'TIER_5' } } }) });
await sleep(1200);
const MEASURE = `(() => { const tabs = [...document.querySelectorAll('.kpm-wl-tab')], ind = document.querySelector('.kpm-wl-ind').getBoundingClientRect(), i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'), t = tabs[i].getBoundingClientRect();
  const leftWall = i > 0 ? t.left : null, rightWall = i < tabs.length - 1 ? tabs[i + 1].getBoundingClientRect().left : null;
  return { tab: tabs[i].querySelector('b').textContent.trim(), line: [Math.round(ind.left), Math.round(ind.right)], walls: [leftWall && Math.round(leftWall), rightWall && Math.round(rightWall)],
    inside: (leftWall === null || ind.left >= leftWall + 4) && (rightWall === null || ind.right <= rightWall - 4) }; })()`;
const out = { uid, presses: [] };
const run = async (tag) => {
  await ev(`(async () => { const { any, btn, sleep } = __h; any(/^Stok Opname|^Stock Opname/i)[0].click(); await sleep(1500); btn(/^HQ Audits/)[0]?.click(); await sleep(900); })()`);
  for (const name of ['Gudang Pusat', 'Muntilan', 'Bandung']) {
    await ev(`(async () => { [...document.querySelectorAll('.kpm-wl-tab')].find((b) => b.textContent.includes(${JSON.stringify(name)}))?.click(); await __h.sleep(500); })()`);
    out.presses.push({ tag, ...(await ev(MEASURE)) });
  }
  /* the late font: Muntilan chosen, its words grow, nobody presses anything */
  await ev(`(async () => { [...document.querySelectorAll('.kpm-wl-tab')].find((b) => b.textContent.includes('Muntilan')).click(); await __h.sleep(500); })()`);
  const before = await ev(MEASURE);
  await ev(`(async () => { document.querySelectorAll('.kpm-wl-tab b').forEach((b) => { b.style.fontSize = '19px'; }); await __h.sleep(500); })()`);
  out[`lateFont-${tag}`] = { before, after: await ev(MEASURE) };
  await ev(`(async () => { document.querySelectorAll('.kpm-wl-tab b').forEach((b) => { b.style.fontSize = ''; }); await __h.sleep(400); })()`);
};
await pc(1280, 800); await run('pc');
await ev(`(async () => { [...document.querySelectorAll('.kpm-wl-tab')].find((b) => b.textContent.includes('Gudang Pusat')).click(); await __h.sleep(500); })()`);
const bar = await ev(`(() => { const r = document.querySelector('.kpm-wl-tabs').getBoundingClientRect(); return { x: 0, y: Math.round(r.top) - 70, width: 760, height: Math.round(r.height) + 86 }; })()`);
await clip('line-pc', bar);
await phone(); await sleep(800); await run('phone');
out.allInside = out.presses.every((p) => p.inside) && out['lateFont-pc'].after.inside && out['lateFont-phone'].after.inside;
out.errors = errors;
console.log(JSON.stringify(out, null, 1));
chrome.kill(); process.exit(0);
