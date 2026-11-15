/* FLEET & ROSTER REVIEW - frames + numbers from the lab dev server (5176), big demo company, 2026-11-15.
   Drives the headless desktop Chrome that ../2026-11-15-journey-review/walk5176.mjs --pc left on CDP 9557.
     node fs.mjs <phone|pc> <prefix> [--steps=N] [--eval=file.js] [--noopen]
   Opens Fleet & Roster by its menu key (data-mark="fleet"), prints one JSON line of numbers,
   then shoots the viewport and N more frames, each one screen further down the scroller.
   Old pngs are deleted before each capture; the mtime is printed after. */
import { writeFileSync, rmSync, statSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const [mode = 'phone', pre = 'x'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const opt = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').slice(k.length + 3);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const list = await (await fetch('http://127.0.0.1:9557/json/list')).json();
const page = list.find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
if (!page) { console.log('NO PAGE'); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map(); const errs = [];
ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data); const w = m.id && wait.get(m.id);
    if (w) { wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); }
    if (m.method === 'Runtime.exceptionThrown') errs.push(String(m.params.exceptionDetails.exception?.description || '').split('\n')[0].slice(0, 160));
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errs.push(m.params.args.map((a) => a.value || a.description || '').join(' ').slice(0, 160));
});
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; wait.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
};
const shot = async (name) => {
    const f = `${DIR}${name}.png`; rmSync(f, { force: true });
    const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(f, Buffer.from(r.data, 'base64'));
    console.log('shot', name, statSync(f).mtime.toTimeString().slice(0, 8));
};
/* the page's own code, read from files so no quoting survives a shell */
const OPEN = readFileSync(DIR + 'lib-open.js', 'utf8');
const MEASURE = readFileSync(DIR + 'lib-measure.js', 'utf8');
try {
    await send('Page.enable'); await send('Runtime.enable');
    const phone = mode !== 'pc';
    const [w, h] = phone ? [390, 844] : [1280, 800];
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: phone ? 3 : 1, mobile: phone });
    await send('Emulation.setTouchEmulationEnabled', { enabled: phone, maxTouchPoints: phone ? 5 : 1 });
    await send('Emulation.setEmulatedMedia', { features: phone
        ? [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }]
        : [{ name: 'hover', value: 'hover' }, { name: 'pointer', value: 'fine' }] });
    await sleep(800);
    if (!process.argv.includes('--noopen')) console.log('open:', await js(`(async () => { ${OPEN} })()`));
    if (opt('eval')) console.log('eval:', JSON.stringify(await js(`(async () => { ${readFileSync(DIR + opt('eval'), 'utf8')} })()`)));
    await sleep(1200);
    const meas = await js(`(async () => { ${MEASURE} })()`);
    if (!process.argv.includes('--quiet')) console.log(JSON.stringify(meas));
    if (opt('after')) console.log('after:', JSON.stringify(await js(`(async () => { ${readFileSync(DIR + opt('after'), 'utf8')} })()`)));
    const steps = Number(opt('steps') || 0);
    await shot(`${pre}-0`);
    for (let i = 1; i <= steps; i++) {
        const at = await js(`(() => { const s = window.__sc; const before = s.scrollTop; s.scrollTop += s.clientHeight - 80; return [before, s.scrollTop]; })()`);
        if (at[0] === at[1]) { console.log('end at', at[0]); break; }
        await sleep(700); await shot(`${pre}-${i}`);
    }
    console.log('errors:', JSON.stringify(errs));
} catch (e) { console.log('ERROR', e.message); } finally { ws.close(); }
