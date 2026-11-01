// node shoot.mjs <file> <state> <width> <height> [extra query] [items]
//   state: today | arrive | open | tucked | flag (see inject.js); items: how many wares get one "+" first (default 0)
// Real lab terminal over CDP, GPS pinned on Toko Berkah Jaya so the terminal locks the shop itself, phone media emulated.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [, , name, state, w = '375', h = '812', extra = '', items = '0'] = process.argv;
const phone = +w < 1024;
const inject = readFileSync(DIR + 'inject.js', 'utf8');
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(`${DIR}prof-${name}`, { recursive: true, force: true });   /* a reused profile brings back the last run's cart */
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof-${name}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log(JSON.stringify({ name, error: 'watchdog: no frame in 60 s' })); chrome.kill(); process.exit(1); }, 60000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up yet */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Browser.grantPermissions', { origin: 'http://localhost:4190', permissions: ['geolocation'] });
await send('Emulation.setGeolocationOverride', { latitude: -6.9175, longitude: 107.6191, accuracy: 8 });   /* Toko Berkah Jaya, 0 m */
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 2, mobile: phone });
if (phone) {
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
}
await send('Page.navigate', { url: `http://localhost:4190/tools/ponder-lab.html?shell&terminal&many${extra}` }); await sleep(6000);
const pre = await ev(`({ vw: innerWidth, hover: matchMedia('(hover: hover)').matches, shop: document.querySelector('[aria-label="Choose customer"]')?.innerText.replace(/\\n/g, ' | '), wares: document.querySelectorAll('.product-card').length })`);
for (let i = 0; i < +items; i++) {   /* one "+" per ware, and only while that ware still reads 0 - a busy run must not add twice */
  await ev(`(() => { const c = [...document.querySelectorAll('.product-card')][${i}]; const b = c && [...c.querySelectorAll('button')].find((x) => x.innerText.trim() === '+');
    if (b && /(^|\\n)0(\\n|$)/.test(c.innerText)) b.click(); })()`);
  await sleep(900);
}
await sleep(800);
const m = await ev(`(${inject})(${JSON.stringify(state)})`);
await sleep(900);
const file = `${DIR}${name}.png`; rmSync(file, { force: true });
const r = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(file, Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ name, pre, m, errors: errors.slice(0, 3), bytes: statSync(file).size, mtime: statSync(file).mtime }));
ws.close(); chrome.kill();
