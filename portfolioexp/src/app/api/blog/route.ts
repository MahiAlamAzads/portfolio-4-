// src/app/api/blog/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { blogSchema } from "@/lib/validations";
import { ok, created, badRequest, serverError } from "@/lib/api";

// GET /api/blog?published=true&tag=typescript&page=1
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const published = searchParams.get("published");
    const tag       = searchParams.get("tag");
    const page      = Math.max(1, Number(searchParams.get("page")     ?? 1));
    const pageSize  = Math.min(20, Number(searchParams.get("pageSize") ?? 6));
    const skip      = (page - 1) * pageSize;

    const where = {
      ...(published === "true" ? { published: true } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    };

    const [posts, total] = await Promise.all([
      prisma.blog.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
      prisma.blog.count({ where }),
    ]);

    return ok({ data: posts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch {
    return serverError();
  }
}

export const POST = withAdmin(async (req: NextRequest) => {
  try {
    const body   = await req.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const post = await prisma.blog.create({ data: parsed.data });
    return created(post);
  } catch (e: any) {
    if (e?.code === "P2002") return badRequest("Slug already exists");
    return serverError();
  }
});
