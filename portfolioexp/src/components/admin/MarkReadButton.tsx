"use client";
// src/components/admin/MarkReadButton.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const markRead = async () => {
    setLoading(true);
    try {
      await fetch(`/api/messages/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ read: true }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={markRead}
      disabled={loading}
      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-400 transition-colors disabled:opacity-50"
    >
      <Check size={12} /> Mark read
    </button>
  );
}
