"use client";
// src/components/admin/LoginForm.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, Eye, EyeOff, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Login failed");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent-muted mb-4">
            <Lock size={22} className="text-accent" />
          </div>
          <div className="flex items-center justify-center gap-2 font-mono font-bold text-xl">
            <Code2 size={22} className="text-accent" />
            <span className="gradient-text">admin panel</span>
          </div>
          <p className="text-slate-500 text-sm mt-2">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
              placeholder="admin@portfolio.dev"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-rose-400 text-sm bg-rose-400/10 border border-rose-400/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-medium rounded-xl text-sm transition-colors mt-2"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          Default: admin@portfolio.dev / admin123
        </p>
      </div>
    </div>
  );
}
