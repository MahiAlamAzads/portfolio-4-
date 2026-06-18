// prisma/seed.ts
// Run: npx prisma db seed

import { PrismaClient, SkillCategory, ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding database...");

  // ── Admin User ──────────────────────────────────────────────
  const hashedPw = await bcrypt.hash("#1234#Mahialams", 12);
  const user = await prisma.user.upsert({
    where: { email: "mahialamazad.bd@gmail.com" },
    update: {},
    create: {
      name: "Mahi Alam Azad",
      email: "mahialamazad.bd@gmail.com",
      password: hashedPw,
      role: "ADMIN",
    },
  });

  // ── Profile ─────────────────────────────────────────────────
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      fullName: "Mahi Alam Azad",
      title: "Full-Stack Engineer & DevOps Engineer",
      bio: "I build fast, accessible web applications at the intersection of great UX and solid engineering. 2+ years turning ideas into production systems.",
      location: "Rangpur, Bangladesh",
      email: "mahialamazad.bd@gmail.com",
      availability: true,
      socialLinks: {
        github: "https://github.com/mahialamazads",
        linkedin: "https://linkedin.com/in/mahialamazad",
        twitter: "https://twitter.com/mahialamazad",
      },
    },
  });

  // ── Skills ──────────────────────────────────────────────────
  const skills = [
    { name: "TypeScript",  category: SkillCategory.FRONTEND, level: 95, yearsOfExperience: 5 },
    { name: "React",       category: SkillCategory.FRONTEND, level: 90, yearsOfExperience: 5 },
    { name: "Next.js",     category: SkillCategory.FRONTEND, level: 95, yearsOfExperience: 4 },
    { name: "Tailwind CSS",category: SkillCategory.FRONTEND, level: 95, yearsOfExperience: 3 },
    { name: "Node.js",     category: SkillCategory.BACKEND,  level: 94, yearsOfExperience: 5 },
    { name: "PostgreSQL",  category: SkillCategory.DATABASE, level: 85, yearsOfExperience: 4 },
    { name: "Prisma",      category: SkillCategory.DATABASE, level: 90, yearsOfExperience: 3 },
    { name: "Docker",      category: SkillCategory.DEVOPS,   level: 78, yearsOfExperience: 3 },
    { name: "AWS",         category: SkillCategory.DEVOPS,   level: 72, yearsOfExperience: 2 },
  ];
  await prisma.skill.createMany({ data: skills, skipDuplicates: true });

  // ── Project ─────────────────────────────────────────────────
  // await prisma.project.upsert({
  //   where: { slug: "devflow" },
  //   update: {},
  //   create: {
  //     title: "DevFlow",
  //     slug: "devflow",
  //     summary: "An open-source GitHub-style issue tracker with real-time updates.",
  //     description: "Full-stack issue tracker built with Next.js 14, Prisma, and PostgreSQL…",
  //     techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
  //     githubUrl: "https://github.com/mahialamazads/devflow",
  //     liveUrl: "https://devflow.vercel.app",
  //     status: ProjectStatus.COMPLETED,
  //     featured: true,
  //     category: "SaaS",
  //     role: "Solo Developer",
  //   },
  // });

  // ── Settings ────────────────────────────────────────────────
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      theme: "dark",
      primaryColor: "#6366f1",
      seoTitle: "Mahi Alam Azad – Full-Stack Engineer",
      seoDescription:
        "Portfolio of Mahi Alam Azad, full-stack engineer specialising in Next.js, TypeScript and NodeJs.",
    },
  });

  console.log("✅  Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
