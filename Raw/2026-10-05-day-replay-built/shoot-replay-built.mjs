/* 2026-10-05 - the Day Replay BUILT into Journey Plan (kpm src/components/DayReplay.jsx), driven on the production lab
   build (kpm dist-ponderlab/, `npx vite build --config tools/ponder-lab.config.mjs`) with REAL presses, at 1440 and at
   390 with the touch media (lessons 2026-10-03). Budi's lab day (tools/ponder-lab.jsx LAB_MAP): 5 sales, 1 exchange, 5
   Visit Reports, one report undone (must not show), one report by Ari (must not show).
   Frames are FROZEN through the replay's own clock (panel.__rp.seek), never slept (lessons 2026-09-29).
   Every check lands in results.json as { name, pass, data }; every frame is deleted before it is shot.
   Usage: node shoot-replay-built.mjs */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../kpm-inventory-main/dist-ponderlab');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/* a bundle older than the code it is meant to prove proves the OLD code (2026-10-05: the first run shot a bundle built
   before the clock hook existed - every seek threw and 22 checks "passed" on plain playback). Refuse to run on one. */
const newest = (dir) => fs.readdirSync(dir, { recursive: true }).filter((f) => /\.(jsx?|css)$/.test(f)).reduce((m, f) => Math.max(m, fs.statSync(path.join(dir, f)).mtimeMs), 0);
{ const SRC = path.resolve(HERE, '../../../kpm-inventory-main'), built = fs.statSync(path.join(DIST, 'tools/ponder-lab.html')).mtimeMs;
  const edited = Math.max(newest(path.join(SRC, 'src')), newest(path.join(SRC, 'tools')));
  if (edited > built) { console.log(`STALE LAB BUNDLE: source edited ${Math.round((edited - built) / 1000)} s after the build - run npx vite build --config tools/ponder-lab.config.mjs first`); process.exit(1); } }
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => {
  const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); });
}).listen(4211);
const LAB = 'http://localhost:4211/tools/ponder-lab.html?shell&journey&exp&admin';
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9411',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9411/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = []; let where = 'start';
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push(where + ': ' + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 300));
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errs.push(where + ': console: ' + JSON.stringify(d.params.args.map((a) => a.value ?? a.description)).slice(0, 300));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push(where + ': eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300)); return r.result?.result?.value; };
const shot = async (file, clip) => {
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });
  const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}), captureBeyondViewport: !!clip });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const waitFor = async (expr, ms = 15000) => { for (let t = 0; t < ms; t += 150) { if (await js(expr)) return true; await sleep(150); } return false; };
const results = []; const ok = (name, pass, data) => { results.push({ name, pass: !!pass, data }); console.log(pass ? 'PASS' : 'FAIL', name, data !== undefined ? JSON.stringify(data).slice(0, 220) : ''); };
const center = (sel, nth = 0) => js(`(() => { const e = [...document.querySelectorAll(${JSON.stringify(sel)})].filter((x) => x.offsetParent !== null || x.getClientRects().length)[${nth}]; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
const mouse = async (p) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', clickCount: 1 }); };
const touch = async (p) => { await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y }] }); await sleep(60); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
const press = async (sel, re, phone) => {
  const p = await js(`(() => { const e = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => ${re ? `${re}.test(x.textContent)` : 'true'} && x.getClientRects().length); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
  if (!p) return false; await sleep(200); if (phone) await touch(p); else await mouse(p); return true;
};
const RP = `document.querySelector('.kx-rp').__rp`;
/* every frozen moment reads its clock back: a seek that did not take must stop the run, never fall through to playback */
const seek = async (expr) => {
  const r = await js(`(() => { const rp = ${RP}; const want = Math.max(0, Math.min(rp.tl.total - 1, ${expr})); rp.seek(want, false); return { want, got: rp.t.current, playing: rp.playing }; })()`);
  if (!r || Math.abs(r.got - r.want) > 1) throw new Error(`seek did not take: ${JSON.stringify(r)} for ${expr}`);
  await sleep(450);
};
const load = async () => {
  await send('Page.navigate', { url: 'about:blank' }); await sleep(100);
  await js(`try { localStorage.clear() } catch {} 1`);
  await send('Page.navigate', { url: LAB });
  await waitFor('!!document.querySelector(".kx-map .leaflet-marker-icon")', 25000); await sleep(1500);
};
/* the map in one read */
const MAP = `(() => { const box = document.querySelector('.kx-map').getBoundingClientRect();
  const icons = [...document.querySelectorAll('.kx-map .leaflet-marker-icon')];
  const chests = icons.filter((e) => e.classList.contains('kx-rp-mk'));
  const man = document.querySelector('.kx-rp-man'), mb = man?.getBoundingClientRect();
  return { chests: chests.length, others: icons.filter((e) => !e.classList.contains('kx-rp-mk') && !e.classList.contains('kx-rp-man') && !e.classList.contains('kx-rp-start') && e.querySelector('.kx-c5, .kx-sm, .kx-slot')).length,
    tags: chests.map((e) => e.querySelector('.kx-otag')?.textContent), scene: chests.filter((e) => e.querySelector('.kx-c5.burst')).length,
    visited: chests.filter((e) => e.querySelector('.kx-c5.v')).length, held: chests.filter((e) => e.classList.contains('held')).map((e) => e.querySelector('.kx-snm i')?.textContent),
    man: man ? { tag: man.querySelector('.tag')?.textContent, cls: man.querySelector('.kx-sm').className, x: Math.round(mb.left + mb.width / 2 - box.left), y: Math.round(mb.bottom - box.top), inMap: mb.left >= box.left && mb.right <= box.right && mb.top >= box.top && mb.bottom <= box.bottom } : null,
    props: chests.flatMap((e) => [...e.querySelectorAll('.kx-rp-prop')].map((p) => +getComputedStyle(p).opacity)),
    running: document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.target?.closest?.('.kx-map')).length,
    w: box.width, h: box.height }; })()`;
const PANEL = `(() => { const p = document.querySelector('.kx-rp'); if (!p) return null; const b = p.getBoundingClientRect();
  return { rows: [...p.querySelectorAll('.kx-rp-row')].map((r) => r.querySelector('.t').textContent + ' ' + r.querySelector('.s b').textContent + ' | ' + r.querySelector('.s span').textContent),
    chips: p.querySelectorAll('.kx-rp-chips button').length, notches: p.querySelectorAll('.kx-rp-notch').length, card: p.querySelector('.kx-rp-card .top b')?.textContent || null,
    clock: p.querySelector('.kx-rp-clock')?.textContent, stats: [...p.querySelectorAll('.kx-rp-stats b')].map((x) => x.textContent),
    right: Math.round(b.right), docW: document.documentElement.scrollWidth, vw: innerWidth,
    textRight: Math.max(...[...p.querySelectorAll('b, small, span, em, button, input')].filter((e) => !e.closest('.kx-rp-chips')).concat(p.querySelector('.kx-rp-chips') || []).map((e) => e.getBoundingClientRect().right)) }; })()`;

/* ================= PC 1440 ================= */
where = 'pc';
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.enable'); await send('Runtime.enable');
await load();
ok('pc: Budi pressed in the Expedition', await press('.kx-row', '/Budi/'));
await sleep(900);
ok('pc: the Replay key shows for the pressed man', await waitFor('!!document.querySelector(".kx-rp-go")', 4000));
await press('.kx-rp-go');
ok('pc: the replay opens and reads his day', await waitFor(`!!document.querySelector('.kx-rp-row')`, 8000));
await sleep(1200);
let panel = await js(PANEL);
const want = ['Toko Berkah Jaya | SALE', 'Warung Sumber Rejeki | SALE', 'Warung Sumber Rejeki | REPEAT ORDER', 'Toko Makmur | SALE', 'Warung Bu Sri | SALE', 'Warung Bu Sri | COMPETITOR ISSUE',
  'Toko Sinar Abadi | SALE', 'Warung Pojok | NEW REQUEST', 'Toko Lancar | STORE CLOSED', 'Warung Barokah | EXCHANGE (RETUR)', 'Warung Barokah | STOCK FULL (NO ORDER)'];
const got = panel.rows.map((r) => r.replace(/^\d\d:\d\d /, '').replace(/ · Rp.*$/, '').toUpperCase().replace(/^(.*) \| /, (m, a) => a.toUpperCase() + ' | '));
ok('pc: the Day Log = his 11 events in time order (sales, the exchange, the reports)', got.length === 11 && want.every((w, i) => got[i] === w.toUpperCase()), panel.rows);
ok('pc: the undone Routine Check and Ari\'s report are NOT in it', !panel.rows.some((r) => /ROUTINE|Routine|Toko Maju/.test(r)));
ok('pc: one notch per stop (start + 11)', panel.notches === 12, panel.notches);
const OVERLAP = `(() => { const n = [...document.querySelectorAll('.kx-rp-notch')].map((e) => e.getBoundingClientRect()); let c = 0; n.forEach((a, i) => n.forEach((b, j) => { if (i < j && a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1) c++; })); return c; })()`;
ok('pc: no two timeline marks overlap (close stops take another lane)', (await js(OVERLAP)) === 0, await js(OVERLAP));
ok('pc: stats', panel.stats.length === 3, panel.stats);
let map = await js(MAP);
ok('pc: the day\'s shops are on the map, nothing else (8 chests, 0 other markers)', map.chests === 8 && map.others === 0, { chests: map.chests, others: map.others });
ok('pc: chests wear his tag + stop number', map.tags.every((t) => /^BS · \d$/.test(t)), map.tags);

/* frozen moments: the sale at stop 1 */
const SC = (k, ms) => `${RP}.tl.sceneSeg(${k}).t0 + ${ms}`;
await seek(SC(1, -1));
map = await js(MAP);
ok('pc: before his first scene no shop is visited, he stands at the start', map.visited === 0 && map.scene === 0 && /BS · 0\/11/.test(map.man?.tag), { visited: map.visited, man: map.man });
await shot('pc-0-start.png', { x: 0, y: 0, width: 1440, height: 1000 });
await seek(SC(1, 700));
map = await js(MAP);
ok('pc: mid-sale the chest plays its moment and the coin is in the air', map.scene === 1 && map.props.some((o) => o > 0.5), { scene: map.scene, props: map.props });
const freeze1 = await js(`(() => { const p = document.querySelector('.kx-rp-mk .kx-rp-prop.p1'); return p ? getComputedStyle(p).transform + '|' + getComputedStyle(p).opacity : null; })()`);
await shot('pc-1-sale-0700.png', { x: 0, y: 0, width: 1440, height: 1000 });
await seek(SC(1, 1200));
map = await js(MAP);
ok('pc: after the coin reaches him he holds it up (the seller pose)', /sell/.test(map.man?.cls), map.man);
await shot('pc-2-sale-1200.png', { x: 0, y: 0, width: 1440, height: 1000 });
await seek(SC(1, 1900));
map = await js(MAP);
ok('pc: the sign has planted - the shop reads as visited, its word shows', map.held.length === 1 && map.held[0] === 'Toko Berkah Jaya', map.held);
await shot('pc-3-sale-1900.png', { x: 0, y: 0, width: 1440, height: 1000 });
/* scrubbing backwards is a plain read: the end of the day, then back to the same moment */
await seek(`${RP}.tl.total - 5`);
map = await js(MAP);
ok('pc: at the end every shop is visited, 0 scenes', map.visited === 8 && map.scene === 0, { visited: map.visited, man: map.man });
await shot('pc-9-end.png', { x: 0, y: 0, width: 1440, height: 1000 });
await seek(SC(1, 700));
const freeze2 = await js(`(() => { const p = document.querySelector('.kx-rp-mk .kx-rp-prop.p1'); return p ? getComputedStyle(p).transform + '|' + getComputedStyle(p).opacity : null; })()`);
ok('pc: dragged back to 0.7 s into the sale = the same picture as the first time', freeze1 && freeze1 === freeze2, { freeze1, freeze2 });
/* every other kind, mid-scene */
for (const [k, name] of [[3, 'order'], [6, 'issue'], [8, 'request'], [9, 'closed'], [10, 'swap'], [11, 'full']]) {
  await seek(SC(k, 1100)); await shot(`pc-k${k}-${name}-1100.png`, { x: 0, y: 0, width: 1440, height: 1000 });
  await seek(SC(k, 1950)); map = await js(MAP); await shot(`pc-k${k}-${name}-1950.png`, { x: 0, y: 0, width: 1440, height: 1000 });
}
ok('pc: the clock shows the stop\'s time', /^\d\d:\d\d$/.test((await js(PANEL)).clock));

/* a shop pressed on the map: its card, the replay pauses; a sale has its receipt */
await js(`${RP}.setPlaying(true); 1`); await sleep(300);
const chest = await js(`(() => { const e = [...document.querySelectorAll('.kx-rp-mk')].find((x) => x.querySelector('.kx-snm i')?.textContent === 'Toko Berkah Jaya'); const b = e.querySelector('.art').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
await mouse(chest); await sleep(700);
panel = await js(PANEL);
ok('pc: pressing a chest opens its card and pauses', panel.card === 'Toko Berkah Jaya' && !(await js(`${RP}.playing`)), { card: panel.card });
await shot('pc-4-card.png', { x: 0, y: 0, width: 1440, height: 1000 });
const muts = await js(`new Promise((r) => { const ps = [...document.querySelectorAll('.kx-map .leaflet-overlay-pane path'), document.querySelector('.kx-rp-man')]; let n = 0; const mo = new MutationObserver((l) => { n += l.length; }); ps.forEach((p) => mo.observe(p, { attributes: true })); setTimeout(() => { mo.disconnect(); r(n); }, 1000); })`);
ok('pc: paused = nothing on the map is redrawn (not the trail, not him) for a whole second', muts === 0, muts);
await press('.kx-rp-card button', '/Review receipt/');
ok('pc: Review receipt opens the app\'s own nota', await waitFor('!!document.querySelector(".print-receipt")', 3000));
await sleep(500); await shot('pc-5-receipt.png');
const onTop = await js(`(() => { const hits = ['.kx-keys button', '.leaflet-control-zoom-in'].map((s) => { const b = document.querySelector(s).getBoundingClientRect(); return document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)?.closest('.print-modal-wrapper') ? 'receipt' : 'map key'; }); return hits; })()`);
ok('pc: the receipt is on top - the map keys and the zoom do not draw over it', onTop.every((h) => h === 'receipt'), onTop);
await press('button', '/CLOSE RECEIPT/i'); await sleep(400);
const rcClosed = await js(`!document.querySelector('.print-receipt')`);
ok('pc: the receipt closes', rcClosed);
await press('.kx-rp-card button', '/Play from here/'); await sleep(500);
ok('pc: Play from here plays from that shop', (await js(`${RP}.playing`)) && (await js(`${RP}.cur`)) === 1, await js(`${RP}.cur`));
/* a row press jumps */
await press('.kx-rp-row', '/Warung Pojok/'); await sleep(500);
ok('pc: a Day Log row jumps to that stop', (await js(`${RP}.cur`)) === 8, await js(`${RP}.cur`));
await sleep(900);
const inView = await js(`(() => { const p = document.querySelector('.kx-rp').getBoundingClientRect(); const v = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return b.top >= p.top - 1 && b.bottom <= p.bottom + 1; };
  const P = document.querySelector('.kx-rp'), r = document.querySelector('.kx-rp-row.now').getBoundingClientRect(), pl = document.querySelector('.kx-rp-player').getBoundingClientRect(), pb = P.getBoundingClientRect();
  return { timeline: v('.kx-rp-tl'), controls: v('.kx-rp-ctl'), nowRowBelowPlayer: r.top >= pl.bottom - 1 && r.bottom <= pb.bottom + 1, panelScrolled: P.scrollTop }; })()`);
ok('pc: following him down the Day Log keeps the player in view and his row just under it', inView.timeline && inView.controls && inView.nowRowBelowPlayer && inView.panelScrolled > 0, inView);
await shot('pc-7-row8.png', { x: 0, y: 0, width: 1440, height: 1000 });
/* Follow him: the camera keeps him in the map */
await press('.kx-roadsw button', '/Follow him/'); await sleep(2500);
map = await js(MAP);
ok('pc: Follow him keeps him on the map', map.man?.inMap && Math.abs(map.man.x - map.w / 2) < 140, map.man);
await shot('pc-6-follow.png', { x: 0, y: 0, width: 1440, height: 1000 });

/* no flash: 6 s of real playback with the camera following (his epilepsy rule) */
await js(`${RP}.jumpTo(1, true); ${RP}.setPlaying(true); 1`);
const mb = await js(`(() => { const b = document.querySelector('.kx-map').getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: b.height }; })()`);
const means = []; let prev = null, worst = 0;
for (let i = 0; i < 20; i++) {
  const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60, clip: { ...mb, scale: 0.25 } });
  const r = await js(`(async () => { const i = new Image(); i.src = 'data:image/jpeg;base64,${s.result.data}'; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; const L = []; let sum = 0; for (let k = 0; k < d.length; k += 4) { const l = 0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]; L.push(l); sum += l; } return { mean: sum / L.length, L }; })()`);
  means.push(r.mean);
  if (prev) { let big = 0; r.L.forEach((l, k) => { if (Math.abs(l - prev[k]) > 60) big++; }); worst = Math.max(worst, big / r.L.length); }
  prev = r.L; await sleep(300);
}
ok('pc: no flash while it plays (mean brightness steady, no frame changes >25% of the map by a big step)', Math.max(...means) - Math.min(...means) < 20 && worst < 0.25, { min: Math.min(...means).toFixed(1), max: Math.max(...means).toFixed(1), worst: worst.toFixed(3) });

/* Back to team: the Expedition and today's chests come back */
await press('.kx-rp-x', '/Back to team/'); await sleep(1200);
ok('pc: Back to team = the Expedition panel and the normal map again', await js(`!document.querySelector('.kx-rp') && !!document.querySelector('.kx-panel .kx-row') && !document.querySelector('.kx-rp-mk') && !!document.querySelector('.kx-map .kx-c5')`));

/* Lite (reduced motion): cuts between the still end pictures, nothing animates on the map */
where = 'lite';
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await load();
await press('.kx-row', '/Budi/'); await sleep(800); await press('.kx-rp-go');
await waitFor(`!!document.querySelector('.kx-rp-row')`, 8000); await sleep(800);
await js(`${RP}.jumpTo(1, true); ${RP}.setPlaying(true); 1`);
let runMax = 0, scenes = 0;
for (let i = 0; i < 12; i++) { map = await js(MAP); runMax = Math.max(runMax, map.running); scenes += map.scene; await sleep(250); }
ok('lite: 0 animations running on the map and no chest mid-moment while it plays', runMax === 0 && scenes === 0, { runMax, scenes });
await send('Emulation.setEmulatedMedia', { features: [] });

/* ================= PHONE 390 ================= */
where = 'phone';
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
await load();
ok('phone: the touch media is live', await js(`matchMedia('(hover: none)').matches && matchMedia('(pointer: coarse)').matches`));
ok('phone: Budi pressed', await press('.kx-pick button', '/BS/', true)); await sleep(900);
await press('.kx-rp-go', null, true);
ok('phone: the replay opens', await waitFor(`!!document.querySelector('.kx-rp-chips button')`, 8000));
await sleep(1500);
panel = await js(PANEL);
ok('phone: one card + a chip per stop, no Day Log rows', panel.chips === 12 && panel.rows.length === 0 && (await js(`!!document.querySelector('.kx-rp-card.now')`)), { chips: panel.chips, rows: panel.rows.length });
ok('phone: no two timeline marks overlap', (await js(OVERLAP)) === 0, await js(OVERLAP));
ok('phone: no sideways scroll, every text inside the screen', panel.docW <= 390 && panel.textRight <= 391 && panel.right <= 391, { docW: panel.docW, textRight: Math.round(panel.textRight), right: panel.right });
await seek(SC(1, 1200));
map = await js(MAP);
ok('phone: Follow him - he is on the map, mid-sale with the coin up', map.man?.inMap && /sell/.test(map.man.cls), map.man);
await js(`window.scrollTo(0, 0); 1`); await sleep(300);
await shot('ph-1-sale.png', { x: 0, y: 0, width: 390, height: 844 });
await js(`document.querySelector('.kx-rp').scrollIntoView({ block: 'start' }); 1`); await sleep(400);
await shot('ph-2-panel.png', { x: 0, y: await js('scrollY'), width: 390, height: 844 });
await js(`window.scrollTo(0, 0); 1`); await sleep(300);
const pc = await js(`(() => { const e = [...document.querySelectorAll('.kx-rp-mk')].find((x) => x.querySelector('.kx-snm i')?.textContent === 'Toko Berkah Jaya'); if (!e) return null; const b = e.querySelector('.art').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
if (pc) { await touch(pc); await sleep(800); }
panel = await js(PANEL);
ok('phone: a tap on the chest opens its card', panel.card === 'Toko Berkah Jaya', { card: panel.card, at: pc });
await press('.kx-rp-chips button', '/./', true); await sleep(400);

ok('no console errors', errs.length === 0, errs);
fs.writeFileSync(path.join(HERE, 'results.json'), JSON.stringify(results, null, 1));
console.log(`${results.filter((r) => r.pass).length}/${results.length} pass`);
ws.close(); chrome.kill(); server.close();
process.exit(0);
