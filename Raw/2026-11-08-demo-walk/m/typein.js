/* a real tap into the input matching SEL (index IDX), then type TEXT */
const els = [...document.querySelectorAll('SEL')].filter(vis); const el = els[IDX]; if (!el) return { none: 'SEL', n: els.length, cap: cap() };
el.scrollIntoView({ block: 'center' }); await sleep(350); const r = el.getBoundingClientRect();
return { before: cap(), pressing: (el.getAttribute('aria-label') || el.placeholder || el.name || el.tagName), tap: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)], type: 'TEXT', after: 600 };
