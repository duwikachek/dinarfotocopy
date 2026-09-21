"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { dummyServices } from "@/lib/dummy-data";
import { formatRupiah } from "@/lib/utils";

export default function AdminLayananPage() {
  const [services, setServices] = useState(dummyServices);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<(typeof dummyServices)[0] | null>(null);

  const toggleActive = (id: string) => {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  return (
    <div className="flex flex-col gap-6">
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
              {services.map((svc) => (
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
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,55%)]">{svc.variants.length} varian</td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => toggleActive(svc.id)} className="flex items-center gap-1.5 text-xs">
                      {svc.isActive ? (
                        <><ToggleRight className="w-4 h-4 text-green-600" strokeWidth={1.5} /><span className="text-green-600">Aktif</span></>
                      ) : (
                        <><ToggleLeft className="w-4 h-4 text-[hsl(220,10%,55%)]" strokeWidth={1.5} /><span className="text-[hsl(220,10%,55%)]">Nonaktif</span></>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditItem(svc); setShowModal(true); }} className="text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] transition-colors p-1" title="Edit">
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button className="text-[hsl(220,10%,46%)] hover:text-red-500 transition-colors p-1" title="Hapus">
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

      {/* Modal CRUD */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-base font-bold text-[hsl(224,12%,12%)] mb-5">{editItem ? "Edit Layanan" : "Tambah Layanan"}</h2>
            <div className="flex flex-col gap-4">
              {[{ label: "Nama Layanan", placeholder: "Contoh: Fotokopi A4", defaultVal: editItem?.name ?? "" },
                { label: "Deskripsi Singkat", placeholder: "Deskripsi singkat...", defaultVal: editItem?.shortDescription ?? "" },
                { label: "Harga Dasar (Rp)", placeholder: "300", defaultVal: editItem?.basePrice?.toString() ?? "" },
                { label: "Satuan", placeholder: "lembar / buku / m2", defaultVal: editItem?.unit ?? "" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">{field.label}</label>
                  <input type="text" defaultValue={field.defaultVal} placeholder={field.placeholder} className="w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:border-[hsl(224,12%,12%)] transition-colors" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)] transition-colors">Batal</button>
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
