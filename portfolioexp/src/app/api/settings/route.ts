// src/app/api/settings/route.ts

import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAdmin } from "@/lib/middleware";
import { ok, badRequest, serverError } from "@/lib/api";

const settingsSchema = z.object({
  theme:          z.string().min(1).optional(),
  primaryColor:   z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color e.g. #6366f1").optional(),
  font:           z.string().min(1).optional(),
  layout:         z.string().min(1).optional(),
  seoTitle:       z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return ok(settings);
  } catch (e) {
    console.error("[GET /api/settings]", e);
    return serverError();
  }
}

export const PUT = withAdmin(async (req: NextRequest) => {
  try {
    const body   = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.errors.map((e) => e.message).join(", "));
    }

    const existing = await prisma.settings.findFirst();

    const settings = existing
      ? await prisma.settings.update({
          where: { id: existing.id },
          data:  parsed.data,
        })
      : await prisma.settings.create({
          data: {
            id:             "default",
            theme:          parsed.data.theme          ?? "dark",
            primaryColor:   parsed.data.primaryColor   ?? "#6366f1",
            font:           parsed.data.font           ?? "Inter",
            layout:         parsed.data.layout         ?? "default",
            seoTitle:       parsed.data.seoTitle       ?? "",
            seoDescription: parsed.data.seoDescription ?? "",
          },
        });

    // Revalidate all public pages so the new theme/SEO/font takes effect immediately
    revalidatePath("/", "layout");

    return ok(settings);
  } catch (e) {
    console.error("[PUT /api/settings]", e);
    return serverError();
  }
});
