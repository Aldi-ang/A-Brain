/* open the person whose row name matches window.__who (default: the first salesman with a van), as a click does */
const want = (window.__who || '').toUpperCase();
const rows = [...document.querySelectorAll('.kpm-fleet-row')];
const r = want ? rows.find((e) => (e.querySelector('.who b')?.innerText || '').toUpperCase().includes(want)) : rows.find((e) => /On route|Loaded/.test(e.innerText)) || rows[0];
if (!r) return 'no row ' + want;
r.click();
await new Promise((res) => setTimeout(res, 1500));

/* LAB DRAWING ONLY (2026-11-16 round 2): the bigger-panel options as CSS laid over the real app, real data.
   S = shared by all (panel on its own raised surface + 2px gold edge, heavier rule above SALESMEN)
   W = wide panel: tabs + person keys on one row, each product on ONE line, compact tool keys
   A = focus: the rest dims + blurs, the NAME PANEL (the list) stays sharp and usable, the panel runs from under the app header to the bottom
   B = tall: same width, covers the day strip, no blur      C = wide: the names stay, the panel takes the rest
   PH = the phone's person page with the head folded */
const CSS = {
S: `.kpm-fleet-panel { --panel: var(--raised); background: var(--raised); border-left: 2px solid var(--accent-edge) !important; }
.kpm-fleet-row + .kpm-fleet-grp { margin-top: 14px; border-top: 2px solid var(--line-3); }`,
W: `.kpm-fleet-panel { display: grid !important; grid-template-columns: minmax(0,1fr) auto; grid-template-rows: auto auto minmax(0,1fr) auto; }
.kpm-fleet-panel > div:first-child { grid-column: 1 / -1; grid-row: 1; padding-top: 8px !important; padding-bottom: 8px !important; flex-wrap: nowrap !important; }
.kpm-fleet-panel > .kpm-fleet-tabs { grid-column: 1; grid-row: 2; }
.kpm-fleet-panel > .kpm-fleet-acts { grid-column: 2; grid-row: 2; align-items: center; padding: 0 12px 0 0 !important; }
.kpm-fleet-panel > .kpm-fleet-acts button { min-height: 0 !important; height: 30px; }
.kpm-fleet-panel > .kpm-fleet-body { grid-column: 1 / -1; grid-row: 3; }
.kpm-fleet-panel > .kpm-fleet-foot { grid-column: 1 / -1; grid-row: 4; }
.kpm-fleet-body > .flex-wrap:first-child { padding-top: 6px !important; padding-bottom: 6px !important; }
.kpm-fleet-body > .flex-wrap:first-child :is(button, select) { min-height: 0 !important; height: 30px; padding-top: 2px; padding-bottom: 2px; }
.kpm-fleet-line { grid-template-columns: minmax(0,1fr) 88px 72px 104px 132px !important; padding-top: 6px !important; padding-bottom: 6px !important; }
.kpm-fleet-line .n { display: flex; align-items: baseline; gap: 10px; }
.kpm-fleet-line .n b { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.kpm-fleet-line .n small { flex: none; white-space: nowrap; }`,
A: `.kpm-fleet-panel { position: fixed !important; top: 160px !important; bottom: 32px !important; left: 300px !important; right: 25px !important; width: auto !important; }
#opt-veil { position: fixed; inset: 0; z-index: 15; background: rgba(8,7,6,.55); backdrop-filter: blur(3px); }
.kpm-fleet-list { position: relative; z-index: 16; }`,
B: `.kpm-fleet-panel { position: fixed !important; top: 181px !important; bottom: 57px !important; right: 25px !important; left: auto !important; width: 640px !important; }`,
C: `.kpm-fleet-panel { left: 275px !important; right: 0 !important; width: auto !important; }`,
PH: `.kpm-fleet-panel > div:first-child { padding: 4px 12px 8px !important; row-gap: 4px !important; }
.kpm-fleet-panel > div:first-child > div:first-child { display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; column-gap: 6px; }
.kpm-fleet-panel > div:first-child > div:first-child > button:first-child { min-height: 40px !important; padding-right: 4px !important; font-size: 18px; }
.kpm-fleet-panel > div:first-child > div:first-child > p { grid-column: 1 / -1; }
.opt-more { min-height: 36px; padding: 4px 12px; border: 1px solid var(--line-2); border-radius: 6px; font-size: 13px; color: var(--ink); }
.kpm-fleet-kpis { justify-content: flex-start !important; gap: 16px !important; }
.kpm-fleet-kpis > div { display: flex; align-items: baseline; gap: 5px; }
.kpm-fleet-kpis b { font-size: 14px !important; }
.kpm-fleet-acts { display: none !important; }
.kpm-fleet-tabs button { min-height: 40px !important; }
.kpm-fleet-body > .flex-wrap:first-child { flex-wrap: nowrap !important; padding: 8px 12px !important; overflow-x: auto; }
.kpm-fleet-body > .flex-wrap:first-child :is(button, select) { min-height: 38px !important; padding: 4px 8px !important; font-size: 13px; flex: none; }
.kpm-fleet-body > .flex-wrap:first-child select { max-width: 136px !important; }
.kpm-fleet-line { padding-top: 8px !important; padding-bottom: 8px !important; }
.kpm-fleet-line .n small:not(.why) { display: none; }`,
};
const apply = (keys) => {
    document.getElementById('opt-css')?.remove(); document.getElementById('opt-veil')?.remove(); document.querySelectorAll('.opt-more').forEach((e) => e.remove());
    document.querySelectorAll('[data-opt-ph]').forEach((e) => { e.textContent = e.dataset.optPh; delete e.dataset.optPh; });
    const st = document.createElement('style'); st.id = 'opt-css'; st.textContent = keys.map((k) => CSS[k]).join('\n'); document.head.appendChild(st);
    if (keys.includes('A')) { const v = document.createElement('div'); v.id = 'opt-veil'; document.querySelector('.kpm-fleet').appendChild(v); }
    if (keys.includes('PH')) {
        const hd = document.querySelector('.kpm-fleet-panel > div:first-child > div:first-child');
        const b = hd.querySelector('button'); b.dataset.optPh = b.textContent; b.textContent = '‹';
        const m = document.createElement('button'); m.type = 'button'; m.className = 'opt-more'; m.textContent = 'More ▾'; hd.insertBefore(m, hd.querySelector('p'));
        /* "sold today N" joins the numbers line */
        for (const l of document.querySelectorAll('.kpm-fleet-panel .kpm-fleet-line:not(.kpm-fleet-linehead)')) {
            const s = l.querySelector('.n small:not(.why)'), ph = l.querySelector('small.ph');
            if (s && ph) { ph.dataset.optPh = ph.textContent; ph.textContent = s.textContent.replace('sold today', 'today') + ' · ' + ph.textContent; }
        }
    }
    document.querySelector('.kpm-fleet-body')?.scrollTo(0, 0); scrollTo(0, 0);
    return keys.join('+');
};

await new Promise((r) => setTimeout(r, 400));
return apply(["S","PH"]);
