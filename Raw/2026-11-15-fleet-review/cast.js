/* every tab and every page of the stage, as text: who sits where, in what order, with what tier line and load */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const out = {};
const tabs = [...document.querySelectorAll('.kpm-stage-tab')];
for (const t of (tabs.length ? tabs : [null])) {
    if (t) { t.click(); await wait(700); }
    const name = t ? t.innerText.replace(/\s+/g, ' ') : 'one stage';
    out[name] = [];
    const pages = [...document.querySelectorAll('.kpm-stage-page')];
    for (const p of (pages.length ? pages : [null])) {
        if (p) { p.click(); await wait(600); }
        out[name].push([...document.querySelectorAll('.kpm-actor')].map((a) =>
            [a.querySelector('.who')?.innerText, a.querySelector('.tier')?.innerText, a.querySelector('.load')?.innerText, a.classList.contains('leader') ? 'CROWN' : ''].filter(Boolean).join(' / ')));
    }
}
if (tabs[0]) { tabs[0].click(); await wait(500); }
document.querySelector('.kpm-stage-page')?.click();
return out;
