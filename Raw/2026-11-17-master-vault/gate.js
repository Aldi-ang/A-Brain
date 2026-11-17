return (async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const pw = [...document.querySelectorAll('input')].find(i => /password/i.test(i.placeholder || '') || i.type === 'password');
    if (!pw) return 'no box';
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(pw, 'admin123');
    pw.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(300);
    [...document.querySelectorAll('button')].find(b => /open the vault/i.test(b.innerText))?.click();
    await sleep(3500);
    document.querySelector('[data-mark="inventory"]')?.click();
    await sleep(1500);
    return { vault: !!document.querySelector('[data-vault="open"]'), h1: [...document.querySelectorAll('h1')].map(h => h.innerText).join('|'), rows: document.querySelectorAll('[id^="mv-row-"]').length };
})();
