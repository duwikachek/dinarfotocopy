"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Send, CheckCircle, Clock, Package, Printer } from "lucide-react";
import { dummyOrders, orderStatusConfig, type OrderStatus } from "@/lib/dummy-data";
import { formatRupiah, formatDateTime, cn } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/badge";
import { updateOrderStatusAction, resendOrderNotificationAction } from "@/actions/order-actions";

const statusFlow: OrderStatus[] = ["pending", "confirmed", "in_progress", "ready", "completed"];

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminDetailPesananPage({ params }: Props) {
  const { id } = use(params);
  const order = dummyOrders.find((o) => o.id === id);
  const [status, setStatus] = useState<OrderStatus>((order?.status as OrderStatus) ?? "pending");
  const [adminNote, setAdminNote] = useState(order?.adminNote ?? "");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");

  if (!order) notFound();

  const currentIdx = statusFlow.indexOf(status);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setStatus(newStatus);
    const res = await updateOrderStatusAction(id, newStatus, adminNote);
    if (res.success) {
      setToast(`Status diubah ke "${orderStatusConfig[newStatus].label}"`);
    } else {
      setToast(res.error || "Gagal mengubah status");
    }
    setTimeout(() => setToast(""), 2500);
  };

  const handleSendNotif = async () => {
    setSending(true);
    const res = await resendOrderNotificationAction(id);
    setSending(false);
    if (res.success) {
      setToast("Notifikasi WhatsApp berhasil dikirim!");
    } else {
      setToast(res.error || "Gagal mengirim notifikasi");
    }
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-[hsl(224,12%,12%)] text-white text-sm font-medium shadow-md animate-fade-in">
          <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
          {toast}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Link href="/admin/pesanan" className="flex items-center gap-1.5 text-sm text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] transition-colors">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Kembali
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[hsl(224,12%,12%)] tracking-tight font-mono">{order.code}</h1>
          <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">{formatDateTime(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail order */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Customer info */}
          <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
            <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-3">Data Pelanggan</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="text-[hsl(220,10%,46%)]">Nama</span><strong className="text-[hsl(224,12%,12%)]">{order.customerName}</strong></div>
              <div className="flex justify-between items-center">
                <span className="text-[hsl(220,10%,46%)]">WhatsApp</span>
                <a href={`https://wa.me/${order.customerWhatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-green-600 font-medium hover:text-green-700 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {order.customerWhatsapp}
                </a>
              </div>
              <div className="flex justify-between"><span className="text-[hsl(220,10%,46%)]">Pengambilan</span><span className="text-[hsl(224,12%,12%)]">{order.pickupMethod === "pickup" ? "Ambil di toko" : "Antar"}</span></div>
              {order.customerNote && (
                <div className="pt-2 border-t border-[hsl(220,13%,91%)]">
                  <p className="text-xs text-[hsl(220,10%,55%)] mb-0.5">Catatan Pelanggan</p>
                  <p className="text-sm text-[hsl(224,12%,12%)]">{order.customerNote}</p>
                </div>
              )}
            </div>
          </div>

          {/* Item list */}
          <div className="rounded-xl bg-white border border-[hsl(220,13%,91%)] overflow-hidden">
            <div className="px-5 py-3 border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)]">
              <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest">Daftar Item</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(220,13%,91%)]">
                  {["Item", "Varian", "Qty", "Harga Satuan", "Subtotal"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left admin-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(220,13%,91%)]">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {item.itemType === "service" ? <Printer className="w-3.5 h-3.5 text-[hsl(220,10%,55%)]" strokeWidth={1.5} /> : <Package className="w-3.5 h-3.5 text-[hsl(220,10%,55%)]" strokeWidth={1.5} />}
                        <span className="font-medium text-[hsl(224,12%,12%)]">{item.itemName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[hsl(220,10%,55%)]">{item.variantLabel ?? "—"}</td>
                    <td className="px-4 py-3 tabular-nums">{item.quantity}</td>
                    <td className="px-4 py-3 tabular-nums">{formatRupiah(item.unitPrice)}</td>
                    <td className="px-4 py-3 font-bold tabular-nums text-[hsl(224,12%,12%)]">
                      {formatRupiah(item.subtotal)}
                      {item.discountPercent > 0 && <span className="ml-1 text-xs text-green-600 font-normal">(-{item.discountPercent}%)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)]">
                  <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-right text-[hsl(220,10%,46%)]">Total Estimasi</td>
                  <td className="px-4 py-3 text-base font-bold text-[hsl(224,12%,12%)] tabular-nums">{formatRupiah(order.totalEstimate)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Status timeline */}
          <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
            <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-4">Riwayat Status</h2>
            <div className="flex flex-col gap-3">
              {order.statusLogs.map((log, idx) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${idx === order.statusLogs.length - 1 ? "bg-[hsl(224,12%,12%)]" : "bg-[hsl(220,14%,96%)] border border-[hsl(220,13%,91%)]"}`}>
                    {idx === order.statusLogs.length - 1 ? (
                      <CheckCircle className="w-3 h-3 text-white" strokeWidth={2} />
                    ) : (
                      <Clock className="w-3 h-3 text-[hsl(220,10%,55%)]" strokeWidth={2} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[hsl(224,12%,12%)]">
                      {log.fromStatus ? `${orderStatusConfig[log.fromStatus as OrderStatus]?.label} → ` : ""}
                      {orderStatusConfig[log.toStatus as OrderStatus]?.label}
                    </p>
                    <p className="text-xs text-[hsl(220,10%,55%)]">{log.note} · {formatDateTime(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="flex flex-col gap-4">
          {/* Ubah status */}
          <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
            <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-3">Ubah Status</h2>
            <div className="flex flex-col gap-2">
              {statusFlow.map((s, idx) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={s === "completed" && status !== "ready"}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                    status === s
                      ? "bg-[hsl(224,12%,12%)] text-white"
                      : idx <= currentIdx
                        ? "bg-[hsl(220,14%,96%)] text-[hsl(220,10%,55%)]"
                        : "border border-[hsl(220,13%,91%)] text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)]",
                    "disabled:opacity-40 disabled:cursor-not-allowed"
                  )}
                >
                  <span>{orderStatusConfig[s].label}</span>
                  {status === s && <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />}
                </button>
              ))}
              <button
                onClick={() => handleStatusChange("cancelled")}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Batalkan
              </button>
            </div>
          </div>

          {/* Catatan admin */}
          <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
            <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-3">Catatan Internal</h2>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              placeholder="Catatan untuk tim..."
              className="w-full text-sm px-3 py-2 rounded-lg border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:border-[hsl(224,12%,12%)] resize-none"
            />
          </div>

          {/* Notifikasi */}
          <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
            <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-3">Kirim Notifikasi</h2>
            <button
              onClick={handleSendNotif}
              disabled={sending}
              className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-60 transition-colors"
            >
              {sending ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Mengirim...</> : <><Send className="w-4 h-4" strokeWidth={1.5} />Kirim Notifikasi WA</>}
            </button>
            <p className="text-[10px] text-[hsl(220,10%,60%)] mt-2">Kirim status terkini ke pelanggan via WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
