"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Settings,
  Package,
  ShoppingBag,
  FileText,
  Bell,
  Tag,
  User,
  Printer,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dasbor",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Pesanan",
    href: "/admin/pesanan",
    icon: ShoppingBag,
  },
  {
    label: "Layanan & Harga",
    href: "/admin/layanan",
    icon: FileText,
  },
  {
    label: "Kategori",
    href: "/admin/kategori",
    icon: Tag,
  },
  {
    label: "Produk ATK",
    href: "/admin/produk",
    icon: Package,
  },
  {
    label: "Log WhatsApp",
    href: "/admin/notifikasi",
    icon: Bell,
  },
  {
    label: "Pengaturan Toko",
    href: "/admin/pengaturan",
    icon: Settings,
  },
];

const bottomItems = [
  {
    label: "Profil Saya",
    href: "/admin/profil",
    icon: User,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="fixed left-0 top-0 z-40 h-full w-60 bg-white border-r border-[hsl(220,13%,91%)] flex flex-col">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[hsl(220,13%,91%)]">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Image
              src="/logo.png"
              alt="Logo Dinar Fotocopy"
              width={28}
              height={28}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-[hsl(224,12%,12%)] tracking-tight leading-tight">
              Dinar Fotocopy
            </p>
            <p className="text-[10px] text-[hsl(220,10%,55%)] font-medium uppercase tracking-wider">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        <p className="px-2 mb-2 text-[10px] font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest">
          Menu Utama
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
                active
                  ? "bg-[hsl(224,12%,12%)] text-white"
                  : "text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  active
                    ? "text-white"
                    : "text-[hsl(220,10%,55%)] group-hover:text-[hsl(224,12%,12%)]"
                )}
                strokeWidth={1.5}
              />
              <span className="flex-1">{item.label}</span>
              {active && (
                <ChevronRight className="w-3 h-3 text-white/60" strokeWidth={1.5} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-[hsl(220,13%,91%)] flex flex-col gap-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
                active
                  ? "bg-[hsl(220,14%,96%)] text-[hsl(224,12%,12%)]"
                  : "text-[hsl(220,10%,46%)] hover:text-[hsl(224,12%,12%)] hover:bg-[hsl(220,14%,96%)]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  active ? "text-[hsl(224,12%,12%)]" : "text-[hsl(220,10%,55%)] group-hover:text-[hsl(224,12%,12%)]"
                )}
                strokeWidth={1.5}
              />
              {item.label}
            </Link>
          );
        })}

        {/* Logout */}
        <button
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-[hsl(220,10%,46%)] hover:text-red-600 hover:bg-red-50 transition-all duration-150 group"
          onClick={async () => {
            await signOut({ callbackUrl: "/admin/login" });
          }}
        >
          <LogOut
            className="w-4 h-4 flex-shrink-0 text-[hsl(220,10%,55%)] group-hover:text-red-500"
            strokeWidth={1.5}
          />
          Keluar
        </button>
      </div>
    </aside>
  );
}
