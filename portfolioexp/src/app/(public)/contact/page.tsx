// src/app/(public)/contact/page.tsx

import type { Metadata } from "next";
import { Mail, MapPin, Github, Linkedin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/public/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const profile = await prisma.profile.findFirst();
  const social  = (profile?.socialLinks as Record<string, string>) ?? {};

  return (
    <div className="section">
      <p className="text-accent text-sm font-mono font-medium mb-1">// get in touch</p>
      <h1 className="text-4xl font-bold mb-3">Contact</h1>
      <p className="text-slate-400 mb-12 max-w-lg">
        Have a project in mind or want to discuss an opportunity? I'd love to hear from you.
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-6">
          {profile?.email && (
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center">
                <Mail size={18} className="text-accent" />
              </div>
              <a href={`mailto:${profile.email}`} className="hover:text-accent transition-colors">
                {profile.email}
              </a>
            </div>
          )}
          {profile?.location && (
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-10 h-10 rounded-xl bg-accent-muted flex items-center justify-center">
                <MapPin size={18} className="text-accent" />
              </div>
              <span>{profile.location}</span>
            </div>
          )}

          {/* Social links */}
          <div className="pt-4 space-y-3">
            {social.github && (
              <a href={social.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-accent transition-colors">
                <Github size={16} /> {social.github.replace("https://", "")}
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-accent transition-colors">
                <Linkedin size={16} /> {social.linkedin.replace("https://", "")}
              </a>
            )}
          </div>

          {/* Availability */}
          {profile?.availability && (
            <div className="card p-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
                <span className="text-sm font-medium text-emerald-400">Available for work</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Response time: within 24 hours</p>
            </div>
          )}
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </div>
  );
}
