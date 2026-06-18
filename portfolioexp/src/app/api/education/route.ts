// src/app/api/education/route.ts

import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { ok, created, badRequest, serverError } from "@/lib/api";

const educationSchema = z.object({
  institution: z.string().min(1),
  degree:      z.string().min(1),
  field:       z.string().min(1),
  startYear:   z.number().int().min(1900).max(2100),
  endYear:     z.number().int().min(1900).max(2100).nullable().optional(),
  description: z.string().nullable().optional(),
});

export async function GET() {
  try {
    const items = await prisma.education.findMany({ orderBy: { startYear: "desc" } });
    return ok(items);
  } catch {
    return serverError();
  }
}

export const POST = withAdmin(async (req: NextRequest) => {
  try {
    const body   = await req.json();
    const parsed = educationSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const item = await prisma.education.create({ data: parsed.data });
    return created(item);
  } catch {
    return serverError();
  }
});
