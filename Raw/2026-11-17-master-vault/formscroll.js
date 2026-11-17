/* scroll the open product form down to the box pictures */
const f = document.querySelector('form'); let el = f; while (el && getComputedStyle(el).overflowY !== 'auto') el = el.parentElement;
if (el) el.scrollTop = 99999;
return !!el;
