// src/app/(admin)/admin/settings/page.tsx

import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

// Always read fresh — no caching on the settings page
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.settings.findFirst();
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Changes apply site-wide immediately after saving.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
