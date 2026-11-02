// node shoot-look.mjs <width> <height>  -> look-<w>-vault.png (Master Vault card of "CELLO GREEN 16 · RUSAK") + look-<w>-terminal.png
// His 2026-11-02 "make sure that the converted product have the same 3D design of that type but of course with biohazard
// symbol somewhere on the cards or product icon". Prints every biohazard mark on screen (x, y, size).
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const [, , w = '1440', h = '900'] = process.argv;
const phone = +w < 1024;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function page(query, name, steps) {
  const prof = `${DIR}prof-look-${name}-${w}`; rmSync(prof, { recursive: true, force: true });
  const port = 9300 + Math.floor(Math.random() * 500);
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank']);
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
  await send('Emulation.setGeolocationOverride', { latitude: -6.95, longitude: 107.70, accuracy: 8 });
  await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 2, mobile: phone });
  if (phone) {
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }] });
  }
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', 'id'); } catch (e) {}` });
  await send('Page.navigate', { url: `http://localhost:4190/tools/ponder-lab.html?${query}` }); await sleep(6000);
  for (const s of steps) { await ev(s); await sleep(900); }
  const marks = await ev(`[...document.querySelectorAll('[aria-label="Damaged pack"]')].map((m) => { const r = m.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width)]; })`);
  const file = `${DIR}look-${w}-${name}.png`; rmSync(file, { force: true });
  const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(file, Buffer.from(r.result.data, 'base64'));
  ws.close(); chrome.kill();
  return { name, marks, errors: errors.slice(0, 2), bytes: statSync(file).size };
}
const rusak = `(() => { const row = [...document.querySelectorAll('div, button')].filter((x) => /CELLO GREEN 16 · RUSAK/i.test(x.innerText || '') && (x.innerText || '').length < 120).pop(); if (row) { row.scrollIntoView({ block: 'center' }); row.click(); } return !!row; })()`;
const out = [await page('shell&vaultlist&tab=promo', 'vault', [rusak])];
out.push(await page('shell&terminal&many&promo', 'terminal', [
  ...(phone ? [`document.querySelector('[aria-label^="Manifest,"]')?.click()`] : []),
  `document.querySelector('[data-guide="promo-give"] > button[aria-expanded]')?.click()`,
  `document.querySelector('[data-guide="promo-give"]')?.scrollIntoView({ block: 'center' })`]));
console.log(JSON.stringify({ w, out }));
