"use client";
// src/components/admin/DeleteProjectButton.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Props {
  slug:  string;
  title: string;
}

export default function DeleteProjectButton({ slug, title }: Props) {
  const router   = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    setLoading(true);
    try {
      await fetch(`/api/projects/${slug}`, { method: "DELETE" });
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
      aria-label={`Delete ${title}`}
    >
      <Trash2 size={14} />
    </button>
  );
}
