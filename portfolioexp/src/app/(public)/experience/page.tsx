// src/app/(public)/experience/page.tsx

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Briefcase, GraduationCap, Award } from "lucide-react";

export const metadata: Metadata = { title: "Experience" };
export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const [experience, education, certifications] = await Promise.all([
    prisma.experience.findMany({
      orderBy: [{ current: "desc" }, { startDate: "desc" }],
    }),
    prisma.education.findMany({ orderBy: { startYear: "desc" } }),
    prisma.certification.findMany({ orderBy: { issueDate: "desc" } }),
  ]);

  return (
    <div className="section space-y-20">
      {/* Work Experience */}
      <section>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-accent text-sm font-mono font-medium">
            // work history
          </p>
        </div>
        <h1 className="text-4xl font-bold mb-10">Experience</h1>

        {experience.length === 0 ? (
          <p className="text-slate-500">No experience listed yet.</p>
        ) : (
          <div className="relative pl-6 border-l border-surface-border space-y-8">
            {experience.map((exp, i) => (
              <div key={exp.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-[29px] w-3 h-3 rounded-full bg-accent border-2 border-surface" />

                <div className="card p-6 space-y-3 hover:border-accent/30 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.role}</h3>
                      <p className="text-accent text-sm font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        {formatDate(exp.startDate)} —{" "}
                        {exp.current ? (
                          <span className="text-emerald-400 font-medium">
                            Present
                          </span>
                        ) : exp.endDate ? (
                          formatDate(exp.endDate)
                        ) : (
                          ""
                        )}
                      </p>
                      {exp.current && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 bg-surface-border rounded text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Education */}
      {education.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap size={16} className="text-accent" />
            <p className="text-accent text-sm font-mono font-medium">
              // education
            </p>
          </div>
          <h2 className="text-3xl font-bold mb-8">Education</h2>

          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-accent text-sm mt-0.5">
                      {edu.institution}
                    </p>
                    {edu.description && (
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    {edu.startYear} – {edu.endYear ?? "Present"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-1">
            <Award size={16} className="text-accent" />
            <p className="text-accent text-sm font-mono font-medium">
              // certifications
            </p>
          </div>
          <h2 className="text-3xl font-bold mb-8">Certifications</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="card p-5 space-y-2 hover:border-accent/30 transition-colors"
              >
                <h3 className="font-medium text-sm">{cert.title}</h3>
                <p className="text-accent text-xs">{cert.issuer}</p>
                <p className="text-slate-500 text-xs">
                  {formatDate(cert.issueDate)}
                </p>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-accent transition-colors underline underline-offset-2"
                  >
                    Verify credential →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
