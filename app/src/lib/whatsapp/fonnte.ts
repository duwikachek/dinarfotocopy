import { WhatsAppProvider, SendWhatsAppParams, SendWhatsAppResult } from "./types";
import { normalizeWhatsApp } from "@/lib/utils";

export class FonnteProvider implements WhatsAppProvider {
  name = "fonnte";
  private token: string;
  private apiUrl: string;

  constructor() {
    this.token = process.env.FONNTE_TOKEN || "";
    this.apiUrl = process.env.FONNTE_API_URL || "https://api.fonnte.com/send";
  }

  async sendMessage({ targetNumber, message }: SendWhatsAppParams): Promise<SendWhatsAppResult> {
    if (!this.token) {
      console.warn("[Fonnte] FONNTE_TOKEN belum diisi di environment variables. Pesan disimulasikan.");
      return {
        success: true,
        providerMessageId: `mock-fonnte-${Date.now()}`,
        responsePayload: { simulated: true, note: "FONNTE_TOKEN not set" },
      };
    }

    try {
      const formattedTarget = normalizeWhatsApp(targetNumber);
      const res = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Authorization: this.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: formattedTarget,
          message: message,
          countryCode: "62",
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status === false) {
        return {
          success: false,
          error: data.reason || data.message || `HTTP ${res.status}`,
          responsePayload: data,
        };
      }

      return {
        success: true,
        providerMessageId: data.id?.[0] || data.id || `fonnte-${Date.now()}`,
        responsePayload: data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Unknown error during Fonnte API call",
      };
    }
  }
}
