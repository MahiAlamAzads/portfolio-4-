// src/components/public/Footer.tsx

import Link from "next/link";
import { Github, Linkedin, Twitter, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-card">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-sm font-bold">
          <Code2 className="text-accent" size={18} />
          <span className="gradient-text">alex.dev</span>
        </div>

        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Alex Rivera. Built with Next.js & Prisma.
        </p>

        <div className="flex items-center gap-3">
          {[
            { icon: Github,   href: "https://github.com", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
            { icon: Twitter,  href: "https://twitter.com", label: "Twitter" },
          ].map(({ icon: Icon, href, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-slate-500 hover:text-accent transition-colors"
            >
              <Icon size={18} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
