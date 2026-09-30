// the BUILT enchanting-table row on Agent Inventory (?shell&agent&admin): the row at 1440 and 430, each chest's box above
// its own chest, the book opening in the air on hover (PC) / a held finger (phone), a press opening the day's book, Lite.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = 'http://localhost:4190/tools/ponder-lab.html?shell&agent&admin';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9353',
  '--user-data-dir=' + path.join(HERE, 'profile-a'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9353/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(), errors = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push('EVAL ' + JSON.stringify(r.result.exceptionDetails.exception?.description)); return r.result?.result?.value; };
const shoot = async (name, sel, pad = 6) => {
  const c = await js(`(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: Math.max(0, r.left - ${pad}), y: Math.max(0, r.top + scrollY - ${pad}), width: r.width + ${pad * 2}, height: r.height + ${pad * 2} }; })()`);
  const file = path.join(OUT, name + '.png'); fs.rmSync(file, { force: true });
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...c, scale: 1 }, captureBeyondViewport: true });
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64')); return name;
};
const row = () => js(`(() => { const c = (s) => { const e = document.querySelector(s); if (!e) return 'none'; const r = e.getBoundingClientRect(); return Math.round(r.left) + '-' + Math.round(r.right) + '@' + Math.round(r.top); };
  return 'van ' + c('.kpm-bay.solo .vanc') + ' | table ' + c('.kpm-bay.solo .tbl') + ' | crate ' + c('.kpm-bay.solo .qc') + ' / 3D chests ' + document.querySelectorAll('.kpm-bay.solo .kpm-c3').length + ' / book on table ' + !!document.querySelector('.kpm-bay.solo .tbl .kpm-ench .ebook') + ' / old shelf ' + !!document.querySelector('.kpm-shelf:not(.kpm-ench)'); })()`);
const over = (side) => js(`(() => { const g = document.querySelector('.kpm-bay.solo .gui.${side === 'q' ? 'q' : 'van'}'), c = document.querySelector('.kpm-bay.solo .${side === 'q' ? 'qc' : 'vanc'}'), t = document.querySelector('.kpm-bay.solo .tbl');
  const gr = g.getBoundingClientRect(), cr = c.getBoundingClientRect(), tr = t.getBoundingClientRect(), lid = getComputedStyle(c.querySelector('.lid3')).transform;
  return 'box ' + Math.round(gr.left) + '-' + Math.round(gr.right) + ' centre ' + Math.round(gr.left + gr.width / 2) + ' / its chest centre ' + Math.round(cr.left + cr.width / 2) + ' / table centre ' + Math.round(tr.left + tr.width / 2) + ' / lid ' + (lid === 'none' ? 'shut' : 'open'); })()`);

await send('Page.enable'); await send('Runtime.enable');
const out = [];
for (const [w, h, tag] of [[1440, 900, 'pc'], [430, 932, 'phone']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(4000);
  await js(`document.querySelector('.kpm-bay.solo').scrollIntoView({ block: 'center' }); true`); await sleep(500);
  out.push([tag, 'row', await row()]);
  await js(`document.querySelectorAll('.kpm-bay.solo .kpm-c3, .kpm-ench .float, .kpm-ench .ebyaw').forEach(e => e.getAnimations().forEach(a => { a.pause(); a.currentTime = 0; })); true`);
  await shoot(`${tag}-row`, '.kpm-bay.solo');
  await js(`document.getAnimations().forEach(a => { if (a.playState === 'paused') a.play(); }); true`);
  /* each chest's box above its own chest */
  await js(`document.querySelector('.kpm-bay.solo .vanc').click(); true`); await sleep(900);
  out.push([tag, 'van box', await over('van')]);
  await shoot(`${tag}-van-open`, '.kpm-bay.solo', 260);
  await js(`document.querySelector('.kpm-bay.solo .qc').click(); true`); await sleep(900);
  out.push([tag, 'crate box', await over('q')]);
  await js(`document.querySelector('.kpm-bay.solo .qc').click(); true`); await sleep(600);
  /* the book in the air: hover on the PC, a held finger on the phone */
  const b = await js(`(() => { const r = document.querySelector('.kpm-ench .kpm-nbBtn').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
  if (tag === 'pc') await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: b[0], y: b[1] });
  else await js(`document.querySelector('.kpm-ench .kpm-nbBtn').dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true })); true`);
  await sleep(1300);
  out.push([tag, tag === 'pc' ? 'hover' : 'hold', await js(`(() => { const e = document.querySelector('.kpm-ench'); return 'hold class ' + e.querySelector('.kpm-nbBtn').classList.contains('hold') + ', left cover ' + getComputedStyle(e.querySelector('.ebtilt .hl')).transform.slice(0, 40) + ', leaves flipping ' + [...e.querySelectorAll('.ebtilt .fl')].filter(f => f.getAnimations().length).length + ', glyphs ' + [...e.querySelectorAll('.glyphs i')].filter(g => g.getAnimations().length).length; })()`)]);
  await shoot(`${tag}-book-air`, '.kpm-ench', 30);
  if (tag === 'pc') await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5 });
  else await js(`document.querySelector('.kpm-ench .kpm-nbBtn').dispatchEvent(new PointerEvent('pointercancel', { pointerType: 'touch', bubbles: true })); true`);
  await sleep(800);
  /* a press opens the day's book as before */
  await js(`document.querySelector('.kpm-ench .kpm-nbBtn').click(); true`); await sleep(1500);
  out.push([tag, 'press', await js(`(() => { const o = document.querySelector('.kpm-ob'); return o ? 'open book: ' + o.className + ', tabs ' + [...o.querySelectorAll('.tab2')].map(t => t.textContent).join(' / ') : 'no book'; })()`)]);
  await js(`document.querySelector('.kpm-ob .close')?.click(); true`); await sleep(1300);
  /* Lite Mode: the table scene stands still */
  await js(`document.documentElement.classList.add('lite-mode'); true`); await sleep(100);
  out.push([tag, 'lite', await js(`'running animations in the row: ' + document.querySelector('.kpm-bay.solo').getAnimations({ subtree: true }).filter(a => a.playState === 'running').length`)]);
  await js(`document.documentElement.classList.remove('lite-mode'); true`);
}
out.push(['errors', errors.length ? errors.join(' || ') : 'none']);
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
