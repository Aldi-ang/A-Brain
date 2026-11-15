/* is the roster title cut? (truncate: the text is wider than its box) + the personnel line's height (1 line ~15 px, 2 lines ~30) */
const h = document.querySelector('.kpm-stage')?.closest('.hide-on-print')?.querySelector('h2');
const p = h?.parentElement?.querySelector('p');
return h ? { title: h.innerText, cut: h.scrollWidth > h.clientWidth + 1, need: h.scrollWidth, room: h.clientWidth, lineH: p ? Math.round(p.getBoundingClientRect().height) : null } : 'no title';
