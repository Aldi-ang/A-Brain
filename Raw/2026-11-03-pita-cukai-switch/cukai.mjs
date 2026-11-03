// node cukai.mjs - his 2026-11-03 "make the toggle button to turn on/off the pita cukai on EOD". Lab, phone 375x812:
//   EOD (salesman counting flow): ON = "Card 1 of 4", OFF (&nocukai) = "Card 1 of 3" and no Pita cukai card
//   the van (&agent): ON shows "Cukai Due", OFF does not
//   Settings (&owner): the switch inside "Lost pita cukai fine"; press Off -> the read flips, the write carries cukaiReturn:false
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(`${DIR}prof`, { recursive: true, force: true });
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log(JSON.stringify({ error: 'watchdog 120 s' })); chrome.kill(); process.exit(1); }, 120000).unref();
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
await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', 'en'); } catch (e) {}` });
const shot = async (file) => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(DIR + file, Buffer.from(r.result.data, 'base64')); return file; };
const open = async (query, until) => { await send('Page.navigate', { url: `http://localhost:4190/tools/ponder-lab.html?${query}` });
  return ev(`(async () => { for (let i = 0; i < 100; i++) { if (${until}) return true; await new Promise((r) => setTimeout(r, 150)); } return false; })()`); };
const text = () => ev(`document.body.innerText.replace(/\\s+/g, ' ')`);
const out = {};

for (const [k, q] of [['eodOn', 'shell&eod'], ['eodOff', 'shell&eod&nocukai']]) {
  await open(q, `/Card 1 of/i.test(document.body.innerText)`); await sleep(600);
  const t = await text();
  out[k] = { card: (t.match(/Card 1 of \d/i) || [])[0], cukaiCard: /pita cukai/i.test(t), stampsAsked: /stamps? (handed|lost)/i.test(t) };
  await ev(`[...document.querySelectorAll('*')].find((e) => /^Card 1 of/i.test(e.textContent.trim()) && e.children.length === 0)?.scrollIntoView({ block: 'center' })`); await sleep(300);
  out[k].file = await shot(`${k}.png`);
}
for (const [k, q] of [['vanOn', 'shell&agent'], ['vanOff', 'shell&agent&nocukai']]) {
  await open(q, `/Load/i.test(document.body.innerText) && /Modal/i.test(document.body.innerText)`); await sleep(800);
  out[k] = { cukaiDue: /Cukai Due/i.test(await text()) };
  out[k].file = await shot(`${k}.png`);
}
await open('shell&settings&owner&menu=ADMIN', `/Lost pita cukai fine/i.test(document.body.innerText)`); await sleep(500);
const mod = `[...document.querySelectorAll('.kpm-mod')].find((m) => /Lost pita cukai fine/.test(m.textContent))`;
const read = () => ev(`(() => { const m = ${mod}; if (!m) return null; return { read: m.querySelector('.kpm-read')?.textContent, pressed: [...m.querySelectorAll('.kpm-switch button')].map((b) => b.textContent + ':' + b.getAttribute('aria-pressed')) }; })()`);
await ev(`${mod}?.scrollIntoView({ block: 'center' })`); await sleep(300);
out.settingsBefore = await read(); if (!out.settingsBefore) { out.settingsPage = (await text()).slice(0, 400); out.errors = errors.slice(0, 4); out.shot = await shot('settings-fail.png'); console.log(JSON.stringify(out)); chrome.kill(); process.exit(0); } out.settingsBefore.file = await shot('settings-on.png');
await ev(`[...(${mod}).querySelectorAll('.kpm-switch button')].find((b) => /^Off$/.test(b.textContent.trim())).click()`); await sleep(500);
out.settingsAfter = await read(); out.settingsAfter.file = await shot('settings-off.png');
out.writes = await ev(`JSON.stringify((window.__labWrites || []).filter((w) => JSON.stringify(w).includes('cukaiReturn')).slice(-2))`);
out.errors = errors.slice(0, 4);
writeFileSync(`${DIR}cukai.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
chrome.kill(); process.exit(0);
