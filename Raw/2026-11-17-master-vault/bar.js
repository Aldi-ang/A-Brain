const b = document.querySelector('.kpm-demo-bar'); const r = b && b.getBoundingClientRect();
const m = document.querySelector('.kpm-mission');
const shell = document.querySelector('[data-kpm-rail]')?.getBoundingClientRect();
return { bar: r && [Math.round(r.top), Math.round(r.height)], safeTop: getComputedStyle(document.documentElement).getPropertyValue('--kpm-safe-top'), mission: !!m, steps: [...document.querySelectorAll('.kpm-mission .st')].filter(e=>e.offsetWidth).map(e=>e.innerText.slice(0,30)), overflow: b && b.scrollWidth > b.clientWidth, hint: document.querySelector('.hintkey')?.offsetWidth, sw: document.querySelector('[data-mission="switch"]')?.getBoundingClientRect().right, vw: innerWidth };
