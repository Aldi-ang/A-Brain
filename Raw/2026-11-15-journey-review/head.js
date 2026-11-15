const h = document.querySelector('.kx-feed-head'), k = document.querySelector('.kx-find-key'), b = h.querySelector('button');
const r = (e) => { const x = e.getBoundingClientRect(); return [Math.round(x.top), Math.round(x.width), Math.round(x.height)]; };
return { w: innerWidth, h2: r(h), key: k ? [getComputedStyle(k).display, ...r(k)] : null, btn: [getComputedStyle(b).minHeight, ...r(b)], kids: [...b.children].map((c) => c.className.slice(0, 30) + ':' + getComputedStyle(c).display + ':' + Math.round(c.getBoundingClientRect().height)) };
