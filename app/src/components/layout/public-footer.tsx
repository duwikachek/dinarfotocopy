import Link from "next/link";

const WA_NUMBER = "628123456789";
const WA_URL = `https://wa.me/${WA_NUMBER}?text=Halo%20Dinar%20Fotocopy%2C%20saya%20ingin%20memesan%20layanan.`;

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

const operationalHours = [
  { day: "Senin – Jumat", hours: "08.00 – 21.00 WIB", active: true },
  { day: "Sabtu", hours: "08.00 – 18.00 WIB", active: true },
  { day: "Minggu & Libur", hours: "10.00 – 17.00 WIB", active: false },
];

export function PublicFooter() {
  return (
    <footer className="w-full bg-deep-purple-end/95 text-on-surface">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* ── Brand Column ── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shrink-0"
                style={{ boxShadow: "0 0 12px rgba(0,164,239,0.4)" }}>
                <span className="material-symbols-outlined text-on-primary-container text-xl">print</span>
              </div>
              <span className="text-headline-sm uppercase tracking-wider text-on-surface font-semibold">
                DINAR FOTOCOPY
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Pusat fotokopi berkecepatan tinggi, percetakan digital profesional, penjilidan dokumen rapi, dan perlengkapan alat tulis kantor berkualitas di Bandung.
            </p>
            <div className="inline-flex items-center gap-2 text-lumia-cyan text-label-caps">
              <span className="material-symbols-outlined text-base">verified</span>
              Kualitas & Kecepatan Metro
            </div>
            {/* WA CTA */}
            <a
              href={WA_URL}
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
                <span>Jl. Melati No. 22, Kel. Sukamaju, Bandung, Jawa Barat 40123</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-lumia-emerald shrink-0">call</span>
                <a href={`tel:+628123456789`} className="hover:text-lumia-emerald transition-colors">
                  WA: 0812-3456-789
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
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
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
              {operationalHours.map(({ day, hours, active }) => (
                <div key={day} className="flex justify-between items-center py-1"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-body-sm text-on-surface">{day}</span>
                  <span className={`text-body-sm font-semibold ${active ? "text-lumia-cyan" : "text-tertiary"}`}>
                    {hours}
                  </span>
                </div>
              ))}
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
