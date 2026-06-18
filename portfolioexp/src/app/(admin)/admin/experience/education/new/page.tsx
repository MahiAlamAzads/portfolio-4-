// src/app/(admin)/admin/experience/education/new/page.tsx

import EducationForm from "@/components/admin/EducationForm";

export default function NewEducationPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Education</h1>
        <p className="text-slate-400 text-sm mt-1">
          Add a degree, diploma, or course to your education history.
        </p>
      </div>
      <EducationForm />
    </div>
  );
}
