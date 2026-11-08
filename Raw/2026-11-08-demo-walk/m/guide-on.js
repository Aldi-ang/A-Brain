/* the capybara: LANJUT to the answers, then "1 Pandu saya langkah demi langkah" */
const lines = [];
for (let i = 0; i < 12; i++) { const ct = document.querySelector('.kpm-ct'); if (!ct) break; lines.push(ct.querySelector('p')?.innerText);
  const c = ct.querySelectorAll('.choices button'); if (c.length) { c[0].click(); break; } ct.querySelector('.box').click(); await sleep(450); }
if (!lines.length) { document.querySelector('[aria-label="Petunjuk"]')?.click(); await sleep(800);
  for (let i = 0; i < 12; i++) { const ct = document.querySelector('.kpm-ct'); if (!ct) break; lines.push(ct.querySelector('p')?.innerText);
    const c = ct.querySelectorAll('.choices button'); if (c.length) { c[0].click(); break; } ct.querySelector('.box').click(); await sleep(450); } }
await sleep(1200); return { lines, cap: cap() };
