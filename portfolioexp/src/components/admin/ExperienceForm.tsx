"use client";
// src/components/admin/ExperienceForm.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, X } from "lucide-react";
import type { Experience } from "@prisma/client";

interface Props {
  experience?: Experience;
}

const empty = {
  company: "",
  role: "",
  logo: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  technologies: [] as string[],
};

export default function ExperienceForm({ experience }: Props) {
  const router = useRouter();
  const isEdit = !!experience;

  const [form, setForm] = useState(
    isEdit
      ? {
          ...experience,
          logo: experience.logo ?? "",
          endDate: experience.endDate
            ? new Date(experience.endDate).toISOString().slice(0, 10)
            : "",
          startDate: new Date(experience.startDate).toISOString().slice(0, 10),
          technologies: experience.technologies ?? [],
        }
      : empty,
  );
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t))
      update("technologies", [...form.technologies, t]);
    setTechInput("");
  };

  const removeTech = (t: string) =>
    update(
      "technologies",
      form.technologies.filter((x) => x !== t),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate:
          form.current || !form.endDate
            ? undefined
            : new Date(form.endDate).toISOString(),
      };

      const url = isEdit
        ? `/api/experience/${experience!.id}`
        : "/api/experience";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      router.push("/admin/experience");
      router.refresh();
    } catch (e: any) {
      setError(e.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      {/* Company & Role */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Company *
          </label>
          <input
            required
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Acme Corp"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Role / Title *
          </label>
          <input
            required
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            placeholder="Senior Frontend Engineer"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Logo URL */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Company Logo URL
        </label>
        <input
          type="url"
          value={form.logo}
          onChange={(e) => update("logo", e.target.value)}
          placeholder="https://company.com/logo.png"
          className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
        />
      </div>

      {/* Dates */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Start Date *
          </label>
          <input
            required
            type="date"
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            End Date{" "}
            {form.current && (
              <span className="text-slate-500 font-normal">
                (disabled — current role)
              </span>
            )}
          </label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}
            disabled={form.current}
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Current role toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          onClick={() => {
            update("current", !form.current);
            if (!form.current) update("endDate", "");
          }}
          className={`relative w-10 rounded-full transition-colors cursor-pointer ${form.current ? "bg-emerald-500" : "bg-surface-border"}`}
          style={{ height: "22px" }}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.current ? "translate-x-5" : "translate-x-0.5"}`}
          />
        </div>
        <span className="text-sm text-slate-300">I currently work here</span>
      </label>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Description *
        </label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe your responsibilities and achievements…"
          className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors resize-y placeholder:text-slate-600"
        />
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Technologies Used
        </label>
        <div className="flex gap-2 mb-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech();
              }
            }}
            placeholder="React, TypeScript, AWS…"
            className="flex-1 bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
          />
          <button
            type="button"
            onClick={addTech}
            className="px-4 py-2.5 bg-surface-border hover:bg-surface-card rounded-xl text-sm text-slate-300 transition-colors"
          >
            <Plus size={15} />
          </button>
        </div>
        {form.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.technologies.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-accent-muted text-accent rounded-lg"
              >
                {t}
                <button type="button" onClick={() => removeTech(t)}>
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-rose-400 text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors"
        >
          <Save size={15} />
          {saving ? "Saving…" : isEdit ? "Update entry" : "Add experience"}
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
