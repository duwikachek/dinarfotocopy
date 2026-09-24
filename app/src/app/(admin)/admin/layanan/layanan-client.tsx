"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, ImagePlus } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import {
  createServiceAction,
  updateServiceAction,
  toggleServiceActiveAction,
  deleteServiceAction,
} from "@/actions/service-actions";
import type { ServiceWithCategory, CategoryItem } from "@/db/queries";

// ─── Modal ───
function ServiceModal({
  open,
  editItem,
  categories,
  onClose,
  onDone,
}: {
  open: boolean;
  editItem: ServiceWithCategory | null;
  categories: CategoryItem[];
  onClose: () => void;
  onDone: (data: ServiceWithCategory, isEdit: boolean) => void;
}) {
  const [name, setName] = useState(editItem?.name ?? "");
  const [shortDescription, setShortDescription] = useState(editItem?.shortDescription ?? "");
  const [description, setDescription] = useState(editItem?.description ?? "");
  const [basePrice, setBasePrice] = useState(editItem?.basePrice?.toString() ?? "");
  const [unit, setUnit] = useState(editItem?.unit ?? "lembar");
  const [categoryId, setCategoryId] = useState(editItem?.categoryId ?? categories[0]?.id ?? "");
  const [sortOrder, setSortOrder] = useState(editItem?.sortOrder?.toString() ?? "0");
  const [imagePreview, setImagePreview] = useState(editItem?.imageUrl ?? "");
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setName(editItem?.name ?? "");
      setShortDescription(editItem?.shortDescription ?? "");
      setDescription(editItem?.description ?? "");
      setBasePrice(editItem?.basePrice?.toString() ?? "");
      setUnit(editItem?.unit ?? "lembar");
      setCategoryId(editItem?.categoryId ?? categories[0]?.id ?? "");
      setSortOrder(editItem?.sortOrder?.toString() ?? "0");
      setImagePreview(editItem?.imageUrl ?? "");
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
    if (!name.trim()) { setError("Nama layanan tidak boleh kosong."); return; }
    if (!shortDescription.trim()) { setError("Deskripsi singkat tidak boleh kosong."); return; }
    if (!basePrice) { setError("Harga dasar tidak boleh kosong."); return; }

    const catObj = categories.find((c) => c.id === categoryId);
    const slug = editItem?.slug ?? slugify(name);

    const payload = {
      categoryId,
      name: name.trim(),
      slug,
      shortDescription: shortDescription.trim(),
      description: description.trim() || shortDescription.trim(),
      unit,
      basePrice: Number(basePrice) || 0,
      sortOrder: Number(sortOrder) || 0,
      isActive: editItem?.isActive ?? true,
    };

    startTransition(async () => {
      if (editItem) {
        const res = await updateServiceAction(editItem.id, payload);
        if (!res.success) { setError(res.error || "Gagal memperbarui."); return; }
        onDone({
          ...editItem,
          ...payload,
          imageUrl: imagePreview || editItem.imageUrl,
          categoryName: catObj?.name ?? editItem.categoryName,
          categorySlug: catObj?.slug ?? editItem.categorySlug,
        }, true);
      } else {
        const res = await createServiceAction(payload);
        if (!res.success) { setError(res.error || "Gagal membuat layanan."); return; }
        const newSvc: ServiceWithCategory = {
          id: (res as any).service?.id ?? `svc-${Date.now()}`,
          ...payload,
          imageUrl: imagePreview || null,
          categoryName: catObj?.name ?? "Umum",
          categorySlug: catObj?.slug ?? "umum",
          variants: [],
          useCases: [],
        };
        onDone(newSvc, false);
      }
    });
  };

  const cls = "w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-[hsl(220,13%,91%)] p-6 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[hsl(224,12%,12%)]">
            {editItem ? "Edit Layanan" : "Tambah Layanan"}
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
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Nama Layanan</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Fotokopi A4" className={cls} />
          </div>

          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Deskripsi Singkat</label>
            <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="Deskripsi singkat untuk kartu layanan..." className={cls} />
          </div>

          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Deskripsi Lengkap</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Penjelasan lengkap layanan..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-[hsl(220,13%,85%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Harga Dasar (Rp)</label>
              <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="300" className={cls} />
            </div>
            <div>
              <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Satuan</label>
              <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="lembar / buku / m2" className={cls} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Urutan Tampil</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} min={0} className={cls} />
          </div>

          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Foto Layanan (opsional)</label>
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
                <span className="text-xs">Klik untuk upload gambar</span>
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
            {pending ? "Menyimpan..." : editItem ? "Simpan Perubahan" : "Tambah Layanan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayananClient({
  initialServices,
  categories,
}: {
  initialServices: ServiceWithCategory[];
  categories: CategoryItem[];
}) {
  const [services, setServices] = useState<ServiceWithCategory[]>(initialServices);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<ServiceWithCategory | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [deletePending, startDelete] = useTransition();
  const [togglePending, startToggle] = useTransition();

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleToggleActive = (svc: ServiceWithCategory) => {
    // Optimistic update
    setServices((prev) =>
      prev.map((s) => (s.id === svc.id ? { ...s, isActive: !s.isActive } : s))
    );
    startToggle(async () => {
      const res = await toggleServiceActiveAction(svc.id, svc.isActive);
      if (!res.success) {
        // Rollback
        setServices((prev) =>
          prev.map((s) => (s.id === svc.id ? { ...s, isActive: svc.isActive } : s))
        );
        showToast(res.error || "Gagal mengubah status.");
      }
    });
  };

  const handleDone = (svc: ServiceWithCategory, isEdit: boolean) => {
    if (isEdit) {
      setServices((prev) => prev.map((s) => (s.id === svc.id ? svc : s)));
      showToast("Layanan berhasil diperbarui!");
    } else {
      setServices((prev) => [svc, ...prev]);
      showToast("Layanan berhasil ditambahkan!");
    }
    setShowModal(false);
    setEditItem(null);
  };

  const handleDelete = (id: string) => {
    startDelete(async () => {
      const res = await deleteServiceAction(id);
      if (res.success) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        showToast("Layanan berhasil dihapus.");
      } else {
        showToast(res.error || "Gagal menghapus layanan.");
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
          <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Layanan & Harga</h1>
          <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">{services.length} layanan terdaftar</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowModal(true); }}
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Tambah Layanan
        </button>
      </div>

      <div className="rounded-xl bg-white border border-[hsl(220,13%,91%)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)]">
                {["Nama Layanan", "Kategori", "Harga Dasar", "Satuan", "Varian", "Status", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left admin-table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(220,13%,91%)]">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[hsl(220,10%,55%)]">
                    Belum ada layanan.
                  </td>
                </tr>
              ) : services.map((svc) => (
                <tr key={svc.id} className="hover:bg-[hsl(220,14%,98%)] transition-colors">
                  <td className="px-4 py-3.5">
                    <div>
                      <p className="font-medium text-[hsl(224,12%,12%)]">{svc.name}</p>
                      <p className="text-xs text-[hsl(220,10%,55%)] mt-0.5 line-clamp-1">{svc.shortDescription}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,46%)]">{svc.categoryName}</td>
                  <td className="px-4 py-3.5 font-medium text-[hsl(224,12%,12%)] tabular-nums">{formatRupiah(svc.basePrice)}</td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,55%)]">{svc.unit}</td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,55%)]">{svc.variants?.length || 0} varian</td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleToggleActive(svc)}
                      disabled={togglePending}
                      className="flex items-center gap-1.5 text-xs disabled:opacity-60"
                    >
                      {svc.isActive ? (
                        <><ToggleRight className="w-4 h-4 text-green-600" strokeWidth={1.5} /><span className="text-green-600">Aktif</span></>
                      ) : (
                        <><ToggleLeft className="w-4 h-4 text-[hsl(220,10%,55%)]" strokeWidth={1.5} /><span className="text-[hsl(220,10%,55%)]">Nonaktif</span></>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditItem(svc); setShowModal(true); }}
                        className="text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] transition-colors p-1"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(svc.id)}
                        className="text-[hsl(220,10%,46%)] hover:text-red-500 transition-colors p-1"
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

      {/* Modal Tambah/Edit */}
      {showModal && (
        <ServiceModal
          open={showModal}
          editItem={editItem}
          categories={categories}
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
            <h2 className="text-base font-bold text-[hsl(224,12%,12%)] mb-2">Hapus Layanan?</h2>
            <p className="text-sm text-[hsl(220,10%,46%)] mb-6">
              Layanan <span className="font-semibold text-[hsl(224,12%,12%)]">{services.find((s) => s.id === deleteConfirm)?.name}</span> akan dihapus secara permanen.
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
