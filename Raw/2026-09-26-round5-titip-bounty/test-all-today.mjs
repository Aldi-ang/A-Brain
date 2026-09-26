// His 09:45 "can u test it yourself": every ✅ TEST step from today, walked in the lab with the real screens and
// clicks, PASS / FAIL per step. Writes are recorded by the lab (window.__eodVerify / __eodReset / __labWrites /
// __eod), never sent anywhere. Real sign-in and real data stay his.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'test-all-shots');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9341',
  '--user-data-dir=' + path.join(OUT, 'profile'), '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9341/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shoot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(s.result.data, 'base64')); };
const tap = async (x, y) => { for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1 }); };
const center = (sel) => js(`(() => { const e = document.querySelector('${sel}'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()`);
const open = async (q, w, h) => {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768, hasTouch: w < 768 });
  await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?' + q }); await sleep(3800);
};
/* the dialog gate: type into its box (a prompt), then press its accept key - the one beside Cancel */
const gate = (text) => js(`(async () => { const c = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Cancel'); if (!c) return false;
  const box = c.closest('div').parentElement.querySelector('input[type=text]'); if (box && ${JSON.stringify(text ?? null)} !== null) box.value = ${JSON.stringify(text ?? '')};
  c.nextElementSibling.click(); await new Promise(r => setTimeout(r, 400)); return true; })()`);
const results = [];
const step = (name, pass, got) => { results.push({ name, pass: !!pass, got }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${got !== undefined ? '  ->  ' + (typeof got === 'string' ? got : JSON.stringify(got)) : ''}`); };
await send('Page.enable');

/* ── FLEET & ROSTER ─────────────────────────────────────────────────────────────────────────────── */
await open('shell&fleet', 1440, 900);
await js(`[...document.querySelectorAll('.kpm-actor')].find(a => a.querySelector('.kpm-actor-name')?.textContent.trim() === 'Budi Santoso')?.click(); true`); await sleep(1500);
await js(`document.querySelector('.kpm-bay').scrollIntoView({ block: 'start' }); window.scrollBy(0, -60); true`); await sleep(300);
const H = `Math.round(document.querySelector('.kpm-bay').getBoundingClientRect().height)`;
const h0 = await js(H), y0 = await js('Math.round(scrollY)');
await js(`document.querySelector('.kpm-bay .vanc').click(); true`); await sleep(700); const h1 = await js(H);
await js(`document.querySelector('.kpm-bay .whc').click(); true`); await sleep(700); const h2 = await js(H);
step('PC: open and close both chests - the page does not move', h0 === h1 && h1 === h2 && (await js('Math.round(scrollY)')) === y0, { open: h0, vanShut: h1, bothShut: h2 });
const gap = await js(`(() => { const b = document.querySelector('.kpm-bay').getBoundingClientRect(), m = document.querySelector('.kpm-bay-duo .man').getBoundingClientRect(); return { gap: Math.round(m.left - b.right), inside: !!document.querySelector('.kpm-bay .man') }; })()`);
step('PC: the muatan is its own card on the right, outside the bay', gap.gap >= 14 && !gap.inside, gap);
await js(`document.querySelector('.kpm-bay .vanc').click(); true`); await sleep(700);   // van open again? it was shut - reopen for the tabs test below
await js(`document.querySelector('.kpm-bay .vanc').click(); true`); await sleep(700);
const tabs = await js(`(async () => { const t = n => [...document.querySelectorAll('.kpm-bay .slip.van .tab')].find(x => x.textContent.startsWith(n)); const out = {};
  for (const n of ['Titip', 'Bounty']) { t(n)?.click(); await new Promise(r => setTimeout(r, 250)); out[n] = [...document.querySelectorAll('.kpm-bay .slip.van .rows li')].length; }
  out.pressable = document.querySelectorAll('.kpm-bay .slip.van .pane button').length; return out; })()`);
step('Round 5: TITIP and BOUNTY show behind the closed van chest, nothing on them presses', tabs.Titip > 0 && tabs.Bounty > 0 && tabs.pressable === 0, tabs);

await open('shell&fleet', 430, 930);
await js(`[...document.querySelectorAll('.kpm-actor')].find(a => a.querySelector('.kpm-actor-name')?.textContent.trim() === 'Budi Santoso')?.click(); true`); await sleep(1500);
const row = await js(`JSON.stringify({ wh: getComputedStyle(document.querySelector('.kpm-bay .gui.wh .grid')).gridTemplateColumns.split(' ').length, whSquares: document.querySelectorAll('.kpm-bay .gui.wh .grid .slot').length, van: getComputedStyle(document.querySelector('.kpm-bay .gui.van .grid')).gridTemplateColumns.split(' ').length })`);
step('Phone: 4 boxes in one row in both chests', /"wh":4,"whSquares":4,"van":4/.test(row), row);
await tap(...await center('.kpm-bay .gui.wh .slot.has:not(.out)')); await sleep(400);
const picked = await js(`!!document.querySelector('.kpm-bay .slot.picked') && document.querySelector('.kpm-bay').classList.contains('picking')`);
await tap(...await center('.kpm-bay .gui.van .slot:not(.has)')); await sleep(700);
const sheet = await js(`JSON.stringify({ sheet: !!document.querySelector('.kpm-bay-sheet'), writes: (globalThis.__labWrites || []).length })`);
step('Phone: tap a product (gold ring), tap an empty van box - the HOW MANY sheet opens, nothing written', picked && /"sheet":true,"writes":0/.test(sheet), { picked, sheet });
await js(`document.querySelector('.kpm-bay-scrim')?.click(); true`); await sleep(400);
const bar = await js(`(() => { const r = s => document.querySelector(s)?.getBoundingClientRect(); const a = [r('.kpm-stage-who'), r('.kpm-stage-chips'), r('.kpm-stage-counts'), r('.kpm-stage-acts')];
  let hit = 0; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) { const p = a[i], q = a[j]; if (p && q && p.left < q.right && q.left < p.right && p.top < q.bottom && q.top < p.bottom) hit++; } return hit; })()`);
step('Phone: the gold bar has nothing on top of anything', bar === 0, { overlaps: bar });
/* a real finger: touch emulation on, a 300 px drag left across the stage, then another */
await send('Emulation.setTouchEmulationEnabled', { enabled: true });
await send('Page.reload'); await sleep(3800);
const sg = await js(`(() => { const st = document.querySelector('.kpm-stage'); st.scrollIntoView({ block: 'center' }); const r = st.getBoundingClientRect(); return { y: Math.round(r.top + r.height / 2), x: Math.round(r.left + r.width * 0.85) }; })()`);
const middleCard = `(() => { const st = document.querySelector('.kpm-stage'), mid = st.getBoundingClientRect().left + st.clientWidth / 2; let best = -1, d = 1e9;
  [...st.querySelectorAll('.kpm-actor')].forEach((c, i) => { const r = c.getBoundingClientRect(), dd = Math.abs(r.left + r.width / 2 - mid); if (dd < d) { d = dd; best = i; } }); return best; })()`;
const drag = async () => { const t = (type, x) => send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y: sg.y }] });
  await t('touchStart', sg.x); for (let i = 1; i <= 10; i++) { await t('touchMove', sg.x - i * 30); await sleep(16); } await t('touchEnd'); await sleep(1200); };
const c0 = await js(middleCard); await drag(); const c1 = await js(middleCard); await drag(); const c2 = await js(middleCard);
step('Phone: a long swipe on the roster moves exactly one person (two swipes, two people)', c1 === c0 + 1 && c2 === c1 + 1, { start: c0, afterOne: c1, afterTwo: c2 });
await send('Emulation.setTouchEmulationEnabled', { enabled: false });

/* ── AGENT INVENTORY ────────────────────────────────────────────────────────────────────────────── */
await open('shell&agent', 430, 930);
const sale = await js(`(async () => { const b = [...document.querySelectorAll('button[aria-expanded]')].find(x => /Warung Bu Sri/i.test(x.textContent)); if (!b) return null; b.scrollIntoView({ block: 'center' }); b.click();
  await new Promise(r => setTimeout(r, 400)); return [...b.nextElementSibling.querySelectorAll('li')].map(l => l.innerText.replace(/\\s+/g, ' ')); })()`);
step('Agent inventory: tap a sale - it opens to its products and rupiah', Array.isArray(sale) && sale.length === 2 && /Rp 550\.000/.test(sale[0]), sale);

/* ── EOD, THE SALESMAN: BACK + DRAFT ────────────────────────────────────────────────────────────── */
await open('shell&eod', 430, 930);
await js(`localStorage.clear(); true`); await send('Page.reload'); await sleep(3800);
/* wait for the count box to exist before typing - a heavier page after many screens can still be mounting */
await js(`(async () => { for (let i = 0; i < 40 && !document.querySelector('input[inputmode="numeric"]:not([disabled])'); i++) await new Promise(r => setTimeout(r, 150)); return true; })()`);
await js(`(() => { const i = document.querySelector('input[inputmode="numeric"]:not([disabled])'); i.scrollIntoView({ block: 'center' }); i.focus(); return true; })()`);
await send('Input.insertText', { text: '150000' }); await sleep(300);
const btn = (re) => js(`(() => { const b = [...document.querySelectorAll('button')].find(x => ${re}.test(x.textContent) && !x.disabled); if (!b) return false; b.scrollIntoView({ block: 'center' }); b.click(); return true; })()`);
await btn('/in the letter/'); await sleep(1200); await btn('/← Back$/'); await sleep(900);
const back = await js(`document.querySelector('input[inputmode="numeric"]:not([disabled])')?.value`);
step('EOD salesman: count Cash, put it in, press Back - Cash comes back with the number', back === '150000', back);
await btn('/in the letter/'); await sleep(1200);
await open('shell&agent', 430, 930); await open('shell&eod', 430, 930);   // leave for another screen, come back
const kept = await js(`JSON.stringify({ top: [...document.querySelectorAll('button')].map(b => b.textContent.trim()).find(t => /Check all|in the letter|Enter what/.test(t)), cash: /Cash[\\s\\S]{0,40}Rp\\s150\\.000/.test(document.body.innerText) })`);
step('EOD salesman: go to another screen and come back - the count is still there', /"cash":true/.test(kept) && /Check all/.test(kept), kept);

/* ── EOD, THE SALESMAN: HIS LATE NIGHT ──────────────────────────────────────────────────────────── */
await open('shell&eod&late', 430, 930);
const late = await js(`(() => { const p = document.querySelector('[aria-label="Your late EOD"]'); return p ? { text: p.innerText.replace(/\\s+/g, ' '), buttons: p.querySelectorAll('button').length } : null; })()`);
step('EOD salesman: LATE EOD at the top with the date, the part sent back in red with the reason, nothing to press',
     late && /FRI 25 SEP/i.test(late.text) && /Stock back 1 Bks kurang SENT BACK/i.test(late.text) && late.buttons === 0, late);
await js(`document.querySelector('[aria-label="Your late EOD"]').scrollIntoView({ block: 'start' }); window.scrollBy(0, -90); true`); await sleep(300); await shoot('salesman-late-430');

/* ── EOD, THE BOSS ──────────────────────────────────────────────────────────────────────────────── */
await open('shell&eod&admin', 1440, 1000);
await js(`[...document.querySelectorAll('.pc-head')].forEach(h => h.click()); true`); await sleep(900);
const cards = await js(`JSON.stringify([...document.querySelectorAll('.pc')].map(c => { const parts = [...c.querySelectorAll('.pc-line')].filter(l => !l.closest('[aria-label="Bounty payback"]')).map(l => l.querySelector('.kpm-led-line').textContent);
  return { late: !!c.closest('[aria-label="Late EOD"]'), doubles: parts.length - new Set(parts).size, closed: [...c.querySelectorAll('.pc-head p')].map(p => p.textContent).find(t => /Closed/.test(t)),
    diode: c.querySelector('.pc-head .kpm-led-line')?.textContent, revenue: [...c.querySelectorAll('.pc-body span')].find(s => /Revenue/.test(s.textContent))?.nextElementSibling?.textContent,
    payback: !!c.querySelector('[aria-label="Bounty payback"]') }; }))`);
const C = JSON.parse(cards);
step('EOD boss: one card per night, no doubled lines', C.length === 2 && C.every(c => c.doubles === 0), C.map(c => ({ late: c.late, doubles: c.doubles })));
step('EOD boss: the older night sits in LATE EOD with its date', C.some(c => c.late && /Fri 25 Sep/.test(c.closed)), C.map(c => c.closed));
step('EOD boss: the bounty payment is its own BOUNTY PAYBACK plate; Revenue tonight leaves it out; the light is not "short count"',
     C.some(c => !c.late && c.payback && /1\.675\.000/.test(c.revenue) && !/short count/i.test(c.diode)), C.filter(c => !c.late).map(c => ({ revenue: c.revenue, diode: c.diode, payback: c.payback })));
/* send the late night's cash back with a reason, then press the plate */
const lateCard = `[aria-label="Late EOD"] .pc`;
await js(`document.querySelector('${lateCard} [aria-label="send Cash back"]').scrollIntoView({ block: 'center' }); document.querySelector('${lateCard} [aria-label="send Cash back"]').click(); true`); await sleep(500);
await gate('uang kurang 5000'); await sleep(300);
await js(`[...document.querySelectorAll('${lateCard} button')].find(b => /Return 1/.test(b.textContent))?.click(); true`); await sleep(600);
await gate(); await sleep(800);
const v = await js(`JSON.stringify(window.__eodVerify || [])`);
step('EOD boss: send the late cash back with a reason - only that report, only that part, the reason carried', /"id":"e6"[^}]*"reject":\{"cash":"uang kurang 5000"\}/.test(v), v);
/* approve only the bounty payback */
await js(`(() => { const p = document.querySelector('[aria-label="Bounty payback"]'); p.scrollIntoView({ block: 'center' }); p.querySelector('[aria-label="approve Bounty"]').click(); return true; })()`); await sleep(300);
await js(`[...document.querySelectorAll('.pc')].find(c => c.querySelector('[aria-label="Bounty payback"]')).querySelectorAll('button').forEach(b => { if (/Approve checked \\(1\\)|Approve short \\(1\\)/.test(b.textContent)) b.click(); }); true`); await sleep(600);
await gate(); await sleep(800);
const v2 = await js(`JSON.stringify((window.__eodVerify || []).filter(x => x.id === 'e7'))`);
step('EOD boss: tick the bounty payback and approve - the payment report alone is approved', /"id":"e7"[^}]*"approve":\["bounty"\]/.test(v2), v2);
/* reset tonight's night: the bounty payment must survive */
await js(`[...document.querySelectorAll('.pc')].find(c => c.querySelector('[aria-label="Bounty payback"]')).querySelectorAll('button').forEach(b => { if (/Reset the night/.test(b.textContent)) b.click(); }); true`); await sleep(500);
await gate(); await sleep(900);
const rs = await js(`JSON.stringify(window.__eodReset || [])`);
step('EOD boss: Reset the night deletes the night (cash & stock, stamps) and leaves the bounty payment', /"e1"/.test(rs) && /"e2"/.test(rs) && !/"e7"/.test(rs), rs);

fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));
console.log(`\n${results.filter(r => r.pass).length} / ${results.length} steps pass`);
ws.close(); chrome.kill();
