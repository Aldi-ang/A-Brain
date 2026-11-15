/* open Journey Plan by its menu key and wait until the map's marks stop changing for 3 s (max 60 s) */
const t0 = performance.now();
document.querySelector('[data-mark="journey"]')?.click();
let last = -1, since = performance.now(), firstMark = null;
while (performance.now() - t0 < 60000) {
    await new Promise((r) => setTimeout(r, 200));
    const n = document.querySelectorAll('.kx-map .leaflet-marker-icon').length;
    if (n && firstMark === null) firstMark = Math.round(performance.now() - t0);
    if (n !== last) { last = n; since = performance.now(); }
    else if (n && performance.now() - since > 3000) break;
}
return { firstMark, settled: Math.round(since - t0), marks: last };
