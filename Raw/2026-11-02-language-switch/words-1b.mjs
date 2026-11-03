// node words-1b.mjs -> words-1b.html + words-1b.png
// Round 1b: what is still English on the Sales Terminal (probe r1b-p / r1b-d, 2026-11-02 17:00) + the 41 pop-ups
// (grep notify( in MerchantSalesView.jsx + bundleCheck's why in utils/vanBay.js) + the menu/header + Settings "This device".
// Every row is NUMBERED, so he can say "change 12" (round 1's unnumbered "5" could not be matched to a line).
// Amber text = an example name or number the app fills in; it is not translated.
import { spawn } from 'node:child_process';
import { writeFileSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const DIR = fileURLToPath(new URL('.', import.meta.url));

const A = [   /* Sales Terminal words */
  ['Empty — tap a ware to add', 'Kosong — ketuk barang untuk menambahkan'],
  ['Promo only: [3] pcs given free', 'Hanya promo: [3] pcs gratis'],
  ['No promo goods in this van. Load them in Fleet & Canvas → PROMO.', 'Tidak ada barang promo di mobil ini. Muat dulu di Armada & Kanvas → PROMO.'],
  ['No promo goods in the Master Vault. Restock them in Restock Vault.', 'Tidak ada barang promo di Gudang Pusat. Tambah stoknya di Isi Stok Gudang.'],
  ['No promo goods with a retur. Give them on a new deal.', 'Barang promo tidak bisa diberikan saat retur. Berikan di transaksi baru.'],
  ['Open camera for handover photo', 'Buka kamera untuk foto serah terima'],
  ['Capture or choose photo', 'Ambil atau pilih foto'],
  ['Auto handover photo (demo)', 'Foto serah terima otomatis (demo)'],
  ['Total Value', 'Total Belanja'],
  ['Last order [2 hours ago] · usually Rp [450.000]', 'Pesanan terakhir [2 jam lalu] · biasanya Rp [450.000]'],
  ['just now · 5 min ago · 1 hour ago · 3 hours ago', 'baru saja · 5 menit lalu · 1 jam lalu · 3 jam lalu'],
  ['Ecer is an individual sale, so Consignment is not offered. Consignment is for registered stores.', 'Ecer adalah penjualan perorangan, jadi tidak bisa Titip. Titip hanya untuk toko yang sudah terdaftar.'],
  ['MISC (ware filter)', 'LAIN-LAIN'],
  ['BUNDLES (ware filter)', 'PAKET'],
];
const C = [   /* menu, header, Settings - every screen */
  ['Agent Profile', 'Profil Sales'], ['Command Center', 'Pusat Kendali ✓'], ['Map System', 'Peta'], ['Journey Plan', 'Rencana Rute'],
  ['Fleet & Canvas', 'Armada & Kanvas'], ['Master Vault', 'Gudang Pusat ✓'], ['Agent Inventory', 'Stok Sales'], ['Restock Vault', 'Isi Stok Gudang'],
  ['Sales Terminal', 'Terminal Penjualan'], ['Receivables & Consignment', 'Piutang & Titip'], ['EOD Setoran', 'Setoran Sore'],
  ['Stock Opname', 'Stok Opname'], ['Customers', 'Pelanggan ✓'], ['Sampling', 'Sampel'], ['Reports', 'Laporan'], ['Audit Logs', 'Catatan Audit'],
  ['Settings', 'Pengaturan'], ['Music', 'Musik'], ['Tutorial', 'Panduan'], ['SYNCED · OFFLINE', 'TERSINKRON · OFFLINE'],
  ['System Active · Disconnected', 'Sistem Aktif ✓ · Terputus'], ['Lite Mode · Off · Tap', 'Mode Ringan · Mati · Ketuk'],
  ['L-Click Select · Scroll Navigate (PC bottom bar)', 'Klik Kiri Pilih · Gulir Pindah'],
  ['This device · nothing here leaves the phone', 'Perangkat ini · pengaturan di sini hanya untuk HP ini'],
  ['Device · 01', 'Perangkat · 01'], ['Graphics', 'Tampilan'], ['Full · Lite', 'Penuh · Ringan'],
  ['Lite drops blur, animation and the heavy effects so a cheap phone stays quick and the battery lasts. Nothing is hidden and no data changes — it is only how this one device draws the app.',
    'Ringan mematikan blur, animasi dan efek berat supaya HP murah tetap cepat dan baterai lebih awet. Tidak ada yang disembunyikan dan data tidak berubah — hanya cara HP ini menampilkan aplikasi.'],
];
const B = [   /* pop-up messages */
  ['Basket saved, but the proof photo was too big to keep. Take it again before you deal.', 'Pesanan tersimpan, tapi foto bukti terlalu besar untuk disimpan. Ambil foto lagi sebelum transaksi.'],
  ['Draft restored — [3] items for [Toko Berkah Jaya]. Empty the cart to discard it.', 'Pesanan yang belum selesai dikembalikan — [3] barang untuk [Toko Berkah Jaya]. Kosongkan pesanan untuk membuangnya.'],
  ['OUT OF STOCK IN VEHICLE! You cannot sell [Cello Green 16] because you don\'t have any in your car.', 'STOK DI MOBIL HABIS! [Cello Green 16] tidak bisa dijual karena tidak ada di mobil.'],
  ['MAX STOCK REACHED! You only have [12] units of [Cello Green 16] in your vehicle.', 'STOK MAKSIMAL! Di mobil hanya ada [12] unit [Cello Green 16].'],
  ['INSUFFICIENT VEHICLE STOCK! You only have [12] units of [Cello Green 16] available.', 'STOK DI MOBIL KURANG! Hanya ada [12] unit [Cello Green 16].'],
  ['INSUFFICIENT STOCK! You only have [12] units of [Cello Green 16] available in your vehicle.', 'STOK KURANG! Di mobil hanya ada [12] unit [Cello Green 16].'],
  ['[Cello Green 16] is in the cart at a bundle price - tap the bundle again for another, or save this deal first.', '[Cello Green 16] ada di pesanan dengan harga paket - ketuk paketnya lagi untuk menambah, atau simpan transaksi ini dulu.'],
  ['[Cello Green 16] is at a bundle price - tap the bundle again for another, or remove the line.', '[Cello Green 16] memakai harga paket - ketuk paketnya lagi untuk menambah, atau hapus barisnya.'],
  ['[Cello Green 16] is already in the cart at another price - save that deal first, then add [Paket Cello 10+1].', '[Cello Green 16] sudah ada di pesanan dengan harga lain - simpan transaksi itu dulu, lalu tambahkan [Paket Cello 10+1].'],
  ['[Cello Green 16] is in the cart at a bundle price - save that deal first, then add [Paket Cello 10+1].', '[Cello Green 16] ada di pesanan dengan harga paket - simpan transaksi itu dulu, lalu tambahkan [Paket Cello 10+1].'],
  ['[Cello Green 16] is in the cart as Utang Barang - save that deal first, then add [Paket Cello 10+1].', '[Cello Green 16] ada di pesanan sebagai Utang Barang - simpan transaksi itu dulu, lalu tambahkan [Paket Cello 10+1].'],
  ['[Paket Cello 10+1] is for a sale - switch Retur off first.', '[Paket Cello 10+1] hanya untuk penjualan - matikan Mode Retur dulu.'],
  ['[Paket Cello 10+1]: a product in it is not in this van\'s list any more.', '[Paket Cello 10+1]: ada barang di paket ini yang sudah tidak ada di daftar mobil.'],
  ['Not enough [Cello Green 16] in the van for [Paket Cello 10+1] (needs [10] Bks).', '[Cello Green 16] di mobil tidak cukup untuk [Paket Cello 10+1] (perlu [10] Bks).'],
  ['Only [2] pcs [Korek Api] left in the van - [Paket Cello 10+1] gives [5].', '[Korek Api] di mobil tinggal [2] pcs - [Paket Cello 10+1] memberi [5].'],
  ['No [Korek Api] left in the van for [Paket Cello 10+1].', '[Korek Api] di mobil sudah habis untuk [Paket Cello 10+1].'],
  ['[Paket Cello 10+1] has no cigarettes in it.', '[Paket Cello 10+1] tidak berisi rokok.'],
  ['Only [2] pcs of [Korek Api] in the van - not enough for [5].', '[Korek Api] di mobil hanya ada [2] pcs - tidak cukup untuk [5].'],
  ['Product no longer exists in inventory!', 'Barang ini sudah tidak ada di daftar stok!'],
  ['You don\'t have enough healthy stock in your vehicle to settle this Utang Barang!', 'Stok bagus di mobil tidak cukup untuk melunasi Utang Barang ini!'],
  ['HQ Rejected your Bypass Request.', 'Kantor menolak permintaan izin jarak.'],
  ['Could not check bypass approval status. Please try again.', 'Status izin kantor belum bisa dicek. Coba lagi.'],
  ['Failed to submit bypass request: Network Error', 'Permintaan izin kantor gagal dikirim: jaringan bermasalah'],
  ['Phone number and Photo are required to register a new outlet!', 'Nomor telepon dan foto wajib diisi untuk mendaftarkan toko baru!'],
  ['"[12345]" is not a WhatsApp number. Type the owner\'s mobile number, for example 0812 3456 7890.', '"[12345]" bukan nomor WhatsApp. Ketik nomor HP pemilik toko, contoh: 0812 3456 7890.'],
  ['DUPLICATE DETECTED! A store with this name is already in the database.', 'NAMA TOKO SUDAH ADA! Toko dengan nama ini sudah terdaftar.'],
  ['[Toko Berkah Jaya] is saved, but the admin\'s bell could not be rung. Tell your admin to look at Grosir requests in Customer Directory.', '[Toko Berkah Jaya] tersimpan, tapi notifikasi ke admin gagal terkirim. Minta admin mengecek permintaan Grosir di menu Pelanggan.'],
  ['Failed to save NOO: [error]', 'Toko baru gagal disimpan: [error]'],
  ['Enter a valid quantity to sample.', 'Isi jumlah sampel dengan benar.'],
  ['Please select a product.', 'Pilih barang dulu.'],
  ['Failed to deploy sample: [error]', 'Sampel gagal dibagikan: [error]'],
  ['You do not have clearance to refund cash. Use Exchange (Tukar), or ask an admin to grant Cash Refund in Fleet & Roster.', 'Belum ada izin untuk mengembalikan uang tunai. Pakai Tukar Barang, atau minta admin memberi izin Uang Kembali di Armada & Kanvas.'],
  ['You do not have clearance to process returns.', 'Belum ada izin untuk memproses retur.'],
  ['Sale SAVED. A follow-up step failed (Utang Barang record or store update). Do NOT repeat this sale - tell the admin.', 'Penjualan TERSIMPAN. Ada langkah lanjutan yang gagal (catatan Utang Barang atau data toko). JANGAN ulangi penjualan ini - lapor ke admin.'],
  ['Transaction Failed! Please try again.', 'Transaksi gagal! Coba lagi.'],
  ['Visit saved: [Toko Berkah Jaya] - Routine Check', 'Kunjungan tersimpan: [Toko Berkah Jaya] - Cek Rutin'],
  ['Visit NOT saved for [Toko Berkah Jaya]: network error', 'Kunjungan ke [Toko Berkah Jaya] TIDAK tersimpan: jaringan bermasalah'],
  ['Nothing from their last order is on the vehicle today.', 'Barang dari pesanan terakhir toko ini tidak ada di mobil hari ini.'],
  ['Loaded their last order, with changes:', 'Pesanan terakhir dimuat, dengan perubahan:'],
  ['[Cello Green 16]: only [4] on board (wanted [6])', '[Cello Green 16]: di mobil hanya [4] (diminta [6])'],
  ['Not on the vehicle today:', 'Tidak ada di mobil hari ini:'],
];
const D = [['Hutang Barang (already built)', 'Utang Barang - so it matches "Utang" on the customer card and in every pop-up']];
/* found after the board was sent (his 17:06 screenshots + the 17:15 frames) - numbered AFTER D so lines 1-84 keep their numbers */
const E = [
  ['[1000] pcs in the Master Vault · [6] pcs in the van', '[1000] pcs di Gudang Pusat · [6] pcs di mobil'],
  ['Please complete damage reasons for all items.', 'Lengkapi alasan kerusakan untuk semua barang.'],
  ['You lack healthy vehicle stock to exchange. Switch to "Hutang Barang" or "Buyback".', 'Stok bagus di mobil tidak cukup untuk tukar barang. Ganti ke "Utang Barang" atau "Beli Kembali".'],
  ['Awaiting GPS...', 'Menunggu GPS...'],
  ['MAKE DEAL (the big button)', 'SIMPAN TRANSAKSI'],
  ['GIVE PROMO (the big button, promo only)', 'BERIKAN PROMO'],
  ['SIGN MANIFEST > (the big button, no shop yet)', 'PILIH PELANGGAN >'],
  ['[1.800] Bks left in the vehicle · [9.6 km] · [3] left today (PC right side)', 'sisa [1.800] Bks di mobil · [9,6 km] · sisa [3] toko hari ini'],
];
/* added while BUILDING round 1b (2026-11-03) - each one reuses a word he already agreed; numbered after 92 */
const F = [
  ['Last order (PC right side, under the shop)', 'Pesanan terakhir'],
  ['Proof (the photo, if it fails to load)', 'Bukti'],
  ['Awaiting GPS Lock... (new shop form)', 'Menunggu GPS...'],
  ['System Active · Lite (top bar, Lite on)', 'Sistem Aktif · Ringan'],
  ['Unlock Master Vault (menu lock button)', 'Buka Gudang Pusat'],
  ['Device · 02 (Settings, Language card)', 'Perangkat · 02'],
  ['network error (inside the pop-ups)', 'jaringan bermasalah'],
  ['SALES (big title on top) - now the menu word', 'TERMINAL PENJUALAN'],
];

let n = 0;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fill = (s) => esc(s).replace(/\[([^\]]+)\]/g, '<span class="x">$1</span>');
const rows = (list) => list.map(([e, i]) => `<tr><td class="n">${++n}</td><td class="e">${fill(e)}</td><td class="i">${fill(i)}</td></tr>`).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#14161a;color:#e8e2d4;font:20px/1.35 "Segoe UI",sans-serif;width:1500px}
.wrap{padding:28px}h1{margin:0 0 6px;font-size:30px;color:#e9b949}.sub{margin:0 0 18px;color:#a8a090;font-size:19px}
h2{margin:22px 0 6px;font-size:22px;color:#e9b949}.row{display:flex;gap:28px;align-items:flex-start}.col{width:708px}
table{border-collapse:collapse;width:100%;font-size:17px}td{padding:4px 8px;border-bottom:1px solid #2a2d33;vertical-align:top}
.n{color:#e9b949;font-weight:700;width:34px;text-align:right}.e{color:#a8a090;width:48%}.i{color:#fff;font-weight:600}.x{color:#e9b949}</style></head><body><div class="wrap">
<h1>Round 1b: everything still in English on the Sales Terminal - English (grey), my Indonesian (white)</h1>
<p class="sub">Gold = a name or number the app fills in, not translated. ✓ = a word you already agreed. Tell me the NUMBER of any line to change.</p>
<div class="row"><div class="col"><h2>Sales Terminal</h2><table>${rows(A)}</table><h2>Pop-up messages</h2><table>${rows(B.slice(0, 20))}</table></div>
<div class="col"><h2>Menu, header, Settings (every screen)</h2><table>${rows(C)}</table><h2>Pop-up messages (more)</h2><table>${rows(B.slice(20))}</table>
<h2>One old word to change</h2><table>${rows(D)}</table></div></div>
<h2>Found after this board was first sent (85-92)</h2><table>${rows(E)}</table>
<h2>Added while building (93-100) - words you already agreed, reused</h2><table>${rows(F)}</table></div></body></html>`;
writeFileSync(DIR + 'words-1b.html', html);

const png = DIR + 'words-1b.png'; rmSync(png, { force: true });
const prof = DIR + 'prof-words-1b'; rmSync(prof, { recursive: true, force: true });
const port = 9800 + Math.floor(Math.random() * 150);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars', 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let list = [];
for (let i = 0; i < 60 && !list.length; i++) { try { list = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).filter((t) => t.type === 'page'); } catch { /* not up yet */ } if (!list.length) await sleep(200); }
const ws = new WebSocket(list[0].webSocketDebuggerUrl); await new Promise((r) => { ws.onopen = r; });
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Page.navigate', { url: pathToFileURL(DIR + 'words-1b.html').href }); await sleep(1500);
const h = (await send('Runtime.evaluate', { expression: 'document.body.scrollHeight', returnByValue: true })).result.result.value;
await send('Emulation.setDeviceMetricsOverride', { width: 1500, height: h, deviceScaleFactor: 1, mobile: false }); await sleep(300);
const r = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(png, Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ rows: n, height: h, bytes: statSync(png).size, mtime: statSync(png).mtime }));
ws.close(); chrome.kill();
