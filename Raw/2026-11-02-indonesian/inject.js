/* Runs inside the REAL lab terminal. state 'today' = nothing changed; 'id' = every visible text node / placeholder
   that matches a word in DICT is swapped for the proposed Indonesian (a MOCK of the language switch - the app is
   untouched). Returns how many were swapped and which visible English text is still left, for the next round. */
(state) => {
  const DICT = {
    'Customer': 'Pelanggan', 'Customer — tap to choose': 'Pelanggan — ketuk untuk pilih', 'Who is buying?': 'Siapa yang beli?',
    'Done': 'Selesai', 'Profiled': 'Terdata', 'Manifest': 'Pesanan', 'Manifest Empty': 'Pesanan Kosong',
    'Sale Mode': 'Mode Jual', 'Retur Mode': 'Mode Retur', 'Buyback (Refund)': 'Beli Kembali (Uang Kembali)',
    'Exchange (Tukar)': 'Tukar Barang', 'Fulfill': 'Penuhi', 'Added': 'Ditambahkan',
    'Warning: Jatuh Tempo!': 'Awas: Jatuh Tempo!', 'Collect payment before issuing new Titip!': 'Tagih dulu sebelum titip baru!',
    'Customer Name': 'Nama Pelanggan', 'Tap to choose the customer': 'Ketuk untuk pilih pelanggan',
    'Acquiring Satellites...': 'Mencari sinyal GPS...', 'PC Fast Scan': 'Pindai Cepat PC', 'Location verified': 'Lokasi cocok',
    'auto': 'otomatis', 'Request 100m HQ Bypass': 'Minta izin kantor (lebih dari 100 m)', 'Uploading Proof...': 'Mengunggah bukti...',
    'Awaiting HQ Approval...': 'Menunggu izin kantor...', 'Jatuh Tempo (Due Date)': 'Jatuh Tempo', 'Unpaid.': 'Belum dibayar.',
    'Good (Resellable)': 'Bagus (bisa dijual lagi)', 'Damaged (Quarantine)': 'Rusak (karantina)', 'Expired': 'Kedaluwarsa',
    'Water Damage': 'Rusak kena air', 'Torn/Crushed': 'Sobek / penyok', 'Pest Damage': 'Rusak hama', 'Factory Defect': 'Cacat pabrik',
    'Other...': 'Lainnya...', 'Give Replacement Now': 'Ganti Barang Sekarang', 'Hutang Barang (IOU)': 'Hutang Barang',
    'Promo · given free': 'Promo · gratis', 'Delivery Proof': 'Bukti Serah Terima', 'PROCESSING...': 'MEMPROSES...',
    'LOC. RESTRICTED': 'LOKASI TERKUNCI', 'REQUIRE PROOF': 'PERLU FOTO', 'REASON REQ.': 'PERLU ALASAN', 'NO STOCK': 'STOK HABIS',
    'PULL RETUR': 'PROSES RETUR', 'Take order': 'Ambil pesanan', 'No order? One tap saves the visit': 'Tidak pesan? Satu ketuk simpan kunjungan',
    'New Request: what do they want?': 'Permintaan baru: mau barang apa?', 'Back': 'Kembali', 'Save request': 'Simpan permintaan',
    'Master Vault': 'Gudang Pusat', 'Boss Car': 'Mobil Bos', 'Next stop': 'Tujuan berikutnya', 'Go': 'Jalan', 'Selling to': 'Jual ke',
    'Owes': 'Utang', 'Before you go in': 'Sebelum masuk', 'Same as last time': 'Sama seperti terakhir', 'EMPTY': 'KOSONG', 'Empty': 'Kosong',
    'In vehicle': 'Di mobil', 'Examine in 3D': 'Lihat 3D', 'Examine': 'Lihat', 'EXAMINE': 'LIHAT',
    'No order in the last 7 days.': 'Tidak ada pesanan 7 hari terakhir.', 'New account, or one worth asking about.': 'Toko baru, atau perlu ditanya.',
    'Claimed by': 'Dipegang', 'Another agent handles this store': 'Toko ini dipegang sales lain', 'Assigned to': 'Ditugaskan ke',
    'No line detail on that order.': 'Tidak ada rincian di pesanan itu.', 'Usual basket': 'Belanja biasa', 'Visits · 7d': 'Kunjungan · 7 hr',
    'Not while a retur is open.': 'Tidak bisa saat retur terbuka.', 'Today': 'Hari Ini', 'Taken': 'Uang Masuk',
    'no sales yesterday to compare': 'kemarin belum ada penjualan', 'Stores done': 'Toko selesai', 'vs yesterday': 'vs kemarin',
    'Last customer': 'Pelanggan terakhir', 'Running low': 'Stok menipis', 'Needs a GPS fix to know what is nearest.': 'Perlu GPS untuk tahu toko terdekat.',
    'Find me': 'Cari lokasi', 'Directions': 'Petunjuk arah', 'Point at a ware to inspect it here.': 'Arahkan ke barang untuk melihatnya di sini.',
    'Nothing left nearby — every store assigned to you has been visited today.': 'Tidak ada lagi di dekat sini — semua toko tugas hari ini sudah dikunjungi.',
    'Outlet Registration': 'Daftar Toko Baru', 'Unlock Requested Pricing Tiers': 'Minta Tingkat Harga', 'You are standing next to': 'Posisi sekarang di dekat',
    'This is a different building — continue': 'Ini bangunan lain — lanjut', 'Store Name': 'Nama Toko', 'WhatsApp / Phone': 'WhatsApp / Telepon',
    'Requested Pricing Tier': 'Tingkat harga yang diminta', 'Storefront Photo': 'Foto depan toko', 'Deploy Marketing Sample': 'Bagikan Sampel',
    'Select Product': 'Pilih Barang', 'Take the handover photo': 'Foto serah terima', 'Camera unavailable': 'Kamera tidak tersedia', 'Take photo': 'Ambil foto',
    'Warning: You must collect the Pita Cukai for every open pack. This will be demanded during EOD Setoran.': 'Awas: pita cukai setiap bungkus yang dibuka wajib dikumpulkan. Akan diminta saat Setoran sore.',
    'Payment Method': 'Cara Bayar', 'Cash': 'Tunai', 'IOU': 'Bon', 'ALL': 'SEMUA', 'Ecer Price': 'Harga Ecer', 'Retail Price': 'Harga Retail', 'Grosir Price': 'Harga Grosir',
    'SEARCH WARES...': 'CARI BARANG...', 'Type the shop name': 'Ketik nama toko', 'Describe the damage...': 'Tulis kerusakannya...',
    'e.g. 2 slop Sampoerna Mild by Thursday': 'mis. 2 slop Sampoerna Mild sebelum Kamis', 'e.g. 081234567890': 'mis. 081234567890',
    'Manifest (': 'Pesanan (', 'm from': 'm dari', 'Deploy Free Sample': 'Bagikan Sampel Gratis', 'Added ·': 'Ditambahkan ·',
    'in manifest': 'di pesanan', 'System Active': 'Sistem Aktif', 'Command Center': 'Pusat Kendali', 'You are here ·': 'Posisi di sini ·',
    'Routine Check': 'Cek Rutin', 'Repeat Order 📦': 'Pesan Ulang 📦', 'Stock Full (No Order) 🛑': 'Stok Masih Penuh (Tidak Pesan) 🛑',
    'Competitor Issue ⚠️': 'Masalah Pesaing ⚠️', 'New Request 📝': 'Permintaan Baru 📝', 'Store Closed 🔒': 'Toko Tutup 🔒',
  };
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const lower = Object.fromEntries(Object.entries(DICT).map(([k, v]) => [k.toLowerCase(), v]));
  const values = new Set(Object.values(DICT).map((v) => v.toLowerCase()));
  const shown = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && getComputedStyle(el).visibility !== 'hidden'; };
  const id = state.startsWith('id');
  const pass = () => {
    let swapped = 0; const left = new Set();
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);   /* body: the arrival sheet is a portal outside #root */
    for (let t; (t = w.nextNode());) {
      const k = norm(t.nodeValue); const el = t.parentElement;
      if (!k || !el || !shown(el) || el.closest('script,style')) continue;
      const v = DICT[k] ?? lower[k.toLowerCase()];
      if (id && v != null) { t.nodeValue = t.nodeValue.replace(k, v); swapped++; }
      else if (/[a-z]{3}/i.test(k) && !values.has(k.toLowerCase())) left.add(k);
    }
    for (const el of document.querySelectorAll('input[placeholder],textarea[placeholder]')) {
      const v = DICT[el.placeholder] ?? lower[el.placeholder.toLowerCase()];
      if (id && v != null) { el.placeholder = v; swapped++; }
    }
    return { swapped, left };
  };
  return (async () => {
    /* '-order': press TAKE ORDER first, so the frame is the order screen instead of the arrival sheet */
    if (state.endsWith('-order')) {
      const b = [...document.querySelectorAll('button')].find((x) => /take order/i.test(x.innerText));
      if (!b) return { error: 'no TAKE ORDER button' };
      b.click(); await new Promise((r) => setTimeout(r, 900));
    }
    /* the arrival sheet and React re-renders arrive after the first pass - keep swapping until the shot */
    if (id) setInterval(pass, 150);
    await new Promise((r) => setTimeout(r, 1200));
    const r = pass();
    return { state, swappedLastPass: r.swapped, dict: Object.keys(DICT).length, left: [...r.left].slice(0, 60) };
  })();
}
