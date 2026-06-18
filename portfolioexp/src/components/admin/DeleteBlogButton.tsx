"use client";
// src/components/admin/DeleteBlogButton.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteBlogButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await fetch(`/api/blog/${slug}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50"
    >
      <Trash2 size={14} />
    </button>
  );
}
