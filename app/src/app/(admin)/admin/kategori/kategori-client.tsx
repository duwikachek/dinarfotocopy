"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/category-actions";
import type { CategoryItem } from "@/db/queries";

type CatKind = "Layanan" | "Produk ATK";
type Cat = {
  id: string;
  name: string;
  slug: string;
  kind: CatKind;
  sortOrder: number;
};

// ─── Modal ───
function CategoryModal({
  open,
  editItem,
  onClose,
  onDone,
}: {
  open: boolean;
  editItem: Cat | null;
  onClose: () => void;
  onDone: (cat: Cat, isEdit: boolean) => void;
}) {
  const [name, setName] = useState(editItem?.name ?? "");
  const [kind, setKind] = useState<CatKind>(editItem?.kind ?? "Layanan");
  const [sortOrder, setSortOrder] = useState(editItem?.sortOrder?.toString() ?? "0");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setName(editItem?.name ?? "");
      setKind(editItem?.kind ?? "Layanan");
      setSortOrder(editItem?.sortOrder?.toString() ?? "0");
      setError("");
    }
  }, [open, editItem]);

  if (!open) return null;

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const handleSubmit = () => {
    setError("");
    if (!name.trim()) { setError("Nama kategori tidak boleh kosong."); return; }
    const slug = editItem?.slug ?? slugify(name);
    const dbKind = kind === "Layanan" ? "service" : "product";
    const payload = {
      name: name.trim(),
      slug,
      kind: dbKind as "service" | "product",
      sortOrder: Number(sortOrder) || 0,
      isActive: true,
    };

    startTransition(async () => {
      if (editItem) {
        const res = await updateCategoryAction(editItem.id, payload);
        if (!res.success) { setError(res.error || "Gagal memperbarui."); return; }
        onDone({ ...editItem, name: name.trim(), kind, sortOrder: Number(sortOrder) || 0 }, true);
      } else {
        const res = await createCategoryAction(payload);
        if (!res.success) { setError(res.error || "Gagal membuat kategori."); return; }
        const newCat: Cat = {
          id: (res as any).category?.id ?? `cat-${Date.now()}`,
          name: name.trim(),
          slug,
          kind,
          sortOrder: Number(sortOrder) || 0,
        };
        onDone(newCat, false);
      }
    });
  };

  const cls = "w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[hsl(224,12%,12%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[hsl(224,12%,12%)]">
            {editItem ? "Edit Kategori" : "Tambah Kategori"}
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
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Nama Kategori</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Fotokopi & Print"
              className={cls}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Jenis</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as CatKind)}
              className={`${cls} cursor-pointer`}
            >
              <option value="Layanan">Layanan</option>
              <option value="Produk ATK">Produk ATK</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Urutan Tampil</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              min={0}
              className={cls}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={pending}
            className="flex-1 h-10 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] disabled:opacity-60 transition-colors"
          >
            {pending ? "Menyimpan..." : editItem ? "Simpan Perubahan" : "Tambah Kategori"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminKategoriClient({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const mapInitial = (list: CategoryItem[]): Cat[] =>
    list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      kind: c.kind === "service" ? "Layanan" : "Produk ATK",
      sortOrder: c.sortOrder,
    }));

  const [categories, setCategories] = useState<Cat[]>(() => mapInitial(initialCategories));
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Cat | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [deletePending, startDelete] = useTransition();

  useEffect(() => {
    setCategories(mapInitial(initialCategories));
  }, [initialCategories]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleOpenAdd = () => { setEditItem(null); setShowModal(true); };
  const handleOpenEdit = (cat: Cat) => { setEditItem(cat); setShowModal(true); };

  const handleDone = (cat: Cat, isEdit: boolean) => {
    if (isEdit) {
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
      showToast("Kategori berhasil diperbarui!");
    } else {
      setCategories((prev) => [cat, ...prev]);
      showToast("Kategori berhasil ditambahkan!");
    }
    setShowModal(false);
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    startDelete(async () => {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showToast("Kategori berhasil dihapus.");
      } else {
        showToast(res.error || "Gagal menghapus kategori.");
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
          <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Kategori</h1>
          <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">{categories.length} kategori terdaftar</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Tambah Kategori
        </button>
      </div>

      <div className="rounded-xl bg-white border border-[hsl(220,13%,91%)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)]">
              {["Nama", "Slug", "Jenis", "Urutan", "Aksi"].map((h) => (
                <th key={h} className="px-4 py-3 text-left admin-table-header">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(220,13%,91%)]">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-[hsl(220,10%,55%)]">
                  Belum ada kategori.
                </td>
              </tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[hsl(220,14%,98%)] transition-colors">
                <td className="px-4 py-3.5 font-medium text-[hsl(224,12%,12%)]">{cat.name}</td>
                <td className="px-4 py-3.5 font-mono text-xs text-[hsl(220,10%,55%)]">{cat.slug}</td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      cat.kind === "Layanan" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                    }`}
                  >
                    {cat.kind}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-[hsl(220,10%,55%)]">{cat.sortOrder}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] p-1 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(cat.id)}
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

      {/* Modal Tambah/Edit */}
      {showModal && (
        <CategoryModal
          open={showModal}
          editItem={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onDone={handleDone}
        />
      )}

      {/* Konfirmasi Hapus */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-base font-bold text-[hsl(224,12%,12%)] mb-2">Hapus Kategori?</h2>
            <p className="text-sm text-[hsl(220,10%,46%)] mb-6">
              Kategori <span className="font-semibold text-[hsl(224,12%,12%)]">{categories.find((c) => c.id === deleteConfirm)?.name}</span> akan dihapus secara permanen.
              Pastikan tidak ada layanan/produk yang menggunakan kategori ini.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-10 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium hover:bg-[hsl(220,14%,96%)] transition-colors"
              >
                Batal
              </button>
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
