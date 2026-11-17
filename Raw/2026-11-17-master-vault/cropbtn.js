const b = document.querySelector('button[title="Crop again"]'); if (!b) return 'none'; const r = b.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) };
