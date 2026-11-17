/* open the Master Vault tab; unlock with the demo password if it is shut */
return (async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const setVal = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
    document.querySelector('[data-mark="inventory"]')?.click();
    await sleep(1200);
    if (!document.querySelector('[data-vault="open"]')) {
        document.querySelector('[data-guide="unlock"]')?.click();
        await sleep(900);
        const pw = document.querySelector('input[type="password"]');
        if (!pw) return 'no password box; vault=' + !!document.querySelector('[data-vault="open"]');
        setVal(pw, 'admin123'); await sleep(200);
        pw.form ? pw.form.requestSubmit() : pw.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        await sleep(2500);
        document.querySelector('[data-mark="inventory"]')?.click();
        await sleep(1500);
    }
    return { vault: !!document.querySelector('[data-vault="open"]'), h1: [...document.querySelectorAll('h1')].map(h => h.innerText).join('|'), rows: document.querySelectorAll('[id^="mv-row-"]').length };
})();
