// the BUILT Stock Opname Quarantine Vault (?shell&opname&admin): the crates at 1440 and 430, a crate swap frozen as the box
// grows out of the new crate (its transform-origin read against that crate's middle), a square picked with its three
// actions, the first action's modal opened (not submitted), the sunk capital following the crate, Lite Mode.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const URL_ = 'http://localhost:4190/tools/ponder-lab.html?shell&opname&admin';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9352',
  '--user-data-dir=' + path.join(HERE, 'profile-o'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9352/json/list')).json(); } catch { /* not up yet */ } }
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
  const c = await js(`(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: Math.max(0, r.left - ${pad}), y: r.top + scrollY - ${pad}, width: r.width + ${pad * 2}, height: r.height + ${pad * 2} }; })()`);
  const file = path.join(OUT, name + '.png'); fs.rmSync(file, { force: true });
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { ...c, scale: 1 }, captureBeyondViewport: true });
  fs.writeFileSync(file, Buffer.from(shot.result.data, 'base64')); return name;
};
const state = () => js(`(() => { const v = document.querySelector('.kpm-vault'); if (!v) return 'no vault';
  const crates = [...v.querySelectorAll('.crates .kpm-chest')].map(c => (c.classList.contains('on') ? '*' : '') + c.querySelector('.capt').innerText.replace(/\\n/g, ' '));
  const sunk = [...document.querySelectorAll('p')].find(p => /Sunk Capital/i.test(p.textContent))?.nextElementSibling?.textContent;
  return 'crates [' + crates.join(' | ') + '] / box "' + v.querySelector('.stl').textContent + '" ' + getComputedStyle(v.querySelector('.grid')).gridTemplateColumns.split(' ').length + ' a row / say "' + v.querySelector('.say').textContent + '" / sunk ' + sunk + ' / select left ' + document.querySelectorAll('select').length; })()`);

await send('Page.enable'); await send('Runtime.enable');
const out = [];
for (const [w, h, tag] of [[1440, 900, 'pc'], [430, 932, 'phone']]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Page.navigate', { url: URL_ });
  await sleep(3500);
  await js(`[...document.querySelectorAll('button')].find(b => b.textContent.trim().toUpperCase() === 'QUARANTINE').click(); true`); await sleep(1200);
  await js(`document.querySelector('.kpm-vault').scrollIntoView({ block: 'start' }); true`); await sleep(400);
  out.push([tag, 'open', await state()]);
  await shoot(`${tag}-vault`, '.kpm-vault');
  /* swap to another crate that is not open, frozen mid-growth */
  await js(`[...document.querySelectorAll('.kpm-vault .crates .kpm-chest')].find(c => !c.classList.contains('on')).click(); true`);
  await js(`new Promise(res => { const t0 = performance.now(); (function f() { if (performance.now() - t0 > 290) { document.getAnimations().forEach(a => a.pause()); res(1); } else requestAnimationFrame(f); })(); })`);
  out.push([tag, 'mid-growth', await js(`(() => { const h = document.querySelector('.kpm-vault .below'), c = document.querySelector('.kpm-vault .crates .kpm-chest.on'), hr = h.getBoundingClientRect(), cr = c.getBoundingClientRect();
    const a = h.getAnimations()[0]; a.pause(); const t = a.currentTime; a.cancel(); const hr2 = h.getBoundingClientRect();
    return 'anim at ' + Math.round(t) + ' ms; origin ' + h.style.transformOrigin + ' vs open crate middle ' + Math.round(cr.left + cr.width / 2 - hr2.left) + 'px'; })()`)]);
  await sleep(600);
  out.push([tag, 'after swap', await state()]);
  /* back to the crate with damage, pick a square */
  await js(`[...document.querySelectorAll('.kpm-vault .crates .kpm-chest')].find(c => !c.classList.contains('empty') && !c.classList.contains('on'))?.click(); true`); await sleep(900);
  await js(`document.querySelector('.kpm-vault .slot.has')?.click(); true`); await sleep(300);
  out.push([tag, 'picked', await js(`(() => { const s = document.querySelector('.kpm-vault .strip'); return s ? s.querySelector('.rn').textContent + ' / ' + [...s.querySelectorAll('button')].map(b => b.textContent.trim()).join(', ') : 'no strip'; })()`)]);
  await shoot(`${tag}-picked`, '.kpm-vault');
  await js(`document.querySelector('.kpm-vault .strip button').click(); true`); await sleep(500);
  out.push([tag, 'action', await js(`(() => { const m = [...document.querySelectorAll('input[name="qty"]')]; return m.length ? 'resolution modal open, qty max ' + m[0].max : 'no modal'; })()`)]);
  /* Lite Mode: a crate swap is instant */
  await send('Page.navigate', { url: URL_ }); await sleep(3500);
  await js(`[...document.querySelectorAll('button')].find(b => b.textContent.trim().toUpperCase() === 'QUARANTINE').click(); true`); await sleep(1200);
  await js(`document.documentElement.classList.add('lite-mode'); [...document.querySelectorAll('.kpm-vault .crates .kpm-chest')].find(c => !c.classList.contains('on')).click(); true`); await sleep(60);
  out.push([tag, 'lite', await js(`(() => { const h = document.querySelector('.kpm-vault .below'); return 'animations ' + h.getAnimations().length + ', box "' + document.querySelector('.kpm-vault .stl').textContent + '"'; })()`)]);
}
out.push(['errors', errors.length ? errors.join(' || ') : 'none']);
console.log(out.map(r => r.join(' | ')).join('\n'));
ws.close(); chrome.kill();
