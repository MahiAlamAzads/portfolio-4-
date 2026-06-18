// src/app/(admin)/admin/projects/[slug]/edit/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";

interface Props { params: { slug: string } }

export default async function EditProjectPage({ params }: Props) {
  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <p className="text-slate-400 text-sm mt-1 font-mono">/{project.slug}</p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
