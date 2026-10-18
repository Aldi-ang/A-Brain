// Scratch: three Ark Lab backgrounds for the wheel page, shot at 390 and 1440, laid out as two boards.
// node bgboard.mjs <repo presentation html> <out dir>
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const [, , src, out] = process.argv;
const CSS = `<style>
/* ---- background options for the wheel page (board only) ---- */
html[data-bg] .hubsec > * { position: relative; z-index: 1; }
html[data-bg] .hubsec::before, html[data-bg] .hubsec::after { content: ""; position: absolute; pointer-events: none; z-index: 0; }

/* A - containment bay: riveted steel wall, an amber cage lamp overhead, a lab floor grid, hazard tape at the edge */
html[data-bg="a"] .hubsec { background:
  radial-gradient(55% 34% at 50% 0%, rgba(228,176,74,.26), rgba(228,176,74,.05) 55%, transparent 78%),
  linear-gradient(180deg, transparent 0 18%, rgba(0,0,0,.7) 18% calc(18% + 3px), rgba(232,228,222,.08) calc(18% + 3px) calc(18% + 4px), transparent calc(18% + 4px)),
  radial-gradient(circle at 12px 50%, rgba(232,228,222,.16) 0 1.6px, rgba(0,0,0,.75) 2.2px, transparent 2.8px) 0 0 / 240px 46px,
  radial-gradient(circle at 228px 50%, rgba(232,228,222,.16) 0 1.6px, rgba(0,0,0,.75) 2.2px, transparent 2.8px) 0 0 / 240px 46px,
  repeating-linear-gradient(90deg, rgba(0,0,0,.75) 0 2px, rgba(232,228,222,.07) 2px 3px, transparent 3px 240px),
  linear-gradient(180deg, #1c1813, #0f0d0a 58%, #060504); }
html[data-bg="a"] .hubsec::after { left: -60%; right: -60%; bottom: 0; height: 52%;
  background: repeating-linear-gradient(90deg, rgba(228,176,74,.36) 0 1px, transparent 1px 64px), repeating-linear-gradient(0deg, rgba(228,176,74,.36) 0 1px, transparent 1px 64px), linear-gradient(180deg, #0d0b09, #070605);
  transform: perspective(420px) rotateX(64deg); transform-origin: 50% 100%;
  -webkit-mask-image: linear-gradient(0deg, #000 30%, transparent 92%); mask-image: linear-gradient(0deg, #000 30%, transparent 92%); }
html[data-bg="a"] .hubsec::before { left: 0; right: 0; bottom: 0; height: 12px; z-index: 2; opacity: .85;
  background: repeating-linear-gradient(-45deg, #F2C318 0 10px, #141414 10px 20px); }

/* B - specimen lab: two glass tubes lit amber from below, a schematic grid, scanner rings behind the wheel */
html[data-bg="b"] .hubsec { background:
  radial-gradient(120% 85% at 50% 50%, transparent 38%, rgba(0,0,0,.8) 100%),
  repeating-radial-gradient(circle at 50% 58%, transparent 0 58px, rgba(228,176,74,.08) 58px 59px),
  repeating-linear-gradient(0deg, rgba(228,176,74,.10) 0 1px, transparent 1px 120px),
  repeating-linear-gradient(90deg, rgba(228,176,74,.10) 0 1px, transparent 1px 120px),
  repeating-linear-gradient(0deg, rgba(232,228,222,.04) 0 1px, transparent 1px 24px),
  repeating-linear-gradient(90deg, rgba(232,228,222,.04) 0 1px, transparent 1px 24px),
  radial-gradient(60% 45% at 50% 55%, rgba(208,138,46,.12), transparent 70%), #0a0908; }
html[data-bg="b"] .hubsec::before, html[data-bg="b"] .hubsec::after { top: 15%; bottom: 7%; width: clamp(26px, 6vw, 86px); border-radius: 12px 12px 16px 16px;
  border: 1px solid rgba(232,228,222,.16); border-top: 16px solid #221e19; border-bottom: 24px solid #221e19;
  background:
    radial-gradient(circle at 38% 60%, rgba(255,236,196,.45) 0 1.6px, transparent 2.6px) 0 0 / 100% 13%,
    radial-gradient(circle at 64% 25%, rgba(255,236,196,.3) 0 1.2px, transparent 2.2px) 0 0 / 100% 9%,
    linear-gradient(90deg, rgba(255,255,255,.16), rgba(255,255,255,.03) 18%, transparent 45%, rgba(255,255,255,.02) 76%, rgba(255,255,255,.12)),
    linear-gradient(0deg, rgba(228,176,74,.42), rgba(208,138,46,.16) 55%, rgba(208,138,46,.05) 82%, rgba(0,0,0,.35));
  box-shadow: 0 0 80px rgba(228,176,74,.18), inset 0 0 22px rgba(0,0,0,.6); }
html[data-bg="b"] .hubsec::before { left: max(-6px, calc(50% - 660px)); }
html[data-bg="b"] .hubsec::after { right: max(-6px, calc(50% - 660px)); }

/* C - containment platform: the wheel stands on a lit floor ring, red emergency light in the corners, low fog, vent slats */
html[data-bg="c"] .hubsec { background:
  radial-gradient(60% 45% at 0% 8%, rgba(255,59,75,.15), transparent 72%),
  radial-gradient(60% 45% at 100% 8%, rgba(255,59,75,.07), transparent 72%),
  radial-gradient(120% 40% at 50% 100%, rgba(232,228,222,.07), transparent 62%),
  linear-gradient(180deg, transparent 0 88px, rgba(232,228,222,.05) 88px 89px, transparent 89px),
  repeating-linear-gradient(90deg, rgba(0,0,0,.6) 0 5px, rgba(232,228,222,.035) 5px 6px, transparent 6px 14px) 0 48px / 100% 40px no-repeat,
  linear-gradient(180deg, #13100d, #0a0908 55%, #040303); }
html[data-bg="c"] .wheel::after { content: ""; position: absolute; z-index: -1; left: 50%; bottom: -34px; width: min(1040px, 150vw); height: 170px; translate: -50% 0; pointer-events: none;
  background: repeating-radial-gradient(closest-side, transparent 0 17px, rgba(228,176,74,.20) 17px 18px), radial-gradient(closest-side, rgba(228,176,74,.20), rgba(228,176,74,.04) 70%, transparent);
  -webkit-mask-image: radial-gradient(closest-side, #000 55%, transparent); mask-image: radial-gradient(closest-side, #000 55%, transparent); }
html[data-bg="c"] .wheel::before { content: ""; position: absolute; z-index: -1; left: 50%; bottom: -8px; width: min(760px, 118vw); height: 108px; translate: -50% 0; border-radius: 50%; pointer-events: none;
  border: 3px dotted rgba(244,196,96,.75); box-shadow: 0 0 24px rgba(228,176,74,.25); }
</style>`;
const html = readFileSync(src, 'utf8').replace('<header class="bar">', CSS + '\n<header class="bar">');
writeFileSync(`${out}/bg.html`, html);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${out}/prof`, '--hide-scrollbars', '--allow-file-access-from-files', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(), errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.text); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = (expr) => send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
const shot = async (file, clip) => { const r = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip: { ...clip, scale: 1 }, captureBeyondViewport: true } : {}) }); writeFileSync(file, Buffer.from(r.result.data, 'base64')); };
await send('Page.enable'); await send('Runtime.enable');
const url = 'file:///' + out.replace(/\\/g, '/').replace(/ /g, '%20') + '/bg.html#nointro';
const V = [['', 'Now'], ['a', 'A · Containment bay'], ['b', 'B · Specimen lab'], ['c', 'C · Containment platform']];
for (const [w, h] of [[390, 844], [1440, 900]]) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 1024 });
  await send('Page.navigate', { url }); await sleep(2500);
  for (const [v] of V) {
    await ev(`(() => { if (${JSON.stringify(v)}) document.documentElement.dataset.bg = ${JSON.stringify(v)}; else delete document.documentElement.dataset.bg; wBusy = true; wTheta = 0; wDraw(); scrollTo(0, 0); })()`);
    await sleep(500); await shot(`${out}/${w}-${v || 'now'}.png`);
  }
}
const SUB = { now: 'What it is today: a soft gold glow on black.', a: 'Riveted steel wall, an amber cage lamp overhead, a lab floor grid under the wheel, hazard tape along the bottom.',
  b: 'Two glass specimen tubes lit amber from below, a lab schematic grid, faint scanner rings behind the wheel.', c: 'The wheel stands on a lit floor ring, red emergency light in the corners, low fog, vent slats at the top.' };
for (const [w, h, s, cols] of [[390, 844, .62, 4], [1440, 900, .42, 2]]) {
  const fw = Math.round(w * s), fh = Math.round(h * s);
  const cells = V.map(([v, n]) => `<figure><img src="${w}-${v || 'now'}.png" width="${fw}" height="${fh}"><figcaption><b>${n}</b>${SUB[v || 'now']}</figcaption></figure>`).join('');
  const bw = cols * fw + (cols + 1) * 24;
  writeFileSync(`${out}/board-${w}.html`, `<!doctype html><meta charset=utf8><style>body{margin:0;background:#0A0908;color:#E8E4DE;font:15px/1.4 system-ui,sans-serif;width:${bw}px}
  h1{font:800 22px/1.2 system-ui;margin:0;padding:22px 24px 4px} p.s{margin:0;padding:0 24px 14px;color:#A39B90}
  main{display:grid;grid-template-columns:repeat(${cols},${fw}px);gap:24px;padding:0 24px 24px} figure{margin:0} img{display:block;border:1px solid #3E3A35;border-radius:8px}
  figcaption{padding-top:8px;color:#A39B90;font-size:14px;max-width:${fw}px} figcaption b{display:block;color:#E4B04A;font-size:16px;margin-bottom:2px}</style>
  <h1>Wheel page background · ${w < 1024 ? 'phone' : 'PC'} (${w} px)</h1><p class="s">Pick one. Same page, same cards, only the background changes.</p><main>${cells}</main>`);
  await send('Emulation.setDeviceMetricsOverride', { width: bw, height: 800, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file:///' + out.replace(/\\/g, '/').replace(/ /g, '%20') + `/board-${w}.html` }); await sleep(1200);
  const H = (await ev('document.documentElement.scrollHeight')).result.result.value;
  await shot(`${out}/board-${w}.png`, { x: 0, y: 0, width: bw, height: H });
}
console.log('errors:', errors.length ? errors.join(' | ') : 'none');
chrome.kill(); process.exit(0);
