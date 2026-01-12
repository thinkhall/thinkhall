// components/super-admin/OrganizationManagement.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Trash2,
  X,
  Edit,
  Eye, // Changed from Users to Eye for viewing/managing
} from "lucide-react";
import { toast } from "sonner";
import {
  createOrganizationWithUsers,
  deleteOrganization,
  editOrganization,
} from "@/app/actions/super-admin";

// --- INTERFACES (Adjusted slightly for display) ---
interface IOrgStats {
  totalUsers: number;
}

interface IOrgLicense {
  maxUsers: number;
}

// Full IOrganization details for display on this page
export interface IOrganization {
  _id: string;
  name: string;
  code: string;
  planType: string;
  license: IOrgLicense;
  stats: IOrgStats;
  startDate: string;
  endDate: string;
  primaryContact: {
    name: string;
    email: string;
  };
}

export default function OrganizationManagement({
  initialOrgs,
}: {
  initialOrgs: IOrganization[];
}) {
  const [orgs, setOrgs] = useState<IOrganization[]>(initialOrgs);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<IOrganization | null>(
    null
  );

  // ------------------------------------------
  // CORE HANDLERS
  // ------------------------------------------

  const handleCreate = async (formData: FormData) => {
    setIsLoading(true);
    const result = await createOrganizationWithUsers(formData);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      setShowCreateModal(false);
      router.refresh(); // Re-fetch the organization list and KPIs
    } else {
      toast.error(
        typeof result.error === "string" ? result.error : "Failed to create"
      );
    }
  };

  const handleDelete = async (orgId: string) => {
    if (
      !confirm(
        "Are you sure? This will delete the Organization AND all its users."
      )
    )
      return;
    setIsLoading(true); // Indicate loading while deleting
    const result = await deleteOrganization(orgId);
    setIsLoading(false);
    if (result.success) {
      toast.success(result.message);
      setOrgs(orgs.filter((o) => o._id !== orgId)); // Optimistic update
      router.refresh(); // Re-fetch the organization list and KPIs
    } else {
      toast.error(
        typeof result.error === "string" ? result.error : "Failed to delete"
      );
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!showEditModal) return;
    setIsLoading(true);
    const result = await editOrganization(showEditModal._id, formData);
    setIsLoading(false);
    if (result.success) {
      toast.success("Updated successfully");
      setShowEditModal(null);
      router.refresh(); // Re-fetch the organization list and KPIs
    } else {
      toast.error(
        typeof result.error === "string" ? result.error : "Failed to update"
      );
    }
  };

  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* --- HEADER --- */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search organizations..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" /> Add Organization
        </button>
      </div>

      {/* --- TABLE --- */}
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 font-medium">
          <tr>
            <th className="px-6 py-3">Organization</th>
            <th className="px-6 py-3">Code</th>
            <th className="px-6 py-3">Plan</th>
            <th className="px-6 py-3">Users</th>
            <th className="px-6 py-3">Dates (Start - End)</th>
            {/* New column */}
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orgs
            .filter(
              (o) =>
                o.name.toLowerCase().includes(search.toLowerCase()) ||
                o.code.toLowerCase().includes(search.toLowerCase()) ||
                o.primaryContact.name
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                o.primaryContact.email
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )
            .map((org) => (
              <tr key={org._id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium">{org.name}</td>
                <td className="px-6 py-4 text-gray-500">{org.code}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs capitalize">
                    {org.planType}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {org.stats?.totalUsers || 0} / {org.license?.maxUsers || 0}
                </td>
                <td className="px-6 py-4 text-gray-600 text-xs">
                  {getFormattedDate(org.startDate)} -{" "}
                  {getFormattedDate(org.endDate)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        router.push(`/super-admin/organizations/${org._id}`)
                      }
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                      title="Manage Organization"
                      disabled={isLoading} // Disable actions during page-level operations
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowEditModal(org)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      title="Edit"
                      disabled={isLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(org._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          {orgs.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                No organizations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ========================================================= */}
      {/* CREATE MODAL */}
      {/* ========================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Create Organization</h3>
              <button type="button" onClick={() => setShowCreateModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <form action={handleCreate} className="p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
                  Organization Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Code
                    </label>
                    <input
                      name="code"
                      required
                      className="w-full px-3 py-2 border rounded-md uppercase"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Plan
                    </label>
                    <select
                      name="planType"
                      defaultValue="basic"
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="basic">Basic</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Max Users
                    </label>
                    <input
                      name="maxUsers"
                      type="number"
                      defaultValue={50}
                      min={1}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      name="endDate"
                      type="date"
                      required
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() + 1)
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                    />
                    <input
                      name="startDate"
                      type="hidden"
                      value={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
                  Owner (Admin) Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Owner Name
                    </label>
                    <input
                      name="ownerName"
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Owner Email
                    </label>
                    <input
                      name="ownerEmail"
                      type="email"
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Owner Password
                  </label>
                  <input
                    name="ownerPassword"
                    type="password"
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
                  Manager Details (Optional)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Manager Name
                    </label>
                    <input
                      name="managerName"
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Manager Email
                    </label>
                    <input
                      name="managerEmail"
                      type="email"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Manager Password
                  </label>
                  <input
                    name="managerPassword"
                    type="password"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Organization"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4">Edit Organization</h3>
            <button
              type="button"
              onClick={() => setShowEditModal(null)}
              className="absolute top-4 right-4"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
            <form action={handleEdit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  defaultValue={showEditModal.name}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Plan
                </label>
                <select
                  name="planType"
                  defaultValue={showEditModal.planType}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Max Users
                </label>
                <input
                  name="maxUsers"
                  type="number"
                  min={1}
                  defaultValue={showEditModal.license.maxUsers}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  End Date
                </label>
                <input
                  name="endDate"
                  type="date"
                  defaultValue={
                    showEditModal.endDate
                      ? new Date(showEditModal.endDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="flex-1 py-2 border rounded"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 bg-blue-600 text-white rounded"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
