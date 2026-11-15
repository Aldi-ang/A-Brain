/* JOURNEY PLAN AS AN IPHONE 13 HOME-SCREEN APP - A SIMULATION (2026-11-15), TEST ONLY.
   There is no iPhone on Windows. A headless desktop Chrome poses as one: 390x844 CSS px, DPR 3, touch, hover none /
   pointer coarse, an iPhone Safari user agent, and the notch as CDP Emulation.setSafeAreaInsetsOverride (top 47, bottom 34)
   - what env(safe-area-inset-*) reads on a real iPhone 13 when the app is opened from the home screen (index.html has
   viewport-fit=cover + black-translucent). Every override ends when this session closes, so it all runs in ONE process.
   Needs: the lab build on localhost:4195 (launch.json demo-build) talking to the Firebase emulator, and an invite for
   walker.pc@gmail.com. node notch.mjs  ->  n390-*.jpg + notch.json */
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('.', import.meta.url));
const PROF = 'C:/Users/ASUS/AppData/Local/Temp/claude/1ea24fab4b2c1cb2/500542c4-b391-4a3b-9567-7671bb454590/scratchpad/prof-notch';
const PORT = 9559, URL0 = 'http://localhost:4195/', GUEST = 'walker.pc@gmail.com';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROF}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list = [];
for (let i = 0; i < 40 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(); const errors = new Set();
ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pend.has(d.id)) { pend.get(d.id)(d.result || { error: d.error }); pend.delete(d.id); return; }
    if (d.method === 'Runtime.exceptionThrown') errors.add('throw: ' + String(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text).split('\n')[0].slice(0, 160));
    if (d.method === 'Runtime.consoleAPICalled') { const s = d.params.args.map((a) => a.value ?? a.description ?? '').join(' '); if (d.params.type === 'error' || /permission|denied|INTERNAL ASSERTION/i.test(s)) errors.add(d.params.type + ': ' + s.split('\n')[0].slice(0, 160)); }
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const run = async (fn, ...a) => { const r = await send('Runtime.evaluate', { expression: `(${fn})(...${JSON.stringify(a)})`, awaitPromise: true, returnByValue: true }); return r.exceptionDetails ? { error: r.exceptionDetails.text } : r.result?.value; };
const touch = async (x, y) => { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, radiusX: 4, radiusY: 4, force: 1, id: 1 }] }); await sleep(70); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
const out = { steps: [], errors: [] };
const log = (k, v) => { out.steps.push({ k, v }); console.log(k, typeof v === 'string' ? v : JSON.stringify(v).slice(0, 300)); };

await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' });
const safe = await send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 47, bottom: 34 } });
if (safe.error) { console.log('NO SAFE-AREA OVERRIDE IN THIS CHROME:', JSON.stringify(safe.error)); chrome.kill(); process.exit(1); }
await send('Page.navigate', { url: URL0 }); await sleep(5000);

/* the phone is real enough before any number is read */
const env = await run(() => { const p = document.createElement('div'); p.style.cssText = 'position:fixed;top:0;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)'; document.body.appendChild(p); const s = getComputedStyle(p); const v = [s.paddingTop, s.paddingBottom]; p.remove(); return { w: innerWidth, h: innerHeight, hoverNone: matchMedia('(hover: none)').matches, coarse: matchMedia('(pointer: coarse)').matches, safe: v, hook: !!window.__kpmEmulatorAuth }; });
log('phone', env);
if (!env.hoverNone || env.safe[0] !== '47px' || !env.hook) { console.log('NOT A PHONE WITH A NOTCH (or no lab build) - stop'); chrome.kill(); process.exit(1); }

const box = (sel, re) => run((sel, re) => {
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
    let els = [...document.querySelectorAll(sel)].filter(vis);
    if (re) { const x = new RegExp(re, 'i'); els = els.filter((e) => x.test((e.getAttribute('aria-label') || '') + ' ' + e.innerText)); }
    const e = els[0]; if (!e) return null;
    let r = e.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) { e.scrollIntoView({ block: 'center', behavior: 'instant' }); r = e.getBoundingClientRect(); }
    return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)];
}, sel, re || null);
const press = async (sel, re, wait = 1500) => { const c = await box(sel, re); if (!c) { log('NOT FOUND', `${sel} ${re || ''}`); return false; } await touch(c[0], c[1]); await sleep(wait); return true; };
const shot = async (name) => {
    const f = `${DIR}${name}.jpg`; rmSync(f, { force: true });
    const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 72, clip: { x: 0, y: 0, width: 390, height: 844, scale: 2 / 3 } });
    writeFileSync(f, Buffer.from(s.data, 'base64')); log('shot', `${name}.jpg ${statSync(f).size} bytes`);
};

/* sign in (the emulator's unsigned Google token), pick T2, let the capybara finish ("I'll try myself") */
await run((email) => { const { auth, credential, signIn } = window.__kpmEmulatorAuth; return signIn(auth, credential(JSON.stringify({ sub: 'g-' + email, email, email_verified: true }))).then(() => { setTimeout(() => location.reload(), 150); return 'ok'; }); }, GUEST);
await sleep(8000);
for (let k = 0; k < 20; k++) {
    const st = await run(() => {
        const vis = (e) => e && e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none';
        const mid = (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]; };
        const ct = document.querySelector('.kpm-ct');
        if (ct && vis(ct)) { const ch = [...ct.querySelectorAll('.choices button')].filter(vis); const own = ch.find((b) => /sendiri/i.test(b.innerText)); return { p: 'talk', at: own ? mid(own) : ch.length ? mid(ch[ch.length - 1]) : mid(ct.querySelector('.box') || ct) }; }
        const t2 = [...document.querySelectorAll('button')].find((b) => vis(b) && !b.disabled && /^T2\b/.test(b.innerText.trim()));
        if (t2) return { p: 'door', at: mid(t2) };
        if (document.querySelector('[data-mark="journey"]')) return { p: 'app' };
        return { p: 'wait', text: document.body.innerText.replace(/\s+/g, ' ').slice(0, 100) };
    });
    if (st.p === 'app') { log('in the app', `after ${k} steps`); break; }
    if (st.p === 'wait') { await sleep(1500); continue; }
    await touch(st.at[0], st.at[1]); await sleep(st.p === 'door' ? 9000 : 1200);
}
await press('[aria-label="Tutup petunjuk"]', null, 800);

/* Journey Plan, its four looks */
await press('[aria-label="Open navigation"]', null, 900);
const t0 = Date.now(); await press('[data-mark="journey"]', null, 300);
let ms = null; for (let i = 0; i < 120; i++) { if (await run(() => document.querySelectorAll('.kx-map .leaflet-marker-icon.kx-mk').length)) { ms = Date.now() - t0; break; } await sleep(250); }
log('journey shops drawn (PC Chrome, not a phone speed)', ms);
await sleep(2500); await shot('n390-1-open');
await press('button', '^\\s*AW\\s', 2000);
await run(() => document.querySelector('.kx-map')?.scrollIntoView({ block: 'start', behavior: 'instant' })); await sleep(600);
await shot('n390-2-salesman');
await press('.kx-map button:has(svg.lucide-maximize)', null, 2500);
await shot('n390-3-fullmap');
const full = await run(() => {
    const R = (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
    const map = document.querySelector('.kx-map'), dock = document.querySelector('nav[aria-label="Map keys"]');
    const chip = [...map.querySelectorAll('button')].find((b) => /^\s*AP\s/.test(b.innerText));
    const z = document.elementFromPoint(195, 20);
    return { vh: innerHeight, map: R(map), dock: dock && R(dock), firstChip: chip && R(chip), atY20: z ? (z.closest('[class]')?.className?.toString().slice(0, 50) || z.tagName) : null };
});
log('full map', full);
await press('button', 'replay his day', 3000);
await shot('n390-4-replay');
out.errors = [...errors]; out.env = env; out.full = full; out.journeyMs = ms;
writeFileSync(`${DIR}notch.json`, JSON.stringify(out, null, 1));
console.log('errors:', JSON.stringify(out.errors));
ws.close(); chrome.kill(); process.exit(0);
