// POTATO AUDIT - the KPM app on a simulated cheap phone: CPU slowed RATE x (default 6), 390x844 @2x, touch, FULL
// animations (reduced-motion off, Lite Mode off). Production build wired to the local Firebase emulator (fake company).
// Per screen: settle time after the tap, then an idle window (nothing touched) traced, then a scan of what runs, then a
// touch scroll. Also a cold + warm load of the sign-in screen on slow 4G. Writes potato-result.json next to itself.
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main';
const APP = 'http://localhost:4175/';
const ASSETS = 'C:/Users/ASUS/AppData/Local/Temp/kpm-prod-emu/assets';
const RATE = Number(process.env.RATE || 6);
const IDLE_MS = 4000;
const TABS = (process.env.TABS || 'Command Center|Fleet & Canvas|Agent Inventory|Sales Terminal|Map System|Journey Plan|Master Vault|Restock Vault|Stock Opname|Receivables & Consignment|EOD Setoran|Customers|Sampling|Reports|Audit Logs|Settings|Agent Profile').split('|');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const prof = path.join(HERE, 'potato-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9361',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9361/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(), errors = []; let traceBuf = [], traceDone = null;
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
  if (d.method === 'Tracing.dataCollected') traceBuf.push(...d.params.value);
  if (d.method === 'Tracing.tracingComplete' && traceDone) traceDone();
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, timeout: 120000 }); if (r.result?.exceptionDetails) errors.push('EVAL ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300)); return r.result?.result?.value; };
const metrics = async () => Object.fromEntries((await send('Performance.getMetrics')).result.metrics.map(m => [m.name, m.value]));

/* ── in-page counters, installed before any app code runs ─────────────────────────────────────────────────────── */
const INSTR = `(() => {
  const P = window.__potato = { on: false, raf: {}, timers: {}, iv: new Map(), commits: 0, mut: {}, lt: [] };
  const where = () => { const l = (new Error().stack || '').split('\\n').slice(3).find(s => /assets\\//.test(s)) || ''; const m = l.match(/assets\\/([^:/]+):(\\d+):(\\d+)/); return m ? m[1] + ':' + m[2] + ':' + m[3] : 'other'; };
  const rAF = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => { if (!P.on && !P.block) return rAF(cb); const k = where(); if (P.block && k.includes(P.block)) return 0; return rAF((t) => { if (P.on) P.raf[k] = (P.raf[k] || 0) + 1; cb(t); }); };
  const sI = window.setInterval.bind(window), cI = window.clearInterval.bind(window), sT = window.setTimeout.bind(window);
  window.setInterval = (fn, ms, ...a) => { const id = sI(fn, ms, ...a); P.iv.set(id, { ms, at: where() }); return id; };
  window.clearInterval = (id) => { P.iv.delete(id); return cI(id); };
  window.setTimeout = (fn, ms, ...a) => { if (P.on || P.blockT) { const k = where(); if (P.blockT && k.includes(P.blockT)) return 0; if (P.on) P.timers[k] = (P.timers[k] || 0) + 1; } return sT(fn, ms, ...a); };
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { renderers: new Map(), supportsFiber: true, isDisabled: false, checkDCE() {},
    inject() { return 1; }, onScheduleFiberRoot() {}, onCommitFiberUnmount() {}, onPostCommitFiberRoot() {},
    onCommitFiberRoot(id, root) { if (P.on) P.commits++; if (!P.whoOn) return;
      /* which component's own state changed in this commit, and how big the tree under it is */
      const seen = P.seen ||= new WeakMap(); const stack = [root.current]; let f;
      while ((f = stack.pop())) {
        if ((f.tag === 0 || f.tag === 11 || f.tag === 14 || f.tag === 15 || f.tag === 1) && f.memoizedState !== undefined) {
          const was = seen.has(f) ? seen.get(f) : f.alternate && seen.has(f.alternate) ? seen.get(f.alternate) : f.memoizedState;
          if (was !== f.memoizedState) { const t = f.type?.type || f.type?.render || f.type; const k = String(typeof t === 'function' ? t.toString() : t).slice(0, 110).replace(/\\s+/g, ' ');
            let n = 0; const s2 = [f.child]; let g; while ((g = s2.pop())) { n++; if (g.sibling) s2.push(g.sibling); if (g.child) s2.push(g.child); }
            const e = P.who[k] ||= { n: 0, subtree: 0 }; e.n++; e.subtree = Math.max(e.subtree, n); }
          seen.set(f, f.memoizedState);
        }
        if (f.sibling) stack.push(f.sibling); if (f.child) stack.push(f.child);
      } } };
  P.who = {};
  new MutationObserver((ms) => { if (!P.on) return; for (const m of ms) { const t = m.target.nodeType === 1 ? m.target : m.target.parentElement; const k = t ? (t.tagName.toLowerCase() + '.' + String(t.className || '').split(' ').filter(Boolean).slice(0, 2).join('.')).slice(0, 60) : '?'; P.mut[k] = (P.mut[k] || 0) + 1; } })
    .observe(document, { subtree: true, childList: true, characterData: true, attributes: true });
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) P.lt.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: true }); } catch {}
})();`;

const CATS = ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame', 'toplevel', 'cc', 'gpu', 'viz'];
const trace = async (fn) => {
  traceBuf = []; await send('Tracing.start', { transferMode: 'ReportEvents', traceConfig: { includedCategories: CATS } });
  await fn();
  const done = new Promise(r => { traceDone = r; }); await send('Tracing.end'); await done; traceDone = null;
  return summarize(traceBuf);
};
function summarize(ev) {
  const tname = {}; for (const e of ev) if (e.ph === 'M' && e.name === 'thread_name') tname[e.pid + ':' + e.tid] = e.args.name;
  const byThread = {};
  for (const e of ev) { if (e.ph !== 'X' || !e.dur) continue; const t = tname[e.pid + ':' + e.tid] || '?'; (byThread[e.pid + ':' + e.tid] ||= { t, n: 0, ev: {} }); byThread[e.pid + ':' + e.tid].n++; const b = byThread[e.pid + ':' + e.tid].ev; (b[e.name] ||= [0, 0]); b[e.name][0]++; b[e.name][1] += e.dur / 1000; }
  const mains = Object.values(byThread).filter(x => x.t === 'CrRendererMain').sort((a, b) => b.n - a.n);
  const main = mains[0]?.ev || {};
  const sumBy = (re, key) => Object.values(byThread).filter(x => re.test(x.t)).reduce((s, x) => s + Object.entries(x.ev).filter(([k]) => key.test(k)).reduce((q, [, v]) => q + v[1], 0), 0);
  const cnt = (k) => main[k]?.[0] || 0, ms = (k) => Math.round(main[k]?.[1] || 0);
  /* which script function the main thread spent its time in (url:line:col, 1-based) */
  const mainKey = Object.entries(byThread).filter(([, x]) => x.t === 'CrRendererMain').sort((a, b) => b[1].n - a[1].n)[0]?.[0];
  const fc = {};
  for (const e of ev) { if (e.ph !== 'X' || e.name !== 'FunctionCall' || (e.pid + ':' + e.tid) !== mainKey) continue; const d = e.args?.data || {};
    const k = (d.url || '?').split('/').pop() + ':' + ((d.lineNumber ?? -1) + 1) + ':' + ((d.columnNumber ?? -1) + 1) + ' ' + (d.functionName || '');
    (fc[k] ||= [0, 0]); fc[k][0]++; fc[k][1] += e.dur / 1000; }
  const calls = Object.entries(fc).sort((a, b) => b[1][1] - a[1][1]).slice(0, 6).map(([k, v]) => `${k.trim()} ${Math.round(v[1])}ms x${v[0]}`);
  const top = Object.entries(main).filter(([k]) => !/^(ThreadControllerImpl::RunTask|RunTask|ThreadPool_RunTask)$/.test(k)).sort((a, b) => b[1][1] - a[1][1]).slice(0, 6).map(([k, v]) => `${k} ${Math.round(v[1])}ms x${v[0]}`);
  return { mainTaskMs: Math.round((main['ThreadControllerImpl::RunTask']?.[1]) || (main.RunTask?.[1]) || 0),
    frames: cnt('ProxyMain::BeginMainFrame'), frameMs: ms('ProxyMain::BeginMainFrame'), paints: cnt('Paint'), paintMs: ms('Paint'),
    styleMs: ms('UpdateLayoutTree'), layoutMs: ms('Layout'), rafFired: cnt('FireAnimationFrame'), timersFired: cnt('TimerFire'),
    rasterMs: Math.round(sumBy(/CompositorTileWorker|Raster/i, /RasterTask|RasterizerTaskImpl/)), gpuMs: Math.round(sumBy(/CrGpuMain|VizCompositor/i, /./) / 2), mainTop: top, calls };
}

/* ── what runs on the screen right now ───────────────────────────────────────────────────────────────────────── */
const SCAN = `(() => {
  const desc = (el) => el ? (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + '.' + String(el.className?.baseVal ?? el.className ?? '').split(' ').filter(Boolean).slice(0, 2).join('.')).slice(0, 70) : '?';
  const vis = (el) => { if (!el?.getBoundingClientRect) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const SAFE = new Set(['transform', 'opacity', 'translate', 'scale', 'rotate']);
  const run = document.getAnimations().filter(a => a.playState === 'running');
  const groups = {};
  for (const a of run) {
    const kf = a.effect?.getKeyframes?.() || [];
    const props = [...new Set(kf.flatMap(k => Object.keys(k)).filter(p => !['offset', 'easing', 'composite', 'computedOffset'].includes(p)))];
    const name = a.animationName || a.transitionProperty || 'js';
    const key = name + ' @ ' + desc(a.effect?.target);
    const g = groups[key] ||= { n: 0, props: props.join(','), infinite: a.effect?.getTiming?.().iterations === Infinity, onScreen: 0, safe: props.every(p => SAFE.has(p)) };
    g.n++; if (vis(a.effect?.target)) g.onScreen++;
  }
  const heavy = { backdrop: [], blur: [], blend: [], bigShadow: 0, willChange: 0, fixed: 0 };
  const all = document.querySelectorAll('*');
  for (const el of all) {
    const cs = getComputedStyle(el);
    if (cs.backdropFilter && cs.backdropFilter !== 'none') heavy.backdrop.push(desc(el) + (vis(el) ? '' : ' (off)'));
    if (/blur\\(/.test(cs.filter)) heavy.blur.push(desc(el) + ' ' + cs.filter.slice(0, 30) + (vis(el) ? '' : ' (off)'));
    if (cs.mixBlendMode !== 'normal') heavy.blend.push(desc(el));
    if (cs.boxShadow !== 'none' && (cs.boxShadow.match(/\\d+px \\d+px (\\d+)px/g) || []).some(s => Number(s.split(' ')[2].replace('px', '')) >= 24)) heavy.bigShadow++;
    if (cs.willChange !== 'auto') heavy.willChange++;
  }
  heavy.backdrop = heavy.backdrop.slice(0, 6); heavy.blur = heavy.blur.slice(0, 6); heavy.blend = heavy.blend.slice(0, 6);
  const canv = [...document.querySelectorAll('canvas')].map(c => desc(c) + ' ' + c.width + 'x' + c.height + (vis(c) ? '' : ' (off)'));
  return { dom: all.length, running: run.length, runningOnScreen: run.filter(a => vis(a.effect?.target)).length,
    notComposited: Object.entries(groups).filter(([, g]) => !g.safe).map(([k, g]) => k + ' [' + g.props + '] x' + g.n + (g.infinite ? ' inf' : '') + ' onscreen ' + g.onScreen),
    composited: Object.entries(groups).filter(([, g]) => g.safe).sort((a, b) => b[1].n - a[1].n).slice(0, 8).map(([k, g]) => k + ' x' + g.n + (g.infinite ? ' inf' : '') + ' onscreen ' + g.onScreen),
    heavy, canvases: canv, coarse: matchMedia('(pointer: coarse)').matches, lite: document.documentElement.classList.contains('lite-mode') };
})()`;

const top = (o, n = 6) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => k + ' x' + v);
async function idle(label, withWho = true) {
  await js(`(() => { const P = __potato; P.raf = {}; P.timers = {}; P.commits = 0; P.mut = {}; P.lt = []; P.on = true; return 1; })()`);
  const m0 = await metrics();
  const tr = await trace(() => sleep(IDLE_MS));
  const m1 = await metrics();
  const p = await js(`(() => { const P = __potato; P.on = false; return { raf: P.raf, timers: P.timers, commits: P.commits, mut: P.mut, lt: P.lt, iv: [...P.iv.values()] }; })()`);
  const s = IDLE_MS / 1000;
  return { label, busyPct: Math.round((m1.TaskDuration - m0.TaskDuration) / s * 100), scriptMs: Math.round((m1.ScriptDuration - m0.ScriptDuration) * 1000),
    styleRecalcs: m1.RecalcStyleCount - m0.RecalcStyleCount, layouts: m1.LayoutCount - m0.LayoutCount,
    reactCommitsPerSec: +(p.commits / s).toFixed(1), rafPerSec: top(Object.fromEntries(Object.entries(p.raf).map(([k, v]) => [k, +(v / s).toFixed(1)]))),
    timeoutsPerSec: top(Object.fromEntries(Object.entries(p.timers).map(([k, v]) => [k, +(v / s).toFixed(1)]))),
    domChangesPerSec: top(Object.fromEntries(Object.entries(p.mut).map(([k, v]) => [k, +(v / s).toFixed(1)]))),
    longTasks: p.lt.length, intervals: p.iv.map(i => i.ms + 'ms@' + i.at), trace: tr, ...at60(tr, s), who: withWho ? await who() : [] };
}
/* headless draws as fast as it can (~150/s); a phone draws 60. Frame work is scaled to 60 per second, the rest kept. */
function at60(tr, s) {
  const per = tr.frames ? tr.frameMs / tr.frames : 0, other = Math.max(0, tr.mainTaskMs - tr.frameMs);
  return { framesPerSecHeadless: Math.round(tr.frames / s), msPerFrame: +per.toFixed(2),
    idleCpuPctAt60: Math.min(100, Math.round((per * Math.min(tr.frames / s, 60) * s + other) / (s * 1000) * 100)) };
}
async function who() {
  await js(`(() => { __potato.who = {}; __potato.whoOn = true; return 1; })()`); await sleep(2000);
  const w = await js(`(() => { __potato.whoOn = false; return __potato.who; })()`);
  return Object.entries(w || {}).sort((a, b) => b[1].n - a[1].n).slice(0, 5).map(([k, v]) => `${v.n}x/2s tree ${v.subtree}: ${k}`);
}
async function scroll() {
  await js(`(() => { window.__fr = []; let last = performance.now(); const loop = (t) => { window.__fr.push(t - last); last = t; if (window.__frOn) requestAnimationFrame(loop); }; window.__frOn = true; requestAnimationFrame(loop); return 1; })()`);
  const t0 = Date.now();
  await send('Input.synthesizeScrollGesture', { x: 195, y: 600, yDistance: -1600, speed: 1600, gestureSourceType: 'touch', repeatCount: 1 });
  const dur = Date.now() - t0;
  const fr = await js(`(() => { window.__frOn = false; const f = window.__fr.slice(1); return { n: f.length, janky: f.filter(x => x > 50).length, worst: Math.round(Math.max(0, ...f)) }; })()`);
  return { ms: dur, jankyFrames: fr.janky, worstFrameMs: fr.worst };
}
async function tapTab(label) {
  const t = await js(`(async () => {
    const b = [...document.querySelectorAll('button, a')].find(x => (x.getAttribute('aria-label') || x.textContent || '').trim() === ${JSON.stringify(label)});
    if (!b) return -1;
    let lastMut = performance.now(); const mo = new MutationObserver(() => { lastMut = performance.now(); }); mo.observe(document.body, { subtree: true, childList: true, characterData: true });
    const t0 = performance.now(); b.click();
    while (performance.now() - lastMut < 600 && performance.now() - t0 < 20000) await new Promise(r => setTimeout(r, 50));
    mo.disconnect(); return Math.max(0, Math.round(lastMut - t0));
  })()`);
  return t;
}

const sheets = {}; ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.method === 'CSS.styleSheetAdded') sheets[d.params.header.styleSheetId] = d.params.header; });
await send('Page.enable'); await send('Runtime.enable'); await send('Performance.enable'); await send('Network.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: INSTR });
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
const out = { rate: RATE, viewport: '390x844@2 touch', when: process.env.WHEN || '', load: {}, screens: [], errors };

/* ── 1. the sign-in screen: cold (nothing stored) and warm (the offline copy) on slow 4G ──────────────────────── */
const load = async (tag) => {
  const m0 = await metrics();
  const t0 = Date.now();
  await send('Page.navigate', { url: APP });
  let ready = -1;
  for (let i = 0; i < 300; i++) { await sleep(100); if (await js(`/SIGN IN TO CONTINUE|MASTER PASSWORD/i.test(document.body?.innerText || '')`)) { ready = Date.now() - t0; break; } }
  await sleep(1500);
  const m1 = await metrics();
  const r = await js(`(() => { const res = performance.getEntriesByType('resource'); const fcp = performance.getEntriesByName('first-contentful-paint')[0]; const sum = (re) => Math.round(res.filter(e => re.test(e.name)).reduce((s, e) => s + (e.transferSize || 0), 0) / 1024);
    return { fcpMs: Math.round(fcp?.startTime || -1), jsKB: sum(/\\.js$/), cssKB: sum(/\\.css$/), files: res.length, longTasks: __potato.lt.length, longestTaskMs: Math.max(0, ...__potato.lt.map(x => x[1])) }; })()`);
  out.load[tag] = { screenReadyMs: ready, ...r, scriptMs: Math.round(m1.ScriptDuration * 1000), taskMs: Math.round(m1.TaskDuration * 1000) };
};
await send('Emulation.setCPUThrottlingRate', { rate: RATE });
await send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
await load('cold_slow4g');
await sleep(8000);                       // let the offline helper store the app
await load('warm_slow4g');
await send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
out.screens.push({ ...(await idle('sign-in screen')), scan: await js(SCAN) });

/* ── 2. sign in to the FAKE company (emulator), fill it, open the vault ─────────────────────────────────────────── */
await send('Emulation.setCPUThrottlingRate', { rate: 1 });
const uid = await js(`(async () => { const h = window.__kpmEmulatorAuth; const c = await h.signIn(h.auth, h.credential(JSON.stringify({ sub: 'potato', email: 'adikaryasukses99@gmail.com', email_verified: true, name: 'Lab Owner' }))); return c.user.uid; })()`);
execSync(`node tools/seed-emulator.mjs --uid ${uid}`, { cwd: REPO, stdio: 'ignore' });
await send('Page.reload'); await sleep(8000);
await send('Emulation.setCPUThrottlingRate', { rate: RATE });
await sleep(3000);
out.screens.push({ ...(await idle('vault gate (dot field)')), scan: await js(SCAN) });
/* ── ABLATE mode: switch one thing off at a time and measure what that alone saves ─────────────────────────────── */
const ABLATE = !!process.env.ABLATE;
const RESUME = `document.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); }); __potato.block = ''; __potato.blockT = ''; 1`;
const PAUSE = (re) => `document.getAnimations().filter(a => ${re}.test(a.animationName || '')).forEach(a => a.pause()); 1`;
out.ablate = [];
const ablate = async (screen, steps) => {
  for (const [name, code] of steps) {
    await js(RESUME); if (code) await js(code); await sleep(1200);
    const m = await idle(screen + ' / ' + name, false);
    out.ablate.push({ screen, step: name, cpu60: m.idleCpuPctAt60, msPerFrame: m.msPerFrame, framesPerSec: m.framesPerSecHeadless,
      styleMsPerFrame: m.trace.frames ? +(m.trace.styleMs / m.trace.frames).toFixed(2) : 0, paintsPerSec: Math.round(m.trace.paints / (IDLE_MS / 1000)),
      commitsPerSec: m.reactCommitsPerSec, calls: m.trace.calls.slice(0, 3) });
    console.log('ablate', screen, name, m.idleCpuPctAt60 + '%', m.msPerFrame + 'ms/fr');
  }
  await js(RESUME);
};
if (ABLATE) await ablate('vault gate', [['as is', ''], ['dot field loop off', `__potato.block = ':78:'; 1`]]);
out.unlockTypingMsPerLetter = await js(`(() => { const i = document.querySelector('input[placeholder="MASTER PASSWORD"]'); if (!i) return -1; const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; const w = 'Emulator-1!'; let t = 0; for (let k = 1; k <= w.length; k++) { const a = performance.now(); set.call(i, w.slice(0, k)); i.dispatchEvent(new Event('input', { bubbles: true })); t += performance.now() - a; } return +(t / w.length).toFixed(1); })()`);
await js(`[...document.querySelectorAll('button[type="submit"]')].find(b => /vault/i.test(b.textContent)).click(); 1`);
{ const u = await trace(() => sleep(10000)); out.unlockSequence = { ...u, ...at60(u, 10) }; }
await sleep(2000);

/* ── 3. every screen: tap -> settle, idle, what runs, a touch scroll ──────────────────────────────────────────── */
if (ABLATE) {
  const ALL = `document.getAnimations().forEach(a => a.pause()); 1`, CLOCK = `__potato.blockT = ':112:4630'; 1`;
  const PLAN = [
    ['Command Center', [['as is', ''], ['mascot sprite paused', PAUSE('/kpmMerch/')], ['clock stopped', CLOCK], ['every CSS animation paused', ALL], ['all paused + clock stopped', ALL + ';' + CLOCK]]],
    ['Agent Inventory', [['as is', ''], ['coin spin paused', PAUSE('/kpmCoinSpin/')], ['sign pulse paused', PAUSE('/kpmSignPulse/')], ['specks paused', PAUSE('/kpmSpeck/')],
      ['book bob+yaw paused', PAUSE('/kpmBook/')], ['mascot paused', PAUSE('/kpmMerch/')], ['edge breath paused', PAUSE('/kpmEdgeBreath/')], ['every CSS animation paused', ALL]]],
    ['Master Vault', [['as is', ''], ['3D card spin loop off', `__potato.block = 'ResidentEvilInventory'; 1`]]],
    ['Restock Vault', [['as is', ''], ['notice breathe paused', PAUSE('/kpmNoticeBreathe/')], ['every CSS animation paused', ALL]]],
    ['Stock Opname', [['as is', ''], ['pulse paused', PAUSE('/pulse/')], ['every CSS animation paused', ALL]]],
  ];
  for (const [tab, steps] of PLAN) { await tapTab(tab); await sleep(1500); await ablate(tab, steps); }
  fs.writeFileSync(path.join(HERE, 'potato-ablate.json'), JSON.stringify(out.ablate, null, 1));
  console.log('written ablate'); chrome.kill(); process.exit(0);
}
await send('DOM.enable'); await send('CSS.enable'); await send('CSS.startRuleUsageTracking');
for (const tab of TABS) {
  const settleMs = await tapTab(tab);
  if (settleMs < 0) { out.screens.push({ label: tab, missing: true }); continue; }
  await sleep(1500);
  const row = { settleMs, ...(await idle(tab)) };
  row.scan = await js(SCAN);
  row.scroll = await scroll();
  out.screens.push(row);
  console.log(tab, 'settle', settleMs, 'busy%', row.busyPct, 'paints', row.trace.paints, 'anims', row.scan.running, 'fps', row.scroll.fps);
}

{ const u = (await send('CSS.stopRuleUsageTracking')).result?.ruleUsage || []; const used = {};
  for (const r of u) if (r.used) used[r.styleSheetId] = (used[r.styleSheetId] || 0) + (r.endOffset - r.startOffset);
  out.css = Object.values(sheets).filter(h => h.length > 5000).map(h => ({ url: (h.sourceURL || '').split('/').pop(), kb: Math.round(h.length / 1024), usedKB: Math.round((used[h.styleSheetId] || 0) / 1024) })); }
/* where the counted rAF / timer / interval sources sit in the minified files - a snippet each, to name them later */
const srcs = new Set();
for (const s of out.screens) for (const x of [...(s.rafPerSec || []), ...(s.timeoutsPerSec || []), ...(s.intervals || [])]) { const m = String(x).match(/([A-Za-z0-9_.-]+\.js):(\d+):(\d+)/); if (m) srcs.add(m[1] + ':' + m[2] + ':' + m[3]); }
out.sources = {};
for (const k of srcs) { const [f, ln, col] = k.split(':'); try { const line = fs.readFileSync(path.join(ASSETS, f), 'utf8').split('\n')[Number(ln) - 1] || ''; const c = Number(col); out.sources[k] = line.slice(Math.max(0, c - 220), c + 80).replace(/\s+/g, ' '); } catch { out.sources[k] = '?'; } }
fs.writeFileSync(path.join(HERE, 'potato-result.json'), JSON.stringify(out, null, 1));
console.log('written', path.join(HERE, 'potato-result.json'), 'errors', errors.length);
chrome.kill(); process.exit(0);
