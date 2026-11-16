/* the focus panel's measured box (--fp-*) next to the shell scroll box and whatever sits under the panel's bottom edge */
const root = document.querySelector('.kpm-fleet'), box = root?.parentElement?.closest('.overflow-y-auto');
const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; };
const cs = box && getComputedStyle(box);
const below = [...document.elementsFromPoint(640, 772)].slice(0, 4).map((e) => (e.className && String(e.className).slice(0, 50)) || e.tagName);
return { vars: root?.getAttribute('style'), box: r(box), pad: cs && [cs.paddingTop, cs.paddingBottom], root: r(root), panel: r(document.querySelector('.kpm-fleet-panel')), below };
