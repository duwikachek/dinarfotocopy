"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, ChevronRight, Package, Plus, Minus, MessageCircle } from "lucide-react";
import { formatRupiah, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { StockBadge } from "@/components/ui/badge";
import type { ProductWithCategory } from "@/db/queries";

export default function DetailProdukClient({ product }: { product: ProductWithCategory }) {
  const [qty, setQty] = useState(1);
  const addProductItem = useCartStore((s) => s.addProductItem);
  const [added, setAdded] = useState(false);

  const maxQty = Math.min(product.stock, 99);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addProductItem({
      type: "product",
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: qty,
      maxStock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[hsl(220,10%,55%)] mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[hsl(224,12%,12%)] transition-colors">Beranda</Link>
        <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
        <Link href="/produk" className="hover:text-[hsl(224,12%,12%)] transition-colors">Produk ATK</Link>
        <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
        <span className="text-[hsl(224,12%,12%)] font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square rounded-xl bg-[hsl(220,14%,96%)] border border-[hsl(220,13%,91%)] flex items-center justify-center">
          <Package className="w-16 h-16 text-[hsl(220,10%,65%)]" strokeWidth={0.75} />
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-[hsl(220,10%,55%)] mb-1">{product.categoryName}</p>
          <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <p className="text-3xl font-bold text-[hsl(224,12%,12%)] tabular-nums">{formatRupiah(product.price)}</p>
            <StockBadge stock={product.stock} lowStockThreshold={product.lowStockThreshold} />
          </div>

          <p className="text-sm text-[hsl(220,10%,36%)] leading-relaxed mb-6">{product.description}</p>

          {/* Stock info */}
          <div className="p-3 rounded-lg bg-[hsl(220,14%,96%)] border border-[hsl(220,13%,91%)] mb-6">
            <p className="text-xs text-[hsl(220,10%,46%)]">
              Stok tersedia: <strong className="text-[hsl(224,12%,12%)]">{product.stock} unit</strong>
            </p>
          </div>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-5">
              <p className="text-sm font-medium text-[hsl(224,12%,12%)]">Jumlah:</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg border border-[hsl(220,13%,91%)] flex items-center justify-center hover:bg-[hsl(220,14%,96%)] transition-colors disabled:opacity-50"
                  disabled={qty <= 1}
                >
                  <Minus className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
                <span className="w-10 text-center text-sm font-bold text-[hsl(224,12%,12%)] tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  className="w-8 h-8 rounded-lg border border-[hsl(220,13%,91%)] flex items-center justify-center hover:bg-[hsl(220,14%,96%)] transition-colors disabled:opacity-50"
                  disabled={qty >= maxQty}
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
              <p className="text-sm text-[hsl(220,10%,55%)] tabular-nums">= {formatRupiah(product.price * qty)}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={cn(
                "flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-medium transition-all duration-150",
                product.stock === 0
                  ? "bg-[hsl(220,14%,96%)] text-[hsl(220,10%,65%)] cursor-not-allowed"
                  : added
                    ? "bg-green-600 text-white"
                    : "bg-[hsl(224,12%,12%)] text-white hover:bg-[hsl(224,12%,20%)]"
              )}
            >
              <ShoppingCart className="w-4 h-4" strokeWidth={1.5} />
              {product.stock === 0 ? "Stok Habis" : added ? "✓ Ditambahkan!" : "Tambah ke Keranjang"}
            </button>
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 h-11 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
            >
              Lihat Keranjang
            </Link>
            <a
              href={`https://wa.me/628123456789?text=Halo%20Dinar%20Fotocopy%2C%20apakah%20${encodeURIComponent(product.name)}%20masih%20tersedia%3F`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-11 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
              Tanya Stok via WhatsApp
            </a>
          </div>

          <div className="mt-4">
            <Link href="/produk" className="flex items-center gap-2 text-sm text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] transition-colors">
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              Kembali ke Katalog ATK
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
