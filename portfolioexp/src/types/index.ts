// src/types/index.ts
// Central type definitions – mirrors Prisma models where useful
// and adds API / UI-specific types.

import type { SkillCategory, ProjectStatus, Role } from "@prisma/client";

// Re-export Prisma enums for convenience in components
export { SkillCategory, ProjectStatus, Role };

// ─── Auth ─────────────────────────────────────────────────────
export interface JWTPayload {
  sub: string;   // userId
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
}

// ─── Profile ──────────────────────────────────────────────────
export interface SocialLinks {
  github?:    string;
  linkedin?:  string;
  twitter?:   string;
  youtube?:   string;
  website?:   string;
  [key: string]: string | undefined;
}

export interface ProfileData {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  avatar?: string | null;
  banner?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  resumeUrl?: string | null;
  availability: boolean;
  socialLinks: SocialLinks;
}

// ─── Project ──────────────────────────────────────────────────
export interface ProjectData {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  thumbnail?: string | null;
  images: string[];
  videoUrl?: string | null;
  status: ProjectStatus;
  featured: boolean;
  category?: string | null;
  role?: string | null;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Skill ────────────────────────────────────────────────────
export interface SkillData {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  icon?: string | null;
  yearsOfExperience?: number | null;
}

// ─── Experience ───────────────────────────────────────────────
export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  logo?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  technologies: string[];
}

// ─── API Helpers ──────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
