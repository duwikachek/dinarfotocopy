"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { dummyServices } from "@/lib/dummy-data";
import { formatRupiah, calculateBulkDiscount, calculateSubtotal } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const WA_BASE = "https://wa.me/628123456789";

export default function EstimasiPage() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(50);
  const [bannerWidth, setBannerWidth] = useState<number>(1);
  const [bannerHeight, setBannerHeight] = useState<number>(1);

  const addServiceItem = useCartStore((s) => s.addServiceItem);

  const selectedService = dummyServices.find((s) => s.id === selectedServiceId);
  const selectedVariant = selectedService?.variants.find((v) => v.id === selectedVariantId);
  const isBanner = selectedService?.isBannerService ?? false;

  useEffect(() => {
    setSelectedVariantId("");
    setQuantity(50);
    setBannerWidth(1);
    setBannerHeight(1);
  }, [selectedServiceId]);

  const calc = useMemo(() => {
    if (!selectedVariant) return null;
    let qty = quantity;
    const unitPrice = selectedVariant.price;
    if (isBanner) qty = bannerWidth * bannerHeight;
    const isBulkEligible = selectedService?.isBulkDiscountEligible ?? false;
    const discountPercent = isBulkEligible ? calculateBulkDiscount(qty) : 0;
    const subtotal = calculateSubtotal(unitPrice, qty, discountPercent);
    return { qty, unitPrice, discountPercent, subtotal };
  }, [selectedVariant, quantity, bannerWidth, bannerHeight, isBanner, selectedService]);

  const handleAddToCart = () => {
    if (!selectedService || !selectedVariant || !calc) return;
    if (isBanner) {
      addServiceItem({
        type: "service",
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        variantId: selectedVariant.id,
        variantLabel: `${selectedVariant.label} — ${bannerWidth}×${bannerHeight} m`,
        unitPrice: selectedVariant.price,
        quantity: bannerWidth * bannerHeight,
        isBulkEligible: false,
        bannerWidth,
        bannerHeight,
      });
    } else {
      addServiceItem({
        type: "service",
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        variantId: selectedVariant.id,
        variantLabel: selectedVariant.label,
        unitPrice: selectedVariant.price,
        quantity,
        isBulkEligible: selectedService.isBulkDiscountEligible ?? false,
      });
    }
  };

  const sendQuotationWA = () => {
    if (!calc || !selectedService || !selectedVariant) return;
    const sizeInfo = isBanner
      ? `Ukuran: ${bannerWidth}×${bannerHeight} m (${(bannerWidth * bannerHeight).toFixed(2)} m²)`
      : `Jumlah: ${quantity} ${selectedService.unit}`;
    const msg = `Halo Dinar Fotocopy, saya ingin order via web:%0A- Layanan: ${selectedService.name}%0A- Varian: ${selectedVariant.label}%0A- ${sizeInfo}%0A- Diskon: ${calc.discountPercent}%%0A- Estimasi Total: ${formatRupiah(calc.subtotal)}%0AMohon konfirmasi. Terima kasih!`;
    window.open(`${WA_BASE}?text=${msg}`, "_blank");
  };

  return (
    <div
      className="min-h-screen pt-20"
      style={{ background: "radial-gradient(ellipse at top left, #1b0a2a 0%, #100e24 35%, #080612 100%)" }}
    >
      {/* Ambient blooms */}
      <div className="fixed top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none -z-0"
        style={{ background: "rgba(0,164,239,0.07)", filter: "blur(80px)" }} />
      <div className="fixed top-1/3 right-0 w-80 h-80 rounded-full pointer-events-none -z-0"
        style={{ background: "rgba(245,158,11,0.06)", filter: "blur(80px)" }} />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">

        {/* ── Header Tiles ── */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Main header tile */}
          <div className="lg:col-span-8 p-6 lg:p-8 rounded-xl flex flex-col justify-between gap-4"
            style={{ background: "rgba(28,26,39,0.9)", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-lumia-cyan text-label-caps"
                style={{ background: "rgba(0,164,239,0.15)" }}>
                <span className="material-symbols-outlined text-sm">calculate</span>
                Sistem Estimasi Transparan
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant text-label-caps">
                <span className="w-2 h-2 rounded-full bg-lumia-emerald animate-pulse" />
                Harga Terupdate Real-Time
              </div>
            </div>
            <div>
              <h1 className="text-headline-lg text-on-surface font-light tracking-tight leading-none">
                Kalkulator Biaya <span className="font-semibold text-lumia-cyan">Cetak & Dokumen</span>
              </h1>
              <p className="text-body-md text-on-surface-variant max-w-2xl mt-2">
                Sesuaikan spesifikasi dokumen, tipe kertas, jumlah eksemplar, dan opsi finishing secara instan dengan diskon volume otomatis.
              </p>
            </div>
            {/* Quick presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-on-surface-variant text-label-caps mr-1">Preset Cepat:</span>
              {[
                { label: "Skripsi (A4 80g + Jilid)", serviceId: "print-a4" },
                { label: "Makalah Mahasiswa (70g)", serviceId: "fotokopi" },
                { label: "Banner Outdoor", serviceId: "banner" },
              ].map(({ label, serviceId }) => (
                <button
                  key={label}
                  onClick={() => setSelectedServiceId(serviceId)}
                  className="px-3 py-1 rounded-lg text-on-surface text-body-sm transition-all hover:bg-surface-variant"
                  style={{ background: "rgba(43,40,54,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics tiles */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-lumia-cyan flex flex-col justify-between"
              style={{ boxShadow: "0 4px 16px rgba(0,164,239,0.3)" }}>
              <div className="flex justify-between items-start">
                <span className="text-label-caps text-on-primary/80">Kapasitas Harian</span>
                <span className="material-symbols-outlined text-xl text-on-primary">speed</span>
              </div>
              <div>
                <div className="text-tile-stat text-on-primary font-light leading-none">45k+</div>
                <p className="text-body-sm text-on-primary/90 mt-1">Halaman/Hari Siap</p>
              </div>
            </div>
            <div className="p-4 rounded-xl flex flex-col justify-between"
              style={{ background: "rgba(28,26,39,0.9)", backdropFilter: "blur(20px)", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
              <div className="flex justify-between items-start">
                <span className="text-label-caps text-lumia-amber">Tier Grosir</span>
                <span className="material-symbols-outlined text-xl text-lumia-amber">loyalty</span>
              </div>
              <div>
                <div className="text-headline-md text-on-surface font-semibold">&gt; 100 Lembar</div>
                <p className="text-body-sm text-on-surface-variant mt-0.5">Diskon 5% – 15%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Two-Column Workspace ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

          {/* LEFT: Step-by-step configurator */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Step 1: Service selector */}
            <div className="p-5 rounded-xl"
              style={{ background: "rgba(28,26,39,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-label-caps flex items-center justify-center font-bold">1</span>
                  <span className="text-headline-sm text-on-surface font-semibold">Pilih Kategori Layanan</span>
                </div>
                <span className="text-on-surface-variant text-label-caps">Pilih Satu</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {dummyServices.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`p-3 rounded-xl flex flex-col items-start gap-2 transition-all text-left ${
                      selectedServiceId === s.id
                        ? "bg-primary-container text-on-primary-container shadow-md"
                        : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-2xl ${selectedServiceId === s.id ? "text-on-primary-container" : "text-lumia-cyan"}`}>
                      {s.categorySlug === "fotokopi-print" ? "content_copy" : s.categorySlug === "cetak-foto-banner" ? "ad_units" : s.categorySlug === "jilid-laminating" ? "menu_book" : "print"}
                    </span>
                    <span className="text-body-sm font-semibold">{s.name.split(" ").slice(0, 2).join(" ")}</span>
                    <span className={`text-label-caps ${selectedServiceId === s.id ? "text-on-primary-container/80" : "text-on-surface-variant"}`}>
                      Mulai {formatRupiah(s.basePrice)}
                    </span>
                  </button>
                ))}
              </div>
              {/* Full list select */}
              <div className="mt-3">
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-on-surface text-body-sm outline-none"
                  style={{ background: "#0e0c1a", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <option value="">-- Pilih layanan lainnya --</option>
                  {dummyServices.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Variant selector */}
            {selectedService && (
              <div className="p-5 rounded-xl animate-fade-in"
                style={{ background: "rgba(28,26,39,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-label-caps flex items-center justify-center font-bold">2</span>
                  <span className="text-headline-sm text-on-surface font-semibold">Pilih Varian & Kertas</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {selectedService.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-all text-left ${
                        selectedVariantId === v.id
                          ? "bg-primary-container text-on-primary-container"
                          : "text-on-surface hover:bg-surface-container-high"
                      }`}
                      style={{
                        border: selectedVariantId === v.id
                          ? "1px solid rgba(0,164,239,0.5)"
                          : "1px solid rgba(255,255,255,0.08)"
                      }}
                    >
                      <span className="font-medium">{v.label}</span>
                      <span className={`font-bold tabular-nums ${selectedVariantId === v.id ? "text-on-primary-container" : "text-lumia-cyan"}`}>
                        {formatRupiah(v.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Quantity */}
            {selectedVariant && (
              <div className="p-5 rounded-xl animate-fade-in"
                style={{ background: "rgba(28,26,39,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-label-caps flex items-center justify-center font-bold">3</span>
                  <span className="text-headline-sm text-on-surface font-semibold">
                    {isBanner ? "Ukuran Banner (meter)" : `Jumlah (${selectedService?.unit})`}
                  </span>
                </div>

                {isBanner ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Panjang (m)", value: bannerWidth, setter: setBannerWidth },
                      { label: "Tinggi (m)", value: bannerHeight, setter: setBannerHeight },
                    ].map(({ label, value, setter }) => (
                      <div key={label}>
                        <label className="text-label-caps text-on-surface-variant block mb-2">{label}</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setter((v) => Math.max(0.5, v - 0.5))}
                            className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-lg flex items-center justify-center transition-all"
                          >−</button>
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => setter(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                            step="0.5" min="0.5"
                            className="w-16 text-center text-headline-sm font-semibold text-lumia-cyan rounded-lg py-1 outline-none bg-surface-container-high"
                          />
                          <button
                            onClick={() => setter((v) => v + 0.5)}
                            className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-lg flex items-center justify-center transition-all"
                          >+</button>
                        </div>
                      </div>
                    ))}
                    <div className="col-span-2">
                      <p className="text-body-sm text-on-surface-variant">
                        Luas: <strong className="text-lumia-amber">{(bannerWidth * bannerHeight).toFixed(2)} m²</strong>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-container-lowest">
                      <div>
                        <span className="text-label-caps text-on-surface-variant block">Jumlah Lembar</span>
                        <span className="text-body-sm text-on-surface">Input kuantitas halaman</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 10))}
                          className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-lg flex items-center justify-center transition-all"
                          disabled={quantity <= 1}
                        >−</button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, Math.min(10000, parseInt(e.target.value) || 1)))}
                          min={1} max={10000}
                          className="w-20 text-center text-headline-sm font-semibold text-lumia-cyan rounded-lg py-1 outline-none bg-surface-container-high"
                        />
                        <button
                          onClick={() => setQuantity((q) => Math.min(10000, q + 10))}
                          className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-lg flex items-center justify-center transition-all"
                        >+</button>
                      </div>
                    </div>

                    {/* Bulk discount notice */}
                    {selectedService?.isBulkDiscountEligible && (
                      <div className="flex items-start gap-2 mt-3 p-3 rounded-lg"
                        style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <span className="material-symbols-outlined text-base text-lumia-amber shrink-0">info</span>
                        <p className="text-body-sm text-lumia-amber">
                          Diskon otomatis: ≥100 lembar dapat 5%, ≥500 lembar dapat 10%.
                          {quantity >= 500 ? " 🎉 Anda mendapat diskon 10%!" : quantity >= 100 ? " 🎉 Anda mendapat diskon 5%!" : " Tambah hingga 100 lembar untuk diskon 5%."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Sticky Price Summary Panel */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-xl overflow-hidden"
              style={{ background: "rgba(28,26,39,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>

              {/* Header */}
              <div className="p-5 flex items-center gap-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg text-on-primary-container">calculate</span>
                </div>
                <div>
                  <h2 className="text-headline-sm text-on-surface font-semibold">Ringkasan Estimasi</h2>
                  <p className="text-body-sm text-on-surface-variant">Harga transparan real-time</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {!calc ? (
                  <div className="text-center py-10">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">calculate</span>
                    <p className="text-body-sm text-on-surface-variant mt-3">
                      Pilih layanan dan varian untuk melihat estimasi harga.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-3 mb-5">
                      {[
                        { label: "Layanan", value: selectedService?.name },
                        { label: "Varian", value: selectedVariant?.label },
                        { label: "Harga Satuan", value: formatRupiah(calc.unitPrice), mono: true },
                        {
                          label: isBanner ? "Luas" : "Jumlah",
                          value: isBanner ? `${(bannerWidth * bannerHeight).toFixed(2)} m²` : `${quantity} ${selectedService?.unit}`,
                          mono: true
                        },
                      ].map(({ label, value, mono }) => (
                        <div key={label} className="flex justify-between items-start gap-2 text-body-sm">
                          <span className="text-on-surface-variant">{label}</span>
                          <span className={`font-medium text-on-surface text-right max-w-[160px] leading-tight ${mono ? "font-mono tabular-nums" : ""}`}>{value}</span>
                        </div>
                      ))}
                      {calc.discountPercent > 0 && (
                        <div className="flex justify-between text-body-sm">
                          <span className="text-lumia-emerald">Diskon Massal</span>
                          <span className="font-semibold text-lumia-emerald">–{calc.discountPercent}%</span>
                        </div>
                      )}
                    </div>

                    {/* Total bar */}
                    <div className="pt-4 mb-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <span className="text-label-caps text-on-surface-variant block">Total Estimasi Transparan</span>
                      <span className="text-price-display text-lumia-emerald font-bold tabular-nums block mt-1">
                        {formatRupiah(calc.subtotal)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={sendQuotationWA}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-lumia-emerald text-on-surface font-semibold text-sm hover:brightness-110 active:scale-95 transition-all"
                        style={{ boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
                      >
                        <span className="material-symbols-outlined text-lg">send</span>
                        Kirim Draft via WA
                      </button>
                      <button
                        onClick={handleAddToCart}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary-container text-on-primary-container font-semibold text-sm hover:brightness-110 active:scale-95 transition-all"
                        style={{ boxShadow: "0 2px 12px rgba(0,164,239,0.3)" }}
                      >
                        <span className="material-symbols-outlined text-lg">shopping_cart</span>
                        Tambah ke Keranjang
                      </button>
                      <Link
                        href="/cart"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-label-caps text-on-surface-variant hover:text-on-surface transition-all"
                        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        Lihat Keranjang
                      </Link>
                    </div>

                    <p className="text-xs text-on-surface-variant/60 mt-4 leading-relaxed">
                      * Estimasi dapat berubah setelah kami periksa berkas Anda. Harga sudah termasuk kertas standar.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
