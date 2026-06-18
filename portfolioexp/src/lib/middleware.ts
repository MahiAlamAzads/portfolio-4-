// src/lib/middleware.ts
// Route handler middleware – wraps handlers with JWT auth.
//
// Next.js App Router route handlers receive (req, context) where context
// carries dynamic params. The wrapper must forward context correctly.

import { NextRequest } from "next/server";
import { getCurrentUser, extractBearerToken, verifyToken } from "./auth";
import { unauthorized } from "./api";
import type { JWTPayload } from "@/types";

// Route context from Next.js (dynamic params, etc.)
type RouteContext = { params?: Record<string, string> };

// A handler that also receives the authenticated user
type AuthedHandler = (
  req: NextRequest,
  context: RouteContext & { user: JWTPayload }
) => Promise<Response>;

// Standard Next.js route handler signature
type RouteHandler = (req: NextRequest, context: RouteContext) => Promise<Response>;

/**
 * Wraps a route handler with JWT authentication.
 * Accepts token from Authorization header OR httpOnly cookie.
 */
export function withAuth(handler: AuthedHandler): RouteHandler {
  return async (req: NextRequest, context: RouteContext) => {
    const headerToken = extractBearerToken(req.headers.get("authorization"));
    let user: JWTPayload | null = null;

    if (headerToken) {
      user = await verifyToken(headerToken);
    } else {
      user = await getCurrentUser();
    }

    if (!user) return unauthorized();

    return handler(req, { ...context, user });
  };
}

/**
 * Wraps a route handler with admin-only access.
 */
export function withAdmin(handler: AuthedHandler): RouteHandler {
  return withAuth(async (req, ctx) => {
    if (ctx.user.role !== "ADMIN") {
      return unauthorized("Admin access required");
    }
    return handler(req, ctx);
  });
}
