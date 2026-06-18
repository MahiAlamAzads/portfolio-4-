// src/app/(admin)/admin/projects/new/page.tsx

import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Project</h1>
        <p className="text-slate-400 text-sm mt-1">Add a project to your portfolio.</p>
      </div>
      <ProjectForm />
    </div>
  );
}
