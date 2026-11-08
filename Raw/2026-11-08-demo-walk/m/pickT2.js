const row = await wait(() => [...document.querySelectorAll('button')].find((b) => vis(b) && !b.disabled && b.innerText.trim().startsWith('T2')), 20000);
if (!row) return { noRow: document.body.innerText.slice(0, 300) }; row.click(); return 'picked T2';
