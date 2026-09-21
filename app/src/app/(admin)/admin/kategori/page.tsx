"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { dummyCategories } from "@/lib/dummy-data";

const allCats = [
  ...dummyCategories.service.map((c) => ({ ...c, kind: "Layanan" as const })),
  ...dummyCategories.product.map((c) => ({ ...c, kind: "Produk ATK" as const })),
];

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState(allCats);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<(typeof allCats)[0] | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Kategori</h1>
          <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">{categories.length} kategori terdaftar</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors">
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
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[hsl(220,14%,98%)] transition-colors">
                <td className="px-4 py-3.5 font-medium text-[hsl(224,12%,12%)]">{cat.name}</td>
                <td className="px-4 py-3.5 font-mono text-xs text-[hsl(220,10%,55%)]">{cat.slug}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cat.kind === "Layanan" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                    {cat.kind}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-[hsl(220,10%,55%)]">{cat.sortOrder}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditItem(cat); setShowModal(true); }} className="text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] p-1 transition-colors">
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

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] p-6 w-full max-w-sm animate-fade-in">
            <h2 className="text-base font-bold text-[hsl(224,12%,12%)] mb-5">{editItem ? "Edit Kategori" : "Tambah Kategori"}</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Nama Kategori</label>
                <input type="text" defaultValue={editItem?.name ?? ""} className="w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:border-[hsl(224,12%,12%)] transition-colors" />
              </div>
              <div>
                <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Jenis</label>
                <select defaultValue={editItem?.kind ?? "Layanan"} className="w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:border-[hsl(224,12%,12%)] cursor-pointer">
                  <option value="Layanan">Layanan</option>
                  <option value="Produk ATK">Produk ATK</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Urutan Tampil</label>
                <input type="number" defaultValue={editItem?.sortOrder ?? 0} min={0} className="w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:border-[hsl(224,12%,12%)] transition-colors" />
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
