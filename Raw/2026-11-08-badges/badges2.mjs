// node badges2.mjs -> round 2 (he: "all looks bad" + "i want small animation and effect"): 3 animated counters on the
// real HQ Audits tab (lab 4187), dark + light, frames stepped with document.getAnimations() -> MOTION.gif
import { spawn, execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LAB = 'http://localhost:4187/tools/ponder-lab.html?shell&opname&admin';
const S = '.kpm-opname-tabs button span.rounded-full';
const OPTIONS = [
  { key: 'N', title: '1 - Nixie', cap: 'the app\'s own glowing counter: the number rolls up and glows once when it arrives', css:
    `${S}{display:inline-flex!important;align-items:flex-start!important;justify-content:center;min-width:17px!important;height:22px!important;padding:0 4px!important;border-radius:3px!important;font-size:15px!important;font-weight:700!important;line-height:22px;overflow:hidden;font-variant-numeric:tabular-nums;background:linear-gradient(180deg,#1c1510,#0a0705)!important;border:1px solid #4a3420!important;color:#FFB02E;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),inset 0 -2px 4px rgba(0,0,0,.6)!important;animation:kcRoll .9s cubic-bezier(.3,.7,.3,1.08) both,kcGlow 1.3s ease-out both}
@keyframes kcRoll{from{line-height:64px}to{line-height:22px}}
@keyframes kcGlow{0%{color:#6b4a1a;text-shadow:none}35%{color:#ffd27a;text-shadow:0 0 6px #ffb02e,0 0 16px rgba(255,140,30,.9)}100%{color:#FFB02E;text-shadow:0 0 4px rgba(255,140,30,.85),0 0 9px rgba(255,120,20,.45)}}` },
  { key: 'T', title: '2 - Red tag', cap: 'pops in with one ripple when a new one arrives, then sits still', css:
    `${S}{display:inline-flex!important;align-items:center;justify-content:center;position:relative;min-width:20px!important;height:20px!important;padding:0 6px!important;border-radius:6px!important;font-size:13px!important;font-weight:800!important;line-height:1!important;font-variant-numeric:tabular-nums;background:linear-gradient(180deg,#a8483f,#7e332c)!important;color:#F7F2EE!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.25),inset 0 -1px 0 rgba(0,0,0,.3)!important;animation:kcPop .55s cubic-bezier(.3,1.6,.5,1) both}
${S}::after{content:'';position:absolute;inset:0;border-radius:inherit;border:2px solid #c25a50;pointer-events:none;animation:kcRipple .9s ease-out .15s both}
@keyframes kcPop{0%{transform:scale(.3);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1)}}
@keyframes kcRipple{0%{transform:scale(1);opacity:.9}100%{transform:scale(2.2);opacity:0}}` },
  { key: 'E', title: '3 - Red edge', cap: 'slides in; a soft shine passes over it every few seconds (the only one that repeats)', css:
    `${S}{display:inline-flex!important;align-items:center;justify-content:center;position:relative;overflow:hidden;min-width:20px!important;height:20px!important;padding:0 6px!important;border-radius:5px!important;font-size:13px!important;font-weight:800!important;line-height:1!important;font-variant-numeric:tabular-nums;background:var(--danger-well)!important;color:var(--danger-ink)!important;border:1.5px solid var(--danger-ink)!important;animation:kcIn .45s ease-out both}
${S}::before{content:'';position:absolute;top:0;bottom:0;width:70%;left:-90%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.45),transparent);pointer-events:none;animation:kcSheen 3.2s ease-in-out .6s infinite}
@keyframes kcIn{from{transform:translateY(-7px);opacity:0}to{transform:none;opacity:1}}
@keyframes kcSheen{0%{left:-90%}30%,100%{left:140%}}` },
];
const THEMES = [{ key: 'dark', label: 'Dark', q: '' }, { key: 'light', label: 'Light', q: '&light' }];
const STEP = 50, END = 1800;

const port = 9700 + Math.floor(Math.random() * 100);
rmSync(DIR + 'prof', { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${DIR}prof`, 'about:blank']);
let list = []; for (let i = 0; i < 40 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.result?.value;
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });

rmSync(DIR + 'm2', { recursive: true, force: true }); mkdirSync(DIR + 'm2');
const crops = {};
for (const th of THEMES) for (const op of OPTIONS) {
  await send('Page.navigate', { url: LAB + th.q + '&css=' + encodeURIComponent(op.css) }); await sleep(2200);
  await ev(`document.querySelector('.kpm-opname-tabs')?.scrollIntoView({block:'center'})`); await sleep(300);
  const clip = await ev(`(() => { const t = [...document.querySelectorAll('.kpm-opname-tabs button')].find((b) => /HQ Audits/i.test(b.textContent)); if (!t || !t.querySelector('span.rounded-full')) return null;
    const r = t.getBoundingClientRect(); const x = Math.max(0, r.left - 10); return { x, y: r.top + scrollY - 8, width: Math.min(390 - x, r.width + 20), height: r.height + 16, scale: 1 }; })()`);
  if (!clip) { console.log('no badge', th.key, op.key); continue; }
  const n = await ev(`document.getAnimations().filter((a) => a.animationName && a.animationName.startsWith('kc')).length`);
  for (let t = 0, i = 0; t <= END; t += STEP, i++) {
    await ev(`document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ${t}; })`);
    const s = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
    const f = `m2/${th.key}-${op.key}-${String(i).padStart(3, '0')}.png`; writeFileSync(DIR + f, Buffer.from(s.result.data, 'base64'));
    (crops[`${th.key}-${op.key}`] ||= []).push(f);
  }
  console.log(th.key, op.key, 'kc animations:', n, 'frames:', crops[`${th.key}-${op.key}`].length);
}

const img = (f) => `data:image/png;base64,${readFileSync(DIR + f).toString('base64')}`;
const W = 110 + OPTIONS.length * 300 + 40;
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 100, deviceScaleFactor: 1, mobile: false });
const frames = crops[`dark-${OPTIONS[0].key}`].length;
for (let i = 0; i < frames; i++) {
  const html = `<html><body style="margin:0;background:#1b1a18;color:#eee;font:15px sans-serif;padding:10px;width:${W - 20}px">
<div style="font-size:20px;font-weight:700;margin:2px 0 10px">Round 2 - counters that move. Pick 1, 2 or 3.</div>
<div style="display:grid;grid-template-columns:90px repeat(${OPTIONS.length},300px);gap:12px;align-items:center">
<div></div>${OPTIONS.map((o) => `<div><div style="font-size:18px;font-weight:700">${o.title}</div><div style="opacity:.85;line-height:1.3">${o.cap}</div></div>`).join('')}
${THEMES.map((th) => `<div style="font-weight:700">${th.label}</div>` + OPTIONS.map((o) => { const c = crops[`${th.key}-${o.key}`]; return c ? `<div><img src="${img(c[Math.min(i, c.length - 1)])}" style="width:${Math.round(300)}px;display:block;border:1px solid #444"></div>` : '<div>missing</div>'; }).join('')).join('')}
</div><div style="margin-top:10px;opacity:.85">Each plays when a new audit arrives or the number changes, then stops. Lite Mode: no motion, it just shows the last frame.</div></body></html>`;
  writeFileSync(DIR + '_b2.html', html);
  await send('Page.navigate', { url: 'file:///' + (DIR + '_b2.html').replace(/\\/g, '/') }); await sleep(250);
  if (i === 0) { const h = await ev('document.documentElement.scrollHeight'); await send('Emulation.setDeviceMetricsOverride', { width: W, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(200); }
  const b = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(DIR + `m2/b-${String(i).padStart(3, '0')}.png`, Buffer.from(b.result.data, 'base64'));
}
chrome.kill();
rmSync(DIR + 'MOTION.gif', { force: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(1000 / STEP), '-i', DIR + 'm2/b-%03d.png', '-vf',
  'tpad=stop_mode=clone:stop_duration=1.2,split[a][b];[a]palettegen=max_colors=200[p];[b][p]paletteuse=dither=none', '-loop', '0', DIR + 'MOTION.gif']);
writeFileSync(DIR + 'MOTION-last.png', readFileSync(DIR + `m2/b-${String(frames - 1).padStart(3, '0')}.png`));
console.log('MOTION.gif frames', frames); process.exit(0);
