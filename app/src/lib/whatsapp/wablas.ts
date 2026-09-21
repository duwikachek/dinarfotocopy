import { WhatsAppProvider, SendWhatsAppParams, SendWhatsAppResult } from "./types";
import { normalizeWhatsApp } from "@/lib/utils";

export class WablasProvider implements WhatsAppProvider {
  name = "wablas";
  private token: string;
  private apiUrl: string;

  constructor() {
    this.token = process.env.WABLAS_TOKEN || "";
    this.apiUrl = process.env.WABLAS_API_URL || "https://jakarta.wablas.com/api/send-message";
  }

  async sendMessage({ targetNumber, message }: SendWhatsAppParams): Promise<SendWhatsAppResult> {
    if (!this.token) {
      console.warn("[Wablas] WABLAS_TOKEN belum diisi di environment variables. Pesan disimulasikan.");
      return {
        success: true,
        providerMessageId: `mock-wablas-${Date.now()}`,
        responsePayload: { simulated: true, note: "WABLAS_TOKEN not set" },
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
          phone: formattedTarget,
          message: message,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status === false) {
        return {
          success: false,
          error: data.message || `HTTP ${res.status}`,
          responsePayload: data,
        };
      }

      return {
        success: true,
        providerMessageId: data.data?.messages?.[0]?.id || `wablas-${Date.now()}`,
        responsePayload: data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Unknown error during Wablas API call",
      };
    }
  }
}
