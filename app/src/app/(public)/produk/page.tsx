"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, ShoppingCart, Package, ArrowRight } from "lucide-react";
import { dummyProducts, dummyCategories } from "@/lib/dummy-data";
import { formatRupiah, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { StockBadge } from "@/components/ui/badge";

export default function KatalogProdukPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const addProductItem = useCartStore((s) => s.addProductItem);

  const filtered = useMemo(() => {
    let result = dummyProducts.filter((p) => p.isActive);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== "all") {
      result = result.filter((p) => p.categorySlug === activeCategory);
    }
    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [search, activeCategory, sortBy]);

  const handleAddToCart = (product: typeof dummyProducts[0]) => {
    if (product.stock === 0) return;
    addProductItem({
      type: "product",
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: 1,
      maxStock: product.stock,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="mb-8">
        <p className="text-xs font-semibold text-[hsl(38,92%,50%)] uppercase tracking-widest mb-2">Katalog</p>
        <h1 className="text-3xl font-bold text-[hsl(224,12%,12%)] tracking-tight mb-2">Produk ATK</h1>
        <p className="text-[hsl(220,10%,46%)] text-sm">Alat tulis dan perlengkapan kantor tersedia langsung di toko kami.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,10%,55%)]" strokeWidth={1.5} />
          <input
            type="search"
            placeholder="Cari produk ATK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,10%,55%)]" strokeWidth={1.5} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-10 pl-9 pr-8 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white text-[hsl(224,12%,12%)] focus:outline-none focus:border-[hsl(224,12%,12%)] appearance-none cursor-pointer"
          >
            <option value="default">Urutan Default</option>
            <option value="price-asc">Harga: Terendah</option>
            <option value="price-desc">Harga: Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-8 pb-4 border-b border-[hsl(220,13%,91%)]">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150", activeCategory === "all" ? "bg-[hsl(224,12%,12%)] text-white" : "border border-[hsl(220,13%,91%)] text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)]")}
        >
          Semua Produk
        </button>
        {dummyCategories.product.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150", activeCategory === cat.slug ? "bg-[hsl(224,12%,12%)] text-white" : "border border-[hsl(220,13%,91%)] text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)]")}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <p className="text-xs text-[hsl(220,10%,55%)] mb-5">Menampilkan {filtered.length} produk</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-10 h-10 text-[hsl(220,10%,75%)] mx-auto mb-3" strokeWidth={1} />
          <p className="text-[hsl(220,10%,46%)] text-sm">Tidak ada produk yang ditemukan.</p>
          <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="mt-4 text-sm font-medium text-[hsl(224,12%,12%)] underline underline-offset-2">Reset filter</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className="group flex flex-col rounded-xl border border-[hsl(220,13%,91%)] bg-white hover:border-[hsl(224,12%,75%)] hover:shadow-sm transition-all duration-150 overflow-hidden">
              {/* Image */}
              <Link href={`/produk/${product.slug}`} className="block">
                <div className="aspect-square bg-[hsl(220,14%,96%)] flex items-center justify-center">
                  <Package className="w-10 h-10 text-[hsl(220,10%,65%)]" strokeWidth={1} />
                </div>
              </Link>
              {/* Content */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div>
                  <p className="text-xs text-[hsl(220,10%,55%)] mb-0.5">{product.categoryName}</p>
                  <Link href={`/produk/${product.slug}`}>
                    <h2 className="text-sm font-semibold text-[hsl(224,12%,12%)] leading-snug group-hover:text-[hsl(38,92%,40%)] transition-colors line-clamp-2">{product.name}</h2>
                  </Link>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <p className="text-sm font-bold text-[hsl(224,12%,12%)] tabular-nums">{formatRupiah(product.price)}</p>
                  <StockBadge stock={product.stock} lowStockThreshold={product.lowStockThreshold} />
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={cn(
                    "flex items-center justify-center gap-1.5 w-full h-9 rounded-lg text-sm font-medium transition-colors duration-150",
                    product.stock === 0
                      ? "bg-[hsl(220,14%,96%)] text-[hsl(220,10%,65%)] cursor-not-allowed"
                      : "bg-[hsl(224,12%,12%)] text-white hover:bg-[hsl(224,12%,20%)]"
                  )}
                >
                  <ShoppingCart className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
