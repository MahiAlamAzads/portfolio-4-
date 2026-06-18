// src/app/(auth)/admin/login/page.tsx
import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin Login" };

export default function LoginPage() {
  return <LoginForm />;
}
