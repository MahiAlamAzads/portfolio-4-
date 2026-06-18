import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProfilePage() {
  const profile =
    await prisma.profile.findFirst();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Profile
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Your public-facing portfolio
          information.
        </p>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}