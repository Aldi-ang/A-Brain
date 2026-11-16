/* SWITCH -> the owner (T2 HARTONO); the page reloads after the pick */
return (async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    document.querySelector('[data-mission="switch"]')?.click();
    await sleep(900);
    const row = [...document.querySelectorAll('button')].find((b) => /T2\s*OWNER/i.test(b.innerText));
    if (!row) return 'no owner row: ' + [...document.querySelectorAll('button')].map((b) => b.innerText.trim().slice(0, 24)).filter(Boolean).slice(0, 12).join(' | ');
    row.click();
    return 'picked ' + row.innerText.replace(/\s+/g, ' ').slice(0, 40);
})();
