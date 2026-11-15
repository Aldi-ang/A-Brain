/* every person on the stage, every page: pick them and read the bar's INITIAL / SOLD / CURRENT + their card line */
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];
const pages = [...document.querySelectorAll('.kpm-stage-page')];
for (let p = 0; p < Math.max(1, pages.length); p++) {
    if (pages[p]) { document.querySelectorAll('.kpm-stage-page')[p].click(); await wait(600); }
    const n = document.querySelectorAll('.kpm-actor').length;
    for (let i = 0; i < n; i++) {
        const c = document.querySelectorAll('.kpm-actor')[i];
        c.click(); await wait(900);
        const nums = [...document.querySelectorAll('.kpm-stage-counts b')].map((b) => b.innerText);
        out.push([c.querySelector('.who')?.innerText, c.querySelector('.tier')?.innerText, ...nums].join(' | '));
    }
}
return out;
