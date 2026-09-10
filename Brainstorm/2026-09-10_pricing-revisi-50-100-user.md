---
title: Revisi harga KPM — 25-30 pengguna (angkanya bergerak dua kali)
description: Jumlah pengguna bergerak dua kali dalam satu hari - 10-30, lalu 50-100, lalu 25-30. Revisi kedua yang berlaku - Rp 5 juta per bulan, lantai Rp 2 juta, dan empat ukuran bebas yang menjelaskan kenapa itu wajar. Berisi juga skrip menjawab pertanyaan harga.
type: brainstorm
created: 2026-09-10
updated: 2026-09-10
confidence: medium
checked: 2026-09-10
status: OPEN — REVISI KEDUA berlaku (25-30 pengguna, Rp 5 juta). Menunggu pembagian sales lapangan vs kantor.
tags: [kpm, pricing, business, indonesia, lisensi]
---

# Revisi harga — jumlah pengguna, dan angkanya yang bergerak dua kali

> 🔴 **THE CANONICAL NUMBERS NOW LIVE IN [[KPM Price Sheet]].** This file is the reasoning trail and
> the answer script. **Its middle sections still carry the superseded 100-user tables** — the REVISI
> KEDUA banner below is what applies. Do not quote a price from the middle of this file.

---

## ⚠️ REVISI KEDUA, 2026-09-10 sore — jumlahnya 25-30, bukan 50-100

Aldi: *"okay jadi semua sales lapangan dan karyawan kerja yang bakal pake app ini sekita 25 -30
orang can u revise the cost and give me the reason why this price is fair"*.

**Angka pengguna sudah bergerak dua kali dalam satu hari: 10-30 → 50-100 → 25-30.** Yang terakhir
yang dipakai, karena paling spesifik. Tapi **konfirmasi sekali lagi sebelum menyebut harga ke Om** —
harga yang salah kutip mahal ditarik kembali, dan seluruh angka di bawah bergantung pada satu bilangan
ini.

Bagian di bawah judul ini menggantikan tabel jenjang dan angka "untuk Om" di atas. Pembanding pasar,
skrip jawaban, dan bagian risiko tetap berlaku.

### Biaya jalan di 25-30 pengguna

| | per bulan |
|---|---|
| Firebase (25-30 pengguna, foto bukti, listener realtime) | Rp 250-500 ribu |
| Alat AI yang terpakai untuk kerja ini | Rp 300-500 ribu |
| Dukungan, 8-15 jam @ Rp 100 ribu/jam | Rp 800 ribu - 1,5 juta |
| **Titik impas** | **≈ Rp 2 juta/bulan** |

Turun dari Rp 6 juta di skenario 100 pengguna. Beban dukungan yang turun, bukan servernya.

### Harganya

| | |
|---|---|
| Pilot, 3-6 bulan, **seluruh tim** | **Rp 2,5 juta/bulan** |
| Setelah pilot, sampai 30 pengguna | **Rp 5 juta/bulan** |
| Pengguna ke-31 dan seterusnya | Rp 150 ribu/orang/bulan |
| Implementasi: migrasi data + pelatihan 30 orang | **Rp 7,5 juta**, separuh dibebaskan ditukar testimoni + 2 perkenalan |
| **Lantai** | **Rp 2 juta/bulan** |

⚠️ **Tabel jenjang di atas menyebut Rp 7 juta untuk 26-50 pengguna. Angka itu hasil interpolasi dari
skenario 100 pengguna, bukan turunan.** Diturunkan langsung untuk 30 pengguna, angkanya Rp 5 juta.
Yang diturunkan menang atas yang diinterpolasi.

⚠️ **Di 25-30 orang tidak ada potongan kecil untuk dijadikan pilot.** Satu cabang dengan 25 pengguna
adalah hampir seluruh perusahaan. Jadi pilotnya **dibatasi waktu, bukan dibatasi orang** — semua
memakai sejak hari pertama, dengan harga yang lebih rendah selama masa pembuktian. Konsekuensinya:
**bug hari pertama harus beres sebelum pilot dimulai**, karena tidak ada kelompok kecil yang
menyerap kesalahannya lebih dulu.

### Empat ukuran yang jatuh di tempat yang sama — ini arti "wajar"

Satu pembenaran bisa dikarang. Empat ukuran yang saling bebas dan berhenti di angka yang sama, tidak.

**① Ukuran biaya.** Jalannya Rp 2 juta. Rp 5 juta itu 2,5 kali biaya. Cukup untuk membayar waktu dan
menyisakan margin, tidak cukup untuk disebut mencekik.

**② Ukuran pasar.** Accurate Online, 30 pengguna: Rp 333.000 + 29 × Rp 22.200 = **Rp 976.800/bulan** —
tapi Accurate tidak tahu sales-nya di mana, tidak mengerti titip, tidak mencetak nota di motor.
Badger Maps, 30 pengguna: $58 × 30 ≈ **Rp 28 juta/bulan**. Padanan Indonesia pada Rp 150-300 ribu per
pengguna lapangan: **Rp 4,5-9 juta**. Rp 5 juta ada di dalamnya, dekat ke batas bawah — posisi yang
benar untuk pelanggan pertama yang masih menemukan bug.

**③ Ukuran kebocoran.** Kalau 20-25 dari mereka sales lapangan yang masing-masing membawa sekitar
Rp 30 juta, itu **Rp 600-750 juta ada di jalan**. Bocor satu persen = **Rp 6-7,5 juta sebulan**.
**Harganya di bawah kebocorannya.** Aplikasi ini membayar dirinya sendiri kalau ia menutup kurang
dari satu persen.

**④ Ukuran gaji.** Rp 5 juta kira-kira satu gaji admin. Bedanya, admin tidak bisa menghitung ulang
Rp 750 juta stok yang sedang berjalan di jalan raya, dan tidak bisa tahu sebuah penjualan terjadi di
toko yang benar.

### Lisensi permanen di ukuran ini

Rp 5 juta/bulan = Rp 60 juta/tahun. Rasio 3-5 kali → **Rp 250 juta**, plus maintenance 20% =
**Rp 50 juta/tahun**.

| | 5 tahun |
|---|---|
| Langganan Rp 5 juta × 60 bulan | **Rp 300 juta** |
| Beli putus Rp 250 juta + 5 × Rp 50 juta | **Rp 500 juta** |

Argumennya tidak berubah, cuma angkanya mengecil: **beli putus tetap lebih mahal untuk pembelinya**,
dan Pasal 9 escrow tetap memberi Om rasa aman yang sama secara gratis.

**Jual putus hak cipta tetap Rp 5 miliar** — angka itu tidak bergantung pada besar pelanggan ini,
melainkan pada seluruh pasar yang tertutup.

### Pajaknya jadi sepele

Rp 5 juta × 12 = **Rp 60 juta/tahun**. Jauh di bawah Rp 500 juta, jadi sebagai orang pribadi **PPh
finalnya Rp 0**. Bahkan pilot Rp 2,5 juta pun sama. Ini memperkuat urutan yang sudah ditulis: pilot
sebagai orang pribadi, PT dibentuk sebelum kontrak penuh, dan alasannya tanggung jawab — bukan pajak.

### Yang masih harus dijawab Aldi

**Dari 25-30 orang itu, berapa yang sales lapangan dan berapa yang kantor?** Ukuran ③ bergantung
padanya. Kalau ternyata hanya 12 sales lapangan dan 18 orang kantor, argumen kebocorannya mengecil
setengah, dan Rp 5 juta perlu ditinjau ulang.

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


## Kalau ditanya "kenapa segitu" — kata-katanya

Aldi, 2026-09-10: *"jika ditanya kenapa harga 12 juta perbulan dan 600 juta untuk harga aplikasi
licensi bagaimana menjawabnya"*.

### Tiga aturan sebelum kalimat pertama

1. **Jangan pernah menjawab dengan biaya sendiri.** Begitu kalimatnya jadi *"servernya sekian, waktu
   saya sekian"*, harganya berubah jadi biaya + margin di kepala pembeli — dan margin selalu bisa
   ditawar. Biaya Aldi bukan urusan Om, dan menyebutnya memberi Om pisau.
2. **Diam setelah menyebut angka.** Orang yang buru-buru membenarkan harganya terdengar seperti
   orang yang diam-diam tahu harganya kemahalan.
3. **Kalau ditawar, jangan turunkan harga — kurangi isinya.** Turun ke Rp 7 juta berarti turun ke 50
   pengguna. Itu sudah ada di tabel jenjang, jadi bukan mengalah, itu pindah paket.

### Rp 12 juta per bulan

**Langkah 1 — balikkan dulu, jangan langsung jawab.**

> *"Sebelum saya jawab — Om, berapa titip yang di luar sekarang, dan siapa yang hitung?"*

Kalau angkanya keluar, seluruh sisanya jadi mudah. Kalau Om tidak tahu angkanya — **dan biasanya
memang tidak tahu** — ketidaktahuan itu sendiri sudah penjualannya, dan itu momen untuk berhitung
bersama, bukan sendirian.

**Langkah 2 — ubah jadi satu angka, pakai angka Om.**

> *"Seratus sales, masing-masing bawa sekitar Rp 30 juta. Itu Rp 3 miliar ada di jalan tiap hari.
> Bocor satu persen saja, Rp 30 juta sebulan hilang tanpa kelihatan di laporan mana pun. Rp 12 juta
> itu empat puluh persen dari angka yang Om sudah bayar tiap bulan tanpa sadar."*

**Langkah 3 — bandingkan ke sesuatu yang bisa Om cek sendiri.**

> *"Accurate Online untuk seratus pengguna sekitar Rp 2,5 juta sebulan, dan Om bisa cek harganya
> online. Tapi Accurate tidak tahu sales-nya ada di mana, tidak mengerti titip, dan tidak mencetak
> nota di motor. Yang mengerti itu semua namanya Badger Maps, dari luar, lima puluh delapan dolar
> per orang — untuk seratus orang itu sekitar Rp 94 juta sebulan. Saya di antara keduanya, dan jauh
> lebih dekat ke yang murah."*

**Langkah 4 — kecilkan angkanya sampai sebesar apa adanya.**

> *"Rp 12 juta dibagi seratus orang itu Rp 120 ribu per orang sebulan. Empat ribu rupiah per sales
> per hari."*

**Empat ribu rupiah per hari adalah kalimat penutupnya.** Sesudah itu diam.

**Langkah 5, kalau masih perlu — bandingkan ke gaji.**

> *"Satu admin yang kerjanya khusus menghitung ulang titip itu Rp 4 sampai 5 juta sebulan, dan dia
> baru bisa menghitung setelah kejadian. Rp 12 juta itu dua setengah orang admin — yang bekerja tiap
> detik, tidak lupa, dan tidak ikut berkompromi di lapangan."*

### Rp 600 juta lisensi permanen

**Jawabannya dimulai dengan tidak menyarankannya.** Ini yang membuat seluruh percakapan harga jadi
dipercaya.

> *"Rp 600 juta itu tiga sampai lima kali langganan setahun. Rasio itu yang dipakai industri
> software, jadi angkanya bukan karangan saya. Tapi saya tidak menyarankan Om ambil yang ini, dan
> saya jelaskan kenapa."*

Lalu hitungannya, di depan Om:

| | 5 tahun |
|---|---|
| Langganan Rp 12 juta × 60 bulan | **Rp 720 juta** |
| Beli putus Rp 600 juta + 5 × Rp 120 juta maintenance | **Rp 1,2 miliar** |

> *"Om bayar hampir Rp 500 juta lebih banyak, untuk hak yang baru terpakai kalau saya berhenti.
> Beli putus baru menang kalau Om membuang maintenance-nya — dan tanpa maintenance, aplikasinya rusak
> sendiri dalam kira-kira dua tahun. Bukan karena saya berhenti mengurus, tapi karena Firebase,
> Chrome dan Android berubah tanpa menunggu siapa-siapa."*

**Dan ini pukulan terakhirnya, dan yang paling murah:**

> *"Yang sebenarnya Om beli dengan Rp 600 juta bukan aplikasinya. Yang Om beli adalah rasa aman
> kalau saya hilang. Dan itu sudah Om dapat, gratis, di Pasal 9: kode programnya dititipkan ke
> notaris. Kalau saya berhenti mendukung sembilan puluh hari, atau saya kenapa-kenapa, kodenya
> otomatis diserahkan ke Om. Om tidak perlu membayar Rp 600 juta untuk hal yang sudah ada di
> kontrak."*

**Pasal escrow itu mematikan keberatan beli-putus tanpa Aldi kehilangan apa pun.** Bawa duluan,
jangan tunggu ditanya.

Satu argumen tambahan yang nyata untuk bagian keuangan pabrik:

> *"Rp 12 juta berulang itu biaya operasional, tanda tangannya di level Om. Rp 600 juta sekali itu
> belanja modal, dan biasanya butuh persetujuan yang lebih tinggi dan lebih lama."*

### Dua keberatan yang pasti datang

**"Kan keluarga, kok bayar?"**

> *"Justru karena keluarga saya mau ini jelas. Kalau gratis, Om tidak enak menagih saya waktu ada
> yang rusak, dan saya tidak enak menolak permintaan yang di luar kesepakatan. Dua-duanya jadi
> menyimpan. Kalau ada kontrak, Om berhak menuntut saya, dan saya berhak bilang tidak. Itu yang
> bikin hubungannya awet."*

**"Ini kan dibuat pakai AI, kok mahal?"**

Jangan disembunyikan — bisa ketahuan, dan ketahuan lebih mahal daripada mengakui.

> *"Betul, saya yang bikin, pakai alat AI. Sama seperti arsitek pakai komputer, bukan pensil. Tapi
> AI tidak memberi tahu saya bahwa omzet harus menunggu uangnya masuk, tidak memberi tahu bahwa
> titip itu piutang sampai audit toko menemukan barangnya laku, dan tidak tahu ada satuan Bal, Slop
> dan Bks. Itu semua dari mengerti dagang keluarga sendiri. Yang Om bayar bukan waktu mengetiknya,
> tapi bahwa hitungannya benar sejak hari pertama, dan ada orang yang memperbaikinya di hari kedua."*

### Yang tidak boleh diucapkan

- **Berapa biaya server Aldi.** Sekali disebut, harganya jadi biaya + margin.
- **Angka Rp 1,4 miliar biaya bikin ulang, dua kali.** Sekali saja, sebelum menyebut harga, lalu
  jangan diulang. Diulang jadi terdengar membela diri.
- **"Boleh deh, berapa maunya Om."** Sekali harga jadi bisa dikarang, semua angka di atas hilang
  artinya.

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
