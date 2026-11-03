// node built.mjs - his pick B "PHOTO CORNER" as BUILT (kpm theme.css .kpm-shutter + .kpm-corners), on the real manifest
// paper (lab ?shell&terminal&many&promo, Indonesian): phone at rest, held down (CDP :active), Lite Mode, PC, and with a
// photo taken (a file set on the hidden #txProof input -> the app's own capture handler).
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 150000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable'); await send('Runtime.enable'); await send('DOM.enable'); await send('CSS.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', 'id'); } catch (e) {}` });
const out = {};
const shotBox = async (name, sel, pad = 18) => {
  const box = await ev(`(() => { const e = document.querySelector('${sel}'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: Math.max(0, r.x - ${pad}), y: Math.max(0, r.y - 40), width: r.width + ${pad * 2}, height: r.height + 64 }; })()`);
  if (!box) return null; await sleep(250);
  const b2 = await ev(`(() => { const r = document.querySelector('${sel}').getBoundingClientRect(); return { x: Math.max(0, r.x - ${pad}), y: Math.max(0, r.y - 40), width: r.width + ${pad * 2}, height: r.height + 64 }; })()`);
  const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...b2, scale: 1 } }); writeFileSync(`${DIR}${name}.png`, Buffer.from(r.result.data, 'base64')); return name;
};
const open = async (w, h, extra = '') => {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: w < 1024 });
  await send('Emulation.setTouchEmulationEnabled', { enabled: w < 1024, maxTouchPoints: 5 });
  await send('Page.navigate', { url: `http://localhost:4190/tools/ponder-lab.html?shell&terminal&many&promo${extra}` });
  await ev(`(async () => { for (let i = 0; i < 100 && !document.querySelector('[aria-label^="Manifest,"], [data-guide="photo"]'); i++) await new Promise((r) => setTimeout(r, 150)); })()`); await sleep(800);
  await ev(`document.querySelector('[aria-label^="Manifest,"]')?.click()`); await sleep(1000);
};
await open(375, 812);
out.style = await ev(`(() => { const e = document.querySelector('[data-guide="photo"]'); if (!e) return null; const s = getComputedStyle(e), a = getComputedStyle(e, '::after'); return { h: Math.round(e.getBoundingClientRect().height), bg: s.backgroundColor, color: s.color, corners: a.backgroundImage.split('linear-gradient').length - 1, word: getComputedStyle(e.querySelector('.kpm-shutter-word')).fontFamily.split(',')[0] }; })()`);
out.rest = await shotBox('built-phone', '[data-guide="photo"]');
const root = (await send('DOM.getDocument', { depth: 0 })).result.root.nodeId;
const node = (await send('DOM.querySelector', { nodeId: root, selector: '[data-guide="photo"]' })).result.nodeId;
await send('CSS.forcePseudoState', { nodeId: node, forcedPseudoClasses: ['active'] }); await sleep(300);
out.press = await shotBox('built-phone-press', '[data-guide="photo"]');
await send('CSS.forcePseudoState', { nodeId: node, forcedPseudoClasses: [] });
/* a photo taken: the app's own handler, through its hidden input (galleryOk tiers have it - the lab's &admin) */
await open(375, 812, '&admin');
const inp = (await send('DOM.querySelector', { nodeId: (await send('DOM.getDocument', { depth: 0 })).result.root.nodeId, selector: '#txProof' })).result.nodeId;
if (inp) {
  await send('DOM.setFileInputFiles', { nodeId: inp, files: [DIR + 'key-today.png'] });
  await ev(`(async () => { for (let i = 0; i < 60 && !document.querySelector('.kpm-photo img'); i++) await new Promise((r) => setTimeout(r, 100)); })()`); await sleep(400);
  out.photo = await shotBox('built-phone-photo', '.kpm-photo');
} else out.photo = 'no #txProof in this tier';
await open(375, 812, '&lite');
out.lite = await shotBox('built-phone-lite', '[data-guide="photo"]');
await open(1440, 900);
out.pc = await shotBox('built-pc', '[data-guide="photo"]', 30);
out.errors = errors.slice(0, 3);
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); process.exit(0);
