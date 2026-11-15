return (async () => {
    const log = [];
    for (let i = 0; i < 12; i++) {
        const btns = [...document.querySelectorAll('button')].filter((b) => b.offsetParent && /lanjut|lewati|skip|nanti|tidak|sendiri|tutup/i.test(b.innerText));
        if (!btns.length) { log.push('none left'); break; }
        const pick = btns.find((b) => /lewati|skip|nanti|tidak|sendiri|tutup/i.test(b.innerText)) || btns[0];
        log.push(btns.map((b) => b.innerText.trim().replace(/\s+/g, ' ').slice(0, 30)).join(' | ') + ' -> ' + pick.innerText.trim().slice(0, 30));
        pick.click();
        await new Promise((r) => setTimeout(r, 700));
    }
    return log;
})()
