/* TEST ONLY: let the capybara finish talking on the phone (a reload replays his intro), choosing "explore alone" over
   "guide me" when he asks, and close the guide bubble - so Journey Plan can be pressed. node hush.mjs */
import { execFileSync } from 'node:child_process';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
execFileSync('C:/Users/ASUS/AppData/Local/Android/Sdk/platform-tools/adb.exe', ['forward', 'tcp:9223', 'localabstract:chrome_devtools_remote']);
const page = (await (await fetch('http://127.0.0.1:9223/json/list')).json()).find((p) => p.type === 'page' && /localhost:(5176|4195)[/]/.test(p.url));
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m.result); wait.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const run = async (fn) => (await send('Runtime.evaluate', { expression: `(${fn})()`, returnByValue: true }))?.result?.value;
const tap = async ([x, y]) => { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, radiusX: 4, radiusY: 4, force: 1, id: 1 }] }); await sleep(70); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
for (let k = 0; k < 12; k++) {
    const st = await run(() => {
        const vis = (e) => e && e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none';
        const mid = (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]; };
        const ct = document.querySelector('.kpm-ct');
        if (ct && vis(ct)) {
            const ch = [...ct.querySelectorAll('.choices button')].filter(vis).map((b) => ({ t: b.innerText.trim(), at: mid(b) }));
            return { talk: (ct.querySelector('p')?.innerText || '').slice(0, 70), ch, box: mid(ct.querySelector('.box') || ct) };
        }
        const close = document.querySelector('[aria-label="Tutup petunjuk"]');
        return { talk: null, close: vis(close) ? mid(close) : null };
    });
    if (!st.talk) { if (st.close) { await tap(st.close); console.log('guide bubble closed'); } console.log('quiet'); break; }
    if (st.ch.length) {
        const pick = st.ch.find((c) => /sendiri|nanti|lewati|skip|tutup|lihat/i.test(c.t)) || st.ch[st.ch.length - 1];
        console.log(`choices: ${st.ch.map((c) => c.t).join(' | ')} -> ${pick.t}`); await tap(pick.at); await sleep(1500); continue;
    }
    console.log('says:', st.talk); await tap(st.box); await sleep(900);
}
process.exit(0);
