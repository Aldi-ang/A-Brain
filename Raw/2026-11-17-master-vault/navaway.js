/* with the 3D viewer open, pick another screen from the menu (Sales Terminal); is the viewer gone? */
return (async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const before = !!document.querySelector('.kpm-examine-in');
    document.querySelector('[data-mark="sales"]')?.click();
    await sleep(1500);
    return { viewerBefore: before, viewerAfter: !!document.querySelector('.kpm-examine-in'), mvRows: document.querySelectorAll('[id^="mv-row-"]').length };
})();
