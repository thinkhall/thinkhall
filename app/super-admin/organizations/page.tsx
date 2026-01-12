// app/super-admin/organizations/page.tsx
import { requireRole } from "@/lib/auth";
import {
  getAllOrganizations,
  getOrganizationKPIs,
} from "@/app/actions/super-admin";
import OrganizationManagement from "@/components/super-admin/OrganizationManagement";

// Default KPI values
const defaultKpis = {
  totalOrganizations: 0,
  totalLicensedUsers: 0,
  totalUsedUsers: 0,
};

export default async function SuperAdminOrganizationsPage() {
  await requireRole("super_admin");
  const orgsResult = await getAllOrganizations();
  const orgList = orgsResult.success ? orgsResult.data : [];

  // Fetch KPIs with proper fallback
  const kpiResult = await getOrganizationKPIs();
  const kpis =
    kpiResult.success && kpiResult.data ? kpiResult.data : defaultKpis;

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
        {/* KPI Display */}
        <div className="flex items-center gap-4 text-sm">
          <div className="bg-white border px-3 py-1.5 rounded-md">
            Total Orgs:{" "}
            <span className="font-bold">{kpis.totalOrganizations}</span>
          </div>
          <div className="bg-white border px-3 py-1.5 rounded-md">
            Total Licensed Users:{" "}
            <span className="font-bold">{kpis.totalLicensedUsers}</span>
          </div>
          <div className="bg-white border px-3 py-1.5 rounded-md">
            Users In Use:{" "}
            <span className="font-bold">{kpis.totalUsedUsers}</span>
          </div>
        </div>
      </div>

      <OrganizationManagement initialOrgs={orgList} />
    </div>
  );
}
