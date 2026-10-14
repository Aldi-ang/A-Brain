/* Does a hidden Chrome tab bunch the capybara's syllable timers together? Real headless Chrome (new mode), raw CDP.
   Each "line" is the app's own scheduling: one setTimeout per syllable at the plan's onset (useSound.js speakMumble),
   each one playing a real baked syllable file. We record when every timer really fired, visible vs hidden. */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root = process.argv[2], OUT = process.argv[3];
const { voicePlan } = await import(pathToFileURL(root + '/src/utils/voicePlan.js').href);
const { capyFile } = await import(pathToFileURL(root + '/src/config/capyVoice.js').href);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prof = path.join(OUT, 'profile-hidden'); fs.rmSync(prof, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--remote-debugging-port=9411', '--user-data-dir=' + prof, '--autoplay-policy=no-user-gesture-required', 'about:blank']);
let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch('http://127.0.0.1:9411/json/list')).json(); } catch { /* not up */ } }
const pageA = list.find((t) => t.type === 'page');
const conn = async (url) => {
  const ws = new WebSocket(url); await new Promise((r) => ws.addEventListener('open', r));
  let seq = 0; const pending = new Map();
  ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
  const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
  return { ws, send, js: async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value };
};
const A = await conn(pageA.webSocketDebuggerUrl);
// the real syllable files, as data URLs, so the page plays genuine audio
const files = {};
const lines = ['Good pick.', 'Aye, one more.', 'Fine taste.', 'Ah. This one.', 'Customer updated!', 'Item removed.'];
const plans = [];
for (const t of lines) for (const seed of [3, 11]) { const p = voicePlan(t, seed); plans.push({ t, p }); for (const x of p) { const f = capyFile(x.on, x.v, x.len, x.rise); files[f] ||= 'data:audio/mpeg;base64,' + fs.readFileSync(root + '/public/sounds/' + f + '.mp3').toString('base64'); } }
await A.js(`window.FILES = ${JSON.stringify(files)}; window.speak = (steps) => new Promise((done) => {
  const t0 = performance.now(), fired = [];
  steps.forEach((x, i) => setTimeout(() => { fired[i] = performance.now() - t0; const a = new Audio(FILES[x.f]); a.playbackRate = x.rate; a.play().catch(() => {}); if (fired.filter(v => v != null).length === steps.length) done(fired); }, x.at * 1000));
}); true`);
const AUD = { s: 110, m: 174, l: 277 };
const heard = (p, fired) => { // separate sounds per sentence, a 60 ms quiet splits two
  let minH = 99; const sents = [...new Set(p.map((x) => x.sent))];
  for (const s of sents) {
    const xs = p.map((x, i) => ({ ...x, t: fired[i] })).filter((x) => x.sent === s).sort((a, b) => a.t - b.t);
    let h = 0, end = -1e9; for (const x of xs) { if (x.t - end >= 60) h++; end = Math.max(end, x.t + AUD[x.len] / x.rate); }
    minH = Math.min(minH, h);
  }
  return minH;
};
const GAP = +process.argv[4] || 2500, ONLY = process.argv[5];
const run = async (label) => {
  const vis = await A.js('document.visibilityState'); const res = [];
  for (const { t, p } of (ONLY ? plans.slice(0, 4) : plans)) {
    await sleep(GAP); // the app is quiet between lines
    const fired = await A.js(`speak(${JSON.stringify(p.map((x) => ({ f: capyFile(x.on, x.v, x.len, x.rise), at: x.at, rate: x.rate })))})`);
    const late = Math.round(Math.max(...fired.map((f, i) => f - p[i].at * 1000)));
    res.push({ t, planned: p.map((x) => Math.round(x.at * 1000)).join(','), fired: fired.map(Math.round).join(','), worstLateMs: late, heardSounds: heard(p, fired) });
  }
  console.log(`\n== ${label} (visibilityState=${vis})`);
  for (const r of res) console.log(`  ${r.heardSounds} sounds heard | late up to ${r.worstLateMs} ms | ${JSON.stringify(r.t)} planned ${r.planned} -> fired ${r.fired}`);
  return res;
};
const v = ONLY ? [] : await run('VISIBLE tab');
// open a second tab and bring it to the front: tab A is now a background tab
const { targetInfo } = (await A.send('Target.getTargetInfo')).result || {};
const created = await (await fetch('http://127.0.0.1:9411/json/new?about:blank', { method: 'PUT' })).json();
await fetch('http://127.0.0.1:9411/json/activate/' + created.id);
await sleep(1500);
const h = await run('BACKGROUND tab');
const bad = (rs) => rs.filter((r) => r.heardSounds < 3).length;
console.log(`\nVISIBLE: ${bad(v)} of ${v.length} lines heard as under 3 sounds | BACKGROUND: ${bad(h)} of ${h.length}`);
A.ws.close(); chrome.kill();
