import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ ERROR: DATABASE_URL belum diatur di .env.local!");
  console.log("Silakan masukkan URL koneksi Neon PostgreSQL Anda ke .env.local terlebih dahulu.");
  process.exit(1);
}

const sql = neon(dbUrl);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Memulai seeding data Dinar Fotocopy...");

  // 1. SEED SETTINGS TOKO
  console.log("-> Seeding tabel settings...");
  const defaultSettings = [
    {
      key: "store_profile",
      value: {
        store_name: "Dinar Fotocopy",
        store_tagline: "Cetak cepat, rapi, dan terpercaya sejak 2015.",
        store_address: "Jl. Melati No. 22, Kel. Sukamaju, Kota Bandung",
        store_whatsapp: "628123456789",
        store_operational_hours: "Senin–Sabtu 08.00–21.00 WIB, Minggu 09.00–17.00 WIB",
        map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8044444444446!2d107.6189!3d-6.9175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMDMuMCJTIDEwN8KwMzcnMDguMCJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
      },
    },
    {
      key: "bulk_discount_rules",
      value: [
        { minQty: 100, percent: 5 },
        { minQty: 500, percent: 10 },
      ],
    },
    {
      key: "notification_config",
      value: {
        notify_admin_on_new_order: true,
        admin_whatsapp: "628123456789",
        provider: "fonnte",
      },
    },
  ];

  for (const s of defaultSettings) {
    await db
      .insert(schema.settings)
      .values(s)
      .onConflictDoUpdate({
        target: schema.settings.key,
        set: { value: s.value, updatedAt: new Date() },
      });
  }

  // 2. SEED TEMPLATE NOTIFIKASI
  console.log("-> Seeding tabel message_templates...");
  const templates = [
    {
      key: "order_created_admin",
      title: "Notifikasi Pesanan Baru ke Pemilik",
      body: "Order baru masuk, Bos! Kode {{kode_order}} dari {{nama_pelanggan}} — Total estimasi Rp{{total}}. Cek dashboard: {{link_admin}}.",
    },
    {
      key: "order_created_customer",
      title: "Konfirmasi Pesanan Baru ke Pelanggan",
      body: "Halo {{nama_pelanggan}}, pesanan Anda {{kode_order}} telah kami terima dengan total estimasi Rp{{total}}. Kami akan segera memeriksa berkas Anda. Terima kasih 🙏 — Dinar Fotocopy.",
    },
    {
      key: "status_in_progress_customer",
      title: "Update Sedang Dikerjakan",
      body: "Halo {{nama_pelanggan}}, pesanan Anda {{kode_order}} sedang kami kerjakan ya. Estimasi selesai hari ini. Terima kasih 🙏 — Dinar Fotocopy.",
    },
    {
      key: "status_ready_customer",
      title: "Pesanan Siap Diambil",
      body: "Kabar baik! Pesanan {{kode_order}} sudah selesai dan siap diambil di Dinar Fotocopy. Total biaya: Rp{{total}}. Silakan datang ke toko. Terima kasih 🙏.",
    },
  ];

  for (const t of templates) {
    await db
      .insert(schema.messageTemplates)
      .values(t)
      .onConflictDoUpdate({
        target: schema.messageTemplates.key,
        set: { title: t.title, body: t.body, updatedAt: new Date() },
      });
  }

  // 3. SEED USER ADMIN
  console.log("-> Seeding user default admin...");
  // Hash standar bcrypt untuk "Password123!" ($2a$12$e8s3/P/...)
  const defaultAdminHash = "$2a$12$ljZt1mK5kXhZJvK.EwO19.XqfV13XvIe8lDfZ/lW5H9q0xHwT4K6a"; // fallback hash
  await db
    .insert(schema.users)
    .values({
      name: "Admin Dinar Fotocopy",
      email: "admin@dinarfotocopy.id",
      passwordHash: defaultAdminHash,
      role: "super_admin",
      isActive: true,
    })
    .onConflictDoNothing();

  // 4. SEED KATEGORI
  console.log("-> Seeding kategori layanan & produk...");
  const categoriesData = [
    { name: "Fotokopi & Print", slug: "fotokopi-print", kind: "service", sortOrder: 1 },
    { name: "Cetak Foto & Banner", slug: "cetak-foto-banner", kind: "service", sortOrder: 2 },
    { name: "Jilid & Laminating", slug: "jilid-laminating", kind: "service", sortOrder: 3 },
    { name: "Scan & Digitalisasi", slug: "scan-digitalisasi", kind: "service", sortOrder: 4 },
    { name: "Layanan Lainnya", slug: "layanan-lainnya", kind: "service", sortOrder: 5 },
    { name: "Alat Tulis", slug: "alat-tulis", kind: "product", sortOrder: 1 },
    { name: "Kertas & Buku", slug: "kertas-buku", kind: "product", sortOrder: 2 },
    { name: "Amplop & Map", slug: "amplop-map", kind: "product", sortOrder: 3 },
    { name: "Tinta & Spidol", slug: "tinta-spidol", kind: "product", sortOrder: 4 },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const inserted = await db
      .insert(schema.categories)
      .values(cat)
      .onConflictDoUpdate({
        target: schema.categories.slug,
        set: { name: cat.name, sortOrder: cat.sortOrder },
      })
      .returning({ id: schema.categories.id, slug: schema.categories.slug });

    if (inserted[0]) {
      categoryMap[inserted[0].slug] = inserted[0].id;
    }
  }

  // 5. SEED PRODUK ATK
  console.log("-> Seeding produk ATK...");
  const productsData = [
    {
      categorySlug: "alat-tulis",
      name: "Pulpen Standard AE7 (Hitam)",
      slug: "pulpen-standard-ae7-hitam",
      description: "Pulpen gel hitam 0.5mm berkualitas tinggi, tinta lancar dan tahan lama.",
      price: 3000,
      costPrice: 2000,
      stock: 48,
      lowStockThreshold: 10,
    },
    {
      categorySlug: "kertas-buku",
      name: "Kertas HVS A4 70gr (Rim 500 lembar)",
      slug: "kertas-hvs-a4-70gr-rim",
      description: "Kertas HVS putih bersih ukuran A4 isi 500 lembar, cocok untuk fotokopi dan print.",
      price: 55000,
      costPrice: 48000,
      stock: 12,
      lowStockThreshold: 5,
    },
    {
      categorySlug: "kertas-buku",
      name: "Buku Tulis Sidu 38 Lembar",
      slug: "buku-tulis-sidu-38-lembar",
      description: "Buku tulis bergaris ukuran standar 38 lembar, kertas tebal tidak tembus tinta.",
      price: 4000,
      costPrice: 2800,
      stock: 60,
      lowStockThreshold: 15,
    },
    {
      categorySlug: "amplop-map",
      name: "Amplop Cokelat Tali F4 (Lembar)",
      slug: "amplop-cokelat-tali-f4",
      description: "Amplop cokelat dengan penutup tali, kuat dan aman untuk mengirim dokumen arsip.",
      price: 2000,
      costPrice: 1200,
      stock: 35,
      lowStockThreshold: 10,
    },
    {
      categorySlug: "amplop-map",
      name: "Map Plastik Bening F4 (Folder)",
      slug: "map-plastik-bening-f4",
      description: "Map plastik bening untuk menyimpan dokumen laporan dan arsip agar tidak kotor.",
      price: 2500,
      costPrice: 1500,
      stock: 40,
      lowStockThreshold: 10,
    },
  ];

  for (const p of productsData) {
    const catId = categoryMap[p.categorySlug];
    if (!catId) continue;
    await db
      .insert(schema.products)
      .values({
        categoryId: catId,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        costPrice: p.costPrice,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
      })
      .onConflictDoUpdate({
        target: schema.products.slug,
        set: {
          name: p.name,
          price: p.price,
          costPrice: p.costPrice,
          stock: p.stock,
          description: p.description,
          updatedAt: new Date(),
        },
      });
  }

  // 6. SEED SERVICES & VARIANTS
  console.log("-> Seeding layanan & varian harga...");
  const servicesData = [
    {
      categorySlug: "fotokopi-print",
      name: "Fotokopi Dokumen",
      slug: "fotokopi-dokumen",
      shortDescription: "Fotokopi cepat dan rapi untuk berbagai ukuran kertas.",
      description: "Layanan fotokopi hitam putih dengan kertas HVS 70gr berkualitas. Cocok untuk fotokopi KTP, ijazah, dokumen kantor, soal ujian, dan berbagai keperluan sehari-hari.",
      unit: "lembar",
      basePrice: 300,
      sortOrder: 1,
      variants: [
        { label: "A4 HVS 70gr — Hitam Putih", price: 300, attributes: { ukuran: "A4", warna: "hitam-putih" }, sortOrder: 1 },
        { label: "A4 HVS 70gr — Bolak-Balik", price: 550, attributes: { ukuran: "A4", warna: "hitam-putih", sisi: "bolak-balik" }, sortOrder: 2 },
        { label: "F4 HVS 70gr — Hitam Putih", price: 350, attributes: { ukuran: "F4", warna: "hitam-putih" }, sortOrder: 3 },
        { label: "A3 — Hitam Putih", price: 700, attributes: { ukuran: "A3", warna: "hitam-putih" }, sortOrder: 4 },
      ],
    },
    {
      categorySlug: "fotokopi-print",
      name: "Print Dokumen",
      slug: "print-dokumen",
      shortDescription: "Print dokumen Word, PDF, Excel, dan PowerPoint.",
      description: "Layanan cetak dokumen digital dengan mesin laser tajam. Pilihan hitam putih dan berwarna berkualitas tinggi.",
      unit: "lembar",
      basePrice: 500,
      sortOrder: 2,
      variants: [
        { label: "A4 HVS 70gr — Hitam Putih", price: 500, attributes: { ukuran: "A4", warna: "hitam-putih" }, sortOrder: 1 },
        { label: "A4 HVS 70gr — Warna Teks", price: 1000, attributes: { ukuran: "A4", warna: "warna-ringan" }, sortOrder: 2 },
        { label: "A4 HVS 70gr — Full Warna", price: 2000, attributes: { ukuran: "A4", warna: "full-warna" }, sortOrder: 3 },
        { label: "F4 HVS 70gr — Hitam Putih", price: 600, attributes: { ukuran: "F4", warna: "hitam-putih" }, sortOrder: 4 },
        { label: "F4 HVS 70gr — Full Warna", price: 2500, attributes: { ukuran: "F4", warna: "full-warna" }, sortOrder: 5 },
      ],
    },
    {
      categorySlug: "cetak-foto-banner",
      name: "Cetak Banner / Spanduk",
      slug: "cetak-banner",
      shortDescription: "Cetak banner outdoor & indoor berbagai ukuran per meter persegi.",
      description: "Layanan cetak banner bahan Flexi berkualitas tinggi. Tahan air dan panas matahari, cocok untuk promosi toko dan acara.",
      unit: "m2",
      basePrice: 25000,
      sortOrder: 3,
      variants: [
        { label: "Flexi Standar 280gr (Rp/m²)", price: 25000, attributes: { bahan: "flexi-280gr", tipe: "outdoor" }, sortOrder: 1 },
        { label: "Flexi Tebal 340gr (Rp/m²)", price: 35000, attributes: { bahan: "flexi-340gr", tipe: "outdoor" }, sortOrder: 2 },
        { label: "Flexi Korea 440gr (Rp/m²)", price: 50000, attributes: { bahan: "flexi-440gr", tipe: "semi-indoor" }, sortOrder: 3 },
      ],
    },
    {
      categorySlug: "jilid-laminating",
      name: "Jilid Dokumen & Skripsi",
      slug: "jilid-dokumen",
      shortDescription: "Jilid spiral, softcover, dan hardcover untuk laporan & skripsi.",
      description: "Layanan penjilidan profesional untuk laporan, skripsi, proposal, dan dokumen tebal lainnya.",
      unit: "buku",
      basePrice: 15000,
      sortOrder: 4,
      variants: [
        { label: "Jilid Spiral Kawat A4 (≤100 lembar)", price: 15000, attributes: { jenis: "spiral", ukuran: "A4" }, sortOrder: 1 },
        { label: "Jilid Softcover A4 — Warna", price: 25000, attributes: { jenis: "softcover", ukuran: "A4" }, sortOrder: 2 },
        { label: "Jilid Hardcover Skripsi A4 — Tinta Emas", price: 45000, attributes: { jenis: "hardcover", ukuran: "A4" }, sortOrder: 3 },
      ],
    },
    {
      categorySlug: "jilid-laminating",
      name: "Laminating",
      slug: "laminating",
      shortDescription: "Laminating glossy & doff untuk kartu, sertifikat, dan dokumen penting.",
      description: "Melindungi dokumen penting dari kerusakan, air, dan debu dengan plastik laminating berkualitas.",
      unit: "lembar",
      basePrice: 5000,
      sortOrder: 5,
      variants: [
        { label: "A4 — Glossy", price: 5000, attributes: { ukuran: "A4", finish: "glossy" }, sortOrder: 1 },
        { label: "F4 — Glossy", price: 6000, attributes: { ukuran: "F4", finish: "glossy" }, sortOrder: 2 },
        { label: "KTP / ID Card", price: 3000, attributes: { ukuran: "id-card", finish: "glossy" }, sortOrder: 3 },
      ],
    },
    {
      categorySlug: "scan-digitalisasi",
      name: "Scan Dokumen ke PDF",
      slug: "scan-dokumen",
      shortDescription: "Scan dokumen ke PDF atau JPG resolusi tinggi.",
      description: "Layanan digitalisasi dokumen fisik ke format PDF/JPG tajam hingga 600 DPI, siap kirim via WhatsApp atau email.",
      unit: "lembar",
      basePrice: 1000,
      sortOrder: 6,
      variants: [
        { label: "A4 ke PDF — per lembar", price: 1000, attributes: { ukuran: "A4", format: "pdf" }, sortOrder: 1 },
        { label: "F4 ke PDF — per lembar", price: 1500, attributes: { ukuran: "F4", format: "pdf" }, sortOrder: 2 },
      ],
    },
  ];

  for (const s of servicesData) {
    const catId = categoryMap[s.categorySlug];
    if (!catId) continue;

    const insertedService = await db
      .insert(schema.services)
      .values({
        categoryId: catId,
        name: s.name,
        slug: s.slug,
        shortDescription: s.shortDescription,
        description: s.description,
        unit: s.unit,
        basePrice: s.basePrice,
        sortOrder: s.sortOrder,
      })
      .onConflictDoUpdate({
        target: schema.services.slug,
        set: {
          name: s.name,
          shortDescription: s.shortDescription,
          description: s.description,
          unit: s.unit,
          basePrice: s.basePrice,
          sortOrder: s.sortOrder,
          updatedAt: new Date(),
        },
      })
      .returning({ id: schema.services.id });

    const serviceId = insertedService[0]?.id;
    if (serviceId && s.variants) {
      for (const v of s.variants) {
        await db.insert(schema.serviceVariants).values({
          serviceId,
          label: v.label,
          price: v.price,
          attributes: v.attributes as Record<string, string>,
          sortOrder: v.sortOrder,
        });
      }
    }
  }

  console.log("✅ Seeding selesai dengan sukses!");
}

seed().catch((err) => {
  console.error("❌ Gagal melakukan seeding:", err);
  process.exit(1);
});
