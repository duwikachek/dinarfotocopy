"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Eye, MessageCircle } from "lucide-react";
import { dummyOrders, orderStatusConfig, type OrderStatus } from "@/lib/dummy-data";
import { formatRupiah, formatDate, cn } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";

const statusOptions: { value: "all" | OrderStatus; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "pending", label: "Menunggu" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "in_progress", label: "Dikerjakan" },
  { value: "ready", label: "Siap Ambil" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

export default function AdminPesananPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const filtered = dummyOrders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !search || o.customerName.toLowerCase().includes(q) || o.code.toLowerCase().includes(q) || o.customerWhatsapp.includes(q);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Daftar Pesanan</h1>
        <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">{dummyOrders.length} total pesanan</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,10%,55%)]" strokeWidth={1.5} />
          <input
            type="search"
            placeholder="Cari nama, kode, atau WA pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,10%,55%)]" strokeWidth={1.5} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="h-10 pl-9 pr-8 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white text-[hsl(224,12%,12%)] focus:outline-none focus:border-[hsl(224,12%,12%)] appearance-none cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-[hsl(220,13%,91%)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)]">
                {["Kode", "Pelanggan", "WhatsApp", "Item", "Total Estimasi", "Status", "Tanggal", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left admin-table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(220,13%,91%)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-[hsl(220,10%,55%)]">Tidak ada pesanan yang ditemukan.</td>
                </tr>
              ) : filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[hsl(220,14%,98%)] transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-[hsl(224,12%,12%)]">{order.code}</td>
                  <td className="px-4 py-3.5 text-[hsl(224,12%,12%)] font-medium">{order.customerName}</td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,46%)]">
                    <a href={`https://wa.me/${order.customerWhatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-green-600 transition-colors">
                      <MessageCircle className="w-3 h-3" strokeWidth={1.5} />
                      {order.customerWhatsapp}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,55%)]">{order.items.length} item</td>
                  <td className="px-4 py-3.5 font-medium text-[hsl(224,12%,12%)] tabular-nums">{formatRupiah(order.totalEstimate)}</td>
                  <td className="px-4 py-3.5"><OrderStatusBadge status={order.status as OrderStatus} /></td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,55%)] whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <Link href={`/admin/pesanan/${order.id}`} className="flex items-center gap-1 text-xs font-medium text-[hsl(224,12%,12%)] hover:text-[hsl(38,92%,45%)] transition-colors">
                      <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
