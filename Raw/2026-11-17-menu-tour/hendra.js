/* SWITCH -> T4 HENDRA (the regional admin who does step 3); the page reloads after the pick */
return (async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    document.querySelector('[data-mission="switch"]')?.click();
    await sleep(900);
    const row = [...document.querySelectorAll('button')].find((b) => /T4\s*REGIONAL ADMIN/i.test(b.innerText));
    if (!row) return 'no T4 row';
    row.click();
    return 'picked ' + row.innerText.replace(/\s+/g, ' ').slice(0, 40);
})();
