/* A T5 salesman (Budi, roster m_budi) on the BUILT app wired to the emulator (:4175, emulator up, firestore.rules
   enforced). Does the gate meet him on entry, can he make his own password (vault_keys/m_budi under the rules),
   does his unlock play the intro and open his app, does the 5-minute pass skip it on a reload, and does a sign-out
   start the next sign-in locked? Writes t5-*.png next to itself. */
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main';
const BASE = 'http://127.0.0.1:8080/v1/projects/cello-inventory-manager/databases/(default)/documents';
const APP_ID = 'cello-inventory-manager';
const PW = 'Budi-Test-1!';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const prof = path.join(HERE, 't5-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9394',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9394/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300) : r.result?.result?.value; };
const shot = async name => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(HERE, 't5-' + name + '.png'), Buffer.from(s.result.data, 'base64')); };
const state = () => js(`JSON.stringify({
  gate: !!document.querySelector('input[placeholder="MASTER PASSWORD"], input[placeholder="CREATE MASTER PASSWORD"]'),
  setup: !!document.querySelector('input[placeholder="CREATE MASTER PASSWORD"]'),
  nav: !!document.querySelector('nav.kpm-rail-grid'),
  grace: !!localStorage.getItem('kpm-vault-grace')
})`);
const typeInto = (ph, v) => js(`(() => { const i = document.querySelector('input[placeholder="${ph}"]'); if (!i) return 'no ' + ${JSON.stringify(ph)}; const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ${JSON.stringify(v)}); i.dispatchEvent(new Event('input', { bubbles: true })); return 'ok'; })()`);
const signIn = (sub, email, name) => js(`(async () => { const h = window.__kpmEmulatorAuth; await h.auth.signOut(); const c = await h.signIn(h.auth, h.credential(JSON.stringify({ sub: '${sub}', email: '${email}', email_verified: true, name: '${name}' }))); return c.user.uid; })()`);
const out = {};

await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await send('Page.navigate', { url: 'http://localhost:4175/' });
await sleep(8000);
/* the company: the owner signs in once so the seed knows his uid; then Budi gets a directory row pointing at it */
const owner = await signIn('potato', 'adikaryasukses99@gmail.com', 'Lab Owner');
execSync(`node tools/seed-emulator.mjs --uid ${owner}`, { cwd: REPO, stdio: 'ignore' });
const row = { fields: { email: { stringValue: 'budi.test@example.com' }, role: { stringValue: 'TIER_5' }, userRole: { stringValue: 'TIER_5' },
  bossUid: { stringValue: owner }, agentId: { stringValue: 'm_budi' }, name: { stringValue: 'BUDI SANTOSO' }, status: { stringValue: 'ACTIVE' } } };
const put = await fetch(`${BASE}/artifacts/${APP_ID}/employee_directory/${encodeURIComponent('budi.test@example.com')}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' }, body: JSON.stringify(row) });
out.directoryRow = put.status;
await fetch(`${BASE}/artifacts/${APP_ID}/users/${owner}/vault_keys/m_budi`, { method: 'DELETE', headers: { Authorization: 'Bearer owner' } });

/* 1. Budi signs in */
await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
await signIn('budi', 'budi.test@example.com', 'Budi Santoso');
await sleep(9000);
out.afterSignIn = JSON.parse(await state()); await shot('1-signin');

/* 2. first time: no password yet -> make one */
if (out.afterSignIn.gate) {
  await typeInto('MASTER PASSWORD', PW);
  await js(`(() => { [...document.querySelectorAll('button[type="submit"]')].find(b => /vault|unlock|open/i.test(b.textContent))?.click(); return 1; })()`);
  await sleep(3000);
  out.firstTry = JSON.parse(await state());
  out.setupTyped = [await typeInto('CREATE MASTER PASSWORD', PW), await typeInto('SECRET RECOVERY WORD', 'kopi')];
  await sleep(300);
  out.saveClicked = await js(`(() => { const b = [...document.querySelectorAll('button')].find(x => /Save Credentials/i.test(x.textContent)); if (!b) return 'no button'; if (b.disabled) return 'disabled'; b.click(); return 'clicked'; })()`);
  await sleep(4000);
  out.afterSetup = JSON.parse(await state()); await shot('2-after-setup');
  const vk = await fetch(`${BASE}/artifacts/${APP_ID}/users/${owner}/vault_keys/m_budi`, { headers: { Authorization: 'Bearer owner' } });
  out.vaultKeysDoc = vk.status;

  /* 3. pass gone (as after 5 minutes) -> reload -> gate -> his password -> the intro -> his app */
  await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
  await send('Page.reload'); await sleep(9000);
  out.reloadNoPass = JSON.parse(await state());
  await typeInto('MASTER PASSWORD', PW);
  await js(`(() => { [...document.querySelectorAll('button[type="submit"]')].find(b => /vault|unlock|open/i.test(b.textContent))?.click(); return 1; })()`);
  await sleep(5200); await shot('3-intro');
  out.introText = await js(`[...document.querySelectorAll('div.flex.flex-wrap.justify-center')].map(e => e.textContent.trim()).filter(Boolean).join(' | ')`);
  await sleep(6000);
  out.afterUnlock = JSON.parse(await state()); await shot('4-in-app');

  /* 4. his 5-minute pass: a reload skips the gate */
  await send('Page.reload'); await sleep(9000);
  out.reloadWithPass = JSON.parse(await state());

  /* 5. sign out (clears the pass) and sign in again -> locked */
  await js(`(async () => { localStorage.removeItem('kpm-vault-grace'); await window.__kpmEmulatorAuth.auth.signOut(); return 1; })()`);
  await sleep(2000);
  await signIn('budi', 'budi.test@example.com', 'Budi Santoso');
  await sleep(9000);
  out.signInAgain = JSON.parse(await state());
}
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill();
