// src/app/api/experience/[id]/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { experienceSchema } from "@/lib/validations";
import { ok, badRequest, notFound, noContent, serverError } from "@/lib/api";

export const PUT = withAdmin(async (req: NextRequest, { params }) => {
  try {
    const body   = await req.json();
    const parsed = experienceSchema.partial().safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);
    const item = await prisma.experience.update({ where: { id: params!.id }, data: parsed.data });
    return ok(item);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound();
    return serverError();
  }
});

export const DELETE = withAdmin(async (_: NextRequest, { params }) => {
  try {
    await prisma.experience.delete({ where: { id: params!.id } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound();
    return serverError();
  }
});
