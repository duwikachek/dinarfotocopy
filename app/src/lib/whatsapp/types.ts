export interface SendWhatsAppParams {
  targetNumber: string;
  message: string;
  orderId?: string;
  templateKey: string;
}

export interface SendWhatsAppResult {
  success: boolean;
  providerMessageId?: string;
  responsePayload?: Record<string, unknown>;
  error?: string;
}

export interface WhatsAppProvider {
  name: string;
  sendMessage(params: SendWhatsAppParams): Promise<SendWhatsAppResult>;
}
