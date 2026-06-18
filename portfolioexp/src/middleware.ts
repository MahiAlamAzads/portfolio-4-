// src/middleware.ts
// Edge middleware – protects all /admin/* routes except /admin/login.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const ADMIN_PREFIX = "/admin";
const LOGIN_PATH   = "/admin/login";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();
  if (pathname === LOGIN_PATH)            return NextResponse.next();

  const token = req.cookies.get("portfolio_token")?.value;
  if (!token) return NextResponse.redirect(new URL(LOGIN_PATH, req.url));

  const user = await verifyToken(token);
  if (!user)  return NextResponse.redirect(new URL(LOGIN_PATH, req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
