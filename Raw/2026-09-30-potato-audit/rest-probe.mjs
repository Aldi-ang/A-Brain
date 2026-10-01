/* What runs on a screen while nobody touches it. Built app (prod + emulator) on :4175, emulator up.
   Per tab: DOM mutations by element + kind (+ attribute old -> new samples), rAF call sites, running CSS animations
   (visible or not), intervals, and main-frame rate. TABS="A|B" env picks screens; RATE=cpu throttle (default 6). */
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main';
const TABS = (process.env.TABS || 'Restock Vault|EOD Setoran|Agent Profile').split('|');
const RATE = Number(process.env.RATE || 6);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const prof = path.join(HERE, 'probe-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9381',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9381/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300) : r.result?.result?.value; };

const INSTR = `(() => {
  const P = window.__probe = { on: false, raf: {}, iv: [] };
  const site = () => { const l = (new Error().stack || '').split('\\n').slice(3).find(s => /assets\\//.test(s)) || ''; const m = l.match(/assets\\/([^:/]+):(\\d+):(\\d+)/); return m ? m[1] + ':' + m[2] + ':' + m[3] : 'other'; };
  const rAF = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => { if (!P.on) return rAF(cb); const k = site(); return rAF(t => { if (P.on) P.raf[k] = (P.raf[k] || 0) + 1; cb(t); }); };
  const sI = window.setInterval.bind(window);
  window.setInterval = (fn, ms, ...a) => { P.iv.push(ms + 'ms@' + site()); return sI(fn, ms, ...a); };
})()`;
await send('Page.enable'); await send('Runtime.enable'); await send('Performance.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: INSTR });
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

const PROBE = `(async () => {
  const key = t => { if (!t || t.nodeType !== 1) t = t && t.parentElement; if (!t) return '?'; const c = String(t.className && t.className.baseVal !== undefined ? t.className.baseVal : t.className || '').split(' ').filter(Boolean).slice(0, 3).join('.'); const p = t.parentElement; const pc = p ? String(p.className && p.className.baseVal !== undefined ? p.className.baseVal : p.className || '').split(' ').filter(Boolean).slice(0, 2).join('.') : ''; return p?.tagName.toLowerCase() + '.' + pc + ' > ' + t.tagName.toLowerCase() + '.' + c + (t.dataset?.ponder ? '[ponder=' + t.dataset.ponder + ']' : ''); };
  const muts = {}, samples = {};
  const mo = new MutationObserver(ms => { for (const m of ms) { const k = m.type + (m.attributeName ? ':' + m.attributeName : '') + ' @ ' + key(m.target); muts[k] = (muts[k] || 0) + 1;
    if (!samples[k]) samples[k] = []; if (samples[k].length < 2) samples[k].push(m.type === 'attributes' ? String(m.oldValue).slice(0, 80) + ' -> ' + String(m.target.getAttribute(m.attributeName)).slice(0, 80) : m.type === 'childList' ? '+' + [...m.addedNodes].map(n => n.nodeName).join(',') + ' -' + [...m.removedNodes].map(n => n.nodeName).join(',') : String(m.oldValue).slice(0, 40) + ' -> ' + String(m.target.data).slice(0, 40)); } });
  mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeOldValue: true, characterData: true, characterDataOldValue: true });
  window.__probe.raf = {}; window.__probe.on = true;
  await new Promise(r => setTimeout(r, 4000));
  window.__probe.on = false; mo.disconnect();
  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && getComputedStyle(el).visibility !== 'hidden'; };
  const anims = document.getAnimations().filter(a => a.playState === 'running').map(a => { const t = a.effect && a.effect.target; return (a.animationName || a.transitionProperty || a.constructor.name) + ' @ ' + key(t) + (t ? (vis(t) ? ' [VISIBLE]' : ' [hidden/offscreen]') : ''); });
  const top = o => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k, v]) => (v / 4).toFixed(1) + '/s ' + k);
  return JSON.stringify({ url: location.hash || location.pathname, muts: top(muts).map(s => { const k = s.replace(/^[0-9.]+\\/s /, ''); return s + '   e.g. ' + (samples[k] || []).join(' | '); }), raf: top(window.__probe.raf), anims: [...new Set(anims)].slice(0, 20), intervals: [...new Set(window.__probe.iv)] });
})()`;

async function tapTab(label) {
  return js(`(async () => { const b = [...document.querySelectorAll('button, a')].find(x => (x.getAttribute('aria-label') || x.textContent || '').trim() === ${JSON.stringify(label)}); if (!b) return 'no tab'; b.click(); return 'ok'; })()`);
}
for (const tab of TABS) {
  const t = await tapTab(tab);
  await sleep(9000);
  const m0 = Object.fromEntries((await send('Performance.getMetrics')).result.metrics.map(m => [m.name, m.value]));
  const p = await js(PROBE);
  const m1 = Object.fromEntries((await send('Performance.getMetrics')).result.metrics.map(m => [m.name, m.value]));
  const busy = Math.round(((m1.TaskDuration - m0.TaskDuration) / ((m1.Timestamp - m0.Timestamp))) * 100);
  console.log('=== ' + tab + ' (' + t + ') busy ' + busy + '% at ' + RATE + 'x');
  try { const o = JSON.parse(p); for (const [k, v] of Object.entries(o)) console.log('  ' + k + ': ' + (Array.isArray(v) ? '\n    ' + v.join('\n    ') : v)); } catch { console.log(p); }
}
ws.close(); chrome.kill();
