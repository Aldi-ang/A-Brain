/* Stock Opname professional count: open New Count, pick Cello Chocolate, type 10 fewer than the system, read what the screen says */
return (async () => {
    const s = (ms) => new Promise((r) => setTimeout(r, ms));
    const setVal = (el, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
    document.querySelector('[data-mission="8"]')?.click(); await s(1500);
    const row = [...document.querySelectorAll('.kpm-oc-row')].find((b) => /Cello Chocolate/.test(b.innerText));
    if (!row) return 'no row; rows=' + document.querySelectorAll('.kpm-oc-row').length;
    row.click(); await s(500);
    const good = document.querySelector('[data-guide="good"]');
    const sys = 10161;
    setVal(good, String(sys - 10)); await s(300);
    const dmg = good.closest('.grid').querySelectorAll('input')[1]; setVal(dmg, '0'); await s(600);
    const hand = good.closest('[data-half], .flex.flex-col.gap-5');
    return {
        rows: document.querySelectorAll('.kpm-oc-row').length,
        sum: document.querySelector('.kpm-oc-sum')?.innerText.replace(/\s+/g, ' '),
        hand: hand?.innerText.replace(/\s+/g, ' ').slice(0, 420),
        mark: row.innerText.replace(/\s+/g, ' '),
        numH: Math.round(good.closest('.kpm-oc-num').getBoundingClientRect().height),
        rowH: Math.round(row.getBoundingClientRect().height),
        listW: Math.round(row.parentElement.parentElement.getBoundingClientRect().width)
    };
})();
