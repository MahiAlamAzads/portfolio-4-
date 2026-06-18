"use client";
// src/components/admin/AdminSidebar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, User, FolderKanban, Zap,
  Briefcase, BookOpen, Mail, Settings, Code2, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard",   icon: LayoutDashboard, label: "Dashboard"  },
  { href: "/admin/profile",     icon: User,            label: "Profile"    },
  { href: "/admin/projects",    icon: FolderKanban,    label: "Projects"   },
  { href: "/admin/skills",      icon: Zap,             label: "Skills"     },
  { href: "/admin/experience",  icon: Briefcase,       label: "Experience" },
  { href: "/admin/blog",        icon: BookOpen,        label: "Blog"       },
  { href: "/admin/messages",    icon: Mail,            label: "Messages"   },
  { href: "/admin/settings",    icon: Settings,        label: "Settings"   },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 flex-col bg-surface-card border-r border-surface-border">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-mono font-bold">
          <Code2 size={20} className="text-accent" />
          <span className="gradient-text text-sm">portfolio/admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-accent-muted text-accent"
                : "text-slate-400 hover:text-slate-200 hover:bg-surface-border"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* View site */}
      <div className="px-3 pb-4 border-t border-surface-border pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ExternalLink size={14} /> View site
        </Link>
      </div>
    </aside>
  );
}
