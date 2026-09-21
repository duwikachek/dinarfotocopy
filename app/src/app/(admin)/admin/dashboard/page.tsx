import Link from "next/link";
import {
  ShoppingBag, Clock, Package, CheckCircle,
  TrendingUp, ArrowRight, AlertTriangle,
} from "lucide-react";
import { dummyOrders, dummyProducts, dummyDashboardStats, orderStatusConfig } from "@/lib/dummy-data";
import { formatRupiah, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";
import { AdminChart } from "@/components/admin/dashboard-chart";

const statCards = [
  { label: "Pesanan Hari Ini", value: dummyDashboardStats.ordersToday, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Menunggu Tindakan", value: dummyDashboardStats.ordersPending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Stok ATK Menipis", value: dummyDashboardStats.lowStockProducts, icon: Package, color: "text-red-500", bg: "bg-red-50" },
  { label: "Selesai Minggu Ini", value: dummyDashboardStats.completedThisWeek, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
];

const lowStockProducts = dummyProducts.filter(
  (p) => p.stock <= p.lowStockThreshold
);

export default function AdminDashboardPage() {
  const recentOrders = dummyOrders.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Dasbor</h1>
        <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">
          Selamat datang kembali, Admin Dinar. Berikut ringkasan hari ini.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-[hsl(220,10%,46%)] uppercase tracking-wide">{stat.label}</p>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-3xl font-bold text-[hsl(224,12%,12%)] tabular-nums">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-0.5">Grafik Pesanan</p>
              <h2 className="text-sm font-bold text-[hsl(224,12%,12%)]">7 Hari Terakhir</h2>
            </div>
            <TrendingUp className="w-4 h-4 text-[hsl(38,92%,50%)]" strokeWidth={1.5} />
          </div>
          <AdminChart data={dummyDashboardStats.chartData} />
        </div>

        {/* Low stock */}
        <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[hsl(224,12%,12%)]">Stok ATK Menipis</h2>
            <AlertTriangle className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-[hsl(220,10%,55%)]">Semua stok aman.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <p className="text-xs text-[hsl(224,12%,12%)] font-medium leading-tight line-clamp-1 flex-1">{p.name}</p>
                  <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${p.stock === 0 ? "text-red-500" : "text-amber-600"}`}>
                    {p.stock === 0 ? "Habis" : `Sisa ${p.stock}`}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/produk" className="flex items-center gap-1 text-xs font-medium text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] transition-colors mt-4">
            Kelola Produk ATK <ArrowRight className="w-3 h-3" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-white border border-[hsl(220,13%,91%)] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[hsl(220,13%,91%)]">
          <h2 className="text-sm font-bold text-[hsl(224,12%,12%)]">Pesanan Terbaru</h2>
          <Link href="/admin/pesanan" className="flex items-center gap-1 text-xs font-medium text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] transition-colors">
            Lihat semua <ArrowRight className="w-3 h-3" strokeWidth={2} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)]">
                {["Kode", "Pelanggan", "Total Estimasi", "Status", "Tanggal", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left admin-table-header">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(220,13%,91%)]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[hsl(220,14%,98%)] transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs text-[hsl(224,12%,12%)] font-medium">{order.code}</td>
                  <td className="px-4 py-3.5 text-[hsl(224,12%,12%)]">{order.customerName}</td>
                  <td className="px-4 py-3.5 text-[hsl(224,12%,12%)] tabular-nums font-medium">{formatRupiah(order.totalEstimate)}</td>
                  <td className="px-4 py-3.5">
                    <OrderStatusBadge status={order.status as any} />
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,55%)]">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/admin/pesanan/${order.id}`} className="text-xs text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] font-medium transition-colors">
                      Detail →
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
