// app/super-admin/organizations/[id]/page.tsx
import { requireRole } from "@/lib/auth";
import {
  getOrganizationById,
  getUsersInOrganization,
} from "@/app/actions/super-admin";

import { notFound } from "next/navigation";
import OrganizationDetailsManagement from "@/components/super-admin/OrganizationDetailsManagement";

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 15: params is a Promise, use 'id' to match folder name
}) {
  await requireRole("super_admin");

  const { id: orgId } = await params; // Await and destructure

  const orgResult = await getOrganizationById(orgId);
  if (!orgResult.success || !orgResult.data) {
    notFound();
  }
  const organization = orgResult.data;

  const usersResult = await getUsersInOrganization(orgId);

  // Serialize users to match UserType interface (fix ObjectId -> string)
  const initialUsers = usersResult.success
    ? usersResult.data.map((user) => ({
        _id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation ?? null,
        isActive: user.isActive,
        createdAt: user.createdAt,
        organizationId: user.organizationId
          ? String(user.organizationId)
          : undefined,
      }))
    : [];

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <OrganizationDetailsManagement
        organization={organization}
        initialUsers={initialUsers}
      />
    </div>
  );
}
