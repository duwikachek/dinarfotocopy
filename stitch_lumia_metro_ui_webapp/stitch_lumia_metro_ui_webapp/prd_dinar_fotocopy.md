# Dinar Fotocopy

---

## 1. Ringkasan & Tujuan Aplikasi
*Bagian ini menjelaskan gambaran umum proyek agar dipahami bersama oleh pemilik ide/klien dan tim pengembang.*
- **Nama Aplikasi**: Dinar Fotocopy
- **Penjelasan Singkat**: Web app katalog digital untuk usaha fotocopy "Dinar Fotocopy" yang menampilkan daftar layanan, estimasi harga otomatis, katalog produk ATK, serta memudahkan pelanggan memesan langsung via WhatsApp tanpa harus membuat akun.
- **Masalah yang Diselesaikan**:
  - Pelanggan sering harus datang dulu untuk tanya harga fotokopi, print, jilid, atau cetak banner karena belum ada katalog online.
  - Proses pemesanan masih manual via chat pribadi dan sering membuat pesanan terlewat atau salah hitung biaya.
  - Pemilik usaha kesulitan memperbarui daftar harga dan stok ATK secara cepat dan konsisten di banyak tempat.
  - Tidak ada rekap order yang rapi, sehingga status pesanan (baru, dikerjakan, selesai) sulit dipantau.
- **Pengguna Aplikasi**:
  - **Pengunjung/Pelanggan (Tanpa Login)**: Melihat katalog layanan, menghitung estimasi biaya, melihat produk ATK, dan memesan langsung via WhatsApp.
  - **Admin/Pengelola Toko (Login Email & Password)**: Mengelola daftar layanan & harga, produk ATK, pesanan masuk, dan memantau log notifikasi WhatsApp.
- **Target Keberhasilan**:
  - 80% pertanyaan harga berulang dapat dijawab otomatis melalui halaman katalog & kalkulator estimasi.
  - Rata-rata waktu pemilik memperbarui harga layanan turun di bawah 2 menit per item.
  - Minimal 60% pemesanan masuk tercatat rapi di dashboard admin (bukan hanya di chat WhatsApp).
  - Notifikasi status pesanan ke pelanggan terkirim otomatis melalui WhatsApp Gateway.

---

## 2. Batasan Pembuatan Sistem (Versi Awal MVP)
*Menegaskan fitur apa yang dikerjakan di versi awal dan apa yang sengaja ditunda agar aplikasi cepat selesai dan tidak membengkak (mencegah scope creep).*
### ✅ Yang Dikerjakan:
- Katalog layanan (Fotokopi & Print, Cetak Foto & Banner, Jilid & Laminating, Scan & Digitalisasi, ATK) lengkap dengan harga & satuan.
- Halaman detail layanan dengan penjelasan, contoh penggunaan, dan estimasi harga.
- Kalkulator estimasi biaya interaktif (misal: hitung per lembar × jumlah, ukuran kertas, warna, sisi cetak).
- Katalog produk ATK dengan pencarian dan filter kategori.
- Keranjang estimasi (tanpa pembayaran online) yang menghasilkan draft pesanan + tombol "Pesan via WhatsApp".
- Halaman statis: Tentang Kami, Kontak & Lokasi (embed Google Maps), FAQ.
- Dashboard Admin (Email & Password) untuk kelola layanan, kategori, produk ATK, pesanan, dan pengaturan toko.
- Integrasi WhatsApp Gateway untuk notifikasi otomatis status pesanan ke pelanggan & notifikasi pesanan baru ke pemilik.
- Halaman log notifikasi WhatsApp (berhasil/gagal, isi pesan, waktu kirim).

### ⛔ Yang Tidak Dikerjakan di Versi Awal:
- Pembayaran online (payment gateway seperti Midtrans/Xendit/Stripe) — pembayaran dilakukan langsung di toko atau transfer manual.
- Akun pelanggan (registrasi/login customer) — pelanggan berinteraksi tanpa akun.
- Keranjang multi-sesi tersimpan (cart persisten lintas device) — keranjang hanya bersifat sesi browser.
- Chat realtime / live chat internal di web.
- Modul keuangan lanjutan (laporan P&L, purchase order supplier, manajemen stok otomatis dengan reorder point).
- Multi-cabang / multi-outlet (versi awal fokus 1 lokasi toko).
- Aplikasi mobile native (Android/iOS).

---

## 3. Daftar Halaman & Struktur Menu (Pages & Routing)
*Daftar lengkap halaman yang harus dibuat, dikelompokkan berdasarkan area atau peran pengguna (Role).*
### A. Public Area (Tanpa Login)
- `/` (Beranda): Hero singkat dengan nama & tagline Dinar Fotocopy, highlight layanan unggulan, kalkulator estimasi cepat, testimoni, dan CTA "Pesan via WhatsApp".
- `/layanan` (Katalog Layanan): Grid seluruh kategori layanan (Fotokopi & Print, Cetak Foto & Banner, Jilid & Laminating, Scan & Digitalisasi, ATK) dengan pencarian dan filter harga.
- `/layanan/[slug]` (Detail Layanan): Penjelasan lengkap, daftar varian harga (per warna/ukuran), contoh kasus, form input cepat untuk menghitung estimasi, dan tombol pesan via WhatsApp.
- `/produk` (Katalog ATK): Daftar produk ATK dengan filter kategori, pencarian, indikator stok, dan tombol tambah ke keranjang estimasi.
- `/produk/[slug]` (Detail Produk ATK): Foto produk, deskripsi, harga, stok, dan tombol tambah ke keranjang estimasi.
- `/estimasi` (Kalkulator Estimasi): Kalkulator gabungan untuk fotokopi/print/cetak/jilid/scan dengan rincian sub-total, plus ringkasan keranjang ATK.
- `/cart` (Keranjang Estimasi): Ringkasan item layanan & produk ATK, form data pelanggan (nama, no. WhatsApp, catatan), dan tombol "Pesan via WhatsApp".
- `/tentang` (Tentang Kami): Cerita Dinar Fotocopy, jam operasional, alamat, visi & nilai pelayanan.
- `/kontak` (Kontak & Lokasi): Alamat lengkap, peta Google Maps embed, no. WhatsApp, jam buka, form pesan singkat.
- `/faq` (FAQ): Pertanyaan umum seputar harga, waktu pengerjaan, cara kirim file, dan pengambilan order.
- `/kebijakan-privasi` (Kebijakan Privasi): Ringkas, sesuai kebutuhan dasar UU PDP.

### B. Authentication Area (Publik)
- `/admin/login` (Login Admin): Form email & password untuk admin/pengelola Dinar Fotocopy.

### C. Admin Area (Setelah Login)
- `/admin` (Redirect ke `/admin/dashboard`).
- `/admin/dashboard` (Dasbor Utama): Ringkasan pesanan hari ini, pesanan menunggu tindakan, produk ATK stok menipis, dan grafik pesanan 7 hari terakhir.
- `/admin/layanan` (Kelola Layanan & Harga): Tabel daftar layanan, form tambah/edit, toggle aktif/nonaktif, dan pengaturan varian harga.
- `/admin/kategori` (Kelola Kategori): CRUD kategori layanan & produk ATK.
- `/admin/produk` (Kelola Produk ATK): CRUD produk, stok, harga, dan gambar.
- `/admin/pesanan` (Daftar Pesanan): Tabel semua pesanan dengan filter status, rentang tanggal, dan pencarian nama/wa pelanggan.
- `/admin/pesanan/[id]` (Detail Pesanan): Rincian item, data pelanggan, tombol ubah status, tombol kirim ulang notifikasi WhatsApp.
- `/admin/notifikasi` (Log WhatsApp): Riwayat pengiriman pesan ke pelanggan & ke pemilik, status berhasil/gagal, dan detail payload.
- `/admin/pengaturan` (Pengaturan Toko): Nama toko, alamat, jam buka, no. WhatsApp admin, dan konfigurasi tampilan beranda.
- `/admin/profil` (Profil Saya): Ubah password dan data akun admin.

---

## 4. Pedoman UI/UX & Design System
*Panduan visual konkret agar AI coding assistant tidak membuat UI yang kaku atau default.*
- **Skema Warna** (Minimalist, monokrom dengan 1 aksen):
  - Background: `HSL(0, 0%, 100%)` — putih bersih.
  - Foreground (teks utama): `HSL(224, 12%, 12%)` — near-black, nyaman dibaca.
  - Primary: `HSL(224, 12%, 12%)` — diksi tombol utama (fill gelap, teks putih).
  - Border: `HSL(220, 13%, 91%)` — garis tipis 1px sangat halus sebagai pemisah.
  - Muted (surface): `HSL(220, 14%, 96%)` — latar kartu/form sangat lembut.
  - Accent (brand "Dinar"): `HSL(38, 92%, 50%)` — amber keemasan, dipakai hemat untuk badge status, ikon, dan underline selektif.
  - Ring (focus state): `HSL(38, 92%, 50%)` dengan opacity 40%.
- **Tipografi**:
  - Font utama: **Inter** (heading & body) dengan feature `cv11` dan `ss01`.
  - Heading: Inter, weight 600–700, tracking `-0.02em` untuk heading besar, skala tipe: `text-4xl` (hero), `text-2xl` (section), `text-lg` (card title), `text-base` (body), `text-sm` (meta/caption).
  - Angka/harga: gunakan `font-variant-numeric: tabular-nums` agar rapi sejajar.
  - Maksimal 2 level hierarki visual dalam satu layar (misal: 1 besar + 1 sedang), hindari 4–5 ukuran heading bertumpuk.
- **Aturan Komponen**:
  - Sudut: `rounded-lg` (8px) untuk tombol & input, `rounded-xl` (12px) untuk kartu. Hindari `rounded-full` kecuali badge status.
  - Border selalu 1px `--border`, TIDAK ada border 2–3px tebal.
  - Shadow: default `shadow-none`; gunakan `shadow-sm` hanya untuk kartu terangkat; aktifkan `hover:shadow-md` secara halus.
  - Tombol: primary (fill gelap, teks putih), outline (border tipis, teks gelap), ghost (tanpa border), dan destructive (merah halus) — tanpa gradien.
  - Spacing: baseline 4px; jarak antar section `py-16` di desktop, `py-10` di mobile. Gunakan banyak whitespace.
  - Tabel admin: border horizontal tipis, header muted uppercase tracking `0.08em` `text-xs`, tanpa zebra-striping.
- **Nuansa & Vibe**:
  - Clean, editorial, calm — rasanya seperti membaca katalog desain cetak berkualitas.
  - Micro-animation sangat halus saja: transisi `150ms ease-out` untuk hover, fade-in `200ms` saat halaman masuk.
  - Ikon dari **Lucide Icons** dengan `stroke-width: 1.5` (bukan default 2) agar tipis dan menyatu.
  - Hindari gradient berwarna-warni, glassmorphism, emoji penghias. Gunakan ruang kosong sebagai penekanan visual utama.
  - Gambar/ilustrasi di-render dengan radius `rounded-xl`, tone warna natural, dan **jangan** memakai stok foto yang ramai.

---

## 5. Pembagian Hak Akses Pengguna
*Tabel hak akses yang menentukan siapa saja yang boleh melihat, mengedit, atau mengelola data.*
| Menu / Halaman | Publik (Tanpa Login) | Admin/Pengelola (Login) |
| :--- | :---: | :---: |
| Beranda `/` | ✅ | ✅ |
| Katalog Layanan `/layanan` | ✅ | ✅ |
| Detail Layanan `/layanan/[slug]` | ✅ | ✅ |
| Katalog ATK `/produk` | ✅ | ✅ |
| Detail Produk ATK `/produk/[slug]` | ✅ | ✅ |
| Kalkulator Estimasi `/estimasi` | ✅ | ✅ |
| Keranjang Estimasi `/cart` | ✅ | ✅ |
| Tentang, Kontak, FAQ, Kebijakan Privasi | ✅ | ✅ |
| Login Admin `/admin/login` | ❌ (redirect ke dashboard jika sudah login) | ✅ |
| Dashboard Admin `/admin/dashboard` | ❌ | ✅ |
| Kelola Layanan & Harga `/admin/layanan` | ❌ | ✅ |
| Kelola Kategori `/admin/kategori` | ❌ | ✅ |
| Kelola Produk ATK `/admin/produk` | ❌ | ✅ |
| Daftar Pesanan `/admin/pesanan` | ❌ | ✅ |
| Detail Pesanan `/admin/pesanan/[id]` | ❌ | ✅ |
| Log Notifikasi WhatsApp `/admin/notifikasi` | ❌ | ✅ |
| Pengaturan Toko `/admin/pengaturan` | ❌ | ✅ |
| Profil Admin `/admin/profil` | ❌ | ✅ |

---

## 6. Alur Kerja dan Fitur Utama
*Menjelaskan cara kerja setiap fitur utama dalam bahasa yang mudah dipahami serta aturan logikanya.*

### A. Katalog Layanan & Harga Dinamis
1. **Cara Kerja**: Pengunjung membuka `/layanan`, melihat grid 5 kategori utama (Fotokopi & Print, Cetak Foto & Banner, Jilid & Laminating, Scan & Digitalisasi, ATK). Klik salah satu kartu membuka `/layanan/[slug]` yang menampilkan daftar varian (misal: Fotokopi A4 HVS 70gr — Hitam Putih Rp 300/lembar, Warna Rp 1.500/lembar). Pengunjung dapat menekan tombol "Hitung Estimasi" yang membawa ke kalkulator dengan varian sudah terisi.
2. **Aturan Sistem**:
   - Harga disimpan sebagai integer (Rupiah, tanpa desimal) di kolom `basePrice`.
   - Setiap layanan boleh memiliki banyak varian (`service_variants`) dengan kombinasi atribut fleksibel (misal: ukuran, warna, sisi).
   - Layanan dengan `isActive = false` tidak muncul di halaman publik tetapi tetap tersimpan di admin.
   - Urutan tampilan layanan mengikuti kolom `sortOrder` (ASC), lalu `createdAt` DESC sebagai tie-breaker.
   - Slug layanan unik, auto-generate dari nama (contoh: `fotokopi-a4`), tidak dapat diubah jika sudah ada order yang mengacu padanya.

### B. Kalkulator Estimasi Biaya
1. **Cara Kerja**: Pengunjung memilih jenis layanan, varian, jumlah (halaman/lembar/ukuran untuk banner), lalu sistem menampilkan rincian sub-total per baris dan total keseluruhan secara langsung (real-time). Ada tombol "Tambah ke Keranjang" agar item dimasukkan ke daftar estimasi di `/cart`.
2. **Aturan Sistem**:
   - Perhitungan dilakukan di sisi klien (Client Component) untuk kecepatan, lalu divalidasi ulang di sisi server saat submit order.
   - Input jumlah minimal 1, maksimal 10.000; non-integer ditolak.
   - Diskon otomatis berlaku untuk layanan Fotokopi & Print dengan aturan: jumlah ≥ 100 lembar → diskon 5%; jumlah ≥ 500 lembar → diskon 10% (nilai persen dikonfigurasi di tabel `settings` admin).
   - Estimasi bersifat **indikatif**; tampil disclaimer di bawah hasil: "Estimasi dapat berubah setelah kami periksa berkas Anda."
   - Untuk layanan Cetak Banner, kalkulator meminta input panjang & lebar (cm) dan menghitung harga per meter persegi.

### C. Pemesanan via WhatsApp
1. **Cara Kerja**: Pengunjung membuka `/cart`, mengisi form singkat (Nama, No. WhatsApp, Catatan/Jenis Finishing/Preferensi Ambil), lalu menekan "Pesan via WhatsApp". Sistem (1) menyimpan draft order ke database dengan status `pending`, (2) generate tautan `wa.me/<nomor-toko>` dengan pesan yang sudah terisi lengkap, (3) membuka WhatsApp di tab baru.
2. **Aturan Sistem**:
   - Format pesan WhatsApp dibangun dari template tersimpan (di tabel `settings`) dan divalidasi agar tidak melebihi batas karakter URL aman (~1.500 karakter).
   - Nomor WhatsApp toko diambil dari `settings.storeWhatsapp` (format internasional tanpa `+`, contoh `628123456789`).
   - Setiap order menerima kode unik berformat `DF-YYMMDD-XXXX` (contoh: `DF-250120-0001`) untuk memudahkan tracking.
   - Validasi form: nama minimal 3 karakter, no. WhatsApp 10–15 digit angka, catatan maksimal 500 karakter.
   - Rate limit pembuatan order: maksimal 5 request per IP per 10 menit untuk mencegah spam.
   - Setelah submit sukses, keranjang di localStorage dibersihkan dan pengguna diarahkan ke halaman sukses `/cart/sukses?kode=DF-YYMMDD-XXXX`.

### D. Manajemen Pesanan (Admin)
1. **Cara Kerja**: Admin login di `/admin/login`, membuka `/admin/pesanan`, melihat daftar order dengan filter status (`pending`, `confirmed`, `in_progress`, `ready`, `completed`, `cancelled`). Klik order untuk membuka `/admin/pesanan/[id]`, mengubah status, menambahkan catatan internal, dan menekan "Kirim Notifikasi WhatsApp" jika ingin memberi tahu pelanggan.
2. **Aturan Sistem**:
   - Perubahan status memicu pengiriman otomatis notifikasi WhatsApp ke pelanggan (template berbeda untuk tiap transisi status).
   - Admin dapat mengirim ulang notifikasi manual dengan batas 3 kali per 5 menit per order.
   - Setiap perubahan status dicatat di tabel `order_status_logs` (siapa, kapan, dari status apa ke status apa).
   - Order dengan status `completed` atau `cancelled` tidak dapat diubah lagi kecuali oleh Super Admin dengan konfirmasi ulang.
   - Total harga order dihitung ulang di sisi server saat status berpindah dari `draft` → `pending` untuk memastikan konsistensi.

### E. Notifikasi WhatsApp Gateway
1. **Cara Kerja**: Saat order baru dibuat atau status order berubah, sistem memanggil API WhatsApp Gateway (misal: **Fonnte**, **Wablas**, atau **Twilio WhatsApp**) dengan payload nomor tujuan + template pesan. Hasil pengiriman (sukses/gagal, message id, response body) disimpan di tabel `notifications`.
2. **Aturan Sistem**:
   - Template pesan disimpan di database (`message_templates`) agar admin dapat mengubah teks tanpa deploy ulang.
   - Variabel template: `{{nama_pelanggan}}`, `{{kode_order}}`, `{{status}}`, `{{total}}`, `{{link_whatsapp_admin}}`.
   - Retry otomatis 3x dengan exponential backoff (5 detik, 30 detik, 2 menit) jika API mengembalikan error 5xx.
   - Setiap kegagalan dicatat lengkap (status code, response body) untuk troubleshooting.
   - Notifikasi juga dikirim ke nomor admin saat ada order baru masuk (bisa dimatikan via pengaturan).

### F. Kelola Produk ATK & Stok
1. **Cara Kerja**: Admin mengelola produk ATK (pulpen, buku, kertas, amplop, tinta) di `/admin/produk` dengan tabel CRUD, filter kategori, pencarian, dan upload gambar. Stok dikurangi manual saat order ATK selesai.
2. **Aturan Sistem**:
   - Produk dengan stok ≤ `lowStockThreshold` (default 5) ditandai badge amber "Stok Menipis" di dashboard.
   - Produk dengan stok 0 ditandai "Stok Habis" dan tidak dapat dipilih di keranjang publik (tombol dinonaktifkan).
   - Harga jual & harga beli disimpan terpisah untuk nanti digunakan modul laporan.
   - Gambar produk disimpan di object storage (Vercel Blob / Supabase Storage) dan path di kolom `imageUrl`.

---

## 7. Alur Navigasi & Arsitektur Layout
*Peta navigasi alur halaman dan struktur tata letak (layout).*

### Arsitektur Layout (Persisten)
- **Public Layout**: Header dengan logo teks "Dinar Fotocopy" (bold, tracking rapat), menu horizontal (Layanan, ATK, Estimasi, Tentang, Kontak, FAQ), tombol CTA "Pesan via WhatsApp" di kanan. Footer dengan kolom alamat, jam buka, tautan cepat, dan copyright.
- **Admin Layout**: Sidebar kiri fixed (width 240px) dengan brand, daftar menu admin, dan tombol logout di bagian bawah. Header kecil di atas dengan breadcrumb dan dropdown akun admin. Konten utama dengan padding `p-6 lg:p-8`.
- **Auth Layout**: Halaman login dengan kartu di tengah, tanpa sidebar/header publik.

### Bagan Alur (Flowchart)
```mermaid
flowchart TD
    A[Pengunjung Buka Website] --> B[Halaman Beranda]
    B --> C{Pilih Aktivitas}
    C -->|Lihat Layanan| D[Katalog Layanan /layanan]
    C -->|Lihat ATK| E[Katalog Produk /produk]
    C -->|Hitung Dulu| F[Kalkulator /estimasi]
    D --> G[Detail Layanan /layanan/slug]
    E --> H[Detail Produk /produk/slug]
    G --> F
    H --> F
    F --> I[Keranjang /cart]
    I --> J[Isi Form Pelanggan]
    J --> K[Simpan Order ke DB status pending]
    K --> L[Generate Link wa.me]
    L --> M[Buka WhatsApp Pelanggan]
    K --> N[Kirim Notifikasi WA ke Admin]
    M --> O[Admin Cek /admin/pesanan]
    N --> O
    O --> P[Admin Update Status]
    P --> Q[Kirim Notifikasi WA ke Pelanggan]
    Q --> R[Order Selesai /completed]
```
```mermaid
flowchart LR
    subgraph Admin Login Flow
        L1[/admin/login] --> L2{Verifikasi Email & Password}
        L2 -->|Sukses| L3[/admin/dashboard]
        L2 -->|Gagal| L1
        L3 --> L4{Kelola Apa}
        L4 --> L5[Layanan & Harga]
        L4 --> L6[Produk ATK]
        L4 --> L7[Pesanan]
        L4 --> L8[Notifikasi WA]
        L4 --> L9[Pengaturan Toko]
    end
```

---

## 8. Kebutuhan Non-Fungsional (SEO, Keamanan, & Performa)
*Syarat wajib agar website siap rilis ke publik (production-ready).*
- **SEO**:
  - Wajib menggunakan tag `<title>` dinamis dan meta description untuk setiap halaman publik (`/`, `/layanan`, `/layanan/[slug]`, `/produk`, `/produk/[slug]`, `/tentang`, `/kontak`, `/faq`).
  - Open Graph tags (og:title, og:description, og:image, og:url, og:type) dan Twitter Card di seluruh halaman publik.
  - Structured data **LocalBusiness** (schema.org) di beranda untuk menonjolkan alamat & jam buka toko.
  - `sitemap.xml` dan `robots.txt` auto-generate; halaman `/admin/*` wajib `noindex, nofollow`.
  - Canonical URL unik per halaman untuk mencegah duplikasi.
- **Keamanan**:
  - Autentikasi admin menggunakan **Auth.js (NextAuth v5) Credentials Provider** dengan password di-hash **bcrypt (cost 12)**.
  - Proteksi CSRF otomatis dari Next.js Server Actions (built-in) + SameSite=Lax cookie.
  - Sanitasi input di server dengan **Zod** (validasi + transform) sebelum menyentuh database.
  - Rate limiting request sensitif: login (maks 5 percobaan/5 menit/IP), pembuatan order (5/10 menit/IP), kirim ulang notifikasi (3/5 menit/order).
  - Header keamanan wajib aktif: `Content-Security-Policy` dasar, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
  - Audit trail: setiap aksi admin (ubah harga, ubah status order) dicatat di tabel `activity_logs`.
  - Data sensitif tidak pernah dikirim ke client; semua akses DB hanya lewat Server Actions / Server Components.
- **Performa**:
  - Semua gambar publik lewat komponen `<Image>` Next.js dengan `sizes` prop tepat dan format `webp/avif`.
  - Halaman publik statis (`/`, `/tentang`, `/kontak`, `/faq`) di-`revalidate` setiap 5 menit atau on-demand revalidation setelah admin ubah data.
  - Data katalog layanan menggunakan **caching** Next.js (`unstable_cache` / `revalidateTag`) — tag `services`, `products`, `settings`.
  - Lazy loading untuk komponen berat (kalender, chart dashboard) dengan `next/dynamic`.
  - Target: LCP < 2.5 detik, CLS < 0.1, INP < 200ms pada koneksi 4G.
  - Query database diindeks: `services(slug, isActive)`, `orders(status, createdAt)`, `order_items(orderId)`.

---

## 9. Panduan Bahasa, Copywriting, & Data Dummy
*Panduan nada bicara (Tone of Voice) dan contoh data agar prototipe terasa nyata.*
- **Gaya Bahasa**: Profesional, ramah, dan membumi. Gunakan "Anda" untuk pelanggan dan "Kami" untuk pihak Dinar Fotocopy. Hindari jargon teknis di halaman publik. Kalimat pendek, tidak berbunga-bunga. Contoh nada: "Kami cetak cepat, rapi, dan bisa Anda ambil sore ini."
- **Instruksi Data Dummy**: JANGAN PERNAH MENGGUNAKAN "Lorem Ipsum". Selalu gunakan data dummy berbahasa Indonesia yang relevan dengan konteks usaha fotocopy.

Contoh data dummy untuk entitas utama:

**Layanan (`services`)**:
- Fotokopi A4 HVS 70gr — Rp 300/lembar (Hitam Putih).
- Print A4 HVS 70gr — Rp 500/lembar (Hitam Putih), Rp 2.000/lembar (Warna).
- Cetak Foto 4R Glossy — Rp 3.500/lembar.
- Cetak Banner Flexi 280gr — Rp 25.000/m².
- Jilid Spiral A4 — Rp 15.000/buku.
- Laminating A4 — Rp 5.000/lembar.
- Scan Dokumen ke PDF — Rp 1.000/lembar.

**Produk ATK (`products`)**:
- Pulpen Standard AE7 (Hitam) — Rp 3.000, stok 48.
- Kertas HVS A4 70gr (Rim) — Rp 55.000, stok 12.
- Buku Tulis Sidu 38 Lembar — Rp 4.000, stok 60.
- Amplop Cokelat Sedang — Rp 500, stok 100.
- Map Plastik Bening F4 — Rp 2.500, stok 30.

**Pesanan Dummy (`orders`)**:
- Kode: `DF-250120-0001` — Pelanggan: **Rina Kusuma** — WA: `628123456789` — Item: Print A4 Warna 20 lembar, Jilid Spiral 1 buku — Status: `in_progress`.
- Kode: `DF-250120-0002` — Pelanggan: **Pak Hendra** — WA: `628987654321` — Item: Cetak Banner 2×1 m — Status: `pending`.
- Kode: `DF-250121-0003` — Pelanggan: **Bu Sari** — WA: `628135555444` — Item: Fotokopi A4 250 lembar — Status: `completed`.

**Template Notifikasi WhatsApp**:
- Order Baru (ke admin): "Order baru masuk, Bos! Kode {{kode_order}} dari {{nama_pelanggan}} — Total estimasi Rp{{total}}. Cek dashboard: {{link_admin}}."
- Status `in_progress` (ke pelanggan): "Halo {{nama_pelanggan}}, pesanan Anda {{kode_order}} sedang kami kerjakan ya. Estimasi selesai hari ini. Terima kasih 🙏 — Dinar Fotocopy."
- Status `ready` (ke pelanggan): "Kabar baik! Pesanan {{kode_order}} sudah siap diambil di Dinar Fotocopy. Total Rp{{total}}. Terima kasih 🙏."

---

## 10. Fondasi Teknis (Untuk Tim Pengembang / Programmer & AI)
*Petunjuk arsitektur teknis spesifik.*
- **Bahasa & Framework**: **Next.js 15 (App Router) + TypeScript 5** — mendukung Server Components, Server Actions, dan React Server Components untuk performa + SEO optimal.
- **Tampilan Antarmuka (UI)**: **Tailwind CSS v3**, **shadcn/ui** (component library headless), **Lucide Icons** (stroke 1.5), dan **Sonner** untuk toast notifikasi.
- **State Klien**: **Zustand** untuk keranjang estimasi lokal + persist ke `localStorage`.
- **Form & Validasi**: **React Hook Form** + **Zod** dengan resolver `@hookform/resolvers`.
- **Autentikasi**: **Auth.js (NextAuth v5)** dengan **Credentials Provider** (email & password admin). Session berbasis JWT httpOnly cookie. Password hashing dengan **bcrypt**.
- **Basis Data (Database)**: **Neon Serverless PostgreSQL** dengan **Drizzle ORM** dan **Drizzle Kit** untuk migrasi.
- **Object Storage (Upload Gambar Produk)**: **Vercel Blob** (default) atau **Supabase Storage** sebagai alternatif.
- **WhatsApp Gateway**: Abstraksi provider di `/lib/whatsapp/` dengan adapter untuk **Fonnte** (default) atau **Wablas**; mudah ditukar lewat env var.
- **Deployment**: **Vercel** (default). Alternatif: Docker image + VPS jika diperlukan.

### Struktur Skema Database Nyata
File: `src/db/schema.ts`
```typescript
import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============ ENUMS ============
export const orderStatusEnum = pgEnum("order_status", [
  "draft",
  "pending",
  "confirmed",
  "in_progress",
  "ready",
  "completed",
  "cancelled",
]);

export const notificationStatusEnum = pgEnum("notification_status", [
  "queued",
  "sent",
  "failed",
]);

export const userRoleEnum = pgEnum("user_role", ["admin", "super_admin"]);

// ============ USERS (ADMIN) ============
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 180 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("admin"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailUnique: uniqueIndex("users_email_unique").on(t.email),
  })
);

// ============ CATEGORIES ============
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    kind: varchar("kind", { length: 20 }).notNull(), // "service" | "product"
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugUnique: uniqueIndex("categories_slug_unique").on(t.slug),
  })
);

// ============ SERVICES ============
export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull(),
    unit: varchar("unit", { length: 40 }).notNull().default("lembar"), // lembar, buku, m2, dll
    basePrice: integer("base_price").notNull(), // Rupiah, integer
    imageUrl: text("image_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugUnique: uniqueIndex("services_slug_unique").on(t.slug),
    activeIdx: index("services_active_idx").on(t.isActive, t.sortOrder),
  })
);

// ============ SERVICE VARIANTS ============
export const serviceVariants = pgTable(
  "service_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 160 }).notNull(), // contoh: "A4 - Warna - Bolak Balik"
    price: integer("price").notNull(),
    attributes: jsonb("attributes").$type<Record<string, string>>().default({}), // { ukuran: "A4", warna: "warna" }
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    serviceIdx: index("service_variants_service_idx").on(t.serviceId),
  })
);

// ============ PRODUCTS (ATK) ============
export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    description: text("description").notNull(),
    price: integer("price").notNull(),
    costPrice: integer("cost_price").notNull().default(0),
    stock: integer("stock").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugUnique: uniqueIndex("products_slug_unique").on(t.slug),
  })
);

// ============ ORDERS ============
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 24 }).notNull(), // DF-YYMMDD-XXXX
    customerName: varchar("customer_name", { length: 120 }).notNull(),
    customerWhatsapp: varchar("customer_whatsapp", { length: 20 }).notNull(),
    customerNote: text("customer_note"),
    totalEstimate: integer("total_estimate").notNull().default(0),
    finalTotal: integer("final_total"),
    status: orderStatusEnum("status").notNull().default("pending"),
    adminNote: text("admin_note"),
    pickupMethod: varchar("pickup_method", { length: 20 }).notNull().default("pickup"), // pickup | delivery
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    codeUnique: uniqueIndex("orders_code_unique").on(t.code),
    statusIdx: index("orders_status_created_idx").on(t.status, t.createdAt),
  })
);

// ============ ORDER ITEMS ============
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    itemType: varchar("item_type", { length: 10 }).notNull(), // "service" | "product"
    serviceId: uuid("service_id").references(() => services.id, { onDelete: "set null" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    variantLabel: varchar("variant_label", { length: 160 }),
    itemName: varchar("item_name", { length: 180 }).notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull().default(1),
    subtotal: integer("subtotal").notNull(),
    discountPercent: integer("discount_percent").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orderIdx: index("order_items_order_idx").on(t.orderId),
  })
);

// ============ ORDER STATUS LOGS ============
export const orderStatusLogs = pgTable("order_status_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  fromStatus: orderStatusEnum("from_status"),
  toStatus: orderStatusEnum("to_status").notNull(),
  changedByUserId: uuid("changed_by_user_id").references(() => users.id),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============ NOTIFICATIONS ============
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    channel: varchar("channel", { length: 20 }).notNull().default("whatsapp"),
    provider: varchar("provider", { length: 30 }).notNull().default("fonnte"),
    targetNumber: varchar("target_number", { length: 20 }).notNull(),
    templateKey: varchar("template_key", { length: 60 }).notNull(),
    messageBody: text("message_body").notNull(),
    status: notificationStatusEnum("status").notNull().default("queued"),
    providerMessageId: varchar("provider_message_id", { length: 120 }),
    responsePayload: jsonb("response_payload").$type<Record<string, unknown>>(),
    retryCount: integer("retry_count").notNull().default(0),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    orderIdx: index("notifications_order_idx").on(t.orderId),
    statusIdx: index("notifications_status_idx").on(t.status, t.createdAt),
  })
);

// ============ MESSAGE TEMPLATES ============
export const messageTemplates = pgTable(
  "message_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 60 }).notNull(), // "order_created_admin", "status_in_progress_customer", dst
    title: varchar("title", { length: 120 }).notNull(),
    body: text("body").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    keyUnique: uniqueIndex("message_templates_key_unique").on(t.key),
  })
);

// ============ SETTINGS (SINGLETON per key) ============
export const settings = pgTable(
  "settings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: varchar("key", { length: 80 }).notNull(),
    value: jsonb("value").$type<unknown>().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    keyUnique: uniqueIndex("settings_key_unique").on(t.key),
  })
);

// ============ ACTIVITY LOGS ============
export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 80 }).notNull(),
  entity: varchar("entity", { length: 60 }).notNull(),
  entityId: varchar("entity_id", { length: 80 }),
  payload: jsonb("payload").$type<Record<string, unknown>>(),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============ RELATIONS ============
export const categoriesRelations = relations(categories, ({ many }) => ({
  services: many(services),
  products: many(products),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  category: one(categories, { fields: [services.categoryId], references: [categories.id] }),
  variants: many(serviceVariants),
}));

export const serviceVariantsRelations = relations(serviceVariants, ({ one }) => ({
  service: one(services, { fields: [serviceVariants.serviceId], references: [services.id] }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
  statusLogs: many(orderStatusLogs),
  notifications: many(notifications),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  service: one(services, { fields: [orderItems.serviceId], references: [services.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const orderStatusLogsRelations = relations(orderStatusLogs, ({ one }) => ({
  order: one(orders, { fields: [orderStatusLogs.orderId], references: [orders.id] }),
  changedBy: one(users, { fields: [orderStatusLogs.changedByUserId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  order: one(orders, { fields: [notifications.orderId], references: [orders.id] }),
}));
```

Skema `settings` awal (seeder) yang wajib diisi:
```json
{
  "store_name": "Dinar Fotocopy",
  "store_tagline": "Cetak cepat, rapi, dan terpercaya sejak 2015.",
  "store_address": "Jl. Melati No. 22, Kel. Sukamaju, Kota Bandung",
  "store_whatsapp": "628123456789",
  "store_operational_hours": "Senin–Sabtu 08.00–21.00 WIB, Minggu 09.00–17.00 WIB",
  "map_embed_url": "https://www.google.com/maps/embed?pb=...",
  "bulk_discount_rules": [
    { "minQty": 100, "percent": 5 },
    { "minQty": 500, "percent": 10 }
  ],
  "notify_admin_on_new_order": true
}
```

### Variabel Lingkungan (`.env.example`)
```env
# ---------- APP ----------
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ---------- DATABASE (NEON POSTGRES) ----------
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:password@host/dbname?sslmode=require

# ---------- AUTH (NEXTAUTH / AUTH.JS v5) ----------
AUTH_SECRET=generate_with_openssl_rand_base64_32
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true

# ---------- ADMIN SEED ----------
ADMIN_SEED_EMAIL=admin@dinarfotocopy.id
ADMIN_SEED_PASSWORD=ChangeMe_StrongPassword123!
ADMIN_SEED_NAME=Admin Dinar

# ---------- WHATSAPP GATEWAY ----------
WHATSAPP_PROVIDER=fonnte
WHATSAPP_API_URL=https://api.fonnte.com/send
WHATSAPP_API_TOKEN=your_fonnte_or_wablas_token
WHATSAPP_ADMIN_NUMBER=628123456789

# ---------- STORAGE (UPLOAD GAMBAR) ----------
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx

# ---------- RATE LIMIT (UPSTASH — opsional) ----------
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

---

## 11. Tahapan Pengerjaan & Task Breakdown (Actionable Work Breakdown Structure)
*Daftar tugas terstruktur dan terurut (Atomic Tasks) dengan format checklist markdown `- [ ] **Task X.Y**`. Dirancang khusus agar pengguna dapat menginstruksikan AI Coding Assistant (Antigravity, Cursor, Claude Code, Roo Code, dll.) untuk mengeksekusi proyek langkah demi langkah secara terukur, modular, dan bebas dari kehabisan context window.*

> **CATATAN MODE EKSEKUSI: PHASE**
> AI Coding Assistant WAJIB menyelesaikan **1 Fase penuh** dalam satu putaran sebelum berhenti dan meminta konfirmasi user untuk lanjut ke fase berikutnya.

### Tahap 1: Fondasi Proyek, UI/UX, & Semua Halaman dengan Data Dummy
*Tujuan: Membangun seluruh antarmuka visual 100% lengkap dan responsif menggunakan data dummy sebelum menyentuh database. Referensi Bab 3, 4, 7, dan 9.*
- [ ] **Task 1.1 (Foundations & Design System)**: Inisialisasi Next.js 15 + TypeScript di `/dinar-fotocopy`, konfigurasi Tailwind CSS dengan CSS variable token warna sesuai Bab 4 (`--background`, `--foreground`, `--primary`, `--border`, `--accent`, `--muted`), setup font Inter via `next/font`, install Lucide Icons (stroke 1.5) & Sonner, dan install base shadcn/ui components: `button`, `card`, `input`, `textarea`, `label`, `dialog`, `table`, `badge`, `dropdown-menu`, `tabs`, `sheet`, `select`, `sonner`, `form`, `separator`, `skeleton`.
- [ ] **Task 1.2 (Layouts & Persistent Navigation)**: Buat `src/app/(public)/layout.tsx` (Header + Footer) dengan navbar responsif (mobile drawer via Sheet) menampilkan logo teks "Dinar Fotocopy" dan menu: Layanan `/layanan`, ATK `/produk`, Estimasi `/estimasi`, Tentang `/tentang`, Kontak `/kontak`, FAQ `/faq`, CTA "Pesan via WhatsApp". Buat `src/app/(admin)/layout.tsx` (Sidebar fixed 240px + header kecil) dan `src/app/(auth)/layout.tsx` (card di tengah). Setup Zustand store `useCartStore` + persist ke `localStorage` untuk keranjang estimasi.
- [ ] **Task 1.3 (Public Pages — Lengkap dengan Data Dummy)**: Buat seluruh halaman publik berikut dengan data dummy Bahasa Indonesia (Bab 9):
  - `/` Beranda: hero, 5 kartu kategori layanan, section "Hitung Cepat", 3 snippet produk ATK, testimoni, CTA.
  - `/layanan` Katalog Layanan: grid + search bar + filter kategori + sort harga.
  - `/layanan/[slug]` Detail Layanan: header, daftar varian harga (tabel), form input cepat, tombol "Tambah ke Keranjang".
  - `/produk` Katalog ATK: grid + filter kategori + indikator stok (Badge amber "Stok Menipis").
  - `/produk/[slug]` Detail Produk ATK: foto dummy, deskripsi, harga, stok, tombol tambah ke keranjang.
  - `/estimasi` Kalkulator: pilih layanan → varian → qty → sub-total real-time; berlaku diskon otomatis untuk fotokopi (≥100 = 5%, ≥500 = 10%).
  - `/cart` Keranjang + form pelanggan (Nama, WA, Catatan, Pickup/Delivery) + tombol "Pesan via WhatsApp" (generate `wa.me/628123456789?text=...`).
  - `/cart/sukses` Halaman sukses dengan kode dummy `DF-250120-0001`.
  - `/tentang`, `/kontak` (embed Google Maps dummy), `/faq` (accordion 10 pertanyaan), `/kebijakan-privasi`.
- [ ] **Task 1.4 (Auth Page Mockup)**: Buat `/admin/login` lengkap dengan form email & password, validasi Zod client-side, error state, dan loading state. Belum terhubung auth sebenarnya — redirect dummy ke `/admin/dashboard` saat submit.
- [ ] **Task 1.5 (Admin Pages — Lengkap dengan Data Dummy)**: Buat seluruh halaman admin berikut:
  - `/admin/dashboard`: 4 stat card (Pesanan Hari Ini, Menunggu Tindakan, Stok Menipis, Total Selesai Minggu Ini) + tabel pesanan terbaru + grafik 7 hari (Recharts dummy).
  - `/admin/layanan`: tabel + modal CRUD dengan varian harga bertingkat.
  - `/admin/kategori`: tabel CRUD kategori (kind service/product).
  - `/admin/produk`: tabel CRUD produk ATK + indikator stok + upload placeholder.
  - `/admin/pesanan`: tabel dengan filter status (Badge warna berbeda) + search + rentang tanggal.
  - `/admin/pesanan/[id]`: detail order, timeline status (Order Status Logs), tombol ubah status, tombol kirim ulang notifikasi WA (mock toast).
  - `/admin/notifikasi`: log tabel notifikasi (target, template, status, waktu) + detail payload dialog.
  - `/admin/pengaturan`: form pengaturan toko (nama, tagline, alamat, WA, jam buka, aturan diskon, toggle notifikasi admin).
  - `/admin/profil`: ganti nama & password (mock).
  - Pastikan SEMUA halaman responsif mobile, tidak ada placeholder "sedang dikembangkan", semua konten terisi data dummy realistis.

### Tahap 2: Database, Autentikasi, & Integrasi Data Dinamis
*Tujuan: Menghidupkan aplikasi dengan database Neon PostgreSQL, autentikasi admin, dan Server Actions sesuai Bab 10.*
- [ ] **Task 2.1 (Database Schema & Migrations)**: Buat `src/db/schema.ts` sesuai Bab 10, setup `drizzle.config.ts`, jalankan `drizzle-kit generate` + `drizzle-kit migrate` ke Neon PostgreSQL. Buat script `src/db/seed.ts` untuk mengisi: 1 user admin (dari env `ADMIN_SEED_*` dengan password bcrypt), 5 kategori, minimal 10 layanan + varian (dummy Bab 9), 8 produk ATK, 4 message templates, dan semua baris `settings` default.
- [ ] **Task 2.2 (Authentication & Middleware)**: Pasang **Auth.js v5 (NextAuth)** dengan Credentials Provider (bcrypt compare ke tabel `users`), konfigurasi `auth.config.ts` + `auth.ts`, buat `middleware.ts` melindungi `/admin/*` (kecuali `/admin/login`), tambahkan logika `callbackUrl` & auto-redirect ke `/admin/dashboard` jika sudah login. Ganti mock `/admin/login` dengan handler nyata; tambahkan audit log di `activity_logs` setiap login sukses/gagal.
- [ ] **Task 2.3 (Server Actions & Query Layer)**: Buat Server Actions + repository functions di `src/server/actions/` dan `src/server/queries/` untuk entitas: `services`, `serviceVariants`, `categories`, `products`, `orders`, `orderItems`, `notifications`, `messageTemplates`, `settings`, `activityLogs`. Semua input divalidasi Zod (`src/lib/validations/`). Terapkan caching Next.js dengan tag `services`, `products`, `settings`; `revalidateTag(...)` setelah mutasi admin. Implementasi generator kode order `DF-YYMMDD-XXXX` (transaksional dengan `FOR UPDATE` atau penggunaan sequence harian).
- [ ] **Task 2.4 (Frontend Data Binding)**: Ganti seluruh dummy data di halaman publik (`/`, `/layanan`, `/layanan/[slug]`, `/produk`, `/produk/[slug]`, `/estimasi`, `/cart`) dan halaman admin dengan data dari DB via Server Components + Server Actions. Wire: tambah/edit/hapus layanan dari `/admin/layanan` → revalidate `/layanan`. Form `/cart` submit → buat `orders` + `orderItems` (status `pending`) → insert `orderStatusLogs` initial → redirect sukses dengan kode order. Form `/admin/pesanan/[id]` ubah status → update `orders.status` + insert `orderStatusLogs` (audit).

### Tahap 3: Integrasi WhatsApp Gateway, Keamanan, SEO, & Deployment
*Tujuan: Menyempurnakan integrasi eksternal, optimasi performa/keamanan, dan rilis ke production.*
- [ ] **Task 3.1 (WhatsApp Gateway & Webhook)**: Implementasi adapter di `src/lib/whatsapp/` (`fonnte.ts`, `wablas.ts`, `index.ts`). Buat helper `sendWhatsApp({ to, templateKey, variables })` yang: (1) mengambil template dari `message_templates`, (2) render variabel, (3) panggil provider API sesuai `WHATSAPP_PROVIDER`, (4) simpan hasil ke tabel `notifications` (status `queued` → `sent`/`failed`, `providerMessageId`, `responsePayload`). Panggil helper ini dari: (a) Server Action saat order baru dibuat (notif ke `WHATSAPP_ADMIN_NUMBER`), (b) Server Action ubah status order (notif ke `orders.customerWhatsapp`), (c) endpoint retry manual `/api/notifications/[id]/retry`. Tambahkan job retry dengan exponential backoff (5s, 30s, 2m) untuk status `failed` via `vercel cron` atau endpoint `/api/cron/retry-notifications`.
- [ ] **Task 3.2 (SEO, Security, & Non-Functional Requirements)**: Pasang fungsi `generateMetadata` di setiap halaman publik (`/`, `/layanan`, `/layanan/[slug]`, `/produk`, `/produk/[slug]`, `/tentang`, `/kontak`, `/faq`) dengan title, description, OG tags, Twitter Card, canonical. Sertakan JSON-LD `LocalBusiness` di beranda. Generate `sitemap.ts` + `robots.ts` (blok `/admin/*`). Tambahkan header keamanan di `next.config.ts` (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy). Pasang rate limiting di `/admin/login`, Server Action order, dan retry notifikasi (Upstash Redis atau memory fallback). Pastikan semua input disanitasi via Zod sebelum DB. Audit XSS, CSRF (built-in Server Actions), dan validasi semua Server Actions.
- [ ] **Task 3.3 (End-to-End Testing & Bugfix)**: Uji alur lengkap: pengunjung buka beranda → pilih layanan → kalkulator → tambah ke keranjang → isi form → pesan via WhatsApp → admin login → ubah status `pending` → `in_progress` → `ready` → `completed` → notifikasi WA tercatat di `/admin/notifikasi`. Uji admin CRUD layanan (harga otomatis update di `/layanan`). Uji responsive mobile 360px, tablet 768px, desktop 1440px. Uji rate limit, error state, empty state, dan form validation. Perbaiki semua bug & responsive glitch. Optimasi query database (cek N+1, tambahkan index jika perlu), optimasi gambar, dan cek Lighthouse (target performance ≥ 90 untuk halaman publik).
- [ ] **Task 3.4 (Production Build & Deployment)**: Siapkan `.env.production` lengkap, verifikasi `npm run build` lulus tanpa error TypeScript/ESLint, jalankan migrasi produksi ke Neon (`drizzle-kit migrate`), seed `settings` & `message_templates` di lingkungan produksi, set environment variables di Vercel, deploy ke Vercel (atau Docker image jika VPS), konfigurasikan domain custom, aktifkan cron job `retry-notifications`, verifikasi WhatsApp API token produksi bisa terkirim ke nomor test, dan buat akun admin pertama via script seed produksi.

---

## 12. Master Starter Prompt (Siap Coding untuk AI Agent)
*Salin prompt di bawah ini ke AI Coding Assistant (Google Antigravity / Cursor / Claude Code / GitHub Copilot / Roo Code / dll.) untuk memulai pengerjaan:*
```markdown
Halo! Kamu berperan sebagai Senior Fullstack Architect dan Lead Developer.
Saya ingin membangun aplikasi "Dinar Fotocopy" berdasarkan dokumen PRD ini.

Silakan baca file @PRD.md secara menyeluruh sebelum memulai.

KONTEKS PROYEK SINGKAT:
- Nama: Dinar Fotocopy (web app katalog usaha fotocopy).
- Tech Stack: Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui + Lucide + Zustand + Auth.js v5 (Credentials) + Drizzle ORM + Neon PostgreSQL.
- UI/UX: Minimalist & Typography Focused (Inter, border tipis 1px, banyak whitespace, accent amber hsl(38,92%,50%) sangat hemat).
- Model transaksi: TANPA pembayaran online. Pesanan dibuat lewat form → tercatat di DB → diarahkan ke WhatsApp (wa.me).
- Notifikasi: WhatsApp Gateway (Fonnte default, adapter siap untuk Wablas).
- Autentikasi admin: Email & Password (Credentials Provider).

ATURAN EKSEKUSI (WAJIB DIPATUHI — MODE: PHASE):
1. JANGAN PERNAH membuat semua kode atau file sekaligus dalam satu waktu agar tidak kehabisan token atau menyebabkan error massal.
2. Kerjakan proyek Bab 11 secara BERTAHAP per FASE. Selesaikan 1 FASE penuh dalam satu putaran kerja, lalu BERHENTI.
3. Setelah selesai 1 FASE:
   - Laporkan ringkasan file/fitur yang telah selesai.
   - Sebutkan apa yang sudah berjalan dan apa yang belum.
   - Minta konfirmasi eksplisit ke saya ("Lanjut ke Fase 2?" / "Lanjut ke Fase 3?").
   - JANGAN memulai fase berikutnya sebelum saya memberi izin.
4. Selalu patuhi Tech Stack, skema database, Pedoman UI/UX Bab 4, dan struktur folder yang tertulis di PRD.
5. JANGAN membuat halaman placeholder atau "Sedang dalam pengembangan". Semua halaman wajib dibuat lengkap dengan data dummy Bahasa Indonesia realistis (Bab 9) pada Fase 1.

RENCANA FASE (mengacu ke Bab 11):
- FASE 1 → Task 1.1 s.d. 1.5: Fondasi, Design System, Semua Layout, Semua Halaman Publik & Admin (data dummy, 100% lengkap & responsif).
- FASE 2 → Task 2.1 s.d. 2.4: Database Neon + Drizzle, Auth.js admin, Server Actions, Data binding frontend.
- FASE 3 → Task 3.1 s.d. 3.4: WhatsApp Gateway, SEO, Security, Testing, Build & Deploy.

Jika kamu sudah membaca dan memahami PRD, silakan berikan:
1. Ringkasan singkat pemahamanmu (maks 5 poin).
2. Konfirmasi bahwa kamu siap mulai dari FASE 1.
3. Tanyakan kesiapan saya untuk mulai eksekusi Fase 1 sekarang.
```
