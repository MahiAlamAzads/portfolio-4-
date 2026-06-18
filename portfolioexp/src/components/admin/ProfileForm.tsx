"use client";
// src/components/admin/ProfileForm.tsx

import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import type { Profile } from "@prisma/client";

interface Props { profile: Profile | null }

export default function ProfileForm({ profile }: Props) {
  const [form, setForm] = useState({
    fullName:     profile?.fullName     ?? "",
    title:        profile?.title        ?? "",
    bio:          profile?.bio          ?? "",
    avatar:       profile?.avatar       ?? "",
    location:     profile?.location     ?? "",
    email:        profile?.email        ?? "",
    phone:        profile?.phone        ?? "",
    resumeUrl:    profile?.resumeUrl    ?? "",
    availability: profile?.availability ?? true,
    socialLinks:  (profile?.socialLinks as Record<string, string>) ?? {},
  });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  const update = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));
  const updateSocial = (key: string, val: string) =>
    setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, [key]: val } }));

  const handleSave = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({
    label, field, type = "text", placeholder = ""
  }: { label: string; field: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <input
        type={type}
        value={(form as any)[field] ?? ""}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
      />
    </div>
  );

  return (
    <div className="card p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name"    field="fullName"  placeholder="Alex Rivera" />
        <Field label="Title / Tagline" field="title"  placeholder="Full-Stack Engineer" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
        <textarea
          rows={4}
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors resize-none placeholder:text-slate-600"
          placeholder="A short bio about yourself…"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Avatar URL" field="avatar"    placeholder="https://…" />
        <Field label="Location"   field="location"  placeholder="San Francisco, CA" />
        <Field label="Email"      field="email"     type="email" placeholder="alex@example.com" />
        <Field label="Phone"      field="phone"     placeholder="+1 (555) 000-0000" />
        <Field label="Resume URL" field="resumeUrl" placeholder="https://…" />
      </div>

      {/* Availability toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => update("availability", !form.availability)}
          className={`relative w-10 h-5.5 rounded-full transition-colors ${form.availability ? "bg-emerald-500" : "bg-surface-border"}`}
          style={{ height: "22px" }}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.availability ? "translate-x-5" : "translate-x-0.5"}`}
          />
        </button>
        <span className="text-sm text-slate-300">
          {form.availability ? "Available for work" : "Not currently available"}
        </span>
      </div>

      {/* Social links */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Social Links</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {["github", "linkedin", "twitter", "website"].map((key) => (
            <div key={key}>
              <label className="block text-xs text-slate-500 mb-1 capitalize">{key}</label>
              <input
                type="url"
                value={form.socialLinks[key] ?? ""}
                onChange={(e) => updateSocial(key, e.target.value)}
                placeholder={`https://${key}.com/username`}
                className="w-full bg-surface border border-surface-border rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-rose-400 text-sm">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors"
      >
        {saved ? (
          <><CheckCircle size={15} /> Saved!</>
        ) : saving ? (
          "Saving…"
        ) : (
          <><Save size={15} /> Save profile</>
        )}
      </button>
    </div>
  );
}
