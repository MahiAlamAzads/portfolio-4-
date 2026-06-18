import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye, Clock } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  try {
    const post = await prisma.blog.findUnique({
      where: {
        slug: params.slug,
      },
      select: {
        title: true,
      },
    });

    if (!post) {
      return {
        title: "Blog Not Found",
      };
    }

    return {
      title: post.title,
    };
  } catch {
    return {
      title: "Blog",
    };
  }
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blog.findFirst({
    where: {
      slug: params.slug,
      published: true,
    },
  });

  if (!post) {
    notFound();
  }

  const mins = readingTime(post.content);

  return (
    <article className="section max-w-3xl mx-auto">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        All posts
      </Link>

      <header className="mb-10 space-y-4">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="text-xs px-2.5 py-1 bg-accent-muted text-accent rounded-full hover:bg-accent/20 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {formatDate(post.createdAt)}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {mins} min read
          </span>

          <span className="flex items-center gap-1.5">
            <Eye size={13} />
            {post.views.toLocaleString()} views
          </span>
        </div>
      </header>

      {post.thumbnail && (
        <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <div
        className="
          prose
          prose-invert
          prose-indigo
          max-w-none
          prose-headings:font-bold
          prose-headings:tracking-tight
          prose-a:text-accent
          prose-a:no-underline
          hover:prose-a:underline
          prose-code:text-accent
          prose-code:bg-surface-card
          prose-code:px-1.5
          prose-code:py-0.5
          prose-code:rounded
          prose-pre:bg-surface-card
          prose-pre:border
          prose-pre:border-surface-border
          prose-blockquote:border-accent
          prose-blockquote:text-slate-400
          prose-img:rounded-xl
        "
        dangerouslySetInnerHTML={{
          __html: post.content,
        }}
      />

      <footer className="mt-14 pt-8 border-t border-surface-border">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} />
          Back to blog
        </Link>
      </footer>
    </article>
  );
}