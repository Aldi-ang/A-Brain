// node shoot.mjs <name> <query> <width> <height> <en|id> [press]
//   query = the lab query (e.g. "shell&terminal&many"); press = click the first button whose text matches this, first.
// The REAL switch, not a mock: the storage value setLang('id') leaves is written before the app's first script runs.
// Prints the visible English still on the page (names and units included) so the next round knows what is left.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [, , name, query, w = '375', h = '812', lang = 'en', press = ''] = process.argv;
const phone = +w < 1024;
const left = readFileSync(DIR + '../2026-11-02-indonesian/inject.js', 'utf8');   /* its 'today' state = list what is left */
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(`${DIR}prof-${name}`, { recursive: true, force: true });
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
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
}
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', ${JSON.stringify(lang)}); } catch (e) {}` });
await send('Page.navigate', { url: `http://localhost:4190/tools/ponder-lab.html?${query}` }); await sleep(6000);
let pressed = null;
if (press) {
  pressed = await ev(`(() => { const b = [...document.querySelectorAll('button')].find((x) => new RegExp(${JSON.stringify(press)}, 'i').test(x.innerText)); if (b) b.click(); return b ? b.innerText.trim() : null; })()`);
  await sleep(1500);
}
const m = await ev(`(${left})('today')`);
const file = `${DIR}${name}.png`; rmSync(file, { force: true });
const r = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(file, Buffer.from(r.result.data, 'base64'));
const stored = await ev(`localStorage.getItem('kpm_lang')`);
console.log(JSON.stringify({ name, stored, pressed, left: m.left, errors: errors.slice(0, 3), bytes: statSync(file).size }));
ws.close(); chrome.kill();
