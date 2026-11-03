// node replay.mjs <name> <width> <height> [lite]
// His 2026-11-03 EOD replay ("stay until all the level up or exp gain increase is completed ... saved inside the history
// file so that i can retry it ... like the one we have on the presentation"). Lab ?shell&eod&admin&live&rankup: Budi sits
// 10 XP under Gold, so approving tonight crosses a rank. The XP count is a JS tween, not a CSS animation, so frames are
// labelled by WHAT THE PAGE SHOWED when shot (the XP number, the banner), never by a slept time.
//   1. approve: 40 ms samples from rest (before Confirm) to the fold: seal opacity, the card's XP text, banner, chips, card height
//   2. frames at states: counting / rank up / done / folding
//   3. the History Log: open the folders until a Replay shows, count Replays (one per salesman), press it, sample + shoot it
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [, , name, w = '375', h = '812', lite = ''] = process.argv;
const phone = +w < 1024;
const query = `shell&eod&admin&live&rankup${lite === "lite" ? "&lite" : lite === "light" ? "&light" : ""}`;
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(`${DIR}prof-${name}`, { recursive: true, force: true });
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof-${name}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log(JSON.stringify({ name, error: 'watchdog 120 s' })); chrome.kill(); process.exit(1); }, 120000).unref();
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
await send('Page.navigate', { url: `http://localhost:4190/tools/ponder-lab.html?${query}` }); await sleep(1500);
await ev(`(async () => { for (let i = 0; i < 100 && !document.querySelector('div.space-y-3.kpm-arrive .pc-line'); i++) await new Promise((r) => setTimeout(r, 200)); })()`); await sleep(1500);

/* the page-side sampler: one row per 40 ms; `root` = the replay overlay if open, else tonight's list */
await ev(`window.__row = (root) => {
  const card = root && root.querySelector('.pc'), seal = document.querySelector('.kpm-seal-stage .kpm-docket-seal'), ban = card && card.querySelector('.pc-ban');
  const xpLine = card && [...card.querySelectorAll('.pc-head p')].find((p) => / XP/.test(p.textContent));
  return { t: Math.round(performance.now() - window.__t0), seal: seal ? +(+getComputedStyle(seal).opacity).toFixed(2) : null,
    xp: xpLine ? Number(xpLine.textContent.split(' XP')[0].replace(/[^0-9]/g, '')) : null, rank: card ? (card.querySelector('.pc-rank') || {}).textContent : null,
    ban: ban ? ban.textContent.replace('Rank up', '') + (ban.classList.contains('off') ? ' (off)' : '') : null, chips: card ? card.querySelectorAll('.pc-chip').length : 0,
    h: card ? Math.round((card.closest('.kpm-fold, .kpm-arrive > div') || card).getBoundingClientRect().height) : null, fold: !!document.querySelector('.kpm-fold') }; }; 'ok'`);

/* 1 + 2. approve, sample, shoot by state */
const pressed = await ev(`(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const list = document.querySelector('div.space-y-3.kpm-arrive');
  list.scrollIntoView({ block: 'start' }); scrollBy(0, -8);
  for (const b of list.querySelectorAll('button[aria-label^="approve "]')) { b.click(); await sleep(40); }
  [...list.querySelectorAll('button')].find((b) => /^Approve/i.test(b.innerText.trim())).click(); await sleep(500);
  const yes = [...document.querySelectorAll('[role=alertdialog] button')].find((b) => /^(confirm|yes)/i.test(b.innerText.trim()));
  if (!yes) return 'no confirm';
  window.__s = []; window.__t0 = performance.now();
  window.__rest = window.__row(list);
  const iv = setInterval(() => window.__s.push(window.__row(document.querySelector('div.space-y-3.kpm-arrive'))), 40);
  setTimeout(() => clearInterval(iv), 16000);
  window.__t0 = performance.now(); yes.click(); return 'pressed';
})()`);
const frames = [];
/* `settle` = ms to wait once the state shows (an entrance still fading in is not the state); the label is re-read at the shot */
const when = async (label, cond, settle = 0, ms = 15000) => {
  const got = await ev(`(async () => { for (let i = 0; i < ${ms / 20}; i++) { const r = window.__row(document.querySelector('div.space-y-3.kpm-arrive')); if (${cond}) return r; await new Promise((res) => setTimeout(res, 20)); } return null; })()`);
  if (got && settle) await sleep(settle);
  const file = got ? await shot(`${name}-${label}.png`) : null;
  frames.push({ label, shown: got && settle ? await ev(`window.__row(document.querySelector('div.space-y-3.kpm-arrive'))`) : got, file });
};
if (lite !== 'lite') {
  await when('1-counting', `r.seal === 1 && r.xp > window.__rest.xp && r.xp < 20000 && r.chips > 0`);
  await when('2-rankup', `r.ban && !/off/.test(r.ban)`, 650);
  await sleep(2500);
  await when('3-counted', `!r.ban && r.seal === 1 && r.xp > 20000`);
} else {
  await when('1-lite', `r.ban && r.seal === 1`);
}
await when('4-folding', `r.fold && r.h > 20 && r.h < 200`);
await sleep(1500);
const run = await ev(`({ rest: window.__rest, s: window.__s })`);

/* 3. the History Log's replay */
const hist = await ev(`(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const head = [...document.querySelectorAll('h3')].find((x) => /EOD History Log/i.test(x.textContent));
  const box = head.parentElement, clicked = [];
  /* place > salesman > month are folder cards (.kpm-folders); then the nights, each a date button that opens its rows */
  for (let i = 0; i < 3; i++) {
    const f = box.querySelector('.kpm-folders > *'); if (!f) break;
    clicked.push(f.textContent.trim().slice(0, 30)); (f.querySelector('button') || f).click(); await sleep(400);
  }
  const dates = [...box.querySelectorAll('button')].filter((b) => /^\\d/.test(b.textContent.trim()));
  for (const d of dates) { d.click(); await sleep(350); clicked.push('date ' + d.textContent.trim()); }   // every night open: one Replay in all
  const reps = [...box.querySelectorAll('button')].filter((b) => /Replay/.test(b.textContent));
  const row = reps[0] && reps[0].closest('[class*="rounded-xl"]');
  return { clicked, replays: reps.length, rowText: row ? row.textContent.replace(/\\s+/g, ' ').slice(0, 90) : null };
})()`);
const rp = await ev(`(async () => {
  const b = [...document.querySelectorAll('button')].find((x) => /Replay/.test(x.textContent)); if (!b) return 'no replay button';
  window.__r = []; window.__t0 = performance.now(); b.click();
  const iv = setInterval(() => window.__r.push(window.__row(document.querySelector('.kpm-replay'))), 40); setTimeout(() => clearInterval(iv), 9000);
  return 'opened';
})()`);
let replayShot = null;
if (rp === 'opened') {
  const got = await ev(`(async () => { for (let i = 0; i < 400; i++) { const r = window.__row(document.querySelector('.kpm-replay')); if (r.chips > 0 || (${lite === 'lite'} && r.seal === 1)) return r; await new Promise((res) => setTimeout(res, 20)); } return null; })()`);
  replayShot = { shown: got, file: got ? await shot(`${name}-5-replay.png`) : null };
}
await sleep(9500);
const rep = await ev(`({ r: window.__r, open: !!document.querySelector('.kpm-replay') })`);
writeFileSync(`${DIR}${name}-samples.json`, JSON.stringify({ query, w, h, pressed, run, frames, hist, rp, replayShot, rep, errors }, null, 1));
console.log(JSON.stringify({ name, pressed, frames: frames.map((f) => [f.label, f.shown && { xp: f.shown.xp, ban: f.shown.ban, seal: f.shown.seal, h: f.shown.h }]), hist, rp, replay: replayShot?.shown, closedAfter: !rep?.open, errors: errors.slice(0, 3) }));
chrome.kill(); process.exit(0);
