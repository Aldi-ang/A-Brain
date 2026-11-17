/* open the Edit product form on the selected product; report what the save button and the fields look like */
return (async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    [...document.querySelectorAll('button')].find((b) => b.innerText.trim() === 'Edit product')?.click();
    await sleep(900);
    const save = [...document.querySelectorAll('button[type="submit"]')].find((b) => /Save product/.test(b.innerText));
    const cs = save && getComputedStyle(save);
    return { h2: document.querySelector('form')?.closest('div')?.querySelector('h2')?.innerText, save: !!save, bg: cs?.backgroundColor, border: cs?.borderColor, color: cs?.color,
        inputs: document.querySelectorAll('form input').length };
})();
