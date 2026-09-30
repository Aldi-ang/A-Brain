<script>
  /* 2026-09-30: the quarantine chest on the regional warehouse and on Stock Opname - options A / B, live. The hatch and
     the doors run the app's own timing (components/QuarantineSwitch.jsx): the dome goes down, the platform rides down,
     the doors shut, the dome changes behind them, the doors open, the platform rides up; 130 ms after the press the
     blast doors close over the shelf and the shelf changes while they are shut. Lite Mode swaps at once. */
  (function () {
    var SIGN = document.getElementById('sign').innerHTML;
    var PKG = '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>';
    var IN = 'cubic-bezier(.55, 0, .85, .35)', OUT = 'cubic-bezier(.23, 1, .32, 1)';
    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    var done = function (a, ms) { return Promise.race([a.finished.catch(function () {}), wait(ms + 150)]); };
    var still = function () { return document.documentElement.classList.contains('lite') || !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
    var fmt = function (n) { return Number(n).toLocaleString('id-ID'); };
    var items = function (n) { return n + ' item' + (n === 1 ? '' : 's'); };
    var HATCH = '<button type="button" class="kpm-hatch" data-skin="q"><span class="hs"><span class="rc"><span class="lift"><span class="plat"></span><span class="bez"><span class="dome"><i class="ico"></i><i class="dk"></i></span></span><span class="lbl"></span></span><i class="dr d1"></i><i class="dr d2"></i></span></span></button>';
    var DOORS = '<div class="kpm-doors" aria-hidden="true"><i class="dl"></i><i class="dr"></i></div>';
    function face(b, skin) {
      b.dataset.skin = skin;
      var ico = b.querySelector('.ico');
      ico.className = 'ico' + (skin === 'ok' ? ' eye' : '');
      ico.innerHTML = skin === 'ok' ? '<i class="pupil"></i><i class="lid"></i>' : SIGN;
      b.querySelector('.lbl').textContent = skin === 'ok' ? 'HEALTHY' : 'QUARANTINE';
      var l = skin === 'ok' ? 'Show the healthy stock' : 'Show the quarantine';
      b.setAttribute('aria-label', l); b.title = l;
    }
    /* the ender eye lives (his "moving and blink at random"); Lite Mode keeps it still and open */
    (function eyeLife() {
      if (!still()) document.querySelectorAll('.opt .kpm-hatch[data-skin="ok"] .ico.eye').forEach(function (e) {
        if (Math.random() < .5) return;
        if (Math.random() < .35) { e.classList.add('blink'); setTimeout(function () { e.classList.remove('blink'); }, 140); }
        else e.firstChild.style.transform = 'translate(' + ((Math.random() * 2 - 1) * 4.5).toFixed(1) + 'px, ' + ((Math.random() * 2 - 1) * 2.5).toFixed(1) + 'px)';
      });
      setTimeout(eyeLife, 700 + Math.random() * 1400);
    })();
    async function press(b, toQ) {
      var $ = function (s) { return b.querySelector(s); }, all = [];
      var A = function (n, kf, o) { var a = n.animate(kf, o); all.push(a); return a; };
      var push = A($('.dome'), [{ transform: 'scale(.97)' }, { transform: 'scale(.92)' }], { duration: 80, easing: OUT, fill: 'forwards' });
      var dark = A($('.dk'), [{ opacity: .1 }, { opacity: .32 }], { duration: 80, easing: OUT, fill: 'forwards' });
      await wait(130);
      var sink = A($('.lift'), [{ transform: 'translateY(0)' }, { transform: 'translateY(104%)' }], { duration: 280, easing: IN, fill: 'forwards' });
      await wait(150);
      A($('.d1'), [{ transform: 'translateX(-102%)' }, { transform: 'translateX(0)' }], { duration: 230, easing: IN, fill: 'forwards' });
      await done(A($('.d2'), [{ transform: 'translateX(102%)' }, { transform: 'translateX(0)' }], { duration: 230, easing: IN, fill: 'forwards' }), 230);
      A($('.hs'), [{ transform: 'translateY(0)' }, { transform: 'translateY(2px)' }, { transform: 'translateY(0)' }], { duration: 120 });
      face(b, toQ ? 'ok' : 'q'); push.cancel(); dark.cancel();
      await wait(160);
      A($('.d1'), [{ transform: 'translateX(0)' }, { transform: 'translateX(-102%)' }], { duration: 300, easing: OUT, fill: 'forwards' });
      var o2 = A($('.d2'), [{ transform: 'translateX(0)' }, { transform: 'translateX(102%)' }], { duration: 300, easing: OUT, fill: 'forwards' });
      await wait(150);
      var rise = A($('.lift'), [{ transform: 'translateY(104%)', easing: 'cubic-bezier(.3, .7, .4, 1)' }, { transform: 'translateY(-4%)', offset: .78, easing: 'cubic-bezier(.4, 0, .6, 1)' }, { transform: 'translateY(0)' }], { duration: 560, fill: 'forwards' });
      sink.cancel();
      await Promise.all([done(o2, 150), done(rise, 560)]);
      all.forEach(function (a) { a.cancel(); });
    }
    async function doors(d, toQ, swap) {
      var L = d.children[0], R = d.children[1], all = [];
      var A = function (n, kf, o) { var a = n.animate(kf, o); all.push(a); return a; };
      d.dataset.kind = toQ ? 'tape' : 'steel'; d.dataset.look = rw.door; d.dataset.hl = rw.hl;
      A(L, [{ transform: 'translateX(calc(-101% - 30px))' }, { transform: 'translateX(0)' }], { duration: 240, easing: IN, fill: 'forwards' });
      await done(A(R, [{ transform: 'translateX(calc(101% + 30px))' }, { transform: 'translateX(0)' }], { duration: 240, easing: IN, fill: 'forwards' }), 240);
      swap();
      A(d.parentElement, [{ transform: 'translateY(0)' }, { transform: 'translateY(2px)' }, { transform: 'translateY(-1px)' }, { transform: 'translateY(0)' }], { duration: 160 });
      await wait(190);
      A(L, [{ transform: 'translateX(0)' }, { transform: 'translateX(calc(-101% - 30px))' }], { duration: 340, easing: OUT, fill: 'forwards' });
      await done(A(R, [{ transform: 'translateX(0)' }, { transform: 'translateX(calc(101% + 30px))' }], { duration: 340, easing: OUT, fill: 'forwards' }), 340);
      all.forEach(function (a) { a.cancel(); });
      delete d.dataset.kind;   /* open = no door face at all: the seal never lingers at the edge */
    }
    /* the sign as an image, for the stamp where the doors meet (each door carries half of it) */
    (function () {
      var rects = (SIGN.match(/<rect[^>]*>/g) || []).map(function (r) { return r.replace(/\/?>$/, '/>'); }).join('').replace(/"/g, "'");   /* innerHTML leaves each rect unclosed: an image must be well-formed */
      var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4.5 -4.5 24 24' shape-rendering='crispEdges'><g fill='#141414'>" + rects + "</g></svg>";
      document.documentElement.style.setProperty('--sign-img', 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
    })();
    function keys(attr, val) { document.querySelectorAll('[' + attr + ']').forEach(function (k) { k.setAttribute('aria-pressed', String(k.getAttribute(attr) === val)); }); }

    /* ── THE REGIONAL WAREHOUSE (BranchWarehouseManager, the Stock tab), BANDUNG's shelf ── */
    var SHELF = [['Cello Green 16', 420, '#7A8F4F', 'Paling lama di sini 12 hari · 2 kiriman'], ['Cello Merah 12', 168, '#9B3B2E', 'Paling lama di sini 5 hari'],
      ['Sigaret Kretek Tangan Premium', 54, '#A5783A', 'Paling lama di sini 19 hari'], ['Djarum Coklat 12', 0, '#7A4B22', '']];
    var QUAR = [['Cello Green 16', 12, '#7A8F4F'], ['Cello Merah 12', 4, '#9B3B2E']];
    var rw = { opt: 'B', view: 'ok', busy: false, hp: false, open: true, door: 'd1', hl: 'h1' }, rwD = document.getElementById('rwD'), rwM = document.getElementById('rwM');
    var ENDER = '<button type="button" class="chestCell on" id="rwChest" aria-expanded="true" aria-label="Ender chest Gudang BANDUNG - open or close"><span class="c3 ender"><span class="cc"><i class="bf"></i><i class="bl"></i><i class="br"></i><i class="bt"></i><i class="it"></i><i class="if"></i><i class="iu"></i><span class="lid3"><i class="lf"></i><i class="ll"></i><i class="lr"></i><i class="lt"></i><i class="lu"></i><i class="latch"></i></span></span></span><span class="capt">Gudang BANDUNG<small>642 Bks · 16 in Quarantine</small></span></button>';
    var MOTES = '<span class="endmotes" aria-hidden="true">' + Array.from({ length: 10 }, function (_, i) { return '<i style="--mx:' + (8 + (i * 37) % 84) + '%;--md:' + (5 + (i % 4) * 1.3).toFixed(1) + 's;--mdl:-' + (i * 0.9).toFixed(1) + 's"></i>'; }).join('') + '</span>';
    var NAV = '<div class="dnav"><div class="dt"><i class="lamp"></i><span class="tt">On the shelf</span><span class="ts">per product · in Bks</span></div><div class="tabs">'
      + [['Incoming', 3], ['Request', 0], ['Stock', 4], ['Book', 4], ['Data Induk', 0]].map(function (t) { return '<span class="tab' + (t[0] === 'Stock' ? ' on' : '') + '">' + t[0] + ' ' + t[1] + '</span>'; }).join('') + '</div></div>';
    function card(p) {
      return '<div class="scard"><div class="r1"><span class="nm">' + p[0] + '</span><span class="bk">' + fmt(p[1]) + '<small>Bks</small></span></div>'
        + (p[3] ? '<div class="r2"><span>' + p[3] + '</span><span aria-hidden="true">⌄</span></div>' : '') + '</div>';
    }
    function qcard(p) {
      return '<div class="scard q"><div class="r1"><span class="nm">' + p[0] + '</span><span class="bk">' + fmt(p[1]) + '<small>Bks</small></span></div>'
        + '<div class="r2"><span>damaged on arrival</span><span>fix in Stock Opname</span></div></div>';
    }
    function titleLine(q, cls) {
      return '<p class="stl"><span class="tn">' + (q ? '<i>' + SIGN + '</i><span class="tx">Quarantine · BANDUNG</span>' : '<span class="tx">Gudang BANDUNG</span>') + '</span><span class="ct">'
        + (q ? '16 Bks · ' + items(2) : '4 products · ' + fmt(642) + ' Bks') + '</span></p>' + (q && rw.opt === 'B' ? '' : '<i class="kpm-qband' + (q ? ' tape' : '') + '" aria-hidden="true"></i>');   /* look A: in B the tape rim replaces the band */
    }
    function stageInner() {
      var q = rw.view === 'q';
      if (rw.opt === 'A') return titleLine(q) + '<div class="shelf">' + (q ? QUAR.map(qcard) : SHELF.map(card)).join('') + '</div>';
      var L = q ? QUAR : SHELF, per = rw.hp ? 4 : 8, h = '';
      for (var i = 0; i < per; i++) {
        var p = L[i];
        h += p ? '<div class="slot has' + (q ? ' qs' : '') + '" data-i="' + i + '" role="button" tabindex="0"><span class="box" style="--c:' + p[2] + '"></span><span class="n">' + (p[1] ? fmt(p[1]) : 'habis') + '</span><span class="name">' + p[0] + '</span></div>' : '<div class="slot"></div>';
      }
      return titleLine(q) + '<span class="say"></span><div class="grid">' + h + '</div>';
    }
    function deckNotes() {
      var q = rw.view === 'q';
      return [q ? items(2) + ' damaged' : '4 products', q ? 'fix in Stock Opname' : fmt(642) + ' Bks on the shelf'];
    }
    function paintRW() {
      rw.view = 'ok'; rw.busy = false;
      if (rw.opt === 'today') { rwD.innerHTML = NAV + '<div class="dbody"><div class="shelf">' + SHELF.map(card).join('') + '</div></div>'; rwM.textContent = 'Today: the shelf has no way to see the damaged boxes.'; return; }
      var n = deckNotes(), deck = '<div class="ddeck">' + (rw.opt === 'B' ? '<span class="pgs"><button class="pg" type="button">1</button></span>' : '<span class="l">' + n[0] + '</span>') + HATCH + '<span class="r">' + n[1] + '</span></div>';
      var stage = '<div class="stg"><div class="stc">' + stageInner() + '</div>' + DOORS + '</div>';
      rw.open = true;
      rwD.innerHTML = NAV + '<div class="dbody">' + (rw.opt === 'B' ? '<div class="wh2">' + MOTES + '<div class="sbx" id="rwBox">' + stage + deck + '</div>' + ENDER + '</div>' : stage + deck) + '</div>';
      face(rwD.querySelector('.kpm-hatch'), 'q');
      rwM.textContent = 'Press the big button under the shelf.';
    }
    function flipRW() {
      if (rw.busy) return;
      hold(false);
      var toQ = rw.view === 'ok', b = rwD.querySelector('.kpm-hatch'), d = rwD.querySelector('.kpm-doors'), stc = rwD.querySelector('.stc'), stg = rwD.querySelector('.stg');
      var swap = function () {
        var h = stc.offsetHeight;
        rw.view = toQ ? 'q' : 'ok';
        stc.innerHTML = stageInner(); stg.classList.toggle('isq', toQ);
        var bx = document.getElementById('rwBox'); if (bx) bx.classList.toggle('lkA', toQ);
        stc.style.minHeight = '';
        if (stc.offsetHeight < h) stc.style.minHeight = h + 'px';   /* the shelf keeps its height: nothing under it moves */
        var n = deckNotes(), l = rwD.querySelector('.ddeck .l'), r = rwD.querySelector('.ddeck .r');
        if (l) l.textContent = n[0]; r.textContent = n[1];
        rwM.textContent = toQ ? 'Showing Quarantine · ' + items(2) + ' (16 Bks). The button came back as the ender eye: press it to go back.' : 'Showing healthy stock · 4 products. The button came back as the biohazard.';
      };
      if (still()) { face(b, toQ ? 'ok' : 'q'); swap(); return; }
      rw.busy = true;
      Promise.all([press(b, toQ), wait(130).then(function () { return doors(d, toQ, swap); })]).finally(function () { rw.busy = false; });
    }
    rwD.addEventListener('click', function (e) {
      if (e.target.closest('#rwChest')) {
        rw.open = !rw.open;
        var ch = document.getElementById('rwChest'); ch.classList.toggle('on', rw.open); ch.setAttribute('aria-expanded', String(rw.open));
        document.getElementById('rwBox').classList.toggle('shut', !rw.open);
        rwM.textContent = rw.open ? 'You opened the ender chest: its box stands on it again.' : 'You closed the ender chest: its box folds into the lid, and nothing under it moves.';
        return;
      }
      if (e.target.closest('.kpm-hatch')) return flipRW();
      var s = e.target.closest('.slot.has');
      if (s) {
        var q = rw.view === 'q', p = (q ? QUAR : SHELF)[+s.dataset.i];
        rwD.querySelector('.say').textContent = q ? p[0] + ' · ' + fmt(p[1]) + ' Bks damaged' : p[0] + ' · ' + fmt(p[1]) + ' Bks' + (p[3] ? ' · ' + p[3].replace('Paling lama di sini', 'paling lama') : '');
        rwM.textContent = 'You pressed ' + p[0] + ': its line shows under the band.';
      }
    });
    document.querySelectorAll('[data-door]').forEach(function (k) { k.addEventListener('click', function () {
      rw.door = k.dataset.door; keys('data-door', rw.door);
      var d = rwD.querySelector('.kpm-doors'); if (d) d.dataset.look = rw.door;
      rwM.textContent = 'Door look ' + k.textContent.trim() + ': press the big button to see it close.';
    }); });
    /* a Healthy key shows that door SHUT and holds it (the run shows it for ~0.4 s); the big button opens it again */
    function hold(on) {
      var d = rwD.querySelector('.kpm-doors'); if (!d) return;
      var L = d.children[0], R = d.children[1];
      if (on) { d.dataset.kind = 'steel'; d.dataset.look = rw.door; d.dataset.hl = rw.hl; d.dataset.hold = '1'; L.style.transform = R.style.transform = 'translateX(0)'; }
      else if (d.dataset.hold) { delete d.dataset.hold; delete d.dataset.kind; L.style.transform = R.style.transform = ''; }
    }
    document.querySelectorAll('[data-hl]').forEach(function (k) { k.addEventListener('click', function () {
      if (rw.busy || rw.opt !== 'B') return;
      rw.hl = k.dataset.hl; keys('data-hl', rw.hl);
      if (!rw.open) document.getElementById('rwChest').click();
      hold(false); void rwD.offsetWidth; hold(true);
      rwM.textContent = k.textContent.trim() + ': the healthy door, held shut so you can look. Press the big button to open it.';
    }); });
    document.querySelectorAll('[data-rw]').forEach(function (k) { k.addEventListener('click', function () { rw.opt = k.dataset.rw; keys('data-rw', rw.opt); paintRW(); }); });
    document.querySelectorAll('[data-rw-w]').forEach(function (k) { k.addEventListener('click', function () { rw.hp = k.dataset.rwW === 'hp'; document.getElementById('rwF').classList.toggle('phone', rw.hp); keys('data-rw-w', k.dataset.rwW); paintRW(); }); });
    paintRW();
    document.getElementById('rwRec').innerHTML = '<b>Your pick: B, with the 3D ender chest under the box.</b> Press the chest to shut it: the box folds into it and keeps its room, so nothing below moves. The Quarantine view wears box <b>A</b>, the tape rim. The healthy door (going back from the Quarantine) has three looks on the <b>Healthy</b> keys - press one to see it shut; my pick 1. The cost you took: the age list under each card becomes one line when you press a square.';

    /* ── STOCK OPNAME, the boss's QUARANTINE tab ── */
    var FAC = [{ k: 'PUSAT', name: 'Pusat', rows: [['Djarum Coklat 12', 12, 150000, 'MASTER', '#7A4B22']] },
      { k: 'BANDUNG', name: 'Bandung', rows: [['Cello Green 16', 12, 106800, 'BANDUNG', '#7A8F4F'], ['Cello Merah 12', 4, 0, 'BANDUNG', '#9B3B2E']] },
      { k: 'MUNTILAN', name: 'Muntilan', rows: [] }, { k: 'SEMARANG', name: 'Semarang', rows: [] }];
    var so = { opt: 'B', fac: null, sq: null, hp: false }, soV = document.getElementById('soV'), soM = document.getElementById('soM');
    var ACTS = '<div class="acts"><span class="act">Convert to sample</span><span class="act">RTV factory</span><span class="act pen">Penalty charge</span></div>';
    var HEAD = '<div class="qh"><div><h3><i>' + SIGN + '</i>Quarantine Vault</h3><p>Damaged goods liquidation &amp; history</p></div><div class="qtabs"><span class="qtab">Monitor</span><span class="qtab">HQ Audits 1</span><span class="qtab on">Quarantine</span><span class="qtab">New Count</span></div></div>';
    function shown() { return FAC.filter(function (f) { return !so.fac || f.k === so.fac; }).reduce(function (a, f) { return a.concat(f.rows); }, []); }
    function sunk() { return shown().reduce(function (a, r) { return a + r[2]; }, 0); }
    function row(r) { return '<div class="row"><span class="ic">' + PKG + '</span><div><div class="rn">' + r[0] + '</div><div class="rm"><b>' + r[1] + ' Bks Damaged</b> | Total HPP Loss: Rp ' + fmt(r[2]) + ' | ' + r[3] + '</div></div>' + ACTS + '</div>'; }
    function crate(f) {
      var n = f.rows.reduce(function (a, r) { return a + r[1]; }, 0);
      return '<button type="button" class="chestCell' + (f.rows.length ? '' : ' empty') + '" data-fac="' + f.k + '" aria-pressed="false" aria-label="Quarantine crate ' + f.name + ' - open or close"><span class="c3 hazard"><span class="cc"><i class="bf"><span class="sign">' + SIGN + '</span></i><i class="bl"></i><i class="br"></i><i class="bt"></i><span class="lid3"><i class="lf"></i><i class="ll"></i><i class="lr"></i><i class="lt"></i><i class="lu"></i><i class="latch"></i></span></span></span><span class="capt">' + f.name + '<small>' + (f.rows.length ? fmt(n) + ' Bks · ' + items(f.rows.length) : 'empty') + '</small></span></button>';
    }
    function below() {
      if (so.opt !== 'B') { var R = shown(); return '<div class="rows">' + (R.length ? R.map(row).join('') : '<p class="none">Nothing damaged in ' + FAC.filter(function (f) { return f.k === so.fac; })[0].name + '</p>') + '</div>'; }
      var f = FAC.filter(function (x) { return x.k === so.fac; })[0];
      if (!f) return '<p class="none">Press a crate to open its box</p>';
      var per = so.hp ? 4 : 8, h = '';
      for (var i = 0; i < per; i++) { var r = f.rows[i]; h += r ? '<div class="slot has qs' + (so.sq === i ? ' on' : '') + '" data-i="' + i + '" role="button" tabindex="0"><span class="box" style="--c:' + r[4] + '"></span><span class="n">' + r[1] + '</span><span class="name">' + r[0] + '</span></div>' : '<div class="slot"></div>'; }
      var n = f.rows.reduce(function (a, r) { return a + r[1]; }, 0), r2 = so.sq !== null ? f.rows[so.sq] : null;
      return '<div class="sbx lkA"><div class="stg isq"><p class="stl"><span class="tn"><i>' + SIGN + '</i><span class="tx">Quarantine · ' + f.k + '</span></span><span class="ct">' + fmt(n) + ' Bks · ' + items(f.rows.length) + '</span></p>'
        + '<span class="say">' + (f.rows.length ? (r2 ? r2[0] + ' picked' : 'press a square for its actions') : 'nothing damaged here') + '</span><div class="grid">' + h + '</div></div></div>'
        + (r2 ? '<div class="strip"><div class="rn">' + r2[0] + ' · ' + r2[1] + ' Bks damaged · Rp ' + fmt(r2[2]) + '</div>' + ACTS + '</div>' : '');
    }
    function bar() {
      return '<div class="qbar"><div class="seg"><b class="on">Active quarantine</b><b>Liquidation history</b></div>' + (so.opt === 'today' ? '<span class="fsel">All facilities ▾</span>' : '')
        + '<div class="sunk"><span>Sunk capital (dead asset value)</span><b id="soSunk">Rp ' + fmt(sunk()) + '</b></div></div>';
    }
    function paintSO() {
      so.fac = so.opt === 'B' ? 'BANDUNG' : null; so.sq = null;
      soV.innerHTML = HEAD + '<div class="qb">' + bar() + (so.opt === 'today' ? '' : '<div class="crates">' + FAC.map(crate).join('') + '</div>') + '<div id="soBelow">' + below() + '</div></div>';
      syncCrates();
      soM.textContent = so.opt === 'today' ? 'Today: the warehouse is picked from a list.' : so.opt === 'B' ? 'The Bandung crate is open. Press a square, or another crate.' : 'Press a crate.';
    }
    function boxSwap(prevFac) {
      var holder = document.getElementById('soBelow'), html = below();
      if (!holder.querySelector('.sbx') || still()) { holder.innerHTML = html; return; }
      var ox = function (k) { var c = soV.querySelector('.crates .chestCell[data-fac="' + k + '"]'), r = c.getBoundingClientRect(), h = holder.getBoundingClientRect(); return Math.round(r.left + r.width / 2 - h.left) + 'px 0'; };
      holder.style.transformOrigin = ox(prevFac);
      var a = holder.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.08) translateY(-24px)', opacity: 0 }], { duration: 170, easing: IN, fill: 'forwards' });
      done(a, 170).then(function () {
        /* measure the new crate with the box UNtransformed - a rect read while it is still shrunk is off by the shrink */
        a.cancel(); holder.innerHTML = below(); holder.style.transformOrigin = ox(so.fac);
        holder.animate([{ transform: 'scale(.08) translateY(-24px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.34, 1.56, .64, 1)' });
      });
    }
    function syncCrates(prev) {
      soV.querySelectorAll('.crates .chestCell').forEach(function (c) {
        var on = c.dataset.fac === so.fac;
        c.classList.toggle('on', on); c.classList.toggle('dim', !!so.fac && !on); c.setAttribute('aria-pressed', String(on));
      });
      document.getElementById('soSunk').textContent = 'Rp ' + fmt(sunk());
      if (so.opt === 'B' && prev !== undefined && prev !== so.fac) boxSwap(prev);   /* a crate swap animates; a square pick does not */
      else document.getElementById('soBelow').innerHTML = below();
    }
    soV.addEventListener('click', function (e) {
      var c = e.target.closest('.crates .chestCell');
      if (c) {
        var f = FAC.filter(function (x) { return x.k === c.dataset.fac; })[0];
        var prev = so.fac;
        so.fac = so.fac === f.k && so.opt !== 'B' ? null : f.k; so.sq = null;
        syncCrates(prev);
        soM.textContent = so.fac ? 'You opened the ' + f.name + ' crate: ' + (f.rows.length ? items(f.rows.length) + ', sunk capital Rp ' + fmt(sunk()) + '.' : 'nothing damaged there.') + (so.opt === 'B' ? '' : ' Press it again for every warehouse.') : 'Crate shut: every warehouse, ' + items(shown().length) + ', Rp ' + fmt(sunk()) + '.';
        return;
      }
      var s = e.target.closest('.sbx .slot.has');
      if (s) { so.sq = +s.dataset.i; syncCrates(); soM.textContent = 'Picked a square: its three actions are under the box.'; }
    });
    document.querySelectorAll('[data-so]').forEach(function (k) { k.addEventListener('click', function () { so.opt = k.dataset.so; keys('data-so', so.opt); paintSO(); }); });
    document.querySelectorAll('[data-so-w]').forEach(function (k) { k.addEventListener('click', function () { so.hp = k.dataset.soW === 'hp'; document.getElementById('soF').classList.toggle('phone', so.hp); keys('data-so-w', k.dataset.soW); paintSO(); }); });
    paintSO();
    document.getElementById('soRec').innerHTML = '<b>Your pick: B, in box A.</b> A crate opens its warehouse\'s box inside the tape rim; press a square and its three actions open under the box. The cost you took: two presses per damaged item (the crate, then the square).';
  })();
</script>
