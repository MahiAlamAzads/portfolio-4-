// src/app/api/skills/[id]/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { skillSchema } from "@/lib/validations";
import { ok, badRequest, notFound, noContent, serverError } from "@/lib/api";

export const PUT = withAdmin(async (req: NextRequest, { params }) => {
  try {
    const body   = await req.json();
    const parsed = skillSchema.partial().safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);
    const skill = await prisma.skill.update({ where: { id: params!.id }, data: parsed.data });
    return ok(skill);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound();
    return serverError();
  }
});

export const DELETE = withAdmin(async (_: NextRequest, { params }) => {
  try {
    await prisma.skill.delete({ where: { id: params!.id } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound();
    return serverError();
  }
});
