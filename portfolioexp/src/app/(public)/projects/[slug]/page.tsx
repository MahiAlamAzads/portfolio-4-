// src/app/(public)/projects/[slug]/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  Github,
  ArrowLeft,
  Eye,
  Calendar,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

async function getProject(slug: string) {
  return prisma.project.findUnique({
    where: {
      slug,
    },
  });
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.thumbnail
        ? [
            {
              url: project.thumbnail,
            },
          ]
        : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: Props) {
  const { slug } = await params;

  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="section">
      {/* Back */}
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-accent"
      >
        <ArrowLeft size={14} />
        All Projects
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {project.category && (
            <span className="font-mono text-xs text-accent">
              {project.category}
            </span>
          )}

          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar size={11} />
            {formatDate(project.createdAt)}
          </span>

          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Eye size={11} />
            {project.views.toLocaleString()} views
          </span>
        </div>

        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          {project.title}
        </h1>

        <p className="max-w-3xl text-lg text-slate-400">
          {project.summary}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              <ExternalLink size={15} />
              Live Demo
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-surface-border px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-accent"
            >
              <Github size={15} />
              Source Code
            </a>
          )}
        </div>
      </header>

      {/* Thumbnail */}
      {project.thumbnail && (
        <div className="relative mb-10 h-[320px] overflow-hidden rounded-3xl border border-surface-border md:h-[500px]">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            priority
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Tech Stack */}
      {project.techStack.length > 0 && (
        <section className="card mb-10 p-6">
          <h2 className="mb-4 font-mono text-sm text-accent">
            // Tech Stack
          </h2>

          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg bg-surface-border px-3 py-1.5 text-sm text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      <section className="card p-8">
        <div
          className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300"
          dangerouslySetInnerHTML={{
            __html: project.description,
          }}
        />
      </section>
    </article>
  );
}