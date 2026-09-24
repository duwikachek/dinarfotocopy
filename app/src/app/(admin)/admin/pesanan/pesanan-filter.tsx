"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";

type OrderStatus = "all" | "pending" | "confirmed" | "in_progress" | "ready" | "completed" | "cancelled";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "pending", label: "Menunggu" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "in_progress", label: "Dikerjakan" },
  { value: "ready", label: "Siap Ambil" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

interface Props {
  initialQ: string;
  initialStatus: string;
}

export function PesananFilter({ initialQ, initialStatus }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(initialQ);
  const [status, setStatus] = useState<OrderStatus>((initialStatus as OrderStatus) ?? "all");

  const applyFilter = useCallback(
    (q: string, s: string) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (s && s !== "all") params.set("status", s);
      router.push(`/admin/pesanan${params.toString() ? `?${params}` : ""}`);
    },
    [router]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    // Debounce via timeout would be ideal but useEffect would be needed; use on-change push
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyFilter(search, status);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as OrderStatus;
    setStatus(val);
    applyFilter(search, val);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,10%,55%)]" strokeWidth={1.5} />
        <input
          type="search"
          placeholder="Cari nama, kode, atau WA pelanggan... (Enter)"
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          onBlur={() => applyFilter(search, status)}
          className="w-full h-10 pl-9 pr-4 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:border-[hsl(224,12%,12%)] transition-colors"
        />
      </div>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(220,10%,55%)]" strokeWidth={1.5} />
        <select
          value={status}
          onChange={handleStatusChange}
          className="h-10 pl-9 pr-8 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white text-[hsl(224,12%,12%)] focus:outline-none focus:border-[hsl(224,12%,12%)] appearance-none cursor-pointer"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
