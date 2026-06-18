"use client";
// src/components/admin/BlogForm.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, X, Eye, EyeOff } from "lucide-react";
import { slugify } from "@/lib/utils";
import type { Blog } from "@prisma/client";

interface Props {
  post?: Blog;
}

const empty = {
  title: "",
  slug: "",
  content: "",
  thumbnail: "",
  tags: [] as string[],
  published: false,
};

export default function BlogForm({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [form, setForm] = useState(
    isEdit ? { ...post, thumbnail: post.thumbnail ?? "" } : empty,
  );
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleTitleChange = (val: string) =>
    setForm((f) => ({
      ...f,
      title: val,
      slug: isEdit ? f.slug : slugify(val),
    }));

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) update("tags", [...form.tags, t]);
    setTagInput("");
  };

  const removeTag = (t: string) =>
    update(
      "tags",
      form.tags.filter((x) => x !== t),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = isEdit ? `/api/blog/${post!.slug}` : "/api/blog";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      router.push("/admin/blog");
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="card p-6 space-y-4">
        {/* Title & Slug */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="My Blog Post Title"
              className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent placeholder:text-slate-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Slug *
            </label>
            <input
              required
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="my-blog-post-title"
              className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-accent placeholder:text-slate-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Thumbnail URL
          </label>
          <input
            type="url"
            value={form.thumbnail}
            onChange={(e) => update("thumbnail", e.target.value)}
            placeholder="https://…"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent placeholder:text-slate-600"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="typescript, nextjs…"
              className="flex-1 bg-surface border border-surface-border rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-accent placeholder:text-slate-600"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-surface-border hover:bg-surface-card rounded-xl text-sm text-slate-300 transition-colors"
            >
              <Plus size={15} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-accent-muted text-accent rounded-lg"
              >
                {t}
                <button type="button" onClick={() => removeTag(t)}>
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Published toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
            className="w-4 h-4 rounded accent-indigo-500"
          />
          <span className="text-sm text-slate-300">Publish immediately</span>
        </label>
      </div>

      {/* Content editor */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface-border">
          <span className="text-sm font-medium text-slate-300">
            Content (HTML / Markdown)
          </span>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent transition-colors"
          >
            {preview ? (
              <>
                <EyeOff size={13} /> Edit
              </>
            ) : (
              <>
                <Eye size={13} /> Preview
              </>
            )}
          </button>
        </div>
        {preview ? (
          <div
            className="p-6 prose prose-invert max-w-none min-h-[400px]"
            dangerouslySetInnerHTML={{ __html: form.content }}
          />
        ) : (
          <textarea
            required
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            placeholder="Write your post content here (HTML or Markdown)…"
            className="w-full bg-transparent px-5 py-4 text-sm font-mono text-slate-200 focus:outline-none resize-none min-h-[400px] placeholder:text-slate-600"
          />
        )}
      </div>

      {error && <p className="text-rose-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors"
        >
          <Save size={15} />{" "}
          {saving ? "Saving…" : isEdit ? "Update post" : "Create post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 border border-surface-border hover:border-slate-600 text-slate-400 font-medium rounded-xl text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
