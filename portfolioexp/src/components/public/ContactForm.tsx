"use client";
// src/components/public/ContactForm.tsx

import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="card p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto">
          <Send className="text-emerald-400" size={20} />
        </div>
        <h3 className="font-semibold text-lg">Message sent!</h3>
        <p className="text-slate-400 text-sm">I'll get back to you within 24 hours.</p>
        <button onClick={() => setStatus("idle")} className="text-accent text-sm hover:underline">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject</label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600"
          placeholder="Project inquiry, freelance work…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors placeholder:text-slate-600 resize-none"
          placeholder="Tell me about your project…"
        />
      </div>

      {status === "error" && (
        <p className="text-rose-400 text-sm">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white font-medium rounded-xl transition-colors"
      >
        {status === "loading" ? "Sending…" : (<><Send size={16} /> Send message</>)}
      </button>
    </form>
  );
}
