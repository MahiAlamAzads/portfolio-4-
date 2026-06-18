// src/app/api/skills/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { skillSchema } from "@/lib/validations";
import { ok, created, badRequest, serverError } from "@/lib/api";

// GET /api/skills?category=FRONTEND
export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") ?? undefined;
    const skills = await prisma.skill.findMany({
      where: category ? { category: category as any } : undefined,
      orderBy: [{ category: "asc" }, { level: "desc" }],
    });
    return ok(skills);
  } catch {
    return serverError();
  }
}

// POST /api/skills – admin
export const POST = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const skill = await prisma.skill.create({ data: parsed.data });
    return created(skill);
  } catch {
    return serverError();
  }
});
