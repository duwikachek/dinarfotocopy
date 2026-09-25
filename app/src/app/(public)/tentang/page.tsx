import { MapPin, Clock, Phone, Mail, Heart, Award, Users, Printer } from "lucide-react";
import type { Metadata } from "next";
import { getStoreSettings } from "@/db/queries";

export const metadata: Metadata = {
  title: "Tentang Kami — Dinar Fotocopy",
  description: "Kenali lebih dekat Dinar Fotocopy, usaha percetakan dan fotokopi terpercaya di Bandung sejak 2015. Visi, nilai, dan tim kami.",
};

export const dynamic = "force-dynamic";

const values = [
  { icon: Heart, title: "Pelayanan Tulus", desc: "Kami melayani setiap pelanggan dengan hati, bukan sekadar transaksi." },
  { icon: Award, title: "Kualitas Terjamin", desc: "Mesin modern, bahan berkualitas, dan kontrol kualitas ketat di setiap produksi." },
  { icon: Clock, title: "Tepat Waktu", desc: "Kami menghormati waktu Anda. Pengerjaan sesuai estimasi, tanpa alasan." },
  { icon: Users, title: "Dekat dengan Komunitas", desc: "Sudah melayani ribuan pelajar, mahasiswa, dan pelaku usaha di Bandung." },
];

export default async function TentangPage() {
  const settings = await getStoreSettings();
  const waNumber = String(settings.store_whatsapp || "628123456789");
  const formattedPhone = waNumber.startsWith("62") ? "0" + waNumber.slice(2) : waNumber;
  const waUrl = `https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(settings.store_name)}%2C%20saya%20ingin%20bertanya.`;
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-white border-b border-[hsl(220,13%,91%)] py-14 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-[hsl(38,92%,50%)] uppercase tracking-widest mb-3">Tentang Kami</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[hsl(224,12%,12%)] tracking-tight mb-4">
            Lebih dari sekedar tempat fotokopi
          </h1>
          <p className="text-[hsl(220,10%,46%)] leading-relaxed max-w-2xl mx-auto">
            Sejak 2015, Dinar Fotocopy hadir untuk memenuhi kebutuhan cetak harian masyarakat Bandung dengan layanan yang cepat, rapi, dan harga bersahabat.
          </p>
        </div>
      </section>

      {/* Cerita */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight mb-4">Cerita Kami</h2>
              <div className="flex flex-col gap-4 text-sm text-[hsl(220,10%,36%)] leading-relaxed">
                <p>Dinar Fotocopy didirikan pada tahun 2015 oleh Pak Dinar di sebuah ruko kecil di Jl. Melati, Bandung. Berawal dari sebuah mesin fotokopi bekas dan tekad untuk melayani warga sekitar dengan baik, usaha ini perlahan tumbuh menjadi tempat yang dipercaya ribuan pelanggan.</p>
                <p>Kami memahami bahwa di balik setiap dokumen yang dicetak, ada kebutuhan nyata yang mendesak — skripsi yang harus dikumpulkan besok, proposal yang ingin dipresentasikan, atau foto kenangan yang ingin dibingkai. Karena itu, kami tidak pernah anggap remeh satu pun pesanan.</p>
                <p>Kini, dengan mesin cetak modern dan tim yang berpengalaman, Dinar Fotocopy siap melayani kebutuhan cetak Anda — dari satu lembar hingga ribuan eksemplar.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "2015", label: "Tahun berdiri" },
                  { value: "1.000+", label: "Pelanggan aktif" },
                  { value: "7", label: "Jenis layanan" },
                  { value: "98%", label: "Tingkat kepuasan" },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl border border-[hsl(220,13%,91%)] text-center">
                    <p className="text-2xl font-bold text-[hsl(224,12%,12%)] tabular-nums">{stat.value}</p>
                    <p className="text-xs text-[hsl(220,10%,55%)] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              {/* Info toko */}
              <div className="p-5 rounded-xl bg-[hsl(220,14%,96%)] border border-[hsl(220,13%,91%)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(224,12%,12%)] flex items-center justify-center">
                    <Printer className="w-4 h-4 text-white" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-bold text-[hsl(224,12%,12%)]">{settings.store_name}</p>
                </div>
                <div className="flex flex-col gap-2 text-sm text-[hsl(220,10%,46%)]">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[hsl(38,92%,50%)] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{settings.store_address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[hsl(38,92%,50%)] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <p>{settings.store_operational_hours}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[hsl(38,92%,50%)]" strokeWidth={1.5} />
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(224,12%,12%)] transition-colors">
                      {formattedPhone} (WhatsApp)
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[hsl(38,92%,50%)]" strokeWidth={1.5} />
                    <a href="mailto:order@dinarfotocopy.id" className="hover:text-[hsl(224,12%,12%)] transition-colors">
                      order@dinarfotocopy.id
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai */}
      <section className="py-14 bg-[hsl(220,14%,96%)] border-y border-[hsl(220,13%,91%)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight mb-8 text-center">Nilai yang Kami Pegang</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(38,92%,50%)/0.1] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[hsl(38,92%,45%)]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-semibold text-[hsl(224,12%,12%)] mb-1">{val.title}</h3>
                  <p className="text-xs text-[hsl(220,10%,46%)] leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
