/* (a) WHERE DOES Journey Plan's setIcon time go? Patch L.Marker.prototype.setIcon BEFORE opening Journey Plan, then read
   window.__si after it settles: calls per marker, and which part of the icon changed (first differing html bytes). */
const L = window.L;
if (!L?.Marker) return 'no window.L';
if (!L.Marker.prototype.__siOrig) L.Marker.prototype.__siOrig = L.Marker.prototype.setIcon;
const S = window.__si = { t0: performance.now(), calls: 0, ms: 0, same: 0, perMarker: new Map(), diffs: {} };
L.Marker.prototype.setIcon = function (icon) {
    const old = this.options.icon, t = performance.now();
    S.calls++;
    if (old === icon) S.same++;
    S.perMarker.set(this._leaflet_id, (S.perMarker.get(this._leaflet_id) || 0) + 1);
    const a = old?.options?.html || '', b = icon?.options?.html || '';
    let i = 0; while (i < a.length && a[i] === b[i]) i++;
    const k = a === b ? (old?.options?.className !== icon?.options?.className ? 'class only' : 'same html') : `${a.slice(Math.max(0, i - 30), i + 40)}  ->  ${b.slice(Math.max(0, i - 30), i + 40)}`;
    S.diffs[k] = (S.diffs[k] || 0) + 1;
    const r = L.Marker.prototype.__siOrig.call(this, icon);
    S.ms += performance.now() - t;
    return r;
};
return 'patched';
