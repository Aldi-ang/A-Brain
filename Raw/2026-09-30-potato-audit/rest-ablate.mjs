/* Switch-off test: per screen, busy % at rest with one thing switched off at a time. Built app (prod + emulator) on
   :4175, emulator up. TABS="A|B" env picks screens; RATE=cpu throttle (default 6). */
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main';
const TABS = (process.env.TABS || 'EOD Setoran|Agent Profile|Restock Vault').split('|');
const RATE = Number(process.env.RATE || 6);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const prof = path.join(HERE, 'ablate-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9382',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9382/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300) : r.result?.result?.value; };
const metrics = async () => Object.fromEntries((await send('Performance.getMetrics')).result.metrics.map(m => [m.name, m.value]));
const busy = async (ms = 4000) => { const a = await metrics(); await sleep(ms); const b = await metrics(); return Math.round((b.TaskDuration - a.TaskDuration) / (b.Timestamp - a.Timestamp) * 100); };

await send('Page.enable'); await send('Runtime.enable'); await send('Performance.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Page.navigate', { url: 'http://localhost:4175/' });
await sleep(8000);
const uid = await js(`(async () => { const h = window.__kpmEmulatorAuth; const c = await h.signIn(h.auth, h.credential(JSON.stringify({ sub: 'potato', email: 'adikaryasukses99@gmail.com', email_verified: true, name: 'Lab Owner' }))); return c.user.uid; })()`);
execSync(`node tools/seed-emulator.mjs --uid ${uid}`, { cwd: REPO, stdio: 'ignore' });
await send('Page.reload'); await sleep(9000);
await js(`(() => { const i = document.querySelector('input[placeholder="MASTER PASSWORD"]'); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, 'Emulator-1!'); i.dispatchEvent(new Event('input', { bubbles: true })); [...document.querySelectorAll('button[type="submit"]')].find(b => /vault/i.test(b.textContent)).click(); return 1; })()`);
await sleep(14000);
await send('Emulation.setCPUThrottlingRate', { rate: RATE });

const all = sel => `document.querySelectorAll(${JSON.stringify(sel)})`;
const V = [
  ['as is', '', ''],
  ['all CSS animations paused', `window.__pa = document.getAnimations().filter(a => a.playState === 'running'); __pa.forEach(a => a.pause())`, `__pa.forEach(a => a.play())`],
  ['SVG SMIL paused', `${all('svg')}.forEach(s => s.pauseAnimations && s.pauseAnimations())`, `${all('svg')}.forEach(s => s.unpauseAnimations && s.unpauseAnimations())`],
  ['merchant hidden', `${all('.kpm-merch-corner')}.forEach(e => e.style.display = 'none')`, `${all('.kpm-merch-corner')}.forEach(e => e.style.display = '')`],
  ['edge ribbon hidden', `${all('.kpm-edge-ribbon')}.forEach(e => e.style.display = 'none')`, `${all('.kpm-edge-ribbon')}.forEach(e => e.style.display = '')`],
  ['main hidden', `${all('main')}.forEach(e => e.style.visibility = 'hidden')`, `${all('main')}.forEach(e => e.style.visibility = '')`],
];
const INV = `JSON.stringify({
  smil: document.querySelectorAll('animate, animateTransform, animateMotion, set').length,
  anim_imgs: [...document.images].filter(i => /\\.(gif|webp|apng)/i.test(i.currentSrc)).map(i => i.currentSrc.split('/').pop()),
  video: document.querySelectorAll('video').length,
  canvas: [...document.querySelectorAll('canvas')].map(c => c.width + 'x' + c.height),
  filtered: [...document.querySelectorAll('*')].filter(e => { const s = getComputedStyle(e); return (s.backdropFilter && s.backdropFilter !== 'none') || (s.filter && s.filter !== 'none'); }).map(e => e.tagName.toLowerCase() + '.' + String(e.className.baseVal ?? e.className).split(' ').slice(0, 2).join('.')).slice(0, 8),
  main: document.querySelectorAll('main').length,
  running: document.getAnimations().filter(a => a.playState === 'running').map(a => a.animationName || a.transitionProperty).join(',')
})`;
for (const tab of TABS) {
  await js(`(() => { const b = [...document.querySelectorAll('button, a')].find(x => (x.getAttribute('aria-label') || x.textContent || '').trim() === ${JSON.stringify(tab)}); if (b) b.click(); return 1; })()`);
  await sleep(9000);
  console.log('=== ' + tab + ' ' + await js(INV));
  for (const [name, on, off] of V) {
    if (on) await js(`(() => { ${on}; return 1; })()`);
    await sleep(600); const b = await busy();
    if (off) await js(`(() => { ${off}; return 1; })()`);
    console.log('  ' + String(b).padStart(3) + '%  ' + name); await sleep(600);
  }
}
ws.close(); chrome.kill();
