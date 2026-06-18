// src/app/api/experience/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { experienceSchema } from "@/lib/validations";
import { ok, created, badRequest, serverError } from "@/lib/api";

export async function GET() {
  try {
    const items = await prisma.experience.findMany({
      orderBy: [{ current: "desc" }, { startDate: "desc" }],
    });
    return ok(items);
  } catch {
    return serverError();
  }
}

export const POST = withAdmin(async (req: NextRequest) => {
  try {
    const body   = await req.json();
    const parsed = experienceSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const item = await prisma.experience.create({ data: parsed.data });
    return created(item);
  } catch {
    return serverError();
  }
});
