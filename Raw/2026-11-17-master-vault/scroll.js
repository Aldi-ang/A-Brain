const pane = [...document.querySelectorAll('div')].find(d => d.className && typeof d.className === 'string' && d.className.includes('lg:flex-1 lg:h-full lg:overflow-y-auto'));
if (pane) pane.scrollTop = 9999;
const det = document.querySelector('details.controls-panel'); if (det) det.open = true;
if (pane) pane.scrollTop = 9999;
return { pane: !!pane, det: !!det };
