"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { dummyFaq } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

function FaqItem({ item }: { item: typeof dummyFaq[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("border border-[hsl(220,13%,91%)] rounded-xl overflow-hidden transition-all duration-150", open && "border-[hsl(224,12%,75%)]")}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-[hsl(220,14%,98%)] transition-colors"
        aria-expanded={open}
      >
        <p className="text-sm font-medium text-[hsl(224,12%,12%)] leading-snug">{item.question}</p>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[hsl(38,92%,50%)] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        ) : (
          <ChevronDown className="w-4 h-4 text-[hsl(220,10%,55%)] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[hsl(220,13%,91%)] animate-fade-in">
          <p className="text-sm text-[hsl(220,10%,36%)] leading-relaxed pt-4">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 animate-fade-in">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold text-[hsl(38,92%,50%)] uppercase tracking-widest mb-2">Bantuan</p>
        <h1 className="text-3xl font-bold text-[hsl(224,12%,12%)] tracking-tight mb-2">
          Pertanyaan yang Sering Diajukan
        </h1>
        <p className="text-[hsl(220,10%,46%)] text-sm max-w-md mx-auto">
          Tidak menemukan jawaban yang Anda cari? Hubungi kami langsung via WhatsApp.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-10">
        {dummyFaq.map((item) => (
          <FaqItem key={item.id} item={item} />
        ))}
      </div>

      {/* CTA */}
      <div className="p-6 rounded-xl bg-[hsl(220,14%,96%)] border border-[hsl(220,13%,91%)] text-center">
        <p className="text-sm font-semibold text-[hsl(224,12%,12%)] mb-1">Masih punya pertanyaan?</p>
        <p className="text-xs text-[hsl(220,10%,46%)] mb-4">Tim kami siap membantu Anda setiap hari.</p>
        <a
          href="https://wa.me/628123456789?text=Halo%20Dinar%20Fotocopy%2C%20saya%20punya%20pertanyaan."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-10 px-6 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors"
        >
          <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
          Tanya via WhatsApp
        </a>
      </div>
    </div>
  );
}
