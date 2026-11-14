// node shoot.mjs <outDir> - Day Replay at a real phone size: press a shop, shoot NOW, add an example mark, shoot MARK.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';

const OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const PORT = 9333, URL = 'http://localhost:4187/tools/ponder-lab.html?shell&journey&exp&admin';
const MARK_CSS = `.kx-rp-mk.picked{z-index:20000!important;filter:drop-shadow(0 0 5px rgba(228,176,74,.95))}
.kx-rp-mk.picked::after{content:'';position:absolute;left:50%;bottom:-7px;width:34px;height:13px;transform:translateX(-50%);
border:3px solid #E4B04A;border-radius:50%;box-shadow:0 0 9px rgba(228,176,74,.8);pointer-events:none}`;
const prof = `${OUT}/prof`; rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${prof}`, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0; const wait = new Map();
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; wait.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.data, 'base64')); console.log('shot', name); };
try {
  let list = [];
  for (let t = 0; t < 40 && !list.some((p) => p.type === 'page'); t++) { try { list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); } catch { await sleep(300); } }
  ws = new WebSocket(list.find((p) => p.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const w = m.id && wait.get(m.id); if (w) { wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); } });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] });
  await send('Page.navigate', { url: URL }); await sleep(6000);
  console.log('phone media live + width:', await js(`matchMedia('(hover: none) and (pointer: coarse)').matches + ' ' + innerWidth`));
  console.log('pressed BS:', await js(`(() => { const b = [...document.querySelectorAll('button')].find((x) => /^\\s*BS\\b/.test(x.innerText)); b?.click(); return !!b; })()`));
  await sleep(1500);
  console.log('replay key:', await js(`(() => { const k = document.querySelector('.kx-rp-go'); k?.click(); return k ? k.innerText : null; })()`));
  await sleep(1500);
  console.log('pause:', await js(`(() => { const b = document.querySelector('button[aria-label="Pause"]'); b?.click(); return !!b; })()`));
  console.log('whole day:', await js(`(() => { const b = [...document.querySelectorAll('button')].find((x) => x.innerText.trim() === 'WHOLE DAY'); b?.click(); return !!b; })()`));
  await sleep(800);
  console.log('full screen:', await js(`(() => { const b = document.querySelector('.kx-mapkey.k-full'); b?.click(); return !!b; })()`));
  await sleep(4000);
  console.log('flags in view:', JSON.stringify(await js(`[...document.querySelectorAll('.kx-rp-mk')].map((m) => { const r = m.getBoundingClientRect(); return [m.getAttribute('title'), Math.round(r.left), Math.round(r.top)]; })`)));
  // the whole day fits his far-away start too, so the 8 shops sit in one blob: zoom in around a point just under it, as a thumb would
  const c = await js(`(() => { const rs = [...document.querySelectorAll('.kx-rp-mk')].map((m) => m.getBoundingClientRect());
    return [rs.reduce((s, r) => s + r.left + r.width / 2, 0) / rs.length, Math.max(...rs.map((r) => r.top))].map(Math.round); })()`);
  for (const dy of [-480, -480]) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: c[0], y: c[1] + 6, deltaX: 0, deltaY: dy }); await sleep(900); }
  await sleep(1200);
  console.log('wheel at', c, '-> flags:', JSON.stringify(await js(`[...document.querySelectorAll('.kx-rp-mk')].map((m) => { const r = m.getBoundingClientRect(); return [m.getAttribute('title').split(' ').pop(), Math.round(r.left), Math.round(r.top)]; })`)));
  await shot('before');
  const picked = await js(`(() => { const ms = [...document.querySelectorAll('.kx-rp-mk')];
    const seen = ms.filter((m) => { const r = m.getBoundingClientRect(); return r.top > 120 && r.bottom < innerHeight - 220 && r.left > 16 && r.right < innerWidth - 16 && !m.classList.contains('held'); });
    const m = seen.find((x) => /Bu Sri|Makmur/.test(x.getAttribute('title'))) || seen[Math.floor(seen.length / 2)] || ms[0];
    if (!m) return null; m.click(); return m.getAttribute('title') + ' (' + seen.length + ' of ' + ms.length + ' flags in view)'; })()`);
  await sleep(2500);
  console.log('pressed shop:', picked, '| marked class:', await js(`document.querySelector('.kx-rp-mk.picked')?.className || 'none'`),
    '| card:', await js(`(document.querySelector('.kx-rp-card:not(.now)')?.innerText || 'none').replace(/\\s+/g, ' ').slice(0, 120)`));
  console.log('picked box:', JSON.stringify(await js(`(() => { const r = document.querySelector('.kx-rp-mk.picked')?.getBoundingClientRect(); return r && [r.left, r.top, r.width, r.height].map(Math.round); })()`)));
  await shot('now');
  await js(`(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(MARK_CSS)}; document.head.appendChild(s); return true; })()`);
  await sleep(500); await shot('mark');
} catch (e) { console.log('ERROR', e.message); } finally { try { ws?.close(); } catch {} chrome.kill(); }
