// src/components/public/ProjectCard.tsx

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, Eye } from "lucide-react";
import type { Project } from "@prisma/client";

interface Props {
  project: Project;
}

const STATUS_COLORS: Record<string, string> = {
  COMPLETED:   "text-emerald-400 bg-emerald-400/10",
  IN_PROGRESS: "text-amber-400 bg-amber-400/10",
  ARCHIVED:    "text-slate-400 bg-slate-400/10",
};

export default function ProjectCard({ project }: Props) {
  return (
    <article className="card overflow-hidden group hover:border-accent/40 transition-colors">
      {/* Thumbnail */}
      <div className="relative h-44 bg-surface-border overflow-hidden">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-violet-600/10">
            <span className="font-mono text-2xl text-accent/50">{"{/}"}</span>
          </div>
        )}

        {/* Status badge */}
        <span className={`absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[project.status]}`}>
          {project.status.replace("_", " ")}
        </span>
      </div>

      <div className="p-5 space-y-3">
        {/* Category */}
        {project.category && (
          <p className="text-xs text-accent font-mono">{project.category}</p>
        )}

        <h3 className="font-semibold text-lg leading-snug">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent transition-colors">
            {project.title}
          </Link>
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{project.summary}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="text-xs px-2 py-0.5 bg-surface-border rounded-md text-slate-400">
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-xs px-2 py-0.5 text-slate-500">+{project.techStack.length - 4}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-border">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Eye size={12} /> {project.views.toLocaleString()} views
          </div>
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-200 transition-colors" aria-label="GitHub">
                <Github size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="text-slate-500 hover:text-accent transition-colors" aria-label="Live demo">
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
