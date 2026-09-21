import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSessionProvider>
      <div className="min-h-screen bg-[hsl(220,14%,97%)] admin-theme">
        <AdminSidebar />
        <div className="ml-60 flex flex-col min-h-screen">
          <AdminHeader />
          <main className="flex-1 p-6 lg:p-8 animate-fade-in">{children}</main>
        </div>
      </div>
    </AuthSessionProvider>
  );
}
