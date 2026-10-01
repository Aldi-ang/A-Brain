/* First-password setup registers a fingerprint passkey, and Fingerprint then unlocks. T5 Budi on the built app wired to
   the emulator (:4175, emulator up, rules enforced), with Chrome's virtual platform authenticator standing in for the
   phone's sensor. NOSENSOR=1 runs without one (the password must still save). Writes t5bio-*.png next to itself. */
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
const prof = path.join(HERE, 't5bio-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9395',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9395/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const toasts = [];
ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300) : r.result?.result?.value; };
const shot = async name => { const s = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(HERE, 't5bio-' + name + '.png'), Buffer.from(s.result.data, 'base64')); };
const state = () => js(`JSON.stringify({ gate: !!document.querySelector('input[placeholder="MASTER PASSWORD"], input[placeholder="CREATE MASTER PASSWORD"]'), nav: !!document.querySelector('nav.kpm-rail-grid'), text: document.body.innerText.match(/Password saved[^\\n]*|Security Protocol Established[^\\n]*/)?.[0] || null })`);
const typeInto = (ph, v) => js(`(() => { const i = document.querySelector('input[placeholder="${ph}"]'); if (!i) return 'no ' + ${JSON.stringify(ph)}; const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ${JSON.stringify(v)}); i.dispatchEvent(new Event('input', { bubbles: true })); return 'ok'; })()`);
const signIn = (sub, email, name) => js(`(async () => { const h = window.__kpmEmulatorAuth; await h.auth.signOut(); const c = await h.signIn(h.auth, h.credential(JSON.stringify({ sub: '${sub}', email: '${email}', email_verified: true, name: '${name}' }))); return c.user.uid; })()`);
const out = {};

await send('Page.enable'); await send('Runtime.enable');
{
  await send('WebAuthn.enable', { enableUI: false });
  const a = await send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: !process.env.CANCEL, automaticPresenceSimulation: true } });
  out.authenticator = !!a.result?.authenticatorId;
}
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: 'http://localhost:4175/' });
await sleep(8000);
const owner = await signIn('potato', 'adikaryasukses99@gmail.com', 'Lab Owner');
execSync(`node tools/seed-emulator.mjs --uid ${owner}`, { cwd: REPO, stdio: 'ignore' });
const row = { fields: { email: { stringValue: 'budi.test@example.com' }, role: { stringValue: 'TIER_5' }, userRole: { stringValue: 'TIER_5' },
  bossUid: { stringValue: owner }, agentId: { stringValue: 'm_budi' }, name: { stringValue: 'BUDI SANTOSO' }, status: { stringValue: 'ACTIVE' } } };
await fetch(`${BASE}/artifacts/${APP_ID}/employee_directory/${encodeURIComponent('budi.test@example.com')}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' }, body: JSON.stringify(row) });
await fetch(`${BASE}/artifacts/${APP_ID}/users/${owner}/vault_keys/m_budi`, { method: 'DELETE', headers: { Authorization: 'Bearer owner' } });
await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
await signIn('budi', 'budi.test@example.com', 'Budi Santoso');
await sleep(9000);
out.sensorSeenByApp = await js(`window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()`);
await typeInto('CREATE MASTER PASSWORD', PW); await typeInto('SECRET RECOVERY WORD', 'kopi'); await sleep(300);
out.save = await js(`(() => { const b = [...document.querySelectorAll('button')].find(x => /Save Credentials/i.test(x.textContent)); if (!b) return 'no button'; if (b.disabled) return 'disabled'; b.click(); return 'clicked'; })()`);
for (let i = 0; i < 30 && !out.toast; i++) { await sleep(250); out.toast = await js(String.raw`(document.body.innerText.match(/Password saved[^\n]*|Security Protocol Established[^\n]*/i) || [null])[0]`); }
await sleep(1500);
out.afterSetup = JSON.parse(await state()); await shot('1-after-setup');
const doc = await (await fetch(`${BASE}/artifacts/${APP_ID}/users/${owner}/vault_keys/m_budi`, { headers: { Authorization: 'Bearer owner' } })).json();
out.passkeysInDoc = doc.fields?.passkeys?.arrayValue?.values?.length || 0;
out.hasPassword = !!doc.fields?.pin;
if (!process.env.CANCEL) {
  /* the pass gone (as after 5 minutes) -> reload -> press Fingerprint -> unlock */
  await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
  await send('Page.reload'); await sleep(9000);
  out.reloadGate = JSON.parse(await state()).gate;
  out.fingerprintPressed = await js(`(() => { const b = [...document.querySelectorAll('button')].find(x => /Fingerprint/i.test(x.textContent)); if (!b) return 'no button'; b.click(); return 'clicked'; })()`);
  await sleep(11000);
  out.afterFingerprint = JSON.parse(await state()); await shot('2-after-fingerprint');
}
console.log(JSON.stringify(out));
ws.close(); chrome.kill();
