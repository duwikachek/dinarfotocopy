"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle, X } from "lucide-react";
import { updateAllStoreSettingsAction } from "@/actions/settings-actions";
import type { StoreSettings } from "@/db/queries";

export default function PengaturanClient({
  initialSettings,
}: {
  initialSettings: StoreSettings;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [toast, setToast] = useState({ msg: "", type: "success" as "success" | "error" });
  const [pending, startTransition] = useTransition();

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await updateAllStoreSettingsAction(settings);
      if (!res.success) {
        showToast(res.error || "Gagal menyimpan pengaturan.", "error");
      } else {
        showToast("Pengaturan berhasil disimpan dan diperbarui!");
        router.refresh();
      }
    });
  };

  const handleDiscountRuleChange = (
    idx: number,
    field: "minQty" | "percent",
    value: string
  ) => {
    setSettings((s) => ({
      ...s,
      bulk_discount_rules: (s.bulk_discount_rules || []).map((rule, i) =>
        i === idx ? { ...rule, [field]: Number(value) || 0 } : rule
      ),
    }));
  };

  const inputCls =
    "w-full h-10 px-3 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors";
  const textareaCls =
    "w-full px-3 py-2 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 resize-none transition-colors";

  const fields: Array<{
    key: keyof StoreSettings;
    label: string;
    type: "text" | "textarea";
    placeholder: string;
    help?: string;
  }> = [
    { key: "store_name", label: "Nama Toko", type: "text", placeholder: "Dinar Fotocopy" },
    { key: "store_tagline", label: "Tagline", type: "text", placeholder: "Cetak cepat, rapi, dan terpercaya." },
    { key: "store_address", label: "Alamat Toko", type: "textarea", placeholder: "Jl. Melati No. 22..." },
    {
      key: "store_whatsapp",
      label: "No. WhatsApp Toko (format internasional)",
      type: "text",
      placeholder: "628123456789",
      help: "Gunakan format internasional tanpa spasi atau tanda plus (contoh: 628123456789)",
    },
    { key: "store_operational_hours", label: "Jam Operasional", type: "text", placeholder: "Senin–Sabtu 08.00–21.00 WIB" },
    { key: "map_embed_url", label: "URL Embed Google Maps", type: "text", placeholder: "https://www.google.com/maps/embed?..." },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Toast */}
      {toast.msg && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-md animate-fade-in ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast.type === "error" ? (
            <X className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
          )}
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Pengaturan Toko</h1>
        <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">
          Konfigurasi informasi toko yang ditampilkan secara langsung ke pengunjung dan pelanggan.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Info Toko */}
        <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
          <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-4">
            Informasi Toko
          </h2>
          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={String(settings[field.key] ?? "")}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    rows={2}
                    className={textareaCls}
                  />
                ) : (
                  <input
                    type="text"
                    value={String(settings[field.key] ?? "")}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className={inputCls}
                  />
                )}
                {field.help && (
                  <p className="text-[11px] text-[hsl(220,10%,55%)] mt-1">{field.help}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Aturan Diskon */}
        <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
          <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-4">
            Aturan Diskon Massal
          </h2>
          <div className="flex flex-col gap-3">
            {(settings.bulk_discount_rules || []).map((rule, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs text-[hsl(220,10%,46%)] w-24 flex-shrink-0">Min. qty</span>
                <input
                  type="number"
                  value={rule.minQty}
                  onChange={(e) => handleDiscountRuleChange(idx, "minQty", e.target.value)}
                  className="w-24 h-9 px-3 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[hsl(224,12%,12%)] focus:outline-none focus:border-[hsl(224,12%,12%)] transition-colors tabular-nums"
                />
                <span className="text-xs text-[hsl(220,10%,46%)]">lembar → diskon</span>
                <input
                  type="number"
                  value={rule.percent}
                  onChange={(e) => handleDiscountRuleChange(idx, "percent", e.target.value)}
                  className="w-16 h-9 px-3 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[hsl(224,12%,12%)] focus:outline-none focus:border-[hsl(224,12%,12%)] transition-colors tabular-nums"
                />
                <span className="text-xs text-[hsl(220,10%,46%)]">%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifikasi */}
        <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
          <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-4">
            Notifikasi
          </h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-[hsl(224,12%,12%)]">Notifikasi WA untuk order baru</p>
              <p className="text-xs text-[hsl(220,10%,55%)]">
                Kirim WhatsApp ke nomor admin saat ada pesanan baru masuk.
              </p>
            </div>
            <div
              onClick={() =>
                setSettings((s) => ({
                  ...s,
                  notify_admin_on_new_order: !s.notify_admin_on_new_order,
                }))
              }
              className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                settings.notify_admin_on_new_order ? "bg-[hsl(224,12%,12%)]" : "bg-[hsl(220,13%,91%)]"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  settings.notify_admin_on_new_order ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] disabled:opacity-60 transition-colors self-start"
        >
          {pending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" strokeWidth={1.5} />
          )}
          {pending ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>
    </div>
  );
}
