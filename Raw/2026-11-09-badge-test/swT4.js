/* SWITCH on the demo bar, then the row for TIER (real taps happen in two runs: this one opens, ROW=1 taps the row) */
if (true) { const row = [...document.querySelectorAll('.kpm-demo-bar .sheet .row')].find((b) => b.innerText.trim().startsWith('T4')); if (!row) return 'no row';
  const r = row.getBoundingClientRect(); return { rows: [...document.querySelectorAll('.kpm-demo-bar .sheet .row')].map((b) => b.innerText.replace(/\n+/g, ' ')), tap: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)], after: 6000 }; }
const s = document.querySelector('[data-mission="switch"]'); const r = s.getBoundingClientRect();
return { tap: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)], after: 900 };
