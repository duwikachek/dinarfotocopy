"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type NotifStatus = "queued" | "sent" | "failed";

export interface NotifItem {
  id: string;
  orderId: string | null;
  orderCode: string;
  channel: string;
  provider: string;
  targetNumber: string;
  targetName: string;
  templateKey: string;
  messageBody: string;
  status: NotifStatus;
  providerMessageId: string | null;
  retryCount: number;
  sentAt: Date | string | null;
  createdAt: Date | string;
}

interface Props {
  notifications: NotifItem[];
}

export function NotifikasiTable({ notifications }: Props) {
  const [selected, setSelected] = useState<NotifItem | null>(null);

  return (
    <>
      <div className="rounded-xl bg-white border border-[hsl(220,13%,91%)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)]">
                {["Tujuan", "Kode Order", "Template", "Status", "Retry", "Waktu Kirim", "Detail"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left admin-table-header whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(220,13%,91%)]">
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[hsl(220,10%,55%)]">
                    Belum ada log notifikasi.
                  </td>
                </tr>
              ) : notifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-[hsl(220,14%,98%)] transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-[hsl(224,12%,12%)]">{notif.targetName}</p>
                    <p className="text-xs text-[hsl(220,10%,55%)] font-mono">{notif.targetNumber}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-[hsl(224,12%,12%)]">{notif.orderCode}</td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,46%)]">
                    <code className="bg-[hsl(220,14%,96%)] px-1.5 py-0.5 rounded text-[10px]">{notif.templateKey}</code>
                  </td>
                  <td className="px-4 py-3.5">
                    {notif.status === "sent" ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Terkirim
                      </span>
                    ) : notif.status === "failed" ? (
                      <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                        <XCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Gagal
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">Antrian</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,55%)] tabular-nums">{notif.retryCount}x</td>
                  <td className="px-4 py-3.5 text-xs text-[hsl(220,10%,55%)] whitespace-nowrap">
                    {notif.sentAt ? formatDateTime(notif.sentAt instanceof Date ? notif.sentAt : new Date(notif.sentAt)) : "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setSelected(notif)}
                      className="flex items-center gap-1 text-xs text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                      Lihat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] p-6 w-full max-w-lg animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[hsl(224,12%,12%)]">Detail Notifikasi</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-[hsl(220,10%,55%)] hover:text-[hsl(224,12%,12%)] transition-colors text-sm"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { label: "Tujuan", val: `${selected.targetName} (${selected.targetNumber})` },
                { label: "Kode Order", val: selected.orderCode },
                { label: "Provider", val: selected.provider },
                { label: "Template Key", val: selected.templateKey },
                { label: "Status", val: selected.status === "sent" ? "Terkirim" : selected.status === "failed" ? "Gagal" : "Antrian" },
                { label: "Provider Message ID", val: selected.providerMessageId ?? "—" },
                { label: "Retry Count", val: `${selected.retryCount}x` },
                {
                  label: "Waktu Kirim",
                  val: selected.sentAt
                    ? formatDateTime(selected.sentAt instanceof Date ? selected.sentAt : new Date(selected.sentAt))
                    : "—",
                },
              ].map((row) => (
                <div key={row.label} className="flex gap-3">
                  <span className="w-36 flex-shrink-0 text-[hsl(220,10%,55%)]">{row.label}</span>
                  <span className="text-[hsl(224,12%,12%)] font-medium">{row.val}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-[hsl(220,13%,91%)]">
                <p className="text-xs text-[hsl(220,10%,55%)] mb-1.5">Isi Pesan</p>
                <div className="bg-[hsl(220,14%,96%)] rounded-lg p-3 text-xs text-[hsl(224,12%,12%)] leading-relaxed whitespace-pre-line">
                  {selected.messageBody}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
