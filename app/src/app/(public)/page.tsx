import Link from "next/link";
import type { Metadata } from "next";
import { getStoreSettings } from "@/db/queries";

export const metadata: Metadata = {
  title: "Dinar Fotocopy — Cetak Cepat, Presisi & Rapi di Bandung",
  description:
    "Layanan fotokopi, print, cetak foto, banner, jilid, laminating, dan scan di Bandung. Harga terjangkau, pengerjaan cepat, kualitas terjamin. Pesan via WhatsApp!",
  openGraph: {
    title: "Dinar Fotocopy — Cetak Cepat, Rapi, dan Terpercaya",
    description: "Fotokopi, print, cetak foto & banner, jilid, laminating, scan. Pesan via WhatsApp, siap hari ini.",
    url: "https://dinarfotocopy.id",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function BerandaPage() {
  const settings = await getStoreSettings();
  const waBase = `https://wa.me/${String(settings.store_whatsapp || "628123456789")}`;
  const storeAddress = String(settings.store_address || "Jl. Melati No. 22");
  const storeName = String(settings.store_name || "Dinar Fotocopy");
  const mapUrl = settings.map_embed_url ? "/kontak" : "https://maps.google.com";

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: storeName,
    description: "Layanan fotokopi, print, cetak foto, banner, jilid, laminating, dan scan di Bandung.",
    url: "https://dinarfotocopy.id",
    telephone: `+${settings.store_whatsapp || "628123456789"}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: storeAddress,
      addressLocality: "Bandung",
      addressRegion: "Jawa Barat",
      postalCode: "40123",
      addressCountry: "ID",
    },
    geo: { "@type": "GeoCoordinates", latitude: -6.9175, longitude: 107.6189 },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "08:00", closes: "21:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "10:00", closes: "17:00" },
    ],
    priceRange: "Rp 300 - Rp 150.000",
  };
  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* ─── Page wrapper with atmospheric gradient background ─── */}
      <div
        className="min-h-screen pt-20"
        style={{
          background: "radial-gradient(ellipse at top left, #1b0a2a 0%, #100e24 35%, #080612 100%)",
        }}
      >
        <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-12 py-6">
          {/* Ambient glow blooms */}
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none -z-0"
            style={{ background: "rgba(0,164,239,0.07)", filter: "blur(80px)" }} />
          <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full pointer-events-none -z-0"
            style={{ background: "rgba(245,158,11,0.06)", filter: "blur(80px)" }} />

          <div className="max-w-7xl mx-auto flex flex-col gap-4 relative">

            {/* ── Metro Status Bar ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 rounded-lg"
              style={{ background: "rgba(28,26,39,0.7)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-2 text-label-caps text-on-surface-variant">
                <span className="text-lumia-cyan">DINAR METRO</span>
                <span>/</span>
                <span className="text-on-surface">PUSAT KONTROL & LAYANAN CETAK</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-lumia-emerald animate-ping" />
                  <span className="text-label-caps text-lumia-emerald">MESIN READY 120 PPM</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-on-surface-variant text-label-caps">
                  <span className="material-symbols-outlined text-sm text-lumia-amber">speed</span>
                  <span>Rerata Cetak: 4.8 Menit</span>
                </div>
              </div>
            </div>

            {/* ── Main Asymmetric Metro Bento Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">

              {/* 1. Hero Wide Panoramic Tile (lg:8-cols) */}
              <div
                className="md:col-span-6 lg:col-span-8 relative overflow-hidden rounded-lg flex flex-col justify-between group metro-tile"
                style={{
                  minHeight: "380px",
                  background: "#1c1a27",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                {/* Background image scrim */}
                <div className="absolute inset-0 opacity-20 group-hover:scale-105 transition-transform duration-700 ease-out"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    mixBlendMode: "luminosity",
                  }} />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to right, rgba(27,10,42,0.95) 0%, rgba(16,14,36,0.85) 60%, rgba(0,90,158,0.35) 100%)" }} />

                {/* Top meta bar */}
                <div className="relative z-10 flex items-start justify-between p-6">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
                    <span className="material-symbols-outlined text-sm text-lumia-cyan">verified</span>
                    <span className="text-label-caps text-on-surface font-semibold tracking-widest">EST. 2024 • JAKARTA BARAT</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(0,0,0,0.4)" }}>
                    <span className="w-2.5 h-2.5 rounded-full bg-lumia-cyan" />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.4)" }} />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.4)" }} />
                  </div>
                </div>

                {/* Hero headline */}
                <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-4">
                  <span className="text-label-caps text-lumia-cyan tracking-widest block mb-2">KEANDALAN DOKUMEN PREMISE</span>
                  <h1 className="text-display-hero font-light tracking-tight text-on-surface leading-none">
                    Cetak Cepat,{" "}
                    <span className="font-semibold" style={{ color: "#8ecdff" }}>Presisi</span>{" "}
                    & Rapi.
                  </h1>
                  <p className="mt-3 text-body-md text-on-surface-variant max-w-xl">
                    Spesialis cetak kilat, fotokopi volume tinggi, jilid skripsi hardcover, hingga media promosi outdoor dengan standar kualitas warna CMYK terkalibrasi.
                  </p>
                </div>

                {/* Bottom metric & action bar */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 py-4"
                  style={{ background: "rgba(54,51,66,0.6)", backdropFilter: "blur(20px)" }}>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-tile-stat text-on-surface font-light leading-none">
                        80<span className="text-lumia-cyan font-normal">%</span>
                      </span>
                      <span className="text-label-caps text-on-surface-variant mt-0.5">Selesai Hari Ini</span>
                    </div>
                    <div className="hidden sm:flex flex-col">
                      <span className="text-tile-stat text-lumia-emerald font-light leading-none">
                        0.2<span className="text-xs ml-0.5 text-on-surface">Dtk</span>
                      </span>
                      <span className="text-label-caps text-on-surface-variant mt-0.5">Speed per Halaman</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href="/estimasi"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container text-sm font-semibold hover:brightness-110 active:scale-95 transition-all"
                      style={{ boxShadow: "0 2px 12px rgba(0,164,239,0.3)" }}>
                      <span className="material-symbols-outlined text-base">calculate</span>
                      Hitung Biaya
                    </Link>
                    <a href={`${waBase}?text=Halo%20${encodeURIComponent(storeName)}%2C%20saya%20ingin%20order%20cetak`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lumia-emerald text-on-surface text-sm font-semibold hover:brightness-110 active:scale-95 transition-all">
                      <span className="material-symbols-outlined text-base">chat</span>
                      Order WA
                    </a>
                  </div>
                </div>
              </div>

              {/* 2. Store Pulse Tile (lg:4-cols) */}
              <div className="md:col-span-6 lg:col-span-4 rounded-lg p-5 flex flex-col justify-between relative overflow-hidden"
                style={{ background: "#100e24", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-label-caps text-lumia-cyan tracking-widest">STORE PULSE</span>
                    <span className="text-headline-md text-on-surface font-semibold">{storeName}</span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-lumia-cyan">
                    <span className="material-symbols-outlined text-2xl">storefront</span>
                  </div>
                </div>

                {/* Status widget */}
                <div className="my-4 p-3 rounded-lg flex items-center justify-between"
                  style={{ background: "rgba(28,26,39,0.9)", backdropFilter: "blur(12px)" }}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lumia-amber text-3xl">wb_sunny</span>
                    <div className="flex flex-col">
                      <span className="text-headline-sm font-light text-on-surface">28°C</span>
                      <span className="text-label-caps text-on-surface-variant">Jakarta Barat Cerah</span>
                    </div>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-label-caps text-lumia-emerald font-semibold">Toko Buka</span>
                    <span className="text-body-sm text-on-surface-variant">Hingga 21:00 WIB</span>
                  </div>
                </div>

                {/* Print queue gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-lumia-cyan animate-pulse" />
                      Antrean Cetak Aktif
                    </span>
                    <span className="font-semibold text-on-surface">3 Pesanan</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden bg-surface-container">
                    <div className="bg-lumia-cyan h-full rounded-full transition-all duration-500" style={{ width: "40%" }} />
                  </div>
                  <div className="flex justify-between text-label-caps text-on-surface-variant">
                    <span>Estimasi Tunggu: ≤ 10 Mnt</span>
                    <span className="text-lumia-emerald">Normal Load</span>
                  </div>
                </div>

                {/* Location action */}
                <div className="mt-3 pt-2 flex items-center justify-between text-body-sm"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm text-lumia-coral">location_on</span>
                    <span>{storeAddress}</span>
                  </div>
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                    className="text-label-caps text-lumia-cyan hover:underline font-semibold flex items-center gap-0.5">
                    Rute <span className="material-symbols-outlined text-xs">arrow_outward</span>
                  </a>
                </div>
              </div>

              {/* 3. Service Tiles — 4 Metro flat tiles */}
              {/* Cyan: Fotokopi */}
              <div className="md:col-span-3 lg:col-span-3 min-h-[170px] rounded-lg bg-primary-container text-on-primary-container p-4 flex flex-col justify-between metro-tile cursor-pointer"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                <div className="flex items-start justify-between">
                  <span className="material-symbols-outlined text-3xl font-light">print</span>
                  <span className="px-2 py-0.5 rounded text-label-caps" style={{ background: "rgba(255,255,255,0.2)" }}>Populer</span>
                </div>
                <div>
                  <h3 className="text-headline-md font-semibold leading-snug">Fotokopi & Print A4/F4</h3>
                  <p className="text-body-sm opacity-85 mt-0.5">B/W & Full Color LaserJet</p>
                  <div className="mt-2 pt-2 flex items-baseline justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                    <span className="text-label-caps opacity-70">Mulai Dari</span>
                    <span className="text-lg font-bold tabular-nums">Rp 300<span className="text-xs font-normal">/lbr</span></span>
                  </div>
                </div>
              </div>

              {/* Coral: Jilid */}
              <div className="md:col-span-3 lg:col-span-3 min-h-[170px] rounded-lg bg-lumia-coral text-white p-4 flex flex-col justify-between metro-tile cursor-pointer"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                <div className="flex items-start justify-between">
                  <span className="material-symbols-outlined text-3xl font-light">auto_stories</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(255,255,255,0.2)" }}>5</div>
                </div>
                <div>
                  <h3 className="text-headline-md font-semibold leading-snug">Jilid & Laminasi</h3>
                  <p className="text-body-sm opacity-85 mt-0.5">Spiral Kawat, Mika, & Skripsi</p>
                  <div className="mt-2 pt-2 flex items-baseline justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                    <span className="text-label-caps opacity-70">Hardcover Mulai</span>
                    <span className="text-lg font-bold tabular-nums">Rp 25.000<span className="text-xs font-normal">/buku</span></span>
                  </div>
                </div>
              </div>

              {/* Cobalt: Banner */}
              <div className="md:col-span-3 lg:col-span-3 min-h-[170px] rounded-lg bg-lumia-cobalt text-white p-4 flex flex-col justify-between metro-tile cursor-pointer"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                <div className="flex items-start justify-between">
                  <span className="material-symbols-outlined text-3xl font-light">panorama</span>
                  <span className="material-symbols-outlined text-white/50 text-base">arrow_forward</span>
                </div>
                <div>
                  <h3 className="text-headline-md font-semibold leading-snug">Banner & Foto HD</h3>
                  <p className="text-body-sm opacity-85 mt-0.5">Flexi 340gsm, X-Banner, Pasfoto</p>
                  <div className="mt-2 pt-2 flex items-baseline justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
                    <span className="text-label-caps opacity-70">Harga Meteran</span>
                    <span className="text-lg font-bold tabular-nums">Rp 25.000<span className="text-xs font-normal">/m²</span></span>
                  </div>
                </div>
              </div>

              {/* Amber: Scan */}
              <div className="md:col-span-3 lg:col-span-3 min-h-[170px] rounded-lg bg-lumia-amber text-deep-purple-end p-4 flex flex-col justify-between metro-tile cursor-pointer"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                <div className="flex items-start justify-between">
                  <span className="material-symbols-outlined text-3xl font-light text-deep-purple-end">document_scanner</span>
                  <span className="px-2 py-0.5 rounded text-label-caps font-semibold" style={{ background: "rgba(0,0,0,0.15)" }}>ADF High Speed</span>
                </div>
                <div>
                  <h3 className="text-headline-md font-bold leading-snug text-deep-purple-end">Scan & Arsip PDF</h3>
                  <p className="text-body-sm opacity-80 mt-0.5 text-deep-purple-end">Scan cepat 600dpi OCR siap kirim</p>
                  <div className="mt-2 pt-2 flex items-baseline justify-between" style={{ borderTop: "1px solid rgba(0,0,0,0.15)" }}>
                    <span className="text-label-caps opacity-70 text-deep-purple-end">Tarif Scan</span>
                    <span className="text-lg font-bold tabular-nums text-deep-purple-end">Rp 1.000<span className="text-xs font-normal">/dokumen</span></span>
                  </div>
                </div>
              </div>

              {/* 4. Quick Calculator Tile (lg:7-cols) */}
              <div className="md:col-span-6 lg:col-span-7 rounded-lg p-6 flex flex-col justify-between"
                id="kalkulator-cepat"
                style={{ background: "#201e2c", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg text-on-primary-container">calculate</span>
                    </div>
                    <div>
                      <h2 className="text-headline-sm text-on-surface font-semibold">Kalkulator Estimasi Instan</h2>
                      <p className="text-body-sm text-on-surface-variant">Simulasikan rincian pesanan dan kirim via WhatsApp</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-surface-container-high text-lumia-cyan text-label-caps font-bold">
                    Real-Time Tariff
                  </span>
                </div>

                {/* Form grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-label-caps text-on-surface-variant block">Jenis Layanan</label>
                    <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-surface-container-lowest">
                      <div className="py-1.5 px-2 rounded text-sm text-center font-semibold bg-primary-container text-on-primary-container">Print Baru</div>
                      <div className="py-1.5 px-2 rounded text-sm text-center font-normal text-on-surface-variant">Fotokopi</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-label-caps text-on-surface-variant block">Warna Cetak</label>
                    <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-surface-container-lowest">
                      <div className="py-1.5 px-2 rounded text-sm text-center font-semibold bg-primary-container text-on-primary-container">Hitam Putih</div>
                      <div className="py-1.5 px-2 rounded text-sm text-center font-normal text-on-surface-variant">Warna (FC)</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-label-caps text-on-surface-variant block">Ukuran & Gramatur</label>
                    <select className="w-full text-on-surface text-body-sm rounded-lg px-3 py-2 outline-none bg-surface-container-lowest"
                      style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                      <option>A4 75gsm (Standar Dokumen)</option>
                      <option>A4 80gsm (Skripsi / Laporan)</option>
                      <option>F4 / Folio 75gsm</option>
                      <option>A3 80gsm</option>
                      <option>Art Paper 230gsm</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-label-caps text-on-surface-variant block">Finishing / Penjilidan</label>
                    <select className="w-full text-on-surface text-body-sm rounded-lg px-3 py-2 outline-none bg-surface-container-lowest"
                      style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                      <option>Tanpa Jilid (Staples Biasa)</option>
                      <option>Jilid Spiral Kawat (+Rp 8.000)</option>
                      <option>Jilid Hardcover (+Rp 25.000)</option>
                      <option>Laminasi Glossy/Doff (+Rp 3.000)</option>
                    </select>
                  </div>
                </div>

                {/* Total bar */}
                <div className="mt-5 pt-4 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg flex flex-wrap items-center justify-between gap-4"
                  style={{ background: "rgba(43,40,54,0.6)" }}>
                  <div>
                    <span className="text-label-caps text-on-surface-variant block">Total Estimasi Transparan</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-price-display text-lumia-emerald font-bold tabular-nums">Rp 17.500</span>
                      <span className="text-body-sm text-on-surface-variant font-mono">(@ Rp 350 / lbr)</span>
                    </div>
                  </div>
                  <Link href="/estimasi"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-lumia-emerald text-on-surface font-semibold text-sm hover:brightness-110 active:scale-95 transition-all"
                    style={{ boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}>
                    <span className="material-symbols-outlined text-lg">calculate</span>
                    Hitung Lengkap
                  </Link>
                </div>
              </div>

              {/* 5. Live Order Tracking Tile (lg:5-cols) */}
              <div className="md:col-span-6 lg:col-span-5 rounded-lg p-5 flex flex-col justify-between"
                style={{ background: "#201e2c", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-label-caps text-lumia-cyan tracking-wider block">LIVE STATUS TRACKER</span>
                      <h3 className="text-headline-md text-on-surface font-semibold">Lacak Pesanan Anda</h3>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-lumia-cyan">
                      <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                    </div>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-1.5">
                    Masukkan ID Nota / WhatsApp untuk cek status pengerjaan dokumen.
                  </p>
                  {/* Search */}
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: DF-2401"
                      className="flex-1 text-on-surface px-3 py-2 rounded-lg text-body-sm font-mono outline-none"
                      style={{ background: "#0e0c1a", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                    <button className="px-4 bg-primary-container text-on-primary-container text-sm font-semibold rounded-lg hover:brightness-110 transition-all flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">search</span>
                      Cek
                    </button>
                  </div>

                  {/* Active order preview */}
                  <div className="mt-4 p-3 rounded-lg space-y-2 bg-surface-container-lowest">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-body-sm font-semibold text-primary">#DF-240198</span>
                      <span className="px-2 py-0.5 rounded-full text-label-caps text-lumia-cyan font-semibold"
                        style={{ background: "rgba(0,164,239,0.15)" }}>Sedang Dicetak</span>
                    </div>
                    <div className="text-body-sm text-on-surface">Jilid Hardcover Skripsi TI (3 Eks)</div>
                    <div className="text-xs text-on-surface-variant">Pemesan: Rizky Fadillah • Masuk: 14:10 WIB</div>
                    {/* Progress steps */}
                    <div className="grid grid-cols-4 gap-1 pt-2">
                      <div className="h-1.5 rounded-full bg-lumia-emerald" />
                      <div className="h-1.5 rounded-full bg-lumia-cyan animate-pulse" />
                      <div className="h-1.5 rounded-full bg-surface-container-highest" />
                      <div className="h-1.5 rounded-full bg-surface-container-highest" />
                    </div>
                    <div className="flex justify-between text-label-caps text-on-surface-variant">
                      <span className="text-lumia-emerald">Penerimaan</span>
                      <span className="text-lumia-cyan font-bold">Produksi</span>
                      <span>QC</span>
                      <span>Siap</span>
                    </div>
                  </div>
                </div>

                {/* WA file shortcut */}
                <div className="mt-3 p-3 rounded-lg flex items-center justify-between text-body-sm"
                  style={{ background: "rgba(43,40,54,0.4)" }}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lumia-amber">cloud_upload</span>
                    <span className="text-on-surface-variant">Kirim file PDF lewat WhatsApp?</span>
                  </div>
                  <a href={`${waBase}?text=Halo%20${encodeURIComponent(storeName)}%2C%20saya%20kirim%20file%20untuk%20dicetak`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-label-caps text-lumia-amber font-bold hover:underline">Kirim File</a>
                </div>
              </div>

              {/* 6. ATK Showcase Tile — Emerald */}
              <div className="md:col-span-3 lg:col-span-4 rounded-lg bg-lumia-emerald text-on-surface p-5 flex flex-col justify-between relative overflow-hidden group metro-tile"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-label-caps text-white/80 block">KATALOG ATK LENGKAP</span>
                    <h3 className="text-headline-md font-bold text-white leading-snug">Stationery & Kertas</h3>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ background: "rgba(0,0,0,0.2)" }}>
                    <span className="material-symbols-outlined text-2xl">edit_note</span>
                  </div>
                </div>
                <div className="my-3 space-y-1.5 text-sm text-white/90">
                  {[
                    ["PaperOne A4 75gsm (Rim)", "Rp 48.000"],
                    ["Map Snellhecter Plastik", "Rp 4.500"],
                    ["Bolpoin Pilot G2 0.5 Black", "Rp 16.000"],
                  ].map(([name, price]) => (
                    <div key={name} className="flex justify-between py-1 px-2 rounded" style={{ background: "rgba(0,0,0,0.1)" }}>
                      <span>{name}</span>
                      <span className="font-semibold text-white">{price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-label-caps text-white/75">Ready Stock • Grosir / Ecer</span>
                  <Link href="/produk"
                    className="px-3 py-1 rounded bg-white text-deep-purple-end text-label-caps font-bold hover:bg-white/90 transition-all flex items-center gap-1">
                    Lihat Katalog
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* 7. Commitment Tile */}
              <div className="md:col-span-3 lg:col-span-4 rounded-lg p-5 flex flex-col justify-between"
                style={{ background: "#1c1a27", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-label-caps text-lumia-cyan tracking-wider">KOMITMEN LAYANAN</span>
                  <span className="material-symbols-outlined text-lumia-emerald text-base">verified</span>
                </div>
                <div className="my-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0"
                    style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }}>
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-lumia-emerald">verified_user</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-headline-sm text-on-surface font-semibold">Garansi Cetak Ulang</div>
                    <p className="text-body-sm text-on-surface-variant line-clamp-2">
                      Jika hasil buram, miring, atau salah tinta, kami ganti cetak 100% gratis seketika.
                    </p>
                  </div>
                </div>
                <div className="p-2 rounded flex items-center justify-between text-xs text-on-surface-variant bg-surface-container-lowest">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-lumia-amber">star</span>
                    Rating Google 4.9/5 (480+ Ulasan)
                  </span>
                  <span className="text-primary font-semibold">Terverifikasi</span>
                </div>
              </div>

              {/* 8. Realtime Feed Tile */}
              <div className="md:col-span-6 lg:col-span-4 rounded-lg p-5 flex flex-col justify-between"
                style={{ background: "#100e24", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-lumia-coral animate-ping" />
                    <span className="text-label-caps text-on-surface font-semibold tracking-wider">ANTREAN REAL-TIME</span>
                  </div>
                  <span className="font-mono text-label-caps text-lumia-cyan">LIVE METRO FEED</span>
                </div>
                <div className="space-y-2">
                  {[
                    { id: "DF-250120-089", status: "Print Poster A3 Selesai", icon: "check_circle", color: "text-lumia-emerald" },
                    { id: "DF-250120-090", status: "Fotokopi 200 Lbr (Proses)", icon: "sync", color: "text-lumia-cyan" },
                    { id: "DF-250120-091", status: "Jilid Spiral (Dalam Antrean)", icon: "pending", color: "text-lumia-amber" },
                  ].map(({ id, status, icon, color }) => (
                    <div key={id} className="p-2 rounded flex items-center justify-between text-body-sm bg-surface-container">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-sm ${color}`}>{icon}</span>
                        <span className="text-on-surface font-mono text-xs">{id}</span>
                      </div>
                      <span className={`text-xs ${color}`}>{status}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-label-caps text-on-surface-variant pt-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span>Pembaruan otomatis tiap 30 dtk</span>
                  <span className="text-lumia-emerald flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-lumia-emerald" /> Aktif
                  </span>
                </div>
              </div>

            </div>

            {/* ── Urgent CTA Banner ── */}
            <div className="mt-2 p-5 rounded-lg flex flex-wrap items-center justify-between gap-4"
              style={{ background: "rgba(43,40,54,0.8)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(0,164,239,0.2)" }}>
                  <span className="material-symbols-outlined text-3xl text-lumia-cyan">electric_bolt</span>
                </div>
                <div>
                  <h4 className="text-headline-sm text-on-surface font-semibold">Butuh Cetak Cepat Hari Ini Juga?</h4>
                  <p className="text-body-sm text-on-surface-variant">
                    Kirim file PDF via WhatsApp sebelum jam 17:00 untuk pengambilan kilat tanpa antre.
                  </p>
                </div>
              </div>
              <a
                href={`${waBase}?text=Halo%20${encodeURIComponent(storeName)}%2C%20saya%20punya%20dokumen%20urgent%20mau%20dicetak`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-lumia-emerald text-on-surface font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
                style={{ boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
              >
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
                Kirim Dokumen Urgent Sekarang
              </a>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
