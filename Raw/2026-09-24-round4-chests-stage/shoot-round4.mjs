// Round 4 frames: the stage + gold bar, the warehouse chest closed on its PRESET tab, both chests closed in one row.
// Chrome DevTools protocol, same as A-Brain Raw/2026-09-24-van-loading-bay/shoot-bay.mjs.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), 'round4-shots');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = 'http://localhost:4190/tools/ponder-lab.html?shell&fleet';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9334',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9334/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 });
const shoot = async (name) => {
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const file = path.join(OUT, name + '.png');
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  return file;
};

await send('Page.enable');
/* three geofence requests for Budi, served to the screen's listener before it mounts */
await send('Page.addScriptToEvaluateOnNewDocument', { source: `globalThis.__labFixtures = { gps_bypasses: [
  { id: 'g1', salesmanName: 'Budi Santoso', storeName: 'Toko Sinar Jaya', status: 'PENDING', distance: 212, timestamp: '2026-09-24T10:40:00+07:00' },
  { id: 'g2', salesmanName: 'Budi Santoso', storeName: 'Warung Bu Tini', status: 'APPROVED', distance: 140, timestamp: '2026-09-23T15:05:00+07:00' },
  { id: 'g3', salesmanName: 'Budi Santoso', storeName: 'Toko Makmur', status: 'REJECTED', distance: 480, timestamp: '2026-09-22T09:12:00+07:00' } ] };` });

for (const [w, h] of [[1440, 900], [518, 1000]]) for (const light of [false, true]) {
  const tag = `${w}-${light ? 'light' : 'dark'}`;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(3500);
  await js(`document.documentElement.classList.toggle('light', ${light}); [...document.querySelectorAll('.kpm-actor')].find(a => a.querySelector('.kpm-actor-name')?.textContent.trim() === 'Budi Santoso')?.click(); true`);
  await sleep(1400);
  await js(`document.querySelector('.kpm-stage').scrollIntoView({ block: 'start' }); window.scrollBy(0, -70); true`);
  await sleep(500);
  console.log(await shoot(`1-stage-bar-${tag}`), await js(`(async () => JSON.stringify({ g: typeof globalThis.__labFixtures, keys: Object.keys((await import('/tools/lab-firestore-stub.js')).FIXTURES) }))()`));

  /* one line in the muatan by a real drag (3 Slop), then the warehouse chest closed and the line saved as the usual load */
  const pts = await js(`(async () => { document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); await new Promise(r => setTimeout(r, 300));
    const c = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    return { a: c(document.querySelector('.kpm-bay .gui.wh .slot.has:not(.out)')), b: c(document.querySelector('.kpm-bay .vanc .chest')) }; })()`);
  await mouse('mousePressed', ...pts.a);
  for (let i = 1; i <= 12; i++) await mouse('mouseMoved', pts.a[0] + (pts.b[0] - pts.a[0]) * i / 12, pts.a[1] + (pts.b[1] - pts.a[1]) * i / 12);
  await mouse('mouseReleased', ...pts.b);
  await sleep(700);
  await send('Input.insertText', { text: '3' });
  await js(`[...document.querySelectorAll('.kpm-bay-sheet .units .key')].find(b => b.textContent.startsWith('Slop'))?.click(); true`);
  await sleep(200);
  await js(`document.querySelector('.kpm-bay-sheet .ok')?.click(); true`);
  await sleep(1500);
  await js(`document.querySelector('.kpm-bay .whc').click(); true`);
  await sleep(600);
  await js(`[...document.querySelectorAll('.kpm-bay .slip .acts button')].find(b => /Simpan/.test(b.textContent))?.click(); true`);
  await sleep(500);
  /* his 12:50 TIM: one row per van, and "Salin" copies that van into this muatan */
  await js(`[...document.querySelectorAll('.kpm-bay .slip .tab')].find(t => /Tim/.test(t.textContent))?.click(); true`);
  await sleep(300);
  await js(`document.querySelector('.kpm-bay .slip .copy')?.click(); true`);
  await sleep(600);
  await js(`document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); window.scrollBy(0, -60); true`);
  await sleep(400);
  console.log(await shoot(`2-warehouse-closed-${tag}`), await js(`JSON.stringify({ rows: [...document.querySelectorAll('.kpm-bay .slip .rows li')].map(l => l.textContent), writes: (globalThis.__labWrites || []).map(x => Object.keys(x.data || {}).join()) })`));

  /* both closed: one short row, the van's GEOFENCE tab beside it */
  await js(`document.querySelector('.kpm-bay .vanc').click(); true`);
  await sleep(700);
  await js(`document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); window.scrollBy(0, -60); true`);
  await sleep(300);
  console.log(await shoot(`3-both-closed-${tag}`), await js(`JSON.stringify({ geo: [...document.querySelectorAll('.kpm-bay .slip.van .rows li')].map(l => l.textContent), bayH: Math.round(document.querySelector('.kpm-bay').getBoundingClientRect().height), queue: /Active HQ Override Requests/i.test(document.body.innerText) })`));
}
ws.close(); chrome.kill();
