// src/app/api/blog/[slug]/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { blogSchema } from "@/lib/validations";
import { ok, badRequest, notFound, noContent, serverError } from "@/lib/api";

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await prisma.blog.update({
      where: { slug: params.slug, published: true },
      data:  { views: { increment: 1 } },
    });
    return ok(post);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Post not found");
    return serverError();
  }
}

export const PUT = withAdmin(async (req: NextRequest, { params }) => {
  try {
    const body   = await req.json();
    const parsed = blogSchema.partial().safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);
    const post = await prisma.blog.update({ where: { slug: params!.slug }, data: parsed.data });
    return ok(post);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound();
    return serverError();
  }
});

export const DELETE = withAdmin(async (_: NextRequest, { params }) => {
  try {
    await prisma.blog.delete({ where: { slug: params!.slug } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound();
    return serverError();
  }
});
