/* the new ledger: where things sit and what the page says (2026-11-16) */
const q = (s) => document.querySelector(s);
const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
window.__sc = [...document.querySelectorAll('*')].find((e) => e.scrollHeight > e.clientHeight + 40 && /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.contains(q('.kpm-fleet'))) || document.scrollingElement;
return {
    screen: [innerWidth, innerHeight], hoverNone: matchMedia('(hover: none)').matches,
    root: box(q('.kpm-fleet')), layer: box(q('.kpm-fleet-layer')), list: box(q('.kpm-fleet-list')), panel: box(q('.kpm-fleet-panel')), foot: box(q('.kpm-fleet-foot')),
    strip: q('.kpm-fleet-strip')?.innerText.replace(/\s+/g, ' '),
    rows: document.querySelectorAll('.kpm-fleet-row').length, chips: [...document.querySelectorAll('.kpm-fleet-chip')].map((e) => e.innerText.replace(/\s+/g, ' ')),
    first: [...document.querySelectorAll('.kpm-fleet-row')].slice(0, 4).map((e) => e.innerText.replace(/\s+/g, ' ').slice(0, 90)),
    scroller: window.__sc === document.scrollingElement ? 'document' : String(window.__sc.className).slice(0, 60),
};
