import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke format Rupiah Indonesia
 * Contoh: 25000 → "Rp 25.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal ke format Indonesia
 * Contoh: 2025-01-20 → "20 Januari 2025"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Format tanggal + waktu
 * Contoh: "20 Januari 2025, 14.30 WIB"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
    timeZoneName: "short",
  }).format(d);
}

/**
 * Generate slug dari nama
 * Contoh: "Fotokopi A4 HVS 70gr" → "fotokopi-a4-hvs-70gr"
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Hitung diskon bulk untuk fotokopi/print
 */
export function calculateBulkDiscount(quantity: number): number {
  if (quantity >= 500) return 10;
  if (quantity >= 100) return 5;
  return 0;
}

/**
 * Hitung subtotal dengan diskon
 */
export function calculateSubtotal(
  price: number,
  quantity: number,
  discountPercent: number = 0
): number {
  const raw = price * quantity;
  const discount = raw * (discountPercent / 100);
  return raw - discount;
}

/**
 * Generate WhatsApp URL
 */
export function generateWhatsAppUrl(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

/**
 * Truncate teks panjang
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Check apakah nomor WhatsApp valid (10-15 digit)
 */
export function isValidWhatsApp(phone: string): boolean {
  return /^\d{10,15}$/.test(phone.replace(/[\s\-\+]/g, ""));
}

/**
 * Format nomor WhatsApp ke format internasional
 * Contoh: "08123456789" → "628123456789"
 */
export function normalizeWhatsApp(phone: string): string {
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, "");
  if (cleaned.startsWith("0")) {
    return "62" + cleaned.slice(1);
  }
  if (cleaned.startsWith("8")) {
    return "62" + cleaned;
  }
  return cleaned;
}
