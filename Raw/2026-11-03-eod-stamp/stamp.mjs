// node stamp.mjs <name> <width> <height> [lite]
// His #5 (2026-11-03, the EOD stamp "snap my screen and gone right away"). Lab ?shell&eod&admin&live: an approve lands
// the way Firestore lands it (the report turns VERIFIED at once, the answer ~400 ms later). Ticks every line of tonight's
// card, presses the plate, confirms - then:
//   1. ONE real-time run sampled every 40 ms from rest (before Confirm) to 3.8 s: the seal's opacity, the card's height,
//      the Late panel's top, cards on the list, ticks shown, the unfolding empty box;
//   2. frozen moments, a fresh press each (only the first freeze of a press is a true moment): "hold" = the writes
//      landing, then 0 / 0.5 / 1.2 / 2.0 / 2.42 / 2.72 s after the stamp starts (every animation paused at that time).
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [, , name, w = '375', h = '812', lite = ''] = process.argv;
const phone = +w < 1024;
const query = `shell&eod&admin&live${lite ? '&lite' : ''}`;
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(`${DIR}prof-${name}`, { recursive: true, force: true });
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof-${name}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log(JSON.stringify({ name, error: 'watchdog 150 s' })); chrome.kill(); process.exit(1); }, 150000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up yet */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl);
await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 2, mobile: phone });
if (phone) {
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
}
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', 'en'); } catch (e) {}` });
const shot = async (file) => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(DIR + file, Buffer.from(r.result.data, 'base64')); return file; };

/* tick, plate, Confirm. `sample` installs the 40 ms sampler at rest, BEFORE the Confirm click; t = 0 is that click. */
const PRESS = (sample) => `(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const list = document.querySelector('div.space-y-3.kpm-arrive');
  if (!list) return 'no list';
  list.scrollIntoView({ block: 'start' }); scrollBy(0, -8);
  for (const b of list.querySelectorAll('button[aria-label^="approve "]')) { b.click(); await sleep(40); }
  const plate = [...list.querySelectorAll('button')].find((b) => /^Approve/i.test(b.innerText.trim()));
  if (!plate) return 'no plate';
  plate.click(); await sleep(500);
  const dlg = document.querySelector('[role=alertdialog]');
  if (!dlg) return 'no dialog';
  const yes = [...dlg.querySelectorAll('button')].find((b) => /^(confirm|yes)/i.test(b.innerText.trim()));
  if (!yes) return 'no confirm: ' + [...dlg.querySelectorAll('button')].map((b) => b.innerText).join('|');
  window.__s = []; window.__stage = null;
  const row = () => {
    const t = Math.round(performance.now() - window.__t0);
    const seal = document.querySelector('.kpm-seal-stage .kpm-docket-seal');
    if (seal && window.__stage === null) window.__stage = t;
    const l = document.querySelector('div.space-y-3.kpm-arrive'), card = l && l.firstElementChild;
    const late = document.querySelector('section[aria-label="Late EOD"]'), un = document.querySelector('.kpm-unfold');
    return { t, seal: seal ? +(+getComputedStyle(seal).opacity).toFixed(2) : null, cardH: card && !card.classList.contains('kpm-unfold') ? +card.getBoundingClientRect().height.toFixed(1) : null,
      lateTop: late ? +(late.getBoundingClientRect().top + scrollY).toFixed(1) : null, cards: l ? l.querySelectorAll('.pc-line').length ? l.children.length : 0 : 0,
      ticks: l ? l.querySelectorAll('[aria-label="approved"]').length : 0, unH: un ? +un.getBoundingClientRect().height.toFixed(1) : null,
      empty: !l && /No pending reports/.test(document.body.innerText) };
  };
  window.__t0 = performance.now();
  if (${sample}) { window.__rest = row(); const iv = setInterval(() => window.__s.push(row()), 40); setTimeout(() => clearInterval(iv), 5600); }
  window.__t0 = performance.now(); yes.click();
  return 'pressed';
})()`;
const load = async () => { await send('Page.navigate', { url: `http://localhost:4190/tools/ponder-lab.html?${query}` }); await sleep(1500);
  await ev(`(async () => { for (let i = 0; i < 100 && !document.querySelector('div.space-y-3.kpm-arrive .pc-line'); i++) await new Promise((r) => setTimeout(r, 200)); })()`); await sleep(1500); };

/* 1. the real-time run */
await load();
const p1 = await ev(PRESS(true));
await sleep(6000);
const run = await ev(`({ rest: window.__rest, stage: window.__stage, s: window.__s, lite: document.documentElement.classList.contains('lite-mode'), timeline: document.timeline.currentTime })`);

/* 2. the moments */
const frames = [];
const moment = async (label, ms) => {
  await load();
  const p = await ev(PRESS(false));
  if (p !== 'pressed') return frames.push({ label, error: p });
  if (ms === 'hold') {   // the writes landing: the first ✓ shown, before the stamp
    const got = await ev(`(async () => { for (let i = 0; i < 400; i++) { const l = document.querySelector('div.space-y-3.kpm-arrive'); if (l && l.querySelector('[aria-label="approved"]')) return document.querySelector('.kpm-seal-stage') ? 'stage already' : 'ok'; await new Promise((r) => setTimeout(r, 5)); } return 'never'; })()`);
    return frames.push({ label, got, file: await shot(`${name}-${label}.png`) });
  }
  const got = await ev(`(async () => { for (let i = 0; i < 800; i++) { if (document.querySelector('.kpm-seal-stage .kpm-docket-seal')) {
      document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ${ms}; });
      const seal = document.querySelector('.kpm-seal-stage .kpm-docket-seal');
      return { seal: +getComputedStyle(seal).opacity, anims: seal.getAnimations().map((a) => a.animationName + '@' + Math.round(a.currentTime)) }; }
    await new Promise((r) => setTimeout(r, 5)); } return 'no stage'; })()`);
  frames.push({ label, got, file: await shot(`${name}-${label}.png`) });
};
for (const [label, ms] of [['hold', 'hold'], ['t0.00', 0], ['t0.50', 500], ['t1.20', 1200], ['t2.00', 2000], ['t2.42', 2420], ['t2.72', 2720]]) await moment(label, ms);

writeFileSync(`${DIR}${name}-samples.json`, JSON.stringify({ query, w, h, p1, run, frames, errors }, null, 1));
console.log(JSON.stringify({ name, p1, stage: run?.stage, lite: run?.lite, n: run?.s?.length, frames: frames.map((f) => [f.label, f.error || f.got]), errors: errors.slice(0, 3) }));
chrome.kill(); process.exit(0);
