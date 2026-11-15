const h = document.querySelector('.kx-feed-head button');
if (h.getAttribute('aria-expanded') === 'true') h.click();
await new Promise((r) => setTimeout(r, 900));
const g = document.querySelector('.kx-feed > .grid'), cs = getComputedStyle(g), kid = g.firstElementChild;
const r = (e) => { const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.height)]; };
return { grid: r(g), mt: cs.marginTop, rows: cs.gridTemplateRows, kid: r(kid), kidCs: getComputedStyle(kid).minHeight + ' ' + getComputedStyle(kid).overflow, controls: r(kid.firstElementChild), feed: r(document.querySelector('.kx-feed')), map: r(document.querySelector('.kx-map')), w: innerWidth };
