/* SWITCH on the demo bar, then the Owner's row (the page reloads as the Owner) */
document.querySelector('[data-mission="switch"]')?.click(); await sleep(700);
const row = [...document.querySelectorAll('.kpm-demo-bar .sheet .row')].find((b) => b.innerText.trim().startsWith('T2'));
if (!row) return { noRow: true }; row.click(); return 'switching to T2';
