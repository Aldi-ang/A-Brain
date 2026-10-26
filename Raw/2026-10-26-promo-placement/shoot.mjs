// node shoot.mjs <A|B|C> <width> <height>  -> <opt>-<width>.png + a measurement line. Real lab page, CDP, phone media emulated.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
const DIR = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [, , opt, w = '1440', h = '900'] = process.argv;
const phone = +w < 1024;
const proto = readFileSync(DIR + '../artifact-files/e2f1317e-f3d3-4e4a-8c0e-818c3398b03e/index.html', 'utf8')
  .replace("if (CHESTS[q.get('t')]) S.type = q.get('t');", "S.type = 'promo';")
  .replace("items: [['T-shirt L', 24, 'shirt'], ['Hat', 40, 'hat'], ['Poster', 120, 'poster'], ['Lighter', 300, 'lighter'], ['Sample · Cello Green 16', 50, 'sample', 'FREE']]",
    "items: [['T-shirt', 40, 'shirt'], ['Poster', 120, 'poster'], ['Hat', 2, 'hat'], ['Lighter', 300, 'lighter']]")   /* the lab vault's own four, so list and chest agree */
  .replace('</style>', '.bar,.hint{display:none!important} body{padding:12px 12px 16px!important} .stage{border:0!important}</style>');
const inject = readFileSync(DIR + 'inject.js', 'utf8');
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof-${opt}-${w}`, '--hide-scrollbars', '--enable-unsafe-swiftshader', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 1, mobile: phone });
if (phone) {
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
}
await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&vaultlist&tab=promo' }); await sleep(5000);
const pre = await ev(`({ vw: innerWidth, hover: matchMedia('(hover: hover)').matches, rows: document.querySelectorAll('[id^=mv-row-]').length })`);
if (!phone) { await ev(`document.getElementById('mv-row-p-tee')?.click()`); await sleep(2500); }
const m = await ev(`(${inject})(${JSON.stringify(opt)}, ${JSON.stringify(proto)})`);
await sleep(1200);
const file = `${DIR}${opt}-${w}.png`; rmSync(file, { force: true });
const r = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(file, Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ pre, m, errors }));
ws.close(); chrome.kill();
