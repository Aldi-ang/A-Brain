// His "test it yourself" on the Agent Inventory chest (kpm 4f44e3d): every ✅ TEST step from the 2026-09-27 09:52 entry,
// walked in the lab with REAL input (CDP mouse and touch, the book's own step keys) - who sees the chest (all six tiers),
// the chest sound, six a page and the page counts, a drag onto an empty square, onto a filled one, carried to page 2, onto
// the damaged row (refused), a tap, a key, close and open again, the phone's finger, Lite Mode, a view-only matrix, the
// saved layout read back, the same field Fleet & Roster writes, the salesman's list, and the book page reached the way a
// person reaches it, every beat at 1440 and 430. Every write is read back from globalThis.__labWrites. PASS / FAIL.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KPM = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main/';
const { agentChest } = await import(pathToFileURL(KPM + 'src/ponder/scenes/agent-chest.js').href);
const steps = agentChest.steps;
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'test-shots');
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.png')) fs.unlinkSync(path.join(OUT, f));
const PROFILE = path.join(path.dirname(OUT), 'profile');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9343',
  '--user-data-dir=' + PROFILE, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9343/json/list')).json(); } catch { /* not up yet */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(), errors = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push(d.params.args.map(a => a.value ?? a.description).join(' '));
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shoot = async (name) => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(s.result.data, 'base64')); };
const results = [];
const step = (name, pass, got) => { results.push({ name, pass: !!pass }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${got !== undefined ? '  ->  ' + JSON.stringify(got) : ''}`); };
await send('Page.enable'); await send('Runtime.enable');

/* every page records the sounds it asks for (the headless browser is muted; the ASK is what the code controls) */
await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__played = []; const P0 = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () { try { window.__played.push(String(this.currentSrc || this.src).split('/').pop()); } catch (e) {} return P0.call(this).catch(() => {}); };` });

let finger = false;
const open = async (q, w, h) => {
  finger = w < 768;
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
  await send('Emulation.setTouchEmulationEnabled', { enabled: finger, maxTouchPoints: finger ? 5 : 1 });
  await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?' + q }); await sleep(3800);
};
const at = (sel, i = 0) => js(`(() => { const e = document.querySelectorAll(${JSON.stringify(sel)})[${i}]; if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
const rectNow = (sel, i = 0) => js(`(() => { const e = document.querySelectorAll(${JSON.stringify(sel)})[${i}]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
const LIFT = () => (finger ? 46 : 0);           // on a finger the carried box rides 46 px above it (LoadingBay startDrag)
async function press(p) {
  if (finger) await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y }] });
  else await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: p.x, y: p.y, button: 'left', buttons: 1, clickCount: 1 });
}
async function moveTo(from, to, n = 10) {
  for (let i = 1; i <= n; i++) {
    const p = { x: from.x + (to.x - from.x) * i / n, y: from.y + (to.y - from.y) * i / n };
    if (finger) await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [p] });
    else await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p.x, y: p.y, button: 'left', buttons: 1 });
    await sleep(16);
  }
  return to;
}
async function release(p) {
  if (finger) await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  else await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p.x, y: p.y, button: 'left', buttons: 0, clickCount: 1 });
}
const aim = (p) => ({ x: p.x, y: p.y + LIFT() });   // where the finger goes so the carried box sits on p
async function drag(fromSel, fromI, toSel, toI, holdKey) {
  const a = await at(fromSel, fromI);
  await press(a);
  let here = a;
  if (holdKey != null) {                             // carry it over a page key and hold there until the page turns
    const k = aim(await rectNow('.kpm-bay .gui.van .pg', holdKey));
    here = await moveTo(here, k);
    await sleep(340); here = await moveTo(here, { x: k.x + 2, y: k.y }, 1); await sleep(160); here = await moveTo(here, { x: k.x + 3, y: k.y }, 1); await sleep(200);
  }
  const b = aim(await rectNow(toSel, toI));
  here = await moveTo(here, b, 12);
  await release(here); await sleep(700);
}
async function tap(p) { await press(p); await release(p); }
const order = () => js(`[...document.querySelectorAll('.kpm-bay .gui.van .grid .slot')].map(s => s.dataset.id || '-').join(',')`);
const keys = () => js(`[...document.querySelectorAll('.kpm-bay .gui.van .pg')].map(b => b.innerText.replace(/\\s+/g, ' ')).join('|')`);
const said = () => js(`document.querySelector('.kpm-bay .gui.van .say')?.innerText || ''`);
const writes = () => js(`(globalThis.__labWrites || []).map(x => ({ op: x.op, path: x.path, keys: Object.keys(x.data || {}), vanLayout: (x.data || {}).vanLayout }))`);
const played = () => js(`window.__played.join(',')`);
const EMPTY = '.kpm-bay .gui.van .grid .slot:not(.has)', BOX = '.kpm-bay .gui.van .grid .slot.has';

/* ── 1. who sees the chest: all six tiers ── */
{
  const got = {};
  for (const t of ['ADMIN', 'DEVELOPER', 'COMPANY_OWNER', 'AREA_ADMIN', 'FLEET_CAPTAIN', 'FIELD_OPERATIVE', 'ROOKIE']) {
    await open('shell&agent&tier=' + t, 1440, 900);
    got[t] = await js(`document.querySelector('.kpm-bay.solo') ? 'chest' : document.querySelectorAll('h4.lg\\\\:truncate').length + ' rows'`);
  }
  const ok = ['ADMIN', 'DEVELOPER', 'COMPANY_OWNER', 'AREA_ADMIN', 'FLEET_CAPTAIN'].every(t => got[t] === 'chest') && got.FIELD_OPERATIVE === '4 rows' && got.ROOKIE === '4 rows';
  step('1. T1-T4 (T4 = Regional Admin) see the chest; T5 and T6 see the old list of 4 products', ok, got);
}

/* ── 2. the regional admin opens Agent Inventory ── */
await open('shell&agent&admin', 1440, 900);
{
  const g = await js(`(() => { const b = document.querySelector('.kpm-bay'); return { open: b.classList.contains('van-open'), squares: document.querySelectorAll('.kpm-bay .gui.van .grid .slot').length,
    title: document.querySelector('.kpm-bay .gui.van .title').innerText.replace(/\\s+/g, ' '), load: [...document.querySelectorAll('span')].find(s => s.textContent.trim() === 'Load')?.parentElement?.innerText.replace(/\\s+/g, ' ') }; })()`);
  /* sounds unlock on the first touch (useSound `unlocked`) - in the app he has already clicked the menu to get here, so
     click once, then shut and reopen the chest by hand (v4 has no Saleable / Quarantine switch) and listen for the open sound */
  await tap({ x: 60, y: 880 });
  await js(`(async () => { await (await import('/src/hooks/useSound.js')).unlockSounds(); return 1; })()`);   // main.jsx does this on the first gesture; the lab never runs main.jsx
  await sleep(200);
  await tap(await at('.kpm-bay .vanc')); await sleep(500); await tap(await at('.kpm-bay .vanc')); await sleep(900);
  g.keys = await keys(); g.played = await played();
  step('2. the chest opens on its own with the van-open sound; six squares a page; the page keys show their counts',
    g.open && /chest-van-open/.test(g.played) && g.squares === 6 && g.keys === '1 · 4|2 · 0|3 · 0' && /^Budi Santoso inventory/.test(g.title), g);
  const dmg = await js(`({ head: document.querySelector('.kpm-bay .gui.q .title .count').innerText, boxes: [...document.querySelectorAll('.kpm-bay .gui.q .slot.has')].map(s => s.innerText.replace(/\\s+/g, ' ')), row: !!document.querySelector('.kpm-bay .dmg') })`);
  step('4. (v4) the damaged row became the quarantine crate beside the chest: the Quarantine tab\'s list and count, each box with its reason', dmg.head === '10 · 1 barang' && dmg.boxes.length === 1 && /Rusak \/ Basah/.test(dmg.boxes[0]) && !dmg.row, dmg);
  const chestBks = +g.title.match(/([\d.]+) Bks/)[1].replace(/\./g, ''), loadBks = +(g.load || '').match(/([\d.]+)/)?.[1].replace(/\./g, '');
  step('FINDING - the chest total and the LOAD card above it agree', chestBks === loadBks, { chest: chestBks, load: loadBks });
  await shoot('2-open-1440');
}

/* ── 3. drags: onto an empty square, onto a filled one, carried to page 2, onto the damaged row ── */
{
  const before = await order();
  await drag(BOX, 0, EMPTY, 0);
  const g = { before, after: await order(), said: await said(), writes: await writes(), keys: await keys(), played: await played() };
  const w = g.writes[0] || {};
  step('3a. a box dragged onto an empty square moves there, its old square stays empty, "tersimpan — hanya susunan kotak", ONE write: only vanLayout, his own van',
    g.after === '-,p-djar,p-gg12,p-smp16,p-cg16,-' && g.said === 'tersimpan — hanya susunan kotak' && g.writes.length === 1 &&
    w.op === 'update' && w.path === 'artifacts/lab/users/lab/motorists/m2' && w.keys.join() === 'vanLayout' && /chest-pick/.test(g.played), g);
  await drag(BOX, 0, BOX, 1);
  const s = { after: await order(), writes: (await writes()).length };
  step('3b. a box dropped on a filled square: the two swap places, one more layout write', s.after === '-,p-gg12,p-djar,p-smp16,p-cg16,-' && s.writes === 2, s);
  await drag(BOX, 2, '.kpm-bay .gui.van .grid .slot', 0, 1);
  const c = { keys: await keys(), on: await js(`document.querySelector('.kpm-bay .gui.van .pg.on')?.innerText`), w: (await writes()).at(-1)?.vanLayout };
  step('3c. carried over the page key "2", held a moment: the page turns under it and it lands on page 2', c.keys === '1 · 3|2 · 1|3 · 0' && c.w?.[6] === 'p-smp16', c);
  await shoot('3-page2-1440');
  await tap(await at('.kpm-bay .gui.van .pg', 0)); await sleep(500);
  const n = (await writes()).length, o = await order();
  await drag(BOX, 0, '.kpm-bay .gui.q .slot', 1);
  const r = { said: await said(), writes: (await writes()).length, same: (await order()) === o };
  step('3d. a good box dropped on the quarantine crate is refused out loud, nothing written, nothing moved',
    r.said === 'Barang rusak dicatat lewat EOD, bukan dipindah di sini' && r.writes === n && r.same, r);
  const d0 = await at('.kpm-bay .gui.q .slot.has', 0);
  await press(d0); await moveTo(d0, { x: d0.x + 120, y: d0.y - 160 }, 6);
  const ghost = await js(`!!document.querySelector('.kpm-bay-ghost')`);
  await release({ x: d0.x + 120, y: d0.y - 160 }); await sleep(500);
  step('3e. a box in the quarantine crate cannot be picked up at all', !ghost && (await writes()).length === n, { ghost, writes: (await writes()).length });
}

/* ── tap, key ── */
{
  const n = (await writes()).length;
  await tap(await at(BOX, 0)); await sleep(300);
  const t = { said: await said(), writes: (await writes()).length, spin: await js(`!!document.querySelector('.kpm-bay .kpm-cube.spin')`) };
  step('a tap on a box (no drag) turns it and says how to tidy; nothing written', t.said === 'Tarik ke kotak lain untuk menata susunan' && t.writes === n && t.spin, t);
  await js(`document.querySelectorAll('.kpm-bay .gui.van .grid .slot.has')[1].focus(), 1`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await sleep(300);
  const k = { said: await said(), sheet: await js(`!!document.querySelector('.kpm-bay-sheet')`), writes: (await writes()).length };
  step('Enter on a box answers the same way; no HOW MANY sheet, nothing written', k.said === 'Tarik ke kotak lain untuk menata susunan' && !k.sheet && k.writes === n, k);
}

/* ── 5. close and open again ── */
{
  await tap(await at('.kpm-bay .gui.van .pg', 1)); await sleep(400);
  const before = { order: await order(), on: await js(`document.querySelector('.kpm-bay .gui.van .pg.on').innerText`) };
  const chest = await at('.kpm-bay .vanc .chest');
  await tap(chest); await sleep(550);
  const shut = await js(`({ shut: document.querySelector('.kpm-bay').classList.contains('van-shut'), vis: getComputedStyle(document.querySelector('.kpm-bay .gui.van')).visibility })`);
  shut.played = await played();
  await tap(chest); await sleep(700);
  const after = { order: await order(), on: await js(`document.querySelector('.kpm-bay .gui.van .pg.on').innerText`), vis: await js(`getComputedStyle(document.querySelector('.kpm-bay .gui.van')).visibility`) };
  step('5. tap the chest: it closes (panel hidden, close sound); tap again: it opens on the same page, boxes where they were',
    shut.shut && shut.vis === 'hidden' && /chest-van-close/.test(shut.played) && after.vis === 'visible' && after.order === before.order && after.on === before.on, { before, shut: { ...shut, played: undefined }, after });
}

/* ── the phone, with a finger ── */
await open('shell&agent&admin', 430, 930);
{
  await drag(BOX, 0, EMPTY, 0);
  const a = { after: await order(), said: await said(), writes: (await writes()).map(w => w.keys.join()) };
  await drag(BOX, 0, '.kpm-bay .gui.van .grid .slot', 0, 1);
  const b = { keys: await keys(), w: (await writes()).at(-1)?.vanLayout };
  step('phone, finger: a box moves to an empty square, and one carried over "2" lands on page 2 - each a vanLayout write',
    a.after === '-,p-djar,p-gg12,p-smp16,p-cg16,-' && a.said === 'tersimpan — hanya susunan kotak' && a.writes.join('|') === 'vanLayout' &&
    b.keys === '1 · 3|2 · 1|3 · 0' && b.w?.[6] === 'p-djar', { a, b });
  await shoot('phone-finger-430');
}

/* ── the saved order read back: the next time the van document is read, the chest shows it ── */
{
  const seed = await send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => { const fx = {}; let m2;
    Object.defineProperty(fx, 'motorists/m2', { enumerable: true, configurable: true, get: () => m2,
      set: (v) => { m2 = { ...v, vanLayout: [null, 'p-djar', 'p-gg12', 'p-smp16', 'p-cg16'] }; } });
    globalThis.__labFixtures = fx; })();` });
  await open('shell&agent&admin', 1440, 900);
  const o = await order();
  await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: seed.result.identifier });
  step('a saved order comes back as saved - the hole on square 1 stays a hole', o === '-,p-djar,p-gg12,p-smp16,p-cg16,-', o);
}

/* ── the SAME field Fleet & Roster writes ── */
{
  await open('shell&fleet', 1440, 900);
  await js(`[...document.querySelectorAll('.kpm-actor')].find(a => a.querySelector('.kpm-actor-name')?.textContent.trim() === 'Budi Santoso')?.click(); true`); await sleep(1800);
  await drag(BOX, 0, EMPTY, 0);
  const w = (await writes()).at(-1) || {};
  step('Fleet & Roster\'s van chest writes the same document field: motorists/<van>.vanLayout, and nothing else',
    w.op === 'update' && /^artifacts\/lab\/users\/lab\/motorists\/f-b1$/.test(w.path) && w.keys?.join() === 'vanLayout', w);
}

/* ── a regional admin set to view-only in his matrix ── */
{
  await open('shell&agent&admin', 1440, 900);
  const inj = await js(`(async () => { const m = await import('/src/config/permissions.js'); m.injectDynamicPermissions({ FLEET_CAPTAIN: ['view_agent_inventory', 'fleet_view_only'] }); return m.canEditFleetRoster('FLEET_CAPTAIN'); })()`);
  await js(`document.querySelector('.kpm-theme-switch').click(), 1`); await sleep(400); await js(`document.querySelector('.kpm-theme-switch').click(), 1`); await sleep(800);
  const n = (await writes()).length;
  await drag(BOX, 0, EMPTY, 0);
  const v = { canEdit: inj, hint: await js(`document.querySelector('.kpm-bay .bayHint')?.innerText || ''`), said: await said(), writes: (await writes()).length - n, order: await order() };
  step('view-only in his matrix: the chest still shows, says "Hanya lihat", a drag moves nothing and writes nothing',
    v.canEdit === false && /hanya lihat/i.test(v.hint) && /hanya lihat/i.test(v.said) && v.writes === 0 && v.order === 'p-cg16,p-djar,p-gg12,p-smp16,-,-', v);
}

/* ── Lite Mode, phone ── */
{
  await open('shell&agent&admin&lite', 430, 930);
  const l = await js(`(() => { const op = (e) => { let o = 1; for (let n = e; n; n = n.parentElement) o *= +getComputedStyle(n).opacity; return o; };
    const slots = [...document.querySelectorAll('.kpm-bay .gui .slot')]; return { lite: document.documentElement.classList.contains('lite-mode'),
    open: document.querySelector('.kpm-bay').classList.contains('van-open') && document.querySelector('.kpm-bay').classList.contains('q-open'), minOpacity: Math.min(...slots.map(op)), slots: slots.length,
    running: document.querySelector('.kpm-bay').getAnimations({ subtree: true }).filter(a => a.playState === 'running').length }; })()`);
  step('Lite Mode: the chest is open and every square fully visible, nothing left moving', l.lite && l.open && l.minOpacity === 1 && l.slots === 12 && l.running === 0, l);
  await shoot('lite-430');
}

/* ── 6. the salesman ── */
{
  await open('shell&agent', 430, 930);
  const s = await js(`({ chest: !!document.querySelector('.kpm-bay'), rows: [...document.querySelectorAll('h4.lg\\\\:truncate')].map(h => h.innerText) })`);
  step('6. the salesman: no chest, the old list, unchanged', !s.chest && s.rows.join('|').toUpperCase() === 'CELLO GREEN 16|DJARUM COKLAT 12|GUDANG GARAM SURYA 12|SAMPOERNA MILD 16', s);
}

/* ── 7. the book, reached the way a person reaches it ── */
{
  await open('shell&agent&admin&tab=agent_inventory', 1440, 900);   // standing on Agent Inventory, press TUTORIAL in the top bar
  const nav = await js(`(async () => { const wait = (ms) => new Promise(r => setTimeout(r, ms));
    const btn = [...document.querySelectorAll('button')].find(b => /tutorial|book|buku/i.test((b.getAttribute('aria-label') || '') + b.textContent));
    if (!btn) return 'no book button: ' + [...document.querySelectorAll('button')].map(b => b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 8).join(' | ');
    btn.click(); await wait(1200);
    const rib = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Agent');   // the lab shell opens on Command; the app opens on the screen you stand on
    if (!rib) return 'no Agent ribbon'; rib.click(); await wait(1000);
    const card = [...document.querySelectorAll('button, a, [role="button"]')].find(b => /Agent Chest/.test(b.textContent) && !/Agent Chest[\\s\\S]*Agent Chest/.test(b.textContent));
    if (!card) return 'no Agent Chest card'; card.click(); await wait(1500);
    return { counter: (document.body.innerText.match(/(\\d+) \\/ (\\d+)/) || [])[0], title: !!document.body.innerText.match(/AGENT CHEST/i), chest: !!document.querySelector('.kpm-bay.solo') }; })()`);
  step('7. the book: Agent Inventory -> Agent Chest opens the page, beat 1 of ' + steps.length + ', the real chest on its stage', nav?.counter === '1 / ' + steps.length && nav.chest, nav);
}
const plain = (s) => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const shutAt = (i) => { let open = true; for (let k = 0; k <= i; k++) { if (steps[k].act === 'shut:van') open = false; else if (steps[k].act === 'open:van') open = true; } return !open; };
for (const [w, h] of [[1440, 900], [430, 930]]) {
  await open('scene=agent-chest&step=0', w, h);
  const bad = [];
  for (let i = 0; i < steps.length; i++) {
    await js(`document.querySelector('[aria-label="Step ${i + 1}"]').click(); true`); await sleep(700);
    const s = steps[i], ks = [].concat(s.focus).filter(k => k !== '*');
    const g = await js(`(() => { const vis = k => { const e = document.querySelector('[data-ponder="' + k + '"]'); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 20 && r.height > 20 && getComputedStyle(e).visibility !== 'hidden'; };
      return { text: document.body.innerText.replace(/\\s+/g, ' '), shut: document.querySelector('.kpm-bay').classList.contains('van-shut'),
        keys: ${JSON.stringify(ks)}.map(vis), pg: [...document.querySelectorAll('.kpm-bay .gui.van .pg')].map(b => b.innerText.replace(/\\s+/g, ' ')).join('|'),
        overflowX: document.documentElement.scrollWidth > innerWidth }; })()`);
    const miss = [];
    if (!g.text.includes(plain(s.text))) miss.push('sentence');
    if (g.shut !== shutAt(i)) miss.push('chest');
    if (!g.keys.every(Boolean)) miss.push('points at nothing');
    if (/\*\*2 · 4\*\*/.test(s.text) && !g.pg.includes('2 · 4')) miss.push('page keys ' + g.pg);
    if (g.overflowX) miss.push('wider than the screen');
    if (miss.length) bad.push({ beat: i + 1, miss });
  }
  step(`7. ${w}: all ${steps.length} beats - the sentence shows, the part it points at is there and visible, the chest open or shut as the beat says`, bad.length === 0, bad.slice(0, 6));
}
{
  await open('scene=agent-chest&step=0', 1440, 900);
  await js(`document.querySelector('[aria-label="Step 11"]').click(); true`); await sleep(700);
  const o = await order();
  await drag(BOX, 0, EMPTY, 0);
  const g = { ghost: await js(`!!document.querySelector('.kpm-bay-ghost')`), writes: (await writes()).length, same: (await order()) === o };
  step('7. a drag inside the book moves nothing, writes nothing, leaves no box in the air', !g.ghost && g.writes === 0 && g.same, g);
  await tap(await at('.kpm-bay .vanc')); await sleep(900);
  const beat = await js(`+((document.body.innerText.match(/(\\d+) \\/ ${steps.length}/) || [])[1] || 0)`);
  step('7. a tap on the chest inside the book jumps to the beat about the chest', beat === 3, beat);
  await open('scene=agent-chest&step=0&lite', 430, 930);
  await js(`document.querySelector('[aria-label="Step 8"]').click(); true`); await sleep(700);
  const lite = await js(`(() => { const t = ${JSON.stringify(plain(steps[7].text))}; const e = [...document.querySelectorAll('p, div, span')].find(x => x.children.length < 6 && x.textContent.replace(/\\s+/g, ' ').trim() === t);
    if (!e) return 'caption not found'; let o = 1; for (let n = e; n; n = n.parentElement) o *= +getComputedStyle(n).opacity; return { lite: document.documentElement.classList.contains('lite-mode'), opacity: Math.round(o * 100) / 100 }; })()`);
  step('7. Lite Mode in the book: the sentence is fully visible', lite?.lite && lite.opacity >= 0.99, lite);
  await shoot('book-lite-430');
}

/* ── v4 (2026-09-27, prototype v11): the two chests and the book of the day ── */
const lead = (m) => +((m || '').match(/matrix3d\(([^,]+)/) || [])[1];
{
  await open('shell&agent&admin', 1440, 900);
  const lay = await js(`(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); const v = r('.kpm-bay .vanc'), q = r('.kpm-bay .qc'), gv = r('.kpm-bay .gui.van'), gq = r('.kpm-bay .gui.q');
    let n = document.querySelector('.kpm-bay').parentElement, scrollers = 0;
    for (; n && n !== document.body; n = n.parentElement) if (/(auto|scroll)/.test(getComputedStyle(n).overflowY) && n.scrollHeight > n.clientHeight + 1) scrollers++;
    return { side: Math.abs(v.top - q.top) < 2 && q.left > v.right, panelsOver: gv.bottom <= v.top + 1 && gq.bottom <= q.top + 1, scrollers,
      switch: [...document.querySelectorAll('button')].some(b => /^(Saleable|Quarantine)/.test(b.textContent.trim())) }; })()`);
  step('v4-1. PC: no switch; two chests side by side, each panel standing on its own lid; the chest scrolls with the page (one scroller)', lay.side && lay.panelsOver && !lay.switch && lay.scrollers === 1, lay);
  await tap(await at('.kpm-bay .gui.q .slot.has', 0)); await sleep(300);
  const q = await js(`({ said: document.querySelector('.kpm-bay .gui.q .say').innerText, specks: getComputedStyle(document.querySelector('.kpm-bay .qc .specks i')).animationName,
    sign: getComputedStyle(document.querySelector('.kpm-bay .chest.hazard .sign svg')).animationName, glow: [...document.querySelectorAll('.kpm-bay .qc *')].some(e => getComputedStyle(e).boxShadow !== 'none' || getComputedStyle(e).filter !== 'none') })`);
  step('v4-2. the crate: a tap tells shop + reason; the specks rise and the sign pulses; no glow', /Rusak \/ Basah · dari Toko Sumber Rejeki/.test(q.said) && q.specks === 'kpmSpeck' && q.sign === 'kpmSignPulse' && !q.glow, q);
  await shoot('v4-chests-1440');
  const nb = await at('.kpm-nbBtn .kpm-nb');
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: nb.x, y: nb.y }); await sleep(900);
  const hov = await js(`({ cover: getComputedStyle(document.querySelector('.kpm-nb .cover')).transform, riffle: document.querySelector('.kpm-nb').getAnimations({ subtree: true }).filter(a => a.animationName === 'kpmRiffle').length })`);
  await shoot('v4-shelf-hover-1440');
  step('v4-3. the shelf book on hover: the cover swings open and the three leaves riffle', lead(hov.cover) < 0 && hov.riffle === 3, hov);
  await tap(nb); await sleep(120);
  const f1 = await js(`document.querySelector('.kpm-ob')?.className || ''`);
  await sleep(1400);
  const ob = await js(`(() => { const b = document.querySelector('.kpm-ob'), r = b.getBoundingClientRect(); return { cls: b.className, w: Math.round(r.width), h: Math.round(r.height),
    rows: Math.round(b.querySelector('.face.in .rows').getBoundingClientRect().height), tabs: [...b.querySelectorAll('.tab2')].map(t => t.innerText.trim()).join('|'),
    left: b.querySelector('.face.in .page h3')?.innerText, right: b.querySelector('.half .page h3')?.innerText, dialog: b.getAttribute('role'), tilt: getComputedStyle(b.querySelector('.book2')).transform }; })()`);
  await shoot('v4-book-open-1440');
  step('v4-4. a press: the book flies up SHUT, then opens straight at one fixed size (900 x 560), six 52 px lines, two ribbons, list | entry',
    /shut/.test(f1) && ob.cls === 'kpm-ob' && ob.w === 900 && ob.h === 560 && ob.rows === 312 && /^PENJUALAN · 3\|SAMPEL · \d+$/.test(ob.tabs) &&
    /PENJUALAN HARI INI/i.test(ob.left) && /TOKO SUMBER REJEKI/i.test(ob.right) && ob.dialog === 'dialog' && ob.tilt === 'none', { f1, ...ob });
  await tap(await rectNow('.kpm-ob .tab2[data-sec="samples"]')); await sleep(600);
  const sec = await js(`document.querySelector('.kpm-ob .face.in .page h3')?.innerText`);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(1300);
  const shut = await js(`({ gone: !document.querySelector('.kpm-ob'), focus: document.activeElement?.className })`);
  step('v4-5. the Sampel ribbon turns to its section; Escape shuts the cover and it flies back, focus back on the book', /SAMPEL HARI INI/i.test(sec) && shut.gone && shut.focus === 'kpm-nbBtn', { sec, ...shut });
}
{
  await open('shell&agent&admin', 430, 930);
  const ph = await js(`(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); const gv = r('.kpm-bay .gui.van'), v = r('.kpm-bay .vanc'), q = r('.kpm-bay .qc'), gq = r('.kpm-bay .gui.q');
    return { order: gv.bottom <= v.top + 1 && Math.abs(v.top - q.top) < 2 && gq.top >= q.bottom - 1, over: document.documentElement.scrollWidth > innerWidth }; })()`);
  await shoot('v4-chests-430');
  await tap(await at('.kpm-nbBtn .kpm-nb')); await sleep(1700);
  const one = await js(`({ faceIn: +getComputedStyle(document.querySelector('.kpm-ob .face.in')).opacity, w: Math.round(document.querySelector('.kpm-ob').getBoundingClientRect().width), list: document.querySelector('.kpm-ob .half .page h3')?.innerText })`);
  await tap(await rectNow('.kpm-ob .half .rows button', 0)); await sleep(700);
  const ent = await js(`({ h3: document.querySelector('.kpm-ob .half .page h3')?.innerText, back: document.querySelector('.kpm-ob .back')?.innerText })`);
  await shoot('v4-book-430');
  step('v4-6. phone: goods panel, the two chests side by side, the quarantine panel; the book is one page, an entry turns to its lines with "‹ Kembali ke daftar"',
    ph.order && !ph.over && one.faceIn === 0 && one.w === 398 && /PENJUALAN HARI INI/i.test(one.list) && /TOKO SUMBER REJEKI/i.test(ent.h3) && /KEMBALI KE DAFTAR/i.test(ent.back), { ...ph, ...one, ...ent });
}
{
  await open('shell&agent&admin&lite', 430, 930);
  await tap(await at('.kpm-nbBtn .kpm-nb')); await sleep(150);
  const lt = await js(`({ cls: document.querySelector('.kpm-ob')?.className, specks: getComputedStyle(document.querySelector('.kpm-bay .qc .specks')).display,
    running: [...document.querySelectorAll('.kpm-ob, .kpm-bay, .kpm-shelf')].flatMap(e => e.getAnimations({ subtree: true })).filter(a => a.playState === 'running').length })`);
  await shoot('v4-book-lite-430');
  step('v4-7. Lite Mode: the book is simply open at once, the specks are gone, nothing moves', lt.cls === 'kpm-ob' && lt.specks === 'none' && lt.running === 0, lt);
}

step('no page errors anywhere in the walk', errors.length === 0, errors.slice(0, 4));
console.log(`\n${results.filter(r => r.pass).length}/${results.length} pass`);
ws.close(); chrome.kill();
await sleep(1500);
try { fs.rmSync(PROFILE, { recursive: true, force: true }); } catch { /* the browser still holds it; removed before the vault commit */ }
