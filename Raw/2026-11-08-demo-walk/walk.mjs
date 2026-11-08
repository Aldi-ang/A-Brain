// node walk.mjs <phone|pc> <T2|T3|T4|T5|T6> [screenId ...]
// The DEMO build on the local emulator (launch demo-emulator + demo-api-emulator + demo-app-emulator on 5176, filled by
// tools/demo-reset-emulator.mjs, guest walker@gmail.com on demo_invites). Signs in the way a visitor does (Google ->
// picker -> vault gate), then opens every sidebar screen, the DEMO bar's SWITCH, the capybara mission and the tutorial
// book. Writes nothing to the database itself (it only presses buttons that open things). Frames: <mode>-<tier>-<name>.png
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));
const [MODE = 'phone', TIER = 'T6', ...ONLY] = process.argv.slice(2);
const port = 9300 + Math.floor(Math.random() * 500);
const PROF = `${DIR}prof-${MODE}-${TIER}`;
rmSync(PROF, { recursive: true, force: true });
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${PROF}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
setTimeout(() => { console.log(JSON.stringify(out, null, 1)); console.log('watchdog'); chrome.kill(); process.exit(1); }, 1500000).unref();
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up */ } if (!list.length) await sleep(250); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map(); let errors = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
  if (d.method === 'Runtime.exceptionThrown') errors.push('throw: ' + String(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text).slice(0, 220));
  if (d.method === 'Runtime.consoleAPICalled' && (d.params.type === 'error' || /permission|denied|insufficient/i.test(JSON.stringify(d.params.args))))
    errors.push(d.params.type + ': ' + d.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 220)); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.result?.exceptionDetails) errors.push('eval: ' + String(r.result.exceptionDetails.exception?.description || 'eval').slice(0, 220)); return r.result?.result?.value; };
await send('Page.enable'); await send('Runtime.enable');
const ORIGIN = 'http://localhost:5176';
if (MODE === 'pc') { await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false }); }
else { await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }); await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }] }); }
const HELP = `window.__h = (() => { const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const set = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); };
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
  const any = (re) => [...document.querySelectorAll('button,[role="button"],a')].filter((b) => vis(b) && re.test((b.getAttribute('aria-label') || b.textContent).trim()));
  const wait = async (fn, ms = 15000) => { for (let t = 0; t < ms; t += 200) { const v = fn(); if (v) return v; await sleep(200); } return null; };
  /* what sticks out past the right edge, the thing a phone shows as cut off or as a sideways scroll */
  const wide = () => { const W = innerWidth; const seen = [];
    for (const e of document.querySelectorAll('body *')) { const r = e.getBoundingClientRect(); if (r.width === 0 || r.height === 0 || r.right <= W + 2) continue;
      let p = e.parentElement, clipped = false; while (p && p !== document.body) { const s = getComputedStyle(p); if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) { const pr = p.getBoundingClientRect(); if (pr.right <= W + 2) { clipped = true; break; } } p = p.parentElement; }
      if (clipped || getComputedStyle(e).position === 'fixed' && r.left >= W) continue;
      seen.push({ tag: e.tagName.toLowerCase(), cls: String(e.className).slice(0, 60), text: (e.innerText || '').trim().slice(0, 40), right: Math.round(r.right) }); if (seen.length > 40) break; }
    /* keep the outermost ones only */
    return seen.slice(0, 6); };
  const toasts = () => [...document.querySelectorAll('[role="status"],[role="alert"],.toast,[data-sonner-toast]')].filter(vis).map((t) => t.innerText.trim().slice(0, 140)).filter(Boolean);
  const stat = () => ({ sw: document.documentElement.scrollWidth, vw: innerWidth, sh: document.documentElement.scrollHeight, wide: wide(), toasts: toasts(),
    bad: (document.body.innerText.match(/[^\\n]{0,40}(error|gagal|failed|denied|permission|tidak dapat|could not|undefined|NaN|\\[object)[^\\n]{0,40}/gi) || []).slice(0, 5) });
  /* the picker: phone rows and PC badges both carry .kpm-demo-tier; the PC badge's button is inside it */
  const pick = (tier) => [...document.querySelectorAll('.kpm-demo-row, .kpm-demo-badge')].filter(vis).filter((c) => c.querySelector('.kpm-demo-tier')?.innerText.trim() === tier)
    .map((c) => c.matches('button') ? c : c.querySelector('button')).find((b) => b && !b.disabled);
  return { sleep, set, any, wait, wide, stat, vis, pick }; })();`;
const helpers = () => ev(`(async () => { for (let i = 0; i < 80 && !document.body; i++) await new Promise((r) => setTimeout(r, 100)); ${HELP} return 1; })()`);
const shot = async (name, full = false) => { const f = `${DIR}${MODE}-${TIER}-${name}.png`; rmSync(f, { force: true });
  const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full }); writeFileSync(f, Buffer.from(r.result.data, 'base64')); return `${MODE}-${TIER}-${name}.png ${statSync(f).size}`; };
const out = { mode: MODE, tier: TIER, screens: {} };

/* 1. the door: Google sign-in as the invited guest, the picker, the vault gate */
await send('Page.navigate', { url: ORIGIN + '/' }); await sleep(1500); await helpers();
await ev(`(async () => { await __h.wait(() => window.__kpmEmulatorAuth); const { auth, credential, signIn } = window.__kpmEmulatorAuth; await auth.signOut();
  await signIn(auth, credential(JSON.stringify({ sub: 'g-walker', email: 'walker@gmail.com', email_verified: true }))); })()`);
await send('Page.navigate', { url: ORIGIN + '/' }); await sleep(2500); await helpers();
out.picker = await ev(`(async () => { const row = await __h.wait(() => __h.pick('${TIER}'));
  return { found: !!row, text: document.body.innerText.slice(0, 300), stat: __h.stat() }; })()`);
out.pickerShot = await shot('0-picker');
await ev(`(async () => { __h.pick('${TIER}').click(); })()`);
await sleep(4000); await helpers();
out.gate = await ev(`(async () => { const g = await __h.wait(() => document.querySelector('input[placeholder="MASTER PASSWORD"]'), 20000); if (!g) return { gate: false, text: document.body.innerText.slice(0, 300) };
  return { gate: true, stat: __h.stat() }; })()`);
out.gateShot = await shot('1-gate');
out.inside = await ev(`(async () => { const { sleep, set, any, wait } = __h; const g = document.querySelector('input[placeholder="MASTER PASSWORD"]'); if (g) { set(g, 'admin123'); await sleep(300); any(/Open the vault/i)[0]?.click(); }
  await wait(() => !document.querySelector('input[placeholder="MASTER PASSWORD"]'), 20000); await sleep(3500);
  return { text: document.body.innerText.slice(0, 400), stat: __h.stat() }; })()`);
out.homeShot = await shot('2-home');
/* the capybara's greeting: LANJUT through every line to the two answers, then "1 Pandu saya" = the step-by-step guide */
out.greet = await ev(`(async () => { const lines = []; for (let i = 0; i < 12; i++) { const ct = document.querySelector('.kpm-ct'); if (!ct) break; lines.push(ct.querySelector('p')?.innerText);
    if (ct.querySelector('.choices')) break; ct.querySelector('.box').click(); await __h.sleep(500); }
  return lines; })()`);
out.choicesShot = await shot('2b-choices');
out.guide = await ev(`(async () => { const c = document.querySelector('.kpm-ct .choices button'); if (!c) return 'no choices'; c.click(); await __h.sleep(1800);
  const ring = document.querySelector('.kpm-mx-ring'), rr = ring?.getBoundingClientRect(); const box = [...document.querySelectorAll('[aria-label="Tutup petunjuk"]')].map((x) => x.closest('div'))[0]?.parentElement;
  const br = box?.getBoundingClientRect();
  return { ring: rr ? [Math.round(rr.left), Math.round(rr.top), Math.round(rr.width), Math.round(rr.height)] : null, box: br ? [Math.round(br.left), Math.round(br.top), Math.round(br.width), Math.round(br.height)] : null,
    say: box?.innerText.replace(/\\n+/g, ' / ').slice(0, 200), stat: __h.stat() }; })()`);
out.guideShot = await shot('2c-guide');
await ev(`(async () => { document.querySelector('[aria-label="Tutup petunjuk"]')?.click(); await __h.sleep(600); })()`);

/* 2. the DEMO bar and its SWITCH */
out.bar = await ev(`(async () => { const b = document.querySelector('.kpm-demo-bar'); if (!b) return null; const r = b.getBoundingClientRect();
  return { text: b.innerText.replace(/\\n+/g, ' / '), box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], sw: b.scrollWidth, cw: b.clientWidth }; })()`);
out.switch = await ev(`(async () => { const s = __h.any(/^switch/i)[0]; if (!s) return 'no SWITCH button'; s.click(); await __h.sleep(900); return __h.stat(); })()`);
out.switchShot = await shot('3-switch');
await ev(`(async () => { document.querySelector('.kpm-demo-bar .scrim')?.click(); await __h.sleep(500); })()`);

/* 3. the capybara mission line + its hint key */
out.mission = await ev(`(async () => { const m = document.querySelector('.kpm-mission'); if (!m) return null; const r = m.getBoundingClientRect();
  const hk = document.querySelector('[aria-label="Petunjuk"]'); hk?.click(); await __h.sleep(1500);
  const box = document.querySelector('.kpm-ct, .kpm-mx-box, [role="dialog"]'); const br = box?.getBoundingClientRect();
  return { text: m.innerText.replace(/\\n+/g, ' / ').slice(0, 200), box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
    hint: box ? { text: box.innerText.replace(/\\n+/g, ' / ').slice(0, 300), box: [Math.round(br.left), Math.round(br.top), Math.round(br.width), Math.round(br.height)] } : null, stat: __h.stat() }; })()`);
out.missionShot = await shot('4-mission');
/* the hint opened the capybara again: LANJUT to the answers, then "2 Saya coba sendiri" */
await ev(`(async () => { for (let i = 0; i < 12; i++) { const ct = document.querySelector('.kpm-ct'); if (!ct) break; const c = ct.querySelectorAll('.choices button'); if (c.length) { c[1].click(); await __h.sleep(600); break; } ct.querySelector('.box').click(); await __h.sleep(500); }
  document.querySelector('[aria-label="Tutup petunjuk"]')?.click(); await __h.sleep(500); })()`);

/* 4. every sidebar screen */
const openNav = `(async () => { const o = document.querySelector('[aria-label="Open navigation"]'); if (o && __h.vis(o)) { o.click(); await __h.sleep(700); } })()`;
await ev(openNav);
out.nav = await ev(`[...document.querySelectorAll('[data-mark]')].filter(__h.vis).map((e) => ({ id: e.dataset.mark, label: e.innerText.trim().replace(/\\n+/g, ' ') }))`);
out.navShot = await shot('5-nav');
for (const { id: mark } of (out.nav || [])) {
  if (ONLY.length && !ONLY.includes(mark)) continue;
  errors = [];
  await ev(openNav);
  const r = await ev(`(async () => { const e = [...document.querySelectorAll('[data-mark="${mark}"]')].find(__h.vis); if (!e) return { missing: true }; e.click(); await __h.sleep(3200);
    const h = [...document.querySelectorAll('h1,h2,h3')].filter(__h.vis).map((x) => x.innerText.trim()).slice(0, 4);
    return { heads: h, stat: __h.stat(), empty: (document.body.innerText.match(/[^\\n]{0,30}(belum ada|no data|kosong|nothing|tidak ada|empty)[^\\n]{0,30}/gi) || []).slice(0, 4) }; })()`);
  r.shot = await shot(`s-${mark}`);
  /* the tutorial book from this screen */
  r.book = await ev(`(async () => { const b = __h.any(/^Tutorial book$/)[0]; if (!b) return 'no book button'; b.click(); await __h.sleep(1800);
    const d = [...document.querySelectorAll('[role="dialog"]')].filter(__h.vis).pop(); if (!d) return 'book did not open';
    const dr = d.getBoundingClientRect();
    return { text: d.innerText.replace(/\\n+/g, ' / ').slice(0, 260), box: [Math.round(dr.left), Math.round(dr.top), Math.round(dr.width), Math.round(dr.height)], stat: __h.stat() }; })()`);
  if (typeof r.book === 'object') { await sleep(1500); r.bookShot = await shot(`b-${mark}`);
    /* every lesson this section has: tap it, frames while it plays, then close it */
    const titles = await ev(`[...document.querySelectorAll('.pp-entry.pp-ready, [role="dialog"] button')].filter((b) => __h.vis(b) && !b.disabled && /Buka|Open|▶/i.test(b.innerText) && b.querySelector('.pp-etitle, h3, h4, b')).map((b) => (b.querySelector('.pp-etitle, h3, h4, b').innerText || '').trim())`) || [];
    r.lessons = {};
    for (const t of titles) {
      const L = {};
      L.open = await ev(`(async () => { const b = [...document.querySelectorAll('.pp-entry.pp-ready, [role="dialog"] button')].find((b) => __h.vis(b) && (b.querySelector('.pp-etitle, h3, h4, b')?.innerText || '').trim() === ${JSON.stringify(t)});
        if (!b) { const o = __h.any(/^Tutorial book$/)[0]; o?.click(); await __h.sleep(1800); }
        const b2 = [...document.querySelectorAll('.pp-entry.pp-ready, [role="dialog"] button')].find((b) => __h.vis(b) && (b.querySelector('.pp-etitle, h3, h4, b')?.innerText || '').trim() === ${JSON.stringify(t)});
        if (!b2) return 'lesson button gone'; b2.click(); await __h.sleep(2500);
        const d = [...document.querySelectorAll('[role="dialog"]')].filter(__h.vis).pop(); const dr = d?.getBoundingClientRect();
        return { label: d?.getAttribute('aria-label'), box: dr ? [Math.round(dr.left), Math.round(dr.top), Math.round(dr.width), Math.round(dr.height)] : null, stat: __h.stat() }; })()`);
      const slug = t.replace(/\W+/g, '').slice(0, 14);
      L.f1 = await shot(`L-${mark}-${slug}-a`); await sleep(5000);
      L.mid = await ev(`(async () => { const d = [...document.querySelectorAll('[role="dialog"]')].filter(__h.vis).pop(); return { text: d?.innerText.replace(/\\n+/g, ' / ').slice(0, 300), stat: __h.stat() }; })()`);
      L.f2 = await shot(`L-${mark}-${slug}-b`); await sleep(8000);
      L.f3 = await shot(`L-${mark}-${slug}-c`);
      await ev(`(async () => { const c = [...document.querySelectorAll('[role="dialog"] button[aria-label="Close"]')].filter(__h.vis).pop(); c?.click(); await __h.sleep(1200); })()`);
      r.lessons[t] = L;
    }
    await ev(`(async () => { const c = document.querySelector('[aria-label="Tutup tutorial"]') || [...document.querySelectorAll('[role="dialog"] button[aria-label="Close"]')].filter(__h.vis).pop(); c?.click(); await __h.sleep(1200);
      if ([...document.querySelectorAll('[role="dialog"]')].some(__h.vis)) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); await __h.sleep(700); } })()`); }
  r.errors = [...new Set(errors)].slice(0, 6);
  out.screens[mark] = r;
}
out.errorsEnd = errors;
const f = `${DIR}${MODE}-${TIER}.json`; writeFileSync(f, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1).slice(0, 3000));
chrome.kill(); process.exit(0);
