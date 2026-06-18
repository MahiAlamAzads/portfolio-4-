// src/app/(admin)/admin/experience/new/page.tsx

import ExperienceForm from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Experience</h1>
        <p className="text-slate-400 text-sm mt-1">Add a new work experience entry to your timeline.</p>
      </div>
      <ExperienceForm />
    </div>
  );
}
