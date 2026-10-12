/* the tutorial book after the fix, walked with REAL presses (CDP mouse) in headless Chrome, lab ?book, nothing injected:
   X closes, the arrows turn, a card opens its tutorial, a ribbon shows its chapter on both pages, the press still shrinks. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const OUT = process.argv[2], W = Number(process.argv[3] || 1280), H = Number(process.argv[4] || 800);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(OUT, 'profile-fix'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9408', '--user-data-dir=' + prof, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9408/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); let errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EVAL ERROR ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300) : r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
const fresh = async () => { await send('Page.navigate', { url: 'http://localhost:4187/tools/ponder-lab.html?book&tab=restock_vault' }); await sleep(2200); };
const top = (sel) => js(`(() => { for (const b of document.querySelectorAll('[role=dialog] ${sel}')) { const q = b.getBoundingClientRect(); const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); if (e && b.contains(e)) return [q.left + q.width / 2, q.top + q.height / 2]; } return null; })()`);
const ribbonAt = (label) => js(`(() => { const b = [...document.querySelectorAll('[role=dialog] button')].find(x => x.style.clipPath && x.innerText.trim().toUpperCase() === ${JSON.stringify(label.toUpperCase())}); if (!b) return null; const q = b.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; })()`);
const down = async (p) => { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p[0], y: p[1] }); await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: p[0], y: p[1], button: 'left', buttons: 1, clickCount: 1 }); };
const up = (p) => send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p[0], y: p[1], button: 'left', clickCount: 1 });
const press = async (p) => { if (!p) return false; await down(p); await sleep(90); await up(p); return true; };
const bookOpen = () => js(`!!document.querySelector('[role=dialog][aria-label="Tutorial book"]')`);
const counter = () => js(`[...document.querySelectorAll('[role=dialog] span')].filter(s => /^\\d+ \\/ \\d+$/.test(s.innerText.trim())).filter(s => { const q = s.getBoundingClientRect(); const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return e && s.contains(e); }).map(s => s.innerText.trim()).join('|')`);
const pageAt = (fx) => js(`(() => { const st = document.querySelector('[role=dialog] [style*="perspective"]').getBoundingClientRect(); const e = document.elementFromPoint(st.left + st.width * ${'${fx}'}, st.top + st.height * 0.4); const f = e && e.closest('.overflow-hidden'); return f ? f.innerText.replace(/\\s+/g, ' ').trim().slice(0, 45) : 'BLANK'; })()`.replace('${fx}', fx));
const out = []; const ok = (name, pass, got) => out.push(`${pass ? 'PASS' : 'FAIL'} ${name} -> ${JSON.stringify(got)}`);

await fresh();
const s0 = { left: await pageAt(0.25), right: await pageAt(0.75), counter: await counter() };
ok('opens on the Restock chapter, both pages drawn', /RESTOCK VAULT/.test(s0.left) && /GOODS RECEIVED/.test(s0.right) && s0.counter === '2 / 17', s0);
const xp = await top('button[aria-label="Close"]'); await down(xp); await sleep(260);   /* past the 150 ms shrink */
const shrink = await js(`(() => { const b = [...document.querySelectorAll('[role=dialog] button[aria-label="Close"]')].find(b => b.matches(':active')); const s = b && b.firstElementChild; return s ? getComputedStyle(s).transform : 'no :active button'; })()`);
await sleep(200); await up(xp); await sleep(1400);
ok('the X still shrinks while held (on its inner layer)', /matrix\(0\.97/.test(String(shrink)), shrink);
ok('a real press on X closes the book', !(await bookOpen()), await bookOpen());
await fresh(); await press(await top('button[aria-label="Next page"]')); await sleep(1000);
ok('a real press on › turns the page', (await counter()) === '3 / 17', await counter());
await press(await top('button[aria-label="Previous page"]')); await sleep(1000);
ok('a real press on ‹ turns it back', (await counter()) === '2 / 17', await counter());
await fresh(); await press(await top('button:not([aria-label]):not([style*="polygon"])')); await sleep(1400);
ok('a real press on a card (Goods Received) opens its tutorial', !(await bookOpen()), { bookStillOpen: await bookOpen() });
await fresh(); await press(await ribbonAt('Vault')); await sleep(900);
const sv = { left: await pageAt(0.25), right: await pageAt(0.75), counter: await counter() };
ok('ribbon VAULT: the Vault chapter on the LEFT page, its cards on the right (no blank page)', /MASTER VAULT/.test(sv.left) && sv.right !== 'BLANK' && !/GOODS RECEIVED/.test(sv.right) && sv.counter === '4 / 17', sv);
await press(await ribbonAt('Agent')); await sleep(900);
const sa = { left: await pageAt(0.25), right: await pageAt(0.75), counter: await counter() };
ok('then ribbon AGENT: its chapter on both pages', sa.left !== 'BLANK' && sa.right !== 'BLANK' && !/MASTER VAULT/.test(sa.left), sa);
await press(await ribbonAt('Restock')); await sleep(900);
const sr = { left: await pageAt(0.25), right: await pageAt(0.75), counter: await counter() };
ok('and back to RESTOCK (backwards jump): both pages drawn', /RESTOCK VAULT/.test(sr.left) && /GOODS RECEIVED/.test(sr.right) && sr.counter === '2 / 17', sr);
await press(await top('button[aria-label="Next page"]')); await sleep(1000); await press(await ribbonAt('Vault')); await sleep(900);
const sn = { left: await pageAt(0.25), right: await pageAt(0.75), counter: await counter() };
ok('a turn, then a ribbon: still the right chapter on both pages', /MASTER VAULT/.test(sn.left) && sn.right !== 'BLANK' && sn.counter === '4 / 17', sn);
await press(await top('button[aria-label="Close"]')); await sleep(1400);
ok('and X closes after all that', !(await bookOpen()), await bookOpen());
await fresh(); await press(await ribbonAt('Vault')); await sleep(900);
const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, `book-vault-${W}.png`), Buffer.from(s.result.data, 'base64'));
ok('no page errors', errs.length === 0, errs);
console.log(`[${W}x${H}]\n` + out.join('\n'));
ws.close(); chrome.kill();
