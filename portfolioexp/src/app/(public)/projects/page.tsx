// src/app/(public)/projects/page.tsx

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/public/ProjectCard";
import ProjectFilter from "@/components/public/ProjectFilter";

export const metadata: Metadata = { title: "Projects" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: { category?: string; status?: string };
}

export default async function ProjectsPage({ searchParams }: Props) {
  const { category, status } = searchParams;

  const projects = await prisma.project.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(status ? { status: status as any } : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  // Unique categories for filter UI
  const categories = await prisma.project.findMany({
    select: { category: true },
    distinct: ["category"],
    where: { category: { not: null } },
  });

  return (
    <div className="section">
      <p className="text-accent text-sm font-mono font-medium mb-1">
        // portfolio
      </p>
      <h1 className="text-4xl font-bold mb-3">Projects</h1>
      <p className="text-slate-400 mb-10 max-w-lg">
        Things I've shipped — side projects, client work, and open-source
        contributions.
      </p>

      <ProjectFilter
        categories={categories.map((c) => c.category!).filter(Boolean)}
        activeCategory={category}
      />

      {projects.length === 0 ? (
        <p className="text-slate-500 text-center py-20">No projects found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
