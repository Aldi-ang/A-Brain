/* 2026-10-05 21:10 - the Day Replay in FULLSCREEN, his look A ("A - thin bottom bar"), BUILT in kpm (DayReplayPanel `full`,
   ExpeditionMini's Replay key + swap). Driven on the production lab build (kpm dist-ponderlab/, `npx vite build --config
   tools/ponder-lab.config.mjs`) with REAL presses at 1440 and at 390 with the touch media. Frames frozen through the
   replay's own clock. Checks -> results-fs.json; frames fs3-*.png (deleted before each shot). Usage: node walk-fullscreen.mjs */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '../../../kpm-inventory-main'), DIST = path.join(SRC, 'dist-ponderlab');
const newest = (dir) => fs.readdirSync(dir, { recursive: true }).filter((f) => /\.(jsx?|css)$/.test(f)).reduce((m, f) => Math.max(m, fs.statSync(path.join(dir, f)).mtimeMs), 0);
if (Math.max(newest(path.join(SRC, 'src')), newest(path.join(SRC, 'tools'))) > fs.statSync(path.join(DIST, 'tools/ponder-lab.html')).mtimeMs) { console.log('STALE LAB BUNDLE - build first'); process.exit(1); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => { const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); }); }).listen(4215);
const prof = path.join(HERE, 'profile-walk'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9415', '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9415/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(), errs = [];
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 200)); });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 200)); return r.result?.result?.value; };
const shot = async (file) => { const f = path.join(HERE, file); fs.rmSync(f, { force: true }); const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); console.log('shot', file); };
const waitFor = async (e, ms = 20000) => { for (let t = 0; t < ms; t += 150) { if (await js(e)) return true; await sleep(150); } return false; };
const results = []; const ok = (name, pass, data) => { results.push({ name, pass: !!pass, data }); console.log(pass ? 'PASS' : 'FAIL', name, data !== undefined ? JSON.stringify(data).slice(0, 260) : ''); };
const FIND = (sel, re) => `[...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => ${re || '/^/'}.test(x.textContent) && x.getClientRects().length)`;
const at = (sel, re) => js(`(() => { const e = ${FIND(sel, re)}; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
let phone = false;
const pressAt = async (c) => { await sleep(120);
  if (phone) { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
  else for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
  await sleep(700); };
const press = async (sel, re) => { const c = await at(sel, re); if (!c) throw new Error('no ' + sel + ' ' + re); await pressAt(c); };
/* the element a finger lands on at the centre of `sel` - 'top' when it is the element itself (nothing draws over it) */
const top = (sel, re) => js(`(() => { const e = ${FIND(sel, re)}; if (!e) return 'missing'; const b = e.getBoundingClientRect(); const h = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return h && (e === h || e.contains(h)) ? 'top' : String(h?.className?.baseVal ?? h?.className ?? h?.tagName); })()`);
const RP = `document.querySelector('.kx-rp').__rp`;
const ready = () => waitFor(`(() => { const rp = document.querySelector('.kx-rp')?.__rp; return !!rp && rp.logs !== null; })()`, 10000);
const freeze = async (k, ms) => { const r = await js(`(() => { const rp = ${RP}; const want = rp.tl.sceneSeg(${k}).t0 + ${ms}; rp.seek(want, false); return Math.abs(rp.t.current - want) < 1; })()`); if (!r) throw new Error('seek did not take'); await sleep(500); };
const load = async () => {
  await send('Page.navigate', { url: 'about:blank' }); await sleep(100);
  await js(`try { localStorage.clear() } catch {} 1`);
  await send('Page.navigate', { url: 'http://localhost:4215/tools/ponder-lab.html?shell&journey&exp&admin' });
  await waitFor('!!document.querySelector(".kx-map .leaflet-marker-icon")', 25000); await sleep(1500);
};
const SWAP = `(() => { const rp = document.querySelector('.kx-rp')?.__rp; if (!rp) return { noPanel: [...document.querySelectorAll('[class*="kx-rp"]')].map((e) => e.className).slice(0, 6) }; return { sel: document.querySelector('.kx-mini .kx-mrow.sel span, .kx-mchips button.sel')?.textContent || null, tag: document.querySelector('.kx-rp-man .tag')?.textContent || null,
  empty: document.querySelector('.kx-rp-fs .kx-empty')?.textContent || null, t: Math.round(rp.t.current), playing: rp.playing, card: !!document.querySelector('.kx-rp-card'), bar: !!document.querySelector('.kx-rp-fs') }; })()`;
const chestAt = (name) => js(`(() => { const e = [...document.querySelectorAll('.kx-rp-mk')].find((x) => x.querySelector('.kx-snm i')?.textContent === ${JSON.stringify(name)}); if (!e) return null; const b = e.querySelector('.art').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
const TICKS = { sold: 'rgb(228, 176, 74)', order: 'rgb(228, 176, 74)', issue: 'rgb(224, 88, 58)', swap: 'rgb(224, 88, 58)', closed: 'rgb(106, 100, 92)' };
await send('Page.enable'); await send('Runtime.enable');

/* ================= PC 1440 ================= */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await load();
await press('.kx-row', '/Budi/'); await press('.kx-rp-go', '/Replay/'); await ready(); await sleep(600);
const startDay = await js(`document.querySelector('.kx-rp-who input').value`);
const t0 = await js(`${RP}.t.current`);
await press('.k-full', '/Fullscreen/'); await sleep(1500);
const s = await js(`(() => { const bar = document.querySelector('.kx-rp-fs'), map = document.querySelector('.kx-map'); if (!bar) return null; const b = bar.getBoundingClientRect();
  return { inMap: map.contains(bar), page: !!document.querySelector('.kx-panel.kx-rp'), left: Math.round(b.left), right: Math.round(innerWidth - b.right), bottom: Math.round(innerHeight - b.bottom), h: Math.round(b.height),
    extra: !!bar.querySelector('.kx-rp-rows, .kx-rp-stats, .kx-rp-who, .kx-rp-hours, .kx-rp-chips'), ticks: bar.querySelectorAll('.kx-rp-notch').length, stops: bar.__rp.stops.length, t: bar.__rp.t.current, playing: bar.__rp.playing,
    brush: getComputedStyle(document.querySelector('.kx-brushwrap')).display, sideways: bar.scrollWidth > bar.clientWidth + 1,
    kids: [...bar.querySelectorAll('.kx-rp-player > *, .kx-rp-ctl > *, .kx-roadsw > *')].map((x) => x.className.split(' ')[0] + ':' + Math.round(x.getBoundingClientRect().height)) }; })()`);
ok('pc: Fullscreen keeps the replay - ONE bar on the map (16 px inside the 1 px map border left/bottom, 232 right), the page panel gone, no totals / Day Log, a tick per stop, the clock not reset, still playing',
  s && s.inMap && !s.page && s.left === 17 && s.right === 233 && s.bottom === 17 && !s.extra && s.ticks === s.stops && s.t >= t0 && s.playing && !s.sideways, s);
ok('pc: the bar is ONE thin row (<= 60 px: the drawn 44 px keys + 6 px padding)', s && s.h <= 60, s?.h);
ok('pc: the Paintbrush key steps off while a day plays (no shops on the map to paint)', s?.brush === 'none', s?.brush);
const ticks = await js(`[...document.querySelectorAll('.kx-rp-fs .kx-rp-notch')].map((n) => n.dataset.kind + '=' + getComputedStyle(n).backgroundColor)`);
ok('pc: the day as colour ticks - gold money, red a problem, dark closed, pale the rest', ticks.length > 3 && ticks.every((x) => { const [k, c] = x.split('='); return c === (TICKS[k] || 'rgb(232, 228, 222)'); }), ticks);
ok('pc: nothing draws over the bar\'s keys (Play, Next, 2x, Follow him are the top element)',
  [await top('.kx-rp-fs .play'), await top('.kx-rp-fs .kx-rp-ctl button[aria-label="Next stop"]'), await top('.kx-rp-fs .kx-rp-speed button', '/2x/'), await top('.kx-rp-fs .kx-roadsw button', '/Follow/')].every((x) => x === 'top'));
await press('.kx-rp-fs .play'); const p1 = await js(`${RP}.playing`);
await press('.kx-rp-fs .play'); const p2 = await js(`${RP}.playing`);
ok('pc: Play / Pause works from the bar', p1 === false && p2 === true, { p1, p2 });
await press('.kx-rp-fs .play');   // paused, so a jump lands exactly
const tick = (k, dy) => js(`(() => { const b = document.querySelectorAll('.kx-rp-fs .kx-rp-notch')[${k}].getBoundingClientRect(); return { x: b.left + b.width / 2, y: ${dy ? `b.top - ${dy}` : 'b.top + b.height / 2'} }; })()`);
await pressAt(await tick(3));
const j1 = await js(`(() => { const rp = ${RP}; return { t: rp.t.current, want: rp.tl.sceneSeg(3).t0, cur: rp.cur }; })()`);
await pressAt(await tick(5, 5));   // 5 px ABOVE the 6 px tick: the hit area is wider than the mark
const j2 = await js(`(() => { const rp = ${RP}; return { t: rp.t.current, want: rp.tl.sceneSeg(5).t0, cur: rp.cur }; })()`);
ok('pc: a tick jumps to its stop - also when the press lands 5 px above the thin mark', j1.t === j1.want && j1.cur === 3 && j2.t === j2.want && j2.cur === 5, { j1, j2 });
const mr = await js(`(() => { const sp = document.querySelector('.kx-mini .kx-mrow span'), was = sp.textContent; sp.textContent = '[TEST] HQ SALES MANAGER'; const rows = document.querySelector('.kx-mrows'), row = sp.closest('.kx-mrow'),
  mini = document.querySelector('.kx-mini').getBoundingClientRect(); const r = { sideways: rows.scrollWidth - rows.clientWidth, countInside: row.querySelector('em').getBoundingClientRect().right <= mini.right, rowRight: Math.round(row.getBoundingClientRect().right), miniRight: Math.round(mini.right), dots: sp.scrollWidth > sp.clientWidth };
  sp.textContent = was; return r; })()`);
ok('pc: the small Expedition never scrolls sideways - "[TEST] HQ SALES MANAGER" ends in "...", the count stays inside', mr.sideways <= 0 && mr.countInside && mr.rowRight <= mr.miniRight && mr.dots, mr);
const key = await js(`(() => { const b = document.querySelector('.kx-mini .kx-rp-go'); return b && { text: b.textContent, pressed: b.getAttribute('aria-pressed'), road: !!document.querySelector('.kx-mini .kx-roadsw') }; })()`);
ok('pc: the small list carries the Replay key - pressed, "Stop replay"; Today / All shops steps off while a day plays', key && /Stop replay/.test(key.text) && key.pressed === 'true' && !key.road, key);
await shot('fs3-A-pc-mid.png');

/* swap: another man in the small list = HIS day, the same day */
await press('.kx-mini .kx-mrow', '/Ari/'); await sleep(300);
await ready(); await sleep(1500);
const sw1 = (await js(SWAP)) || { err: errs.slice(-2) };
ok('pc swap 1: Ari pressed = HIS day plays (AR on the man, or the bar says he has nothing that day), the list marks him', /Ari/i.test(sw1.sel || '') && (/^AR/.test(sw1.tag || '') || /Ari Rahman/.test(sw1.empty || '')) && sw1.bar, sw1);
await press('.kx-mini .kx-mrow', '/Dewi/'); await ready(); await sleep(1500);
const sw2 = (await js(SWAP)) || { err: errs.slice(-2) };
ok('pc swap 2: Dewi pressed = HER day', /Dewi/i.test(sw2.sel || '') && (/^DW/.test(sw2.tag || '') || /Dewi Wulandari/.test(sw2.empty || '')) && sw2.bar, sw2);
await shot('fs3-A-pc-swap.png');
await press('.kx-mini .kx-mrow', '/Budi/'); await ready(); await sleep(1500);
const sw3 = (await js(SWAP)) || { err: errs.slice(-2) };
ok('pc swap 3: back to Budi = his day from its start, playing', /Budi/i.test(sw3.sel || '') && /^BS/.test(sw3.tag || '') && sw3.playing && sw3.t < 4000, sw3);

/* the card under the list, the receipt on top */
await freeze(8, 1100);
await pressAt(await chestAt('Toko Berkah Jaya'));
const cd = await js(`(() => { const card = document.querySelector('.kx-rp-card'); if (!card) return null; const b = card.getBoundingClientRect(), mini = document.querySelector('.kx-mini');
  return { inSlot: !!card.closest('.kx-mini .kx-rp-slot'), name: card.querySelector('.top b')?.textContent, bottom: Math.round(b.bottom), vh: innerHeight, right: Math.round(b.right), miniRight: Math.round(mini.getBoundingClientRect().right), sideways: mini.scrollWidth > mini.clientWidth + 1, playing: ${RP}.playing }; })()`);
ok('pc: a chest pressed = its card UNDER the Expedition list, whole on screen, the list not widened, the day paused', cd && cd.inSlot && cd.name === 'Toko Berkah Jaya' && cd.bottom <= cd.vh && cd.right <= cd.miniRight && !cd.sideways && cd.playing === false, cd);
ok('pc: the card\'s keys are the top element', [await top('.kx-rp-card .kx-rp-x'), await top('.kx-rp-card .acts button', '/Review receipt/'), await top('.kx-rp-card .acts button', '/Play from here/')].every((x) => x === 'top'));
await shot('fs3-A-pc-card.png');
await press('.kx-rp-card .acts button', '/Review receipt/'); await sleep(900);
const rc = await js(`(() => { const r = document.querySelector('.kx-rp-rcpt'); if (!r) return null; const h = document.elementFromPoint(innerWidth / 2, innerHeight / 2); return { onTop: r.contains(h), nota: /SALES RECEIPT|NOTA PENJUALAN/i.test(r.textContent) }; })()`);
ok('pc: Review receipt = the nota ON TOP of the fullscreen map', rc && rc.onTop && rc.nota, rc);
await shot('fs3-A-pc-receipt.png');
await press('.kx-rp-rcpt button', '/CLOSE RECEIPT/');
await press('.kx-rp-card .acts button', '/Play from here/');
const pf = await js(`({ card: !!document.querySelector('.kx-rp-card'), playing: ${RP}.playing, rcpt: !!document.querySelector('.kx-rp-rcpt') })`);
ok('pc: Close receipt, then Play from here = the card closes and the day plays on', !pf.card && pf.playing && !pf.rcpt, pf);

/* stop, start again from the small list, exit mid-replay */
await press('.kx-mini .kx-rp-go', '/Stop replay/'); await sleep(1000);
const st = await js(`({ bar: !!document.querySelector('.kx-rp-fs'), key: document.querySelector('.kx-mini .kx-rp-go')?.textContent || null, road: !!document.querySelector('.kx-mini .kx-roadsw'), brush: getComputedStyle(document.querySelector('.kx-brushwrap')).display, replayChests: document.querySelectorAll('.kx-rp-mk').length })`);
ok('pc: Stop replay = the bar goes, the key reads "Replay his day" again, Today / All shops and the Paintbrush come back', !st.bar && /Replay his day/.test(st.key || '') && st.road && st.brush !== 'none' && st.replayChests === 0, st);
await press('.kx-mini .kx-rp-go', '/Replay his day/'); await ready(); await sleep(1200);
ok('pc: "Replay his day" in the fullscreen list starts it right there', await js(`!!document.querySelector('.kx-rp-fs .kx-rp-player') && ${RP}.playing`));
const tb = await js(`${RP}.t.current`);
await press('.k-full', '/Exit Fullscreen/'); await sleep(1500);
const ex = await js(`(() => { const p = document.querySelector('.kx-panel.kx-rp'); return p && { name: p.querySelector('.kx-rp-who .kx-nm')?.textContent, day: p.querySelector('.kx-rp-who input')?.value, t: p.__rp.t.current, bar: !!document.querySelector('.kx-rp-fs'), rows: p.querySelectorAll('.kx-rp-row').length }; })()`);
ok('pc: Exit Fullscreen mid-replay = the page panel again: same man, same day, the clock not reset, the Day Log back', ex && /Budi/.test(ex.name) && ex.day === startDay && ex.t >= tb && !ex.bar && ex.rows > 3, { ...ex, startDay, tb });

/* Lite (reduced motion) in fullscreen: nothing animates on the map while it plays */
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await load();
await press('.kx-row', '/Budi/'); await press('.kx-rp-go', '/Replay/'); await ready(); await sleep(600);
await press('.k-full', '/Fullscreen/'); await sleep(1500);
await js(`${RP}.jumpTo(1, true); ${RP}.setPlaying(true); 1`);
let runMax = 0, scenes = 0;
for (let i = 0; i < 12; i++) { const m = await js(`({ run: document.querySelector('.kx-map').getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length, scene: document.querySelectorAll('.kx-rp-mk .kx-c5.burst').length })`); runMax = Math.max(runMax, m.run); scenes += m.scene; await sleep(250); }
ok('pc lite: fullscreen replay plays with 0 animations running and no chest mid-moment', runMax === 0 && scenes === 0 && await js(`!!document.querySelector('.kx-rp-fs')`), { runMax, scenes });
await send('Emulation.setEmulatedMedia', { features: [] });

/* ================= PHONE 390 ================= */
phone = true;
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
await load();
ok('phone: touch media on', await js(`matchMedia('(hover: none)').matches`));
await press('.kx-pick button', '/BS/'); await press('.kx-rp-go', '/Replay/'); await ready(); await sleep(600);
await press('.k-full'); await sleep(1500);
const ph = await js(`(() => { const bar = document.querySelector('.kx-rp-fs'), dock = document.querySelector('.kx-dock'); if (!bar) return null; const b = bar.getBoundingClientRect(), d = dock.getBoundingClientRect();
  return { left: Math.round(b.left), right: Math.round(innerWidth - b.right), gapToDock: Math.round(d.top - b.bottom), top: Math.round(b.top), h: Math.round(b.height), mbarBottom: Math.round(document.querySelector('.kx-mbarwrap').getBoundingClientRect().bottom),
    sideways: bar.scrollWidth > bar.clientWidth + 1 || document.documentElement.scrollWidth > innerWidth, extra: !!bar.querySelector('.kx-rp-chips, .kx-rp-card.now, .kx-rp-stats'), keys: [...bar.querySelectorAll('.kx-rp-ctl > button')].map((x) => Math.round(x.getBoundingClientRect().height)) }; })()`);
ok('phone: the bar sits above the key dock (8 px inside the 1 px map border, clear of the dock and the chips), no extra lists, nothing sideways, keys 40 tall',
  ph && ph.left === 9 && ph.right === 9 && ph.gapToDock >= 4 && ph.top > ph.mbarBottom && !ph.sideways && !ph.extra && ph.keys.every((h) => h >= 40), ph);
const prow = await js(`(() => { const c = document.querySelector('.kx-rp-fs .kx-rp-clock').getBoundingClientRect(), w = document.querySelector('.kx-rp-fs .kx-roadsw').getBoundingClientRect(); return { clockMid: Math.round(c.top + c.height / 2), camMid: Math.round(w.top + w.height / 2), clockRight: Math.round(innerWidth - c.right) }; })()`);
ok('phone: three rows like the drawing - the clock rides the camera row (bar <= 140 px; a 4th row made it 162)', ph.h <= 140 && Math.abs(prow.clockMid - prow.camMid) <= 3, { h: ph.h, ...prow });
ok('phone: Play, Follow him and the dock\'s Exit are the top element', [await top('.kx-rp-fs .play'), await top('.kx-rp-fs .kx-roadsw button', '/Follow/'), await top('.kx-dock .k-full')].every((x) => x === 'top'));
const pk = await js(`document.querySelector('.kx-mbar .kx-rp-go')?.textContent || null`);
ok('phone: the chips carry the key - "Stop replay"', /Stop replay/.test(pk || ''), pk);
await press('.kx-rp-fs .play'); const q1 = await js(`${RP}.playing`); await press('.kx-rp-fs .play'); const q2 = await js(`${RP}.playing`);
ok('phone: Play / Pause by touch', q1 === false && q2 === true, { q1, q2 });
await press('.kx-mchips button', '/^AR/'); await ready(); await sleep(1500);
const ps1 = (await js(SWAP)) || { err: errs.slice(-2) };
ok('phone swap 1: AR chip = Ari\'s day', /^AR/.test(ps1.sel || '') && (/^AR/.test(ps1.tag || '') || /Ari Rahman/.test(ps1.empty || '')) && ps1.bar, ps1);
await press('.kx-mchips button', '/^DW/'); await ready(); await sleep(1500);
const ps2 = (await js(SWAP)) || { err: errs.slice(-2) };
ok('phone swap 2: DW chip = Dewi\'s day', /^DW/.test(ps2.sel || '') && (/^DW/.test(ps2.tag || '') || /Dewi Wulandari/.test(ps2.empty || '')) && ps2.bar, ps2);
await press('.kx-mchips button', '/^BS/'); await ready(); await sleep(1500);
await freeze(8, 1100);
await shot('fs3-ph.png');
/* the card: Whole day frames his stops, then a chest is pressed */
await press('.kx-rp-fs .kx-roadsw button', '/Whole day/'); await sleep(1500);
const pc = await chestAt('Toko Berkah Jaya');
const under = pc && await js(`(() => { const h = document.elementFromPoint(${pc?.x}, ${pc?.y}); return h?.closest('.kx-rp-mk') ? 'chest' : String(h?.className?.baseVal ?? h?.className ?? h?.tagName); })()`);
ok('phone: after Whole day the chest is pressable (not under the bar or the chips)', under === 'chest', { pc, under });
if (under === 'chest') {
  await pressAt(pc);
  const pcd = await js(`(() => { const card = document.querySelector('.kx-rp-card'), pl = document.querySelector('.kx-rp-fs .kx-rp-player'); if (!card) return null; const b = card.getBoundingClientRect(), p = pl.getBoundingClientRect();
    return { inBar: !!card.closest('.kx-rp-fs'), name: card.querySelector('.top b')?.textContent, abovePlayer: b.bottom <= p.top, top: Math.round(b.top), mbarBottom: Math.round(document.querySelector('.kx-mbarwrap').getBoundingClientRect().bottom), sideways: document.documentElement.scrollWidth > innerWidth }; })()`);
  ok('phone: a chest pressed = its card above the player, below the chips, nothing sideways', pcd && pcd.inBar && pcd.name === 'Toko Berkah Jaya' && pcd.abovePlayer && pcd.top > pcd.mbarBottom && !pcd.sideways, pcd);
  ok('phone: the card\'s keys are the top element', [await top('.kx-rp-card .kx-rp-x'), await top('.kx-rp-card .acts button', '/Play from here/')].every((x) => x === 'top'));
  await shot('fs3-ph-card.png');
}

console.log('errors', JSON.stringify(errs));
ok('no page errors', errs.length === 0, errs);
fs.writeFileSync(path.join(HERE, 'results-fs.json'), JSON.stringify(results, null, 1));
console.log(`${results.filter((r) => r.pass).length}/${results.length} pass`);
ws.close(); chrome.kill(); server.close(); process.exit(0);
