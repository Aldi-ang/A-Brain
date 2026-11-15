/* THE Q2 MARK on the lab dev server (5176), big demo company: Day Replay on the full map, a shop pressed -> is it marked?
   Drives the headless Chrome on CDP 9557 (signed in by walk5176.mjs --pc).   node q2.mjs <390|412> <prefix>
   Frames: <prefix>.png (the mark) and <prefix>-lite.png (html.lite-mode set by this script: glow + shadow stripped). */
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('.', import.meta.url));
const [wArg = '390', pre = 'q2'] = process.argv.slice(2);
const W = Number(wArg), H = W === 412 ? 915 : 844;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const list = await (await fetch('http://127.0.0.1:9557/json/list')).json();
const page = list.find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const w = m.id && wait.get(m.id); if (w) { wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); } });
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; wait.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
};
const shot = async (name) => {
    const f = `${DIR}${name}.png`; rmSync(f, { force: true });
    const r = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(f, Buffer.from(r.data, 'base64'));
    console.log('shot', name, statSync(f).mtime.toTimeString().slice(0, 8));
};
const click = (sel, re) => js(`(() => { const b = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => x.offsetParent && ${re ? `/${re}/i.test(x.innerText)` : 'true'}); b?.click(); return b ? (b.innerText || b.className).trim().slice(0, 40) : null; })()`);

try {
    await send('Page.enable'); await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 3, mobile: true });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
    await sleep(800);
    console.log('media', await js(`matchMedia('(hover: none)').matches + ' ' + innerWidth`));
    /* a second press on the pressed chip lets go of him (the Replay key goes): press only when the key is not there */
    if (!(await js(`!![...document.querySelectorAll('.kx-rp-go')].find((x) => x.offsetParent && /replay his day/i.test(x.innerText))`)))
        console.log('chip:', await click('.kx-pick button[aria-pressed="true"]'));
    await sleep(1200);
    console.log('replay:', await click('.kx-rp-go', 'replay his day')); await sleep(1500);
    console.log('pause:', await click('button[aria-label="Pause"]'));
    console.log('whole day:', await click('button', '^\\s*whole day\\s*$')); await sleep(800);
    console.log('full:', await click('.kx-mapkey.k-full')); await sleep(4000);
    const c = await js(`(() => { const rs = [...document.querySelectorAll('.kx-rp-mk')].map((m) => m.getBoundingClientRect()).filter((r) => r.width);
        return rs.length ? [rs.reduce((s, r) => s + r.left + r.width / 2, 0) / rs.length, rs.reduce((s, r) => s + r.top, 0) / rs.length].map(Math.round) : null; })()`);
    console.log('flags centre', c);
    if (c) for (let i = 0; i < 2; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: c[0], y: c[1], deltaX: 0, deltaY: -480 }); await sleep(1100); }
    await sleep(1200);
    const picked = await js(`(() => { const ms = [...document.querySelectorAll('.kx-rp-mk')];
        const seen = ms.filter((m) => { const r = m.getBoundingClientRect(); return r.width && r.top > 140 && r.bottom < innerHeight - 240 && r.left > 24 && r.right < innerWidth - 24 && !m.classList.contains('held'); });
        const low = process.argv.includes('--low');
        const m = low ? seen.sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0] : seen[Math.floor(seen.length / 2)];
        if (!m) return 'none in view of ' + ms.length; const r0 = Math.round(m.getBoundingClientRect().top); m.click();
        return m.getAttribute('title') + ' top ' + r0 + ' before the press (' + seen.length + ' of ' + ms.length + ' in view)'; })()`.replace('process.argv.includes(\'--low\')', String(process.argv.includes('--low'))));
    await sleep(2500);
    console.log('pressed:', picked, '| marked:', await js(`document.querySelectorAll('.kx-rp-mk.picked').length`),
        '| ring:', await js(`(() => { const m = document.querySelector('.kx-rp-mk.picked'); if (!m) return null; const s = getComputedStyle(m, '::after'); return s.borderTopWidth + ' ' + s.borderTopColor + ' z' + getComputedStyle(m).zIndex; })()`),
        '| card:', await js(`(document.querySelector('.kx-rp-card:not(.now)')?.innerText || 'none').replace(/\\s+/g, ' ').slice(0, 80)`));
    console.log('boxes:', await js(`JSON.stringify([['picked', document.querySelector('.kx-rp-mk.picked')], ['card', document.querySelector('.kx-rp-card:not(.now)')?.closest('.kx-rp') || document.querySelector('.kx-rp-card:not(.now)')], ['dock', document.querySelector('.kx-dock, .kx-mapdock')]]
        .map(([n, e]) => { const r = e?.getBoundingClientRect(); return n + ':' + (r ? [r.left, r.top, r.width, r.height].map(Math.round).join(',') : 'none'); }))`));
    await shot(pre);
    await js(`document.documentElement.classList.add('lite-mode'); true`); await sleep(600);
    console.log('lite ring:', await js(`(() => { const m = document.querySelector('.kx-rp-mk.picked'); if (!m) return null; const s = getComputedStyle(m, '::after'); return s.borderTopWidth + ' ' + s.borderTopColor + ' filter ' + getComputedStyle(m).filter; })()`));
    await shot(`${pre}-lite`);
    await js(`document.documentElement.classList.remove('lite-mode'); true`);
    console.log('stop:', await click('.kx-rp-go[aria-pressed="true"]')); await sleep(600);
    console.log('exit full:', await click('.kx-mapkey.k-full')); await sleep(800);
} catch (e) { console.log('ERROR', e.message); } finally { ws.close(); }
