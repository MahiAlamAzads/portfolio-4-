// src/app/(admin)/admin/experience/page.tsx

import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import DeleteExperienceButton from "@/components/admin/DeleteExperienceButton";
import DeleteEducationButton  from "@/components/admin/DeleteEducationButton";

export default async function AdminExperiencePage() {
  const [experience, education] = await Promise.all([
    prisma.experience.findMany({ orderBy: [{ current: "desc" }, { startDate: "desc" }] }),
    prisma.education.findMany({ orderBy: { startYear: "desc" } }),
  ]);

  return (
    <div className="space-y-10">

      {/* ── Work Experience ─────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Experience</h1>
            <p className="text-slate-400 text-sm mt-0.5">{experience.length} entries</p>
          </div>
          <Link
            href="/admin/experience/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={15} /> Add
          </Link>
        </div>

        <div className="card divide-y divide-surface-border">
          {experience.length === 0 ? (
            <p className="p-6 text-slate-500 text-sm text-center">
              No experience entries yet.{" "}
              <Link href="/admin/experience/new" className="text-accent hover:underline">Add one →</Link>
            </p>
          ) : (
            experience.map((exp) => (
              <div key={exp.id} className="p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{exp.role}</span>
                    {exp.current && (
                      <span className="text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-md">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-accent mt-0.5">{exp.company}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDate(exp.startDate)} —{" "}
                    {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
                  </p>
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exp.technologies.slice(0, 4).map((t) => (
                        <span key={t} className="text-xs px-1.5 py-0.5 bg-surface-border rounded text-slate-400">
                          {t}
                        </span>
                      ))}
                      {exp.technologies.length > 4 && (
                        <span className="text-xs text-slate-500">+{exp.technologies.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/experience/${exp.id}/edit`}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                  >
                    <Edit size={14} />
                  </Link>
                  <DeleteExperienceButton id={exp.id} label={`${exp.role} at ${exp.company}`} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Education ───────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Education</h2>
            <p className="text-slate-400 text-sm mt-0.5">{education.length} entries</p>
          </div>
          <Link
            href="/admin/experience/education/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-surface-border hover:border-accent text-slate-300 text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={15} /> Add
          </Link>
        </div>

        <div className="card divide-y divide-surface-border">
          {education.length === 0 ? (
            <p className="p-6 text-slate-500 text-sm text-center">
              No education entries yet.{" "}
              <Link href="/admin/experience/education/new" className="text-accent hover:underline">Add one →</Link>
            </p>
          ) : (
            education.map((edu) => (
              <div key={edu.id} className="p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-xs text-accent mt-0.5">{edu.institution}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {edu.startYear} – {edu.endYear ?? "Present"}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{edu.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/experience/education/${edu.id}/edit`}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                  >
                    <Edit size={14} />
                  </Link>
                  <DeleteEducationButton id={edu.id} label={`${edu.degree} – ${edu.institution}`} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
