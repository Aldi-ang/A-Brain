/**
 * LANCELOT — pembukuan tembakau 2026
 *
 * Two tables hold everything. Everything else is a window, and windows are
 * never typed into.
 *
 *   NOTA — one nota      ITEM — one gulungan
 *
 * ONE-TIME SETUP, run in this order from the function dropdown:
 *   1. lancelotSelfCheck   must say SEMUA BENAR
 *   2. pasangSheet         builds NOTA, ITEM, masters, KOREKSI, LOG
 *   3. bersihkanTabLama    deletes KULAK / LIHAT * leftovers
 *   4. migrasiDataLama     brings MITA, YOHAN, PAK MUL in (3 notas)
 *   5. buatSemuaTampilan   COMPILE, IN-OUT, RINGKASAN, DASHBOARD, NOTA CETAK
 *   6. cekKualitas         MASALAH should be empty
 *   7. nyalakanOtomatis    inbox watcher, nightly check, weekly backup, edit log
 *
 * MITA, YOHAN, PAK MUL, C are only ever READ. Never written to.
 */

var SPREADSHEET_ID = '1qBbfEsuYQu0CWMGzzYES2xKCn0PMVseG_CodZ0QUPAQ';

var FOLDER_INBOX = 'Lancelot-Inbox', FOLDER_SELESAI = 'Lancelot-Selesai',
    FOLDER_GAGAL = 'Lancelot-Gagal', FOLDER_BACKUP = 'Lancelot-Backup';
var CEK_TIAP_MENIT = 5;

var T_NOTA = 'NOTA', T_ITEM = 'ITEM', T_LOG = 'LOG', T_KOREKSI = 'KOREKSI';
var TAB_LAMA = ['MITA', 'YOHAN', 'PAK MUL', 'C'];          // read-only, sacred
var TAB_BUANG = ['KULAK', 'LIHAT MITA', 'LIHAT YOHAN', 'LIHAT PAK MUL'];

var H_NOTA = [
  'NO NOTA', 'TANGGAL', 'JENIS NOTA', 'JENIS BARANG', 'AGEN', 'PABRIK',
  'CARA TARA', 'NILAI TARA', 'ONGKOS / GULUNG',
  'JUMLAH GULUNG', 'TOTAL BRUTO', 'TOTAL NETTO', 'TOTAL JUMLAH', 'TOTAL ONGKOS', 'DIBAYAR',
  'IN', 'OUT', 'LUNAS', 'CARA BAYAR', 'DIBAYAR KE', 'TGL BAYAR', 'REF TRANSFER',
  'LINK NOTA', 'LINK BUKTI TRANSFER', 'CATATAN'
];
var H_ITEM = [
  'NO NOTA', 'NO', 'SERI', 'LABEL', 'PETANI', 'GRADE',
  'BRUTO', 'TARA', 'NETTO', 'HARGA', 'JUMLAH', 'ONGKOS',
  'IN/OUT', 'NO NOTA JUAL', 'LABEL BARU', 'CATATAN'
];

var CN = {}, CI = {};
H_NOTA.forEach(function (h, i) { CN[h] = i + 1; });
H_ITEM.forEach(function (h, i) { CI[h] = i + 1; });

var MASTER = {
  'M_PETANI': ['KODE', 'NAMA', 'AGEN', 'KONTAK', 'REKENING', 'CATATAN'],
  'M_AGEN':   ['KODE', 'NAMA', 'REKENING', 'CARA KOMISI', 'CATATAN'],
  'M_PABRIK': ['KODE', 'NAMA', 'CARA POTONGAN', 'ONGKOS / GULUNG', 'CARA BAYAR', 'CATATAN'],
  'M_BARANG': ['JENIS BARANG', 'CATATAN']
};

var WARNA = {
  gelap: '#1c1c1c', kartu: '#f5f3ee', garis: '#d9d5cc',
  hijau: '#c8e6c9', merah: '#ffcdd2', kuning: '#ffe0b2',
  biru: '#e3ecf7', emas: '#8a6518', teks: '#15181d'
};

// ------------------------------------------------------------------- dasar

function ss_() { return SpreadsheetApp.openById(SPREADSHEET_ID); }

function lapor_(judul, pesan) {
  Logger.log(judul + ': ' + pesan);
  try { SpreadsheetApp.getUi().alert(judul, pesan, SpreadsheetApp.getUi().ButtonSet.OK); } catch (e) {}
}

function catat_(aksi, hasil, ket) {
  var sh = ss_().getSheetByName(T_LOG);
  if (sh) sh.appendRow([new Date(), aksi, hasil, ket]);
}

function huruf_(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; }
  return s;
}

function angka_(x) {
  if (x === undefined || x === null || x === '') return '';
  var n = Number(String(x).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? '' : n;
}

function tanggal_(s) {
  if (s instanceof Date) return s;
  var t = String(s).trim();
  var m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  var b = t.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (b) {
    var bulan = ['jan','feb','mar','apr','mei','jun','jul','agu','sep','okt','nov','des'];
    var i = bulan.indexOf(b[2].toLowerCase().slice(0, 3));
    if (i < 0) i = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
      .indexOf(b[2].toLowerCase().slice(0, 3));
    if (i >= 0) return new Date(+b[3], i, +b[1]);
  }
  var d = new Date(t);
  return isNaN(d.getTime()) ? new Date() : d;
}

function baris_(sh, minimal) {
  if (sh.getMaxRows() < minimal) sh.insertRowsAfter(sh.getMaxRows(), minimal - sh.getMaxRows());
  return sh.getMaxRows() - 1;
}

function header_(sh, lebar, baris) {
  baris = baris || 1;
  sh.getRange(baris, 1, 1, lebar).setFontWeight('bold').setFontColor('#ffffff')
    .setBackground(WARNA.gelap).setHorizontalAlignment('center').setWrap(true);
  sh.setFrozenRows(baris);
}

/** 'persen' -> bruto x nilai (RA 7 pakai 10%) · 'kg' -> nilai, rata (MT 1: 1kg, ALR 1: 2kg) */
function hitungTara_(bruto, cara, nilai) {
  bruto = Number(bruto) || 0; nilai = Number(nilai) || 0;
  return String(cara).toLowerCase() === 'kg' ? nilai : bruto * nilai;
}

// ------------------------------------------------------------------ pasang

function pasangSheet() {
  var ss = ss_();

  var log = ss.getSheetByName(T_LOG) || ss.insertSheet(T_LOG);
  log.getRange(1, 1, 1, 4).setValues([['WAKTU', 'AKSI', 'HASIL', 'KETERANGAN']]);
  header_(log, 4); log.setColumnWidth(1, 150); log.setColumnWidth(4, 480);

  var kor = ss.getSheetByName(T_KOREKSI) || ss.insertSheet(T_KOREKSI);
  kor.getRange(1, 1, 1, 6).setValues([['WAKTU', 'NO NOTA', 'APA YANG SALAH', 'SEHARUSNYA', 'SIAPA', 'CATATAN']]);
  header_(kor, 6);
  for (var kc = 1; kc <= 6; kc++) kor.setColumnWidth(kc, 190);

  var n = ss.getSheetByName(T_NOTA) || ss.insertSheet(T_NOTA);
  n.getRange(1, 1, 1, H_NOTA.length).setValues([H_NOTA]);
  header_(n, H_NOTA.length);
  var nr = baris_(n, 401);
  rapi_(n, nr, H_NOTA.length);
  fmt_(n, nr, CN['TANGGAL'], 'dd/mm/yyyy'); fmt_(n, nr, CN['TGL BAYAR'], 'dd/mm/yyyy');
  fmt_(n, nr, CN['TOTAL BRUTO'], '0.0'); fmt_(n, nr, CN['TOTAL NETTO'], '0.0');
  fmt_(n, nr, CN['NILAI TARA'], '0.###');
  ['TOTAL JUMLAH', 'TOTAL ONGKOS', 'DIBAYAR', 'ONGKOS / GULUNG'].forEach(function (h) {
    fmt_(n, nr, CN[h], '"Rp "#,##0');
  });
  pilih_(n, nr, CN['JENIS NOTA'], ['BELI PETANI', 'NOTA AGEN', 'JUAL PABRIK']);
  pilih_(n, nr, CN['CARA TARA'], ['persen', 'kg']);
  pilih_(n, nr, CN['LUNAS'], ['LUNAS', 'BELUM LUNAS']);
  pilih_(n, nr, CN['CARA BAYAR'], ['TRANSFER', 'CASH', 'BON']);

  var it = ss.getSheetByName(T_ITEM) || ss.insertSheet(T_ITEM);
  it.getRange(1, 1, 1, H_ITEM.length).setValues([H_ITEM]);
  header_(it, H_ITEM.length);
  var ir = baris_(it, 3001);
  rapi_(it, ir, H_ITEM.length);
  ['BRUTO', 'TARA', 'NETTO'].forEach(function (h) { fmt_(it, ir, CI[h], '0.0'); });
  ['HARGA', 'JUMLAH', 'ONGKOS'].forEach(function (h) { fmt_(it, ir, CI[h], '"Rp "#,##0'); });
  pilih_(it, ir, CI['IN/OUT'], ['IN', 'OUT']);

  warnaKolom_(n, nr, CN['LUNAS'], [['LUNAS', WARNA.hijau], ['BELUM LUNAS', WARNA.merah]]);
  warnaKolom_(it, ir, CI['IN/OUT'], [['IN', WARNA.hijau], ['OUT', WARNA.merah]]);

  Object.keys(MASTER).forEach(function (nama) {
    var m = ss.getSheetByName(nama) || ss.insertSheet(nama);
    m.getRange(1, 1, 1, MASTER[nama].length).setValues([MASTER[nama]]);
    header_(m, MASTER[nama].length);
    var mr = baris_(m, 201);
    m.getRange(1, 1, mr + 1, MASTER[nama].length).setFontSize(11);
    for (var c = 1; c <= MASTER[nama].length; c++) m.setColumnWidth(c, 165);
  });
  seed_('M_AGEN', [['AG1', 'MITA', '', '', ''], ['AG2', 'YOHAN', '', '', ''], ['AG3', 'PAK MUL', '', '', '']]);
  seed_('M_PETANI', [['PT1', 'SRI RAHAYU', 'PAK MUL', '', 'BRI 666301018474532', '']]);
  seed_('M_PABRIK', [['PB1', 'OM CK', '', '', '', '']]);
  seed_('M_BARANG', [['Janturan 2026', ''], ['Rajangan Boyolali 2026', ''],
                     ['Rajangan Panggil 2026', ''], ['Saput', ''], ['Non Gula', '']]);

  pasangValidasiMaster_();
  catat_('pasangSheet', 'OK', 'NOTA + ITEM + master siap');
  lapor_('Selesai', 'NOTA, ITEM, master, KOREKSI dan LOG siap.\n\n'
    + 'Nama agen, pabrik, petani dan jenis barang dipilih dari master, bukan diketik bebas.\n\n'
    + 'Tab MITA, YOHAN, PAK MUL, C tidak disentuh.');
}

/** CLIP, never wrap — a wrapped REF TRANSFER made rows five lines tall. */
function rapi_(sh, n, lebar) {
  sh.getRange(2, 1, n, lebar).setWrap(false).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  sh.setRowHeights(2, n, 21);
  sh.getRange(1, 1, n + 1, lebar).setFontSize(11)
    .setBorder(true, true, true, true, true, true, WARNA.garis, SpreadsheetApp.BorderStyle.SOLID);
  for (var c = 1; c <= lebar; c++) sh.setColumnWidth(c, 105);
  for (var b = 3; b <= n + 1; b += 2) sh.getRange(b, 1, 1, lebar).setBackground('#faf9f6');
}

/** clear() keeps merges, so a second run would throw on merge(). */
function bebaskan_(sh) {
  sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).breakApart();
}

function fmt_(sh, n, kol, pola) { sh.getRange(2, kol, n, 1).setNumberFormat(pola); }

function pilih_(sh, n, kol, opsi) {
  sh.getRange(2, kol, n, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(opsi, true).setAllowInvalid(false).build());
}

function warnaKolom_(sh, n, kol, pasangan) {
  var r = sh.getRange(2, kol, n, 1);
  var aturan = sh.getConditionalFormatRules();
  pasangan.forEach(function (p) {
    aturan.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(p[0]).setBackground(p[1]).setBold(true).setRanges([r]).build());
  });
  sh.setConditionalFormatRules(aturan);
}

function seed_(nama, baris) {
  var sh = ss_().getSheetByName(nama);
  if (sh.getLastRow() > 1) return;
  sh.getRange(2, 1, baris.length, baris[0].length).setValues(baris);
}

/** MITA vs MITHA typed freely become two agen each owning half the truth. */
function pasangValidasiMaster_() {
  var ss = ss_();
  function dari(sh, rng) {
    return SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName(sh).getRange(rng), true)
      .setAllowInvalid(true).build();          // warn, never block — a real nota beats a tidy list
  }
  var n = ss.getSheetByName(T_NOTA), it = ss.getSheetByName(T_ITEM);
  n.getRange(2, CN['AGEN'], n.getMaxRows() - 1, 1).setDataValidation(dari('M_AGEN', 'B2:B200'));
  n.getRange(2, CN['PABRIK'], n.getMaxRows() - 1, 1).setDataValidation(dari('M_PABRIK', 'B2:B200'));
  n.getRange(2, CN['JENIS BARANG'], n.getMaxRows() - 1, 1).setDataValidation(dari('M_BARANG', 'A2:A200'));
  it.getRange(2, CI['PETANI'], it.getMaxRows() - 1, 1).setDataValidation(dari('M_PETANI', 'B2:B500'));
}

function bersihkanTabLama() {
  var ss = ss_(), buang = [];
  TAB_BUANG.forEach(function (nm) {
    var sh = ss.getSheetByName(nm);
    if (sh) { ss.deleteSheet(sh); buang.push(nm); }
  });
  catat_('bersihkanTabLama', 'OK', buang.join(', ') || 'tidak ada');
  lapor_('Selesai', buang.length ? 'Dihapus: ' + buang.join(', ') : 'Tidak ada tab lama untuk dihapus.');
}

// ------------------------------------------------------------------ menulis

/**
 * One JSON = one whole nota with its gulungan.
 * { noNota, tanggal, jenisNota, jenisBarang, agen, pabrik, caraTara, nilaiTara,
 *   ongkosPerGulung, tambahan, lunas, caraBayar, dibayarKe, tglBayar,
 *   refTransfer, linkNota, linkTransfer, catatan,
 *   item:[{seri,label,petani,grade,bruto,harga,inOut,noNotaJual,labelBaru,catatan}] }
 */
function tulisNota_(d) {
  var ss = ss_(), shN = ss.getSheetByName(T_NOTA), shI = ss.getSheetByName(T_ITEM);
  if (!shN || !shI) throw new Error('Jalankan pasangSheet dulu.');

  var noNota = String(d.noNota || '').trim();
  if (!noNota) throw new Error('noNota wajib diisi.');
  if (cariNota_(noNota) > 0) throw new Error('Nota ' + noNota + ' sudah ada. Tidak ditimpa.');

  var cara = d.caraTara || 'persen';
  var nilai = d.nilaiTara === undefined ? 0.1 : Number(d.nilaiTara);
  var ongkos = Number(d.ongkosPerGulung) || 0;
  var items = d.item || [];

  var bT = 0, nT = 0, jT = 0, oT = 0, masuk = 0, keluar = 0, rows = [];

  items.forEach(function (t, i) {
    var out = String(t.inOut || 'IN').toUpperCase() === 'OUT';
    var bruto = Number(t.bruto) || 0;
    var tara = (t.tara !== undefined && t.tara !== '') ? Number(t.tara) : hitungTara_(bruto, cara, nilai);
    var netto = (t.netto !== undefined && t.netto !== '') ? Number(t.netto) : bruto - tara;
    var harga = Number(t.harga) || 0;
    var jumlah = out ? 0 : netto * harga;
    var ong = out ? 0 : ongkos;

    if (out) keluar++; else { bT += bruto; nT += netto; jT += jumlah; oT += ong; masuk++; }

    var r = [];
    r[CI['NO NOTA']] = noNota;      r[CI['NO']] = i + 1;
    r[CI['SERI']] = t.seri || '';   r[CI['LABEL']] = t.label === undefined ? '' : t.label;
    r[CI['PETANI']] = t.petani || d.petani || '';
    r[CI['GRADE']] = t.grade || '';
    r[CI['BRUTO']] = bruto;         r[CI['TARA']] = tara;      r[CI['NETTO']] = netto;
    r[CI['HARGA']] = out ? '' : harga;
    r[CI['JUMLAH']] = out ? 0 : jumlah;
    r[CI['ONGKOS']] = ong;
    r[CI['IN/OUT']] = out ? 'OUT' : 'IN';
    r[CI['NO NOTA JUAL']] = t.noNotaJual || '';
    r[CI['LABEL BARU']] = t.labelBaru || '';
    r[CI['CATATAN']] = t.catatan || '';
    var out2 = [];
    for (var c = 1; c <= H_ITEM.length; c++) out2.push(r[c] === undefined ? '' : r[c]);
    rows.push(out2);
  });

  // ---- duplicate guards. Nothing is written until both pass.
  if (!d.abaikanDuplikat) {
    var kembar = petaSidik_()[sidikNota_(tanggal_(d.tanggal), d.agen, items.length, bT, jT)];
    if (kembar) throw new Error(
      'NOTA KEMBAR. Nota ini sama persis dengan "' + kembar + '" — tanggal, agen, jumlah '
      + 'gulung, total bruto dan total uang semuanya sama. Kemungkinan besar nota yang sama '
      + 'dikirim dua kali.\nKalau memang dua nota berbeda, tambahkan "abaikanDuplikat": true.');

    var peta = petaSeri_(), bentrok = [], sendiri = {};
    items.forEach(function (t) {
      var k = kunciSeri_(t.seri, t.label);
      if (!k) return;
      if (sendiri[k]) bentrok.push('"' + k + '" ditulis dua kali di nota ini sendiri');
      sendiri[k] = 1;
      if (peta[k]) bentrok.push('"' + k + '" sudah pernah masuk di nota ' + peta[k].join(', '));
    });
    if (bentrok.length) throw new Error(
      'NOMOR SERI BENTROK:\n- ' + bentrok.join('\n- ')
      + '\nKalau nomor seri memang dipakai ulang dengan sengaja, tambahkan "abaikanDuplikat": true.');
  }

  // ITEM rows and the NOTA row are written together or not at all. A timeout
  // between them used to leave orphan gulungan that no retry could clean up.
  try {
  if (rows.length) {
    var awal = shI.getLastRow() + 1;
    if (awal + rows.length > shI.getMaxRows()) shI.insertRowsAfter(shI.getMaxRows(), rows.length + 300);
    shI.getRange(awal, 1, rows.length, H_ITEM.length).setValues(rows);
  }

  var v = [];
  v[CN['NO NOTA']] = noNota;                 v[CN['TANGGAL']] = tanggal_(d.tanggal);
  v[CN['JENIS NOTA']] = d.jenisNota || 'BELI PETANI';
  v[CN['JENIS BARANG']] = d.jenisBarang || '';
  v[CN['AGEN']] = d.agen || '';              v[CN['PABRIK']] = d.pabrik || '';
  v[CN['CARA TARA']] = cara;                 v[CN['NILAI TARA']] = nilai;
  v[CN['ONGKOS / GULUNG']] = ongkos;         v[CN['JUMLAH GULUNG']] = items.length;
  v[CN['TOTAL BRUTO']] = bT;                 v[CN['TOTAL NETTO']] = nT;
  v[CN['TOTAL JUMLAH']] = jT;                v[CN['TOTAL ONGKOS']] = oT;
  v[CN['DIBAYAR']] = jT - oT + (Number(d.tambahan) || 0);
  v[CN['IN']] = masuk;                       v[CN['OUT']] = keluar;
  v[CN['LUNAS']] = d.lunas || 'BELUM LUNAS'; v[CN['CARA BAYAR']] = d.caraBayar || '';
  v[CN['DIBAYAR KE']] = d.dibayarKe || '';
  v[CN['TGL BAYAR']] = d.tglBayar ? tanggal_(d.tglBayar) : '';
  v[CN['REF TRANSFER']] = d.refTransfer || '';
  v[CN['LINK NOTA']] = d.linkNota ? '=IMAGE("' + d.linkNota + '")' : '';
  v[CN['LINK BUKTI TRANSFER']] = d.linkTransfer ? '=IMAGE("' + d.linkTransfer + '")' : '';
  v[CN['CATATAN']] = d.catatan || '';

  var keluarN = [];
  for (var c2 = 1; c2 <= H_NOTA.length; c2++) keluarN.push(v[c2] === undefined ? '' : v[c2]);
  var br = shN.getLastRow() + 1;
  if (br > shN.getMaxRows()) shN.insertRowsAfter(shN.getMaxRows(), 100);
  shN.getRange(br, 1, 1, H_NOTA.length).setValues([keluarN]);
  } catch (e) {
    hapusNotaSatu_(noNota);          // roll back, so a retry starts clean
    throw e;
  }

  return { nota: noNota, item: items.length, in: masuk, out: keluar };
}

/**
 * DUPLICATE DETECTION — two different mistakes, two different checks.
 *
 * 1. The same nota photographed and sent twice. The nota number won't help:
 *    it is identical, so a NO NOTA check catches it only if the number was
 *    typed the same both times. The fingerprint catches it either way —
 *    same date, same agen, same gulungan count, same bruto, same money.
 *
 * 2. An agen reusing a nomor seri that was already submitted on another nota.
 *    Scoped to buy-side notas only: a gulungan legitimately appears again on
 *    a JUAL PABRIK nota, because it is the same tobacco being sold.
 */
function kunciSeri_(seri, label) {
  var s = String(seri === undefined || seri === null ? '' : seri).trim().toUpperCase();
  var l = String(label === undefined || label === null ? '' : label).trim().toUpperCase();
  return (s + ' ' + l).trim();
}

function sidikNota_(tanggal, agen, gulung, bruto, jumlah) {
  var t = (tanggal instanceof Date)
    ? Utilities.formatDate(tanggal, ss_().getSpreadsheetTimeZone(), 'yyyy-MM-dd')
    : String(tanggal);
  return [t, String(agen || '').trim().toUpperCase(), Number(gulung) || 0,
          Math.round((Number(bruto) || 0) * 10) / 10,
          Math.round(Number(jumlah) || 0)].join('|');
}

function petaSidik_() {
  var sh = ss_().getSheetByName(T_NOTA), n = sh.getLastRow() - 1, peta = {};
  if (n < 1) return peta;
  sh.getRange(2, 1, n, H_NOTA.length).getValues().forEach(function (r) {
    var no = String(r[CN['NO NOTA'] - 1]).trim();
    if (!no) return;
    var s = sidikNota_(r[CN['TANGGAL'] - 1], r[CN['AGEN'] - 1], r[CN['JUMLAH GULUNG'] - 1],
                       r[CN['TOTAL BRUTO'] - 1], r[CN['TOTAL JUMLAH'] - 1]);
    if (!peta[s]) peta[s] = no;
  });
  return peta;
}

function petaSeri_() {
  var ss = ss_(), shN = ss.getSheetByName(T_NOTA), shI = ss.getSheetByName(T_ITEM);
  var peta = {}, jenis = {};
  var nn = shN.getLastRow() - 1;
  if (nn > 0) shN.getRange(2, 1, nn, H_NOTA.length).getValues().forEach(function (r) {
    jenis[String(r[CN['NO NOTA'] - 1]).trim()] = String(r[CN['JENIS NOTA'] - 1]).trim();
  });
  var ni = shI.getLastRow() - 1;
  if (ni < 1) return peta;
  shI.getRange(2, 1, ni, H_ITEM.length).getValues().forEach(function (r) {
    var no = String(r[CI['NO NOTA'] - 1]).trim();
    if (jenis[no] === 'JUAL PABRIK') return;     // same gulungan, sold — not a clash
    var k = kunciSeri_(r[CI['SERI'] - 1], r[CI['LABEL'] - 1]);
    if (!k) return;
    if (!peta[k]) peta[k] = [];
    if (peta[k].indexOf(no) < 0) peta[k].push(no);
  });
  return peta;
}

/** Scans everything already in the sheet, not just what is arriving. */
function cekDuplikat() {
  var temuan = [];
  var sh = ss_().getSheetByName(T_NOTA), n = sh.getLastRow() - 1;
  if (n > 0) {
    var lihat = {};
    sh.getRange(2, 1, n, H_NOTA.length).getValues().forEach(function (r, i) {
      var no = String(r[CN['NO NOTA'] - 1]).trim();
      if (!no) return;
      var s = sidikNota_(r[CN['TANGGAL'] - 1], r[CN['AGEN'] - 1], r[CN['JUMLAH GULUNG'] - 1],
                         r[CN['TOTAL BRUTO'] - 1], r[CN['TOTAL JUMLAH'] - 1]);
      if (lihat[s]) temuan.push(['BERAT', 'NOTA baris ' + (i + 2),
        'nota "' + no + '" isinya sama persis dengan "' + lihat[s] + '" — kemungkinan dobel']);
      else lihat[s] = no;
    });
  }
  var peta = petaSeri_();
  Object.keys(peta).forEach(function (k) {
    if (peta[k].length > 1)
      temuan.push(['BERAT', 'seri "' + k + '"',
        'nomor seri yang sama dipakai di ' + peta[k].length + ' nota: ' + peta[k].join(', ')]);
  });
  return temuan;
}

function cariNota_(noNota) {
  var sh = ss_().getSheetByName(T_NOTA);
  var n = sh.getLastRow() - 1;
  if (n < 1) return 0;
  var v = sh.getRange(2, CN['NO NOTA'], n, 1).getValues();
  for (var i = 0; i < v.length; i++) if (String(v[i][0]).trim() === noNota) return i + 2;
  return 0;
}

/** Deletes every row belonging to one nota. Used to roll a failed write back. */
function hapusNotaSatu_(noNota) {
  var key = String(noNota).trim();
  if (!key) return;
  var ss = ss_();
  [[ss.getSheetByName(T_ITEM), CI['NO NOTA']], [ss.getSheetByName(T_NOTA), CN['NO NOTA']]]
    .forEach(function (x) {
      var sh = x[0], kol = x[1];
      if (!sh) return;
      var n = sh.getLastRow() - 1;
      if (n < 1) return;
      var v = sh.getRange(2, kol, n, 1).getValues();
      for (var i = v.length - 1; i >= 0; i--) if (String(v[i][0]).trim() === key) sh.deleteRow(i + 2);
    });
}

/**
 * One file = one transaction. If nota 3 of 5 fails, notas 1 and 2 are removed
 * again, so the file can simply be retried instead of half-applying.
 */
function tulisDariJson_(teks) {
  var data = JSON.parse(teks);
  if (!Array.isArray(data)) data = [data];
  var ditulis = [];
  try {
    data.forEach(function (d) { tulisNota_(d); ditulis.push(d.noNota); });
  } catch (e) {
    ditulis.forEach(hapusNotaSatu_);
    throw e;
  }
  return data.length;
}

/** Never edit a mistake away. Write the correction, keep the history. */
function koreksiNota(noNota, apaYangSalah, seharusnya, catatan) {
  var sh = ss_().getSheetByName(T_KOREKSI);
  sh.appendRow([new Date(), noNota || '', apaYangSalah || '', seharusnya || '',
                Session.getActiveUser().getEmail() || 'tidak diketahui', catatan || '']);
  catat_('koreksiNota', 'OK', noNota + ' — ' + apaYangSalah);
}

// -------------------------------------------------------------- inbox Drive

/**
 * Errors that will NEVER succeed however often we retry. Everything else —
 * timeouts, "server error occurred", quota blips — is transient, and a
 * transient error must not throw a real nota away.
 */
var GAGAL_PERMANEN = /sudah ada|KEMBAR|BENTROK|wajib diisi|pasangSheet dulu|JSON|Unexpected token|Unexpected end/i;
var MAKS_COBA = 6;                      // 6 x 5 menit = 30 menit mencoba lagi

function coba_(id, tambah) {
  var pr = PropertiesService.getScriptProperties(), k = 'coba_' + id;
  var n = Number(pr.getProperty(k) || 0);
  if (tambah) { n++; pr.setProperty(k, String(n)); }
  return n;
}
function lupakanCoba_(id) { PropertiesService.getScriptProperties().deleteProperty('coba_' + id); }

function cekInbox() {
  var masuk = folder_(FOLDER_INBOX), selesai = folder_(FOLDER_SELESAI), gagal = folder_(FOLDER_GAGAL);
  var files = masuk.getFiles(), ok = 0, err = 0, ulang = 0;
  while (files.hasNext()) {
    var f = files.next();
    if (f.getName().slice(-5).toLowerCase() !== '.json') continue;
    try {
      ok += tulisDariJson_(f.getBlob().getDataAsString());
      f.moveTo(selesai); lupakanCoba_(f.getId());
      catat_('cekInbox', 'OK', f.getName());
    } catch (e) {
      var pesan = String((e && e.message) || e);
      if (GAGAL_PERMANEN.test(pesan)) {
        f.moveTo(gagal); lupakanCoba_(f.getId()); err++;
        catat_('cekInbox', 'GAGAL', f.getName() + ' - ' + pesan);
      } else {
        var n = coba_(f.getId(), true);
        if (n >= MAKS_COBA) {
          f.moveTo(gagal); lupakanCoba_(f.getId()); err++;
          catat_('cekInbox', 'GAGAL', f.getName() + ' - gagal ' + n + 'x berturut: ' + pesan);
        } else {
          ulang++;                      // stays in the inbox; the next run tries again
          catat_('cekInbox', 'ULANG', f.getName() + ' - percobaan ' + n + '/' + MAKS_COBA + ': ' + pesan);
        }
      }
    }
  }
  return { masuk: ok, gagal: err, ulang: ulang };
}

function folder_(nama) {
  var it = DriveApp.getFoldersByName(nama);
  return it.hasNext() ? it.next() : DriveApp.createFolder(nama);
}

/** One bad delete loses the ledger, so this runs whether anyone remembers it or not. */
function backupMingguan() {
  var f = folder_(FOLDER_BACKUP);
  var tz = ss_().getSpreadsheetTimeZone();
  var nama = 'TEMBAKAU 2026 — backup ' + Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HHmm');
  DriveApp.getFileById(SPREADSHEET_ID).makeCopy(nama, f);
  catat_('backupMingguan', 'OK', nama);
  return nama;
}

/** LOG records what Lancelot did. This records what a PERSON changed by hand. */
function catatEdit(e) {
  try {
    if (!e || !e.range) return;
    var nama = e.range.getSheet().getName();
    if (nama !== T_NOTA && nama !== T_ITEM) return;
    var sel = e.range.getNumRows() * e.range.getNumColumns();
    // e.oldValue exists only for a single-cell edit. On a paste it is undefined,
    // so printing "(kosong)" would be a lie about what was overwritten.
    var lama = sel > 1 ? '(banyak sel - nilai lama tidak terekam)'
      : ((e.oldValue === undefined || e.oldValue === null) ? '(kosong)' : e.oldValue);
    var baru = sel > 1 ? '(' + sel + ' sel diubah)' : (e.range.getDisplayValue() || '(kosong)');
    catat_('edit manual', sel > 1 ? 'AWAS' : 'INFO',
      nama + '!' + e.range.getA1Notation() + ' : "' + lama + '" -> "' + baru + '"');
  } catch (err) { /* an edit must never fail because logging failed */ }
}

/**
 * onEdit does NOT fire when a row is deleted - that is onChange/REMOVE_ROW.
 * Deleting a nota and its gulungan together used to leave no trace anywhere.
 */
function catatUbah(e) {
  try {
    var jenis = (e && e.changeType) ? String(e.changeType) : 'TIDAK DIKETAHUI';
    var nama = '';
    try { nama = e.source.getActiveSheet().getName(); } catch (x) {}
    var bahaya = (jenis.indexOf('REMOVE') === 0);
    if (!bahaya && jenis !== 'INSERT_ROW') return;
    catat_('ubah struktur', bahaya ? 'AWAS' : 'INFO', jenis + ' di tab ' + (nama || '?'));
  } catch (err) { /* never let logging break a change */ }
}

function nyalakanOtomatis() {
  matikanSemua_();
  ScriptApp.newTrigger('cekInbox').timeBased().everyMinutes(CEK_TIAP_MENIT).create();
  ScriptApp.newTrigger('cekKualitas').timeBased().atHour(2).everyDays(1).create();
  ScriptApp.newTrigger('backupMingguan').timeBased().onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(1).create();
  ScriptApp.newTrigger('catatEdit').forSpreadsheet(SPREADSHEET_ID).onEdit().create();
  ScriptApp.newTrigger('catatUbah').forSpreadsheet(SPREADSHEET_ID).onChange().create();
  [FOLDER_INBOX, FOLDER_SELESAI, FOLDER_GAGAL, FOLDER_BACKUP].forEach(folder_);
  catat_('nyalakanOtomatis', 'OK', 'inbox 5 menit, cek 02:00, backup Minggu 01:00, log edit');
  lapor_('Otomatis nyala',
    '📥 Inbox dicek tiap ' + CEK_TIAP_MENIT + ' menit\n'
    + '🔍 Cek kualitas tiap malam jam 2\n'
    + '💾 Backup tiap Minggu jam 1\n'
    + '✏️ Semua edit manual di NOTA & ITEM dicatat di LOG\n\nPC boleh mati.');
}

function matikanSemua_() {
  var t = ScriptApp.getProjectTriggers();
  t.forEach(function (x) { ScriptApp.deleteTrigger(x); });
  return t.length;
}

/**
 * This deletes ALL automation, not only the inbox - the nightly check, the
 * weekly backup and the edit log go with it. Silence here once meant the
 * backup could be off for weeks with nothing to notice.
 */
function matikanOtomatis() {
  var n = matikanSemua_();
  catat_('matikanOtomatis', 'AWAS', n + ' trigger dihapus - semua otomatis mati');
  lapor_('OTOMATIS MATI',
    n + ' trigger dihapus. Yang berhenti SEMUA:\n\n'
    + 'Inbox tidak masuk lagi\n'
    + 'Cek kualitas berhenti\n'
    + 'BACKUP MINGGUAN BERHENTI\n'
    + 'Edit manual tidak dicatat lagi\n\n'
    + 'Jalankan nyalakanOtomatis untuk menghidupkan lagi.');
  return n;
}

// ------------------------------------------------------------------ migrasi

/**
 * Reads a hand-made tab BY HEADER NAME, never by column position.
 * MITA has 9 columns; YOHAN has 11 because JENIS BARANG and GRADE were added
 * later. Position-based code read "SAPUT" as a weight and wrote four gulungan
 * of 0 kg. cekKualitas caught it, but it should never have been written.
 */
function petaKolom_(sh) {
  var lebar = Math.max(sh.getLastColumn(), 1);
  for (var r = 1; r <= Math.min(6, sh.getLastRow()); r++) {
    var baris = sh.getRange(r, 1, 1, lebar).getValues()[0];
    if (!baris.some(function (c) { return String(c).trim().toUpperCase() === 'BRUTO'; })) continue;
    var peta = {};
    baris.forEach(function (c, i) { var k = String(c).trim().toUpperCase(); if (k) peta[k] = i; });
    return { baris: r, peta: peta, lebar: lebar };
  }
  return null;
}

function cariSetelahLabel_(sh, lebar, label) {
  var baris = sh.getRange(1, 1, 1, lebar).getValues()[0];
  for (var i = 0; i < baris.length; i++) {
    if (String(baris[i]).toUpperCase().indexOf(label) >= 0) {
      for (var j = i + 1; j < baris.length; j++) {
        if (baris[j] instanceof Date) return baris[j];
        var v = String(baris[j]).trim();
        if (v && v !== ':') return v;
      }
    }
  }
  return '';
}

function migrasiLama_(nama) {
  var sh = ss_().getSheetByName(nama);
  if (!sh) return 0;
  if (cariNota_(nama) > 0) return 0;

  var h = petaKolom_(sh);
  if (!h) { catat_('migrasiLama', 'GAGAL', nama + ': baris header tidak ketemu'); return 0; }
  var p = h.peta;
  var kol = function (b, nm) { return p[nm] === undefined ? '' : b[p[nm]]; };

  var tgl = cariSetelahLabel_(sh, h.lebar, 'TANGGAL');
  var agen = cariSetelahLabel_(sh, h.lebar, 'PETANI') || nama;
  var item = [], tBruto = 0, tTara = 0, tNetto = 0, ongkos = 0, harga = 0, barang = '';

  for (var r = h.baris + 1; r <= sh.getLastRow(); r++) {
    var v = sh.getRange(r, 1, 1, h.lebar).getValues()[0];
    var no = kol(v, 'NO');
    var bruto = Number(kol(v, 'BRUTO')) || 0;
    if (no === '' || no === null) {                       // subtotal row
      if (bruto) {
        tBruto = bruto;
        tNetto = Number(kol(v, 'NETTO')) || 0;
        tTara = Number(kol(v, 'TARA')) || Number(kol(v, 'TARA (10%)')) || 0;
      }
      continue;
    }
    harga = Number(kol(v, 'HARGA')) || harga;
    ongkos = Number(kol(v, 'ONGKOS')) || ongkos;
    barang = String(kol(v, 'JENIS BARANG') || barang);
    item.push({ seri: kol(v, 'SERI'), label: kol(v, 'NO GUDANG'), petani: '',
                grade: kol(v, 'GRADE'), bruto: bruto, harga: harga, inOut: 'IN' });
  }
  if (!item.length) return 0;

  // The old sheets weighed the pile, not each gulungan — so spread the real
  // total tara evenly rather than inventing a percentage.
  var taraPer = (tTara && item.length) ? tTara / item.length : 0;
  item.forEach(function (t) { t.tara = taraPer; t.netto = t.bruto - taraPer; });

  tulisNota_({
    noNota: nama, tanggal: tgl, jenisNota: 'BELI PETANI', agen: agen, jenisBarang: barang,
    caraTara: 'kg', nilaiTara: taraPer, ongkosPerGulung: ongkos, lunas: 'BELUM LUNAS', item: item,
    catatan: 'dari tab ' + nama + ' — total asli: bruto ' + tBruto + ', netto ' + tNetto + ', tara ' + tTara
  });
  return 1;
}

/** PAK MUL: one row whose BERAT RINCIAN lists four gulungan by petani seri. */
function migrasiPakMul_() {
  var sh = ss_().getSheetByName('PAK MUL');
  if (!sh || sh.getLastRow() < 3) return 0;
  if (cariNota_('PAK MUL') > 0) return 0;

  var v = sh.getRange(3, 1, 1, 13).getValues()[0];
  var bagian = String(v[2]).match(/([A-Za-z]+\d*)\s+(\d+(?:\.\d+)?)/g) || [];
  if (!bagian.length) return 0;

  var harga = Number(v[6]) || 0;
  var item = bagian.map(function (b) {
    var m = b.match(/([A-Za-z]+\d*)\s+(\d+(?:\.\d+)?)/);
    return { seri: m[1], petani: 'SRI RAHAYU', bruto: Number(m[2]), harga: harga, inOut: 'IN' };
  });

  tulisNota_({
    noNota: 'PAK MUL', tanggal: v[1], jenisNota: 'BELI PETANI', agen: 'PAK MUL',
    caraTara: 'persen', nilaiTara: 0.1, ongkosPerGulung: 0, tambahan: Number(v[7]) || 0,
    lunas: String(v[10] || 'BELUM LUNAS'), caraBayar: 'TRANSFER', dibayarKe: 'SRI RAHAYU',
    tglBayar: v[1], refTransfer: String(v[9] || ''), item: item,
    catatan: 'dari tab PAK MUL — 4 gulungan dipecah, tambahan contoh tbk Rp ' + (Number(v[7]) || 0)
  });
  return 1;
}

function migrasiDataLama() {
  if (!ss_().getSheetByName(T_NOTA)) throw new Error('Jalankan pasangSheet dulu.');
  var n = migrasiLama_('MITA') + migrasiLama_('YOHAN') + migrasiPakMul_();
  catat_('migrasiDataLama', 'OK', n + ' nota');
  lapor_('Selesai', n + ' nota masuk (MITA, YOHAN, PAK MUL).\n\nTab lama tidak berubah.');
}

function hapusMigrasi() {
  var ss = ss_(), target = { 'MITA': 1, 'YOHAN': 1, 'PAK MUL': 1 };
  function hapus(sh, kol) {
    var n = sh.getLastRow() - 1; if (n < 1) return 0;
    var v = sh.getRange(2, kol, n, 1).getValues(), buang = 0;
    for (var i = v.length - 1; i >= 0; i--) if (target[String(v[i][0]).trim()]) { sh.deleteRow(i + 2); buang++; }
    return buang;
  }
  var bi = hapus(ss.getSheetByName(T_ITEM), CI['NO NOTA']);
  var bn = hapus(ss.getSheetByName(T_NOTA), CN['NO NOTA']);
  catat_('hapusMigrasi', 'OK', bn + ' nota, ' + bi + ' gulungan');
  lapor_('Selesai', bn + ' nota dan ' + bi + ' gulungan dihapus.');
}

// ----------------------------------------------------------------- tampilan

function buatSemuaTampilan() {
  buatTampilan(); buatDashboard(); buatNotaCetak();
  lapor_('Selesai', '📊 COMPILE, IN-OUT, RINGKASAN, DASHBOARD dan NOTA CETAK dibuat.\n\n'
    + 'Semua otomatis dari NOTA + ITEM. Jangan diketik manual.');
}

function buatTampilan() {
  var N = "'" + T_NOTA + "'!A2:" + huruf_(H_NOTA.length);
  var I = "'" + T_ITEM + "'!A2:" + huruf_(H_ITEM.length);
  var n = function (h) { return huruf_(CN[h]); };
  var i = function (h) { return huruf_(CI[h]); };

  tampil_('COMPILE', '📋 COMPILE — semua nota per tanggal',
    '=QUERY(' + N + ',"select ' + [n('TANGGAL'), n('NO NOTA'), n('JENIS NOTA'), n('JENIS BARANG'),
      n('AGEN'), n('PABRIK'), n('JUMLAH GULUNG'), n('IN'), n('OUT'), n('TOTAL BRUTO'),
      n('TOTAL NETTO'), n('TOTAL JUMLAH'), n('DIBAYAR'), n('LUNAS')].join(',')
    + ' where ' + n('NO NOTA') + ' is not null order by ' + n('TANGGAL') + ' desc",0)', 14);

  tampil_('IN-OUT', '✅ IN / ❌ OUT — semua gulungan',
    '=QUERY(' + I + ',"select ' + [i('NO NOTA'), i('NO'), i('SERI'), i('LABEL'), i('PETANI'),
      i('GRADE'), i('BRUTO'), i('NETTO'), i('IN/OUT'), i('NO NOTA JUAL'), i('LABEL BARU')].join(',')
    + ' where ' + i('NO NOTA') + ' is not null order by ' + i('NO NOTA') + ',' + i('NO') + '",0)', 11);

  tampil_('RINGKASAN', '👥 RINGKASAN per agen',
    '=QUERY(' + N + ',"select ' + n('AGEN')
    + ', count(' + n('NO NOTA') + '), sum(' + n('JUMLAH GULUNG') + '), sum(' + n('OUT') + ')'
    + ', sum(' + n('TOTAL BRUTO') + '), sum(' + n('TOTAL NETTO') + '), sum(' + n('DIBAYAR') + ')'
    + ' where ' + n('AGEN') + " is not null group by " + n('AGEN')
    + " label " + n('AGEN') + " 'AGEN', count(" + n('NO NOTA') + ") 'NOTA'"
    + ', sum(' + n('JUMLAH GULUNG') + ") 'GULUNG', sum(" + n('OUT') + ") 'OUT'"
    + ', sum(' + n('TOTAL BRUTO') + ") 'BRUTO', sum(" + n('TOTAL NETTO') + ") 'NETTO'"
    + ', sum(' + n('DIBAYAR') + ") 'DIBAYAR'" + '",0)', 7);

  var r = ss_().getSheetByName('IN-OUT');
  var rng = r.getRange(3, 9, 500, 1);
  r.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('IN')
      .setBackground(WARNA.hijau).setBold(true).setRanges([rng]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('OUT')
      .setBackground(WARNA.merah).setBold(true).setRanges([rng]).build()
  ]);
  catat_('buatTampilan', 'OK', 'COMPILE, IN-OUT, RINGKASAN');
}

function tampil_(nama, judul, rumus, lebar) {
  var ss = ss_();
  var sh = ss.getSheetByName(nama) || ss.insertSheet(nama);
  sh.clear();
  bebaskan_(sh);
  sh.setConditionalFormatRules([]);
  sh.setHiddenGridlines(true);
  sh.getRange(1, 1, 1, lebar).merge().setValue(judul)
    .setFontSize(15).setFontWeight('bold').setFontColor('#ffffff')
    .setBackground(WARNA.gelap).setVerticalAlignment('middle');
  sh.setRowHeight(1, 38);
  sh.getRange('A2').setFormula(rumus);
  sh.getRange(2, 1, 1, lebar).setFontWeight('bold').setBackground(WARNA.kartu)
    .setBorder(null, null, true, null, null, null, WARNA.gelap, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sh.setFrozenRows(2);
  for (var c = 1; c <= lebar; c++) sh.setColumnWidth(c, 118);
  sh.getRange(3, 1, 500, lebar).setFontSize(11);
}

// ----------------------------------------------------------------- dashboard

/**
 * KPI cards are LIVE formulas driven by two dropdowns, so they answer the moment
 * you change the filter. The charts are drawn from a computed block, so they
 * refresh when you run buatDashboard.
 */
function buatDashboard() {
  var ss = ss_();
  var sh = ss.getSheetByName('DASHBOARD') || ss.insertSheet('DASHBOARD');
  sh.clear();
  bebaskan_(sh);
  sh.getCharts().forEach(function (c) { sh.removeChart(c); });
  sh.setHiddenGridlines(true);

  var N = "'" + T_NOTA + "'!";
  var n = function (h) { return N + huruf_(CN[h]) + '2:' + huruf_(CN[h]); };

  sh.getRange('A1:J1').merge().setValue('📒  LANCELOT — DASHBOARD TEMBAKAU 2026')
    .setFontSize(20).setFontWeight('bold').setFontColor('#ffffff')
    .setBackground(WARNA.gelap).setVerticalAlignment('middle').setHorizontalAlignment('center');
  sh.setRowHeight(1, 52);

  sh.getRange('A3').setValue('👤 AGEN').setFontWeight('bold');
  sh.getRange('B3').setValue('SEMUA').setBackground(WARNA.biru).setFontWeight('bold')
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName('M_AGEN').getRange('B2:B200'), true)
      .setAllowInvalid(true).build());
  sh.getRange('D3').setValue('📅 PERIODE').setFontWeight('bold');
  sh.getRange('E3').setValue('SEMUA').setBackground(WARNA.biru).setFontWeight('bold')
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['SEMUA', '7 HARI', '30 HARI', '90 HARI'], true).build());
  sh.getRange('N3').setFormula('=IF($E$3="SEMUA",DATE(2000,1,1),TODAY()-VALUE(LEFT($E$3,LEN($E$3)-5)))');
  sh.getRange('N3').setNumberFormat('dd/mm/yyyy');
  sh.getRange('M3').setValue('batas tanggal').setFontSize(8).setFontColor('#999');

  var syarat = '(' + n('AGEN') + '=$B$3)+($B$3="SEMUA")>0)*(' + n('TANGGAL') + '>=$N$3)';
  function jum(jenis, kolom) {
    return '=SUMPRODUCT((' + n('JENIS NOTA') + '="' + jenis + '")*((' + syarat + ')*' + n(kolom) + ')';
  }
  function cacah(jenis, kolom) {
    return '=SUMPRODUCT((' + n('JENIS NOTA') + '="' + jenis + '")*((' + syarat + ')*' + n(kolom) + ')';
  }

  var kartu = [
    ['A5', '💰 MODAL BELI', jum('BELI PETANI', 'DIBAYAR'), '"Rp "#,##0'],
    ['C5', '📈 OMSET JUAL', jum('JUAL PABRIK', 'TOTAL JUMLAH'), '"Rp "#,##0'],
    ['E5', '🪙 CUAN', '=C6-A6', '"Rp "#,##0'],
    ['G5', '🧺 GULUNG', cacah('BELI PETANI', 'JUMLAH GULUNG'), '#,##0'],
    ['I5', '❌ OUT', cacah('BELI PETANI', 'OUT'), '#,##0']
  ];
  kartu.forEach(function (k) {
    var col = k[0].charAt(0);
    var judul = sh.getRange(col + '5:' + huruf_(sh.getRange(col + '5').getColumn() + 1) + '5');
    judul.merge().setValue(k[1]).setFontSize(10).setFontWeight('bold')
      .setFontColor('#555').setBackground(WARNA.kartu).setHorizontalAlignment('center');
    var nilai = sh.getRange(col + '6:' + huruf_(sh.getRange(col + '6').getColumn() + 1) + '6');
    nilai.merge().setFormula(k[2]).setNumberFormat(k[3])
      .setFontSize(16).setFontWeight('bold').setFontColor(WARNA.emas)
      .setBackground(WARNA.kartu).setHorizontalAlignment('center')
      .setBorder(null, null, true, null, null, null, WARNA.gelap, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  });
  sh.setRowHeight(5, 24); sh.setRowHeight(6, 40);

  // computed block for the charts
  var shN = ss.getSheetByName(T_NOTA);
  var nN = Math.max(shN.getLastRow() - 1, 0);
  var nota = nN ? shN.getRange(2, 1, nN, H_NOTA.length).getValues() : [];
  var tz = ss.getSpreadsheetTimeZone();
  var g = function (r, h) { return r[CN[h] - 1]; };

  var perBulan = {}, perAgen = {};
  nota.forEach(function (r) {
    var t = g(r, 'TANGGAL'); if (!(t instanceof Date)) return;
    var bln = Utilities.formatDate(t, tz, 'yyyy-MM');
    var jual = String(g(r, 'JENIS NOTA')) === 'JUAL PABRIK';
    var nilai = Number(jual ? g(r, 'TOTAL JUMLAH') : g(r, 'DIBAYAR')) || 0;
    if (!perBulan[bln]) perBulan[bln] = { beli: 0, jual: 0 };
    perBulan[bln][jual ? 'jual' : 'beli'] += nilai;
    var a = String(g(r, 'AGEN') || '—');
    if (!perAgen[a]) perAgen[a] = { netto: 0, gulung: 0, out: 0 };
    perAgen[a].netto += Number(g(r, 'TOTAL NETTO')) || 0;
    perAgen[a].gulung += Number(g(r, 'JUMLAH GULUNG')) || 0;
    perAgen[a].out += Number(g(r, 'OUT')) || 0;
  });

  sh.getRange('A9').setValue('📊 PER BULAN').setFontWeight('bold').setFontSize(12);
  sh.getRange('A10:C10').setValues([['BULAN', 'MODAL', 'OMSET']]);
  sh.getRange('A10:C10').setFontWeight('bold').setFontColor('#ffffff').setBackground(WARNA.gelap);
  var bulanKeys = Object.keys(perBulan).sort();
  var bulanRows = bulanKeys.map(function (k) { return [k, perBulan[k].beli, perBulan[k].jual]; });
  if (bulanRows.length) {
    sh.getRange(11, 1, bulanRows.length, 3).setValues(bulanRows);
    sh.getRange(11, 2, bulanRows.length, 2).setNumberFormat('"Rp "#,##0');
  }

  sh.getRange('E9').setValue('👥 PER AGEN').setFontWeight('bold').setFontSize(12);
  sh.getRange('E10:H10').setValues([['AGEN', 'GULUNG', 'OUT', 'NETTO (kg)']]);
  sh.getRange('E10:H10').setFontWeight('bold').setFontColor('#ffffff').setBackground(WARNA.gelap);
  var agenKeys = Object.keys(perAgen).sort();
  var agenRows = agenKeys.map(function (k) {
    return [k, perAgen[k].gulung, perAgen[k].out, perAgen[k].netto];
  });
  if (agenRows.length) {
    sh.getRange(11, 5, agenRows.length, 4).setValues(agenRows);
    sh.getRange(11, 8, agenRows.length, 1).setNumberFormat('0.0');
    sh.getRange(11, 6, agenRows.length, 1).setDataValidation(null);
    var skala = SpreadsheetApp.newConditionalFormatRule()
      .setGradientMaxpointWithValue('#2f6b4f', SpreadsheetApp.InterpolationType.MAX, '')
      .setGradientMinpointWithValue('#ffffff', SpreadsheetApp.InterpolationType.MIN, '')
      .setRanges([sh.getRange(11, 8, agenRows.length, 1)]).build();
    var rules = sh.getConditionalFormatRules(); rules.push(skala);
    var outRng = sh.getRange(11, 7, agenRows.length, 1);
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(0)
      .setBackground(WARNA.merah).setBold(true).setRanges([outRng]).build());
    sh.setConditionalFormatRules(rules);
  }

  if (bulanRows.length) {
    sh.insertChart(sh.newChart().asColumnChart()
      .addRange(sh.getRange(10, 1, bulanRows.length + 1, 3))
      .setPosition(Math.max(13, 11 + bulanRows.length + 1), 1, 0, 0)
      .setOption('title', 'Modal vs Omset per bulan')
      .setOption('colors', ['#9a3b33', '#2f6b4f'])
      .setOption('legend', { position: 'top' })
      .setOption('width', 520).setOption('height', 300).build());
  }
  if (agenRows.length) {
    sh.insertChart(sh.newChart().asColumnChart()
      .addRange(sh.getRange(10, 5, agenRows.length + 1, 2))
      .setPosition(Math.max(13, 11 + agenRows.length + 1), 5, 0, 0)
      .setOption('title', 'Gulungan per agen')
      .setOption('colors', ['#22417a'])
      .setOption('legend', { position: 'none' })
      .setOption('width', 460).setOption('height', 300).build());
  }

  for (var c = 1; c <= 10; c++) sh.setColumnWidth(c, 115);
  sh.hideColumns(13, 2);       // M:N hold the period cut-off date
  catat_('buatDashboard', 'OK', bulanKeys.length + ' bulan, ' + agenKeys.length + ' agen');
}

// ---------------------------------------------------------------- nota cetak

/**
 * Your side-by-side layout, live. Pick a nota in B3.
 * MODE "UNTUK AGEN" prints the agen side only — the pabrik block and the cuan
 * return blank, because the pabrik nota must never reach an agen.
 */
function buatNotaCetak() {
  var ss = ss_();
  var sh = ss.getSheetByName('NOTA CETAK') || ss.insertSheet('NOTA CETAK');
  sh.clear();
  bebaskan_(sh);
  sh.setHiddenGridlines(true);

  var I = "'" + T_ITEM + "'!", N = "'" + T_NOTA + "'!";
  var i = function (h) { return I + huruf_(CI[h]) + '2:' + huruf_(CI[h]); };
  var nCol = function (h) { return huruf_(CN[h]); };

  sh.getRange('A1:L1').merge().setValue('🧾  NOTA CETAK')
    .setFontSize(18).setFontWeight('bold').setFontColor('#ffffff')
    .setBackground(WARNA.gelap).setVerticalAlignment('middle').setHorizontalAlignment('center');
  sh.setRowHeight(1, 46);

  sh.getRange('A3').setValue('NO NOTA').setFontWeight('bold');
  sh.getRange('B3').setBackground(WARNA.biru).setFontWeight('bold').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInRange(ss.getSheetByName(T_NOTA).getRange('A2:A400'), true)
      .setAllowInvalid(true).build());
  sh.getRange('D3').setValue('MODE').setFontWeight('bold');
  sh.getRange('E3').setValue('UNTUK AGEN').setBackground(WARNA.kuning).setFontWeight('bold')
    .setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['UNTUK AGEN', 'UNTUK SAYA'], true).build());

  function ambil(h) {
    return '=IFERROR(VLOOKUP($B$3,' + N + 'A2:' + huruf_(H_NOTA.length) + ',' + CN[h] + ',FALSE),"")';
  }
  var info = [
    ['A5', 'TANGGAL', ambil('TANGGAL')], ['A6', 'AGEN', ambil('AGEN')],
    ['A7', 'JENIS BARANG', ambil('JENIS BARANG')], ['A8', 'CARA TARA', ambil('CARA TARA')],
    ['D5', 'JUMLAH GULUNG', ambil('JUMLAH GULUNG')], ['D6', 'IN', ambil('IN')],
    ['D7', 'OUT', ambil('OUT')], ['D8', 'LUNAS', ambil('LUNAS')]
  ];
  info.forEach(function (x) {
    sh.getRange(x[0]).setValue(x[1]).setFontWeight('bold').setBackground(WARNA.kartu);
    var kol = sh.getRange(x[0]).getColumn() + 1, brs = sh.getRange(x[0]).getRow();
    sh.getRange(brs, kol).setFormula(x[2]);
  });
  sh.getRange('B5').setNumberFormat('dd/mm/yyyy');

  sh.getRange('A10:F10').merge().setValue('📄 NOTA UNTUK AGEN')
    .setFontWeight('bold').setFontColor('#ffffff').setBackground('#2f6b4f')
    .setHorizontalAlignment('center');
  sh.getRange('A11:F11').setValues([['NO', 'SERI', 'LABEL', 'PETANI', 'BRUTO', 'NETTO']])
    .setFontWeight('bold').setBackground(WARNA.kartu);
  sh.getRange('A12').setFormula(
    '=IFERROR(FILTER({' + i('NO') + ',' + i('SERI') + ',' + i('LABEL') + ',' + i('PETANI')
    + ',' + i('BRUTO') + ',' + i('NETTO') + '},' + i('NO NOTA') + '=$B$3),"")');

  sh.getRange('H10:L10').merge().setValue('🏭 NOTA DARI PABRIK — RAHASIA')
    .setFontWeight('bold').setFontColor('#ffffff').setBackground('#9a3b33')
    .setHorizontalAlignment('center');
  sh.getRange('H11:L11').setValues([['NO', 'SERI', 'NETTO', 'HARGA', 'JUMLAH']])
    .setFontWeight('bold').setBackground(WARNA.kartu);
  sh.getRange('H12').setFormula(
    '=IF($E$3="UNTUK AGEN","",IFERROR(FILTER({' + i('NO') + ',' + i('SERI') + ',' + i('NETTO')
    + ',' + i('HARGA') + ',' + i('JUMLAH') + '},' + i('NO NOTA') + '=$B$3),""))');

  sh.getRange('H8').setValue('🪙 CUAN').setFontWeight('bold').setBackground(WARNA.kartu);
  sh.getRange('I8').setFormula('=IF($E$3="UNTUK AGEN","",IFERROR(VLOOKUP($B$3,' + N + 'A2:'
    + huruf_(H_NOTA.length) + ',' + CN['TOTAL JUMLAH'] + ',FALSE)-VLOOKUP($B$3,' + N + 'A2:'
    + huruf_(H_NOTA.length) + ',' + CN['DIBAYAR'] + ',FALSE),""))')
    .setNumberFormat('"Rp "#,##0').setFontWeight('bold').setFontColor(WARNA.emas);

  for (var c = 1; c <= 12; c++) sh.setColumnWidth(c, 100);
  sh.setFrozenRows(11);
  catat_('buatNotaCetak', 'OK', 'mode UNTUK AGEN / UNTUK SAYA');
}

// ------------------------------------------------------- kualitas data

/**
 * WATCHDOG. The three worst bugs found in the failure hunt were not wrong
 * arithmetic - they were the system stopping without telling anyone. So the
 * quality check now also checks that the system itself is still alive.
 */
function jagaOtomatis_() {
  var temuan = [];

  var punya = {};
  try {
    ScriptApp.getProjectTriggers().forEach(function (t) { punya[t.getHandlerFunction()] = true; });
  } catch (e) {
    return [['RINGAN', 'otomatis', 'tidak bisa membaca daftar trigger: ' + (e.message || e)]];
  }
  var wajib = [
    ['cekInbox', 'nota baru TIDAK akan masuk sendiri'],
    ['cekKualitas', 'cek kualitas malam TIDAK jalan'],
    ['backupMingguan', 'BACKUP MINGGUAN MATI - satu hapus salah bisa hilang semua'],
    ['catatEdit', 'edit manual TIDAK dicatat'],
    ['catatUbah', 'baris yang dihapus TIDAK dicatat']
  ];
  wajib.forEach(function (w) {
    if (!punya[w[0]]) temuan.push(['BERAT', 'otomatis: ' + w[0],
      w[1] + '. Jalankan nyalakanOtomatis.']);
  });

  // Nothing used to read this folder, so a rejected nota sat there forever.
  try {
    var it = DriveApp.getFoldersByName(FOLDER_GAGAL);
    if (it.hasNext()) {
      var f = it.next().getFiles(), n = 0, nama = [];
      while (f.hasNext() && n < 20) { var x = f.next(); n++; if (nama.length < 5) nama.push(x.getName()); }
      if (n > 0) temuan.push(['BERAT', 'folder ' + FOLDER_GAGAL,
        n + ' nota gagal masuk dan menunggu diperiksa: ' + nama.join(', ')
        + (n >= 20 ? ' (dan lainnya)' : '')]);
    }
  } catch (e) { /* Drive unreadable is not a data problem */ }

  // A backup that quietly stopped looks exactly like a backup that ran.
  try {
    var bf = DriveApp.getFoldersByName(FOLDER_BACKUP);
    if (bf.hasNext()) {
      var files = bf.next().getFiles(), terbaru = null;
      while (files.hasNext()) {
        var d = files.next().getDateCreated();
        if (!terbaru || d > terbaru) terbaru = d;
      }
      var hari = terbaru ? Math.floor((new Date() - terbaru) / 86400000) : 999;
      if (hari > 9) temuan.push(['BERAT', 'backup',
        terbaru ? ('backup terakhir ' + hari + ' hari lalu - seharusnya tiap Minggu')
                : 'belum pernah ada backup sama sekali']);
    }
  } catch (e) { /* ignore */ }

  return temuan;
}

function cekKualitas() {
  var ss = ss_(), shN = ss.getSheetByName(T_NOTA), shI = ss.getSheetByName(T_ITEM);
  if (!shN || !shI) throw new Error('Jalankan pasangSheet dulu.');

  var nN = Math.max(shN.getLastRow() - 1, 0), nI = Math.max(shI.getLastRow() - 1, 0);
  var nota = nN ? shN.getRange(2, 1, nN, H_NOTA.length).getValues() : [];
  var item = nI ? shI.getRange(2, 1, nI, H_ITEM.length).getValues() : [];
  var masalah = [];
  function lapor(berat, dimana, apa) { masalah.push([berat, dimana, apa]); }
  var g = function (r, h) { return r[CN[h] - 1]; }, gi = function (r, h) { return r[CI[h] - 1]; };

  var daftar = {}, ganda = {};
  nota.forEach(function (r, idx) {
    var no = String(g(r, 'NO NOTA')).trim(); if (!no) return;
    if (daftar[no] && !ganda[no]) { lapor('BERAT', 'NOTA baris ' + (idx + 2), 'NO NOTA ganda: ' + no); ganda[no] = 1; }
    daftar[no] = { baris: idx + 2, r: r, bruto: 0, jumlah: 0, n: 0 };
  });

  item.forEach(function (r, idx) {
    var no = String(gi(r, 'NO NOTA')).trim(), dimana = 'ITEM baris ' + (idx + 2);
    if (!no) { lapor('BERAT', dimana, 'gulungan tanpa NO NOTA'); return; }
    if (!daftar[no]) { lapor('BERAT', dimana, 'NO NOTA "' + no + '" tidak ada di tab NOTA'); return; }
    var out = String(gi(r, 'IN/OUT')).toUpperCase() === 'OUT';
    var bruto = Number(gi(r, 'BRUTO')) || 0, netto = Number(gi(r, 'NETTO')) || 0;
    var harga = Number(gi(r, 'HARGA')) || 0, jumlah = Number(gi(r, 'JUMLAH')) || 0;

    if (bruto <= 0) lapor('BERAT', dimana, 'BRUTO kosong atau nol');
    if (netto > bruto) lapor('BERAT', dimana, 'NETTO ' + netto + ' lebih besar dari BRUTO ' + bruto);
    if (out && jumlah > 0) lapor('BERAT', dimana, 'gulungan OUT tapi JUMLAH ' + jumlah);
    if (!out && harga <= 0) lapor('RINGAN', dimana, 'HARGA kosong pada gulungan IN');
    if (!out && Math.abs(netto * harga - jumlah) > 1)
      lapor('BERAT', dimana, 'JUMLAH salah: ' + netto + ' x ' + harga + ' = ' + (netto * harga) + ', ditulis ' + jumlah);
    var jual = String(gi(r, 'NO NOTA JUAL')).trim();
    if (jual && !daftar[jual]) lapor('RINGAN', dimana, 'NO NOTA JUAL "' + jual + '" belum ada');

    var d = daftar[no]; d.n++;
    if (!out) { d.bruto += bruto; d.jumlah += jumlah; }
  });

  Object.keys(daftar).forEach(function (no) {
    var d = daftar[no], r = d.r, dimana = 'NOTA baris ' + d.baris + ' (' + no + ')';
    if (d.n === 0) { lapor('BERAT', dimana, 'nota tanpa satu pun gulungan'); return; }
    if (Math.abs((Number(g(r, 'TOTAL BRUTO')) || 0) - d.bruto) > 0.05)
      lapor('BERAT', dimana, 'TOTAL BRUTO tidak sama dengan jumlah gulungan (' + d.bruto + ')');
    if (Math.abs((Number(g(r, 'TOTAL JUMLAH')) || 0) - d.jumlah) > 1)
      lapor('BERAT', dimana, 'TOTAL JUMLAH tidak sama dengan jumlah gulungan (' + d.jumlah + ')');
    if (String(g(r, 'LUNAS')).toUpperCase() === 'LUNAS') {
      if (!String(g(r, 'REF TRANSFER')).trim() && String(g(r, 'CARA BAYAR')).toUpperCase() === 'TRANSFER')
        lapor('RINGAN', dimana, 'LUNAS lewat TRANSFER tapi REF TRANSFER kosong');
      if (!String(g(r, 'LINK BUKTI TRANSFER')).trim())
        lapor('RINGAN', dimana, 'LUNAS tapi tidak ada LINK BUKTI TRANSFER');
    }
    if (!String(g(r, 'AGEN')).trim()) lapor('RINGAN', dimana, 'AGEN kosong');
  });

  cekDuplikat().forEach(function (t) { masalah.push(t); });
  jagaOtomatis_().forEach(function (t) { masalah.push(t); });

  var sh = ss.getSheetByName('MASALAH') || ss.insertSheet('MASALAH');
  sh.clear(); bebaskan_(sh); sh.setHiddenGridlines(true);
  sh.getRange('A1:C1').merge().setValue('🔍 MASALAH — hasil cek kualitas')
    .setFontSize(15).setFontWeight('bold').setFontColor('#ffffff').setBackground(WARNA.gelap);
  sh.setRowHeight(1, 36);
  sh.getRange(2, 1, 1, 3).setValues([['BERAT / RINGAN', 'DI MANA', 'APA MASALAHNYA']])
    .setFontWeight('bold').setBackground(WARNA.kartu);
  if (masalah.length) sh.getRange(3, 1, masalah.length, 3).setValues(masalah);
  else sh.getRange('A3').setValue('✅ Bersih. Tidak ada masalah.').setFontWeight('bold').setFontColor('#2f6b4f');
  sh.setColumnWidth(1, 130); sh.setColumnWidth(2, 210); sh.setColumnWidth(3, 640);
  sh.setFrozenRows(2);
  var rng = sh.getRange(3, 1, Math.max(masalah.length, 1), 1);
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('BERAT')
      .setBackground(WARNA.merah).setBold(true).setRanges([rng]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('RINGAN')
      .setBackground(WARNA.kuning).setRanges([rng]).build()
  ]);

  var berat = masalah.filter(function (m) { return m[0] === 'BERAT'; }).length;
  catat_('cekKualitas', berat ? 'GAGAL' : 'OK', masalah.length + ' temuan, ' + berat + ' berat');
  lapor_('Cek Kualitas', masalah.length
    ? '⚠️ ' + masalah.length + ' temuan (' + berat + ' BERAT). Lihat tab MASALAH.'
    : '✅ Bersih. Tidak ada masalah.');
  return masalah.length;
}

// ---------------------------------------------------------------- self-check

function lancelotSelfCheck() {
  var baris = [], semua = true;
  function cek(nama, dapat, harus) {
    var ok = Math.abs(dapat - harus) < 0.01;
    if (!ok) semua = false;
    baris.push((ok ? 'OK    ' : 'GAGAL ') + nama + ' = ' + dapat + (ok ? '' : '  (harus ' + harus + ')'));
  }

  cek('RA 7 gulungan 40kg netto', 40 - hitungTara_(40, 'persen', 0.1), 36);
  cek('RA 7 gulungan 73kg netto', 73 - hitungTara_(73, 'persen', 0.1), 65.7);
  cek('MT 1 tara flat 1kg', hitungTara_(34, 'kg', 1), 1);
  cek('ALR 1 gulungan 42kg netto', 42 - hitungTara_(42, 'kg', 2), 40);
  cek('ALR 1 gulungan 61kg netto', 61 - hitungTara_(61, 'kg', 2), 59);

  var pm = [58, 43, 55, 29], bruto = 0, netto = 0, total = 0;
  pm.forEach(function (b) { var t = hitungTara_(b, 'persen', 0.1); bruto += b; netto += b - t; total += (b - t) * 55000; });
  cek('PAK MUL bruto', bruto, 185);
  cek('PAK MUL netto', netto, 166.5);
  cek('PAK MUL + contoh tbk', total + 200000, 9357500);

  cek('MITA baris 1 (ongkos dikurangi)', 23 * 40000 - 10000, 910000);
  cek('YOHAN total (netto 115)', 115 * 42000 - 40000, 4790000);

  var uang = [{ netto: 52, harga: 57500, out: false }, { netto: 0, harga: 57500, out: true }]
    .reduce(function (a, x) { return a + (x.out ? 0 : x.netto * x.harga); }, 0);
  cek('OUT tidak menambah uang', uang, 2990000);

  cek('cuan MITA (C tab)', 2330000 - 2025000, 305000);
  cek('cuan YOHAN (C tab)', 5720000 - 4790000, 930000);

  cek('kolom NOTA', H_NOTA.length, 25);
  cek('kolom ITEM', H_ITEM.length, 16);
  cek('PABRIK di NOTA', CN['PABRIK'] ? 1 : 0, 1);
  cek('PETANI di ITEM', CI['PETANI'] ? 1 : 0, 1);
  cek('huruf kolom 27 = AA', huruf_(27) === 'AA' ? 1 : 0, 1);

  // nota kembar: same content must produce the same fingerprint, different must not
  var t1 = new Date(2026, 6, 25);
  cek('sidik nota sama',
    sidikNota_(t1, 'MITA', 2, 54, 2045000) === sidikNota_(t1, 'mita ', 2, 54, 2045000) ? 1 : 0, 1);
  cek('sidik nota beda kalau total beda',
    sidikNota_(t1, 'MITA', 2, 54, 2045000) === sidikNota_(t1, 'MITA', 2, 54, 2045001) ? 1 : 0, 0);
  cek('sidik nota beda kalau agen beda',
    sidikNota_(t1, 'MITA', 2, 54, 2045000) === sidikNota_(t1, 'YOHAN', 2, 54, 2045000) ? 1 : 0, 0);

  // seri bentrok: KS 5 and KS 6 are different gulungan, KS 5 twice is not
  cek('kunci seri rapi', kunciSeri_(' ks ', ' 5 ') === 'KS 5' ? 1 : 0, 1);
  cek('KS 5 dan KS 6 beda', kunciSeri_('KS', 5) === kunciSeri_('KS', 6) ? 1 : 0, 0);
  cek('KS 5 dan ks 5 sama', kunciSeri_('KS', 5) === kunciSeri_('ks', '5') ? 1 : 0, 1);
  cek('seri kosong diabaikan', kunciSeri_('', '') === '' ? 1 : 0, 1);

  // retry rules: a real mistake is exiled, a Google hiccup is retried.
  // Getting this backwards is how a valid nota disappeared in the first place.
  cek('nota kembar = permanen', GAGAL_PERMANEN.test('NOTA KEMBAR. sama persis') ? 1 : 0, 1);
  cek('seri bentrok = permanen', GAGAL_PERMANEN.test('NOMOR SERI BENTROK: KS 5') ? 1 : 0, 1);
  cek('nota sudah ada = permanen', GAGAL_PERMANEN.test('Nota RA 7 sudah ada.') ? 1 : 0, 1);
  cek('JSON rusak = permanen', GAGAL_PERMANEN.test('Unexpected token } in JSON') ? 1 : 0, 1);
  cek('timeout = DICOBA LAGI', GAGAL_PERMANEN.test('Service Spreadsheets timed out') ? 1 : 0, 0);
  cek('server error = DICOBA LAGI', GAGAL_PERMANEN.test('We are sorry, a server error occurred') ? 1 : 0, 0);

  var hasil = (semua ? '✅ SEMUA BENAR' : '❌ ADA YANG SALAH') + '\n\n' + baris.join('\n');
  catat_('selfCheck', semua ? 'OK' : 'GAGAL', baris.join(' | '));
  lapor_('Tes Hitungan', hasil);
  return semua;
}
