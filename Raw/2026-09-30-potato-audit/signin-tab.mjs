/* Press Sign in on the BUILT app, served locally but reached as http://kpm-ang.vercel.app (host mapped to the
   preview on :4174), once as a touch phone and once as a PC. Reports: same-tab navigation to /__/auth/handler,
   or a second tab (popup). Needs the kpm-preview-http server on :4174. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run(phone) {
  const port = phone ? 9371 : 9372;
  const prof = path.join(HERE, 'signin-profile-' + port); fs.rmSync(prof, { recursive: true, force: true });
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=' + port,
    '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', '--host-resolver-rules=MAP kpm-ang.vercel.app 127.0.0.1:4176',
    '--ignore-certificate-errors', 'about:blank'], { stdio: 'ignore' });
  let list;
  for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch { /* not up */ } }
  const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  let seq = 0; const pending = new Map(); const navs = []; const targets = [];
  ws.addEventListener('message', m => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    if (d.method === 'Page.frameRequestedNavigation' || d.method === 'Page.frameStartedNavigating') navs.push(d.params.url);
    if (d.method === 'Target.targetCreated' && d.params.targetInfo.type === 'page') targets.push(d.params.targetInfo.url || '(blank)');
  });
  const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
  const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 200) : r.result?.result?.value; };

  await send('Page.enable');
  await send('Target.setDiscoverTargets', { discover: true });
  if (phone) {
    await send('Emulation.setDeviceMetricsOverride', { width: 384, height: 832, deviceScaleFactor: 2.8125, mobile: true });
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await send('Emulation.setEmitTouchEventsForMouse', { enabled: true, configuration: 'mobile' });
  } else {
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  }
  await send('Page.navigate', { url: 'https://kpm-ang.vercel.app/' });
  await sleep(7000);
  const before = await js(`JSON.stringify({ host: location.host, coarse: matchMedia('(pointer: coarse)').matches, button: !!document.querySelector('button.kpm-btn.key') })`);
  navs.length = 0; targets.length = 0;
  const pressed = await js(`(() => { const b = document.querySelector('button.kpm-btn.key'); if (!b) return 'no button'; b.click(); return 'pressed'; })()`);
  await sleep(4000);
  const now = await js('location.href');
  ws.close(); chrome.kill();
  return { phone, before: JSON.parse(before || '{}'), pressed, sameTabTo: navs.filter(u => u.includes('/__/auth/handler')).map(u => u.split('?')[0]), newTabs: targets.length, pageNow: String(now).split('?')[0] };
}
console.log(JSON.stringify(await run(true)));
console.log(JSON.stringify(await run(false)));
