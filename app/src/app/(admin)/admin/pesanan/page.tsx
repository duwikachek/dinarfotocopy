import Link from "next/link";
import { Search, Eye, MessageCircle } from "lucide-react";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc, eq, sql, ilike, or } from "drizzle-orm";
import { dummyOrders } from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";
import { PesananFilter } from "./pesanan-filter";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  status?: string;
};

async function getOrders(q: string, status: string) {
  if (!process.env.DATABASE_URL) {
    // Fallback dummy data
    return dummyOrders
      .filter((o) => {
        const matchSearch = !q || o.customerName.toLowerCase().includes(q.toLowerCase()) || o.code.toLowerCase().includes(q.toLowerCase());
        const matchStatus = !status || status === "all" || o.status === status;
        return matchSearch && matchStatus;
      })
      .map((o) => ({
        id: o.id,
        code: o.code,
        customerName: o.customerName,
        customerWhatsapp: o.customerWhatsapp,
        totalEstimate: o.totalEstimate,
        status: o.status,
        createdAt: o.createdAt,
        itemCount: o.items.length,
      }));
  }

  try {
    const rows = await db
      .select({
        id: orders.id,
        code: orders.code,
        customerName: orders.customerName,
        customerWhatsapp: orders.customerWhatsapp,
        totalEstimate: orders.totalEstimate,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(200);

    // Filter in JS to avoid complex query building (data is capped at 200)
    return rows
      .filter((o) => {
        const matchSearch =
          !q ||
          o.customerName.toLowerCase().includes(q.toLowerCase()) ||
          o.code.toLowerCase().includes(q.toLowerCase()) ||
          o.customerWhatsapp.includes(q);
        const matchStatus = !status || status === "all" || o.status === status;
        return matchSearch && matchStatus;
      })
      .map((o) => ({ ...o, itemCount: 0 }));
  } catch (err) {
    console.error("Gagal fetch orders:", err);
    return dummyOrders.slice(0, 10).map((o) => ({
      id: o.id,
      code: o.code,
      customerName: o.customerName,
      customerWhatsapp: o.customerWhatsapp,
      totalEstimate: o.totalEstimate,
      status: o.status,
      createdAt: o.createdAt,
      itemCount: o.items.length,
    }));
  }
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function AdminPesananPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q ?? "";
  const status = params.status ?? "all";

  const orderList = await getOrders(q, status);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Daftar Pesanan</h1>
        <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">{orderList.length} pesanan ditampilkan</p>
      </div>

      {/* Client-side filter component */}
      <PesananFilter initialQ={q} initialStatus={status} />

      {/* Table */}
      <div className="rounded-xl bg-white border border-[hsl(220,13%,91%)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)]">
                {["Kode", "Pelanggan", "WhatsApp", "Total Estimasi", "Status", "Tanggal", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left admin-table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(220,13%,91%)]">
              {orderList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[hsl(220,10%,55%)]">
                    Tidak ada pesanan yang ditemukan.
                  </td>
                </tr>
              ) : orderList.map((order) => (
                <tr key={order.id} className="hover:bg-[hsl(220,14%,98%)] transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-[hsl(224,12%,12%)]">{order.code}</td>
                  <td className="px-4 py-3.5 text-[hsl(224,12%,12%)] font-medium">{order.customerName}</td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,46%)]">
                    <a
                      href={`https://wa.me/${order.customerWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-green-600 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" strokeWidth={1.5} />
                      {order.customerWhatsapp}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-[hsl(224,12%,12%)] tabular-nums">{formatRupiah(order.totalEstimate)}</td>
                  <td className="px-4 py-3.5"><OrderStatusBadge status={order.status as any} /></td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,55%)] whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/admin/pesanan/${order.id}`}
                      className="flex items-center gap-1 text-xs font-medium text-[hsl(224,12%,12%)] hover:text-[hsl(38,92%,45%)] transition-colors"
                    >
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
