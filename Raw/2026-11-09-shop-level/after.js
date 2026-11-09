/* after the deal: every toast and capybara line on screen for a while (the level step runs after the sale is saved) */
const seen = new Set();
for (let i = 0; i < 16; i++) {
  for (const t of document.querySelectorAll('[role="status"], [role="alert"], .kpm-toast, [class*="toast"], [class*="capy"] p, [class*="bubble"]')) {
    const s = (t.innerText || '').trim().replace(/\n+/g, ' '); if (s && s.length < 240) seen.add(s);
  }
  await sleep(500);
}
return { seen: [...seen].slice(0, 20), stat: stat().toasts };
