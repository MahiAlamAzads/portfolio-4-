// src/app/(admin)/layout.tsx
// Sidebar + header shell for all admin pages (login is in a separate route group).

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader  from "@/components/admin/AdminHeader";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-surface">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
