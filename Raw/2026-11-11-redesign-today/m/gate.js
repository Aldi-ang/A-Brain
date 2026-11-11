const g = await wait(() => document.querySelector('input[placeholder="MASTER PASSWORD"]'), 20000); if (!g) return { noGate: true, text: document.body.innerText.slice(0, 200) };
set(g, 'admin123'); await sleep(300); any(/Open the vault/i)[0]?.click();
await wait(() => !document.querySelector('input[placeholder="MASTER PASSWORD"]'), 20000); await sleep(4000);
const own = any(/Saya coba sendiri|try it myself/i)[0]; if (own) { own.click(); await sleep(1200); }
return { own: !!own, marks: [...document.querySelectorAll('[data-mark]')].map((e) => e.getAttribute('data-mark') + (vis(e) ? '' : '(h)')),
  btns: [...document.querySelectorAll('button')].filter(vis).map((b) => (b.getAttribute('aria-label') || b.innerText || '').trim().replace(/\n+/g, ' ').slice(0, 28)).filter(Boolean).slice(0, 50),
  title: [...document.querySelectorAll('h1,h2')].filter(vis).map((h) => h.innerText.trim()).slice(0, 4) };
