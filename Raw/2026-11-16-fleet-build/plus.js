/* press + on the first two products, then Fill suggested; report what the footer says */
const plus = [...document.querySelectorAll('.kpm-fleet-panel [data-guide="load-plus"]')];
if (!plus.length) return 'no + keys';
plus[0].click(); plus[0].click(); plus[1]?.click();
await new Promise((r) => setTimeout(r, 400));
const before = document.querySelector('.kpm-fleet-foot')?.innerText.replace(/\s+/g, ' ');
if (window.__fill) { document.querySelector('.kpm-fleet-panel [data-guide="fill"]')?.click(); await new Promise((r) => setTimeout(r, 600)); }
return { before, after: document.querySelector('.kpm-fleet-foot')?.innerText.replace(/\s+/g, ' '), toast: [...document.querySelectorAll('[role="status"], [role="alert"]')].map((e) => e.innerText.replace(/\s+/g, ' ').slice(0, 160)).filter(Boolean).slice(0, 3) };
