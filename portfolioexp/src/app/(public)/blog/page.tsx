// src/app/(public)/blog/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Calendar, Eye, Tag } from "lucide-react";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: { tag?: string };
}

export default async function BlogPage({ searchParams }: Props) {
  const { tag } = searchParams;

  const posts = await prisma.blog.findMany({
    where: {
      published: true,
      ...(tag ? { tags: { has: tag } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  // Collect all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  return (
    <div className="section">
      <p className="text-accent text-sm font-mono font-medium mb-1">
        // writing
      </p>
      <h1 className="text-4xl font-bold mb-3">Blog</h1>
      <p className="text-slate-400 mb-10 max-w-lg">
        Thoughts on engineering, open source, and building great products.
      </p>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              !tag
                ? "bg-accent border-accent text-white"
                : "border-surface-border text-slate-400 hover:border-accent/40"
            }`}
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                tag === t
                  ? "bg-accent border-accent text-white"
                  : "border-surface-border text-slate-400 hover:border-accent/40"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-slate-500 text-center py-20">No posts yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="card overflow-hidden group hover:border-accent/40 transition-colors"
            >
              {post.thumbnail && (
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5 space-y-3">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 bg-accent-muted text-accent rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="font-semibold text-lg leading-snug">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {formatDate(post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} /> {post.views.toLocaleString()}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
