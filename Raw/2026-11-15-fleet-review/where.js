/* where each part of Fleet & Roster sits, in the scroller's own pixels (top of the page = 0), and how tall the page is */
const s = window.__sc || document.scrollingElement;
const top0 = s.getBoundingClientRect().top - s.scrollTop;
const at = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return [Math.round(r.top - top0), Math.round(r.height)]; };
const byText = (sel, re) => [...document.querySelectorAll(sel)].find((e) => re.test(e.innerText || ''));
return {
    screen: [innerWidth, s.clientHeight],
    page: s.scrollHeight,
    stage: at(document.querySelector('.kpm-stage')),
    bar: at(document.querySelector('.kpm-stage-bar')),
    community: at(byText('p', /the community today/i)),
    bay: at(document.querySelector('[data-mission="3"]')),
    loadKey: at(byText('button', /^\s*(muat van|load)/i)),
    vanChest: at(byText('div', /inventory\s*$/im)),
    ledger: at(byText('h3', /itemized asset ledger/i)),
    logs: at(byText('h3', /activity logs/i)),
    stageScroll: (() => { const st = document.querySelector('.kpm-stage'); return st ? [st.clientWidth, st.scrollWidth] : null; })(),
    cards: document.querySelectorAll('.kpm-actor').length,
};
