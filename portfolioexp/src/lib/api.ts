// src/lib/api.ts
// Typed response helpers for route handlers.

import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data },
    { status }
  );
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(error: string) {
  return NextResponse.json<ApiResponse>(
    { success: false, error },
    { status: 400 }
  );
}

export function unauthorized(error = "Unauthorized") {
  return NextResponse.json<ApiResponse>(
    { success: false, error },
    { status: 401 }
  );
}

export function forbidden(error = "Forbidden") {
  return NextResponse.json<ApiResponse>(
    { success: false, error },
    { status: 403 }
  );
}

export function notFound(error = "Not found") {
  return NextResponse.json<ApiResponse>(
    { success: false, error },
    { status: 404 }
  );
}

export function serverError(error = "Internal server error") {
  console.error("[API Error]", error);
  return NextResponse.json<ApiResponse>(
    { success: false, error },
    { status: 500 }
  );
}
