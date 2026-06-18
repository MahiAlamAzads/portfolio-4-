// src/app/api/education/[id]/route.ts

import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { ok, badRequest, notFound, noContent, serverError } from "@/lib/api";

const schema = z.object({
  institution: z.string().min(1).optional(),
  degree:      z.string().min(1).optional(),
  field:       z.string().min(1).optional(),
  startYear:   z.number().int().optional(),
  endYear:     z.number().int().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const PUT = withAdmin(async (req: NextRequest, { params }) => {
  try {
    const body   = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);
    const item = await prisma.education.update({ where: { id: params!.id }, data: parsed.data });
    return ok(item);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound();
    return serverError();
  }
});

export const DELETE = withAdmin(async (_: NextRequest, { params }) => {
  try {
    await prisma.education.delete({ where: { id: params!.id } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound();
    return serverError();
  }
});
