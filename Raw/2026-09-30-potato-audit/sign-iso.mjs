// The biohazard sign ALONE, old stylesheet (fill pulse, one svg) vs new (still black svg + green copy fading), at 12
// moments of the 3.6s pulse, DPR 2. Reports the worst pixel difference per moment. Needs the 4175 preview with
// before-sign.css in its folder, and the new build's css in assets/.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = 'C:/Users/ASUS/AppData/Local/Temp/kpm-prod-emu/assets';
const newCss = fs.readdirSync(ASSETS).filter(f => f.endsWith('.css')).map(f => [f, fs.statSync(path.join(ASSETS, f)).size]).sort((a, b) => b[1] - a[1])[0][0];
const { HAZARD_SIGN } = await import('file:///D:/APP%20DEVELOPMENT/kpm%20inventory%20main%20FILES/kpm-inventory-main/src/utils/vanBay.js');
const svg = `<svg viewBox="0 0 15 15" shape-rendering="crispEdges" aria-hidden="true">${HAZARD_SIGN.map(([x, y]) => `<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`).join('')}</svg>`;
const CASES = { old: ['http://localhost:4175/before-sign.css', svg], new: ['http://localhost:4175/assets/' + newCss, svg + svg] };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const prof = path.join(HERE, 'iso-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9363', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9363/json/list')).json(); } catch { } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 240, height: 240, deviceScaleFactor: 2, mobile: true });
const shots = {};
for (const [tag, [href, markup]] of Object.entries(CASES)) {
  await send('Page.navigate', { url: 'http://localhost:4175/sprites/' }); await sleep(600);
  await js(`(async () => { document.documentElement.innerHTML = '<head><link rel="stylesheet" href="${href}"></head><body style="margin:0;background:#c9a15a"></body>';
    await new Promise(r => { const l = document.querySelector('link'); if (l.sheet) r(); l.onload = r; });
    document.body.insertAdjacentHTML('beforeend', '<div class="kpm-c3" style="position:fixed;left:0;top:0;width:200px;height:200px"><span class="sign" style="left:0;top:0;width:200px;height:200px;transform:none">${markup.replace(/'/g, "\\'")}</span></div>'); return 1; })()`);
  await sleep(300);
  shots[tag] = [];
  for (let k = 0; k < 12; k++) {
    await js(`(() => { document.getAnimations().forEach(a => { a.pause(); a.currentTime = ${(k + 0.5) * 300}; }); return 1; })()`);
    await sleep(120);
    const s = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 200, height: 200, scale: 1 } });
    shots[tag].push('data:image/png;base64,' + s.result.data);
  }
}
/* decode both sets in the page and diff pixels */
const diff = await js(`(async () => { const load = (u) => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = u; });
  const px = (img) => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
  const A = ${JSON.stringify(shots.old)}, B = ${JSON.stringify(shots.new)}; const out = [];
  for (let k = 0; k < A.length; k++) { const a = px(await load(A[k])), b = px(await load(B[k])); let worst = 0, over8 = 0, green = 0;
    for (let i = 0; i < a.length; i += 4) { const d = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2])); if (d > worst) worst = d; if (d > 8) over8++; if (a[i + 1] > 60 && a[i] < 80) green++; }
    out.push({ t: ${0} + (k + 0.5) * 300, worst, over8, oldGreenPx: green }); }
  return out; })()`);
console.log(JSON.stringify(diff)); chrome.kill(); process.exit(0);
