/* "No devices registered!" after every push (his 2026-10-01). T5 Budi sets a password + fingerprint on lab build A
   (:4175, emulator), a plain reload proves Fingerprint unlocks, then build B replaces A on the same address - what a
   push does - and the page is reopened: the offline helper serves A, finds B, swaps and reloads itself. Then Fingerprint
   is pressed again. Prints the toasts, the page loads seen and every console error. Needs build A already in the outDir
   (vite build --mode httpdev --configLoader runner --config prod-emu.config.mjs) and the emulator up. */
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = 'D:/APP DEVELOPMENT/kpm inventory main FILES/kpm-inventory-main';
const VITE = path.join(REPO, 'node_modules/vite/bin/vite.js');
const BASE = 'http://127.0.0.1:8080/v1/projects/cello-inventory-manager/databases/(default)/documents';
const APP_ID = 'cello-inventory-manager';
const PW = 'Budi-Test-1!';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const preview = () => {
  const p = spawn('node', [VITE, 'preview', '--mode', 'httpdev', '--configLoader', 'runner', '--config', path.join(HERE, 'prod-emu.config.mjs')], { cwd: REPO, stdio: 'ignore' });
  return p;
};
const up = async () => { for (let i = 0; i < 60; i++) { await sleep(500); try { if ((await fetch('http://localhost:4175/')).ok) return true; } catch { /* not up */ } } return false; };

let server = preview(); await up();
const prof = path.join(HERE, 't5push-profile'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9396',
  '--user-data-dir=' + prof, '--hide-scrollbars', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9396/json/list')).json(); } catch { /* not up */ } }
const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let seq = 0; const pending = new Map(); const log = []; let loads = 0;
ws.addEventListener('message', m => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Page.loadEventFired') loads++;
  if (d.method === 'Runtime.exceptionThrown') log.push(`[${loads}] EXC ` + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || '').slice(0, 200));
  if (d.method === 'Runtime.consoleAPICalled' && /error|warn/.test(d.params.type)) log.push(`[${loads}] ${d.params.type} ` + d.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 200));
});
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); return r.result?.exceptionDetails ? 'EXC ' + (r.result.exceptionDetails.exception?.description || '').slice(0, 300) : r.result?.result?.value; };
const typeInto = (ph, v) => js(`(() => { const i = document.querySelector('input[placeholder="${ph}"]'); if (!i) return 'no ' + ${JSON.stringify(ph)}; const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, ${JSON.stringify(v)}); i.dispatchEvent(new Event('input', { bubbles: true })); return 'ok'; })()`);
const signIn = (sub, email, name) => js(`(async () => { const h = window.__kpmEmulatorAuth; await h.auth.signOut(); const c = await h.signIn(h.auth, h.credential(JSON.stringify({ sub: '${sub}', email: '${email}', email_verified: true, name: '${name}' }))); return c.user.uid; })()`);
const gate = () => js(`!!document.querySelector('input[placeholder="MASTER PASSWORD"]')`);
const build = () => js(`[...document.scripts].map(s => s.src.match(/index-[^.]+/)?.[0]).filter(Boolean).join() + ' sw:' + !!navigator.serviceWorker.controller`);
/* press Fingerprint, then watch the page for 12 s: the refusal toast, or the gate gone */
const pressFingerprint = async () => {
  await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
  const pressed = await js(`(() => { const b = [...document.querySelectorAll('button')].find(x => /Fingerprint/i.test(x.textContent)); if (!b) return 'no button'; b.click(); return 'clicked'; })()`);
  let toast = null;
  for (let i = 0; i < 48 && !toast; i++) { await sleep(250); toast = await js(String.raw`(document.body.innerText.match(/No devices registered[^\n]*|Biometric Error[^\n]*/i) || [null])[0]`); }
  return { pressed, toast, gateAfter: await gate() };
};
const out = {};

await send('Page.enable'); await send('Runtime.enable');
await send('WebAuthn.enable', { enableUI: false });
await send('WebAuthn.addVirtualAuthenticator', { options: { protocol: 'ctap2', transport: 'internal', hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true } });
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
await typeInto('CREATE MASTER PASSWORD', PW); await typeInto('SECRET RECOVERY WORD', 'kopi'); await sleep(300);
out.save = await js(`(() => { const b = [...document.querySelectorAll('button')].find(x => /Save Credentials/i.test(x.textContent)); if (!b) return 'no button'; b.click(); return 'clicked'; })()`);
await sleep(6000);
const vault = async () => (await (await fetch(`${BASE}/artifacts/${APP_ID}/users/${owner}/vault_keys/m_budi`, { headers: { Authorization: 'Bearer owner' } })).json()).fields?.passkeys?.arrayValue?.values?.length || 0;
out.passkeysInDoc = await vault();
out.buildA = await build();

/* control: a plain reload on the same build (the 5-minute pass removed first, as after a real gap) */
await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
await send('Page.reload'); await sleep(9000);
out.reloadSameBuild = { gate: await gate(), ...(await pressFingerprint()) };

/* the push: B replaces A on the same address */
server.kill(); await sleep(1000);
execSync(`node "${VITE}" build --mode httpdev --configLoader runner --config "${path.join(HERE, 'prod-emu-b.config.mjs')}"`, { cwd: REPO, stdio: 'ignore' });
server = preview(); await up();
const before = loads;
/* THROTTLE=1: a phone - slow network, 4x slower CPU - so the old copy boots (sign-in, vault read) while the new one downloads */
if (process.env.THROTTLE) {
  await send('Network.enable');
  await send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 150 * 1024, uploadThroughput: 75 * 1024 });
  await send('Emulation.setCPUThrottlingRate', { rate: 4 });
}
await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
await send('Page.reload');
const sw = [];
for (let i = 0; i < 120; i++) { await sleep(1000); const b = await build(); if (!sw.includes(b)) sw.push(b); if (/BkLY|labB/.test(b) || (i > 5 && !b.includes(out.buildA.split(' ')[0]))) { await sleep(9000); break; } }
await js(`localStorage.removeItem('kpm-vault-grace'), 1`);
out.afterPush = { buildsSeen: sw, loadsSinceReopen: loads - before, build: await build(), gate: await gate(), ...(await pressFingerprint()) };
out.passkeysInDocAfter = await vault();
out.log = [...new Set(log)].map(l => l + "  x" + log.filter(x => x === l).length);
console.log(JSON.stringify(out, null, 1));
ws.close(); chrome.kill(); server.kill();
