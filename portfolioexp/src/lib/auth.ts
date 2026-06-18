// src/lib/auth.ts
// JWT helpers using the jose library (Edge-compatible).

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { JWTPayload } from "@/types";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-change-in-production"
);

const TOKEN_COOKIE = "portfolio_token";
const EXPIRES_IN   = "7d";

// ─── Sign ─────────────────────────────────────────────────────
export async function signToken(payload: Omit<JWTPayload, "iat" | "exp">) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(secret);
}

// ─── Verify ───────────────────────────────────────────────────
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Cookie helpers ───────────────────────────────────────────
export function setAuthCookie(token: string) {
  cookies().set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export function clearAuthCookie() {
  cookies().delete(TOKEN_COOKIE);
}

// ─── Get current user from cookie ─────────────────────────────
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── Extract token from Authorization header ──────────────────
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
