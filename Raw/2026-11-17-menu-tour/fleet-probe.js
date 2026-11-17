/* Fleet & Roster as step 3 meets it: open it from the menu, then which area chip is on, who each chip holds, is Dika's row there */
return (async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    if (!document.querySelector('.kpm-fleet-row')) { document.querySelector('[data-kpm-rail] [data-mark="fleet"]')?.click(); await sleep(2500); }
    const chips = [...document.querySelectorAll('.kpm-fleet-chip')].map((c) => `${c.innerText.replace(/\s+/g, ' ')}${c.classList.contains('on') ? ' [ON]' : ''}`);
    const rows = [...document.querySelectorAll('.kpm-fleet-row')].map((r) => `${r.dataset.agent}:${r.querySelector('b')?.innerText}`);
    return {
        me: document.querySelector('.kpm-demo, [class*="demo"]')?.innerText?.slice(0, 60),
        chips, rowCount: rows.length, dikaRow: !!document.querySelector('.kpm-fleet-row[data-agent="demo-agent-2"]'),
        rows: rows.slice(0, 30), cap: document.querySelector('.kpm-mx-cap')?.innerText.replace(/\s+/g, ' '),
    };
})();
