// src/lib/validations.ts
// Zod schemas for all API inputs.

import { z } from "zod";

// ─── Auth ──────────────────────────────────────────────────────
export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

// ─── Profile ──────────────────────────────────────────────────
export const profileSchema = z.object({
  fullName:     z.string().min(1).max(120),
  title:        z.string().min(1).max(200),
  bio:          z.string().min(1),
  avatar:       z.string().url().optional().or(z.literal("")),
  banner:       z.string().url().optional().or(z.literal("")),
  location:     z.string().optional(),
  email:        z.string().email().optional().or(z.literal("")),
  phone:        z.string().optional(),
  resumeUrl:    z.string().url().optional().or(z.literal("")),
  availability: z.boolean().default(true),
  socialLinks:  z.record(z.string()).default({}),
});

// ─── Skill ────────────────────────────────────────────────────
export const skillSchema = z.object({
  name:              z.string().min(1).max(80),
  category:          z.enum(["FRONTEND","BACKEND","DEVOPS","DATABASE","MOBILE","DESIGN","TESTING","OTHER"]),
  level:             z.number().int().min(0).max(100),
  icon:              z.string().optional(),
  yearsOfExperience: z.number().optional(),
});

// ─── Project ──────────────────────────────────────────────────
export const projectSchema = z.object({
  title:       z.string().min(1).max(200),
  slug:        z.string().regex(/^[a-z0-9-]+$/),
  summary:     z.string().min(1).max(400),
  description: z.string().min(1),
  techStack:   z.array(z.string()).min(1),
  githubUrl:   z.string().url().optional().or(z.literal("")),
  liveUrl:     z.string().url().optional().or(z.literal("")),
  thumbnail:   z.string().optional(),
  images:      z.array(z.string()).default([]),
  videoUrl:    z.string().optional(),
  status:      z.enum(["IN_PROGRESS","COMPLETED","ARCHIVED"]).default("COMPLETED"),
  featured:    z.boolean().default(false),
  category:    z.string().optional(),
  role:        z.string().optional(),
});

// ─── Experience ───────────────────────────────────────────────
export const experienceSchema = z.object({
  company:      z.string().min(1),
  role:         z.string().min(1),
  logo:         z.string().optional(),
  startDate:    z.string().datetime(),
  endDate:      z.string().datetime().optional(),
  current:      z.boolean().default(false),
  description:  z.string().min(1),
  technologies: z.array(z.string()).default([]),
});

// ─── Blog ─────────────────────────────────────────────────────
export const blogSchema = z.object({
  title:     z.string().min(1).max(300),
  slug:      z.string().regex(/^[a-z0-9-]+$/),
  content:   z.string().min(1),
  thumbnail: z.string().optional(),
  tags:      z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

// ─── Contact Message ──────────────────────────────────────────
export const messageSchema = z.object({
  name:    z.string().min(1).max(120),
  email:   z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
});
