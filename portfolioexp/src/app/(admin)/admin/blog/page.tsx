// src/app/(admin)/admin/blog/page.tsx

import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Globe, EyeOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import DeleteBlogButton from "@/components/admin/DeleteBlogButton";

export default async function AdminBlogPage() {
  const posts = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-slate-400 text-sm mt-1">
            {posts.filter((p) => p.published).length} published · {posts.filter((p) => !p.published).length} drafts
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus size={15} /> New post
        </Link>
      </div>

      <div className="card divide-y divide-surface-border">
        {posts.length === 0 ? (
          <p className="p-6 text-slate-500 text-sm text-center">
            No posts yet.{" "}
            <Link href="/admin/blog/new" className="text-accent hover:underline">
              Write your first post →
            </Link>
          </p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{post.title}</span>
                  {post.published ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <Globe size={10} /> Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <EyeOff size={10} /> Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono">/{post.slug}</p>
                <div className="flex items-center gap-3 text-xs text-slate-600 pt-0.5">
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="flex items-center gap-1"><Eye size={10} /> {post.views}</span>
                  <div className="flex gap-1">
                    {post.tags.slice(0, 3).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 bg-surface-border rounded text-slate-500">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {post.published && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-accent hover:bg-accent-muted transition-colors"
                  >
                    <Eye size={14} />
                  </Link>
                )}
                <Link
                  href={`/admin/blog/${post.slug}/edit`}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                >
                  <Edit size={14} />
                </Link>
                <DeleteBlogButton slug={post.slug} title={post.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
