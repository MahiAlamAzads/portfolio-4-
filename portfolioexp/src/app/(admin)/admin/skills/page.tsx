import { prisma } from "@/lib/prisma";
import SkillsManager from "@/components/admin/SkillsManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [
      { category: "asc" },
      { level: "desc" },
    ],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Skills
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          {skills.length} skills across all
          categories
        </p>
      </div>

      <SkillsManager
        initialSkills={skills}
      />
    </div>
  );
}