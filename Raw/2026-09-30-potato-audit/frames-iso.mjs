// The mascot sprite ALONE on a plain page, under the OLD stylesheet and the NEW one, every frame paused mid-step,
// at phone sharpness (DPR 2): a plain 200px box AND the phone's corner box (scale .64). Byte-equal PNGs = same look.
// Needs the prod-emu preview on 4175 with before.css copied into its folder. Usage: node frames-iso.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = 'C:/Users/ASUS/AppData/Local/Temp/kpm-prod-emu/assets';
const newCss = fs.readdirSync(ASSETS).filter(f => f.endsWith('.css')).map(f => [f, fs.statSync(path.join(ASSETS, f)).size]).sort((a, b) => b[1] - a[1])[0][0];
const SHEETS = { old: 'http://localhost:4175/before.css', new: 'http://localhost:4175/assets/' + newCss };
const KINDS = (process.env.KINDS || 'kpm-merch-talk:13:2400,kpm-merch-idle:10:3000').split(',').map(s => s.split(':'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const prof = path.join(HERE, 'iso-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9362', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9362/json/list')).json(); } catch { } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 420, height: 420, deviceScaleFactor: 2, mobile: true });
const res = { same: 0, diff: [], blank: 0 };
for (const [kind, n, dur] of KINDS) for (const box of ['plain', 'corner']) {
  const shots = {};
  for (const [tag, href] of Object.entries(SHEETS)) {
    await send('Page.navigate', { url: 'http://localhost:4175/sprites/' }); await sleep(600);
    await js(`(async () => { document.documentElement.innerHTML = '<head><link rel="stylesheet" href="${href}"></head><body style="margin:0;background:#1a1815"></body>';
      await new Promise(r => { const l = document.querySelector('link'); if (l.sheet) r(); l.onload = r; l.onerror = r; });
      const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:0;top:0;width:200px;height:200px';
      host.innerHTML = ${JSON.stringify(box)} === 'corner' ? '<div class="kpm-merch-corner"><div class="kpm-merch ${kind}" id="m"></div></div>' : '<div class="kpm-merch ${kind}" id="m" style="width:200px;height:200px"></div>';
      document.body.appendChild(host);
      await Promise.all([...document.images].map(i => i.decode?.()));
      const img = new Image(); img.src = '/sprites/${kind === 'kpm-merch-talk' ? 'merchant-talk' : 'merchant-idle'}.png'; await img.decode(); return 1; })()`);
    await sleep(400);
    shots[tag] = [];
    for (let k = 0; k < Number(n); k++) {
      await js(`(() => { document.getAnimations().forEach(a => { a.pause(); a.currentTime = ${(k + 0.5) * Number(dur) / Number(n)}; }); return document.getAnimations().length; })()`);
      await sleep(120);
      const s = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 200, height: 200, scale: 1 } });
      shots[tag].push(s.result.data);
      fs.mkdirSync(path.join(HERE, 'iso', tag), { recursive: true });
      fs.writeFileSync(path.join(HERE, 'iso', tag, `${kind}-${box}-${String(k).padStart(2, '0')}.png`), Buffer.from(s.result.data, 'base64'));
    }
  }
  for (let k = 0; k < shots.old.length; k++) {
    if (shots.old[k].length < 2000) res.blank++;
    if (shots.old[k] === shots.new[k]) res.same++; else res.diff.push(`${kind} ${box} frame ${k}`);
  }
}
console.log(JSON.stringify(res)); chrome.kill(); process.exit(0);
