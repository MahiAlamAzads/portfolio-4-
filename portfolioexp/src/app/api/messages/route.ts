// src/app/api/messages/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { messageSchema } from "@/lib/validations";
import { ok, created, badRequest, serverError } from "@/lib/api";

// GET /api/messages – admin only (with unread count)
export const GET = withAdmin(async (req: NextRequest) => {
  try {
    const unreadOnly = req.nextUrl.searchParams.get("unread") === "true";
    const [messages, unreadCount] = await Promise.all([
      prisma.message.findMany({
        where: unreadOnly ? { read: false } : undefined,
        orderBy: { createdAt: "desc" },
      }),
      prisma.message.count({ where: { read: false } }),
    ]);
    return ok({ messages, unreadCount });
  } catch {
    return serverError();
  }
});

// POST /api/messages – public (contact form submission)
export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const message = await prisma.message.create({ data: parsed.data });
    return created({ id: message.id, message: "Message sent successfully" });
  } catch {
    return serverError();
  }
}
