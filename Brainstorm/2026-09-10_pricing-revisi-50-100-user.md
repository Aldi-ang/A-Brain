---
title: Revisi harga KPM — 50 sampai 100 pengguna
description: Aldi menyebut jumlah pengguna sebenarnya, 50-100 orang. Angka Rp 2,5 juta di catatan 9 September dihitung untuk 10-30 pengguna dan sudah tidak berlaku. Ini penggantinya, plus harga lisensi permanen dan alasan beli putus lebih mahal untuk pembelinya.
type: brainstorm
created: 2026-09-10
updated: 2026-09-10
confidence: medium
checked: 2026-09-10
status: OPEN — menunggu jawaban Aldi soal komposisi pengguna dan beban dukungan
tags: [kpm, pricing, business, indonesia, lisensi]
---

# Revisi harga — 50 sampai 100 pengguna

Aldi, 2026-09-10: *"how much for renting how much for license buying and his employee who will use
this app is around 50-100 people"*.

**Angka baru ini membatalkan rekomendasi utama di [[2026-09-09_pricing-kpm-for-the-first-customer]].**
Catatan itu menghitung Rp 2,5 juta/bulan untuk **10-30 pengguna** dan menulis "sampai 20 pengguna"
di Opsi D. Pada 100 pengguna angka itu bukan diskon keluarga, melainkan salah hitung.

---

## Apa yang berubah karena jumlahnya 3-5 kali lipat

**Biaya infrastruktur naik, tapi tetap bukan penentu harga.** Perkiraan lama Rp 100-400 ribu untuk
10-30 pengguna. Pada 50-100 pengguna, dengan listener realtime yang membaca ulang tiap ada
perubahan, ditambah foto bukti penjualan yang menumpuk tiap bulan, kisarannya jadi kira-kira
**Rp 500 ribu sampai 2 juta per bulan**. [guessing] — ini turunan dari tarif Firebase terhadap
tebakan beban, bukan tagihan yang pernah dibaca. **Bulan pertama di data perusahaan sungguhan yang
menyelesaikannya.**

**Beban dukungan naik lebih tajam, dan ini yang sebenarnya mahal.** Perkiraan lama 4-10 jam per
bulan. Pada 100 pengguna: lebih banyak laporan bug, lebih banyak pelatihan, lebih banyak "kok
tulisannya begini". Realistis **20-40 jam per bulan**, dan semuanya jatuh ke satu orang.

**Titik impasnya naik.** Infrastruktur Rp 1,5 juta + 30 jam waktu Aldi. Bahkan kalau waktunya
dihargai Rp 100 ribu/jam — rendah untuk keahlian ini — itu sudah Rp 4,5 juta. **Lantai di rollout
penuh sekitar Rp 6 juta/bulan**, bukan Rp 900 ribu.

---

## Sewa: harga berjenjang, per perusahaan, kursi tambahan murah

Bentuknya tetap mengikuti Accurate — per perusahaan dengan kursi tambahan murah — karena itu
kebiasaan beli pembeli Indonesia. Yang berubah cuma jenjangnya.

| pengguna aktif | per bulan |
|---|---|
| sampai 25 | **Rp 4 juta** |
| 26 sampai 50 | **Rp 7 juta** |
| 51 sampai 100 | **Rp 12 juta** |
| tambahan di atas 100 | **Rp 120 ribu/orang** |

### Kenapa Rp 12 juta, bukan angka lain

Dijepit dari dua sisi, dua-duanya terukur.

**Lantai bawah — Accurate Online pada 100 pengguna:** Rp 333.000 (1 pengguna) + 99 × Rp 22.200 =
**Rp 2,53 juta/bulan**. Itu software akuntansi; ia tidak menjalankan mobil, titip, atau setoran.
Harga KPM harus di atasnya, dan bedanya harus bisa dijelaskan dalam satu kalimat.

**Langit-langit — Badger Maps pada 100 pengguna:** $58/orang/bulan × 100 = $5.800/bulan, sekitar
**Rp 94 juta/bulan**. Versi Enterprise-nya $95, sekitar Rp 154 juta.

Indonesia berjalan di sekitar seperempat sampai sepertiga harga Amerika untuk kategori yang sama.
Itu menaruh padanan jujurnya di **Rp 15-30 juta/bulan** untuk 100 pengguna lapangan — dan angka itu
persis kisaran Rp 15-25 juta yang sudah tercatat sebagai harga pasar.

**Rp 12 juta duduk di bawah harga pasar, di atas software akuntansi.** Itu posisi yang benar untuk
pelanggan pertama yang masih menemukan bug hari pertama.

### Untuk Om secara khusus

| | |
|---|---|
| Pilot, 6 bulan, satu cabang, maksimal 25 pengguna | **Rp 4 juta/bulan** |
| Rollout penuh 50-100 pengguna, setelah pilot | **Rp 12 juta/bulan** |
| Implementasi: migrasi data + pelatihan 100 orang | **Rp 20 juta** sekali, separuhnya dibebaskan ditukar testimoni + 2 perkenalan |
| **Lantai** | **Rp 6 juta/bulan** di rollout penuh |

⚠️ **Biaya implementasi naik dari Rp 5 juta ke Rp 20 juta, dan itu bukan mengada-ada.** Melatih 100
orang bukan pekerjaan yang sama dengan melatih 20. Kalau ini dibebaskan seluruhnya tanpa disebut,
yang tertangkap adalah "pelatihan memang gratis", dan permintaan pelatihan tidak akan berhenti.

### Argumen kebocorannya, diskalakan

Catatan lama memakai 20 sales × Rp 30 juta stok = bocor 1% jadi Rp 6 juta/bulan.

Pada 100 sales: **Rp 3 miliar stok di lapangan. Bocor 1% = Rp 30 juta/bulan. Bocor setengah persen
saja = Rp 15 juta/bulan.**

Jadi pada Rp 12 juta/bulan, KPM membayar dirinya sendiri kalau ia menutup **kurang dari setengah
persen** kebocoran. **Tapi angka Rp 30 juta itu harus keluar dari mulut Om, bukan dari mulut Aldi.**
Pertanyaannya tetap sama: *"Berapa titip yang di luar sekarang? Siapa yang hitung? Bulan lalu berapa
yang hilang di lapangan?"*

---

## Beli putus lisensi permanen

Yang dijual: **hak pakai selamanya**. Hak cipta tetap milik Aldi, dan Aldi tetap boleh menjual ke
pabrik lain. Ini bukan jual putus hak cipta.

Rasio industri yang lazim: **lisensi permanen = 3 sampai 5 kali langganan setahun**, ditambah
**maintenance tahunan 18-22% dari nilai lisensi**.

| dasar | langganan setahun | lisensi permanen | maintenance/tahun |
|---|---|---|---|
| Rp 12 juta/bulan (harga Om) | Rp 144 juta | **Rp 450-720 juta** | Rp 90-145 juta |
| Rp 20 juta/bulan (harga pasar) | Rp 240 juta | **Rp 720 juta - 1,2 miliar** | Rp 145-240 juta |

**Angka yang disebut ke Om: Rp 600 juta, plus Rp 120 juta per tahun maintenance.**

### Dan inilah yang harus dikatakan sesudahnya

**Beli putus lebih mahal untuk Om, bukan lebih murah.**

| | 5 tahun |
|---|---|
| Langganan Rp 12 juta × 60 bulan | **Rp 720 juta** |
| Beli putus Rp 600 juta + 5 × Rp 120 juta | **Rp 1,2 miliar** |

Selisihnya Rp 480 juta, dan yang dia dapat cuma hak memakai kalau Aldi berhenti menagih.

Beli putus baru menang kalau dia **membuang maintenance** — dan tanpa maintenance aplikasinya rusak
sendiri dalam kira-kira dua tahun, karena Firebase, Chrome dan Android berubah tanpa menunggu
siapa-siapa. Itu bukan ancaman jualan, itu bagian ③ di penjelasan maintenance, dan sudah tertulis
sebelum harga dibicarakan.

**Jadi tawarkan lisensi permanen, tapi tawarkan supaya ditolak.** Fungsinya membuat langganan
terlihat murah, dan menunjukkan bahwa Aldi tidak menyembunyikan pilihan.

Satu hal lagi yang nyata untuk bagian keuangan pabrik: **Rp 12 juta berulang jauh lebih mudah
disetujui daripada Rp 600 juta sekali.** Yang pertama biaya operasional, yang kedua belanja modal
dan biasanya butuh tanda tangan yang lebih tinggi.

---

## Jual putus hak cipta: **Rp 5 miliar**, dan angka itu memang untuk menolak

Kalau hak ciptanya berpindah, seluruh pasar rokok Jawa tertutup selamanya. Kudus, Kediri, Malang,
Solo. Kalau realistis sepuluh pabrik dalam lima tahun pada Rp 15 juta/bulan, itu **Rp 900 juta per
tahun** yang hilang. Harganya harus menutup itu, dan karena itu harga tinggi adalah cara sopan untuk
mengatakan tidak.

Ada juga pagar hukumnya: **UU 28/2014 Pasal 82 ayat (3)** melarang perjanjian lisensi menjadi sarana
untuk menghilangkan atau mengambil alih seluruh hak Pencipta atas Ciptaannya. Jadi pengalihan
seluruh hak harus lewat perjanjian pengalihan hak cipta yang berdiri sendiri, bukan diselipkan ke
dalam perjanjian lisensi. Bawa ini ke notaris kalau pertanyaannya benar-benar muncul.

---

## Yang jadi lebih berisiko justru karena jumlahnya, bukan karena harganya

⚠️ **Pada 50-100 pengguna, yang dijual bukan lagi software. Yang dijual adalah Aldi sebagai
departemen operasional.** Satu orang, tanpa pengganti, menopang sistem stok seratus orang.

Tiga hal yang harus beres sebelum rollout penuh, dan tidak satu pun soal harga:

1. **KPM belum pernah dijalankan dengan pengguna sebanyak itu sekaligus.** Semua pengujian sejauh
   ini beberapa akun. Beban listener realtime pada 100 pengguna adalah pertanyaan yang belum ada
   yang menjawab.
2. **Celah Rank Config lintas-perusahaan** jadi lebih parah, bukan lebih ringan, waktu satu dokumen
   dipakai bersama oleh lebih banyak orang.
3. **Janji waktu tanggap di Pasal 8** ditulis untuk beban yang jauh lebih kecil. Hari kerja yang sama
   untuk aplikasi mati, dengan 100 orang berhenti jualan, adalah janji yang harus benar-benar bisa
   ditepati.

**Ini alasan pilot 6 bulan bukan sekadar taktik harga.** Pilot satu cabang dengan 25 pengguna
menjawab ketiganya dengan uang yang sungguhan tapi risiko yang kecil, sebelum seratus orang
bergantung padanya.

---

## DECISION: OPEN — menunggu Aldi

1. **Dari 50-100 orang itu, berapa yang sales lapangan dan berapa yang kantor?** Sales lapangan yang
   membawa nilai dan yang membenarkan harga; pengguna kantor yang cuma membaca laporan seharusnya
   lebih murah, atau tidak dihitung sama sekali.
2. **Berapa cabang?** Ini menentukan apakah pilot satu cabang masuk akal.
3. **Pilot dulu, atau langsung harga penuh?**
4. **Berapa jam per bulan yang benar-benar sanggup dia berikan?** Ini yang menentukan apakah
   Rp 12 juta cukup, atau kurang.

## REJECTED ON PURPOSE — jangan diusulkan lagi

- **Rp 2,5 juta/bulan untuk 50-100 pengguna.** Ditolak karena dihitung untuk 10-30 pengguna, dan
  pada beban dukungan 100 pengguna angka itu di bawah titik impas begitu waktunya dihargai sama
  sekali. Berlaku lagi hanya kalau jumlah pengguna sebenarnya ternyata di bawah 25.
- **Per kursi murni** (misal Rp 150 ribu × 100 = Rp 15 juta). Ditolak dengan alasan yang sama seperti
  sebelumnya, dan alasan itu menguat pada 100 orang: memberi pembeli alasan mengecilkan jumlah sales,
  dan daftar sales adalah data yang seluruh aplikasi ini bergantung padanya.
- **Rollout penuh 100 pengguna langsung tanpa pilot.** Ditolak karena beban 100 pengguna serentak
  belum pernah diuji, dan kegagalan pertama akan terjadi di depan seratus orang sekaligus. Berlaku
  lagi kalau pilot selesai bersih.
- **Jual putus hak cipta pada harga berapa pun yang wajar.** Ditolak selamanya.

## Terkait

- [[2026-09-09_pricing-kpm-for-the-first-customer]] — pembanding pasar yang terukur; angka Rp 2,5 juta di sana sudah digantikan catatan ini
- [[2026-09-10_riset-hukum-menjual-kpm]] — pajak dan dasar hukumnya
- [[2026-09-10_draft-13-pasal-kontrak-kpm]] — Pasal 6 diisi dari sini, Pasal 8 harus ditinjau ulang untuk beban 100 pengguna
