"use client";
// src/components/public/ProjectFilter.tsx

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  categories: string[];
  activeCategory?: string;
}

export default function ProjectFilter({ categories, activeCategory }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  const setCategory = (cat?: string) => {
    const p = new URLSearchParams(params.toString());
    if (cat) p.set("category", cat); else p.delete("category");
    router.push(`${pathname}?${p.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory(undefined)}
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
          !activeCategory
            ? "bg-accent border-accent text-white"
            : "border-surface-border text-slate-400 hover:border-accent/40 hover:text-slate-200"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
            activeCategory === cat
              ? "bg-accent border-accent text-white"
              : "border-surface-border text-slate-400 hover:border-accent/40 hover:text-slate-200"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
