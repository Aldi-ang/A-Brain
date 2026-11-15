/* JOURNEY PLAN ON THE BIG DEMO COMPANY - TEST ONLY, never a fix (2026-11-15).
   The phone = the Android emulator's Chrome over adb (CDP 9223):  node jp.mjs <cmd> [arg] [--out=prefix]
     state              size, media, safe area, guide, map marks, visible controls, errors
     tap <css|x,y|text=re>  one real finger tap on the centre (prints what is under the finger first)
     shot <name>        the viewport as <name>.jpg in this folder (the old file is deleted first)
     journey            open the menu, tap Journey Plan, time the map until its shops stop changing
     type <text> | key <Enter> | eval <file.js>
   --pc=<port>: the same commands on a desktop Chrome already running with --remote-debugging-port. */
import { readFileSync, writeFileSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('.', import.meta.url));
const ADB = 'C:/Users/ASUS/AppData/Local/Android/Sdk/platform-tools/adb.exe';
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const PCP = (process.argv.find((a) => a.startsWith('--pc=')) || '').slice(5);
const PORT = PCP ? Number(PCP) : 9223;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (!PCP) execFileSync(ADB, ['forward', 'tcp:9223', 'localabstract:chrome_devtools_remote']);
const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const page = list.find((p) => p.type === 'page' && /localhost:(5176|4195)[/]/.test(p.url));
if (!page) { console.log('NO DEMO PAGE', JSON.stringify(list.map((p) => p.url))); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map(); const errors = new Set();
ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && wait.has(m.id)) { const w = wait.get(m.id); wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); return; }
    if (m.method === 'Runtime.exceptionThrown') errors.add('throw: ' + String(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).split('\n')[0].slice(0, 200));
    if (m.method === 'Runtime.consoleAPICalled') {
        const s = m.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
        if (m.params.type === 'error' || /permission|denied|insufficient|INTERNAL ASSERTION/i.test(s)) errors.add(m.params.type + ': ' + s.split('\n')[0].slice(0, 200));
    }
});
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; wait.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const run = async (fn, ...a) => {
    const r = await send('Runtime.evaluate', { expression: `(${fn})(...${JSON.stringify(a)})`, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) return { error: (r.exceptionDetails.exception?.description || r.exceptionDetails.text || '').slice(0, 300) };
    return r.result.value;
};
await send('Runtime.enable');

/* the page keeps its own list of errors across runs of this script (until a reload) */
await run(() => {
    if (window.__jpErr) return;
    window.__jpErr = [];
    const push = (k, a) => {
        const s = [...a].map((x) => (x && x.message) ? x.message : String(x)).join(' ').slice(0, 220);
        if (k === 'error' || /permission|denied|insufficient|INTERNAL ASSERTION/i.test(s)) window.__jpErr.push(k + ': ' + s);
    };
    for (const k of ['error', 'warn']) { const o = console[k]; console[k] = (...a) => { push(k, a); o.apply(console, a); }; }
    addEventListener('error', (e) => push('error', [e.message]));
    addEventListener('unhandledrejection', (e) => push('error', [e.reason]));
});

function state() {
    const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0.05 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
    const box = (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
    const p = document.createElement('div');
    p.style.cssText = 'position:fixed;top:0;left:0;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);visibility:hidden';
    document.body.appendChild(p); const cs = getComputedStyle(p); const safe = [cs.paddingTop, cs.paddingBottom]; p.remove();
    const ctrls = [...document.querySelectorAll('button, select, input, [role="slider"], [data-mark]')].filter(vis)
        .map((e) => ({ t: (e.getAttribute('aria-label') || e.innerText || e.value || e.placeholder || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 30), tag: e.tagName.toLowerCase(), b: box(e) }));
    const marks = [...document.querySelectorAll('.kx-map .leaflet-marker-icon')];
    const mission = document.querySelector('.kpm-mission');
    return {
        w: innerWidth, h: innerHeight, dpr: devicePixelRatio, hoverNone: matchMedia('(hover: none)').matches, coarse: matchMedia('(pointer: coarse)').matches, safe,
        journey: !!document.querySelector('.kx-map'), full: !!document.querySelector('.kx-map.fixed'), replay: !!document.querySelector('[aria-label="Day Replay"]'),
        marks: { kx: marks.filter((m) => m.classList.contains('kx-mk')).length, all: marks.length }, tiles: document.querySelectorAll('.kx-map .leaflet-tile-loaded').length,
        guide: mission ? mission.innerText.replace(/\s+/g, ' ').slice(0, 110) : null,
        errs: window.__jpErr, ctrls,
    };
}

const touch = async (x, y) => {
    const pt = [{ x, y, radiusX: 4, radiusY: 4, force: 1, id: 1 }];
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt });
    await sleep(70);
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
};
/* find the target: "x,y", "text=<regex>" (a visible control whose label/text matches) or a css selector */
const aim = (q) => run(async (q) => {
    const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
    let el = null;
    if (/^\d+,\d+$/.test(q)) { const [x, y] = q.split(',').map(Number); el = document.elementFromPoint(x, y); if (!el) return null; return { x, y, under: (el.closest('button,select,input,a')?.getAttribute('aria-label') || el.closest('button,select,input,a')?.innerText || el.tagName).trim().slice(0, 40) }; }
    /* on screen first; else a laid-out one below/above the fold, scrolled to the middle the way a thumb would */
    const sized = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const all = q.startsWith('text=')
        ? (() => { const re = new RegExp(q.slice(5), 'i'); return [...document.querySelectorAll('button, select, input, a, [role="button"], [data-mark]')].filter((e) => re.test((e.getAttribute('aria-label') || '') + ' ' + (e.innerText || ''))); })()
        : [...document.querySelectorAll(q)];
    el = all.find(vis) || all.find(sized);
    if (!el) return null;
    if (!vis(el)) { el.scrollIntoView({ block: 'center', behavior: 'instant' }); await new Promise((r) => setTimeout(r, 400)); }
    const r = el.getBoundingClientRect(); const x = Math.round(r.x + r.width / 2), y = Math.round(r.y + r.height / 2);
    const top = document.elementFromPoint(x, y);
    return { x, y, el: (el.getAttribute('aria-label') || el.innerText || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40), hitsIt: !!top && (top === el || el.contains(top)), under: top ? (top.closest('button,select,input,a')?.getAttribute('aria-label') || top.className?.toString().slice(0, 50) || top.tagName) : null };
}, q);

const shot = async (name) => {
    const m = await send('Page.getLayoutMetrics'); const v = m.cssVisualViewport;
    const dpr = await run(() => devicePixelRatio);
    const file = `${DIR}${name}.jpg`;
    rmSync(file, { force: true });
    /* 2 image px per CSS px, whatever the screen's own density */
    const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 72, clip: { x: v.pageX, y: v.pageY, width: v.clientWidth, height: v.clientHeight, scale: 2 / dpr } });
    writeFileSync(file, Buffer.from(s.data, 'base64'));
    return `${name}.jpg ${statSync(file).size} bytes ${statSync(file).mtime.toISOString().slice(11, 19)}Z (${v.clientWidth}x${v.clientHeight} css)`;
};

const [cmd, arg] = args;
const brief = (s) => ({ journey: s.journey, full: s.full, replay: s.replay, marks: s.marks, tiles: s.tiles, errs: s.errs, ctrls: s.ctrls.map((c) => `${c.t}@${c.b[0]},${c.b[1]},${c.b[2]}x${c.b[3]}`).join(' | ') });
if (cmd === 'state') console.log(JSON.stringify(await run(state)));
else if (cmd === 'tap') {
    const a = await aim(arg);
    if (!a) { console.log('NOT FOUND', arg); }
    else { console.log('tap', JSON.stringify(a)); await touch(a.x, a.y); await sleep(1500); console.log(JSON.stringify(brief(await run(state)))); }
} else if (cmd === 'shot') console.log(await shot(arg));
else if (cmd === 'type') { await send('Input.insertText', { text: arg }); await sleep(800); console.log(JSON.stringify(brief(await run(state)))); }
else if (cmd === 'key') {
    for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: arg, code: arg, windowsVirtualKeyCode: arg === 'Enter' ? 13 : 0, ...(type === 'keyDown' && arg === 'Enter' ? { text: '\r' } : {}) });
    await sleep(1500); console.log(JSON.stringify(brief(await run(state))));
} else if (cmd === 'eval') {
    const r = await send('Runtime.evaluate', { expression: `(async () => { ${readFileSync(arg, 'utf8')} })()`, awaitPromise: true, returnByValue: true });
    console.log(r.exceptionDetails ? 'EXCEPTION ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text) : JSON.stringify(r.result.value));
} else if (cmd === 'journey') {
    /* the clock starts in the page the moment before the finger lands on the menu's Journey Plan key */
    let jm = await aim('[data-mark="journey"]');
    if (!jm) {
        const menu = await aim('text=^\\s*(menu|open menu|open navigation|buka menu)\\s*$');
        if (!menu) { console.log('NO MENU KEY', JSON.stringify(brief(await run(state)))); process.exit(1); }
        console.log('menu', JSON.stringify(menu)); await touch(menu.x, menu.y); await sleep(900);
        jm = await aim('[data-mark="journey"]');
        if (!jm) { console.log('NO JOURNEY KEY', JSON.stringify(brief(await run(state)))); process.exit(1); }
    }
    await run(() => {
        const T = window.__jpT = { t0: performance.now(), map: null, firstMark: null, settled: null, counts: [], meta: [] };
        let last = -1, lastChange = 0, lastMeta = '';
        const iv = setInterval(() => {
            const now = performance.now(), ms = Math.round(now - T.t0);
            if (!T.map && document.querySelector('.kx-map .leaflet-container')) T.map = ms;
            const n = document.querySelectorAll('.kx-map .leaflet-marker-icon.kx-mk').length;
            if (n > 0 && T.firstMark === null) T.firstMark = ms;
            if (n !== last) { last = n; lastChange = now; T.counts.push([ms, n]); }
            const meta = (document.querySelector('.kx-meta3')?.innerText || '').replace(/\s+/g, ' ');
            if (meta !== lastMeta) { lastMeta = meta; T.meta.push([ms, meta]); }
            if (T.firstMark !== null && T.settled === null && now - lastChange > 3000) T.settled = Math.round(lastChange - T.t0);
            if (T.settled !== null || ms > 120000) clearInterval(iv);
        }, 50);
    });
    console.log('journey key', JSON.stringify(jm)); await touch(jm.x, jm.y);
    for (let i = 0; i < 250; i++) { await sleep(500); const T = await run(() => window.__jpT); if (T.settled !== null || i === 249) { console.log(JSON.stringify(T)); break; } }
    console.log(JSON.stringify(brief(await run(state))));
} else console.log('commands: state | tap | shot | journey | type | key | eval');
if (errors.size) console.log('cdp errors:', JSON.stringify([...errors]));
ws.close();
process.exit(0);
