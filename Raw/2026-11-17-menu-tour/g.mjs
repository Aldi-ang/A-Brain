/* MENU TOUR LAB (2026-11-17) - drives the headless desktop Chrome that ../2026-11-15-journey-review/walk5176.mjs --pc left
   on CDP 9557 (or --port=9223 for the phone one). Steps run in order:
     node g.mjs eval:<file.js> shot:<name> move:<x>,<y> click:<x>,<y> wait:<ms> size:<w>x<h>[m]
   eval files are function bodies ("return ..."); their value prints as one JSON line. Shots: <name>.jpg here, old one deleted. */
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const PORT = (process.argv.find((a) => a.startsWith('--port=')) || '--port=9557').slice(7);
const page = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
if (!page) { console.log('NO PAGE'); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const w = m.id && wait.get(m.id); if (w) { wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); } });
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; wait.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: 1 });
for (const step of process.argv.slice(2).filter((a) => !a.startsWith('--'))) {
    const at = step.indexOf(':'), cmd = at < 0 ? step : step.slice(0, at), arg = at < 0 ? '' : step.slice(at + 1);
    if (cmd === 'eval') {
        const r = await send('Runtime.evaluate', { expression: `(function(){${readFileSync(DIR + arg, 'utf8')}})()`, awaitPromise: true, returnByValue: true });
        console.log(arg, JSON.stringify(r.exceptionDetails ? r.exceptionDetails.exception?.description : r.result.value));
    } else if (cmd === 'shot') {
        const f = `${DIR}${arg}.jpg`; rmSync(f, { force: true });
        writeFileSync(f, Buffer.from((await send('Page.captureScreenshot', { format: 'jpeg', quality: 72 })).data, 'base64'));
        console.log('shot', arg);
    } else if (cmd === 'move' || cmd === 'click') {
        const [x, y] = arg.split(',').map(Number);
        await mouse('mouseMoved', x, y);
        if (cmd === 'click') { await mouse('mousePressed', x, y); await mouse('mouseReleased', x, y); }
    } else if (cmd === 'tapring') {
        /* a real finger on the ring's own centre (lessons 2026-11-14: a press found by selector proves nothing) */
        const c = (await send('Runtime.evaluate', { expression: `(() => { const r = document.querySelector('.kpm-mx-ring')?.getBoundingClientRect(); return r && [r.left + r.width / 2, r.top + r.height / 2]; })()`, returnByValue: true })).result.value;
        if (!c) { console.log('tapring: no ring'); continue; }
        const pt = [{ x: c[0], y: c[1] }];
        await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt });
        await sleep(60);
        await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        console.log('tapped ring at', c.map(Math.round).join(','));
    } else if (cmd === 'wait') await sleep(Number(arg));
    /* NOTE: a size override lives only as long as this run's socket - give size: in the same run as the shots */
    else if (cmd === 'size') {
        const [w, h] = arg.replace('m', '').split('x').map(Number);
        const m = arg.endsWith('m');
        await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: m });
        /* mobile:true alone keeps (hover: hover) - the phone's CSS branches would measure as the PC (lessons 2026-10-03) */
        await send('Emulation.setTouchEmulationEnabled', { enabled: m, maxTouchPoints: m ? 5 : 1 });
        await send('Emulation.setEmulatedMedia', { features: m ? [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] : [] });
    }
}
ws.close();
