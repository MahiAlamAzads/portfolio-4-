// src/app/(admin)/admin/page.tsx
// Visiting /admin redirects to /admin/dashboard

import { redirect } from "next/navigation";

export default function AdminRootPage() {
  redirect("/admin/dashboard");
}
