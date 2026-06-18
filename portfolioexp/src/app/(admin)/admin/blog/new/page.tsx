// src/app/(admin)/admin/blog/new/page.tsx

import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Post</h1>
        <p className="text-slate-400 text-sm mt-1">Write a new blog post.</p>
      </div>
      <BlogForm />
    </div>
  );
}
