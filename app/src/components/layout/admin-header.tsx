"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, User, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

// Map pathname → breadcrumb
function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const labelMap: Record<string, string> = {
    admin: "Admin",
    dashboard: "Dasbor",
    layanan: "Layanan & Harga",
    kategori: "Kategori",
    produk: "Produk ATK",
    pesanan: "Pesanan",
    notifikasi: "Log WhatsApp",
    pengaturan: "Pengaturan Toko",
    profil: "Profil Saya",
  };

  return segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = labelMap[seg] ?? seg;
    const isLast = idx === segments.length - 1;
    return { href, label, isLast };
  });
}

export function AdminHeader() {
  const breadcrumbs = useBreadcrumbs();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[hsl(220,13%,91%)] h-14 flex items-center px-6 gap-4">
      {/* Breadcrumbs */}
      <nav className="flex-1 flex items-center gap-1 text-sm" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, idx) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {idx > 0 && (
              <ChevronRight
                className="w-3.5 h-3.5 text-[hsl(220,10%,65%)]"
                strokeWidth={1.5}
              />
            )}
            {crumb.isLast ? (
              <span className="font-medium text-[hsl(224,12%,12%)] truncate max-w-[180px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className={cn(
                  "text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] transition-colors",
                  idx === 0 && "hidden sm:block"
                )}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right: Notif + Profile */}
      <div className="flex items-center gap-1">
        <Link
          href="/admin/notifikasi"
          className="relative flex items-center justify-center w-8 h-8 rounded-lg text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
          aria-label="Log Notifikasi"
        >
          <Bell className="w-4 h-4" strokeWidth={1.5} />
          {/* Unread dot */}
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[hsl(38,92%,50%)] rounded-full" />
        </Link>
        <Link
          href="/admin/profil"
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)] transition-colors"
          aria-label="Profil Admin"
        >
          <div className="w-7 h-7 rounded-full bg-[hsl(220,14%,96%)] border border-[hsl(220,13%,91%)] flex items-center justify-center">
            <User className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <span className="hidden sm:block text-sm font-medium text-[hsl(224,12%,12%)] max-w-[120px] truncate">
            {session?.user?.name || "Admin Dinar"}
          </span>
        </Link>
      </div>
    </header>
  );
}
