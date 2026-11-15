const T = (s) => [...document.querySelectorAll(s)].filter((e) => e.offsetParent || getComputedStyle(e).position === 'fixed').map((e) => e.innerText.trim().replace(/\s+/g, ' '));
const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.height)]; };
return {
    who: (document.body.innerText.match(/T[1-6] · [A-Za-z ]+/) || [''])[0].trim(),
    w: innerWidth, vv: Math.round(visualViewport.height), ih: innerHeight,
    line: T('.kx-feed-line'), count: T('.kx-feed-day .kx-feed-count'), team: T('.kx-ph span'),
    chips: T('.kx-pick button').filter((t) => /BAGUS|BUDI|DADANG|DEDE|DIKA|BS|DS/.test(t)),
    focus: document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName,
    fold: document.querySelector('.kx-feed-head button')?.getAttribute('aria-expanded'),
    full: !!document.querySelector('.kx-map.kx-full'),
    capy: [...document.querySelectorAll('.kpm-capy')].map((e) => getComputedStyle(e).display),
    map: r('.kx-map'), key: r('.kx-find-key'),
};
