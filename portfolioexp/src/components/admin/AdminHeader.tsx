"use client";
// src/components/admin/AdminHeader.tsx

import { useRouter } from "next/navigation";
import { LogOut, Bell } from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-14 border-b border-surface-border bg-surface-card/50 backdrop-blur-sm px-6 flex items-center justify-end gap-3">
      <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-surface-border transition-colors">
        <Bell size={16} />
      </button>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-rose-400 transition-colors"
      >
        <LogOut size={14} /> Sign out
      </button>
    </header>
  );
}
