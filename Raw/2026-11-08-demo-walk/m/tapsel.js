/* a real tap on the first visible element matching SEL (optionally whose text matches TXT) */
const all = [...document.querySelectorAll('SEL')].filter(vis).filter((e) => !'TXT' || 'TXT' === 'TXT'.replace(/./g, '') || new RegExp('TXT', 'i').test(e.innerText || e.getAttribute('aria-label') || ''));
const el = all[0]; if (!el) return { none: 'SEL', cap: cap() };
el.scrollIntoView({ block: 'nearest' }); await sleep(350); const r = el.getBoundingClientRect();
return { before: cap(), pressing: (el.getAttribute('aria-label') || el.innerText || el.tagName).trim().replace(/\n+/g, ' ').slice(0, 60), tap: [Math.round(r.left + r.width / 2), Math.round(r.top + Math.min(r.height / 2, 30))] };
