// src/app/(admin)/admin/experience/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ExperienceForm from "@/components/admin/ExperienceForm";

interface Props { params: { id: string } }

export default async function EditExperiencePage({ params }: Props) {
  const experience = await prisma.experience.findUnique({ where: { id: params.id } });
  if (!experience) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Experience</h1>
        <p className="text-slate-400 text-sm mt-1">
          {experience.role} at {experience.company}
        </p>
      </div>
      <ExperienceForm experience={experience} />
    </div>
  );
}
