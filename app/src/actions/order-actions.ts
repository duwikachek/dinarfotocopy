"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  orders,
  orderItems,
  orderStatusLogs,
  OrderStatus,
  settings,
  messageTemplates,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatRupiah, generateWhatsAppUrl, normalizeWhatsApp } from "@/lib/utils";
import { sendNotificationWithLog } from "@/lib/whatsapp";

const createOrderSchema = z.object({
  customerName: z.string().min(3, "Nama pemesan minimal 3 karakter."),
  customerWhatsapp: z.string().regex(/^\d{10,15}$/, "Nomor WhatsApp harus 10–15 digit angka."),
  customerNote: z.string().max(500, "Catatan maksimal 500 karakter.").optional().nullable(),
  pickupMethod: z.enum(["pickup", "delivery"]).default("pickup"),
  items: z.array(
    z.object({
      type: z.enum(["service", "product"]),
      serviceId: z.string().optional().nullable(),
      productId: z.string().optional().nullable(),
      name: z.string().min(1),
      variantLabel: z.string().optional().nullable(),
      unitPrice: z.number().int().min(0),
      quantity: z.number().int().min(1).max(10000),
      discountPercent: z.number().min(0).max(100).default(0),
    })
  ).min(1, "Keranjang pesanan tidak boleh kosong."),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/**
 * Server Action: Membuat Pesanan Baru dari Keranjang Publik
 */
export async function createOrderAction(rawInput: CreateOrderInput) {
  const parsed = createOrderSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Data formulir tidak valid.",
    };
  }

  const { customerName, customerWhatsapp, customerNote, pickupMethod, items } = parsed.data;

  // Hitung ulang harga server-side
  let totalEstimate = 0;
  const processedItems = items.map((item) => {
    let disc = item.discountPercent || 0;
    // Diskon otomatis fotokopi & print jika berlaku
    if (item.type === "service" && disc === 0) {
      if (item.quantity >= 500) disc = 10;
      else if (item.quantity >= 100) disc = 5;
    }

    const priceAfterDiscount = Math.round(item.unitPrice * (1 - disc / 100));
    const subtotal = priceAfterDiscount * item.quantity;
    totalEstimate += subtotal;

    return {
      ...item,
      discountPercent: disc,
      subtotal,
    };
  });

  // Generate kode unik DF-YYMMDD-XXXX
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const randSeq = String(Math.floor(Math.random() * 9999)).padStart(4, "0");
  const orderCode = `DF-${yy}${mm}${dd}-${randSeq}`;

  const storeWa = process.env.NEXT_PUBLIC_STORE_WHATSAPP || "628123456789";

  // Build WhatsApp text message
  const lineItemsText = processedItems
    .map((it) => {
      const discText = it.discountPercent > 0 ? ` (diskon ${it.discountPercent}%)` : "";
      const label = it.variantLabel ? ` — ${it.variantLabel}` : "";
      return `• [${it.type.toUpperCase()}] ${it.name}${label}\n  ${it.quantity} × ${formatRupiah(it.unitPrice)}${discText} = ${formatRupiah(it.subtotal)}`;
    })
    .join("\n");

  const waMessage = `*Pesanan Baru Dinar Fotocopy*
Kode: *${orderCode}*

*Data Pemesan:*
Nama: ${customerName}
WhatsApp: ${customerWhatsapp}
Pengambilan: ${pickupMethod === "pickup" ? "Ambil di Toko" : "Pengantaran"}
${customerNote ? `Catatan: ${customerNote}\n` : ""}
*Rincian Item:*
${lineItemsText}

*Total Estimasi: ${formatRupiah(totalEstimate)}*

_Catatan: Estimasi harga dapat berubah setelah berkas diperiksa staf._`;

  const whatsappUrl = generateWhatsAppUrl(storeWa, waMessage);

  // Simpan ke database jika terhubung
  let createdOrderId: string | null = null;
  if (process.env.DATABASE_URL) {
    try {
      const insertedOrders = await db
        .insert(orders)
        .values({
          code: orderCode,
          customerName,
          customerWhatsapp: normalizeWhatsApp(customerWhatsapp),
          customerNote: customerNote || null,
          totalEstimate,
          status: "pending",
          pickupMethod,
        })
        .returning({ id: orders.id });

      createdOrderId = insertedOrders[0]?.id || null;

      if (createdOrderId) {
        // Insert order items
        for (const item of processedItems) {
          await db.insert(orderItems).values({
            orderId: createdOrderId,
            itemType: item.type,
            serviceId: item.serviceId || null,
            productId: item.productId || null,
            itemName: item.name,
            variantLabel: item.variantLabel || null,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.subtotal,
            discountPercent: item.discountPercent,
          });
        }

        // Insert initial status log
        await db.insert(orderStatusLogs).values({
          orderId: createdOrderId,
          fromStatus: null,
          toStatus: "pending",
          note: "Pesanan baru dibuat via website.",
        });

        // Kirim notifikasi WA ke nomor admin jika diaktifkan
        const adminWa = storeWa;
        sendNotificationWithLog({
          targetNumber: adminWa,
          message: `Order baru masuk, Bos! Kode ${orderCode} dari ${customerName} — Total ${formatRupiah(totalEstimate)}. Cek dashboard admin.`,
          orderId: createdOrderId,
          templateKey: "order_created_admin",
        }).catch((e) => console.error("Gagal kirim notif admin:", e));
      }
    } catch (dbErr) {
      console.error("Gagal menyimpan order ke database:", dbErr);
    }
  }

  revalidatePath("/admin/pesanan");
  revalidatePath("/admin/dashboard");

  return {
    success: true,
    orderCode,
    whatsappUrl,
    orderId: createdOrderId,
  };
}

/**
 * Server Action: Update Status Pesanan oleh Admin
 */
export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus,
  note?: string
) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Status diupdate (simulasi mode development)" };
  }

  try {
    const existingOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    const order = existingOrders[0];
    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan." };
    }

    const previousStatus = order.status;

    // Update orders status
    await db
      .update(orders)
      .set({
        status: newStatus,
        updatedAt: new Date(),
        adminNote: note ? note : order.adminNote,
      })
      .where(eq(orders.id, orderId));

    // Tambah log status
    await db.insert(orderStatusLogs).values({
      orderId,
      fromStatus: previousStatus,
      toStatus: newStatus,
      changedByUserId: session.user.id || null,
      note: note || `Status diubah dari ${previousStatus} menjadi ${newStatus}`,
    });

    // Kirim notifikasi WhatsApp otomatis ke pelanggan sesuai status baru
    let templateKey = `status_${newStatus}_customer`;
    let defaultMsg = `Halo ${order.customerName}, pesanan Anda dengan kode ${order.code} saat ini berstatus: ${newStatus}. Terima kasih 🙏 — Dinar Fotocopy.`;

    if (newStatus === "in_progress") {
      defaultMsg = `Halo ${order.customerName}, pesanan Anda ${order.code} sedang kami kerjakan ya. Estimasi selesai hari ini. Terima kasih 🙏 — Dinar Fotocopy.`;
    } else if (newStatus === "ready") {
      defaultMsg = `Kabar baik! Pesanan ${order.code} sudah selesai dan siap diambil di Dinar Fotocopy. Total biaya: ${formatRupiah(order.finalTotal || order.totalEstimate)}. Terima kasih 🙏.`;
    } else if (newStatus === "completed") {
      defaultMsg = `Pesanan ${order.code} telah selesai dan diambil. Terima kasih banyak telah mempercayai Dinar Fotocopy 🙏.`;
    } else if (newStatus === "cancelled") {
      defaultMsg = `Pesanan ${order.code} telah dibatalkan. Hubungi kami jika ada pertanyaan. Terima kasih 🙏 — Dinar Fotocopy.`;
    }

    // Trigger kirim pesan WhatsApp
    sendNotificationWithLog({
      targetNumber: order.customerWhatsapp,
      message: defaultMsg,
      orderId: order.id,
      templateKey,
    }).catch((e) => console.error("Gagal kirim notif status update:", e));

    revalidatePath("/admin/pesanan");
    revalidatePath(`/admin/pesanan/${orderId}`);
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/notifikasi");

    return { success: true };
  } catch (err: any) {
    console.error("Gagal update status pesanan:", err);
    return { success: false, error: err?.message || "Terjadi kesalahan saat update status." };
  }
}

/**
 * Server Action: Kirim Ulang Notifikasi WhatsApp Manual oleh Admin
 */
export async function resendOrderNotificationAction(orderId: string, customMessage?: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Notifikasi dikirim ulang (simulasi)" };
  }

  try {
    const existingOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    const order = existingOrders[0];
    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan." };
    }

    const message = customMessage || `Halo ${order.customerName}, update pesanan ${order.code}: status saat ini ${order.status}. Total: ${formatRupiah(order.finalTotal || order.totalEstimate)}. Hubungi kami jika butuh bantuan 🙏 — Dinar Fotocopy.`;

    const res = await sendNotificationWithLog({
      targetNumber: order.customerWhatsapp,
      message,
      orderId: order.id,
      templateKey: `manual_resend_${order.status}`,
    });

    revalidatePath(`/admin/pesanan/${orderId}`);
    revalidatePath("/admin/notifikasi");

    return { success: res.success, error: res.error };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal mengirim ulang notifikasi." };
  }
}
