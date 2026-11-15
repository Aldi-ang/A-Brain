/* the page's scroller to the top, then every visible control and the scroller's size */
document.querySelectorAll('[aria-label="Tutup petunjuk"]').forEach((b) => b.click());
const all = [...document.querySelectorAll('*')].filter((e) => {
    const s = getComputedStyle(e);
    return /(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 20 && e.clientHeight > 300;
}).sort((a, b) => b.clientHeight - a.clientHeight);
const s = all[0] || document.scrollingElement;
window.__sc = s;
s.scrollTop = 0;
await new Promise((r) => setTimeout(r, 500));
const vis = (e) => { const r = e.getBoundingClientRect(); return r.width && r.height && r.bottom > 0 && r.top < innerHeight; };
const lab = (b) => (b.getAttribute('aria-label') || b.innerText || b.placeholder || b.value || b.tagName).trim().replace(/\s+/g, ' ').slice(0, 30);
const box = (b) => { const r = b.getBoundingClientRect(); return Math.round(r.left) + ',' + Math.round(r.top) + ',' + Math.round(r.width) + 'x' + Math.round(r.height); };
return {
    w: innerWidth,
    scroller: [String(s.className).slice(0, 50), s.clientHeight, s.scrollHeight],
    ctrls: [...document.querySelectorAll('button,input,select,a')].filter(vis).map((b) => lab(b) + '@' + box(b)).join(' | '),
};
