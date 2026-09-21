# Dinar Fotocopy — Web App Katalog & Estimasi Biaya Cetak

Web app katalog digital untuk usaha **Dinar Fotocopy** yang menampilkan daftar layanan cetak, kalkulator estimasi biaya real-time, katalog produk ATK, dan pemesanan instan via WhatsApp (deep-link) tanpa perlu registrasi akun pelanggan. Dilengkapi panel admin berbasis peran untuk manajemen pesanan, layanan, inventaris ATK, dan integrasi WhatsApp Gateway otomatis.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, React Server Components)
- **Bahasa**: TypeScript 5
- **Styling**: Tailwind CSS, shadcn/ui design tokens, Lucide Icons (stroke 1.5)
- **State Management**: Zustand (Client-side Cart & LocalStorage persistence)
- **Basis Data**: Neon Serverless PostgreSQL + Drizzle ORM
- **Autentikasi Admin**: Auth.js v5 (NextAuth) dengan Credentials Provider + bcryptjs
- **Notifikasi**: WhatsApp Gateway Abstraction Layer (Adapter Fonnte default, siap Wablas)

---

## 📁 Struktur Direktori

```text
dinar-fotocopy/
├── PRD_Dinar_Fotocopy.md        # Dokumen Spesifikasi Produk (PRD)
├── README.md                    # Dokumentasi Proyek
└── app/                         # Direktori Next.js App
    ├── drizzle/                 # File migrasi SQL Drizzle
    ├── drizzle.config.ts        # Konfigurasi Drizzle Kit
    ├── next.config.ts           # Konfigurasi Next.js & Security Headers
    ├── package.json             # Dependencies & scripts
    ├── .env.example             # Template variabel lingkungan
    ├── .env.local               # Variabel lingkungan lokal
    └── src/
        ├── actions/             # Server Actions (order, service, product, settings)
        ├── app/                 # App Router (Public, Auth, Admin, API routes)
        │   ├── (admin)/         # Rute Admin (/admin/dashboard, /admin/pesanan, dll)
        │   ├── (auth)/          # Rute Login Admin (/admin/login)
        │   ├── (public)/        # Rute Publik (/, /layanan, /produk, /cart, dll)
        │   ├── api/auth/        # Handler API NextAuth
        │   ├── robots.ts        # Robots.txt generator
        │   └── sitemap.ts       # Sitemap.xml generator
        ├── auth.config.ts       # Konfigurasi Edge/Middleware Auth.js
        ├── auth.ts              # Konfigurasi Auth.js Credentials Provider & DB
        ├── components/          # Komponen UI Reusable & Layout
        ├── db/                  # Skema Drizzle, Client Connection & Seeder
        │   ├── index.ts         # Inisialisasi client Neon Drizzle
        │   ├── schema.ts        # 12 Tabel skema database relasional
        │   └── seed.ts          # Script pengisi data dummy awal
        ├── lib/                 # Utility, data dummy, & WhatsApp adapters
        │   └── whatsapp/        # Abstraksi Fonnte, Wablas, & Logger
        ├── middleware.ts        # Protected Route Middleware untuk /admin/*
        └── store/               # Zustand Cart Store
```

---

## 🛠️ Panduan Memulai di Lokal

### 1. Masuk ke Direktori Proyek
```bash
cd app
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
Sesuaikan nilai variabel berikut:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require
AUTH_SECRET=dinar_fotocopy_super_secret_local_jwt_key_random_32_chars
NEXTAUTH_SECRET=dinar_fotocopy_super_secret_local_jwt_key_random_32_chars

# WhatsApp Gateway (Fonnte)
WHATSAPP_GATEWAY_PROVIDER=fonnte
FONNTE_TOKEN=your_token_here
```

### 4. Setup Database & Seeding (Neon PostgreSQL)
Jalankan perintah push skema dan seeder data awal:
```bash
# Push skema tabel ke database Neon
npm run db:push

# Isi database dengan data awal (admin, kategori, layanan, produk, template)
npm run db:seed
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🔐 Kredensial Default Admin

Gunakan kredensial berikut untuk masuk ke dashboard admin di `/admin/login`:

- **URL Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@dinarfotocopy.id`
- **Password**: `Password123!`
- **Role**: `super_admin`

*(Dilengkapi fallback development otomatis sehingga admin dapat login meskipun database eksternal belum dihubungkan).*

---

## 📲 Alur Pemesanan & WhatsApp Gateway

1. Pelanggan menambahkan layanan/ATK ke keranjang di `/estimasi` atau `/cart`.
2. Pelanggan mengisi nama & no. WhatsApp lalu klik **Pesan via WhatsApp**.
3. Sistem secara otomatis:
   - Memvalidasi data & menghitung ulang harga di server.
   - Memberikan diskon otomatis untuk cetak massal (≥100 lembar diskon 5%, ≥500 lembar diskon 10%).
   - Menyimpan draft pesanan dengan kode unik format `DF-YYMMDD-XXXX`.
   - Mengarahkan pelanggan ke tautan WhatsApp resmi toko (`wa.me`).
   - Mengirimkan pesan notifikasi order baru ke pemilik toko via WhatsApp Gateway.
4. Admin dapat memperbarui status pesanan di dashboard, yang akan memicu pengiriman pesan WhatsApp otomatis ke pelanggan sesuai template status (`in_progress`, `ready`, `completed`).

---

## 🚢 Panduan Deployment ke Vercel

1. Push repository ke GitHub.
2. Impor proyek ke dashboard [Vercel](https://vercel.com).
3. Set **Root Directory** ke folder `app`.
4. Tambahkan Environment Variables di Vercel:
   - `DATABASE_URL` (dari Neon Console)
   - `AUTH_SECRET` (generate string acak 32 karakter via `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (`https://domain-anda.vercel.app`)
   - `NEXT_PUBLIC_APP_URL` (`https://domain-anda.vercel.app`)
   - `WHATSAPP_GATEWAY_PROVIDER` (`fonnte`)
   - `FONNTE_TOKEN` (dari dashboard Fonnte)
5. Klik **Deploy**.
