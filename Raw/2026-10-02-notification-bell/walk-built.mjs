/* The BUILT two-part bell (his "phone A pc B", 2026-10-02), walked in the real shell through the ponder lab
   (`?shell&bell`: tools/lab-bell.jsx feeds the real NotificationBell + the real Missed store). Real 390 phone
   (CDP device metrics, touch) and 1440. Proves: the phone opens on Needs you with a switch, Missed is one press
   and clears the gold number, the PC shows both columns, and a failure strip is up, then GONE after 5 s and
   in the Missed list with the gold number raised. Frames built-*.png + walk.json next to this file.
   Needs the lab up on :4190 (preview "ponder-lab"). */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const LAB = 'http://localhost:4190/tools/ponder-lab.html?shell&bell';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const prof = path.join(HERE, 'profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9397',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9397/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const errs = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') errs.push((d.params.exceptionDetails.exception?.description || '').slice(0, 160));
});
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); return r.result?.result?.value; };
const shot = async (file) => {
  const f = path.join(HERE, file); fs.rmSync(f, { force: true });
  const s = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(f, Buffer.from(s.result.data, 'base64'));
};
const go = async (url) => {
  await send('Page.navigate', { url });
  for (let i = 0; i < 60; i++) { await sleep(250); if (await js('!!document.querySelector(".kpm-bell") && document.readyState === "complete"')) break; }
  await js('document.fonts.ready.then(() => 1)'); await sleep(900);
};
const read = () => js(`(() => {
  const bell = document.querySelector('.kpm-bell');
  const panel = [...document.body.children].find((c) => c.style.position === 'fixed' && c.querySelector('h4, [role=tablist], section'));
  const r = (e) => e && (({ left, top, width, height }) => [left, top, width, height].map(Math.round))(e.getBoundingClientRect());
  const shown = (s) => s && getComputedStyle(s).display !== 'none';
  const secs = panel ? [...panel.querySelectorAll('section')] : [];
  return { vw: innerWidth, docW: document.documentElement.scrollWidth, aria: bell?.getAttribute('aria-label'), plateOn: bell?.classList.contains('on'),
    panel: r(panel), tabs: [...document.querySelectorAll('[role=tab]')].filter((t) => t.offsetParent).map((t) => t.textContent + ':' + t.getAttribute('aria-selected') + ':' + Math.round(t.getBoundingClientRect().height)),
    needsShown: shown(secs[0]), missedShown: shown(secs[1]), titleInk: panel?.querySelector('h4') && getComputedStyle(panel.querySelector('h4')).color,
    strips: document.querySelectorAll('[role=alert], [role=status]').length,
    missedRows: secs[1] ? secs[1].querySelectorAll('.border-l-\\\\[3px\\\\]').length : null };
})()`);

await send('Page.enable'); await send('Runtime.enable');
const out = {};
/* phone */
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await go(LAB);
out.closed = await read();
await js('document.querySelector(".kpm-bell").click()'); await sleep(500);
out.phoneOpen = await read(); await shot('built-390-needs.png');
await js('[...document.querySelectorAll("[role=tab]")].find((t) => /Missed/.test(t.textContent)).click()'); await sleep(500);
out.phoneMissed = await read(); await shot('built-390-missed.png');
await js('document.querySelector(".kpm-bell").click()'); await sleep(300);
out.phoneClosedAfterMissed = await read();
/* a failure strip: up at 1 s, gone after 5 s, and in the Missed list */
await js('window.__notify("Failed to save record: the walk test.")'); await sleep(1000);
out.strip1s = await read(); await shot('built-390-strip.png');
await sleep(4800);
out.strip58s = await read();
/* PC */
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Emulation.setTouchEmulationEnabled', { enabled: false, maxTouchPoints: 1 });
await go(LAB);
await js('document.querySelector(".kpm-bell").click()'); await sleep(500);
out.pcOpen = await read(); await shot('built-1440.png');
out.errors = errs;
fs.writeFileSync(path.join(HERE, 'walk.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
ws.close(); chrome.kill();
