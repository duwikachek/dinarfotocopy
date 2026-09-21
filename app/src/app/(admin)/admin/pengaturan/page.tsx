"use client";

import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import { dummySettings } from "@/lib/dummy-data";

export default function AdminPengaturanPage() {
  const [settings, setSettings] = useState({ ...dummySettings, store_whatsapp: "628123456789" });
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const fields = [
    { key: "store_name" as const, label: "Nama Toko", type: "text", placeholder: "Dinar Fotocopy" },
    { key: "store_tagline" as const, label: "Tagline", type: "text", placeholder: "Cetak cepat, rapi, dan terpercaya." },
    { key: "store_address" as const, label: "Alamat Toko", type: "textarea", placeholder: "Jl. Melati No. 22..." },
    { key: "store_whatsapp" as const, label: "No. WhatsApp Toko (internasional)", type: "text", placeholder: "628123456789" },
    { key: "store_operational_hours" as const, label: "Jam Operasional", type: "text", placeholder: "Senin–Sabtu 08.00–21.00 WIB" },
    { key: "map_embed_url" as const, label: "URL Embed Google Maps", type: "text", placeholder: "https://www.google.com/maps/embed?..." },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-medium shadow-md animate-fade-in">
          <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
          Pengaturan berhasil disimpan!
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Pengaturan Toko</h1>
        <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">Konfigurasi informasi toko yang ditampilkan ke pelanggan.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Info Toko */}
        <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
          <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-4">Informasi Toko</h2>
          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    value={String(settings[field.key])}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[#4a2c11] placeholder:text-[#967259] focus:outline-none focus:border-[#78350f] focus:ring-2 focus:ring-[#78350f]/20 resize-none transition-colors"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={String(settings[field.key])}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full h-10 px-3 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[#4a2c11] placeholder:text-[#967259] focus:outline-none focus:border-[#78350f] focus:ring-2 focus:ring-[#78350f]/20 transition-colors"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Aturan Diskon */}
        <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
          <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-4">Aturan Diskon Massal</h2>
          <div className="flex flex-col gap-3">
            {settings.bulk_discount_rules.map((rule, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs text-[hsl(220,10%,46%)] w-24 flex-shrink-0">Min. qty</span>
                <input type="number" defaultValue={rule.minQty} className="w-24 h-9 px-3 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[#4a2c11] focus:outline-none focus:border-[#78350f] transition-colors tabular-nums" />
                <span className="text-xs text-[hsl(220,10%,46%)]">lembar → diskon</span>
                <input type="number" defaultValue={rule.percent} className="w-16 h-9 px-3 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[#4a2c11] focus:outline-none focus:border-[#78350f] transition-colors tabular-nums" />
                <span className="text-xs text-[hsl(220,10%,46%)]">%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle Notifikasi Admin */}
        <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
          <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-4">Notifikasi</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-[hsl(224,12%,12%)]">Notifikasi WA untuk order baru</p>
              <p className="text-xs text-[hsl(220,10%,55%)]">Kirim WhatsApp ke nomor admin saat ada pesanan baru masuk.</p>
            </div>
            <div
              onClick={() => setSettings((s) => ({ ...s, notify_admin_on_new_order: !s.notify_admin_on_new_order }))}
              className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${settings.notify_admin_on_new_order ? "bg-[hsl(224,12%,12%)]" : "bg-[hsl(220,13%,91%)]"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.notify_admin_on_new_order ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
          </label>
        </div>

        <button type="submit" className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors self-start">
          <Save className="w-4 h-4" strokeWidth={1.5} />
          Simpan Pengaturan
        </button>
      </form>
    </div>
  );
}
