"use client";
// src/components/public/Navbar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Code2, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",           label: "Home"       },
  { href: "/about",      label: "About"      },
  { href: "/projects",   label: "Projects"   },
  { href: "/experience", label: "Experience" },
  { href: "/blog",       label: "Blog"       },
  { href: "/contact",    label: "Contact"    },
];

interface Props {
  isAdmin?: boolean;
}

export default function Navbar({ isAdmin = false }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/80 border-b border-surface-border">
      <nav className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-mono font-bold text-lg">
          <Code2 className="text-accent" size={22} />
          <span className="gradient-text">alex.dev</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-accent bg-accent-muted"
                    : "text-slate-400 hover:text-slate-200 hover:bg-surface-border"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side CTAs */}
        <div className="hidden md:flex items-center gap-2">
          {/* Admin button — only visible when logged in */}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-accent/40 text-accent hover:bg-accent-muted transition-colors"
            >
              <LayoutDashboard size={14} />
              Admin
            </Link>
          )}

          <Link
            href="/contact"
            className="px-4 py-1.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            Hire me
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200"
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-surface-border bg-surface-card px-4 py-4 space-y-1 animate-fade-in">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-lg text-sm font-medium",
                pathname === href
                  ? "text-accent bg-accent-muted"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {label}
            </Link>
          ))}

          {/* Admin link in mobile menu */}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-accent bg-accent-muted"
            >
              <LayoutDashboard size={14} />
              Admin Panel
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
