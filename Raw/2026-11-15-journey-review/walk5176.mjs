/* WALK THE DEMO TUTORIAL ON THE ANDROID PHONE, as a visitor - on the BIG company (kpm 2a02b48d), before the live switch.
   Phone = AVD kpm_phone (Pixel 7, 412 CSS px, Chrome 124), its Chrome driven over the DevTools socket: every press is a
   real touch (Input.dispatchTouchEvent), every number goes in with Input.insertText after a tap on its box.
     node walk.mjs [maxRounds]
   Needs: launch demo-emulator (+ node tools/demo-reset-emulator.mjs --big), demo-api-emulator, demo-app-emulator;
   adb reverse tcp:5176 / 8080 / 9099; the phone's Chrome on http://localhost:5176/; demo_invites/walker@gmail.com.
   Every new beat of the guide: a frame s<step>-<beat>.jpg and where the ring sits (walk.json). It stops when the same
   press repeats 3 times without the beat moving and prints what the ring is round. Progress lives in the phone's
   Chrome, so a rerun carries on where the last one stopped. */
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('.', import.meta.url));
const ADB = 'C:/Users/ASUS/AppData/Local/Android/Sdk/platform-tools/adb.exe';
const MAX = Number(process.argv.find((a) => /^\d+$/.test(a))) || 160;
/* --pc: the same walk in a desktop Chrome (headless, 1280x800, mouse presses) - its own visitor, frames pc-*.jpg */
const TAG = (process.argv.find((a) => a.startsWith('--tag=')) || '').slice(6);   // --tag=final: frames final-*.jpg, a run of its own
const PC = process.argv.includes('--pc'), PORT = PC ? 9557 : 9223, PRE = (PC ? 'pc-' : '') + (TAG ? TAG + '-' : '');
const GUEST = PC ? 'walker.pc@gmail.com' : 'walker@gmail.com', PASS = 'admin123';
const WHO = { 1: 'T2', 2: 'T2', 3: 'T4', 4: 'T6', 5: 'T6', 6: 'T6', 7: 'T2', 8: 'T2' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

if (PC) {
    const up = await fetch(`http://127.0.0.1:${PORT}/json/version`).then(() => true, () => false);
    if (!up) {
        const { spawn } = await import('node:child_process');
        spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${DIR}prof-pc`, '--window-size=1280,800', '--hide-scrollbars', 'http://localhost:5176/'], { detached: true, stdio: 'ignore' }).unref();
        await sleep(5000);
    }
} else execFileSync(ADB, ['forward', 'tcp:9223', 'localabstract:chrome_devtools_remote']);
const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const page = list.find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
if (!page) { console.log('NO PAGE', JSON.stringify(list.map((p) => p.url))); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map(); const errors = new Set();
ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && wait.has(m.id)) { const w = wait.get(m.id); wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); return; }
    if (m.method === 'Runtime.exceptionThrown') errors.add('throw: ' + String(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).split('\n')[0].slice(0, 200));
    if (m.method === 'Runtime.consoleAPICalled') {
        const s = m.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
        if (m.params.type === 'error' || /permission|denied|insufficient|INTERNAL ASSERTION/i.test(s)) errors.add(m.params.type + ': ' + s.split('\n')[0].slice(0, 200));
    }
});
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; wait.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable');
await send('Page.enable');
if (PC) await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
const run = async (fn, ...args) => {
    const r = await send('Runtime.evaluate', { expression: `(${fn})(...${JSON.stringify(args)})`, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) return { phase: 'error', error: (r.exceptionDetails.exception?.description || r.exceptionDetails.text || '').slice(0, 300) };
    return r.result.value;
};
const tap = async ([x, y]) => {
    if (PC) {
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
        for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
        return;
    }
    const pt = [{ x, y, radiusX: 4, radiusY: 4, force: 1, id: 1 }];
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt });
    await sleep(70);
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
};
const type = async (text) => {
    await run(() => { try { document.activeElement?.select?.(); } catch { /* not selectable */ } return true; });
    await send('Input.insertText', { text: String(text) });
};
const shot = async (name) => {
    const m = await send('Page.getLayoutMetrics'); const v = m.cssVisualViewport;
    const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60, clip: { x: v.pageX, y: v.pageY, width: v.clientWidth, height: v.clientHeight, scale: PC ? 0.6 : 0.42 } });
    writeFileSync(`${DIR}${PRE}${name}.jpg`, Buffer.from(s.data, 'base64'));
    return `${PRE}${name}.jpg`;
};

/* ---- in the page ---- */
function probe() {
    const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const mid = (e, cap = 9999) => { const r = e.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + Math.min(r.height / 2, cap))]; };
    const box = (e) => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
    const toasts = [...document.querySelectorAll('[data-sonner-toast],[role="alert"],[role="status"]')].filter((t) => vis(t) && !t.classList.contains('kpm-mx-cap'))
        .map((t) => t.innerText.trim().replace(/\s+/g, ' ').slice(0, 150)).filter(Boolean);
    const base = { toasts, vw: innerWidth, vh: innerHeight };
    const ct = document.querySelector('.kpm-ct');
    if (ct && vis(ct)) {
        const ch = [...ct.querySelectorAll('.choices button')].filter(vis);
        return { ...base, phase: 'talk', line: ct.querySelector('p')?.innerText, choices: ch.length, tap: ch.length ? mid(ch[0]) : mid(ct.querySelector('.box')) };
    }
    const dlg = [...document.querySelectorAll('[role="alertdialog"]')].find(vis);
    if (dlg) {
        const btns = [...dlg.querySelectorAll('button')].filter(vis);
        const yes = btns.filter((b) => !/^(cancel|batal|tidak|no|kembali|tutup)$/i.test(b.innerText.trim())).pop();
        return { ...base, phase: 'dialog', text: dlg.innerText.replace(/\s+/g, ' ').slice(0, 220), buttons: btns.map((b) => b.innerText.trim()), tap: yes ? mid(yes) : null };
    }
    const gate = [...document.querySelectorAll('input[placeholder="MASTER PASSWORD"]')].find(vis);
    if (gate) {
        const open = [...document.querySelectorAll('button')].filter(vis).find((b) => /open the vault/i.test(b.innerText));
        return { ...base, phase: 'gate', input: mid(gate), open: open ? mid(open) : null, shown: (document.body.innerText.match(/Demo vault password[^\n]*/i) || [null])[0] };
    }
    if (document.querySelector('[data-mission="switch"][aria-expanded="true"]')) {
        const rows = [...document.querySelectorAll('.sheet [role="menuitem"], .sheet .row, .sheet button')].filter(vis);
        return { ...base, phase: 'sheet', rows: rows.map((r) => ({ t: r.innerText.trim().replace(/\s+/g, ' ').slice(0, 60), at: mid(r) })) };
    }
    const cap = document.querySelector('.kpm-mx-cap');
    if (cap && vis(cap)) {
        const ring = document.querySelector('.kpm-mx-ring');
        const step = Number(((cap.querySelector('b')?.innerText || '').match(/(\d+)\//) || [])[1]);
        let land = null;
        if (ring) {
            const r = ring.getBoundingClientRect(), c = cap.getBoundingClientRect();
            const x = Math.min(r.left + r.width / 2, innerWidth - 4), y = r.top + Math.min(r.height / 2, 40);
            const hit = document.elementsFromPoint(x, y).find((e) => !e.closest('.kpm-mx-ring,.kpm-mx-veil,.kpm-mx-cap'));
            const t = hit?.closest('button,[role="button"],a,input,select,label,[data-mark],[data-agent],[data-guide]') || hit;
            land = { ring: box(ring), cap: box(cap), inView: r.top >= -1 && r.left >= -1 && r.bottom <= innerHeight + 1 && r.right <= innerWidth + 1,
                capOverRing: !(c.right <= r.left || c.left >= r.right || c.bottom <= r.top || c.top >= r.bottom),
                hit: (t?.getAttribute?.('aria-label') || t?.innerText || t?.tagName || '').trim().replace(/\s+/g, ' ').slice(0, 50) };
        }
        return { ...base, phase: 'guide', step, beat: cap.querySelector('.notch')?.getAttribute('aria-label'), say: cap.querySelector('p')?.innerText, land };
    }
    const mission = document.querySelector('.kpm-mission');
    if (!mission) {
        const tiers = [...document.querySelectorAll('button')].filter((b) => vis(b) && !b.disabled && /^T[1-6]\b/.test(b.innerText.trim()));
        if (tiers.length) return { ...base, phase: 'door', tiers: tiers.map((b) => ({ t: b.innerText.trim().replace(/\s+/g, ' ').slice(0, 50), at: mid(b) })) };
        const auth = window.__kpmEmulatorAuth?.auth;
        if (auth && !auth.currentUser) return { ...base, phase: 'signin', text: document.body.innerText.trim().replace(/\s+/g, ' ').slice(0, 160) };
    }
    if (mission && vis(mission)) {
        const hint = document.querySelector('[aria-label="Petunjuk"]');
        return { ...base, phase: 'app', mission: mission.innerText.replace(/\s+/g, ' ').slice(0, 140), hint: hint ? mid(hint) : null };
    }
    return { ...base, phase: 'none', text: document.body.innerText.trim().replace(/\s+/g, ' ').slice(0, 200) };
}

async function signIn(email) {
    const { auth, credential, signIn: go } = window.__kpmEmulatorAuth;
    await go(auth, credential(JSON.stringify({ sub: 'g-' + email, email, email_verified: true })));
    setTimeout(() => location.reload(), 150);
    return 'ok';
}

function gateState() {
    const g = [...document.querySelectorAll('input[placeholder="MASTER PASSWORD"]')].find((e) => e.getBoundingClientRect().height > 0);
    if (!g) return { gate: false };
    const open = [...document.querySelectorAll('button')].find((b) => /open the vault/i.test(b.innerText));
    const card = g.closest('form') || g.parentElement?.parentElement?.parentElement;
    return { gate: true, len: g.value.length, btn: open ? open.innerText.trim() + (open.disabled ? ' (disabled)' : '') : null, text: (card?.innerText || '').replace(/\s+/g, ' ').slice(0, 220) };
}

function dump() {
    const ring = document.querySelector('.kpm-mx-ring'); const r = ring?.getBoundingClientRect();
    const els = r ? document.elementsFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 40)).filter((e) => !e.closest('.kpm-mx-ring,.kpm-mx-veil,.kpm-mx-cap')).slice(0, 4) : [];
    const t = els[0]?.closest('[data-guide],[data-mission],[data-mark],section,form,table') || els[0];
    return { ring: r && [r.left, r.top, r.width, r.height].map(Math.round), active: document.activeElement?.outerHTML?.replace(/\s+/g, ' ').slice(0, 240),
        stack: els.map((e) => e.tagName + '.' + String(e.className).slice(0, 50)), html: t?.outerHTML?.replace(/\s+/g, ' ').slice(0, 2400), text: t?.innerText?.replace(/\s+/g, ' ').slice(0, 700) };
}

/* what a visitor does on this beat: { tap, type?, wait?, note } - or { dump } when the walk does not know yet */
async function act(say) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const mid = (e, cap = 30) => { const r = e.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + Math.min(r.height / 2, cap))]; };
    const tx = (e) => (e.getAttribute('aria-label') || e.innerText || e.placeholder || '').trim().replace(/\s+/g, ' ');
    const set = (el, v) => {
        const proto = el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const bring = async (e) => { const r = e.getBoundingClientRect(); if (r.top < 56 || r.bottom > innerHeight - 8) { e.scrollIntoView({ block: 'center' }); await sleep(550); } return mid(e); };
    const clickables = (root) => (root ? [...root.querySelectorAll('button,[role="button"],[role="option"],li,a')].filter((e) => vis(e) && !e.disabled) : []);
    /* leave the box he typed in first: the phone's keyboard moves the visible part of the page, and a tap read off the
       page's own boxes then lands beside the next box (run 8: the second goods line took two taps and nothing) */
    const field = async (el, v) => {
        if (document.activeElement?.matches?.('input,textarea') && document.activeElement !== el) { document.activeElement.blur(); await sleep(600); }
        return { tap: await bring(el), type: String(v), note: `type ${v} into "${tx(el).slice(0, 30)}"` };
    };
    const ring = document.querySelector('.kpm-mx-ring'); const ae = document.activeElement;
    if (/^Langkah ini untuk/.test(say)) return { tap: mid(document.querySelector('[data-mission="switch"]')), wait: 900, note: 'SWITCH' };
    if (!ring) { if (ae?.matches?.('input,textarea,select')) ae.blur(); return { wait: 1200, note: `busy: no ring on the page yet ${Date.now() % 100000}` }; }
    { const r = ring.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) { if (ae && ae !== document.body) ae.blur(); return { wait: 900, note: 'ring off screen (typing) -> leave the box' }; } }
    const ringTap = () => { const r = ring.getBoundingClientRect(); return [Math.round(Math.min(Math.max(r.left + r.width / 2, 4), innerWidth - 4)), Math.round(Math.max(r.top + Math.min(r.height / 2, 40), 4))]; };
    /* the key under the ring is busy (MEMPROSES...): wait like a visitor, no press - the loop guard still stops a forever */
    { const [x, y] = ringTap(); const k = document.elementsFromPoint(x, y).find((e) => !e.closest('.kpm-mx-ring,.kpm-mx-veil,.kpm-mx-cap'))?.closest('button');
      if (k?.disabled) return { wait: 1500, note: `busy: "${tx(k).slice(0, 24)}" ${Date.now() % 100000}` }; }
    let m;
    if ((m = say.match(/^Pilih (Asal|Tujuan): (.+?)\.$/))) {
        const boxEl = document.querySelector(`[data-guide="${m[1].toLowerCase()}"]`);
        const all = clickables(boxEl), opts = all.slice(1);
        const want = /gudang wilayah/.test(m[2]) ? opts.find((o) => o.innerText.trim() && !/master vault|gudang pusat|produksi|pilih/i.test(o.innerText))
            : opts.find((o) => o.innerText.includes(m[2].replace(/\s*\(.*\)$/, '')));
        if (!want) return { tap: all[0] ? await bring(all[0]) : ringTap(), note: `open ${m[1]} (${opts.length} options: ${opts.map(tx).join(' | ').slice(0, 160)})` };
        return { tap: await bring(want), note: 'option ' + tx(want).slice(0, 50) };
    }
    if (/^Pilih barang/.test(say)) {
        const items = clickables(document.querySelector('[data-guide="goods"]')).filter((b) => b.innerText.trim().length > 6);
        if (!items.length) return { dump: true, note: 'no goods item' };
        return { tap: await bring(items[0]), note: `goods "${tx(items[0]).slice(0, 50)}" (${items.length})` };
    }
    if (/^Isi jumlah(nya dalam| yang dikirim)/.test(say)) {
        const ins = [...(document.querySelector('[data-guide="cart"]')?.querySelectorAll('input') || [])].filter((i) => vis(i) && i.placeholder !== '08-B');
        const q = ins.find((i) => / pcs$/.test(i.getAttribute('aria-label') || '')) || ins.find((i) => i.type === 'number') || ins[0];
        if (!q) return { dump: true, note: 'no cart number box' };
        return await field(q, 10);
    }
    if (/^Ketuk satu barang di gudang/.test(say)) {
        const cells = [...(document.querySelector('[data-guide="wh"]')?.children || [])].filter((e) => vis(e) && e.innerText.trim());
        if (!cells.length) return { dump: true, note: 'no warehouse square with goods' };
        return { tap: await bring(cells[0]), note: `wh "${tx(cells[0]).slice(0, 40)}" (${cells.length})` };
    }
    if (/^Lalu ketuk kotak kosong di van/.test(say)) {
        const cells = [...(document.querySelector('[data-guide="van"]')?.children || [])].filter((e) => vis(e) && !e.innerText.trim());
        if (!cells.length) return { dump: true, note: 'no empty van square' };
        return { tap: await bring(cells[0]), note: `empty van square (${cells.length})` };
    }
    if (/^Isi jumlahnya, lalu tekan Masukkan ke van/.test(say)) {
        const q = document.querySelector('#kpm-bay-qty'), ok = document.querySelector('.kpm-bay-sheet .key.ok');
        if (q && !q.value) return await field(q, 10);
        if (ok && !ok.disabled) { ae?.blur?.(); return { tap: await bring(ok), note: 'sheet: ' + tx(ok) }; }
        return { dump: true, note: 'sheet: no number box / OK key' };
    }
    if (/^Pilih tokonya dari daftar/.test(say)) {
        /* a shop row, not the sheet's own keys (SELESAI, search, filters): below the sheet's head, and never a bare key word */
        const list = document.querySelector('[data-guide="shops"]'), headEnd = list.getBoundingClientRect().top + 60;
        const all = clickables(list).filter((b) => b.getBoundingClientRect().top > headEnd && b.innerText.trim().length > 3
            && !/^(selesai|done|tutup|close|batal|cancel|cari|search|filter|semua|all)$/i.test(b.innerText.trim()) && !/^\+/.test(b.innerText.trim()));
        const opt = all.filter((b) => b.matches('[role="option"],li'));
        const rows = opt.length ? opt : all;
        if (!rows.length) return { wait: 1200, note: `the list has no rows yet ${Date.now() % 100000}` };
        return { tap: await bring(rows[0]), note: `shop "${tx(rows[0]).slice(0, 50)}" (${rows.length} rows)` };
    }
    if (/^Tekan \+ pada barang/.test(say)) {
        const plus = clickables(document.querySelector('[data-guide="products"]')).filter((b) => /^\+$|^\+\s|\s\+$/.test(b.innerText.trim()) || /tambah|add/i.test(b.getAttribute('aria-label') || ''));
        if (!plus.length) return { dump: true, note: 'no + key' };
        return { tap: await bring(plus[0]), note: `+ "${tx(plus[0]).slice(0, 40)}" (${plus.length})` };
    }
    if (/Pilih alasan rusaknya/.test(say)) {
        const r = document.querySelector('[data-guide="reason"]'); const s = r?.matches('select') ? r : r?.querySelector('select');
        if (!s) return { dump: true, note: 'reason box is not a select' };
        const o = [...s.options].find((x) => x.value); set(s, o.value); return { wait: 900, note: 'reason ' + o.textContent };
    }
    if (/Ubah kondisinya menjadi Damaged/.test(say)) {
        const r = document.querySelector('[data-guide="cond"]'); const s = r?.matches('select') ? r : r?.querySelector('select');
        if (s) { const o = [...s.options].find((x) => /damag|rusak/i.test(x.value + x.textContent)); set(s, o.value); return { wait: 900, note: 'condition ' + o.textContent }; }
        const b = clickables(r).find((x) => /damag|rusak/i.test(tx(x)));
        return b ? { tap: await bring(b), note: 'condition key' } : { dump: true, note: 'no Damaged control' };
    }
    if (/^Isi juga kotak ini/.test(say)) {
        const box = document.querySelector('[data-half] input:placeholder-shown');
        return box ? await field(box, 0) : { wait: 900, note: `busy: no half box ${Date.now() % 100000}` };
    }
    if (/^Isi jumlah fisik/.test(say)) {
        const ins = [...document.querySelectorAll('[data-guide="good"]')].filter((i) => vis(i) && !i.disabled && i.value === '');
        if (!ins.length) return { wait: 900, note: 'no empty count box' };
        return await field(ins[0], 10);
    }
    if (/^Tekan ✓/.test(say)) {
        /* each ✓ moves the next one to the same spot on the screen (the guide scrolls it in), so name the key in the note */
        const k = document.querySelector('.pc[data-agent="demo-agent-2"]:not([data-late]) [aria-label^="approve "][aria-pressed="false"]');
        if (!k) return { wait: 900, note: `busy: no unticked key ${Date.now() % 100000}` };
        return { tap: await bring(k), note: tx(k) };
    }
    if (/^Hitung tiap kartu/.test(say)) {
        /* EODCardDeck: a transfer row gets Landed; a line box takes 99999 (it clamps to what the line carried); the one
           cash box takes the biggest Rp on its card; then the card's own "Put ... in the letter" key */
        const d = document.querySelector('[data-guide="deck"]');
        const landed = [...d.querySelectorAll('button')].filter((b) => vis(b) && !b.disabled && b.innerText.trim() === 'Landed' && /ink-dim/.test(b.className));
        if (landed.length) return { tap: await bring(landed[0]), note: `transfer: Landed (${landed.length} to tick)` };
        const box = [...d.querySelectorAll('input')].filter((i) => vis(i) && !i.disabled && i.value === '');
        if (box.length) {
            let v = '99999';
            if (box[0].classList.contains('text-2xl')) {
                const rp = (box[0].closest('div')?.parentElement?.parentElement?.innerText.match(/Rp\s?[\d.]+/g) || []).map((s) => Number(s.replace(/\D/g, '')));
                v = String(rp.length ? Math.max(...rp) : 0);
            }
            return await field(box[0], v);
        }
        const put = [...d.querySelectorAll('button')].filter((b) => vis(b) && !b.disabled && /in the letter/i.test(b.innerText));
        if (put.length) { ae?.blur?.(); return { tap: await bring(put[0]), note: put[0].innerText.trim().slice(0, 50) }; }
        return { dump: true, note: 'the deck: nothing to fill or press' };
    }
    return { tap: ringTap(), note: 'ring' };
}

/* ---- the walk ---- */
const out = existsSync(`${DIR}${PRE}walk.json`) ? JSON.parse(readFileSync(`${DIR}${PRE}walk.json`, 'utf8')) : { chrome: (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).Browser, beats: [], events: [] };
const seenToast = new Set();
const TIER = (process.argv.find((a) => a.startsWith('--tier=')) || '').slice(7);   // --tier=T4: the door picks this person
let lastKey = '', lastSig = '', repeats = 0, idle = 0, wantTier = TIER || out.wantTier || 'T2';
const visits = {}, inBeat = new Proxy({}, { get: (o, k) => o[k] || 0, set: (o, k, v) => { o[k] = v; return true; } });
let busyStart = 0, lastKeySeen = '';
const stuck = async (st, why) => {
    out.stuck = { step: st.step, beat: st.beat, say: st.say, why, dump: await run(dump), frame: await shot(`stuck-s${st.step}`) };
    console.log(`STUCK (${why}) on S${st.step} ${st.beat}: ${st.say}\n${JSON.stringify(out.stuck.dump, null, 1).slice(0, 3200)}`);
};
for (let k = 0; k < MAX; k++) {
    const st = await run(probe);
    for (const t of st.toasts || []) if (!seenToast.has(t)) { seenToast.add(t); console.log('   toast:', t); out.events.push({ k, toast: t }); }
    if (st.phase !== 'none' && st.phase !== 'error') idle = 0;
    if (st.phase === 'talk') { console.log(`${k} capybara${st.choices ? ' -> Pandu saya' : ''}: ${(st.line || '').slice(0, 120)}`); await tap(st.tap); await sleep(st.choices ? 1500 : 650); continue; }
    if (st.phase === 'dialog') {
        console.log(`${k} dialog: ${st.text} [${st.buttons.join(' | ')}]`); out.events.push({ k, dialog: st.text, frame: await shot(`dialog-${k}`) });
        if (!st.tap) break; await tap(st.tap); await sleep(3500); continue;
    }
    if (st.phase === 'gate') {
        /* how long the gate takes to open after the press, read every 500 ms - the first walk saw it four rounds in a row */
        const frame = await shot(`gate-${k}`);
        await tap(st.input); await sleep(450); await type(PASS); await sleep(450);
        const t0 = Date.now(); if (st.open) await tap(st.open);
        let info = null;
        for (let i = 0; i < 60; i++) { await sleep(500); info = await run(gateState); if (!info.gate) break; }
        const ms = Date.now() - t0;
        console.log(`${k} vault gate (${st.shown || 'no password on screen'}) -> ${info.gate ? `STILL SHUT after ${ms} ms: ${JSON.stringify(info)}` : `open after ${ms} ms`}`);
        out.events.push({ k, gate: st.shown, openMs: info.gate ? null : ms, info, frame });
        if (info.gate) out.events.push({ k, gateStill: await shot(`gate-still-${k}`) });
        if (process.argv.includes('--gate-only')) break;   // the small-vs-big timing: one gate, then stop
        continue;
    }
    if (st.phase === 'sheet' || st.phase === 'door') {
        const rows = st.rows || st.tiers; const row = rows.find((r) => r.t.startsWith(wantTier));
        console.log(`${k} ${st.phase} -> ${wantTier}: ${rows.map((r) => r.t).join(' | ').slice(0, 220)}`);
        if (!row) break; out.wantTier = wantTier; await tap(row.at); await sleep(9000); continue;
    }
    if (st.phase === 'signin') { console.log(`${k} sign in as ${GUEST}`); await run(signIn, GUEST); await sleep(7000); continue; }
    if (st.phase === 'app') {
        if (/Misi selesai/i.test(st.mission)) { console.log(`${k} DONE: ${st.mission}`); out.done = { mission: st.mission, frame: await shot('done') }; break; }
        console.log(`${k} guide off (${st.mission}) -> Petunjuk`); if (!st.hint) break; await tap(st.hint); await sleep(1300); continue;
    }
    if (st.phase === 'guide') {
        const key = `${st.step}|${st.beat}|${st.say}`;
        if (key !== lastKey) {
            if (busyStart) { const ms = Date.now() - busyStart; console.log(`   (the key before stayed busy ${ms} ms)`); out.events.push({ k, busyMs: ms, before: lastKey }); busyStart = 0; }
            lastKey = key; wantTier = WHO[st.step] || wantTier;
            const b = Number((st.beat || '').match(/bagian (\d+)/)?.[1]) || 0;
            /* one beat can say two things (the phone's fallback key, then the control): the words go in the name */
            const slug = st.say.toLowerCase().replace(/[^a-z0-9]+/g, '-').split('-').filter(Boolean).slice(0, 3).join('-');
            const frame = await shot(`s${st.step}-${String(b).padStart(2, '0')}-${slug}`);
            out.beats.push({ k, step: st.step, beat: st.beat, say: st.say, land: st.land, vw: st.vw, vh: st.vh, frame });
            const L = st.land;
            console.log(`${k} S${st.step} ${st.beat}: ${st.say.slice(0, 90)}${L ? ` | ring ${L.ring.join(',')} ${L.inView ? 'in view' : 'NOT ALL IN VIEW'}${L.capOverRing ? ' | BOX OVER RING' : ''} | under it: "${L.hit}"` : ' | NO RING'}`);
        }
        /* a loop between two beats comes back to the same beat again and again; many presses inside one beat (the EOD
           deck's cards) are not a loop */
        if (key !== lastKeySeen) { visits[key] = (visits[key] || 0) + 1; lastKeySeen = key; }
        if (visits[key] > 6) { await stuck(st, 'this beat came back 6 times (a loop between two beats)'); break; }
        if (++inBeat[key] > 60) { await stuck(st, '60 presses inside one beat'); break; }
        const plan = await run(act, st.say);
        if (plan.phase === 'error') { console.log('   act error:', plan.error); await stuck(st, 'act error'); break; }
        if (plan.dump) { await stuck(st, plan.note); break; }
        if (/^busy/.test(plan.note || '')) {
            inBeat[key]--; busyStart ||= Date.now();
            if (Date.now() - busyStart > 60000) { await stuck(st, 'the key stayed busy over 60 s'); break; }
        }
        const sig = key + JSON.stringify(plan);
        repeats = sig === lastSig ? repeats + 1 : 0; lastSig = sig;
        if (repeats >= 3) { await stuck(st, 'same press 3 times'); break; }
        console.log(`   -> ${plan.note || ''}${plan.tap ? ` tap ${plan.tap.join(',')}` : ''}${plan.type ? ` type "${plan.type}"` : ''}`);
        if (plan.tap) await tap(plan.tap);
        if (plan.type) { await sleep(450); await type(plan.type); }
        await sleep(plan.wait || 1400);
        continue;
    }
    console.log(`${k} ${st.phase}: ${st.error || st.text || ''}`);
    if (++idle > 8) { out.events.push({ k, idle: st.text, frame: await shot(`idle-${k}`) }); break; }
    await sleep(1500);
}
writeFileSync(`${DIR}${PRE}walk.json`, JSON.stringify(out, null, 1));
console.log('console errors:', JSON.stringify([...errors].slice(0, 15), null, 1));
ws.close();
process.exit(0);
