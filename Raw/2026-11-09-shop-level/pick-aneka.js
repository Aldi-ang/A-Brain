/* Dika: open the Sales Terminal, Sale Mode, and pick the shop whose name holds SHOP (first in the list if SHOP is empty) */
document.querySelector('[data-mark="sales"]')?.click(); await sleep(3500);
document.querySelector('[data-guide="sale-mode"]')?.click(); await sleep(800);
document.querySelector('[aria-label="Choose customer"]')?.click(); await sleep(1200);
const box = document.querySelector('[data-guide="shops"]'); if (!box) return { noList: true, text: document.body.innerText.slice(0, 300) };
const opts = [...box.querySelectorAll('button,[role="option"]')].filter(vis);
const want = 'ANEKA BARU PANJI';
const o = opts.find((b) => want !== 'SH' + 'OP' && b.innerText.toLowerCase().includes(want.toLowerCase())) || opts[0];
const picked = o?.innerText.trim().split('\n')[0]; o?.click(); await sleep(1500);
const m = document.querySelector('[data-mission="4"]');
return { picked, options: opts.slice(0, 6).map((b) => b.innerText.trim().split('\n')[0]), cust: m?.hasAttribute('data-cust') || false };
