// src/app/api/profile/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { profileSchema } from "@/lib/validations";
import { ok, badRequest, notFound, serverError } from "@/lib/api";

// GET /api/profile – public
export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      include: { user: { select: { name: true, email: true } } },
    });
    if (!profile) return notFound("Profile not configured yet");
    return ok(profile);
  } catch {
    return serverError();
  }
}

// PUT /api/profile – admin only
export const PUT = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const existing = await prisma.profile.findFirst();
    if (!existing) return notFound("Profile not found");

    const updated = await prisma.profile.update({
      where: { id: existing.id },
      data: parsed.data,
    });
    return ok(updated);
  } catch {
    return serverError();
  }
});
