import { requireRole } from "@/lib/auth";
import { getAllOrganizations } from "@/app/actions/super-admin";
import OrganizationManagement from "@/components/super-admin/OrganizationManagement";

export default async function SuperAdminOrganizationsPage() {
  await requireRole("super_admin");
  const orgsResult = await getAllOrganizations();
  const orgList = orgsResult.success ? orgsResult.data : [];

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Organizations
          </h1>
          <p className="text-gray-500 mt-1">
            Govern and manage all Thinkhall customers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border px-3 py-1 rounded-md text-sm">
            Total: <span className="font-bold">{orgList.length}</span>
          </div>
        </div>
      </div>

      <OrganizationManagement initialOrgs={orgList} />
    </div>
  );
}
