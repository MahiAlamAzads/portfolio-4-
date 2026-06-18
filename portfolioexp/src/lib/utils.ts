// src/lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format date to readable string */
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year:  "numeric",
  });
}

/** Convert string to URL-safe slug */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Truncate text at word boundary */
export function truncate(str: string, max: number) {
  if (str.length <= max) return str;
  return str.slice(0, max).replace(/\s+\S*$/, "") + "…";
}
