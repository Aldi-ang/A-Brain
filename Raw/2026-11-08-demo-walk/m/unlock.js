[...document.querySelectorAll('[data-mark="dashboard"]')][0]?.click(); await sleep(1500);
const u = any(/^UNLOCK SYSTEM$/i)[0]; if (!u) return { noUnlock: true, title: [...document.querySelectorAll('h1,h2')].filter(vis).map((h) => h.innerText) };
u.click(); const g = await wait(() => document.querySelector('input[placeholder="MASTER PASSWORD"]'), 8000); if (!g) return 'no gate';
const shown = document.body.innerText.match(/Demo vault password[^\n]*/i)?.[0];
set(g, 'admin123'); await sleep(300); any(/Open the vault/i)[0]?.click();
await wait(() => !document.querySelector('input[placeholder="MASTER PASSWORD"]'), 15000); await sleep(3500);
return { shown, title: [...document.querySelectorAll('h1,h2')].filter(vis).map((h) => h.innerText.trim()).slice(0, 4), cap: cap() };
