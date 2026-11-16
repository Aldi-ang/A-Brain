/* how many product lines of the open load sheet are FULLY in view: both the top and the bottom edge of a line must be
   the line itself under elementFromPoint (a header, a demo bar, the fixed foot or the screen edge in the way = not in view) */
const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
const lines = [...document.querySelectorAll('.kpm-fleet-panel .kpm-fleet-line:not(.kpm-fleet-linehead)')];
const seen = (l) => { const r = l.getBoundingClientRect(); const x = r.left + Math.min(40, r.width / 2);
    return [r.top + 3, r.bottom - 3].every((y) => y > 0 && y < innerHeight && l.contains(document.elementFromPoint(x, y))); };
const p = document.querySelector('.kpm-fleet-panel');
return { inView: lines.filter(seen).length, lines: lines.length, lineH: lines[0] ? Math.round(lines[0].getBoundingClientRect().height) : 0,
    panel: box(p), body: box(document.querySelector('.kpm-fleet-body')), foot: box(document.querySelector('.kpm-fleet-foot')),
    head: box(p?.firstElementChild), acts: box(document.querySelector('.kpm-fleet-acts')), tabs: box(document.querySelector('.kpm-fleet-tabs')),
    fonts: document.fonts.check('700 13px Rajdhani'), hoverNone: matchMedia('(hover: none)').matches };
