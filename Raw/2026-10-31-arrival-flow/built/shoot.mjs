// node shoot.mjs <file> <width> <height> [extra query] [steps]  -> <file>.png + one JSON line of measurements.
// The BUILT terminal (no drawing): lab ?shell&terminal&many, GPS pinned on Toko Berkah Jaya so the arrival sheet opens by
// itself, phone media emulated. steps (comma list, in order): order | add2 | tab | pull | stock | request | wait
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const [, , name, w = '375', h = '812', extra = '', steps = ''] = process.argv;
const phone = +w < 1024;
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(`${DIR}prof-${name}`, { recursive: true, force: true });   /* a reused profile brings back the last run's cart */
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof-${name}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log(JSON.stringify({ name, error: 'watchdog: no frame in 60 s' })); chrome.kill(); process.exit(1); }, 60000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Browser.grantPermissions', { origin: 'http://localhost:4190', permissions: ['geolocation'] });
await send('Emulation.setGeolocationOverride', { latitude: -6.9175, longitude: 107.6191, accuracy: 8 });
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 2, mobile: phone });
if (phone) {
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
}
await send('Page.navigate', { url: `http://localhost:4190/tools/ponder-lab.html?shell&terminal&many${extra}` }); await sleep(6000);
const pre = await ev(`({ hover: matchMedia('(hover: hover)').matches, sheet: !!document.querySelector('[data-guide=arrival]') })`);
const press = (re) => ev(`(() => { const b = [...document.querySelectorAll('button')].find((x) => ${re}.test(x.innerText)); if (b) b.click(); return !!b; })()`);
const done = [];
for (const s of steps.split(',').filter(Boolean)) {
  if (s === 'order') done.push(s + ':' + await press('/take order/i'));
  if (s === 'stock') done.push(s + ':' + await press('/stock full/i'));
  if (s === 'request') { done.push(s + ':' + await press('/new request/i')); await sleep(400); await send('Input.insertText', { text: 'Minta 2 slop Sampoerna Mild, Kamis' }); }
  if (s === 'add2') for (let i = 0; i < 2; i++) {
    done.push('add' + i + ':' + await ev(`(() => { const c = [...document.querySelectorAll('.product-card')][${i}]; const b = c && [...c.querySelectorAll('button')].find((x) => x.innerText.trim() === '+');
      if (b && /(^|\\n)0(\\n|$)/.test(c.innerText)) { b.click(); return true; } return false; })()`));
    await sleep(700);
  }
  if (s === 'tab') done.push(s + ':' + await ev(`(() => { const b = document.querySelector('button[aria-label^="Manifest,"]'); if (b) b.click(); return !!b; })()`));
  if (s === 'pull') {   /* a slow real pull: 40 small steps over ~320 ms, held still before the lift (lessons: one big move is a fling) */
    const r = await ev(`(() => { const b = document.querySelector('button[aria-label^="Manifest,"]').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    const t = (type, x) => send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y: r.y }] });
    await t('touchStart', r.x);
    for (let k = 1; k <= 40; k++) { await t('touchMove', r.x + k * 6); await sleep(8); }
    await sleep(120); await t('touchEnd', r.x + 240);
    done.push('pull');
  }
  if (s === 'wait') await sleep(2600);
  await sleep(700);
}
await sleep(500);
const m = await ev(`(() => {
  const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
  const panel = [...document.querySelectorAll('div')].find((d) => /w-\\[min\\(86vw,340px\\)\\]/.test(d.className));
  const order = [...document.querySelectorAll('button')].find((x) => /take order/i.test(x.innerText));
  const tab = document.querySelector('button[aria-label^="Manifest,"]');
  return { vw: innerWidth, fonts: document.fonts.check('700 13px Rajdhani'), overflowX: document.documentElement.scrollWidth > innerWidth,
    sheet: box(document.querySelector('[data-guide=arrival]')), sheetFont: (() => { const e = document.querySelector('[data-guide=arrival] button'); return e ? getComputedStyle(e).fontFamily.slice(0, 30) : null; })(),
    order: order ? { box: box(order), bg: getComputedStyle(order).backgroundColor, ink: getComputedStyle(order).color, edge: getComputedStyle(order).borderTopColor, minH: getComputedStyle(order).minHeight, hh: getComputedStyle(order).height, mt: getComputedStyle(order).marginTop } : null,
    panel: box(panel), tab: box(tab), tabLabel: tab?.getAttribute('aria-label'), expanded: tab?.getAttribute('aria-expanded'),
    flag: box(document.querySelector('.kpm-flag')), flagText: document.querySelector('.kpm-flag')?.innerText.replace(/\\n/g, ' | '),
    wares: box(document.querySelector('[data-guide=products]')), toasts: (document.body.innerText.match(/Visit (NOT )?saved[^\\n]*/g) || []) };
})()`);
const file = `${DIR}${name}.png`; rmSync(file, { force: true });
const r = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(file, Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ name, pre, done, m, errors: errors.slice(0, 3), mtime: statSync(file).mtime }));
ws.close(); chrome.kill();
