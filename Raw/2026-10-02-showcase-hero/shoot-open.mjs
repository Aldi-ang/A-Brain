/* 2026-10-06 round 3 - the Karantina box with its doors OPEN (the still frame keeps them shut, so the packs in the slots never
   show on a board). Opens lab-showcase.html (written by shoot-showcase.mjs) at 390 and 1440, opens the doors, waits out the
   700 ms slide, measures each slot's pack inside its slot, frames the box. Output: kq-p.png, kq-d.png. Usage: node shoot-open.mjs */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(HERE, 'profile-kq'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9396', '--user-data-dir=' + prof, '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9396/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
for (const [w, h, dpr, mobile, tag] of [[390, 844, 2, true, 'p'], [1440, 900, 1, false, 'd']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
  await send('Page.navigate', { url: pathToFileURL(path.join(HERE, 'lab-showcase.html')).href + '#shot' });
  for (let i = 0; i < 60; i++) { await sleep(200); if (await js('document.readyState === "complete"')) break; }
  await js('document.fonts.ready.then(() => 1)');
  /* scroll FIRST and let the scene's observer run its doorsRun(true) - opening before it lands gets shut again (the first phone frame did) */
  await js(`document.getElementById('karantina').scrollIntoView({ block: 'start' }); 1`); await sleep(700);
  /* captureBeyondViewport resizes the page, its observer fires again and shuts them: pin the page's doorsRun to a no-op */
  await js(`doorsRun = () => {}; document.getElementById('doors').classList.remove('shut'); 1`); await sleep(1000);
  if (await js(`document.getElementById('doors').classList.contains('shut')`)) throw new Error('doors shut again at ' + w);
  const m = await js(`(() => { const out = []; document.querySelectorAll('.qgrid > i').forEach((s, i) => { const p = s.querySelector('.pk'); if (!p) return; const a = s.getBoundingClientRect(), b = p.getBoundingClientRect();
    out.push({ slot: i + 1, inside: b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom, w: Math.round(b.width), h: Math.round(b.height) }); });
    const q = document.querySelector('.qbox').getBoundingClientRect(); return { out, clip: { x: Math.round(q.left) - 12, y: Math.round(q.top + scrollY) - 12, width: Math.round(q.width) + 24, height: Math.round(q.height) + 64 } }; })()`);
  console.log(w, JSON.stringify(m.out));
  const f = path.join(HERE, `kq-${tag}.png`); fs.rmSync(f, { force: true });
  const s = await send('Page.captureScreenshot', { format: 'png', clip: { ...m.clip, scale: 1 }, captureBeyondViewport: false });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
}
/* the five round-3 scenes MOVE (an error-free page can still stand still): sample each one's state twice, 2.4 s apart, moving mode */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: pathToFileURL(path.join(HERE, 'lab-showcase.html')).href });
for (let i = 0; i < 60; i++) { await sleep(200); if (await js('document.readyState === "complete"')) break; }
const SNAP = { pelanggan: `$('#vlog').firstChild.textContent`, uang: `$('#arDay').textContent`, stok: `$('#stB').textContent`,
  catatan: `$$('#ledger .lg.wait').length + '/' + $('#deny').className`, keamanan: `$$('#tiers .tr').findIndex((t) => t.classList.contains('on')) + ' ' + $('#vtxt').textContent` };
let moved = 0;
for (const [id, e] of Object.entries(SNAP)) {
  await js(`document.getElementById('${id}').scrollIntoView({ block: 'start' }); 1`); await sleep(400);
  const a = await js(e); await sleep(2400); const b = await js(e);
  console.log(a !== b ? 'MOVES' : 'STILL', id, JSON.stringify(a), '->', JSON.stringify(b)); if (a !== b) moved++;
}
console.log(`${moved}/5 scenes move`);
ws.close(); chrome.kill(); process.exit(0);
