// src/components/public/SkillBadge.tsx

import type { Skill } from "@prisma/client";

const CATEGORY_COLORS: Record<string, string> = {
  FRONTEND: "border-blue-500/30 text-blue-400",
  BACKEND:  "border-green-500/30 text-green-400",
  DATABASE: "border-amber-500/30 text-amber-400",
  DEVOPS:   "border-rose-500/30 text-rose-400",
  MOBILE:   "border-purple-500/30 text-purple-400",
  DESIGN:   "border-pink-500/30 text-pink-400",
  TESTING:  "border-teal-500/30 text-teal-400",
  OTHER:    "border-slate-500/30 text-slate-400",
};

interface Props {
  skill: Skill;
  showLevel?: boolean;
}

export default function SkillBadge({ skill, showLevel = false }: Props) {
  const colorClass = CATEGORY_COLORS[skill.category] ?? CATEGORY_COLORS.OTHER;

  return (
    <div className={`inline-flex flex-col gap-1 px-3 py-2 rounded-xl border bg-surface-card text-sm font-medium ${colorClass}`}>
      <span>{skill.name}</span>
      {showLevel && (
        <div className="skill-bar w-20">
          <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
        </div>
      )}
    </div>
  );
}
