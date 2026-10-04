/* 2026-10-04 END-TO-END TEST of the four Journey map commits (kpm 41e308b crowd + selling scene, aa7b1d3 EOD approved =
   off the map, 64c4c5e owner row + pressed man's tags/road + small Expedition on fullscreen, 7b8002e pressed = only his
   shops, pen = fade, red flags, whole team on fullscreen) on the PRODUCTION lab build (kpm dist-ponderlab/,
   `npx vite build --config tools/ponder-lab.config.mjs`), at 1440 and at 390 with the touch media (lessons 2026-10-03).
   Plus the break cases (lab flags &nobody &pair &nopin &noround &eodwait). Every check lands in results.json as
   { name, pass, data }; every frame is deleted before it is shot (lessons 2026-09-22).
   Usage: node test-journey.mjs [only-section,...]   sections: pc, moment, break, phone */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../../kpm-inventory-main/dist-ponderlab');
const ONLY = (process.argv[2] || '').split(',').filter(Boolean);
const want = (s) => !ONLY.length || ONLY.includes(s);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => {
  const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); });
}).listen(4200);
const LAB = 'http://localhost:4200/tools/ponder-lab.html?shell&journey&exp&admin&visits';
const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9410',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9410/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
let where = 'start';
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push(where + ': ' + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 240));
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errs.push(where + ': console: ' + JSON.stringify(d.params.args.map((a) => a.value ?? a.description)).slice(0, 240));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push(where + ': eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 240)); return r.result?.result?.value; };
const shot = async (file, clip, scale = 1) => {
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });
  const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale } } : {}) });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const waitFor = async (expr, ms = 15000) => { for (let t = 0; t < ms; t += 150) { if (await js(expr)) return true; await sleep(150); } return false; };
const load = async (flags = '') => {
  where = flags || 'base';
  await send('Page.navigate', { url: 'about:blank' }); await sleep(100);
  await js(`try { localStorage.clear() } catch {} 1`);
  await send('Page.navigate', { url: LAB + flags });
  await waitFor('!!document.querySelector(".kx-keys .k-full")', 20000); await sleep(1800);
  await js(`try { localStorage.removeItem('tripBuilderCache') } catch {} 1`);
};
const click = (sel, re) => js(`(() => { const e = [...document.querySelectorAll(${JSON.stringify(sel)})].find((x) => ${re ? `${re}.test(x.textContent)` : 'true'} && x.offsetParent !== null); if (!e) return false; e.click(); return true; })()`);
const zoom = async (dir, n = 1) => { for (let k = 0; k < n; k++) { await js(`document.querySelector('.leaflet-control-zoom-${dir}')?.click(); 1`); await sleep(900); } await sleep(500); };
const clipOf = (sel) => js(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, width: b.width, height: b.height }; })()`);
const fullscreen = async () => { await js(`[...document.querySelectorAll('.k-full')].find((b) => b.offsetParent)?.click(); 1`); await sleep(1500); };

/* the whole map in one read */
const STATE = `(() => { const R = (e) => e.getBoundingClientRect();
  const hit = (a, c) => a.left < c.right - 0.5 && a.right > c.left + 0.5 && a.top < c.bottom - 0.5 && a.bottom > c.top + 0.5;
  const box = R(document.querySelector('.kx-map'));
  const inMap = (b) => b.right > box.left && b.left < box.right && b.bottom > box.top && b.top < box.bottom;
  const chests = [...document.querySelectorAll('.leaflet-marker-icon > .kx-c5')];
  const visChests = chests.filter((e) => inMap(R(e)));
  const slots = [...document.querySelectorAll('.kx-slot .cnt')];
  const men = [...document.querySelectorAll('.leaflet-marker-icon > .kx-sm')];
  const bodyR = men.map((m) => R(m.querySelector('.body svg') || m.querySelector('.body')));
  const artR = visChests.flatMap((e) => [R(e.querySelector('.art')), ...(e.querySelector('.sign5') ? [R(e.querySelector('.sign5'))] : [])]);
  const manOnChest = bodyR.filter((b) => inMap(b) && artR.some((c) => hit(b, c))).length;
  let manOnMan = 0; bodyR.forEach((a, i) => bodyR.forEach((b, j) => { if (i < j && hit(a, b)) manOnMan++; }));
  const inBubbles = slots.reduce((n, e) => n + +e.dataset.n, 0);
  const others = chests.filter((e) => !e.classList.contains('mine'));
  return { chests: chests.length, inBubbles, total: chests.length + inBubbles, bubbles: slots.length,
    mine: chests.filter((e) => e.classList.contains('mine')).length,
    tags: chests.map((e) => e.querySelector('.kx-otag')?.textContent).filter(Boolean),
    othersFaded: others.length ? others.every((e) => +getComputedStyle(e).opacity < .3) : null, othersShown: others.length,
    men: men.map((m) => m.querySelector('.tag')?.textContent.trim() + (m.classList.contains('dim') ? ' (dim)' : '') + (m.classList.contains('sell') ? ' (sell)' : '')),
    figs: document.querySelectorAll('.kx-fig').length, crowds: document.querySelectorAll('.kx-crowd').length,
    manOnChest, manOnMan, road: document.querySelectorAll('path.kx-road').length, roadPts: (() => { const p = document.querySelector('path.kx-road'); return p ? (p.getAttribute('d').match(/[ML]/g) || []).length : 0; })(),
    arrows: document.querySelectorAll('.kx-arrow').length, focus: !!document.querySelector('.kx-map.kx-focus'),
    sw: [...document.querySelectorAll('.kx-roadsw button')].filter((b) => b.offsetParent).map((b) => b.textContent + ':' + b.getAttribute('aria-pressed')).join(' '),
    redFlags: document.querySelectorAll('.leaflet-marker-icon > .kx-c5 > .kx-free').length, bubbleFlags: document.querySelectorAll('.kx-slot > .kx-free').length,
    head: document.querySelector('.kx-panel .kx-ph')?.textContent || null,
    rows: [...document.querySelectorAll('.kx-panel .kx-row')].map((e) => e.querySelector('.kx-nm')?.textContent + ' | ' + e.querySelector('.kx-led')?.textContent + (e.classList.contains('off') ? ' (off)' : '') + (e.getAttribute('aria-pressed') === 'true' ? ' (pressed)' : '')),
    mapSize: [Math.round(box.width), Math.round(box.height)], tilesGrey: (() => { const t = [...document.querySelectorAll('.leaflet-tile-loaded')].filter((e) => inMap(R(e))); return t.length; })() }; })()`;
const st = () => js(STATE);
const results = [];
const check = (name, pass, data) => { results.push({ name, pass: !!pass, data }); console.log((pass ? 'PASS ' : 'FAIL ') + name + '  ' + JSON.stringify(data).slice(0, 300)); };
const tagNums = (tags) => tags.map((t) => +t.split('·')[1]).sort((a, b) => a - b);
/* every tag seen from here zooming in step by step: a tag hides inside a bubble (his chest + himself cluster until z16)
   or leaves the frame as the zoom grows, so one frame never holds them all */
const tagUnion = async (steps = 4) => { const seen = new Set(); for (let k = 0; k <= steps; k++) { (await st()).tags.forEach((t) => seen.add(t)); if (k < steps) await zoom('in', 1); } return [...seen]; };
/* the way he would open a bubble: tap it (markercluster zooms onto it) - from the pressed man's own frame, so his stops
   stay in view. Stop 5 is where Budi sells: his chest and Budi himself share one bubble until zoom 16 */
const bubbleUnion = async (taps = 4) => {
  const seen = new Set(); const rec = async () => (await st()).tags.forEach((t) => seen.add(t));
  await rec();
  for (let k = 0; k < taps; k++) {
    const hit = await js(`(() => { const box = document.querySelector('.kx-map').getBoundingClientRect(); const m = [...document.querySelectorAll('.kx-slot')].map((e) => e.closest('.leaflet-marker-icon')).find((m) => { const b = m.getBoundingClientRect(); return b.left > box.left && b.right < box.right && b.top > box.top && b.bottom < box.bottom; });
      if (!m) return false; m.dispatchEvent(new MouseEvent('click', { bubbles: true })); return true; })()`);
    if (!hit) break; await sleep(1400); await rec();
  }
  return [...seen];
};
const seq1 = (ns) => ns.every((n, i) => n === i + 1);
const SHOPS = 32;

await send('Page.enable'); await send('Runtime.enable');
const pc = async () => {
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setTouchEmulationEnabled', { enabled: false });
  await send('Emulation.setEmulatedMedia', { features: [] });
};
const phone = async () => {
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
};

if (want('pc')) {
  await pc();
  /* 1 · zoomed out: men on bubbles, counts right, the owner listed with his title */
  await load('&boss');
  let s = await st();
  check('PC page: every shop counted (chests + bubble counts = 32)', s.total === SHOPS, { total: s.total, chests: s.chests, inBubbles: s.inBubbles });
  check('PC owner row = name + title', s.rows.some((r) => /^AldiT1 · OVERSEER/.test(r)), s.rows);
  check('PC panel header counts 5 out (4 men + owner; Cahyo seen yesterday)', /5 out/.test(s.head), s.head);
  await fullscreen(); await zoom('out', 1);
  s = await st();
  check('PC zoomed out: men stand on bubbles as a crowd, none loose, 5 figures', s.crowds > 0 && s.figs === 5 && s.men.length === 0, { crowds: s.crowds, figs: s.figs, loose: s.men });
  check('PC zoomed out: every shop counted', s.total === SHOPS, { total: s.total });
  await shot('pc-out.png');
  /* 2 · zoomed in: every man at his spot, never on a chest or on another man */
  /* zoomed in where men are: the camera flies to Budi's shop at z16 (Ari, the owner and Budi within the frame) */
  await load('&boss&tick&focus=' + encodeURIComponent('Toko Sinar Abadi')); await fullscreen(); await sleep(4000);
  s = await st();
  check('PC zoomed in (fullscreen, z16): at least 2 men in view, no man on a chest, no man on a man', s.men.length >= 2 && s.manOnChest === 0 && s.manOnMan === 0 && s.bubbles === 0, { men: s.men, manOnChest: s.manOnChest, manOnMan: s.manOnMan, bubbles: s.bubbles });
  await shot('pc-in.png');

  /* 3 · EOD: approved = off the map + "Day closed"; sent but pending = still on */
  await load('&eod');
  s = await st();
  const riniA = s.rows.find((r) => /^Rini/.test(r));
  await fullscreen(); await zoom('out', 1); const sOut = await st();
  check('EOD approved: Rini off the map, her row says Day closed', /Day closed/.test(riniA) && sOut.figs === 3, { riniA, figs: sOut.figs, head: s.head });
  await load('&eodwait');
  s = await st();
  const riniW = s.rows.find((r) => /^Rini/.test(r));
  await fullscreen(); await zoom('out', 1); const sW = await st();
  check('EOD sent, not approved: Rini still on the map', !/Day closed/.test(riniW) && sW.figs === 4, { riniW, figs: sW.figs });

  /* 4 · press Budi: only his shops, tags 1..n, road + arrows, All shops, tap again = everything back */
  await load('');
  await click('.kx-panel .kx-row', /Budi/); await sleep(1500);
  s = await st();
  const nT = tagNums(s.tags);
  check('Press Budi: only his shops on the map (chests + bubbles = 8, his round)', s.total === 8 && s.othersShown === 0, { total: s.total, chests: s.chests, inBubbles: s.inBubbles, othersShown: s.othersShown });
  check('Press Budi: road + arrows from him through his stops (9 points, 8 arrows)', s.road === 1 && s.roadPts === 9 && s.arrows === 8, { road: s.road, roadPts: s.roadPts, arrows: s.arrows });
  check('Press Budi: switch shows Today pressed', s.sw === 'Today:true All shops:false', s.sw);
  const lines = await js(`(() => ({ march: [...document.querySelectorAll('path.kx-march')].map((p) => +(p.getAttribute('stroke-opacity') ?? 1)), targets: [...document.querySelectorAll('.kx-target')].map((t) => +(t.closest('.leaflet-marker-icon').style.opacity || 1)) }))()`);
  check('Press Budi: the other men\'s march lines and target rings fade (one at full strength: his)', lines.march.filter((o) => o === 1).length <= 1 && lines.march.filter((o) => o < 0.5).length >= 1 && lines.targets.filter((o) => o === 1).length <= 1, lines);
  await shot('pc-budi-today.png', await clipOf('.kx-map'));
  let u = await bubbleUnion(4);
  check('Press Budi, zooming in: his tags read BS · 1..8, no gap, no extra', u.length === 8 && seq1(tagNums(u)) && u.every((t) => /^BS/.test(t)), { union: u });
  await shot('pc-budi-in.png', await clipOf('.kx-map'));
  await click('.kx-roadsw button', /All/); await sleep(1000);
  s = await st();
  await zoom('out', 4); u = await bubbleUnion(4);
  check('Budi All shops: tags 1..8, 7 arrows (the road starts at stop 1, not at him)', u.length === 8 && seq1(tagNums(u)) && s.arrows === 7, { union: u, arrows: s.arrows, sw: s.sw });
  await click('.kx-panel .kx-row', /Budi/); await sleep(1200);
  s = await st();
  check('Tap Budi again: everything back (32 shops, no road, no tags, no fade)', s.total === SHOPS && s.road === 0 && s.tags.length === 0 && !s.focus, { total: s.total, road: s.road, tags: s.tags.length, focus: s.focus });
  /* the next man pressed opens on Today, not on the switch the last one left at All shops */
  await click('.kx-panel .kx-row', /Ari/); await sleep(1200);
  s = await st();
  check('Press Ari next: opens on Today (switch does not carry over)', s.sw === 'Today:true All shops:false', s.sw);
  await click('.kx-panel .kx-row', /Ari/); await sleep(800);

  /* 5 · the Paintbrush pen: others FADE (not hidden), a painted shop changes owner */
  await load('');
  await zoom('in', 3);
  await click('.k-brush'); await sleep(500);
  await click('.kx-pen', /Budi/); await sleep(1200);
  s = await st();
  check('Pen Budi: others fade, nothing hidden (32 shops), tags on his', s.total === SHOPS && s.othersFaded === true && s.mine > 0, { total: s.total, othersShown: s.othersShown, othersFaded: s.othersFaded, mine: s.mine, tags: s.tags });
  await shot('pc-pen.png', await clipOf('.kx-map'));
  const before = s.mine;
  /* paint one of the others' shops: its ring turns Budi's colour at once. Today's TAGS come from his round, which the app
     rebuilds from the customers snapshot - the lab has no Firestore, so the tag is checked under "All shops", which reads
     the paint straight away */
  const budiC = await js(`getComputedStyle(document.querySelector('.leaflet-marker-icon > .kx-c5.mine')).getPropertyValue('--c').trim()`);
  const painted = await js(`(() => { const box = document.querySelector('.kx-map').getBoundingClientRect(); const e = [...document.querySelectorAll('.leaflet-marker-icon > .kx-c5:not(.mine)')].map((c) => c.parentElement).find((m) => { const b = m.getBoundingClientRect(); return b.top > box.top + 120 && b.bottom < box.bottom - 60 && b.left > box.left + 80 && b.right < box.right - 220; });
    if (!e) return null; window.__paintAt = e.style.transform; const was = getComputedStyle(e.firstElementChild).getPropertyValue('--c').trim(); e.dispatchEvent(new MouseEvent('click', { bubbles: true })); return was; })()`);
  await sleep(1200);
  const nowC = await js(`(() => { const m = [...document.querySelectorAll('.leaflet-marker-icon')].find((x) => x.style.transform === window.__paintAt && x.firstElementChild?.classList.contains('kx-c5')); return m ? getComputedStyle(m.firstElementChild).getPropertyValue('--c').trim() : null; })()`);
  check('Pen Budi: a painted shop changes owner (its ring turns his colour)', painted && nowC === budiC && painted !== budiC, { was: painted, now: nowC, budi: budiC });
  await click('.kx-roadsw button', /All/); await sleep(1000); s = await st();
  check('Pen Budi + All shops: the painted shop wears his tag (one more than before)', s.mine === before + 1, { before, after: s.mine, tags: s.tags });

  /* 6 · red flags on nobody's shops and on the bubbles that hold one */
  await load('&free');
  s = await st();
  check('Free: red flag on bubbles holding a nobody-shop (zoomed out)', s.bubbleFlags > 0 && s.redFlags + s.bubbleFlags > 0, { redFlags: s.redFlags, bubbleFlags: s.bubbleFlags });
  await shot('pc-free.png', await clipOf('.kx-map'));
  await fullscreen(); await zoom('in', 2); s = await st();
  const grey = await js(`[...document.querySelectorAll('.leaflet-marker-icon > .kx-c5')].filter((e) => getComputedStyle(e).getPropertyValue('--c').trim().toLowerCase() === '#6a645c').length`);
  check('Free, zoomed in: a red flag on every nobody-shop chest (grey ring) and on no other', s.redFlags > 0 && grey === s.redFlags, { redFlags: s.redFlags, greyRings: grey, bubbleFlags: s.bubbleFlags, chests: s.chests });
  await shot('pc-free-in.png');
  await js(`document.querySelector('.kx-dock .k-full, .kx-keys .k-full')?.click(); 1`); await sleep(800);

  /* 7 · fullscreen PC: whole team under the keys, not-out dimmed */
  await load('&boss');
  await fullscreen();
  const fs1 = await js(`(() => { const m = document.querySelector('.kx-mini'); if (!m) return null; const b = m.getBoundingClientRect(); const keys = [...document.querySelectorAll('.kx-keys > button')].filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect());
    return { rows: m.querySelectorAll('.kx-mrow').length, dim: m.querySelectorAll('.kx-mrow.off').length, head: m.querySelector('header')?.textContent, underKeys: keys.every((k) => k.bottom <= b.top + 1), rect: [b.left, b.top, b.right, b.bottom].map(Math.round), fitsScreen: b.bottom <= innerHeight }; })()`);
  check('Fullscreen PC: whole team (6) under the keys, Cahyo dimmed', fs1 && fs1.rows === 6 && fs1.dim === 1 && fs1.underKeys && fs1.fitsScreen, fs1);
  await click('.kx-mrow', /Budi/); await sleep(1300);
  s = await st();
  check('Fullscreen PC: a mini row press = only his shops + road', s.total === 8 && s.road === 1, { total: s.total, road: s.road });
  await shot('pc-fullscreen.png');
}

if (want('moment')) {
  await pc();
  /* 8 · the seller holds the coin; the moment plays once; Lite = front face, nothing running */
  await load('&tick&focus=' + encodeURIComponent('Toko Sinar Abadi'));
  await sleep(4500);
  const scene = await js(`(() => { const sm = document.querySelector('.kx-sm.sell'); if (!sm) return null; const r = (e) => e.getBoundingClientRect();
    const b = r(sm.querySelector('.body svg')), c = r(sm.querySelector('.kpm-coin')), t = r(sm.querySelector('.tag'));
    return { coinOverHead: +(b.top - c.bottom).toFixed(1), tagOverCoin: +(c.top - t.bottom).toFixed(1), clip: { x: b.left - 40, y: t.top - 30, width: 150, height: b.bottom - t.top + 60 } }; })()`);
  const s = await st();
  check('Seller (Budi at Toko Sinar Abadi): holds the coin over his head, tag above it, not on the chest', scene && scene.coinOverHead >= 0 && scene.tagOverCoin >= 0 && s.manOnChest === 0, { scene: scene && { ...scene, clip: undefined }, manOnChest: s.manOnChest });
  if (scene) await shot('pc-seller.png', scene.clip, 3);
  await load('&tick&sell&focus=' + encodeURIComponent('Warung Bu Darmi'));
  await sleep(3000);
  const moments = {};
  let rebuilt = 0;
  for (const t of [0, 600, 1050, 1500]) {
    for (let tries = 0; tries < 4; tries++) {   /* the lab's tick rebuilds markers every 2.5 s: a frame caught mid-rebuild is retaken from a fresh moment */
      const ok = await waitFor(`(() => { const e = document.querySelector('.kx-sm.sell.play'); if (!e || e.dataset.seen) return false;
        const an = e.getAnimations({ subtree: true }).filter((a) => /kx-coin|kx-cut/.test(a.animationName)); if (an.length < 4) return false;
        e.dataset.seen = 1; window.__frozen = e; e.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = ${t}; }); return true; })()`, 9000);
      await sleep(40);
      const m = ok && await js(`(() => { const sm = window.__frozen, r = (e) => e.getBoundingClientRect(); const b = r(sm.querySelector('.body svg')), c = r(sm.querySelector('.kpm-coin')), tg = r(sm.querySelector('.tag'));
        return { alive: sm.isConnected, coinY: +(b.top - c.bottom).toFixed(1), clip: { x: b.left - 40, y: tg.top - 30, width: 150, height: b.bottom - tg.top + 60 } }; })()`);
      if (!m?.alive) { rebuilt++; continue; }
      await shot(`m-${t}.png`, m.clip, 3);
      if (!(await js('window.__frozen.isConnected'))) { rebuilt++; continue; }
      moments[t] = { coinY: m.coinY };
      break;
    }
  }
  check('Selling moment: 4 frozen frames, each on one live element (0 / 600 / 1050 / 1500 ms)', [0, 600, 1050, 1500].every((t) => moments[t]), { moments, rebuiltRetakes: rebuilt });
  /* plays once: after the moment the still picture comes back (no .play) and stays until the next sale */
  await waitFor(`!document.querySelector('.kx-sm.sell.play') && !!document.querySelector('.kx-sm.sell')`, 9000);
  const still = await js(`(() => { const e = document.querySelector('.kx-sm.sell'); return e && { play: e.classList.contains('play'), running: e.getAnimations({ subtree: true }).filter((a) => a.playState === 'running' && /kx-coin|kx-cut/.test(a.animationName)).length }; })()`);
  check('Selling moment ends: back to the still held coin, no moment running', still && !still.play && still.running === 0, still);
  await js(`document.documentElement.classList.add('lite-mode'); 1`); await sleep(400);
  const lite = await js(`(() => { const all = document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.target?.closest?.('.kx-map')); return { running: all.length, names: [...new Set(all.map((a) => a.animationName || a.constructor.name))].slice(0, 6) }; })()`);
  check('Lite: 0 animations running on the map', lite.running === 0, lite);
  const lc = await js(`(() => { const sm = document.querySelector('.kx-sm.sell'); if (!sm) return null; const b = sm.querySelector('.body svg').getBoundingClientRect(), t = sm.querySelector('.tag').getBoundingClientRect(); return { x: b.left - 40, y: t.top - 30, width: 150, height: b.bottom - t.top + 60 }; })()`);
  if (lc) await shot('lite-seller.png', lc, 3);
  await js(`document.documentElement.classList.remove('lite-mode'); 1`);
}

if (want('break')) {
  await pc();
  /* B1 · nobody out today */
  await load('&nobody');
  let s = await st();
  await fullscreen();
  const mini = await js(`(() => { const m = document.querySelector('.kx-mini'); return m && { rows: m.querySelectorAll('.kx-mrow').length, dim: m.querySelectorAll('.kx-mrow.off').length, head: m.querySelector('header')?.textContent }; })()`);
  await zoom('out', 1); const s2 = await st();
  check('Break · nobody out: no man on the map, panel 0 out, fullscreen lists all 5 dimmed, shops still 32', s2.figs === 0 && s2.men.length === 0 && /0 out/.test(s.head) && mini?.rows === 5 && mini?.dim === 5 && s.total === SHOPS, { head: s.head, mini, figs: s2.figs, total: s.total });
  await shot('break-nobody.png');
  /* only the owner out (his phone pings from the office before the team is out): the team camera must not dive on him */
  await load('&nobody&boss');
  s = await st();
  check('Break · only the owner out: the camera keeps the shops in view (32), no dive to zoom 16 on him', s.total === SHOPS && /1 out/.test(s.head), { total: s.total, head: s.head });
  await shot('break-owner-only.png', await clipOf('.kx-map'));
  /* B2 · a salesman with no shops today (Ari's all due another day) */
  await load('&noround');
  s = await st();
  await click('.kx-panel .kx-row', /Ari/); await sleep(1500);
  s = await st();
  const ariRow = s.rows.find((r) => /^Ari/.test(r));
  /* his shops are all due another day (14-day round) but he SOLD at three of them today: the road runs him -> those
     three; Journey Plan draws only today's route, so count the chests that wear his tag against the road's stops */
  const un = await bubbleUnion(3);
  check('Break · no round today, 3 sales off-schedule: every stop on Ari\'s road has a chest on the map', un.length === s.arrows, { stopsOnRoad: s.arrows, taggedChests: un, total: s.total, ariRow });
  await shot('break-noround.png', await clipOf('.kx-map'));
  /* B3 · shops with no pin */
  await load('&nopin');
  s = await st();
  /* the app's sanitizer (JourneyView customers memo, pre-existing) draws a pinless shop at Muntilan's centre, so 32 */
  check('Break · no pin: map loads, no crash (pinless shops drawn at the sanitizer\'s default spot)', s.total === SHOPS && !errs.some((e) => /nopin/.test(e)), { total: s.total, errs: errs.filter((e) => /nopin/.test(e)) });
  await click('.kx-panel .kx-row', /Budi/); await sleep(1500);
  s = await st();
  check('Break · no pin: Budi\'s road skips the two pinless stops (him + 6 pinned = 6 arrows)', s.road === 1 && s.arrows === 6, { tags: s.tags, arrows: s.arrows, total: s.total });
  await shot('break-nopin.png', await clipOf('.kx-map'));
  /* a pile of shops with no man on it must still spiderfy (the two pinless shops share one spot - the only way to reach each) */
  /* fly to a pinless shop (z16, no clusters), step out to 15, tap the bubble nearest the centre: the pile */
  await load('&nopin&tick&focus=' + encodeURIComponent('Toko Makmur')); await fullscreen(); await sleep(4000); await zoom('out', 1);
  const pile = await js(`(() => { const box = document.querySelector('.kx-map').getBoundingClientRect(), cx = box.left + box.width / 2, cy = box.top + box.height / 2;
    const m = [...document.querySelectorAll('.kx-slot')].map((e) => e.closest('.leaflet-marker-icon')).filter((m) => !m.querySelector('.kx-fig')).map((m) => { const b = m.getBoundingClientRect(); return { m, d: Math.hypot(b.left + 21 - cx, b.top + 21 - cy) }; }).sort((a, b) => a.d - b.d)[0];
    if (!m) return null; m.m.dispatchEvent(new MouseEvent('click', { bubbles: true })); return { n: m.m.querySelector('.cnt').dataset.n, d: Math.round(m.d) }; })()`);
  /* read the legs early and often: the lab's tick (2.5 s) re-draws the chests, and markercluster folds a spider back on any change */
  const legsAt = {};
  for (const t of [150, 400, 800, 1500]) { await sleep(t - (Object.keys(legsAt).pop() || 0)); legsAt[t] = await js(`[...document.querySelectorAll('path')].filter((p) => p.getAttribute('stroke') === '#222').length`); }
  const legs = Math.max(...Object.values(legsAt));
  check('Break · a pile of shops alone (the 2 pinless shops on one spot, no man) still spiderfies when tapped', legs > 0, { legsAt, pile });
  await shot('break-pile-spider.png');
  /* B4 · two men on one spot */
  await load('&pair&tick&focus=' + encodeURIComponent('Toko Sinar Abadi'));
  await sleep(4500);
  s = await st();
  check('Break · two men on one spot: side by side, never on each other or on a chest', s.manOnMan === 0 && s.manOnChest === 0, { men: s.men, manOnMan: s.manOnMan, manOnChest: s.manOnChest });
  await shot('break-pair.png', await clipOf('.kx-map'));
  /* B5 · pressing a man while the brush is on */
  await load('');
  await zoom('in', 2);
  await click('.k-brush'); await sleep(500);
  await click('.kx-pen', /Ari/); await sleep(800);
  await click('.kx-panel .kx-row', /Budi/); await sleep(1200);
  s = await st();
  const penSel = () => js(`[...document.querySelectorAll('.kx-pen.sel')].map((e) => e.textContent.trim()).join('|')`);
  let pen = await penSel();
  check('Break · press Budi while the Ari pen is on: the pen moves to Budi, so the tags on screen are the man the brush paints for', pen === 'Budi Santoso' && s.tags.length > 0 && s.tags.every((t) => /^BS/.test(t)), { pen, tags: s.tags.slice(0, 4), total: s.total, othersFaded: s.othersFaded });
  await shot('break-brush-press.png', await clipOf('.kx-map'));
  /* the other way round: Budi pressed, then the Ari pen */
  await click('.kx-pen', /Ari/); await sleep(1500);
  s = await st(); pen = await penSel();
  const ua = await tagUnion(3);
  check('Break · Ari pen picked while Budi is pressed: Ari\'s tags on screen (the camera goes back to the team)', pen === 'Ari Rahman' && s.road === 1 && ua.length > 0 && ua.every((t) => /^AR/.test(t)), { pen, road: s.road, union: ua });
  /* tap the pressed man again = everything back, his pen too */
  await click('.kx-panel .kx-row', /Ari/); await sleep(1000);
  await click('.kx-panel .kx-row', /Ari/); await sleep(1000);
  s = await st(); pen = await penSel();
  check('Break · tap him again: let go, pen off, 32 shops, no tags', s.tags.length === 0 && s.total === SHOPS && /Disable/.test(pen), { pen, tags: s.tags.length, total: s.total });
  /* B7 · the boss views ANOTHER day (Journey Plan's day picker) and presses Budi: the map holds that day's shops only */
  await load('');
  const day = await js(`(() => { const b = [...document.querySelectorAll('button[title]')].find((e) => /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/.test(e.title) && e.getAttribute('aria-pressed') === 'false' && !e.classList.contains('today')); if (!b) return null; b.click(); return b.title; })()`);
  await sleep(1200);
  const sDay = await st();
  await click('.kx-panel .kx-row', /Budi/); await sleep(1500);
  s = await st();
  check('Break · another day picked, Budi pressed: no road through shops that are not on the map', s.road === 0 || s.arrows + 1 <= s.total + 1, { day, shopsThatDay: sDay.total, total: s.total, tags: s.tags, road: s.road, arrows: s.arrows });
  await shot('break-otherday.png', await clipOf('.kx-map'));
  /* B6 · leaving fullscreen with a man pressed */
  await load('');
  await fullscreen();
  await click('.kx-mrow', /Budi/); await sleep(1200);
  await js(`[...document.querySelectorAll('.k-full')].find((b) => b.offsetParent)?.click(); 1`); await sleep(1500);
  s = await st();
  const budiRow = s.rows.find((r) => /^Budi/.test(r));
  check('Break · exit fullscreen with Budi pressed: map back to 500 px, still only his shops, his row pressed, switch shown', s.mapSize[1] === 500 && s.total === 8 && /pressed/.test(budiRow) && /Today/.test(s.sw), { mapSize: s.mapSize, total: s.total, budiRow, sw: s.sw });
  await shot('break-exitfs.png', await clipOf('.kx-map'));
}

if (want('phone')) {
  await phone();
  await load('&boss');
  const hn = await js(`matchMedia('(hover: none)').matches`);
  check('Phone: touch media live ((hover: none) true)', hn, hn);
  let s = await st();
  /* the phone strip frames ONE man's day (Budi, the picked card), not the whole team - so not every shop is in view */
  const pg = await js(`({ overflow: document.documentElement.scrollWidth - innerWidth, card: document.querySelector('.kx-travel .kx-nm')?.textContent })`);
  check('Phone page: 160 px strip framing the picked man, his card under it, no sideways scroll', s.mapSize[1] === 160 && pg.overflow === 0 && /Budi/.test(pg.card), { mapSize: s.mapSize, inView: s.total, ...pg });
  await shot('ph-page.png');
  await fullscreen(); await zoom('out', 2);
  s = await st();
  check('Phone zoomed out: crowds, 5 figures, none loose', s.figs === 5 && s.men.length === 0, { figs: s.figs, loose: s.men, crowds: s.crowds });
  await shot('ph-out.png');
  const bar = await js(`(() => { const m = document.querySelector('.kx-mbar'); if (!m) return null; const r = (e) => e && e.getBoundingClientRect(); const b = r(m), z = r(document.querySelector('.leaflet-control-zoom')), d = r(document.querySelector('.kx-dock'));
    const hit = (a, c) => a && c && a.left < c.right && a.right > c.left && a.top < c.bottom && a.bottom > c.top;
    return { chips: m.querySelectorAll('.kx-mchips button').length, dimChips: m.querySelectorAll('.kx-mchips button.off').length, line: m.querySelector('.kx-mline')?.textContent, overZoom: hit(b, z), overDock: hit(b, d), overflow: document.documentElement.scrollWidth - innerWidth }; })()`);
  check('Phone fullscreen: 6 chips (Cahyo dim) + one line, clear of the zoom keys and the dock', bar && bar.chips === 6 && bar.dimChips === 1 && !bar.overZoom && !bar.overDock && bar.overflow === 0, bar);
  await click('.kx-mchips button', /BS/); await sleep(1300);
  s = await st();
  check('Phone fullscreen: chip press = only Budi\'s shops + road + Today/All', s.total === 8 && s.road === 1 && /Today/.test(s.sw), { total: s.total, road: s.road, sw: s.sw });
  await shot('ph-budi.png');
  const sw = await js(`(() => { const s = document.querySelector('.kx-mbar .kx-roadsw'); if (!s) return null; const b = s.getBoundingClientRect(), d = document.querySelector('.kx-dock')?.getBoundingClientRect(), z = document.querySelector('.leaflet-control-zoom')?.getBoundingClientRect();
    const hit = (a, c) => a && c && a.left < c.right && a.right > c.left && a.top < c.bottom && a.bottom > c.top; return { overDock: hit(b, d), overZoom: hit(b, z), h: Math.round(b.height), btnH: Math.round(s.querySelector('button').getBoundingClientRect().height) }; })()`);
  check('Phone: the Today/All switch clears the dock and the zoom keys, buttons >= 32 px tall', sw && !sw.overDock && !sw.overZoom && sw.btnH >= 32, sw);
  const up = await bubbleUnion(4);
  s = await st();
  const spider = await js(`[...document.querySelectorAll('path')].filter((p) => p.getAttribute('stroke') === '#222').length`);
  check('Phone: tapping the bubble Budi sells in zooms in, never spiderfies him (no legs, no man on a chest, no bubble left)', spider === 0 && s.manOnChest === 0 && s.bubbles === 0 && s.men.some((m) => /BS.*sell/.test(m)), { spiderLegs: spider, manOnChest: s.manOnChest, bubbles: s.bubbles, men: s.men });
  check('Phone zoomed in with Budi pressed: tags BS · 1..8', up.length === 8 && seq1(tagNums(up)), { union: up });
  await shot('ph-budi-in.png');
  await click('.kx-mchips button', /BS/); await sleep(1000);
  s = await st();
  check('Phone: tap the chip again = everything back (no road, no tags, the others\' chests back)', s.road === 0 && s.tags.length === 0 && !s.focus && s.othersShown > 0, { total: s.total, road: s.road, othersShown: s.othersShown });
}

if (ONLY.includes('probe2')) {
  /* tap the bubble Budi sells in: does markercluster SPIDERFY it (identical points can never split by zoom)? */
  for (const dev of [pc, phone]) {
    await dev(); await load('');
    await click('.kx-panel .kx-row', /Budi/); await sleep(1500);
    if (dev === phone) { await fullscreen(); await click('.kx-mchips button', /BS/); await sleep(1500); }
    const Z = `(() => { const t = [...document.querySelectorAll('.leaflet-tile-loaded')].map((e) => +(e.src.match(/\\/(\\d+)\\/\\d+\\/\\d+/) || [])[1]).filter(Boolean); return Math.max(...t); })()`;
    for (let k = 0; k < 3; k++) {
      const before = await js(Z);
      const hit = await js(`(() => { const m = [...document.querySelectorAll('.kx-slot')].map((e) => e.closest('.leaflet-marker-icon')).find((m) => m.querySelector('.kx-fig')); if (!m) return null; m.dispatchEvent(new MouseEvent('click', { bubbles: true })); return m.querySelector('.cnt').dataset.n; })()`);
      await sleep(1600);
      const p = await js(`(() => { const R = (e) => { const b = e.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map(Math.round); };
        return { slots: [...document.querySelectorAll('.kx-slot')].map((e) => ({ n: e.querySelector('.cnt').dataset.n, op: e.closest('.leaflet-marker-icon').style.opacity })),
          legs: [...document.querySelectorAll('path')].filter((p) => p.getAttribute('stroke') === '#222').length,
          budi: [...document.querySelectorAll('.leaflet-marker-icon > .kx-sm')].filter((e) => /BS/.test(e.querySelector('.tag').textContent)).map((e) => ({ cls: e.className, body: R(e.querySelector('.body svg')) })),
          chest5: [...document.querySelectorAll('.leaflet-marker-icon > .kx-c5')].filter((e) => /· 5$/.test(e.querySelector('.kx-otag')?.textContent || '')).map((e) => ({ art: R(e.querySelector('.art')), sign: e.querySelector('.sign5') ? R(e.querySelector('.sign5')) : null })) }; })()`);
      console.log(dev === pc ? 'PC' : 'PHONE', 'tap', k, 'z', before, '->', await js(Z), 'tapped n=', hit, JSON.stringify(p));
      if (!hit) break;
    }
  }
}
if (ONLY.includes('probe')) {
  await pc(); await load('');
  await click('.kx-panel .kx-row', /Budi/); await sleep(1500);
  for (let k = 0; k < 6; k++) {
    const p = await js(`(() => { const z = document.querySelector('.leaflet-control-zoom-in'); const sl = [...document.querySelectorAll('.kx-slot')].map((e) => { const m = e.closest('.leaflet-marker-icon'); return { n: e.querySelector('.cnt').dataset.n, figs: m.querySelectorAll('.kx-fig').length, xy: m.style.transform }; });
      const c5 = [...document.querySelectorAll('.leaflet-marker-icon > .kx-c5')].map((e) => e.querySelector('.kx-otag')?.textContent + '@' + e.parentElement.style.transform);
      const men = [...document.querySelectorAll('.leaflet-marker-icon > .kx-sm')].map((e) => e.querySelector('.tag').textContent + '@' + e.parentElement.style.transform);
      return { zoomInDisabled: z.classList.contains('leaflet-disabled'), slots: sl, chests: c5, men, zoomAnim: document.querySelector('.leaflet-map-pane')?.style.transform }; })()`);
    console.log('step', k, JSON.stringify(p));
    await zoom('in', 1);
  }
}
const real = errs.filter((e) => !/favicon|ERR_FILE_NOT_FOUND|404/.test(e));
check('0 console errors / exceptions over the whole run', real.length === 0, real.slice(0, 8));
fs.writeFileSync(path.join(HERE, 'results' + (ONLY.length ? '-' + ONLY.join('-') : '') + '.json'), JSON.stringify(results, null, 1));
console.log(`\n${results.filter((r) => r.pass).length}/${results.length} pass`);
ws.close(); chrome.kill(); server.close(); await sleep(1200);
try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* Chrome still closing */ }
process.exit(0);
