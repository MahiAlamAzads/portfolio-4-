// src/app/api/projects/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { projectSchema } from "@/lib/validations";
import { ok, created, badRequest, serverError } from "@/lib/api";

// GET /api/projects?featured=true&category=SaaS&page=1&pageSize=9
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const featured  = searchParams.get("featured");
    const category  = searchParams.get("category");
    const page      = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const pageSize  = Math.min(50, Number(searchParams.get("pageSize") ?? 9));
    const skip      = (page - 1) * pageSize;

    const where = {
      ...(featured === "true" ? { featured: true } : {}),
      ...(category ? { category } : {}),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        skip,
        take: pageSize,
      }),
      prisma.project.count({ where }),
    ]);

    return ok({ data: projects, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch {
    return serverError();
  }
}

// POST /api/projects – admin only
export const POST = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const project = await prisma.project.create({ data: parsed.data });
    return created(project);
  } catch (e: any) {
    if (e?.code === "P2002") return badRequest("Slug already exists");
    return serverError();
  }
});
