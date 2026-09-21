import Link from "next/link";
import { CheckCircle, MessageCircle, ArrowRight, Home } from "lucide-react";

export default function CartSuksesPage({
  searchParams,
}: {
  searchParams: Promise<{ kode?: string }>;
}) {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight mb-2">
        Pesanan Berhasil Dibuat!
      </h1>
      <p className="text-[hsl(220,10%,46%)] text-sm mb-6 leading-relaxed">
        Terima kasih! Pesanan Anda telah tercatat. WhatsApp sudah terbuka —
        silakan kirim pesan ke Dinar Fotocopy untuk konfirmasi.
      </p>

      {/* Order code */}
      <div className="p-4 rounded-xl border border-[hsl(220,13%,91%)] bg-[hsl(220,14%,96%)] mb-8">
        <p className="text-xs text-[hsl(220,10%,55%)] mb-1">Kode Pesanan Anda</p>
        <p className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-widest font-mono">
          DF-250120-0001
        </p>
        <p className="text-xs text-[hsl(220,10%,55%)] mt-1">
          Simpan kode ini untuk melacak status pesanan via WhatsApp.
        </p>
      </div>

      {/* Steps */}
      <div className="text-left flex flex-col gap-3 mb-8">
        <p className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-1">
          Langkah Selanjutnya
        </p>
        {[
          "Kirim pesan WhatsApp yang sudah terbuka ke nomor toko",
          "Admin kami akan konfirmasi dan meminta berkas Anda",
          "Pesanan dikerjakan & Anda mendapat notifikasi WA",
          "Ambil pesanan sesuai waktu yang disepakati",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[hsl(224,12%,12%)] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-[hsl(220,10%,36%)]">{step}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="https://wa.me/628123456789"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors"
        >
          <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
          Buka WhatsApp
        </a>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 h-11 rounded-lg border border-[hsl(220,13%,91%)] text-sm font-medium text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
        >
          <Home className="w-4 h-4" strokeWidth={1.5} />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
