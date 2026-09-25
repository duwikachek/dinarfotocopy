import { MapPin, Clock, Phone, Mail, MessageCircle, Send } from "lucide-react";
import type { Metadata } from "next";
import { getStoreSettings } from "@/db/queries";

export const metadata: Metadata = {
  title: "Kontak & Lokasi — Dinar Fotocopy",
  description: "Temukan lokasi Dinar Fotocopy di Bandung, jam operasional, dan cara menghubungi kami via WhatsApp atau email.",
};

export const dynamic = "force-dynamic";

export default async function KontakPage() {
  const settings = await getStoreSettings();
  const waNumber = String(settings.store_whatsapp || "628123456789");
  const formattedPhone = waNumber.startsWith("62") ? "0" + waNumber.slice(2) : waNumber;
  const waUrl = `https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(settings.store_name)}%2C%20saya%20ingin%20bertanya.`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 animate-fade-in">
      <div className="mb-10">
        <p className="text-xs font-semibold text-[hsl(38,92%,50%)] uppercase tracking-widest mb-2">Kontak</p>
        <h1 className="text-3xl font-bold text-[hsl(224,12%,12%)] tracking-tight mb-2">Kontak & Lokasi</h1>
        <p className="text-[hsl(220,10%,46%)] text-sm">
          Kami siap membantu Anda. Kunjungi toko kami atau hubungi via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Kontak */}
        <div className="flex flex-col gap-5">
          {/* Alamat */}
          <div className="p-5 rounded-xl border border-[hsl(220,13%,91%)] bg-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(38,92%,50%)/0.1] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[hsl(38,92%,45%)]" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-[hsl(224,12%,12%)]">Alamat Toko</p>
            </div>
            <p className="text-sm text-[hsl(220,10%,46%)] leading-relaxed whitespace-pre-line">
              {settings.store_address}
            </p>
          </div>

          {/* Jam Buka */}
          <div className="p-5 rounded-xl border border-[hsl(220,13%,91%)] bg-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(38,92%,50%)/0.1] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[hsl(38,92%,45%)]" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-[hsl(224,12%,12%)]">Jam Operasional</p>
            </div>
            <div className="flex flex-col gap-1.5 text-sm text-[hsl(220,10%,46%)]">
              <p className="font-medium text-[hsl(224,12%,12%)]">{settings.store_operational_hours}</p>
            </div>
          </div>

          {/* Kontak */}
          <div className="p-5 rounded-xl border border-[hsl(220,13%,91%)] bg-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[hsl(38,92%,50%)/0.1] flex items-center justify-center">
                <Phone className="w-4 h-4 text-[hsl(38,92%,45%)]" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-[hsl(224,12%,12%)]">Hubungi Kami</p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-lg bg-green-50 border border-green-200 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                {formattedPhone} (WhatsApp)
              </a>
              <a
                href="mailto:order@dinarfotocopy.id"
                className="flex items-center gap-2.5 text-sm text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] transition-colors"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                order@dinarfotocopy.id
              </a>
            </div>
          </div>
        </div>

        {/* Peta + Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Google Maps Embed */}
          <div className="rounded-xl overflow-hidden border border-[hsl(220,13%,91%)] aspect-video bg-[hsl(220,14%,96%)] flex items-center justify-center">
            {settings.map_embed_url ? (
              <iframe
                src={settings.map_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Toko"
              />
            ) : (
              <div className="text-center">
                <MapPin className="w-8 h-8 text-[hsl(220,10%,65%)] mx-auto mb-2" strokeWidth={1} />
                <p className="text-sm text-[hsl(220,10%,55%)]">{settings.store_name}</p>
                <p className="text-xs text-[hsl(220,10%,65%)]">{settings.store_address}</p>
              </div>
            )}
          </div>

          {/* Form Pesan Singkat */}
          <div className="p-5 rounded-xl border border-[hsl(220,13%,91%)] bg-white">
            <h2 className="text-sm font-semibold text-[hsl(224,12%,12%)] mb-4">Kirim Pesan Singkat</h2>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Nama</label>
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    className="w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    className="w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Pesan</label>
                <textarea
                  placeholder="Tulis pertanyaan atau permintaan Anda..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 resize-none transition-colors"
                />
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-10 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors"
              >
                <Send className="w-4 h-4" strokeWidth={1.5} />
                Kirim via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
