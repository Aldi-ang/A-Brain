const r = document.querySelector('[data-guide="reason"]'); if (!r) return { none: true, cap: cap() };
const sel = r.matches('select') ? r : r.querySelector('select');
if (sel) { const o = [...sel.options].find((x) => x.value); set(sel, o.value); await sleep(800); return { picked: o.textContent, cap: cap() }; }
return { notSelect: r.outerHTML.slice(0, 300), cap: cap() };
