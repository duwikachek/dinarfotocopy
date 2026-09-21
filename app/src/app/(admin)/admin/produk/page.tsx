"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, Package, ImagePlus, X } from "lucide-react";
import { dummyProducts } from "@/lib/dummy-data";
import { formatRupiah } from "@/lib/utils";
import { StockBadge } from "@/components/ui/badge";

type Product = (typeof dummyProducts)[0] & { imagePreview?: string };

// ─── Modal berdiri sendiri — state-nya tidak ikut re-render tabel ───
function ProductModal({
  open,
  editItem,
  onClose,
  onSave,
}: {
  open: boolean;
  editItem: Product | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    price: number;
    costPrice: number;
    stock: number;
    lowStockThreshold: number;
    imagePreview: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(editItem?.name ?? "");
      setDescription(editItem?.description ?? "");
      setPrice(editItem?.price?.toString() ?? "");
      setCostPrice(editItem?.costPrice?.toString() ?? "");
      setStock(editItem?.stock?.toString() ?? "");
      setLowStockThreshold(editItem?.lowStockThreshold?.toString() ?? "");
      setImagePreview(editItem?.imagePreview ?? "");
    }
  }, [open, editItem]);

  if (!open) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return alert("Nama produk tidak boleh kosong.");
    onSave({
      name: trimmedName,
      description,
      price: Number(price) || 0,
      costPrice: Number(costPrice) || 0,
      stock: Number(stock) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 5,
      imagePreview,
    });
  };

  const cls =
    "w-full h-10 px-3 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[#4a2c11] placeholder:text-[#967259] focus:outline-none focus:border-[#78350f] focus:ring-2 focus:ring-[#78350f]/15 transition-colors";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[hsl(224,12%,12%)]">
            {editItem ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <button onClick={onClose} className="text-[hsl(220,10%,55%)] hover:text-[hsl(224,12%,12%)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Nama Produk</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Pulpen Standard AE7" className={cls} />
          </div>

          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Deskripsi</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat produk..."
              className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[#4a2c11] placeholder:text-[#967259] focus:outline-none focus:border-[#78350f] focus:ring-2 focus:ring-[#78350f]/15 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Harga Jual (Rp)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="3000" className={cls} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Harga Beli (Rp)</label>
              <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="1800" className={cls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Stok</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="48" className={cls} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Stok Minimum Alert</label>
              <input type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} placeholder="5" className={cls} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Foto Produk</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            {imagePreview ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-[hsl(220,13%,91%)]">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button onClick={() => setImagePreview("")} className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow hover:bg-red-50 transition-colors">
                  <X className="w-3.5 h-3.5 text-red-500" />
                </button>
                <button onClick={() => fileRef.current?.click()} className="absolute bottom-2 right-2 bg-white/90 rounded-md px-2 py-1 text-xs text-[hsl(224,12%,12%)] shadow hover:bg-[hsl(220,14%,96%)] transition-colors">
                  Ganti Foto
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="w-full h-24 rounded-lg border-2 border-dashed border-[hsl(220,13%,85%)] flex flex-col items-center justify-center gap-1.5 text-[hsl(220,10%,55%)] hover:border-[hsl(224,12%,12%)] hover:text-[hsl(224,12%,12%)] transition-colors cursor-pointer">
                <ImagePlus className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-xs">Klik untuk upload gambar</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)] transition-colors">
            Batal
          </button>
          <button onClick={handleSubmit} className="flex-1 h-10 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors">
            {editItem ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openAdd = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (prod: Product) => { setEditItem(prod); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleSave = (data: {
    name: string; description: string; price: number;
    costPrice: number; stock: number; lowStockThreshold: number; imagePreview: string;
  }) => {
    if (editItem) {
      setProducts((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
    } else {
      const newProd: Product = {
        id: `prd-${Date.now()}`,
        categoryId: "cat-p1",
        categoryName: "Alat Tulis",
        categorySlug: "alat-tulis",
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
        shortDescription: data.description.slice(0, 80),
        imageUrl: null,
        isActive: true,
        sortOrder: products.length + 1,
        ...data,
      };
      setProducts((prev) => [newProd, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Produk ATK</h1>
          <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">{products.length} produk terdaftar</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors">
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
                      {prod.imagePreview ? (
                        <img src={prod.imagePreview} alt={prod.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-[hsl(220,13%,91%)]" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[hsl(220,14%,96%)] flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-[hsl(220,10%,55%)]" strokeWidth={1.5} />
                        </div>
                      )}
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
                      <button onClick={() => openEdit(prod)} className="text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] p-1 transition-colors" title="Edit">
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button onClick={() => setDeleteConfirm(prod.id)} className="text-[hsl(220,10%,46%)] hover:text-red-500 p-1 transition-colors" title="Hapus">
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

      <ProductModal open={modalOpen} editItem={editItem} onClose={closeModal} onSave={handleSave} />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-base font-bold text-[hsl(224,12%,12%)] mb-2">Hapus Produk?</h2>
            <p className="text-sm text-[hsl(220,10%,46%)] mb-6">
              Produk <span className="font-semibold text-[hsl(224,12%,12%)]">{products.find((p) => p.id === deleteConfirm)?.name}</span> akan dihapus secara permanen.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium hover:bg-[hsl(220,14%,96%)] transition-colors">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-10 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
