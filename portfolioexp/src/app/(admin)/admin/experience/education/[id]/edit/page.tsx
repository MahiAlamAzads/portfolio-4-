// src/app/(admin)/admin/experience/education/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EducationForm from "@/components/admin/EducationForm";

interface Props { params: { id: string } }

export default async function EditEducationPage({ params }: Props) {
  const education = await prisma.education.findUnique({ where: { id: params.id } });
  if (!education) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Education</h1>
        <p className="text-slate-400 text-sm mt-1">
          {education.degree} in {education.field} · {education.institution}
        </p>
      </div>
      <EducationForm education={education} />
    </div>
  );
}
