/* FOCUS VEIL MOTION PROOF (2026-11-16, his pick A): per frame [ms, panel opacity, panel x, veil opacity].
   open BAGUS -> switch to BUDI (the veil must stay the same element at opacity 1: no replay) -> press the veil (closes)
   -> open again -> press the open name (closes). Real clock first (lesson 2026-10-25). */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const frame = () => new Promise((r) => requestAnimationFrame(r));
const c0 = document.timeline.currentTime; await sleep(200); const clock = Math.round(document.timeline.currentTime - c0);
const rows = [...document.querySelectorAll('.kpm-fleet-row')];
const bagus = rows.find((e) => /BAGUS/i.test(e.innerText)), budi = rows.find((e) => /BUDI/i.test(e.innerText));
const veil = () => document.querySelector('.kpm-fleet-veil'), panel = () => document.querySelector('.kpm-fleet-panel');
const tx = (el) => { const cs = getComputedStyle(el); return cs.transform === 'none' ? 0 : Math.round(new DOMMatrix(cs.transform).m41); };
const op = (el) => (el ? +(+getComputedStyle(el).opacity).toFixed(2) : '-');
async function sample(ms) {
    const out = []; const t = performance.now(); let seen = false;
    while (performance.now() - t < ms) {
        const p = panel(), v = veil();
        out.push([Math.round(performance.now() - t), op(p), p ? tx(p) : '-', op(v)]);
        if (p || v) seen = true; if (seen && !p && !v) break;
        await frame();
    }
    return out;
}
const thin = (s) => (s.length > 14 ? [...s.slice(0, 8), '…', ...s.slice(-4)] : s);
if (panel()) { bagus.click(); await sleep(700); }
bagus.click(); const open = await sample(420);
const hit = (x, y) => { const e = document.elementFromPoint(x, y); return e?.closest('.kpm-fleet-veil') ? 'veil' : e?.closest('.kpm-fleet-list') ? 'list' : e?.closest('.kpm-fleet-panel') ? 'panel' : (e?.className || e?.tagName || '').toString().slice(0, 30); };
const where = { header: hit(640, 110), listRow: hit(120, 640), panel: hit(700, 500), demoBar: hit(640, 20) };
await sleep(150); const v1 = veil(); budi.click(); const sw = await sample(320);
const switchKeptVeil = v1 === veil(), switchMinVeil = Math.min(...sw.map((x) => x[3]).filter((n) => typeof n === 'number'));
veil().click(); const byVeil = await sample(600);
await sleep(300); bagus.click(); await sleep(500); bagus.click(); const byName = await sample(600);
return { clock, open: thin(open), where, switchKeptVeil, switchMinVeil, closeByVeil: thin(byVeil), closeByName: thin(byName), left: { panel: !!panel(), veil: !!veil() } };
