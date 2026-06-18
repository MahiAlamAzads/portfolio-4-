// src/app/(public)/about/page.tsx

import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import SkillBadge from "@/components/public/SkillBadge";
import { MapPin, Mail, Download, CheckCircle } from "lucide-react";

export const metadata: Metadata = { title: "About" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [profile, skills, experience, education] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { level: "desc" }],
    }),
    prisma.experience.findMany({
      orderBy: [{ current: "desc" }, { startDate: "desc" }],
    }),
    prisma.education.findMany({ orderBy: { startYear: "desc" } }),
  ]);

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>(
    (acc, s) => {
      acc[s.category] = [...(acc[s.category] ?? []), s];
      return acc;
    },
    {},
  );

  return (
    <div className="section space-y-20">
      {/* Bio */}
      <section className="grid md:grid-cols-3 gap-12 items-start">
        <div className="md:col-span-2 space-y-5">
          <p className="text-accent text-sm font-mono font-medium">
            // about me
          </p>
          <h1 className="text-4xl font-bold">{profile?.fullName ?? "About"}</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            {profile?.bio}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            {profile?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {profile.location}
              </span>
            )}
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <Mail size={14} /> {profile.email}
              </a>
            )}
            {profile?.availability && (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle size={14} /> Open to work
              </span>
            )}
          </div>
          {profile?.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-surface-border hover:border-accent text-slate-300 rounded-xl text-sm font-medium transition-colors"
            >
              <Download size={14} /> Download resume
            </a>
          )}
        </div>

        {profile?.avatar && (
          <div className="relative w-48 h-48 mx-auto md:mx-0">
            <Image
              src={profile.avatar}
              alt={profile.fullName}
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        )}
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section id="skills">
          <p className="text-accent text-sm font-mono font-medium mb-1">
            // skills
          </p>
          <h2 className="text-3xl font-bold mb-8">Technologies</h2>
          <div className="space-y-6">
            {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
              <div key={cat}>
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">
                  {cat}
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {catSkills.map((skill) => (
                    <div key={skill.id} className="card px-4 py-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {skill.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="skill-bar">
                        <div
                          className="skill-bar-fill"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <p className="text-accent text-sm font-mono font-medium mb-1">
            // career
          </p>
          <h2 className="text-3xl font-bold mb-8">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="card p-6 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.role}</h3>
                    <p className="text-accent text-sm">{exp.company}</p>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    {new Date(exp.startDate).getFullYear()} –{" "}
                    {exp.current
                      ? "Present"
                      : exp.endDate
                        ? new Date(exp.endDate).getFullYear()
                        : ""}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 bg-surface-border rounded text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <p className="text-accent text-sm font-mono font-medium mb-1">
            // education
          </p>
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
                      <p className="text-slate-400 text-sm mt-2">
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
    </div>
  );
}
