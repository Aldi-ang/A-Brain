// Round 5 frames: the van chest closed on its TITIP and BOUNTY tabs, then both chests closed (three tabs in the short row).
// Same Chrome DevTools harness as Raw/2026-09-24-round4-chests-stage/shoot-round4.mjs. The geofence rows are seeded
// through globalThis.__labFixtures before the page runs (the screen LISTENS for those); the titip and bounty rows are
// not listened for - they arrive as props (transactions, customers, the person's own record), so they live in
// tools/ponder-lab.jsx beside the ?shell&fleet mount (LAB_FLEET_TITIP, LAB_FLEET_CUSTOMERS, Budi's cukaiDebts).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* fileURLToPath, not URL.pathname: the vault path has spaces, and pathname keeps them as %20 - the first run wrote
   every frame into a stray D:/APP%20DEVELOPMENT/... tree */
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'round5-shots');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = 'http://localhost:4190/tools/ponder-lab.html?shell&fleet';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9335',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9335/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shoot = async (name) => {
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const file = path.join(OUT, name + '.png');
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64'));
  return file;
};
/* what the van slip shows, and whether anything spills past its edge */
const probe = `JSON.stringify({
  tabs: [...document.querySelectorAll('.kpm-bay .slip.van .tab')].map(t => t.textContent + (t.classList.contains('on') ? '*' : '')),
  rows: [...document.querySelectorAll('.kpm-bay .slip.van .rows li')].map(l => l.innerText.replace(/\\s+/g, ' ')),
  note: document.querySelector('.kpm-bay .slip.van .note')?.textContent || null,
  spill: [...document.querySelectorAll('.kpm-bay .slip.van, .kpm-bay .slip.van .rows li')].filter(e => e.scrollWidth > e.clientWidth + 1).length,
  pageSpill: document.documentElement.scrollWidth > window.innerWidth,
  writes: (globalThis.__labWrites || []).length })`;
const tab = (re) => js(`[...document.querySelectorAll('.kpm-bay .slip.van .tab')].find(t => ${re}.test(t.textContent))?.click(); true`);
const frame = () => js(`document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); window.scrollBy(0, -60); true`);

await send('Page.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: `globalThis.__labFixtures = { gps_bypasses: [
  { id: 'g1', salesmanName: 'Budi Santoso', storeName: 'Toko Sinar Jaya', status: 'PENDING', distance: 212, timestamp: '2026-09-24T10:40:00+07:00' },
  { id: 'g2', salesmanName: 'Budi Santoso', storeName: 'Warung Bu Tini', status: 'APPROVED', distance: 140, timestamp: '2026-09-23T15:05:00+07:00' } ] };` });

for (const [w, h] of [[1440, 900], [518, 1000]]) for (const light of [false, true]) {
  const tag = `${w}-${light ? 'light' : 'dark'}`;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(3500);
  await js(`document.documentElement.classList.toggle('light', ${light}); [...document.querySelectorAll('.kpm-actor')].find(a => a.querySelector('.kpm-actor-name')?.textContent.trim() === 'Budi Santoso')?.click(); true`);
  await sleep(1400);

  /* the van chest closed: TITIP, then BOUNTY */
  await js(`document.querySelector('.kpm-bay .vanc').click(); true`);
  await sleep(700);
  await tab('/Titip/'); await sleep(300); await frame(); await sleep(300);
  console.log(await shoot(`1-van-titip-${tag}`), await js(probe));
  await tab('/Bounty/'); await sleep(300); await frame(); await sleep(300);
  console.log(await shoot(`2-van-bounty-${tag}`), await js(probe));

  /* both closed: the short row, three tabs beside the van chest */
  await js(`document.querySelector('.kpm-bay .whc').click(); true`);
  await sleep(700);
  await tab('/Titip/'); await sleep(300); await frame(); await sleep(300);
  console.log(await shoot(`3-both-closed-titip-${tag}`), await js(probe));
}
ws.close(); chrome.kill();
