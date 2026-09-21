"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { dummyProducts } from "@/lib/dummy-data";
import { formatRupiah, cn } from "@/lib/utils";
import { StockBadge } from "@/components/ui/badge";

export default function AdminProdukPage() {
  const [products, setProducts] = useState(dummyProducts);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<(typeof dummyProducts)[0] | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Produk ATK</h1>
          <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">{products.length} produk terdaftar</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors">
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Tambah Produk
        </button>
      </div>

      <div className="rounded-xl bg-white border border-[hsl(220,13%,91%)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)]">
                {["Produk", "Kategori", "Harga Jual", "Harga Beli", "Stok", "Status Stok", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left admin-table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(220,13%,91%)]">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-[hsl(220,14%,98%)] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[hsl(220,14%,96%)] flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-[hsl(220,10%,55%)]" strokeWidth={1.5} />
                      </div>
                      <span className="font-medium text-[hsl(224,12%,12%)] leading-tight">{prod.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,46%)]">{prod.categoryName}</td>
                  <td className="px-4 py-3.5 font-medium text-[hsl(224,12%,12%)] tabular-nums">{formatRupiah(prod.price)}</td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,55%)] tabular-nums">{formatRupiah(prod.costPrice)}</td>
                  <td className="px-4 py-3.5 tabular-nums font-medium text-[hsl(224,12%,12%)]">{prod.stock}</td>
                  <td className="px-4 py-3.5"><StockBadge stock={prod.stock} lowStockThreshold={prod.lowStockThreshold} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditItem(prod); setShowModal(true); }} className="text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] p-1 transition-colors">
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button className="text-[hsl(220,10%,46%)] hover:text-red-500 p-1 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] p-6 w-full max-w-md animate-fade-in overflow-y-auto max-h-[90vh]">
            <h2 className="text-base font-bold text-[hsl(224,12%,12%)] mb-5">{editItem ? "Edit Produk" : "Tambah Produk"}</h2>
            <div className="flex flex-col gap-4">
              {[
                { label: "Nama Produk", placeholder: "Contoh: Pulpen Standard AE7", val: editItem?.name ?? "" },
                { label: "Deskripsi", placeholder: "Deskripsi produk...", val: editItem?.description ?? "" },
                { label: "Harga Jual (Rp)", placeholder: "3000", val: editItem?.price?.toString() ?? "" },
                { label: "Harga Beli (Rp)", placeholder: "1800", val: editItem?.costPrice?.toString() ?? "" },
                { label: "Stok", placeholder: "48", val: editItem?.stock?.toString() ?? "" },
                { label: "Stok Minimum Alert", placeholder: "5", val: editItem?.lowStockThreshold?.toString() ?? "" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">{f.label}</label>
                  <input type="text" defaultValue={f.val} placeholder={f.placeholder} className="w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:border-[hsl(224,12%,12%)] transition-colors" />
                </div>
              ))}
              {/* Upload placeholder */}
              <div>
                <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Foto Produk</label>
                <div className="w-full h-24 rounded-lg border-2 border-dashed border-[hsl(220,13%,91%)] flex items-center justify-center text-xs text-[hsl(220,10%,55%)] hover:border-[hsl(224,12%,12%)] transition-colors cursor-pointer">
                  Klik untuk upload gambar
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium hover:bg-[hsl(220,14%,96%)] transition-colors">Batal</button>
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
