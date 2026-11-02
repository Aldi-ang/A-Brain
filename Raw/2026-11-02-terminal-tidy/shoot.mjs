// node shoot.mjs <tag> <width> <height> [query]   e.g. node shoot.mjs today 375 812
// His 2026-11-02 ask: erase the top customer box, fold the promo goods by default, a capture button that does not
// camouflage. Shoots three frames of the REAL terminal in the lab (Indonesian, the default): <tag>-<w>-top (the panel's
// first screen), -promo (the give box, centred), -photo (the handover-photo button, centred). Prints what each frame
// depends on, measured: customer openers, promo box height, the photo button's colours.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const [, , tag, w = '375', h = '812', query = 'shell&terminal&many&promo'] = process.argv;
const phone = +w < 1024;
const prof = `${DIR}prof-${tag}-${w}`; rmSync(prof, { recursive: true, force: true });
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log(JSON.stringify({ tag, error: 'watchdog: 60 s' })); chrome.kill(); process.exit(1); }, 60000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up yet */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text) : r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Browser.grantPermissions', { origin: 'http://localhost:4190', permissions: ['geolocation'] });
await send('Emulation.setGeolocationOverride', { latitude: -6.95, longitude: 107.70, accuracy: 8 });   /* ~9 km from every lab shop: no arrival sheet over the panel */
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 2, mobile: phone });
if (phone) {
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
}
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', 'id'); } catch (e) {}` });
await send('Page.navigate', { url: `http://localhost:4190/tools/ponder-lab.html?${query}` }); await sleep(6000);
const media = await ev(`matchMedia('(hover: none)').matches`);
/* phone: the manifest is a side panel - open it by its tab, the same press the thumb makes */
if (phone) { await ev(`document.querySelector('[aria-label^="Manifest,"]')?.click()`); await sleep(1200); }
const shot = async (name) => { const file = `${DIR}${name}.png`; rmSync(file, { force: true });
  const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(file, Buffer.from(r.result.data, 'base64')); return statSync(file).size; };
const out = { tag, w: +w, media, errors };
out.top = await shot(`${tag}-${w}-top`);
out.openers = await ev(`document.querySelectorAll('[aria-label="Choose customer"], [aria-label^="Customer:"]').length`);
out.bar = await ev(`!!document.querySelector('.manifest-dropdown-area.h-\\\\[52px\\\\]')`);
out.promoH = await ev(`(() => { const b = document.querySelector('[data-guide="promo-give"]'); if (!b) return null; b.scrollIntoView({ block: 'center' }); return Math.round(b.getBoundingClientRect().height); })()`);
await sleep(400); out.promo = await shot(`${tag}-${w}-promo`);
out.photo = await ev(`(() => { const b = document.querySelector('[data-guide="photo"]'); if (!b) return null; b.scrollIntoView({ block: 'center' });
  const s = getComputedStyle(b), t = getComputedStyle(b.querySelector('span') || b), p = getComputedStyle(b.parentElement.closest('.kpm-parchment') || document.body);
  return { bg: s.backgroundColor, border: s.borderStyle + ' ' + s.borderColor, ink: t.color, font: t.fontSize, h: Math.round(b.getBoundingClientRect().height), paper: p.backgroundColor }; })()`);
await sleep(400); out.photoShot = await shot(`${tag}-${w}-photo`);
/* the folded header (AFTER only): press it, measure the opened box, shoot it */
out.fold = await ev(`(() => { const h = document.querySelector('[data-guide="promo-give"] > button[aria-expanded]'); if (!h) return null; const was = h.getAttribute('aria-expanded'); h.click(); return was; })()`);
if (out.fold !== null) { await sleep(400);
  out.promoOpenH = await ev(`(() => { const b = document.querySelector('[data-guide="promo-give"]'); b.scrollIntoView({ block: 'center' }); return Math.round(b.getBoundingClientRect().height); })()`);
  await sleep(300); out.promoOpen = await shot(`${tag}-${w}-promo-open`); }
console.log(JSON.stringify(out));
ws.close(); chrome.kill();
