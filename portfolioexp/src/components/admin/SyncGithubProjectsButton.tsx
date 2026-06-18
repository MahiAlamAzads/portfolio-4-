"use client";

import { useState } from "react";
import { RefreshCw, Github } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SyncGithubProjectsButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/projects/sync-github", {
        method: "POST",
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to sync projects");
      }

      alert(`Synced ${data.data.synced} projects\nFailed: ${data.data.failed}`);

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Failed to sync projects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-surface border border-surface-border px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <RefreshCw size={16} className="animate-spin" />
      ) : (
        <Github size={16} />
      )}

      {loading ? "Syncing..." : "Sync GitHub Projects"}
    </button>
  );
}
