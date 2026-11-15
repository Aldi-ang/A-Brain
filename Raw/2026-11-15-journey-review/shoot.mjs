/* JOURNEY PLAN REVIEW BOARD - frames + numbers from the lab dev server (5176), big demo company, 2026-11-15.
   Drives the headless desktop Chrome that walk5176.mjs --pc left on CDP 9557 (signed in, vault open).
     node shoot.mjs <phone|pc|p412> <prefix>     phone = 390x844 dpr 3 + touch media; p412 = 412x915; pc = 1280x800
   Prints one JSON line of measurements, writes <prefix>-1-top.png (+ <prefix>-2-team.png on the phone).
   Old pngs are deleted before each capture; the mtime is printed after. */
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('.', import.meta.url));
const [mode = 'phone', pre = 'x'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const list = await (await fetch('http://127.0.0.1:9557/json/list')).json();
const page = list.find((p) => p.type === 'page' && /localhost:5176/.test(p.url));
if (!page) { console.log('NO PAGE'); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const wait = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); const w = m.id && wait.get(m.id); if (w) { wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); } });
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; wait.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
};
const shot = async (name) => {
    const f = `${DIR}${name}.png`; rmSync(f, { force: true });
    const r = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(f, Buffer.from(r.data, 'base64'));
    console.log('shot', name, statSync(f).mtime.toTimeString().slice(0, 8));
};

try {
    await send('Page.enable'); await send('Runtime.enable');
    const phone = mode !== 'pc';
    const [w, h] = mode === 'pc' ? [1280, 800] : mode === 'p412' ? [412, 915] : [390, 844];
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: phone ? 3 : 1, mobile: phone });
    await send('Emulation.setTouchEmulationEnabled', { enabled: phone, maxTouchPoints: phone ? 5 : 1 });
    await send('Emulation.setEmulatedMedia', { features: phone
        ? [{ name: 'hover', value: 'none' }, { name: 'pointer', value: 'coarse' }, { name: 'any-hover', value: 'none' }, { name: 'any-pointer', value: 'coarse' }]
        : [{ name: 'hover', value: 'hover' }, { name: 'pointer', value: 'fine' }] });
    await sleep(800);
    console.log('media', await js(`matchMedia('(hover: none)').matches + ' ' + innerWidth + 'x' + innerHeight`));
    /* to Journey Plan: the menu key first when the drawer hides it */
    const opened = await js(`(async () => {
        if (document.querySelector('.kx-feed')) return 'already';
        let k = document.querySelector('[data-mark="journey"]');
        const r = k && k.getBoundingClientRect();
        if (!k || r.right <= 0 || r.left >= innerWidth || !r.width) {
            const m = [...document.querySelectorAll('button')].find((b) => /^(menu|open menu|open navigation|buka menu)$/i.test((b.getAttribute('aria-label') || b.innerText || '').trim()));
            if (!m) return 'no menu key'; m.click(); await new Promise((s) => setTimeout(s, 900));
            k = document.querySelector('[data-mark="journey"]');
        }
        if (!k) return 'no journey key'; k.click(); return 'pressed';
    })()`);
    console.log('journey:', opened);
    let last = -1, same = 0;
    for (let t = 0; t < 90 && same < 6; t++) {
        await sleep(500);
        const n = await js(`document.querySelectorAll('.kx-map .leaflet-marker-icon').length`);
        same = n === last && n > 0 ? same + 1 : 0; last = n;
    }
    /* the phone opens with the fold SHUT (useState: innerWidth >= 1024); a page first laid out at 1280 keeps it open */
    if (phone) console.log('fold was', await js(`(() => { const h = document.querySelector('.kx-feed-head button'); const o = h?.getAttribute('aria-expanded'); if (o === 'true') h.click(); return o; })()`));
    /* a man left pressed by an earlier run (q2.mjs) shows his Today / All shops keys: let go, as a fresh visit has none */
    console.log('let go:', await js(`(() => { if (!document.querySelector('.kx-panel .kx-roadsw')) return false; document.querySelector('.kx-pick button[aria-pressed="true"]')?.click(); return true; })()`));
    await sleep(600);
    await js(`document.querySelectorAll('[aria-label="Tutup petunjuk"]').forEach((b) => b.click()); window.scrollTo(0, 0); document.querySelectorAll('.overflow-y-auto').forEach((e) => { e.scrollTop = 0; }); true`);
    await sleep(900);
    const m = await js(`(() => {
        const R = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.height)]; };
        const T = (s) => [...document.querySelectorAll(s)].filter((e) => e.offsetParent).map((e) => e.innerText.trim().replace(/\\s+/g, ' '));
        const feed = document.querySelector('.kx-feed');
        return {
            marks: document.querySelectorAll('.kx-map .leaflet-marker-icon').length,
            feed: R(feed), kids: feed ? [...feed.children].filter((e) => e.offsetParent || e.getBoundingClientRect().height).map((e) => (e.className || e.tagName).toString().split(' ').slice(0, 2).join('.') + ':' + R(e).join('/')) : [],
            count: T('.kx-feed-count'), meta3: T('.kx-feed .kx-meta3'), map: R(document.querySelector('.kx-map')),
            team: T('.kx-ph'), pick: T('.kx-pick button'), mchips: T('.kx-mchips button'), tags: [...new Set(T('.kx-sm .tag'))].slice(0, 40),
            panel: R(document.querySelector('.kx-panel')),
        };
    })()`);
    console.log(JSON.stringify(m));
    await shot(`${pre}-1-top`);
    if (phone) {
        await js(`document.querySelector('.kx-panel')?.scrollIntoView({ block: 'start' }); true`);
        /* --chips=N: the chip row scrolled so chip N is first (the owner's two BS and three DS sit at 4-9, off the row) */
        const ch = (process.argv.find((a) => a.startsWith('--chips=')) || '').slice(8);
        if (ch) console.log('chips from', ch, await js(`(() => { const p = document.querySelector('.kx-pick'), c = p?.children[${Number(ch)}]; if (!c) return null;
            p.scrollLeft += c.getBoundingClientRect().left - p.getBoundingClientRect().left;
            return [...p.children].filter((b) => { const r = b.getBoundingClientRect(); return r.left >= -1 && r.right <= innerWidth + 1; }).map((b) => b.innerText.trim()).join(' | '); })()`));
        await sleep(700);
        await shot(`${pre}-2-team`);
        /* --find: the search key on the header (the trial) - one press, the fold opens with Find focused */
        if (process.argv.includes('--find')) {
            await js(`window.scrollTo(0, 0); document.querySelectorAll('.overflow-y-auto').forEach((e) => { e.scrollTop = 0; }); document.querySelector('.kx-find-key')?.click(); true`);
            await sleep(900);
            console.log('find:', await js(`JSON.stringify({ focused: document.activeElement?.getAttribute('aria-label'), open: document.querySelector('.kx-feed-head button')?.getAttribute('aria-expanded') })`));
            await shot(`${pre}-3-find`);
        }
    }
} catch (e) { console.log('ERROR', e.message); } finally { ws.close(); }
