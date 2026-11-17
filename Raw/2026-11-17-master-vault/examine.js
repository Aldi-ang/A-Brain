/* open the 3D viewer from Master Vault and report where its X is against the demo bars */
return (async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    [...document.querySelectorAll('button')].find((b) => /View in fullscreen/.test(b.innerText))?.click();
    await sleep(900);
    const x = document.querySelector('.kpm-examine-in button[aria-label="Close"]');
    const bars = [...document.querySelectorAll('.kpm-demo-bar, .kpm-mission')].map((b) => Math.round(b.getBoundingClientRect().bottom));
    const r = x?.getBoundingClientRect();
    const hit = r && document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return { open: !!document.querySelector('.kpm-examine-in'), xTop: r && Math.round(r.top), barsBottom: bars, xIsOnTop: !!hit && x.contains(hit) };
})();
