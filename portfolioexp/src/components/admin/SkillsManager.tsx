"use client";
// src/components/admin/SkillsManager.tsx

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import type { Skill, SkillCategory } from "@prisma/client";

const CATEGORIES: SkillCategory[] = [
  "FRONTEND",
  "BACKEND",
  "DEVOPS",
  "DATABASE",
  "MOBILE",
  "DESIGN",
  "TESTING",
  "OTHER",
];

const CATEGORY_COLORS: Record<string, string> = {
  FRONTEND: "text-blue-400",
  BACKEND: "text-green-400",
  DEVOPS: "text-rose-400",
  DATABASE: "text-amber-400",
  MOBILE: "text-purple-400",
  DESIGN: "text-pink-400",
  TESTING: "text-teal-400",
  OTHER: "text-slate-400",
};

const empty = {
  name: "",
  category: "FRONTEND" as SkillCategory,
  level: 80,
  yearsOfExperience: 1,
};

interface Props {
  initialSkills: Skill[];
}

export default function SkillsManager({ initialSkills }: Props) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeleting] = useState<string | null>(null);

  // Group skills by category
  const grouped = CATEGORIES.reduce<Record<string, Skill[]>>((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {} as any);

  const addSkill = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const data = await res.json();
      if (data.success) {
        setSkills((prev) => [...prev, data.data]);
        setForm(empty);
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/skills/${id}`, { method: "DELETE" });
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">Add Skill</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Skill name"
            className="sm:col-span-1 bg-surface border border-surface-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent text-slate-200 placeholder:text-slate-600"
          />
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as SkillCategory })
            }
            className="bg-surface border border-surface-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent text-slate-200"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={form.level}
              onChange={(e) => setForm({ ...form, level: +e.target.value })}
              className="flex-1 accent-indigo-500"
            />
            <span className="text-xs text-accent w-8 text-right">
              {form.level}%
            </span>
          </div>
          <button
            onClick={addSkill}
            disabled={saving || !form.name.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {saving ? <Save size={14} /> : <Plus size={14} />}
            {saving ? "Saving…" : "Add"}
          </button>
        </div>
      </div>

      {/* Grouped display */}
      <div className="grid md:grid-cols-2 gap-5">
        {CATEGORIES.filter((cat) => grouped[cat]?.length > 0).map((cat) => (
          <div key={cat} className="card p-4 space-y-3">
            <h3
              className={`text-xs font-mono font-semibold uppercase tracking-wider ${CATEGORY_COLORS[cat]}`}
            >
              {cat}
            </h3>
            <div className="space-y-2">
              {grouped[cat].map((skill) => (
                <div key={skill.id} className="flex items-center gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs text-slate-500">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-bar-fill"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    disabled={deletingId === skill.id}
                    className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 transition-colors disabled:opacity-50 shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
