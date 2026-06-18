// src/app/api/auth/login/route.ts

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { ok, badRequest, unauthorized, serverError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.message);

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return unauthorized("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return unauthorized("Invalid credentials");

    const token = await signToken({ sub: user.id, email: user.email, role: user.role });

    // Set httpOnly cookie for browser sessions
    setAuthCookie(token);

    return ok({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    return serverError();
  }
}
