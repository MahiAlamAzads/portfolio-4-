"use client";
// src/components/admin/EducationForm.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import type { Education } from "@prisma/client";

interface Props {
  education?: Education;
}

const empty = {
  institution: "",
  degree: "",
  field: "",
  startYear: new Date().getFullYear(),
  endYear: "" as number | "",
  description: "",
  current: false,
};

export default function EducationForm({ education }: Props) {
  const router = useRouter();
  const isEdit = !!education;

  const [form, setForm] = useState(
    isEdit
      ? {
          ...education,
          endYear: education.endYear ?? ("" as number | ""),
          current: !education.endYear,
        }
      : empty,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        institution: form.institution,
        degree: form.degree,
        field: form.field,
        startYear: Number(form.startYear),
        endYear:
          form.current || form.endYear === "" ? null : Number(form.endYear),
        description: form.description || null,
      };

      const url = isEdit ? `/api/education/${education!.id}` : "/api/education";
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

  // Build year options (1960 → current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1959 },
    (_, i) => currentYear - i,
  );

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      {/* Institution */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Institution *
        </label>
        <input
          required
          value={form.institution}
          onChange={(e) => update("institution", e.target.value)}
          placeholder="MIT, Stanford, University of…"
          className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
        />
      </div>

      {/* Degree & Field */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Degree *
          </label>
          <input
            required
            value={form.degree}
            onChange={(e) => update("degree", e.target.value)}
            placeholder="Bachelor of Science, Master of…"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Field of Study *
          </label>
          <input
            required
            value={form.field}
            onChange={(e) => update("field", e.target.value)}
            placeholder="Computer Science, Design…"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Years */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Start Year *
          </label>
          <select
            required
            value={form.startYear}
            onChange={(e) => update("startYear", Number(e.target.value))}
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            End Year{" "}
            {form.current && (
              <span className="text-slate-500 font-normal">
                (disabled — currently enrolled)
              </span>
            )}
          </label>
          <select
            value={form.endYear}
            onChange={(e) =>
              update(
                "endYear",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            disabled={form.current}
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">Select year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Currently enrolled toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          onClick={() => {
            update("current", !form.current);
            if (!form.current) update("endYear", "");
          }}
          className={`relative w-10 rounded-full transition-colors cursor-pointer ${
            form.current ? "bg-emerald-500" : "bg-surface-border"
          }`}
          style={{ height: "22px" }}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              form.current ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </div>
        <span className="text-sm text-slate-300">I am currently enrolled</span>
      </label>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Description{" "}
          <span className="text-slate-500 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={form.description ? form.description : ""}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Relevant coursework, thesis, honours, activities…"
          className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors resize-y placeholder:text-slate-600"
        />
      </div>

      {error && (
        <p className="text-rose-400 text-sm bg-rose-400/10 border border-rose-400/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors"
        >
          <Save size={15} />
          {saving ? "Saving…" : isEdit ? "Update education" : "Add education"}
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
