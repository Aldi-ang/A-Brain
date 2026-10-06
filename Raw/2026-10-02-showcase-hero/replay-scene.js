/* ---- 03 · the Day Replay: ONE clock (a 1.4 s walk + a 1.3 s scene per stop, as DayReplay.jsx plays it); the man, the
   chests, the bar and the card all read it. Lite / still: the frame stands at stop 5, and Play cuts between still pictures
   (the man jumps, nothing animates) - the app's own Lite rule. Every key does something you can see. ---- */
const DR_PERSON = '__PERSON__';
const DR = [
  { t: '08:10', k: 'start', x: 8, y: 88 },
  { t: '08:24', k: 'sold', x: 20, y: 70, n: 'Toko Berkah Jaya', v: 'Sale · Rp 250.000' },
  { t: '08:51', k: 'order', x: 36, y: 86, n: 'Warung Sumber Rejeki', v: 'Repeat Order', note: 'Kirim lagi hari Kamis' },
  { t: '09:18', k: 'sold', x: 48, y: 58, n: 'Toko Makmur', v: 'Sale · Rp 180.000' },
  { t: '09:44', k: 'issue', x: 63, y: 80, n: 'Warung Bu Sri', v: 'Competitor Issue', note: 'Rokok saingan dijual lebih murah' },
  { t: '10:12', k: 'sold', x: 78, y: 62, n: 'Toko Sinar Abadi', v: 'Sale · Rp 325.000' },
  { t: '10:40', k: 'request', x: 60, y: 36, n: 'Warung Pojok', v: 'New Request', note: 'Minta Sampoerna Mild 16' },
  { t: '11:05', k: 'closed', x: 90, y: 30, n: 'Toko Lancar', v: 'Store Closed' },
];
const DR_NAME = { sold: 'Sale', order: 'Repeat Order', issue: 'Competitor Issue', request: 'New Request', closed: 'Store Closed' };
const DR_TONE = { sold: '#E4B04A', order: '#E4B04A', issue: 'var(--led-crit)', request: '#C98A4A', closed: 'var(--led-crit)' };
const DR_TICK = { sold: 'money', order: 'money', issue: 'problem', closed: 'closed' };
const drSign = (k) => (k === 'sold' ? '<i class="kpm-coin lg"></i>' : `<i class="kx-sgn kx-sgn-${k}"></i>`);
const DR_WALK = 1400, DR_SCN = 1300, DR_SEG = DR_WALK + DR_SCN, DR_N = DR.length - 1, DR_TOTAL = DR_N * DR_SEG, DR_HOLD = 2400;
const drMin = (s) => +s.slice(0, 2) * 60 + +s.slice(3);
const drHm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.floor(m % 60)).padStart(2, '0')}`;
const DR_M = DR.map((d) => drMin(d.t)), DR_D0 = DR_M[0], DR_D1 = DR_M[DR_N];
const DR_STILL_T = 4 * DR_SEG + DR_WALK + 700;   /* the still frame: Budi at stop 5, five chests open */
const drEase = (u) => (1 - Math.cos(Math.PI * u)) / 2;
/* where the clock is: the stop he walks to or stands at, his spot, the time of day, the chests already open */
function drAt(t) {
  t = Math.max(0, Math.min(DR_TOTAL, t));
  const k = Math.min(DR_N, Math.floor(t / DR_SEG) + 1), local = t - (k - 1) * DR_SEG, walking = local < DR_WALK && t < DR_TOTAL;
  const u = walking ? local / DR_WALK : 1, a = DR[k - 1], b = DR[k], e = still ? (walking ? 0 : 1) : drEase(u);
  const open = DR.map((d, j) => j > 0 && t >= (j - 1) * DR_SEG + DR_WALK + 300);
  return { k, walking, x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, left: b.x < a.x,
    clock: walking ? DR_M[k - 1] + (DR_M[k] - DR_M[k - 1]) * u : DR_M[k], open, cur: open.lastIndexOf(true) < 0 ? 0 : open.lastIndexOf(true) };
}
const drTAt = (c) => { for (let k = 1; k <= DR_N; k++) if (c <= DR_M[k]) return (k - 1) * DR_SEG + Math.max(0, (c - DR_M[k - 1]) / (DR_M[k] - DR_M[k - 1])) * DR_WALK; return DR_TOTAL; };
const drArrive = (k) => (k <= 0 ? 0 : (k - 1) * DR_SEG + DR_WALK + 320);

/* the map, built once */
const drMap = document.getElementById('drmap');
document.getElementById('drPath').setAttribute('points', DR.map((d) => `${d.x},${d.y}`).join(' '));
const drStart0 = el('i', 'drstart'); drStart0.style.left = DR[0].x + '%'; drStart0.style.top = DR[0].y + '%'; drMap.append(drStart0);
const drPts = DR.slice(1).map((d, i) => {
  const p = el('div', 'drpt', `<span class="drsign"></span><button type="button" class="drchest" aria-label="${d.n}, ${d.t}"><i class="kx-spr kx-spr-closed"></i></button><span class="drtag"><b>BS · ${i + 1}</b><span class="nm"> ${d.n}</span></span>`);
  p.style.left = d.x + '%'; p.style.top = d.y + '%'; drMap.append(p);
  p.querySelector('button').onclick = () => drPick(i + 1);
  return p;
});
const drMan = el('div', 'drman', `<span class="mtag"><i></i><span>BS · 0/${DR_N}</span></span><div class="who">${DR_PERSON}</div>`); drMap.append(drMan);
const drTicks = DR.map((d, k) => { const b = el('button', 'tick ' + (DR_TICK[d.k] || '')); b.type = 'button'; b.style.left = ((DR_M[k] - DR_D0) / (DR_D1 - DR_D0) * 100) + '%';
  b.setAttribute('aria-label', `${d.t} ${d.n || 'Day starts'}`); b.onclick = (e) => { e.stopPropagation(); drJump(k); }; document.getElementById('drTl').append(b); return b; });

/* the state the clock is drawn from */
let drT = 0, drPlaying = false, drSpeed = 1, drRaf = 0, drPrev = null, drHoldUntil = 0, drPicked = null, drKey = '';
const drCard = document.getElementById('drcard');
function drCardHtml(k, picked) {
  const d = DR[k];
  if (k === 0) return `<div class="top"><span class="pic"><i class="drstart" style="position:static;translate:none;display:block"></i></span><div style="min-width:0"><b>Budi Santoso</b><small>${d.t} · Day starts</small></div></div><p class="by">His first position of the day.</p>`;
  const by = d.k === 'sold' ? `Recorded by the terminal at ${d.t} · Budi Santoso` : `Visit Report by Budi Santoso at ${d.t} (when he pressed Report)`;
  return `<div class="top"><span class="pic">${drSign(d.k)}</span><div style="min-width:0;flex:1"><b>${d.n}</b><small>${d.t} · ${DR_NAME[d.k]}</small></div>${picked ? '<button type="button" class="x" id="drX" aria-label="Close">×</button>' : ''}</div>`
    + `<p class="st" style="--tone:${DR_TONE[d.k]}"><i></i>${d.v}</p>${d.note ? `<p class="nt">"${d.note}"</p>` : ''}<p class="by">${by}</p>`
    + (picked ? '<div class="acts"><button type="button" id="drFrom">Play from here</button></div>' : '');
}
function drRender() {
  const s = drAt(drT), pct = (s.clock - DR_D0) / (DR_D1 - DR_D0) * 100;
  drMan.style.left = s.x + '%'; drMan.style.top = s.y + '%';
  drMan.querySelector('.who').style.scale = s.left && s.walking ? '-1 1' : '';
  const walked = DR.slice(0, s.walking ? s.k : s.k + 1).map((d) => `${d.x},${d.y}`).concat(s.walking ? [`${s.x},${s.y}`] : []).join(' ');
  document.getElementById('drTrail').setAttribute('points', walked); document.getElementById('drTrailU').setAttribute('points', walked);
  document.getElementById('drFill').style.width = pct + '%'; document.getElementById('drHead').style.left = pct + '%';
  document.getElementById('drClock').textContent = drHm(s.clock);
  const tl = document.getElementById('drTl'); tl.setAttribute('aria-valuenow', pct.toFixed(0)); tl.setAttribute('aria-valuetext', drHm(s.clock));
  const key = `${s.open.join('')}|${s.cur}|${drPicked}|${s.walking && !still ? 1 : 0}|${drPlaying}`;
  if (key === drKey) return;
  drKey = key;
  drMan.classList.toggle('walk', s.walking && drPlaying); drMan.classList.toggle('busy', !s.walking);
  drMan.querySelector('.mtag span').textContent = `BS · ${s.open.filter(Boolean).length}/${DR_N}`;
  drPts.forEach((p, i) => {
    const on = s.open[i + 1], spr = p.querySelector('.kx-spr'), sg = p.querySelector('.drsign');
    spr.className = 'kx-spr ' + (on ? 'kx-spr-open' : 'kx-spr-closed');
    if (on && !sg.innerHTML) { sg.innerHTML = drSign(DR[i + 1].k); sg.classList.add('pop'); }
    if (!on && sg.innerHTML) { sg.innerHTML = ''; sg.classList.remove('pop'); }
    p.classList.toggle('pick', drPicked === i + 1);
  });
  drTicks.forEach((b, k) => b.classList.toggle('now', k === (drPicked ?? s.cur)));
  const ck = drPicked ?? s.cur;
  drCard.classList.toggle('pick', drPicked != null);
  drCard.innerHTML = drCardHtml(ck, drPicked != null);
  const x = document.getElementById('drX'); if (x) x.onclick = () => { drPicked = null; drRender(); };
  const f = document.getElementById('drFrom'); if (f) f.onclick = () => { const k = drPicked; drPicked = null; drT = (k - 1) * DR_SEG + DR_WALK; drPlay(true); };
  /* the key's picture changes ONLY when play/pause changes: rebuilt on every chest, it pulled the tapped node out from
     under a finger and the tap was lost (walk 2026-10-06, the phone) */
  const pb = document.getElementById('drPlay');
  if (pb.dataset.on !== String(drPlaying)) {
    pb.dataset.on = String(drPlaying); pb.setAttribute('aria-label', drPlaying ? 'Pause' : 'Play');
    pb.innerHTML = `<svg viewBox="0 0 18 18" fill="currentColor">${drPlaying ? '<path d="M4 3h4v12H4zM10 3h4v12h-4z"/>' : '<path d="M5 3v12l10-6z"/>'}</svg>`;
  }
}
function drLoop(now) {
  if (!drPlaying || !live.has('ulang')) { drRaf = 0; drPrev = null; return; }
  if (drPrev != null) {
    if (drT >= DR_TOTAL) { if (!drHoldUntil) drHoldUntil = now + DR_HOLD; else if (now >= drHoldUntil) { drHoldUntil = 0; drT = 0; } }
    else drT = Math.min(DR_TOTAL, drT + (now - drPrev) * drSpeed);
  }
  drPrev = now; drRender(); drRaf = requestAnimationFrame(drLoop);
}
function drGo() { if (!drRaf && drPlaying && live.has('ulang')) drRaf = requestAnimationFrame(drLoop); }
function drPlay(on) { drPlaying = on; drPrev = null; drHoldUntil = 0; if (on && drT >= DR_TOTAL) drT = 0; drKey = ''; drRender(); drGo(); }
function drJump(k) { drPicked = null; drT = drArrive(k); drPrev = null; drKey = ''; drRender(); }
function drPick(k) { drPicked = k; drPlaying = false; drKey = ''; drRender(); }
function drMode() { drPicked = null; drSpeed = drSpeed || 1; if (still) { drPlaying = false; drT = DR_STILL_T; } else { drPlaying = true; drT = 0; } drKey = ''; drRender(); drGo(); }
document.getElementById('drPlay').onclick = () => drPlay(!drPlaying);
document.getElementById('drRestart').onclick = () => { drPicked = null; drT = 0; drPlay(true); };
document.getElementById('drPrev').onclick = () => { const s = drAt(drT); drJump(Math.max(0, s.walking ? s.k - 2 : s.cur - 1)); };
document.getElementById('drNext').onclick = () => { const s = drAt(drT); drJump(Math.min(DR_N, s.walking ? s.k : s.cur + 1)); };
document.querySelectorAll('#drbar .speed button').forEach((b) => { b.onclick = () => { drSpeed = +b.dataset.v; document.querySelectorAll('#drbar .speed button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }; });
{ const tl = document.getElementById('drTl'); let drag = null;
  const seek = (e) => { const r = tl.getBoundingClientRect(); drPicked = null; drT = drTAt(DR_D0 + Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * (DR_D1 - DR_D0)); drPrev = null; drKey = ''; drRender(); };
  tl.onpointerdown = (e) => { if (e.target.classList.contains('tick')) return; drag = drPlaying; drPlaying = false; tl.setPointerCapture(e.pointerId); seek(e); };
  tl.onpointermove = (e) => { if (drag != null) seek(e); };
  tl.onpointerup = tl.onpointercancel = () => { if (drag == null) return; const was = drag; drag = null; if (was) drPlay(true); }; }
