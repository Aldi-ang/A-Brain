/* what the guide shows now: its box, the ring's box against the screen, what is under the ring's centre, the tour class */
const cap = document.querySelector('.kpm-mx-cap'), ring = document.querySelector('.kpm-mx-ring');
const r = ring && ring.getBoundingClientRect();
let under = null;
if (r) {
    ring.style.visibility = 'hidden';
    const veils = [...document.querySelectorAll('.kpm-mx-veil')]; veils.forEach((v) => { v.style.visibility = 'hidden'; });
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    ring.style.visibility = ''; veils.forEach((v) => { v.style.visibility = ''; });
    let o = 1; for (let e = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
    under = el && `${el.tagName.toLowerCase()}${el.dataset.mark ? `[data-mark=${el.dataset.mark}]` : ''}.${String(el.className?.baseVal ?? el.className).split(' ')[0]} title=${el.closest('[title]')?.title || ''} opacity=${o.toFixed(2)}`;
}
return {
    cap: cap && cap.innerText.replace(/\s+/g, ' '),
    ring: r && [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
    inView: !!r && r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight,
    under, tour: document.documentElement.classList.contains('kpm-tour'), w: innerWidth, hoverNone: matchMedia('(hover: none)').matches,
};
