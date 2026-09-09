---
title: Menjual KPM — penjelasan bahasa Indonesia
description: Tiga cara menjual software, apa itu maintenance, isi kontrak, dan langkah menjual — ditulis dalam bahasa Indonesia untuk Aldi. Bagian hukum masih perlu riset dan konfirmasi notaris.
type: brainstorm
created: 2026-09-09
updated: 2026-09-09
confidence: medium
checked: 2026-09-09
status: OPEN — riset hukum belum dilakukan
tags: [kpm, pricing, business, indonesia, legal, penjualan]
---

# Menjual KPM — penjelasan bahasa Indonesia

Permintaan Aldi, 2026-09-09: *"can u research deeply more on the legalities and also just explain it
in indonesia for all of this"*.

⚠️ **Riset hukum yang dalam BELUM dilakukan** — kuota habis. Bagian hukum di bawah adalah kerangka,
bukan hasil riset. Angka pajak, biaya pendirian, dan pasal undang-undang **tidak boleh dikutip dari
catatan ini**. Job berikutnya ada di `.claude/NEXT-SESSION.md`.

---

## 1. Tiga cara menjual software

Anggap aplikasi ini seperti rumah yang Anda bangun sendiri.

| | **Langganan** | **Lisensi Permanen** | **Jual Putus Hak Cipta** |
|---|---|---|---|
| artinya | dia **menyewa** rumah | dia beli **hak tinggal selamanya** — gedung dan cetak birunya tetap milik Anda | dia beli **cetak birunya** |
| pemilik kode | **Anda** | **Anda** | **dia** |
| berhenti bayar, masih bisa pakai? | tidak | **ya, selamanya** | ya |
| Anda boleh jual ke perusahaan lain? | **boleh** | **boleh** | ❌ **tidak pernah lagi** |
| yang bayar server | Anda (sudah termasuk) | biasanya dia, akun sendiri | dia |
| pemasukan Anda | tiap bulan, terus-menerus | sekali besar + maintenance tahunan | sekali, lalu habis |

**Contoh nyata.** Misal Cello bayar **Rp 20 juta/bulan**:

- **Langganan** — Rp 240 juta/tahun. Tahun ke-5 sudah Rp 1,2 miliar, aplikasi masih milik Anda, dan
  Anda boleh menjual ke empat pabrik lain sekaligus.
- **Lisensi permanen** — dia bayar sekali Rp 800 juta, plus maintenance ±Rp 160 juta/tahun. Uang
  besar sekarang, sedikit nanti. Hak jual ke perusahaan lain tetap ada.
- **Jual putus** — dia bayar sekali, dan **seluruh pabrik rokok lain di Jawa tertutup selamanya**.
  Karena itu harganya harus menutup seluruh pasar yang hilang, dan karena itu pula harga tinggi
  adalah cara sopan untuk menolak.

> **Saran: tawarkan langganan. Simpan angka lisensi permanen di kepala. Jangan pernah tawarkan jual
> putus hak cipta.**

## 2. Maintenance itu apa

Hubungan software paling sering mati karena bagian ini tidak pernah ditulis. Maintenance ada
**empat hal**, dan hanya tiga yang termasuk.

**① Menjaga tetap hidup** — tagihan Firebase, domain, sertifikat keamanan, memastikan aplikasi
bisa dibuka. *Termasuk.*

**② Memperbaiki yang rusak** — bug yang ditemukan saat dipakai. Angka salah, tombol tidak jalan.
*Termasuk.*

**③ Mengikuti perubahan dunia** — ini yang orang tidak tahu ada. Firebase berubah, Chrome berubah,
Android berubah. **Kalau dua tahun tidak disentuh, aplikasi akan rusak sendiri.** *Termasuk, dan
inilah alasan maintenance tidak boleh dihapus.*

**④ Fitur baru** — *"bisa tambah laporan X?"* **TIDAK termasuk. Dihitung terpisah, setiap kali.**

> **Tulis di kontrak: ①②③ = maintenance, ④ = pekerjaan baru.** Tanpa satu kalimat itu, setiap
> permintaan jadi perdebatan — dan dengan keluarga, perdebatan itu Anda yang kalah.

**Janji waktu tanggap yang realistis untuk satu orang:**

| keadaan | ditanggapi dalam |
|---|---|
| aplikasi mati, tidak bisa jualan | **hari kerja yang sama** |
| angka uang salah | **2 hari kerja** |
| kurang nyaman tapi jalan | update berikutnya |
| fitur baru | penawaran terpisah |

**Jam kerja: Senin–Sabtu, 08.00–20.00 WIB. Bukan 24 jam.** Janji kecil yang ditepati lebih baik
daripada janji besar yang dilanggar.

## 3. Kerangka legal — BELUM DIRISET, jangan dikutip

### a) Badan usaha dulu

Bagian keuangan pabrik **tidak bisa membayar perorangan dengan rapi**. Mereka butuh invoice dari
badan usaha ber-NPWP. Pilihan: **PT Perorangan** (didaftarkan online lewat OSS) atau **CV** (lewat
notaris).

⚠️ Biaya dan syarat terbaru **belum diverifikasi** — halaman OSS gagal dibuka. Konfirmasi di
oss.go.id atau ke notaris.

### b) Isi kontrak — 13 pasal

1. **Para pihak** — nama badan usaha lengkap, bukan "Aldi" dan "Om".
2. **Apa yang diberikan** — sebutkan modulnya satu per satu. Ruang lingkup kabur = kerja gratis.
3. **Jenis perjanjian** — tulis kata **"langganan"**, bukan "beli". Satu baris ini mencegah
   kesalahpahaman terbesar yang mungkin terjadi.
4. **Kode program milik Anda.** Hak cipta memang otomatis milik pencipta, tapi tetap tulis.
5. **Data milik dia** — selalu. Dan Anda berjanji mengembalikannya dalam file yang bisa dibaca
   kapan pun diminta. Sebutkan sendiri sebelum ditanya; ini ketakutan di balik hampir semua keberatan.
6. **Harga, jatuh tempo, sanksi telat.**
7. **Cakupan maintenance** — salin bagian 2 di atas.
8. **Waktu tanggap** — salin tabel di atas.
9. **Escrow kode program** — kode dititipkan ke notaris. Kalau Anda berhenti mendukung 90 hari,
   atau meninggal, kode otomatis diserahkan ke dia. **Ini mematikan keberatan "kalau kamu hilang
   bagaimana" tanpa Anda kehilangan apa pun.**
10. **Kerahasiaan** — Anda akan melihat angka penjualan mereka. Janji tertulis untuk tidak
    membocorkan. Di bisnis rokok, di mana Anda berencana menjual ke pesaingnya, pasal inilah yang
    membuat Anda layak dipercaya.
11. **Cara mengakhiri** — pemberitahuan 3 bulan, kedua pihak.
12. **🔴 Batas tanggung jawab** — pasal paling penting untuk Anda pribadi. *"Tanggung jawab maksimal
    = biaya yang dibayarkan dalam 12 bulan terakhir."* Tanpa ini, kalau bug menyebabkan kerugian
    Rp 500 juta, Anda bisa dituntut Rp 500 juta. **Jangan pernah tanda tangan tanpa pasal ini.**
13. **Hukum yang berlaku** dan pengadilan mana.

### c) Pajak — tiga hal yang akan terjadi

- **Potongan PPh 23.** Untuk jasa, pelanggan biasanya memotong pajak dari invoice Anda. **Jadi Anda
  menagih Rp 20 juta dan menerima kurang dari itu**, disertai bukti potong. Itu normal, bukan
  kurang bayar — dan itu mengagetkan semua vendor pemula. Minta bukti potongnya.
- **Pajak final UMKM** — tarif kecil atas omzet untuk usaha kecil.
- **PPN** — hanya setelah menjadi PKP.

⚠️ **Tarif dan batasan berubah setiap tahun dan BELUM diverifikasi untuk 2026.** Satu jam dengan
konsultan pajak sebelum tanda tangan adalah jam termurah yang akan Anda keluarkan.

### d) Karena ini keluarga

Semua tetap tertulis. **Bukan karena tidak percaya paman Anda — tapi karena orang yang berjabat
tangan hari ini bukan orang yang akan mempertanyakan invoice dua tahun lagi.** Itu bisa pembukuan
baru, anaknya, atau manajer keuangan yang belum pernah dengar nama Anda. Kontrak melindungi
hubungan, bukan mengancamnya.

## 4. Langkah menjual

1. **Gali dulu, jangan demo.** Pertemuan pertama laptop ditutup. Tanya: *"Berapa titip yang di luar
   sekarang? Siapa yang hitung? Kalau sales bilang sudah setor, bagaimana Bapak tahu itu benar?
   Bulan lalu berapa rupiah yang hilang di lapangan?"* — **mereka tidak akan tahu jawaban terakhir,
   dan ketidaktahuan itulah penjualannya.**
2. **Ubah jawaban mereka jadi satu angka.** "20 sales, masing-masing bawa Rp 30 juta. Bocor 1% saja
   Rp 6 juta sebulan yang tidak terlihat." **Angka dari mulut mereka, bukan dari Anda.**
3. **Demo hanya yang menjawab angka itu.** Tiga layar, bukan empat belas.
4. **Proposal satu halaman** — masalah mereka, angka mereka, harga Anda, langkah berikutnya.
5. **Pilot** — satu cabang, satu bulan, data asli, **kriteria berhasil ditulis sebelum mulai.**
6. **Kontrak, lalu rollout.**
7. **Minta referensi tepat saat mereka bilang "ini jalan".** Bukan tiga bulan kemudian.

**Empat larangan:** jangan demo sebelum menggali · jangan kirim harga sebelum mereka menyebut angka
kebocoran mereka · jangan diskon tanpa mengurangi sesuatu · **jangan bikin fitur khusus gratis untuk
menutup deal** — sekali dilakukan, selamanya diminta.

**Cari pelanggan lewat pemasoknya, bukan pabriknya.** Penjual jasa pita cukai, kertas sigaret,
filter dan kemasan **kenal setiap pabrik rokok di klaster dan mengunjungi mereka tiap bulan.** Satu
kemitraan di sana mengalahkan seratus telepon dingin. Setelah itu: klaster Kudus, Kediri, Malang,
lalu referensi dari paman Anda.

## Keputusan yang masih milik Aldi

- Berapa jumlah sales Cello, dan berapa cabang? (menentukan angka bulanan)
- Langganan atau lisensi permanen?
- Riset hukum dulu, atau perbaiki bug menuju 30 September dulu?

## Terkait

- [[2026-09-09_pricing-kpm-for-the-first-customer]] — angka, pembanding pasar, strategi
- [[KPM Product Inventory]] — isi produk yang terukur, dan biaya penggantian
