import { db } from "@/db";
import { notifications, orders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { dummyNotifications } from "@/lib/dummy-data";
import { formatDateTime } from "@/lib/utils";
import { NotifikasiTable } from "./notifikasi-table";

export const dynamic = "force-dynamic";

async function getNotifications() {
  if (!process.env.DATABASE_URL) {
    return dummyNotifications.map((n) => ({
      id: n.id,
      orderId: n.orderId,
      orderCode: n.orderCode,
      channel: n.channel,
      provider: n.provider,
      targetNumber: n.targetNumber,
      targetName: n.targetName,
      templateKey: n.templateKey,
      messageBody: n.messageBody,
      status: n.status as "queued" | "sent" | "failed",
      providerMessageId: n.providerMessageId ?? null,
      retryCount: n.retryCount,
      sentAt: n.sentAt ?? null,
      createdAt: n.createdAt,
    }));
  }

  try {
    const rows = await db
      .select({
        id: notifications.id,
        orderId: notifications.orderId,
        channel: notifications.channel,
        provider: notifications.provider,
        targetNumber: notifications.targetNumber,
        templateKey: notifications.templateKey,
        messageBody: notifications.messageBody,
        status: notifications.status,
        providerMessageId: notifications.providerMessageId,
        retryCount: notifications.retryCount,
        sentAt: notifications.sentAt,
        createdAt: notifications.createdAt,
        orderCode: orders.code,
        customerName: orders.customerName,
      })
      .from(notifications)
      .leftJoin(orders, eq(notifications.orderId, orders.id))
      .orderBy(desc(notifications.createdAt))
      .limit(100);

    return rows.map((n) => ({
      id: n.id,
      orderId: n.orderId,
      orderCode: n.orderCode ?? "—",
      channel: n.channel,
      provider: n.provider,
      targetNumber: n.targetNumber,
      targetName: n.customerName ?? "—",
      templateKey: n.templateKey,
      messageBody: n.messageBody,
      status: n.status as "queued" | "sent" | "failed",
      providerMessageId: n.providerMessageId,
      retryCount: n.retryCount,
      sentAt: n.sentAt,
      createdAt: n.createdAt,
    }));
  } catch (err) {
    console.error("Gagal fetch notifications:", err);
    return dummyNotifications.map((n) => ({
      id: n.id,
      orderId: n.orderId,
      orderCode: n.orderCode,
      channel: n.channel,
      provider: n.provider,
      targetNumber: n.targetNumber,
      targetName: n.targetName,
      templateKey: n.templateKey,
      messageBody: n.messageBody,
      status: n.status as "queued" | "sent" | "failed",
      providerMessageId: n.providerMessageId ?? null,
      retryCount: n.retryCount,
      sentAt: n.sentAt ?? null,
      createdAt: n.createdAt,
    }));
  }
}

export default async function AdminNotifikasiPage() {
  const notifList = await getNotifications();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Log Notifikasi WhatsApp</h1>
        <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">{notifList.length} notifikasi tercatat</p>
      </div>

      <NotifikasiTable notifications={notifList} />
    </div>
  );
}
