"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { StoreSettings } from "@/db/queries";

const navLinks = [
  { href: "/", label: "Beranda", pathKey: "/" },
  { href: "/layanan", label: "Layanan & Harga", pathKey: "/layanan" },
  { href: "/produk", label: "Produk ATK", pathKey: "/produk" },
  { href: "/estimasi", label: "Kalkulator Estimasi", pathKey: "/estimasi" },
  { href: "/tentang", label: "Tentang & Kontak", pathKey: "/tentang" },
];

export function PublicHeader({ settings }: { settings?: StoreSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());

  const waNumber = String(settings?.store_whatsapp || "628123456789");
  const waUrl = `https://wa.me/${waNumber}?text=Halo%20Dinar%20Fotocopy%2C%20saya%20ingin%20memesan%20layanan.`;
  const storeName = String(settings?.store_name || "DINAR FOTOCOPY");

  const isActive = (pathKey: string) => {
    if (pathKey === "/") return pathname === "/";
    return pathname === pathKey || pathname.startsWith(pathKey + "/");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-deep-purple-mid/85 backdrop-blur-xl"
      style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.5)" }}>
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">

        {/* ── Logo & Brand ── */}
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Dinar Fotocopy — Beranda">
          <Image
            src="/logo.png"
            alt={`Logo ${storeName}`}
            width={40}
            height={40}
            className="w-10 h-10 rounded-2xl object-cover shadow-[0_0_15px_rgba(0,164,239,0.4)] shrink-0 hover:scale-105 transition-transform"
            priority
          />
          <div className="flex flex-col">
            <span className="text-headline-sm text-on-surface font-semibold uppercase tracking-wider leading-none">
              {storeName}
            </span>
            <div className="hidden sm:inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-surface-container-high/80 text-lumia-emerald text-label-caps">
              <span className="w-1.5 h-1.5 rounded-full bg-lumia-emerald animate-pulse" />
              {settings?.store_operational_hours || "Buka Hari Ini 08.00 – 21.00 WIB"}
            </div>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden xl:flex items-center gap-1" aria-label="Navigasi utama">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-xl text-body-sm transition-all",
                isActive(link.pathKey)
                  ? "bg-primary-container text-on-primary-container font-semibold shadow-cyan"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-glass-surface"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-3 shrink-0">
          {/* WhatsApp CTA button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-container text-on-primary-container text-label-caps uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
            style={{ boxShadow: "0 2px 12px rgba(0,164,239,0.3)" }}
          >
            <span className="material-symbols-outlined text-base">chat</span>
            WhatsApp
          </a>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-xl bg-surface-container-high/80 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
            aria-label={`Keranjang (${totalItems} item)`}
          >
            <span className="material-symbols-outlined text-xl">shopping_cart</span>
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-lumia-coral text-[10px] font-bold text-white"
                style={{ boxShadow: "0 0 8px rgba(255,59,48,0.6)" }}
              >
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-surface-container-high/80 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
          >
            <span className="material-symbols-outlined text-xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div
          className="xl:hidden bg-deep-purple-mid/95 backdrop-blur-xl border-t animate-fade-in"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1" aria-label="Navigasi mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-body-sm transition-all",
                  isActive(link.pathKey)
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-glass-surface"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-lumia-emerald text-on-surface font-semibold text-body-sm"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                Pesan via WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
