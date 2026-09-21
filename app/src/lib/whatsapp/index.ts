import { WhatsAppProvider, SendWhatsAppParams, SendWhatsAppResult } from "./types";
import { FonnteProvider } from "./fonnte";
import { WablasProvider } from "./wablas";
import { db } from "@/db";
import { notifications } from "@/db/schema";

export function getWhatsAppProvider(): WhatsAppProvider {
  const providerName = process.env.WHATSAPP_GATEWAY_PROVIDER?.toLowerCase() || "fonnte";
  if (providerName === "wablas") {
    return new WablasProvider();
  }
  return new FonnteProvider();
}

/**
 * Mengirim notifikasi WhatsApp dan mencatat hasilnya ke tabel `notifications`
 */
export async function sendNotificationWithLog(params: SendWhatsAppParams): Promise<SendWhatsAppResult> {
  const provider = getWhatsAppProvider();
  const result = await provider.sendMessage(params);

  // Catat ke database notifications
  if (process.env.DATABASE_URL) {
    try {
      await db.insert(notifications).values({
        orderId: params.orderId || null,
        channel: "whatsapp",
        provider: provider.name,
        targetNumber: params.targetNumber,
        templateKey: params.templateKey,
        messageBody: params.message,
        status: result.success ? "sent" : "failed",
        providerMessageId: result.providerMessageId || null,
        responsePayload: (result.responsePayload || (result.error ? { error: result.error } : {})) as any,
        sentAt: result.success ? new Date() : null,
      });
    } catch (dbErr) {
      console.error("Gagal mencatat log notifikasi ke DB:", dbErr);
    }
  }

  return result;
}

export * from "./types";
