/* Round 6 BUILT (kpm, 2026-10-03 23:xx): the real Journey Plan from the production lab build (kpm dist-ponderlab/,
   `npx vite build --config tools/ponder-lab.config.mjs`). At 1440 and 390 (phone = touch media too, lessons
   2026-10-03): zoomed out (crowds on bubbles, Rini's EOD sent = gone), zoomed in on a seller (Budi at Toko Sinar
   Abadi: 2 px clear of the chest, coin over his head, tag above the coin), the selling moment frozen at set times on
   Dewi (lab `&sell` replays it every 5 s; every frame from a FRESH moment - lessons 2026-09-30), the chest's rest read
   before and after, and Lite (0 animations running in the scene). */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '../../../../kpm-inventory-main/dist-ponderlab');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.webp': 'image/webp' };
const server = http.createServer((q, s) => {
  const f = path.join(DIST, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); s.end(b); });
}).listen(4198);
const BASE = 'http://localhost:4198/tools/ponder-lab.html?shell&journey&exp&admin&visits&eod';

const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9407',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9407/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 200));
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errs.push('console: ' + JSON.stringify(d.params.args.map((a) => a.value ?? a.description)).slice(0, 200));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errs.push('eval: ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 200)); return r.result?.result?.value; };
const shot = async (file, clip) => {   /* a clip is a close-up: x3, he judges pixel art zoomed in */
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });
  const s = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 3 } } : {}) });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const waitFor = async (expr, ms = 15000) => { for (let t = 0; t < ms; t += 150) { if (await js(expr)) return true; await sleep(150); } return false; };
const load = async (url) => { await send('Page.navigate', { url }); await waitFor('!!document.querySelector(".kx-keys .k-full")', 20000); await sleep(1500); };
/* the seller + his shop's chest, measured from the scene's own parts */
const SCENE = (sel, el) => `(() => { const sm = ${el || `document.querySelector(${JSON.stringify(sel)})`}; if (!sm) return null;
  const r = (e) => { const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom }; };
  const body = r(sm.querySelector('.body svg')), coin = r(sm.querySelector('.kpm-coin')), tag = r(sm.querySelector('.tag'));
  const chests = [...document.querySelectorAll('.leaflet-marker-icon .kx-c5:not(.kx-slot .kx-c5)')].map((e) => r(e));
  const near = chests.filter((c) => Math.abs(c.b - (body.b + 0)) < 12 && c.l > body.r - 4 && c.l - body.r < 20).sort((a, b) => a.l - b.l)[0] || null;
  return { body, coin, tag, chest: near, gapToChest: near ? +(near.l - body.r).toFixed(2) : null, feetVsChestBottom: near ? +(body.b - near.b).toFixed(2) : null,
    coinOverHead: +(body.t - coin.b).toFixed(2), tagClearOfCoin: +(coin.t - tag.b).toFixed(2), cls: sm.className,
    clip: near ? { x: Math.min(body.l, tag.l) - 30, y: tag.t - 30, width: Math.max(near.r, tag.r) - Math.min(body.l, tag.l) + 90, height: near.b - tag.t + 50 } : null }; })()`;
const out = { errs };

for (const [vp, w, h, dpr, mobile] of [['pc', 1440, 900, 1, false], ['phone', 390, 844, 2, true]]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: mobile ? 5 : 0 });
  await send('Emulation.setEmulatedMedia', { features: mobile ? [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] : [] });
  await send('Page.enable'); await send('Runtime.enable');
  const o = out[vp] = {};

  /* A · zoomed out */
  await load(BASE);
  o.hoverNone = await js(`matchMedia('(hover: none)').matches`);
  await js(`document.querySelector('.kx-keys .k-full').click(); 1`); await sleep(1500);
  for (let k = 0; k < (vp === 'pc' ? 1 : 2); k++) { await js(`document.querySelector('.leaflet-control-zoom-out').click(); 1`); await sleep(700); }
  await sleep(1500);
  o.out = await js(`(() => ({ crowds: document.querySelectorAll('.kx-crowd').length, figs: document.querySelectorAll('.kx-fig').length,
    crowdOnly: document.querySelectorAll('.kx-crowd-shadow').length, slots: document.querySelectorAll('.kx-slot').length, loosePeople: document.querySelectorAll('.kx-sm').length,
    figsWithPicture: [...document.querySelectorAll('.kx-fig')].filter((e) => getComputedStyle(e).backgroundImage.startsWith('url(')).length,
    tags: [...document.querySelectorAll('.kx-sm .tag')].map((e) => e.textContent).join(' | '),
    running: document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.target?.closest?.('.kx-crowd')).length }))()`);
  await shot(`out-${vp}.png`);

  /* B · zoomed in on Budi selling at Toko Sinar Abadi (state at), Rini's day closed */
  await load(BASE + '&tick&focus=' + encodeURIComponent('Toko Sinar Abadi'));
  await sleep(4500);
  o.panel = await js(`(() => { const t = document.querySelector('.kx-panel')?.textContent || ''; return { dayClosedCount: (t.match(/Day closed/gi) || []).length, len: t.length }; })()`);
  o.riniOnMap = await js(`[...document.querySelectorAll('.kx-sm .tag')].some((e) => /^RS/.test(e.textContent.trim()))`);
  o.budi = await js(SCENE('.kx-sm.sell'));
  await shot(`in-${vp}.png`);
  if (o.budi?.clip) await shot(`in-${vp}-scene.png`, o.budi.clip);

  /* C · the moment, on Dewi at Warung Bu Darmi: one frozen frame per fresh moment */
  if (vp === 'pc') {
    await load(BASE + '&tick&sell&focus=' + encodeURIComponent('Warung Bu Darmi'));
    await sleep(3000);
    o.moments = {};
    o.rebuilt = 0;
    for (const t of [0, 300, 600, 750, 900, 1050, 1500]) {
      for (let tries = 0; tries < 4; tries++) {
        /* refuse an element whose animations are not attached yet: freezing nothing reads as the first frame. Hold the
           frozen element itself: if the map rebuilds the marker mid-moment, a fresh copy would be measured instead */
        const ok = await waitFor(`(() => { const e = document.querySelector('.kx-sm.sell.play'); if (!e || e.dataset.seen) return false;
          const an = e.getAnimations({ subtree: true }).filter((a) => /kx-coin|kx-cut/.test(a.animationName)); if (an.length < 4) return false;
          e.dataset.seen = 1; window.__frozen = e; e.getAnimations({ subtree: true }).forEach((a) => { a.pause(); a.currentTime = ${t}; }); return true; })()`, 9000);
        await sleep(40);
        const m = ok ? await js(SCENE(null, 'window.__frozen')) : null;
        if (ok && !(await js('window.__frozen.isConnected'))) { o.rebuilt++; continue; }
        o.moments[t] = m && { coinOverHead: m.coinOverHead, coin: m.coin, gapToChest: m.gapToChest, arms: await js(`getComputedStyle(window.__frozen.querySelector('.pArms')).opacity`) };
        if (m?.clip) await shot(`m-${t}.png`, m.clip);
        if (!(await js('window.__frozen.isConnected'))) { o.rebuilt++; continue; }   // rebuilt while the frame was being taken
        break;
      }
    }
    /* the chest's rest position: before a moment, and after it has played and the still icon is back */
    await waitFor(`!document.querySelector('.kx-sm.sell.play') && !!document.querySelector('.kx-sm.sell')`, 9000);
    const restA = await js(SCENE('.kx-sm.sell'));
    await waitFor(`!!document.querySelector('.kx-sm.sell.play')`, 9000);
    await waitFor(`!document.querySelector('.kx-sm.sell.play') && !!document.querySelector('.kx-sm.sell')`, 9000);
    await sleep(300);
    const restB = await js(SCENE('.kx-sm.sell'));
    o.restMoved = restA && restB ? { chest: restA.chest && restB.chest ? ['l', 't', 'r', 'b'].map((k) => +(restB.chest[k] - restA.chest[k]).toFixed(2)) : null,
      body: ['l', 't', 'r', 'b'].map((k) => +(restB.body[k] - restA.body[k]).toFixed(2)) } : null;

    /* D · Lite: the held coin, front face, nothing running in the scene */
    await js(`document.documentElement.classList.add('lite-mode'); 1`); await sleep(400);
    o.lite = await js(`(() => { const e = document.querySelector('.kx-sm.sell'); return e && { running: e.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length,
      coinStrip: getComputedStyle(e.querySelector('.kpm-coin'), '::before').transform, arms: getComputedStyle(e.querySelector('.pArms')).opacity, stand: getComputedStyle(e.querySelector('.pStand')).opacity }; })()`);
    const lc = await js(SCENE('.kx-sm.sell'));
    if (lc?.clip) await shot('lite-scene.png', lc.clip);
    await js(`document.documentElement.classList.remove('lite-mode'); 1`);
  }
}

fs.writeFileSync(path.join(HERE, 'measure-built6.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill(); server.close();
await sleep(1200); try { fs.rmSync(prof, { recursive: true, force: true }); } catch { /* Chrome still closing */ }
process.exit(0);
