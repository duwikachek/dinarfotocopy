"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { formatRupiah, cn } from "@/lib/utils";
import { createOrderAction } from "@/actions/order-actions";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalEstimate, getServiceItems, getProductItems } =
    useCartStore();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", whatsapp: "", note: "", pickup: "pickup" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = getTotalEstimate();
  const serviceItems = getServiceItems();
  const productItems = getProductItems();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 3) errs.name = "Nama minimal 3 karakter.";
    const cleaned = form.whatsapp.replace(/[\s\-\+\(\)]/g, "");
    if (!/^\d{10,15}$/.test(cleaned)) errs.whatsapp = "Nomor WhatsApp harus 10–15 digit angka.";
    if (form.note.length > 500) errs.note = "Catatan maksimal 500 karakter.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);
    try {
      const res = await createOrderAction({
        customerName: form.name,
        customerWhatsapp: form.whatsapp,
        customerNote: form.note || undefined,
        pickupMethod: form.pickup as "pickup" | "delivery",
        items: items.map((item) => ({
          type: item.type,
          serviceId: item.type === "service" ? item.serviceId : undefined,
          productId: item.type === "product" ? item.productId : undefined,
          name: item.type === "service" ? item.serviceName : item.productName,
          variantLabel: item.type === "service" ? item.variantLabel : undefined,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          discountPercent: item.type === "service" ? item.discountPercent : 0,
        })),
      });
      if (!res.success) {
        setErrors({ general: res.error || "Gagal membuat pesanan." });
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      clearCart();
      if (res.whatsappUrl) window.open(res.whatsappUrl, "_blank");
      router.push(`/cart/sukses?kode=${res.orderCode}`);
    } catch {
      setErrors({ general: "Terjadi gangguan koneksi. Silakan coba kembali." });
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen pt-20 flex items-center justify-center"
        style={{ background: "radial-gradient(ellipse at top left, #1b0a2a 0%, #100e24 35%, #080612 100%)" }}
      >
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-xl bg-surface-container mx-auto mb-5 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">shopping_cart</span>
          </div>
          <h1 className="text-headline-md text-on-surface font-semibold mb-2">Keranjang kosong</h1>
          <p className="text-body-sm text-on-surface-variant mb-6">
            Tambahkan layanan atau produk ATK ke keranjang untuk melanjutkan pemesanan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/estimasi"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-primary-container text-on-primary-container font-semibold text-sm hover:brightness-110 transition-all"
              style={{ boxShadow: "0 2px 12px rgba(0,164,239,0.3)" }}>
              <span className="material-symbols-outlined text-base">calculate</span>
              Hitung Estimasi
            </Link>
            <Link href="/layanan"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-on-surface-variant hover:text-on-surface transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              Lihat Layanan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20"
      style={{ background: "radial-gradient(ellipse at top left, #1b0a2a 0%, #100e24 35%, #080612 100%)" }}
    >
      {/* Ambient bloom */}
      <div className="fixed top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none -z-0"
        style={{ background: "rgba(0,164,239,0.07)", filter: "blur(80px)" }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-lumia-cyan text-xl">shopping_cart</span>
            <h1 className="text-headline-md text-on-surface font-semibold">Keranjang Estimasi</h1>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            {items.length} item · Total estimasi{" "}
            <span className="font-semibold text-lumia-cyan tabular-nums">{formatRupiah(total)}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* ── Cart Items ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Service items */}
            {serviceItems.length > 0 && (
              <div>
                <p className="text-label-caps text-on-surface-variant mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-lumia-cyan">print</span>
                  Layanan Cetak
                </p>
                <div className="flex flex-col gap-3">
                  {serviceItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl"
                      style={{ background: "#201e2c", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-semibold text-on-surface truncate">{item.serviceName}</p>
                          <p className="text-xs text-on-surface-variant truncate">{item.variantLabel}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{formatRupiah(item.unitPrice)} / satuan</p>
                        </div>
                        <button onClick={() => removeItem(item.id)}
                          className="text-on-surface-variant hover:text-lumia-coral transition-colors shrink-0 p-1">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                            className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold flex items-center justify-center disabled:opacity-40 transition-all">
                            −
                          </button>
                          <span className="w-10 text-center text-sm font-bold tabular-nums text-on-surface">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= 10000}
                            className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold flex items-center justify-center disabled:opacity-40 transition-all">
                            +
                          </button>
                          {item.discountPercent > 0 && (
                            <span className="text-xs text-lumia-emerald font-medium">–{item.discountPercent}%</span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-lumia-cyan tabular-nums">{formatRupiah(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product items */}
            {productItems.length > 0 && (
              <div>
                <p className="text-label-caps text-on-surface-variant mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-lumia-amber">inventory_2</span>
                  Produk ATK
                </p>
                <div className="flex flex-col gap-3">
                  {productItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl"
                      style={{ background: "#201e2c", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-semibold text-on-surface truncate">{item.productName}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{formatRupiah(item.unitPrice)} / pcs</p>
                        </div>
                        <button onClick={() => removeItem(item.id)}
                          className="text-on-surface-variant hover:text-lumia-coral transition-colors shrink-0 p-1">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                            className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold flex items-center justify-center disabled:opacity-40 transition-all">
                            −
                          </button>
                          <span className="w-10 text-center text-sm font-bold tabular-nums text-on-surface">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.maxStock))}
                            disabled={item.quantity >= item.maxStock}
                            className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold flex items-center justify-center disabled:opacity-40 transition-all">
                            +
                          </button>
                        </div>
                        <p className="text-sm font-bold text-lumia-cyan tabular-nums">{formatRupiah(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cart actions */}
            <div className="flex items-center gap-4 pt-2">
              <Link href="/estimasi"
                className="text-body-sm text-lumia-cyan hover:underline flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-base">add</span>
                Tambah item
              </Link>
              <span className="text-outline-variant">·</span>
              <button onClick={clearCart}
                className="text-body-sm text-lumia-coral hover:underline flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-base">delete_sweep</span>
                Kosongkan keranjang
              </button>
            </div>
          </div>

          {/* ── Order Form ── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="sticky top-24 rounded-xl overflow-hidden"
              style={{ background: "rgba(28,26,39,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>

              {/* Form header */}
              <div className="p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h2 className="text-headline-sm text-on-surface font-semibold">Data Pemesan</h2>
                <p className="text-body-sm text-on-surface-variant mt-0.5">Lengkapi form untuk melanjutkan</p>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {errors.general && (
                  <div className="p-3 rounded-lg text-body-sm text-lumia-coral"
                    style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.2)" }}>
                    {errors.general}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="name" className="text-label-caps text-on-surface-variant block mb-1.5">
                    Nama Lengkap <span className="text-lumia-coral">*</span>
                  </label>
                  <input
                    id="name" type="text" placeholder="Contoh: Budi Santoso"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={cn(
                      "w-full px-3 py-2 text-body-sm rounded-lg outline-none transition-all",
                      errors.name
                        ? "border-lumia-coral"
                        : ""
                    )}
                    style={{ background: "#0e0c1a", border: errors.name ? "1px solid #ff3b30" : "1px solid rgba(255,255,255,0.1)" }}
                  />
                  {errors.name && <p className="text-xs text-lumia-coral mt-1">{errors.name}</p>}
                </div>

                {/* WhatsApp */}
                <div>
                  <label htmlFor="wa" className="text-label-caps text-on-surface-variant block mb-1.5">
                    Nomor WhatsApp <span className="text-lumia-coral">*</span>
                  </label>
                  <input
                    id="wa" type="tel" placeholder="0812-3456-789"
                    value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    style={{ background: "#0e0c1a", border: errors.whatsapp ? "1px solid #ff3b30" : "1px solid rgba(255,255,255,0.1)" }}
                    className="w-full px-3 py-2 text-body-sm rounded-lg outline-none"
                  />
                  {errors.whatsapp && <p className="text-xs text-lumia-coral mt-1">{errors.whatsapp}</p>}
                </div>

                {/* Pickup method */}
                <div>
                  <label htmlFor="pickup" className="text-label-caps text-on-surface-variant block mb-1.5">
                    Metode Pengambilan
                  </label>
                  <select
                    id="pickup" value={form.pickup} onChange={(e) => setForm({ ...form, pickup: e.target.value })}
                    style={{ background: "#0e0c1a", border: "1px solid rgba(255,255,255,0.1)" }}
                    className="w-full px-3 py-2 text-body-sm rounded-lg outline-none text-on-surface"
                  >
                    <option value="pickup">Ambil di toko</option>
                    <option value="delivery">Antar (hubungi admin)</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="note" className="text-label-caps text-on-surface-variant block mb-1.5">
                    Catatan / Preferensi Tambahan
                  </label>
                  <textarea
                    id="note" placeholder="Misal: kertas A4 HVS 80gr, print bolak-balik, dll."
                    value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={3}
                    style={{ background: "#0e0c1a", border: "1px solid rgba(255,255,255,0.1)" }}
                    className="w-full px-3 py-2 text-body-sm rounded-lg outline-none resize-none text-on-surface"
                  />
                  <p className="text-xs text-on-surface-variant/60 mt-1">{form.note.length}/500 karakter</p>
                  {errors.note && <p className="text-xs text-lumia-coral mt-1">{errors.note}</p>}
                </div>

                {/* Summary & Submit */}
                <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-label-caps text-on-surface-variant">Total Estimasi</span>
                    <span className="text-price-display text-lumia-emerald font-bold tabular-nums" style={{ fontSize: "1.5rem" }}>
                      {formatRupiah(total)}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-lumia-emerald text-on-surface font-semibold text-sm hover:brightness-110 disabled:opacity-60 disabled:pointer-events-none active:scale-95 transition-all"
                    style={{ boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 rounded-full animate-spin"
                          style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">chat</span>
                        Pesan via WhatsApp
                      </>
                    )}
                  </button>
                  <p className="text-xs text-on-surface-variant/60 mt-3 text-center">
                    Pesanan akan dicatat & WhatsApp akan terbuka otomatis.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
