/* WHERE DOES THE JOURNEY PLAN WAIT GO? TEST ONLY (2026-11-15). On the phone's Chrome (CDP 9223 over adb):
   leave to the dashboard, start the CPU profiler, open Journey Plan from the menu, shoot a frame at +2 s,
   stop when the first shop mark is drawn, then print self time by function and by file.
   node prof.mjs [--pc=<port>] [--tag=name] */
import { writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('.', import.meta.url));
const PCP = (process.argv.find((a) => a.startsWith('--pc=')) || '').slice(5);
const TAG = (process.argv.find((a) => a.startsWith('--tag=')) || '--tag=p412').slice(6);
const PORT = PCP ? Number(PCP) : 9223;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (!PCP) execFileSync('C:/Users/ASUS/AppData/Local/Android/Sdk/platform-tools/adb.exe', ['forward', 'tcp:9223', 'localabstract:chrome_devtools_remote']);
const page = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((p) => p.type === 'page' && /localhost:(5176|4195)[/]/.test(p.url));
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { const w = wait.get(m.id); wait.delete(m.id); w(m.result || { error: m.error }); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const run = async (fn, ...a) => (await send('Runtime.evaluate', { expression: `(${fn})(...${JSON.stringify(a)})`, awaitPromise: true, returnByValue: true })).result?.value;
const centre = (sel) => run((sel) => { const e = [...document.querySelectorAll(sel)].find((x) => x.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)]; }, sel);
const tap = async (sel) => {
    const c = await centre(sel); if (!c) throw new Error('not on screen: ' + sel);
    if (PCP) { for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c[0], y: c[1], button: 'left', clickCount: 1 }); return; }
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: c[0], y: c[1], radiusX: 4, radiusY: 4, force: 1, id: 1 }] });
    await sleep(70); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
};
const marks = () => run(() => document.querySelectorAll('.kx-map .leaflet-marker-icon.kx-mk').length);

/* 1. away from Journey Plan */
if (await marks()) { await tap('[aria-label="Open navigation"]'); await sleep(900); await tap('[data-mark="dashboard"]'); await sleep(4000); }
/* 2. profile the open */
await send('Profiler.enable');
await send('Profiler.setSamplingInterval', { interval: 500 });
await tap('[aria-label="Open navigation"]'); await sleep(900);
await send('Profiler.start');
const t0 = Date.now();
await tap('[data-mark="journey"]');
await sleep(2000);
const shotFile = `${DIR}${TAG}-at2s.jpg`; rmSync(shotFile, { force: true });
const dpr = await run(() => devicePixelRatio); const v = (await send('Page.getLayoutMetrics')).cssVisualViewport;
const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70, clip: { x: v.pageX, y: v.pageY, width: v.clientWidth, height: v.clientHeight, scale: 2 / dpr } });
writeFileSync(shotFile, Buffer.from(s.data, 'base64'));
let ms = null;
for (let i = 0; i < 120; i++) { if (await marks()) { ms = Date.now() - t0; break; } await sleep(250); }
const { profile } = await send('Profiler.stop');
writeFileSync(`${DIR}${TAG}-open.cpuprofile`, JSON.stringify(profile));

/* 3. self time: samples x interval, by function and by file */
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const dt = profile.timeDeltas; const self = new Map();
profile.samples.forEach((sid, k) => self.set(sid, (self.get(sid) || 0) + (dt[k + 1] ?? dt[k] ?? 0)));
const fn = new Map(), file = new Map(); let total = 0;
for (const [sid, us] of self) {
    const cf = byId.get(sid).callFrame; total += us;
    const f = (cf.url || '').replace(/^.*localhost:5176\//, '').replace(/[?].*$/, '') || '(native)';
    const k = `${cf.functionName || '(anon)'} ${f}:${cf.lineNumber + 1}`;
    fn.set(k, (fn.get(k) || 0) + us); file.set(f, (file.get(f) || 0) + us);
}
const top = (m, n) => [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, us]) => `${Math.round(us / 1000)} ms  ${k}`);
console.log(JSON.stringify({ firstMarkMs: ms, profiledMs: Math.round(total / 1000), frame: `${TAG}-at2s.jpg` }));
console.log('--- by file\n' + top(file, 14).join('\n'));
console.log('--- by function (self)\n' + top(fn, 26).join('\n'));
ws.close(); process.exit(0);
