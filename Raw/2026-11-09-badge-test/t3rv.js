for (let i = 0; i < 14; i++) { const ct = document.querySelector('.kpm-ct'); if (!ct) break; const ch = [...ct.querySelectorAll('.choices button')]; if (ch.length) ch[ch.length - 1].click(); else ct.querySelector('.box')?.click(); await sleep(700); }
document.querySelector('[data-mark="restock_vault"]')?.click(); await sleep(5000);
const heads = [...document.querySelectorAll('h1,h2,h3')].filter(vis).map((h) => h.innerText.trim().slice(0, 40));
const main = document.querySelector('main') || document.body;
return { heads: heads.slice(0, 8), textLen: main.innerText.length, sample: main.innerText.replace(/\n+/g, ' / ').slice(0, 300) };
