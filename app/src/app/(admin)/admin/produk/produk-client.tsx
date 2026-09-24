"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Plus, Pencil, Trash2, Package, ImagePlus, X } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { StockBadge } from "@/components/ui/badge";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/actions/product-actions";
import type { ProductWithCategory, CategoryItem } from "@/db/queries";

type Product = ProductWithCategory & {
  imagePreview?: string;
  sortOrder?: number;
  shortDescription?: string;
};

// ─── Modal ───
function ProductModal({
  open,
  editItem,
  categories,
  onClose,
  onSave,
}: {
  open: boolean;
  editItem: Product | null;
  categories: CategoryItem[];
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(editItem?.name ?? "");
      setDescription(editItem?.description ?? "");
      setCategoryId(editItem?.categoryId ?? categories[0]?.id ?? "");
      setPrice(editItem?.price?.toString() ?? "");
      setCostPrice(editItem?.costPrice?.toString() ?? "");
      setStock(editItem?.stock?.toString() ?? "");
      setLowStockThreshold(editItem?.lowStockThreshold?.toString() ?? "5");
      setImagePreview(editItem?.imagePreview ?? editItem?.imageUrl ?? "");
      setError("");
    }
  }, [open, editItem, categories]);

  if (!open) return null;

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    setError("");
    const trimmedName = name.trim();
    if (!trimmedName) { setError("Nama produk tidak boleh kosong."); return; }
    if (!price) { setError("Harga jual tidak boleh kosong."); return; }

    const catObj = categories.find((c) => c.id === categoryId);
    const slug = editItem?.slug ?? slugify(trimmedName);

    const payload = {
      categoryId,
      name: trimmedName,
      slug,
      description: description.trim() || trimmedName,
      price: Number(price) || 0,
      costPrice: Number(costPrice) || 0,
      stock: Number(stock) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 5,
      imageUrl: imagePreview || null,
      isActive: true,
    };

    startTransition(async () => {
      if (editItem) {
        const res = await updateProductAction(editItem.id, payload);
        if (!res.success) { setError(res.error || "Gagal memperbarui produk."); return; }
        onSave({
          ...editItem,
          ...payload,
          imagePreview,
          categoryName: catObj?.name ?? editItem.categoryName,
          categorySlug: catObj?.slug ?? editItem.categorySlug,
        });
      } else {
        const res = await createProductAction(payload);
        if (!res.success) { setError(res.error || "Gagal membuat produk."); return; }
        const newProd: Product = {
          id: (res as any).product?.id ?? `prd-${Date.now()}`,
          ...payload,
          imageUrl: imagePreview || null,
          imagePreview,
          isActive: true,
          sortOrder: 0,
          categoryName: catObj?.name ?? "Alat Tulis",
          categorySlug: catObj?.slug ?? "alat-tulis",
          shortDescription: description.slice(0, 80),
        };
        onSave(newProd);
      }
    });
  };

  const cls = "w-full h-10 px-3 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors";

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

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Kategori</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={`${cls} cursor-pointer`}>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

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
              className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Harga Jual (Rp)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="3000" className={cls} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Harga Modal (Rp)</label>
              <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="1800" className={cls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Stok Awal</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="50" className={cls} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Batas Menipis</label>
              <input type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} placeholder="10" className={cls} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Foto Produk (opsional)</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            {imagePreview ? (
              <div className="relative w-full h-28 rounded-lg overflow-hidden border border-[hsl(220,13%,91%)]">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview("")}
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow hover:bg-red-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-20 rounded-lg border-2 border-dashed border-[hsl(220,13%,85%)] flex flex-col items-center justify-center gap-1.5 text-[hsl(220,10%,55%)] hover:border-[hsl(224,12%,12%)] hover:text-[hsl(224,12%,12%)] transition-colors cursor-pointer"
              >
                <ImagePlus className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-xs font-medium">Klik untuk upload foto</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)] transition-colors">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={pending}
            className="flex-1 h-10 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] disabled:opacity-60 transition-colors"
          >
            {pending ? "Menyimpan..." : editItem ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProdukClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: CategoryItem[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [deletePending, startDelete] = useTransition();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const openAdd = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (prod: Product) => { setEditItem(prod); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); };

  const handleSave = (data: Partial<Product>) => {
    if (editItem) {
      setProducts((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
      showToast("Produk berhasil diperbarui!");
    } else {
      setProducts((prev) => [data as Product, ...prev]);
      showToast("Produk berhasil ditambahkan!");
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    startDelete(async () => {
      const res = await deleteProductAction(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast("Produk berhasil dihapus.");
      } else {
        showToast(res.error || "Gagal menghapus produk.");
      }
      setDeleteConfirm(null);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[hsl(224,12%,12%)] text-white text-sm font-medium shadow-md animate-fade-in">
          {toast}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Produk ATK</h1>
          <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">{products.length} produk terdaftar</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors"
        >
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[hsl(220,10%,55%)]">
                    Belum ada produk.
                  </td>
                </tr>
              ) : products.map((prod) => (
                <tr key={prod.id} className="hover:bg-[hsl(220,14%,98%)] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {prod.imagePreview || prod.imageUrl ? (
                        <img
                          src={prod.imagePreview ?? prod.imageUrl ?? ""}
                          alt={prod.name}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0 border border-[hsl(220,13%,91%)]"
                        />
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
                      <button
                        onClick={() => openEdit(prod)}
                        className="text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] p-1 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(prod.id)}
                        className="text-[hsl(220,10%,46%)] hover:text-red-500 p-1 transition-colors"
                        title="Hapus"
                      >
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

      <ProductModal open={modalOpen} editItem={editItem} categories={categories} onClose={closeModal} onSave={handleSave} />

      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-base font-bold text-[hsl(224,12%,12%)] mb-2">Hapus Produk?</h2>
            <p className="text-sm text-[hsl(220,10%,46%)] mb-6">
              Produk <span className="font-semibold text-[hsl(224,12%,12%)]">{products.find((p) => p.id === deleteConfirm)?.name}</span> akan dihapus secara permanen.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium hover:bg-[hsl(220,14%,96%)] transition-colors">Batal</button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deletePending}
                className="flex-1 h-10 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {deletePending ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
