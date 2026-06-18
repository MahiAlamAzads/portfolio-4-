// src/app/(public)/layout.tsx
// Server component — reads auth cookie and passes isAdmin to Navbar.

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

async function getIsAdmin(): Promise<boolean> {
  try {
    const token = cookies().get("portfolio_token")?.value;
    if (!token) return false;
    const user = await verifyToken(token);
    return user?.role === "ADMIN";
  } catch {
    return false;
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await getIsAdmin();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
