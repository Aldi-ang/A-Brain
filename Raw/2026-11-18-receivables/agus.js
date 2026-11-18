/* SWITCH -> salesman AGUS PRASETYO (T5, demo-agent-1: owns AMANAH BARU, ANEKA BARU PANJI, CEMERLANG debt); page reloads */
return (async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    document.querySelector('[data-mission="switch"]')?.click();
    await sleep(900);
    const row = [...document.querySelectorAll('button')].find((b) => /AGUS PRASETYO/i.test(b.innerText));
    if (!row) return 'no agus row: ' + [...document.querySelectorAll('button')].map((b) => b.innerText.trim().slice(0, 24)).filter(Boolean).slice(0, 14).join(' | ');
    row.click();
    return 'picked ' + row.innerText.replace(/\s+/g, ' ').slice(0, 40);
})();
