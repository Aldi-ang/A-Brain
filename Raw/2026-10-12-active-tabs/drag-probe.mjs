/* the phone sidebar's pull, on a slow phone: built lab ?shell at 390x844 @2x, touch + hover:none media, CPU slowed RATE x.
   Drags the edge ribbon left at finger speed (40 steps of 4 px) and records, per variant, the frame gaps during the drag
   and how many distinct panel positions were painted. Variants switch ONE suspect off at a time. Args: out json. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const OUT = process.argv[2], RATE = Number(process.env.RATE || 6), URL = 'http://localhost:4187/tools/ponder-lab.html?shell';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = OUT + '.profile'; fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9417', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9417/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EVAL ERROR ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300) : r.result?.result?.value; };
const busy = async () => (await send('Performance.getMetrics')).result.metrics.find((m) => m.name === 'TaskDuration').value;
await send('Page.enable'); await send('Runtime.enable'); await send('Performance.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }, { name: 'prefers-reduced-motion', value: 'no-preference' }] });
const NB = `const s = document.createElement('style'); s.textContent = '.backdrop-blur-xl{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}'; document.head.appendChild(s);`;
/* [setup, x step, y step]: idle = no finger (what the screen costs anyway); ydrag = a vertical drag, which the handler
   ignores after 6 px (no state change, so no re-render); base = the real pull; noblur = the pull with the blur off */
const VARIANTS = {};
for (const k of [1, 2, 3]) Object.assign(VARIANTS, { ['idle' + k]: ['', 0, 0], ['ydrag' + k]: ['', 0, 4], ['base' + k]: ['', 4, 0], ['noblur' + k]: [NB, 4, 0] });
const result = { rate: RATE };
for (const [name, [setup, sx, sy]] of Object.entries(VARIANTS)) {
  await send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await send('Page.navigate', { url: URL }); await sleep(3500);
  const media = await js(`matchMedia('(hover: none)').matches && matchMedia('(pointer: coarse)').matches`);
  await js(setup || '0');
  const r = await js(`(() => { const b = document.querySelector('.kpm-edge-ribbon').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
  await js(`(() => { const nav = [...document.querySelectorAll('.fixed.inset-y-0.right-0')].find(e => /backdrop-blur-xl/.test(e.className));
    const F = window.__drag = { gaps: [], pos: new Set(), on: true, last: performance.now() };
    const tick = (t) => { if (!F.on) return; F.gaps.push(t - F.last); F.last = t; F.pos.add(nav ? getComputedStyle(nav).transform : 'none'); requestAnimationFrame(tick); };
    requestAnimationFrame((t) => { F.last = t; requestAnimationFrame(tick); }); })()`);
  await send('Emulation.setCPUThrottlingRate', { rate: RATE }); await sleep(300);
  const b0 = await busy(), t0 = Date.now();
  const finger = sx || sy;
  if (finger) await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: r.x, y: r.y }] });
  for (let i = 1; i <= 40; i++) { if (finger) await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: r.x - i * sx, y: r.y + i * sy }] }); await sleep(finger ? 8 : 35); }
  await sleep(120);
  const mid = await js(`(() => { const F = window.__drag; F.on = false; const g = F.gaps.slice(1).sort((a, b) => a - b); return { frames: g.length, distinctPositions: F.pos.size, p50: Math.round(g[g.length >> 1]), p95: Math.round(g[Math.floor(g.length * .95)]), max: Math.round(g[g.length - 1]), over50: g.filter(x => x > 50).length }; })()`);
  const wall = Date.now() - t0, b1 = await busy();
  if (finger) await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await send('Emulation.setCPUThrottlingRate', { rate: 1 }); await sleep(600);
  const opened = await js(`!![...document.querySelectorAll('.fixed.inset-y-0.right-0')].find(e => /translate-x-0/.test(e.className))`);
  result[name] = { media, ...mid, dragWallMs: wall, mainThreadBusyMs: Math.round((b1 - b0) * 1000), opened };
  console.log(name, JSON.stringify(result[name]));
}
fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
chrome.kill(); await sleep(400); fs.rmSync(prof, { recursive: true, force: true });
process.exit(0);
