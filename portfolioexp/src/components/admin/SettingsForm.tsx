"use client";
// src/components/admin/SettingsForm.tsx

import { useState } from "react";
import {
  Save,
  CheckCircle,
  AlertCircle,
  Palette,
  Type,
  Search,
  Layout,
} from "lucide-react";
import type { Settings } from "@prisma/client";

interface Props {
  settings: Settings | null;
}

// Only the editable fields — never pass id/updatedAt into form state
interface FormState {
  theme: string;
  primaryColor: string;
  font: string;
  layout: string;
  seoTitle: string;
  seoDescription: string;
}

const DEFAULTS: FormState = {
  theme: "dark",
  primaryColor: "#6366f1",
  font: "Inter",
  layout: "default",
  seoTitle: "",
  seoDescription: "",
};

function toFormState(s: Settings | null): FormState {
  if (!s) return DEFAULTS;
  return {
    theme: s.theme || DEFAULTS.theme,
    primaryColor: s.primaryColor || DEFAULTS.primaryColor,
    font: s.font || DEFAULTS.font,
    layout: s.layout || DEFAULTS.layout,
    seoTitle: s.seoTitle || "",
    seoDescription: s.seoDescription || "",
  };
}

const FONTS = [
  "Inter",
  "Geist",
  "DM Sans",
  "Plus Jakarta Sans",
  "Space Grotesk",
];
const THEMES = ["dark", "light", "system"] as const;
const LAYOUTS = ["default", "minimal", "creative"] as const;

export default function SettingsForm({ settings }: Props) {
  const [form, setForm] = useState<FormState>(toFormState(settings));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const update = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Only send the editable fields
        body: JSON.stringify({
          theme: form.theme,
          primaryColor: form.primaryColor,
          font: form.font,
          layout: form.layout,
          seoTitle: form.seoTitle,
          seoDescription: form.seoDescription,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error ?? `HTTP ${res.status}`);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── SEO ──────────────────────────────────────────── */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Search size={15} className="text-accent" />
          <h2 className="text-sm font-semibold text-slate-200">SEO</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Site Title
          </label>
          <input
            type="text"
            value={form.seoTitle}
            onChange={(e) => update("seoTitle", e.target.value)}
            placeholder="Alex Rivera – Full-Stack Engineer"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
          />
          <p className="text-xs text-slate-500 mt-1">
            Appears in browser tab and search results.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Meta Description
          </label>
          <textarea
            rows={3}
            value={form.seoDescription}
            onChange={(e) => update("seoDescription", e.target.value)}
            placeholder="Full-stack engineer building fast, accessible products…"
            className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors resize-none placeholder:text-slate-600"
          />
          <p className="text-xs text-slate-500 mt-1">
            {form.seoDescription.length}/160 characters recommended.
          </p>
        </div>
      </div>

      {/* ── Appearance ───────────────────────────────────── */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Palette size={15} className="text-accent" />
          <h2 className="text-sm font-semibold text-slate-200">Appearance</h2>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Theme
          </label>
          <div className="flex gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update("theme", t)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border capitalize transition-colors ${
                  form.theme === t
                    ? "bg-accent border-accent text-white"
                    : "border-surface-border text-slate-400 hover:border-accent/40"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Primary Color
          </label>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => update("primaryColor", e.target.value)}
                className="w-12 h-12 rounded-xl border-2 border-surface-border bg-surface cursor-pointer p-1"
              />
            </div>
            <input
              type="text"
              value={form.primaryColor}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9a-fA-F]{0,6}$/.test(val))
                  update("primaryColor", val);
              }}
              maxLength={7}
              className="flex-1 bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 focus:outline-none focus:border-accent transition-colors"
            />
            {/* Preset swatches */}
            <div className="flex gap-1.5">
              {[
                "#6366f1",
                "#8b5cf6",
                "#ec4899",
                "#14b8a6",
                "#f59e0b",
                "#ef4444",
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update("primaryColor", c)}
                  title={c}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    form.primaryColor === c
                      ? "border-white scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Font */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Type size={13} /> Font Family
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FONTS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => update("font", f)}
                className={`py-2.5 px-3 rounded-xl text-sm border transition-colors text-left ${
                  form.font === f
                    ? "bg-accent/10 border-accent text-accent"
                    : "border-surface-border text-slate-400 hover:border-accent/40"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Layout ───────────────────────────────────────── */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Layout size={15} className="text-accent" />
          <h2 className="text-sm font-semibold text-slate-200">Layout</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {LAYOUTS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => update("layout", l)}
              className={`py-3 rounded-xl text-sm border capitalize font-medium transition-colors ${
                form.layout === l
                  ? "bg-accent/10 border-accent text-accent"
                  : "border-surface-border text-slate-400 hover:border-accent/40"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error / Save ─────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-2 text-rose-400 text-sm bg-rose-400/10 border border-rose-400/20 px-4 py-3 rounded-xl">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors"
      >
        {saved ? (
          <>
            <CheckCircle size={15} /> Settings saved!
          </>
        ) : saving ? (
          "Saving…"
        ) : (
          <>
            <Save size={15} /> Save settings
          </>
        )}
      </button>
    </div>
  );
}
