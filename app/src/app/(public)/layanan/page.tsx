"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { dummyServices, dummyCategories } from "@/lib/dummy-data";
import { formatRupiah, cn } from "@/lib/utils";

const categoryIconMap: Record<string, string> = {
  "fotokopi-print": "print",
  "cetak-foto-banner": "panorama",
  "jilid-laminating": "auto_stories",
  "scan-digitalisasi": "document_scanner",
  "layanan-lainnya": "more_horiz",
};

const categoryColorMap: Record<string, string> = {
  "fotokopi-print": "text-lumia-cyan",
  "cetak-foto-banner": "text-lumia-cobalt",
  "jilid-laminating": "text-lumia-coral",
  "scan-digitalisasi": "text-lumia-amber",
  "layanan-lainnya": "text-primary",
};

const WA_BASE = "https://wa.me/628123456789";

export default function KatalogLayananPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const filtered = useMemo(() => {
    let result = dummyServices.filter((s) => s.isActive);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== "all") result = result.filter((s) => s.categorySlug === activeCategory);
    if (sortBy === "price-asc") result.sort((a, b) => a.basePrice - b.basePrice);
    if (sortBy === "price-desc") result.sort((a, b) => b.basePrice - a.basePrice);
    return result;
  }, [search, activeCategory, sortBy]);

  return (
    <div
      className="min-h-screen pt-20"
      style={{ background: "radial-gradient(ellipse at top left, #1b0a2a 0%, #100e24 35%, #080612 100%)" }}
    >
      {/* Ambient glow */}
      <div className="fixed top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none -z-0"
        style={{ background: "rgba(0,164,239,0.07)", filter: "blur(80px)" }} />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none -z-0"
        style={{ background: "rgba(255,59,48,0.06)", filter: "blur(80px)" }} />

      <div className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">

          {/* ── Hero Panoramic Header Tile ── */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl" style={{ background: "rgba(32,30,44,0.9)", backdropFilter: "blur(20px)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left info */}
              <div className="lg:col-span-8 p-6 lg:p-10 flex flex-col justify-between gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full w-max text-lumia-cyan text-label-caps"
                    style={{ background: "rgba(0,164,239,0.15)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-lumia-cyan animate-ping" />
                    Tarif Transparan & Terverifikasi
                  </div>
                  <h1 className="text-headline-lg text-on-surface font-light tracking-tight leading-none mt-2">
                    Katalog Layanan <span className="font-semibold text-lumia-cyan">& Tarif Resmi</span>
                  </h1>
                  <p className="text-body-lg text-on-surface-variant max-w-2xl font-light">
                    Standar presisi cetak digital laser metro, jilid skripsi berstandar kampus, flexi outdoor tahan cuaca, serta diskon progresif untuk pemesanan massal.
                  </p>
                </div>
                {/* Realtime metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {[
                    { label: "Mulai Dari", value: "Rp 300", unit: "/lbr", color: "text-lumia-cyan" },
                    { label: "Diskon Grosir", value: "s.d. 10%", unit: "", color: "text-lumia-emerald" },
                    { label: "Mesin Produksi", value: "Fuji & Konica", unit: "", color: "text-on-surface" },
                    { label: "Garansi Hasil", value: "Cetak Ulang", unit: "", color: "text-lumia-amber" },
                  ].map(({ label, value, unit, color }) => (
                    <div key={label} className="p-3 rounded-lg" style={{ background: "rgba(43,40,54,0.7)", backdropFilter: "blur(12px)" }}>
                      <span className="block text-label-caps text-on-surface-variant">{label}</span>
                      <span className={`text-headline-sm font-semibold ${color}`}>{value}<span className="text-xs text-on-surface-variant font-normal">{unit}</span></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right panel */}
              <div className="lg:col-span-4 relative min-h-48 lg:min-h-full overflow-hidden flex flex-col justify-between p-6"
                style={{
                  backgroundImage: "linear-gradient(135deg, #005a9e 0%, #100e24 100%)",
                }}>
                <div className="flex justify-between items-center text-on-surface">
                  <span className="px-2.5 py-1 rounded text-label-caps text-lumia-cyan" style={{ background: "rgba(8,6,18,0.8)" }}>Bandung Hub</span>
                  <span className="material-symbols-outlined text-lumia-cyan">print</span>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "rgba(14,12,26,0.8)", backdropFilter: "blur(12px)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-lumia-emerald animate-pulse" />
                    <span className="text-label-caps text-on-surface tracking-wider">Antrean Cetak Live</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-body-sm text-on-surface-variant">Estimasi Ready</span>
                    <span className="text-headline-sm text-on-surface font-bold">15 – 30 Menit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Filter & Search Control Hub ── */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-xl"
            style={{ background: "rgba(28,26,39,0.7)", backdropFilter: "blur(12px)" }}>
            {/* Category filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "px-4 py-2 rounded-lg text-label-caps tracking-wider transition-all whitespace-nowrap",
                  activeCategory === "all"
                    ? "bg-lumia-cyan text-on-primary-container font-semibold shadow-md"
                    : "bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-glass-surface-hover"
                )}
              >
                Semua
              </button>
              {dummyCategories.service.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-label-caps tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5",
                    activeCategory === cat.slug
                      ? "bg-lumia-cyan text-on-primary-container font-semibold shadow-md"
                      : "bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-glass-surface-hover"
                  )}
                >
                  <span className={`material-symbols-outlined text-sm ${activeCategory === cat.slug ? "text-on-primary-container" : categoryColorMap[cat.slug] || "text-primary"}`}>
                    {categoryIconMap[cat.slug] || "label"}
                  </span>
                  {cat.name}
                </button>
              ))}
            </div>
            {/* Search + sort */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <span className="material-symbols-outlined text-base text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2">search</span>
                <input
                  type="text"
                  placeholder="Cari layanan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg text-on-surface text-body-sm outline-none w-48"
                  style={{ background: "#0e0c1a", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 rounded-lg text-on-surface text-body-sm outline-none"
                style={{ background: "#0e0c1a", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <option value="default">Urutan Default</option>
                <option value="price-asc">Harga: Terendah</option>
                <option value="price-desc">Harga: Tertinggi</option>
              </select>
            </div>
          </div>

          {/* ── Services Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full py-16 flex flex-col items-center gap-4 text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant">search_off</span>
                <p className="text-body-lg text-on-surface-variant">Layanan tidak ditemukan. Coba kata kunci lain.</p>
              </div>
            ) : (
              filtered.map((service) => {
                const iconName = categoryIconMap[service.categorySlug] || "label";
                const iconColor = categoryColorMap[service.categorySlug] || "text-primary";
                return (
                  <div
                    key={service.id}
                    className="rounded-xl p-5 flex flex-col justify-between metro-tile group"
                    style={{ background: "#201e2c", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}
                  >
                    {/* Top */}
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-11 h-11 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.05)" }}>
                          <span className={`material-symbols-outlined text-2xl ${iconColor} group-hover:scale-110 transition-transform`}>
                            {iconName}
                          </span>
                        </div>
                        {(service as any).isPopular && (
                          <span className="px-2 py-0.5 rounded-full text-label-caps text-lumia-cyan font-semibold"
                            style={{ background: "rgba(0,164,239,0.15)" }}>Populer</span>
                        )}
                      </div>
                      <h3 className="text-headline-sm text-on-surface font-semibold leading-snug">{service.name}</h3>
                      <p className="text-body-sm text-on-surface-variant mt-1 line-clamp-2">{service.shortDescription}</p>

                      {/* Price */}
                      <div className="mt-3 pt-3 flex items-baseline justify-between"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                        <span className="text-label-caps text-on-surface-variant">Mulai dari</span>
                        <span className="text-price-display text-lumia-cyan font-bold tabular-nums" style={{ fontSize: "1.25rem" }}>
                          {formatRupiah(service.basePrice)}
                          <span className="text-xs font-normal text-on-surface-variant ml-0.5">/{service.unit}</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <a
                        href={`${WA_BASE}?text=Halo%20Dinar%20Fotocopy%2C%20saya%20ingin%20order%20${encodeURIComponent(service.name)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-lumia-emerald text-on-surface text-body-sm font-semibold hover:brightness-110 active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-base">chat</span>
                        Order WA
                      </a>
                      <Link
                        href="/estimasi"
                        className="px-3 py-2 rounded-lg text-label-caps text-lumia-cyan font-semibold hover:bg-glass-surface transition-all flex items-center gap-1"
                        style={{ border: "1px solid rgba(0,164,239,0.3)" }}
                      >
                        <span className="material-symbols-outlined text-base">calculate</span>
                        Estimasi
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="p-6 rounded-xl flex flex-wrap items-center justify-between gap-4"
            style={{ background: "rgba(0,164,239,0.08)", border: "1px solid rgba(0,164,239,0.2)" }}>
            <div>
              <h3 className="text-headline-sm text-on-surface font-semibold">Tidak menemukan layanan yang dicari?</h3>
              <p className="text-body-sm text-on-surface-variant mt-1">Tim kami siap membantu kebutuhan cetak kustom Anda.</p>
            </div>
            <a
              href={`${WA_BASE}?text=Halo%20Dinar%20Fotocopy%2C%20saya%20butuh%20konsultasi%20layanan`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-semibold text-sm hover:brightness-110 active:scale-95 transition-all"
              style={{ boxShadow: "0 2px 12px rgba(0,164,239,0.3)" }}
            >
              <span className="material-symbols-outlined text-base">chat</span>
              Konsultasi via WhatsApp
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
