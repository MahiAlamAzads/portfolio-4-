// src/app/api/projects/[slug]/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { projectSchema } from "@/lib/validations";
import { ok, badRequest, notFound, noContent, serverError } from "@/lib/api";

// GET /api/projects/:slug – public
export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const project = await prisma.project.update({
      where: { slug: params.slug },
      data:  { views: { increment: 1 } },
    });
    return ok(project);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Project not found");
    return serverError();
  }
}

// PUT /api/projects/:slug – admin
export const PUT = withAdmin(async (req: NextRequest, { params }) => {
  try {
    const body   = await req.json();
    const parsed = projectSchema.partial().safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);
    const project = await prisma.project.update({
      where: { slug: params!.slug },
      data:  parsed.data,
    });
    return ok(project);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Project not found");
    return serverError();
  }
});

// DELETE /api/projects/:slug – admin
export const DELETE = withAdmin(async (_: NextRequest, { params }) => {
  try {
    await prisma.project.delete({ where: { slug: params!.slug } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Project not found");
    return serverError();
  }
});
