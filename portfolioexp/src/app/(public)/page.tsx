// src/app/(public)/page.tsx
// Server component – fetches profile & featured projects at build/request time.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, MapPin, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/public/ProjectCard";
import SkillBadge from "@/components/public/SkillBadge";
import ExperiencePage from "@/components/public/ExperiencePage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await prisma.profile.findFirst({
    select: {
      fullName: true,
    },
  });

  return {
    title: profile?.fullName || "Portfolio",
  };
}

async function getProfile() {
  return prisma.profile.findFirst();
}

async function getHomeData() {
  const [profile, featuredProjects, skills] = await Promise.all([
    getProfile(),
    prisma.project.findMany({
      where: { featured: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.skill.findMany({ orderBy: { level: "desc" }, take: 12 }),
  ]);
  return { profile, featuredProjects, skills };
}

export default async function HomePage() {
  const { profile, featuredProjects, skills } = await getHomeData();

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="section pt-24 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-up">
            {/* Availability badge */}
            {profile?.availability && (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                Open to opportunities
              </span>
            )}

            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              {profile?.fullName ?? "Full-Stack"}{" "}
              <span className="gradient-text block">
                {profile?.title ?? "Engineer"}
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
              {profile?.bio ??
                "Building fast, accessible products at the intersection of great UX and solid engineering."}
            </p>

            {profile?.location && (
              <p className="flex items-center gap-1.5 text-slate-500 text-sm">
                <MapPin size={14} /> {profile.location}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-medium rounded-xl transition-colors"
              >
                View work <ArrowRight size={16} />
              </Link>
              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-surface-border hover:border-accent text-slate-300 font-medium rounded-xl transition-colors"
                >
                  <Download size={16} /> Resume
                </a>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/30 to-violet-600/20 blur-3xl" />
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.fullName}
                  fill
                  className="object-cover rounded-3xl relative z-10"
                  priority
                />
              ) : (
                <div className="w-full h-full rounded-3xl bg-surface-card border border-surface-border relative z-10 flex items-center justify-center">
                  <Sparkles className="text-accent" size={64} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ExperiencePage />

      {/* ── Featured Projects ───────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="section">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-accent text-sm font-mono font-medium mb-1">
                // selected work
              </p>
              <h2 className="text-3xl font-bold">Featured Projects</h2>
            </div>
            <Link
              href="/projects"
              className="hidden md:flex items-center gap-1 text-sm text-slate-400 hover:text-accent transition-colors"
            >
              All projects <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* ── Skills Preview ──────────────────────────────────── */}
      {skills.length > 0 && (
        <section className="section">
          <p className="text-accent text-sm font-mono font-medium mb-1">
            // tech stack
          </p>
          <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} />
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/about#skills"
              className="text-sm text-slate-400 hover:text-accent transition-colors inline-flex items-center gap-1"
            >
              See full skills breakdown <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
