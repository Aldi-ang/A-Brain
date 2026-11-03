// node salesman.mjs <name> <width> <height>
// His 2026-11-03 "of course the receiver/salesman should see this too and they can replay it all the time as long as
// there is no updated EOD one". Lab ?shell&eod&verified = Budi's own EOD screen, his night approved (v1, dayXP 51).
//   A. first open: the replay plays BY ITSELF (overlay present, XP counting) and closes
//   B. reload, same browser: it does NOT play again (seen on this device)
//   C. the header's "Replay last EOD" is there and plays it again
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const [, , name, w = '375', h = '812'] = process.argv;
const phone = +w < 1024;
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(`${DIR}prof-${name}`, { recursive: true, force: true });
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof-${name}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log(JSON.stringify({ name, error: 'watchdog 90 s' })); chrome.kill(); process.exit(1); }, 90000).unref();
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
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', 'en'); } catch (e) {}` });
const shot = async (file) => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(DIR + file, Buffer.from(r.result.data, 'base64')); return file; };
/* poll the overlay from the moment the page starts: present? the XP number on its card? */
const WATCH = `(async () => { const out = []; const t0 = performance.now();
  for (let i = 0; i < 180; i++) { const o = document.querySelector('.kpm-replay'); const p = o && [...o.querySelectorAll('.pc-head p')].find((x) => / XP/.test(x.textContent));
    out.push([Math.round(performance.now() - t0), !!o, p ? Number(p.textContent.split(' XP')[0].replace(/[^0-9]/g, '')) : null]); await new Promise((r) => setTimeout(r, 50)); }
  const seen = []; let prev = ''; for (const r of out) { const k = r[1] + ':' + r[2]; if (k !== prev) seen.push(r); prev = k; } return seen; })()`;
const open = async () => { await send('Page.navigate', { url: `http://localhost:4190/tools/ponder-lab.html?shell&eod&verified` });
  await ev(`(async () => { for (let i = 0; i < 100 && !/Shift Closed/i.test(document.body.innerText); i++) await new Promise((r) => setTimeout(r, 150)); })()`); };
await open();
let A = null, frameA = null;
const firstSeen = await ev(`(async () => { for (let i = 0; i < 100; i++) { const p = document.querySelector('.kpm-replay .pc-chip'); if (p) return true; await new Promise((r) => setTimeout(r, 40)); } return false; })()`);
if (firstSeen) frameA = await shot(`${name}-A-first-open.png`);
A = await ev(WATCH);
await open(); await sleep(400);
const B = await ev(WATCH);
const btn = await ev(`(() => { const b = [...document.querySelectorAll('button')].find((x) => /Replay last EOD/.test(x.textContent)); return b ? b.textContent.trim() : null; })()`);
const frameBtn = await shot(`${name}-B-button.png`);
await ev(`[...document.querySelectorAll('button')].find((x) => /Replay last EOD/.test(x.textContent))?.click()`);
const C = await ev(WATCH);
writeFileSync(`${DIR}${name}-salesman.json`, JSON.stringify({ firstSeen, A, B, btn, C, errors }, null, 1));
const sum = (s) => s && { opened: s.some((r) => r[1]), from: (s.find((r) => r[2]) || [])[2], to: Math.max(0, ...s.map((r) => r[2] || 0)), closed: s.length ? !s[s.length - 1][1] : null };
console.log(JSON.stringify({ name, A_firstOpen: sum(A), frameA, B_reload: sum(B), button: btn, frameBtn, C_pressed: sum(C), errors: errors.slice(0, 3) }));
chrome.kill(); process.exit(0);
