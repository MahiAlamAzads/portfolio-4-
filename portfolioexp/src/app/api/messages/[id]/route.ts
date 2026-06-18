// src/app/api/messages/[id]/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { ok, notFound, noContent, serverError } from "@/lib/api";

export const PATCH = withAdmin(async (req: NextRequest, { params }) => {
  try {
    const body    = await req.json();
    const message = await prisma.message.update({
      where: { id: params!.id },
      data:  { read: body.read ?? true },
    });
    return ok(message);
  } catch (e: any) {
    if (e?.code === "P2025") return notFound("Message not found");
    return serverError();
  }
});

export const DELETE = withAdmin(async (_: NextRequest, { params }) => {
  try {
    await prisma.message.delete({ where: { id: params!.id } });
    return noContent();
  } catch (e: any) {
    if (e?.code === "P2025") return notFound();
    return serverError();
  }
});
