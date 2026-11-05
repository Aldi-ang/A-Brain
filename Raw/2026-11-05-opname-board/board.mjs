// node board.mjs  (lab running on 4190) -> frames + board-phone.png + board-pc.png
// His 2026-11-05 "one panel show regional warehouse stock opname status one by one, swap able with animation and swap button,
// futuristic panel". Each look is drawn on the REAL Stock Opname screen in the shell (tools/opname-board-looks.jsx), phone + PC.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 300000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result?.exceptionDetails) errors.push(r.result.exceptionDetails.exception?.description || 'eval'); return r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', 'id'); } catch (e) {}` });
const BASE = 'http://localhost:4190/tools/ponder-lab.html?shell&opname&admin&tab=';
const open = async (extra, w, h, phone, wantSel) => {
  await send('Storage.clearDataForOrigin', { origin: 'http://localhost:4190', storageTypes: 'local_storage,indexeddb' }).catch(() => {});
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: phone ? 2 : 1, mobile: phone });
  await send('Emulation.setTouchEmulationEnabled', { enabled: phone, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: phone ? [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] : [] });
  await send('Page.navigate', { url: BASE + extra });
  await ev(`(async () => { for (let i = 0; i < 100 && !document.querySelector(${JSON.stringify(wantSel)}); i++) await new Promise((r) => setTimeout(r, 150)); })()`); await sleep(1100);
};
const snap = async (name, clip) => { const f = `${DIR}${name}.png`; rmSync(f, { force: true });
  const r = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 } } : {}) }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return statSync(f).size; };
const SCROLLER = `let sc = document.querySelector('.brd-host'); while (sc && sc.scrollHeight <= sc.clientHeight + 2) sc = sc.parentElement;`;
const measure = () => ev(`(() => { const q = (s) => document.querySelector(s), row = q('.brd-row'), host = q('.brd-host'); ${SCROLLER}
  const over = [...document.querySelectorAll('.brd-host *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && !e.closest('.brd-rail'); }).slice(0, 4).map((e) => e.className || e.tagName);
  const clipped = [...document.querySelectorAll('.brd-tbl, .brd-lost, .brd-cnt, .brd-nm')].filter((e) => e.scrollWidth > e.clientWidth + 1).slice(0, 4).map((e) => e.className + ':' + e.textContent.slice(0, 30));
  const lbl = q('.brd-hatchslot .lbl'), hatch = q('.kpm-hatch');
  return { hoverNone: matchMedia('(hover: none)').matches, rajdhani: document.fonts.check('700 13px Rajdhani'), iw: innerWidth, ih: innerHeight, firstRowY: row && Math.round(row.getBoundingClientRect().y), hostY: host && Math.round(host.getBoundingClientRect().y), panelH: q('.brd-panel') && Math.round(q('.brd-panel').getBoundingClientRect().height), scroller: sc && String(sc.className || sc.tagName).slice(0, 40), sh: sc && sc.scrollHeight, over, clipped, lblFit: lbl && Math.round(lbl.getBoundingClientRect().width) + '/' + Math.round(hatch.getBoundingClientRect().width) }; })()`);
const toRows = () => ev(`(async () => { const r = document.querySelector('.brd-row'); ${SCROLLER} if (sc) sc.scrollTop += r.getBoundingClientRect().top - 110; await new Promise((d) => setTimeout(d, 250)); return sc ? sc.scrollTop : null; })()`);
const freeze = (sel, ms, tag, at) => ev(`(async () => { document.querySelector(${JSON.stringify(sel)}).click(); await new Promise((r) => setTimeout(r, ${ms})); const as = document.getAnimations(); as.forEach((a) => { a.pause(); if (a.id === ${JSON.stringify(tag)}) a.currentTime = ${at}; }); return as.length; })()`);

const log = {};
const TODAY = 'hq%20audits,bandung';
await open(TODAY, 375, 812, true, 'button'); await sleep(600); await snap('today-phone-top');
await ev(`(() => { const b = [...document.querySelectorAll('button')].find((e) => /Reject Count/i.test(e.textContent)); b?.scrollIntoView({ block: 'center' }); })()`); await sleep(300); await snap('today-phone-rows');
await open(TODAY, 1440, 900, false, 'button'); await sleep(600); await snap('today-pc');
const MID = { a: ['.kpm-hatch', 450, 'brd-scan', 60], b: ['.brd-next', 130, 'brd-roll', 95], c: ['.brd-next', 140, 'brd-deck', 190] };
for (const k of ['a', 'b', 'c']) {
  const url = `hq%20audits&board=${k}`;
  await open(url, 375, 812, true, '.brd-row');
  log[k] = { phone: await measure() };
  await snap(`${k}-phone-top`);
  log[k].scrolled = await toRows();
  await snap(`${k}-phone-rows`);
  await open(url, 375, 812, true, '.brd-row');
  log[k].midAnims = await freeze(...MID[k]);
  await snap(`${k}-phone-mid`);
  await open(url + '&light', 375, 812, true, '.brd-row');
  log[k].lightOn = await ev(`document.documentElement.className.slice(0, 40)`);
  await snap(`${k}-phone-light`);
  await open(url, 1440, 900, false, '.brd-row');
  log[k].pc = await measure();
  await snap(`${k}-pc`);
  log[k].swapMs = await ev(`(async () => { const SW = { a: ['.kpm-hatch', '.brd-old'], b: ['.brd-next', '.brd-face-old'], c: ['.brd-next', '.brd-gone'] }['${k}']; const t0 = performance.now(); document.querySelector(SW[0]).click(); await new Promise((r) => setTimeout(r, 300)); while (document.querySelector(SW[1]) && performance.now() - t0 < 4000) await new Promise((r) => setTimeout(r, 10)); return Math.round(performance.now() - t0); })()`);
}
log.errors = errors.slice(0, 5);
console.log(JSON.stringify(log));

const sec = (k) => (log[k].swapMs / 1000).toFixed(1);
const LOOKS = [
  ['today', 'TODAY', 'One long list. You can only approve or reject the whole count. No money shown.'],
  ['a', 'A - THE HATCH (my pick)', 'Your hatch sits on the corner of the panel. Its plate names the next warehouse. Press it: the doors work and your scan line wipes to that warehouse. You see one warehouse at a time. One swap takes ' + sec('a') + ' seconds.'],
  ['b', 'B - THE RAIL', 'All warehouses sit on lit plates on top, each with what it lost, so you see everything at once. Press a plate or an arrow: the name and money roll like the header clock. No machine. One swap takes ' + sec('b') + ' seconds.'],
  ['c', 'C - THE DECK', 'Warehouses are a stack of cards, and the next two show their edges with what they lost. Press an edge: the front card flies off and that card comes forward. One swap takes ' + sec('c') + ' seconds.'],
];
const ROWS = [['phone-top', 'What you see first'], ['phone-rows', 'The products: Accept or Reject each one'], ['phone-mid', 'In the middle of a swap'], ['phone-light', 'Light theme']];
const CSSB = `body{margin:0;background:#14161a;color:#e8e2d4;font:18px/1.35 "Segoe UI",sans-serif}.wrap{padding:24px}h1{margin:0 0 4px;font-size:28px;color:#e9b949}.sub{margin:0 0 16px;color:#a8a090}
  .row{display:flex;gap:22px;align-items:flex-start}.f{width:400px}.f img{display:block;width:100%;border:1px solid #2a2d33}.t{font-size:17px;font-weight:700;letter-spacing:.05em;color:#e9b949}.t.dim{color:#a8a090}.c{margin:4px 0 0;color:#fff;font-size:16px;min-height:132px}.s{font-size:13px;color:#a8a090;margin:14px 0 4px}`;
const head = '<!doctype html><html><head><meta charset="utf-8"><style>' + CSSB + '</style></head><body><div class="wrap">';
const phone = head + `<h1>Stock Opname board on the phone - 3 looks (real screen, made-up numbers)</h1><p class="sub">Same products and same buttons in all three. Reject sends only that product back for a recount. The difference is how you swap warehouses.</p><div class="row">`
  + LOOKS.map(([k, t, c]) => `<div class="f"><div class="t${k === 'today' ? ' dim' : ''}">${t}</div><p class="c">${c}</p>` + ROWS.filter(([r]) => k !== 'today' || r === 'phone-top' || r === 'phone-rows').map(([r, s]) => `<div class="s">${k === 'today' && r === 'phone-rows' ? 'The products' : s}</div><img src="${k}-${r}.png">`).join('') + '</div>').join('') + '</div></div></body></html>';
const pc = head.replace('.f{width:400px}', '.f{width:1240px;margin-bottom:26px}').replace('.c{margin:4px 0 0;color:#fff;font-size:16px;min-height:132px}', '.c{margin:4px 0 8px;color:#fff;font-size:16px}') + `<h1>Stock Opname board on the PC - 3 looks (real screen, made-up numbers)</h1><p class="sub">Your phone and your PC can have different answers.</p>`
  + LOOKS.map(([k, t, c]) => `<div class="f"><div class="t${k === 'today' ? ' dim' : ''}">${t}</div><p class="c">${c}</p><img src="${k}-pc.png"></div>`).join('') + '</div></body></html>';
await send('Emulation.setTouchEmulationEnabled', { enabled: false });
await send('Emulation.setEmulatedMedia', { features: [] });
for (const [name, html, width] of [['board-phone', phone, 1740], ['board-pc', pc, 1290]]) {
  writeFileSync(`${DIR}${name}.html`, html);
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file:///' + (DIR + name + '.html').replace(/\\/g, '/') }); await sleep(1800);
  const h = await ev('document.body.scrollHeight');
  await send('Emulation.setDeviceMetricsOverride', { width, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(600);
  console.log(name, h, await snap(name));
}
ws.close(); chrome.kill(); process.exit(0);
