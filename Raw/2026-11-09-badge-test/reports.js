for (let i = 0; i < 14; i++) { const ct = document.querySelector('.kpm-ct'); if (!ct) break; const ch = [...ct.querySelectorAll('.choices button')]; if (ch.length) ch[ch.length - 1].click(); else ct.querySelector('.box')?.click(); await sleep(700); }
const inMenu = !!document.querySelector('[data-mark="transactions"]');
document.querySelector('[data-mark="transactions"]')?.click(); await sleep(4500);
const t = document.body.innerText;
return { who: document.querySelector('.kpm-demo-bar')?.innerText.replace(/\n+/g, ' / '), inMenu,
  couldNotRead: /could not be read/i.test(t), panel: /what sold|product performance/i.test(t),
  heads: [...document.querySelectorAll('h1,h2,h3')].filter(vis).map((h) => h.innerText.trim().slice(0, 40)).slice(0, 6) };
