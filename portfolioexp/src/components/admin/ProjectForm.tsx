"use client";
// src/components/admin/ProjectForm.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, X } from "lucide-react";
import { slugify } from "@/lib/utils";
import type { Project, ProjectStatus } from "@prisma/client";

interface Props { project?: Project }

const STATUSES: ProjectStatus[] = ["IN_PROGRESS", "COMPLETED", "ARCHIVED"];

const empty = {
  title: "", slug: "", summary: "", description: "",
  techStack: [] as string[],
  githubUrl: "", liveUrl: "", thumbnail: "",
  status: "COMPLETED" as ProjectStatus,
  featured: false, category: "", role: "",
};

export default function ProjectForm({ project }: Props) {
  const router = useRouter();
  const isEdit = !!project;

  const [form, setForm] = useState(
    isEdit
      ? { ...project, techStack: project.techStack ?? [], githubUrl: project.githubUrl ?? "", liveUrl: project.liveUrl ?? "", thumbnail: project.thumbnail ?? "", category: project.category ?? "", role: project.role ?? "" }
      : empty
  );
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  const update = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const handleTitleChange = (val: string) => {
    setForm((f) => ({ ...f, title: val, slug: isEdit ? f.slug : slugify(val) }));
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.techStack.includes(t)) {
      update("techStack", [...form.techStack, t]);
    }
    setTechInput("");
  };

  const removeTech = (t: string) => update("techStack", form.techStack.filter((x) => x !== t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const url    = isEdit ? `/api/projects/${project!.slug}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      router.push("/admin/projects");
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, field, type = "text", placeholder = "", required = false }:
    { label: string; field: string; type?: string; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={(form as any)[field] ?? ""}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="My Awesome Project"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Slug *</label>
          <input
            required
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="my-awesome-project"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Summary *</label>
        <input
          required
          value={form.summary}
          onChange={(e) => update("summary", e.target.value)}
          placeholder="One sentence describing the project"
          className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (HTML/Markdown) *</label>
        <textarea
          required
          rows={6}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Full project description…"
          className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-accent transition-colors resize-y placeholder:text-slate-600"
        />
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Tech Stack</label>
        <div className="flex gap-2 mb-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
            placeholder="Next.js"
            className="flex-1 bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
          />
          <button type="button" onClick={addTech}
            className="px-4 py-2.5 bg-surface-border hover:bg-surface-card rounded-xl text-sm text-slate-300 transition-colors">
            <Plus size={15} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.techStack.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-accent-muted text-accent rounded-lg">
              {t}
              <button type="button" onClick={() => removeTech(t)}><X size={11} /></button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="GitHub URL" field="githubUrl" type="url" placeholder="https://github.com/…" />
        <Field label="Live URL"   field="liveUrl"   type="url" placeholder="https://…" />
        <Field label="Thumbnail URL" field="thumbnail" type="url" placeholder="https://…" />
        <Field label="Category"   field="category"  placeholder="SaaS, Open Source, Client…" />
        <Field label="Your Role"  field="role"      placeholder="Lead Developer" />
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
        </div>
      </div>

      {/* Featured toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => update("featured", e.target.checked)}
          className="w-4 h-4 rounded accent-indigo-500"
        />
        <span className="text-sm text-slate-300">Feature on homepage</span>
      </label>

      {error && <p className="text-rose-400 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors"
        >
          <Save size={15} /> {saving ? "Saving…" : isEdit ? "Update project" : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 border border-surface-border hover:border-slate-600 text-slate-400 font-medium rounded-xl text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
