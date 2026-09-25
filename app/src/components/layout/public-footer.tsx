import Link from "next/link";
import Image from "next/image";
import type { StoreSettings } from "@/db/queries";

const serviceLinks = [
  { href: "/layanan#fotokopi", label: "Fotokopi & Print" },
  { href: "/layanan#banner", label: "Banner & Foto HD" },
  { href: "/layanan#jilid", label: "Jilid & Laminasi" },
  { href: "/layanan#scan", label: "Scan & Digitalisasi" },
  { href: "/produk", label: "Produk ATK" },
];

const quickLinks = [
  { href: "/", label: "Beranda" },
  { href: "/estimasi", label: "Kalkulator Estimasi" },
  { href: "/cart", label: "Keranjang" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
  { href: "/faq", label: "FAQ" },
];

export function PublicFooter({ settings }: { settings?: StoreSettings }) {
  const waNumber = String(settings?.store_whatsapp || "628123456789");
  const waUrl = `https://wa.me/${waNumber}?text=Halo%20Dinar%20Fotocopy%2C%20saya%20ingin%20memesan%20layanan.`;
  const storeAddress = String(settings?.store_address || "Jl. Melati No. 22, Kel. Sukamaju, Bandung, Jawa Barat 40123");
  const storeName = String(settings?.store_name || "DINAR FOTOCOPY");
  const opHours = String(settings?.store_operational_hours || "Senin – Sabtu 08.00 – 21.00 WIB, Minggu 09.00 – 17.00 WIB");

  // Pretty format for Indonesian phone number
  const formattedPhone = waNumber.startsWith("62")
    ? "0" + waNumber.slice(2)
    : waNumber;

  return (
    <footer className="w-full bg-deep-purple-end/95 text-on-surface">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* ── Brand Column ── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={`Logo ${storeName}`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-2xl object-cover shadow-[0_0_12px_rgba(0,164,239,0.35)] shrink-0"
              />
              <span className="text-headline-sm uppercase tracking-wider text-on-surface font-semibold">
                {storeName}
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              {settings?.store_tagline || "Pusat fotokopi berkecepatan tinggi, percetakan digital profesional, penjilidan dokumen rapi, dan perlengkapan alat tulis kantor berkualitas di Bandung."}
            </p>
            <div className="inline-flex items-center gap-2 text-lumia-cyan text-label-caps">
              <span className="material-symbols-outlined text-base">verified</span>
              Kualitas & Kecepatan Metro
            </div>
            {/* WA CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lumia-emerald text-on-surface font-semibold text-body-sm hover:brightness-110 transition-all mt-1"
            >
              <span className="material-symbols-outlined text-base">chat</span>
              Chat WhatsApp
            </a>
          </div>

          {/* ── Kontak & Alamat Column ── */}
          <div className="flex flex-col gap-4">
            <span className="text-headline-sm text-on-surface font-semibold">Kontak & Alamat</span>
            <ul className="flex flex-col gap-3 text-body-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base text-lumia-coral mt-0.5 shrink-0">location_on</span>
                <span>{storeAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-lumia-emerald shrink-0">call</span>
                <a href={`tel:+${waNumber}`} className="hover:text-lumia-emerald transition-colors">
                  WA: {formattedPhone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-lumia-amber shrink-0">mail</span>
                <a href="mailto:order@dinarfotocopy.id" className="hover:text-lumia-amber transition-colors">
                  order@dinarfotocopy.id
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-lumia-cyan shrink-0">map</span>
                <a
                  href={settings?.map_embed_url ? "/kontak" : "https://maps.google.com"}
                  className="hover:text-lumia-cyan transition-colors flex items-center gap-1"
                >
                  Lihat di Google Maps
                  <span className="material-symbols-outlined text-xs">arrow_outward</span>
                </a>
              </li>
            </ul>
          </div>

          {/* ── Jam Layanan Column ── */}
          <div className="flex flex-col gap-4">
            <span className="text-headline-sm text-on-surface font-semibold">Jam Layanan Toko</span>
            <div className="flex flex-col gap-2">
              <div className="py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-body-sm text-on-surface block mb-1">Operasional:</span>
                <span className="text-body-sm font-semibold text-lumia-cyan">
                  {opHours}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-high/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lumia-emerald animate-pulse shrink-0" />
              <span className="text-label-caps text-lumia-emerald">Toko Sedang Buka</span>
            </div>
          </div>

          {/* ── Navigasi & Layanan Column ── */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-headline-sm text-on-surface font-semibold block mb-3">Layanan</span>
              <ul className="flex flex-col gap-2">
                {serviceLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-body-sm text-on-surface-variant hover:text-lumia-cyan transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs text-lumia-cyan/60">arrow_right</span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-headline-sm text-on-surface font-semibold block mb-3">Navigasi</span>
              <ul className="flex flex-col gap-2">
                {quickLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p className="text-label-caps text-on-surface-variant">
          © {new Date().getFullYear()} Dinar Fotocopy. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-label-caps text-on-surface-variant">
          <Link href="/kebijakan-privasi" className="hover:text-lumia-cyan transition-colors">
            Kebijakan Privasi
          </Link>
          <span className="text-outline-variant">•</span>
          <span className="text-on-surface-variant/60">
            Powered by{" "}
            <span className="text-lumia-cyan">Lumia Metro Glass</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
