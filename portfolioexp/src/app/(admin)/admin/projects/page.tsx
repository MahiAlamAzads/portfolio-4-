// src/app/(admin)/admin/projects/page.tsx

import Link from "next/link";
import {
  Plus,
  Edit,
  ExternalLink,
  Star,
  Github,
  RefreshCw,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import SyncGithubProjectsButton from "@/components/admin/SyncGithubProjectsButton";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Projects
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            {projects.length} total projects
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SyncGithubProjectsButton />

          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <Plus size={16} />
            New Project
          </Link>
        </div>
      </div>

      {/* Projects */}
      <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-card">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Github
              size={42}
              className="mb-4 text-slate-600"
            />

            <h3 className="text-lg font-semibold text-slate-300">
              No projects found
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Create your first project manually or sync
              your GitHub repositories.
            </p>

            <div className="mt-6 flex gap-3">
              <SyncGithubProjectsButton />

              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                <Plus size={15} />
                Create Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-start gap-4 p-5 transition-colors hover:bg-surface/40"
              >
                {/* Thumbnail */}
                <div className="hidden sm:block">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-surface-border bg-surface">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Github
                        size={18}
                        className="text-slate-600"
                      />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold text-slate-100">
                      {project.title}
                    </h3>

                    {project.featured && (
                      <Star
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />
                    )}

                    <span
                      className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        project.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : project.status === "IN_PROGRESS"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-slate-500/10 text-slate-400"
                      }`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-1 text-sm text-slate-400">
                    {project.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.techStack
                      .slice(0, 5)
                      .map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg bg-surface px-2.5 py-1 text-xs text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-700/30 hover:text-slate-200"
                    >
                      <Github size={15} />
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}

                  <Link
                    href={`/admin/projects/${project.slug}/edit`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
                  >
                    <Edit size={15} />
                  </Link>

                  <DeleteProjectButton
                    slug={project.slug}
                    title={project.title}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}