/* fine probe of the tutorial book: what a press on X / next / a ribbon actually does, sampled every 100 ms. Lab ?book. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const OUT = process.argv[2], W = Number(process.argv[3] || 1280), H = Number(process.argv[4] || 800);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(OUT, 'profile-probe'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9405', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9405/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); let errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 300));
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errs.push('console: ' + JSON.stringify(d.params.args.map((a) => a.value ?? a.description)).slice(0, 300)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EVAL ERROR ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300) : r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 768 });

const MINI = `(() => { const dlg = document.querySelector('[role=dialog][aria-label="Tutorial book"]'); if (!dlg) return 'CLOSED';
  const book = dlg.children[1]; const bt = getComputedStyle(book).transform;
  const rib = [...dlg.querySelectorAll('button')].find(b => b.style.clipPath && b.style.transform.includes('translateX(8px)'));
  const cnt = [...dlg.querySelectorAll('span')].filter(s => /^\\d+ \\/ \\d+$/.test(s.innerText.trim())).map(s => { const q = s.getBoundingClientRect(); const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return e && s.contains(e) ? s.innerText.trim() : null; }).filter(Boolean);
  const stage = dlg.querySelector('[style*="perspective"]'); const r = stage.getBoundingClientRect();
  const L = document.elementFromPoint(r.left + r.width * 0.25, r.top + r.height * 0.4); const lf = L && L.closest('.overflow-hidden');
  const sheets = [...stage.querySelectorAll(':scope > div > div[style*="transform-origin"]')].map(s => Math.round(new DOMMatrix(getComputedStyle(s).transform).m11) + '/' + s.getAnimations().map(a => a.playState[0] + (a.effect.getKeyframes().map(k => (k.transform || '').match(/rotateY\\((-?\\d+)/)?.[1]).join('>'))).join(','));
  return { book: bt === 'none' ? 'flat' : bt.slice(0, 40), ribbon: rib && rib.innerText.trim(), counterSeen: cnt.join('|'), leftPage: lf ? lf.innerText.replace(/\\s+/g, ' ').slice(0, 30) : 'NOT A PAGE: ' + (L && L.tagName + '.' + String(L.className).slice(0, 30)), sheets: sheets.join(' ') }; })()`;
const btn = (aria) => js(`(() => { for (const b of document.querySelectorAll('[role=dialog] button[aria-label="${aria}"]')) { const q = b.getBoundingClientRect(); const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); if (e && b.contains(e)) return [Math.round(q.left + q.width / 2), Math.round(q.top + q.height / 2)]; } return null; })()`);
const ribbonAt = (label) => js(`(() => { const b = [...document.querySelectorAll('[role=dialog] button')].find(x => x.style.clipPath && x.innerText.trim().toUpperCase() === ${JSON.stringify(label.toUpperCase())}); if (!b) return null; const q = b.getBoundingClientRect(); return [Math.round(q.left + q.width / 2), Math.round(q.top + q.height / 2)]; })()`);
const click = async (p) => { if (!p) return 'NO TARGET'; await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p[0], y: p[1] }); await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: p[0], y: p[1], button: 'left', clickCount: 1 }); await sleep(50); await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p[0], y: p[1], button: 'left', clickCount: 1 }); return 'clicked ' + p; };
const samples = async (n, every = 150) => { const s = []; for (let i = 0; i < n; i++) { s.push(await js(MINI)); await sleep(every); } return s; };
const fresh = async () => { errs = []; await send('Page.navigate', { url: 'http://localhost:4187/tools/ponder-lab.html?book&tab=restock_vault' }); await sleep(2200); };
const show = (name, a, s) => console.log(`\n## ${name}\n  ${a}\n${s.map((x, i) => `  t${i}: ${JSON.stringify(x)}`).join('\n')}${errs.length ? '\n  ERRORS ' + JSON.stringify(errs) : ''}`);

for (const sc of (process.argv[5] || 'x,next,ribbon,ribnext').split(',')) {
  await fresh();
  if (sc === 'x') show('X once the book is open', await click(await btn('Close')), await samples(8));
  if (sc === 'next') show('Next page once the book is open', await click(await btn('Next page')), await samples(8));
  if (sc === 'ribbon') show('ribbon VAULT once the book is open', await click(await ribbonAt('Vault')), await samples(6));
  if (sc === 'ribnext') { const a = await click(await ribbonAt('Vault')); await sleep(900); show('ribbon VAULT, then Next page', a + ' / ' + await click(await btn('Next page')), await samples(8)); }
  if (sc === 'ribx') { const a = await click(await ribbonAt('Vault')); await sleep(900); show('ribbon VAULT, then X', a + ' / ' + await click(await btn('Close')), await samples(8)); }
  if (sc === 'nextrib') { const a = await click(await btn('Next page')); await sleep(150); show('Next, then ribbon VAULT 150 ms into the turn', a + ' / ' + await click(await ribbonAt('Vault')), await samples(8)); }
  if (sc === 'ribrib') { const a = await click(await ribbonAt('Vault')); await sleep(120); show('ribbon VAULT then AGENT 120 ms later', a + ' / ' + await click(await ribbonAt('Agent')), await samples(6)); }
  if (sc === 'ribprev') { const a = await click(await ribbonAt('Vault')); await sleep(900); show('ribbon VAULT, then Previous page', a + ' / ' + await click(await btn('Previous page')), await samples(8)); }
}
ws.close(); chrome.kill();
