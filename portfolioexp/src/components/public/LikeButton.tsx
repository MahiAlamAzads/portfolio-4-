"use client";
// src/components/public/LikeButton.tsx

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  initialLikes: number;
}

export default function LikeButton({ slug, initialLikes }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    const res = await fetch(`/api/projects/${slug}/like`, { method: "POST" });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    const data = await res.json();
    if (data.success) setLikes(data.data.likes);
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
        liked
          ? "bg-rose-500/10 border-rose-500/30 text-rose-400 cursor-default"
          : "border-surface-border text-slate-400 hover:border-rose-500/40 hover:text-rose-400",
      )}
    >
      <Heart
        size={15}
        className={cn(
          "transition-transform",
          animating && "scale-125",
          liked && "fill-rose-400",
        )}
      />
      {likes.toLocaleString()}
    </button>
  );
}
