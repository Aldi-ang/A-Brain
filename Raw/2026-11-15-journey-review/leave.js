/* open Journey Plan once (Leaflet loads, window.L appears), then leave to another menu screen */
const go = (m) => document.querySelector(`[data-mark="${m}"]`)?.click();
go('journey');
await new Promise((r) => setTimeout(r, 6000));
const hasL = !!window.L?.Marker;
const marks = [...document.querySelectorAll('[data-mark]')].map((e) => e.dataset.mark);
const other = marks.find((m) => m !== 'journey');
go(other);
await new Promise((r) => setTimeout(r, 1500));
return { hasL, other, marks: marks.slice(0, 12), journeyOpen: !!document.querySelector('.kx-feed') };
