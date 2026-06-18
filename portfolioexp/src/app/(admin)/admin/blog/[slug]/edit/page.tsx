// src/app/(admin)/admin/blog/[slug]/edit/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/BlogForm";

interface Props { params: { slug: string } }

export default async function EditBlogPage({ params }: Props) {
  const post = await prisma.blog.findUnique({ where: { slug: params.slug } });
  if (!post) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <p className="text-slate-400 text-sm mt-1 font-mono">/{post.slug}</p>
      </div>
      <BlogForm post={post} />
    </div>
  );
}
