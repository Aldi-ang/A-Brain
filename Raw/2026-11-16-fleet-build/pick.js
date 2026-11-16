/* open the person whose row name matches window.__who (default: the first salesman with a van), as a click does */
const want = (window.__who || '').toUpperCase();
const rows = [...document.querySelectorAll('.kpm-fleet-row')];
const r = want ? rows.find((e) => (e.querySelector('.who b')?.innerText || '').toUpperCase().includes(want)) : rows.find((e) => /On route|Loaded/.test(e.innerText)) || rows[0];
if (!r) return 'no row ' + want;
r.click();
await new Promise((res) => setTimeout(res, 1500));
const p = document.querySelector('.kpm-fleet-panel');
return { picked: r.querySelector('.who b')?.innerText, panel: p?.innerText.replace(/\s+/g, ' ').slice(0, 600) };
