// node paper-key.mjs  (lab running on 4190) -> key-<v>.png + key-<v>-press.png + board.html + board.png
// His 2026-11-03: "i want the button to be still in theme of the resident evil village manifest paper not tech like this".
// Each option is CSS swapped onto the REAL photo button on the REAL manifest paper (phone, 375 px, Indonesian),
// then shot at rest and held down (CDP forces :active - the same rule a thumb triggers). No amber fill (his 2026-08-21
// law); depth only as a border (Lite Mode strips shadows).
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const INK = '#3e3226';
const V = {
  today: '',
  a: `.kpm-shutter{background:transparent!important;color:${INK};border:4px double ${INK};border-radius:3px;justify-content:center}
      .kpm-shutter-lens{background:none;border:2px solid ${INK};color:${INK};rotate:-8deg}
      .kpm-shutter-word{font-family:Georgia,'Times New Roman',serif;font-weight:700;letter-spacing:.16em}
      .kpm-shutter:active{translate:0 1px;background:rgba(62,50,38,.12)!important;border-bottom-width:4px}`,
  b: `.kpm-shutter{min-height:76px;justify-content:center;color:${INK};border:1px solid rgba(62,50,38,.35);border-radius:0;
      background-color:rgba(62,50,38,.06)!important;
      background-image:linear-gradient(135deg,#2a2118 50%,transparent 50%),linear-gradient(225deg,#2a2118 50%,transparent 50%),
        linear-gradient(45deg,#2a2118 50%,transparent 50%),linear-gradient(315deg,#2a2118 50%,transparent 50%)!important;
      background-size:16px 16px!important;background-repeat:no-repeat!important;background-position:left top,right top,left bottom,right bottom!important}
      .kpm-shutter-lens{background:none;border:none;color:${INK}}
      .kpm-shutter-word{font-family:Georgia,'Times New Roman',serif;font-style:italic;font-weight:600;text-transform:none;letter-spacing:.02em;font-size:15px}
      .kpm-shutter:active{translate:0 1px;background-color:rgba(62,50,38,.14)!important;border-bottom-width:1px}`,
  c: `.kpm-shutter{color:${INK};border:2px solid #6b645a;border-bottom:7px solid #4a443d;border-radius:14px;
      background-image:linear-gradient(180deg,#fbf3df 0,#e6d8b6 100%)!important;background-size:100% 100%!important}
      .kpm-shutter-lens{color:${INK};border:2px solid #4a443d;background:radial-gradient(circle,#fbf3df 0 55%,#c9c1b2 57% 66%,#7a7266 68%)}
      .kpm-shutter-word{color:${INK}}
      .kpm-shutter:active{translate:0 5px;border-bottom-width:2px}`,
};
const port = 9300 + Math.floor(Math.random() * 500);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log('watchdog'); chrome.kill(); process.exit(1); }, 90000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
await send('Page.enable'); await send('Runtime.enable');
/* no GPS on purpose: at the shop the arrival sheet opens and covers the button */
await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('kpm_lang', 'id'); } catch (e) {}` });
await send('Page.navigate', { url: 'http://localhost:4190/tools/ponder-lab.html?shell&terminal&many&promo' }); await sleep(6000);
await ev(`document.querySelector('[aria-label^="Manifest,"]')?.click()`); await sleep(1200);
await ev(`(() => { const s = document.createElement('style'); s.id = 'v'; document.head.append(s); document.querySelector('[data-guide="photo"]').scrollIntoView({ block: 'center' }); })()`);
await sleep(500);
await send('DOM.enable'); await send('CSS.enable');
const out = {};
for (const [k, css] of Object.entries(V)) {
  await ev(`document.getElementById('v').textContent = ${JSON.stringify(css)}`); await sleep(400);
  const box = await ev(`(() => { const r = document.querySelector('[data-guide="photo"]').getBoundingClientRect(); return { x: Math.max(0, r.x - 18), y: r.y - 40, width: r.width + 36, height: r.height + 64 }; })()`);
  const clip = async (name) => { const f = `${DIR}${name}.png`; rmSync(f, { force: true });
    const r = await send('Page.captureScreenshot', { format: 'png', clip: { ...box, scale: 1 } }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return statSync(f).size; };
  out[k] = await clip(`key-${k}`);
  const root = (await send('DOM.getDocument', { depth: 0 })).result.root.nodeId;
  const node = (await send('DOM.querySelector', { nodeId: root, selector: '[data-guide="photo"]' })).result.nodeId;
  await send('CSS.forcePseudoState', { nodeId: node, forcedPseudoClasses: ['active'] }); await sleep(450);
  out[k + 'P'] = await clip(`key-${k}-press`);
  await send('CSS.forcePseudoState', { nodeId: node, forcedPseudoClasses: [] }); await sleep(200);
}
const card = (k, t, c) => `<div class="f"><div class="t${k === 'today' ? '' : ' a'}">${t}</div><img src="key-${k}.png"><div class="s">held down</div><img src="key-${k}-press.png"><p class="c">${c}</p></div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#14161a;color:#e8e2d4;font:18px/1.35 "Segoe UI",sans-serif;width:1700px}
.wrap{padding:24px}h1{margin:0 0 4px;font-size:28px;color:#e9b949}.sub{margin:0 0 16px;color:#a8a090}.row{display:flex;gap:22px;align-items:flex-start}
.f{width:400px}.f img{display:block;width:400px;border:1px solid #2a2d33}.t{font-size:16px;font-weight:700;letter-spacing:.06em;color:#a8a090;margin-bottom:6px}.t.a{color:#e9b949}
.s{font-size:13px;color:#a8a090;margin:8px 0 4px}.c{margin:8px 0 0;color:#fff;font-size:16px}</style></head><body><div class="wrap">
<h1>Photo button on the manifest paper - 3 ways (real terminal, phone, Indonesian)</h1>
<p class="sub">Each one is the real button with new CSS, on the real paper. No amber fill. Works the same with Lite Mode on.</p>
<div class="row">${card('today', 'TODAY - the black camera key', 'What you called "tech".')}
${card('a', 'A - INK STAMP BOX', 'Printed on the paper in brown ink, a double line like a form box. Pressed: the ink darkens.')}
${card('b', 'B - PHOTO CORNERS', 'An empty photo spot with the 4 black corners of an old album. The photo you take sits in these corners.')}
${card('c', 'C - TYPEWRITER KEY', 'Still 3D, but ivory and nickel like the old typewriter, not black plastic. Pressed: it sinks.')}</div></div></body></html>`;
writeFileSync(DIR + 'board.html', html);
await send('Page.navigate', { url: pathToFileURL(DIR + 'board.html').href }); await sleep(1500);
await send('Emulation.setDeviceMetricsOverride', { width: 1700, height: 900, deviceScaleFactor: 1, mobile: false });
const h = await ev('document.body.scrollHeight');
await send('Emulation.setDeviceMetricsOverride', { width: 1700, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(400);
const png = DIR + 'board.png'; rmSync(png, { force: true });
const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(png, Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ out, board: statSync(png).size, h }));
ws.close(); chrome.kill(); process.exit(0);
