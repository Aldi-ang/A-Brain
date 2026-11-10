/* What does the capybara cost while nobody touches the screen? OLD (a 10-frame sheet stepped by a CSS transform) against
   NEW (an animated WebP the browser plays itself), in the places he lives: the sales terminal's alcove (he + two blurred
   shadow copies, always on screen), the corner (one copy), and the corner while HIDDEN (off screen, opacity 0).
   Headless Chrome, no throttle: CPU seconds of the page's renderer + the graphics process per second of wall clock. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SECS = Number(process.env.SECS || 10);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9397',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', '--window-size=1366,768', 'about:blank'], { stdio: 'ignore' });
let ver;
for (let i = 0; i < 60 && !ver; i++) { await sleep(250); try { ver = await (await fetch('http://127.0.0.1:9397/json/version')).json(); } catch { /* not up yet */ } }
const open = async (url) => { const ws = new WebSocket(url); await new Promise((r) => ws.addEventListener('open', r)); let seq = 0; const wait = new Map();
  ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); } });
  return (method, params = {}) => new Promise((r) => { const id = ++seq; wait.set(id, r); ws.send(JSON.stringify({ id, method, params })); }); };
const browser = await open(ver.webSocketDebuggerUrl);
const list = await (await fetch('http://127.0.0.1:9397/json/list')).json();
const page = await open(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await page('Page.enable');
const cpu = async () => { const r = await browser('SystemInfo.getProcessInfo'); let t = 0; for (const p of r.result.processInfo) if (p.type === 'renderer' || p.type === 'GPU') t += p.cpuTime; return t; };
const VARIANTS = (process.env.ONLY || 'blank,old-alcove,new-alcove,old-corner,new-corner,old-hidden,new-hidden,blank').split(',');
const rows = [];
for (const v of VARIANTS) {
  await page('Page.navigate', { url: pathToFileURL(path.join(HERE, 'page.html')).href + '?' + v });
  await sleep(3000);
  const a = await cpu(); await sleep(SECS * 1000); const b = await cpu();
  const shot = await page('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 700, height: 300, scale: 1 } });
  if (shot.result?.data) fs.writeFileSync(path.join(HERE, 'shot-' + v + '.png'), Buffer.from(shot.result.data, 'base64'));
  rows.push([v, ((b - a) / SECS * 100).toFixed(1) + '% of one core']);
  console.log(rows[rows.length - 1].join('  '));
}
chrome.kill();
