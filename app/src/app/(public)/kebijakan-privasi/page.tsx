import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — Dinar Fotocopy",
  description: "Kebijakan privasi Dinar Fotocopy mengenai pengumpulan, penggunaan, dan perlindungan data pribadi pelanggan.",
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 animate-fade-in">
      <div className="mb-8">
        <p className="text-xs font-semibold text-[hsl(38,92%,50%)] uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-3xl font-bold text-[hsl(224,12%,12%)] tracking-tight mb-2">Kebijakan Privasi</h1>
        <p className="text-xs text-[hsl(220,10%,55%)]">Terakhir diperbarui: 1 Januari 2025</p>
      </div>

      <div className="prose prose-sm max-w-none text-[hsl(220,10%,36%)] leading-relaxed">
        <p className="mb-6">
          Dinar Fotocopy (&ldquo;kami&rdquo;, &ldquo;toko&rdquo;) berkomitmen melindungi privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga data pribadi Anda sesuai dengan ketentuan yang berlaku di Indonesia, termasuk Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
        </p>

        {[
          {
            title: "1. Data yang Kami Kumpulkan",
            content: "Kami mengumpulkan data pribadi yang Anda berikan secara sukarela saat melakukan pemesanan, yaitu: nama lengkap, nomor WhatsApp, dan catatan pesanan. Data ini hanya digunakan untuk keperluan pemrosesan pesanan dan komunikasi terkait pesanan Anda.",
          },
          {
            title: "2. Penggunaan Data",
            content: "Data pribadi Anda digunakan untuk: (a) memproses dan memenuhi pesanan Anda, (b) mengirimkan notifikasi status pesanan via WhatsApp, (c) merespons pertanyaan atau keluhan Anda, dan (d) meningkatkan layanan kami. Kami tidak menggunakan data Anda untuk keperluan pemasaran tanpa persetujuan Anda.",
          },
          {
            title: "3. Penyimpanan Data",
            content: "Data pesanan disimpan di sistem kami yang aman selama diperlukan untuk keperluan operasional dan pelaporan internal. Kami tidak menjual, menyewakan, atau berbagi data pribadi Anda kepada pihak ketiga untuk tujuan komersial.",
          },
          {
            title: "4. Keamanan Data",
            content: "Kami menerapkan langkah-langkah keamanan teknis yang memadai untuk melindungi data Anda dari akses tidak sah, pengubahan, pengungkapan, atau penghapusan. Meski demikian, tidak ada sistem yang 100% aman dan kami tidak dapat menjamin keamanan absolut.",
          },
          {
            title: "5. Hak-Hak Anda",
            content: "Sesuai UU PDP, Anda berhak untuk: mengakses data pribadi Anda yang kami simpan, meminta koreksi data yang tidak akurat, meminta penghapusan data Anda (dengan ketentuan operasional), dan menarik persetujuan penggunaan data kapan saja. Untuk menggunakan hak-hak ini, hubungi kami via WhatsApp atau email.",
          },
          {
            title: "6. Notifikasi WhatsApp",
            content: "Dengan memberikan nomor WhatsApp saat pemesanan, Anda menyetujui penerimaan notifikasi otomatis terkait status pesanan Anda. Notifikasi ini dikirim melalui layanan WhatsApp Gateway pihak ketiga (Fonnte) yang juga berkomitmen menjaga kerahasiaan data.",
          },
          {
            title: "7. Perubahan Kebijakan",
            content: "Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan diumumkan di halaman ini. Penggunaan layanan kami setelah perubahan berlaku berarti Anda menyetujui kebijakan yang diperbarui.",
          },
          {
            title: "8. Hubungi Kami",
            content: "Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak-hak Anda terkait data pribadi, silakan hubungi kami di: WhatsApp 0812-3456-789 atau email dinar@fotocopy.id.",
          },
        ].map((section) => (
          <div key={section.title} className="mb-6">
            <h2 className="text-base font-semibold text-[hsl(224,12%,12%)] mb-2">{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
