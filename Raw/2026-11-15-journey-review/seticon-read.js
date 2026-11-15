const S = window.__si;
if (!S) return 'not patched';
const per = [...S.perMarker.values()];
const top = Object.entries(S.diffs).sort((x, y) => y[1] - x[1]).slice(0, 6);
return { calls: S.calls, ms: Math.round(S.ms), sameIcon: S.same, markers: per.length, maxPerMarker: Math.max(0, ...per), top };
