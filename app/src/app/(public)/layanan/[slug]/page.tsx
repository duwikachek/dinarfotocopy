"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  MessageCircle,
  ChevronRight,
  Plus,
  CheckCircle,
  Info,
  Printer,
  Image,
  BookOpen,
  ScanLine,
  Package,
} from "lucide-react";
import { dummyServices } from "@/lib/dummy-data";
import { formatRupiah } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const categoryIcons: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "fotokopi-print": Printer,
  "cetak-foto-banner": Image,
  "jilid-laminating": BookOpen,
  "scan-digitalisasi": ScanLine,
  "layanan-lainnya": Package,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default function DetailLayananPage({ params }: Props) {
  const { slug } = use(params);
  const service = dummyServices.find((s) => s.slug === slug);

  if (!service) notFound();

  const addServiceItem = useCartStore((s) => s.addServiceItem);
  const Icon = categoryIcons[service.categorySlug] ?? Printer;

  const handleAddToCart = (variant: (typeof service.variants)[0]) => {
    addServiceItem({
      type: "service",
      serviceId: service.id,
      serviceName: service.name,
      variantId: variant.id,
      variantLabel: variant.label,
      unitPrice: variant.price,
      quantity: 1,
      isBulkEligible: service.isBulkDiscountEligible ?? false,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[hsl(220,10%,55%)] mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[hsl(224,12%,12%)] transition-colors">Beranda</Link>
        <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
        <Link href="/layanan" className="hover:text-[hsl(224,12%,12%)] transition-colors">Layanan</Link>
        <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
        <span className="text-[hsl(224,12%,12%)] font-medium">{service.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[hsl(220,14%,96%)] flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-[hsl(224,12%,30%)]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs text-[hsl(220,10%,55%)] mb-0.5">{service.categoryName}</p>
              <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">
                {service.name}
              </h1>
              <p className="text-sm text-[hsl(220,10%,46%)] mt-1">
                {service.shortDescription}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-[hsl(224,12%,12%)] mb-3">
              Tentang Layanan Ini
            </h2>
            <p className="text-sm text-[hsl(220,10%,36%)] leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Daftar Varian Harga */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-[hsl(224,12%,12%)] mb-4">
              Daftar Harga
            </h2>

            {/* Bulk discount notice */}
            {service.isBulkDiscountEligible && (
              <div className="flex items-start gap-2.5 p-3 mb-4 rounded-lg bg-[hsl(38,92%,50%)/0.08] border border-[hsl(38,92%,50%)/0.2]">
                <Info
                  className="w-4 h-4 text-[hsl(38,60%,35%)] flex-shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <p className="text-xs text-[hsl(38,60%,30%)]">
                  <strong>Diskon Massal:</strong> Cetak ≥100 lembar → diskon 5%.
                  Cetak ≥500 lembar → diskon 10%. Dihitung otomatis di keranjang.
                </p>
              </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-[hsl(220,13%,91%)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)]">
                    <th className="px-4 py-3 text-left admin-table-header">
                      Varian
                    </th>
                    <th className="px-4 py-3 text-right admin-table-header">
                      Harga
                    </th>
                    <th className="px-4 py-3 text-right admin-table-header">
                      Satuan
                    </th>
                    <th className="px-4 py-3 text-right admin-table-header">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(220,13%,91%)]">
                  {service.variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-[hsl(220,14%,98%)] transition-colors">
                      <td className="px-4 py-3.5 text-[hsl(224,12%,12%)] font-medium">
                        {variant.label}
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-[hsl(224,12%,12%)] tabular-nums">
                        {formatRupiah(variant.price)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-[hsl(220,10%,55%)] text-xs">
                        /{service.unit}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/estimasi?service=${service.slug}&variant=${variant.id}`}
                            className="text-xs font-medium text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] transition-colors"
                          >
                            Hitung
                          </Link>
                          <button
                            onClick={() => handleAddToCart(variant)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[hsl(224,12%,12%)] text-white text-xs font-medium hover:bg-[hsl(224,12%,20%)] transition-colors"
                          >
                            <Plus className="w-3 h-3" strokeWidth={2} />
                            Tambah
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contoh Penggunaan */}
          {service.useCases && service.useCases.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-[hsl(224,12%,12%)] mb-3">
                Cocok untuk
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.useCases.map((uc, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-[hsl(220,14%,96%)]"
                  >
                    <CheckCircle
                      className="w-4 h-4 text-[hsl(38,92%,50%)] flex-shrink-0"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm text-[hsl(220,10%,36%)]">{uc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar: Order CTA */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 p-5 rounded-xl border border-[hsl(220,13%,91%)] bg-white">
            <p className="text-xs text-[hsl(220,10%,55%)] uppercase tracking-widest mb-1">
              Harga mulai dari
            </p>
            <p className="text-2xl font-bold text-[hsl(224,12%,12%)] tabular-nums mb-1">
              {formatRupiah(service.basePrice)}
            </p>
            <p className="text-xs text-[hsl(220,10%,55%)] mb-5">
              per {service.unit} · {service.variants.length} varian tersedia
            </p>

            <div className="flex flex-col gap-2">
              <Link
                href={`/estimasi?service=${service.slug}`}
                className="flex items-center justify-center gap-2 h-10 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors"
              >
                <Calculator className="w-4 h-4" strokeWidth={1.5} />
                Hitung Estimasi
              </Link>
              <Link
                href="/cart"
                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
              >
                Lihat Keranjang
              </Link>
              <a
                href={`https://wa.me/628123456789?text=Halo%20Dinar%20Fotocopy%2C%20saya%20ingin%20bertanya%20tentang%20${encodeURIComponent(service.name)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-10 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                Tanya via WhatsApp
              </a>
            </div>

            <div className="mt-5 pt-4 border-t border-[hsl(220,13%,91%)]">
              <p className="text-[10px] text-[hsl(220,10%,60%)] leading-relaxed">
                * Estimasi dapat berubah setelah kami periksa berkas Anda. Harga
                sudah termasuk kertas standar.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/layanan"
              className="flex items-center gap-2 text-sm text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
