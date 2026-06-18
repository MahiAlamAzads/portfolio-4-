// src/app/api/projects/[slug]/like/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, notFound, serverError } from "@/lib/api";

export async function POST(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const project = await prisma.project.update({
      where: { slug: params.slug },
      data:  { likes: { increment: 1 } },
      select: { likes: true },
    });
    return ok({ likes: project.likes });
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Project not found");
    return serverError();
  }
}
