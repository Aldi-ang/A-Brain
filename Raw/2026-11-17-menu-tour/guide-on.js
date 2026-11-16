/* turn the guide on the way a visitor does: PETUNJUK (or the greeting already up) -> LANJUT through the lines -> "Pandu saya" */
return (async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const log = [];
    if (!document.querySelector('.kpm-ct')) {
        const keys = [...document.querySelectorAll('.kpm-mission .hintkey')];
        log.push(`hintkeys ${keys.length} pressed=${keys.map((k) => k.getAttribute('aria-pressed')).join()}`);
        keys[0]?.click(); await sleep(600);
    }
    for (let i = 0; i < 12; i++) {
        const pandu = [...document.querySelectorAll('.kpm-ct .choices button')].find((b) => /Pandu/.test(b.innerText));
        if (pandu) { pandu.click(); log.push('pandu'); break; }
        const box = document.querySelector('.kpm-ct .box');
        if (!box) { log.push('no dialogue'); break; }
        box.click(); log.push('lanjut'); await sleep(250);
    }
    await sleep(900);
    return log.join(' ');
})();
