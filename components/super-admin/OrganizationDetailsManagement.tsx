// components/super-admin/OrganizationDetailsManagement.tsx
"use client";

import { useState, useTransition, useMemo } from "react";
import {
  X,
  Edit,
  Plus,
  Trash2,
  Loader2,
  Search,
  Upload,
  ClipboardList,
  FileSpreadsheet,
  SquareCheckBig,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  editOrganization,
  createUserInOrganization,
  updateUserInOrganization,
  deleteUserFromOrganization,
  bulkImportUsersToOrg,
  getUsersInOrganization,
  getOrganizationById,
  adminResetUserPassword,
} from "@/app/actions/super-admin";
import { IOrganization as IBaseOrganization } from "./OrganizationManagement";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

// Re-define IOrganization to include primaryContact
export interface IOrganization extends IBaseOrganization {
  primaryContact: {
    name: string;
    email: string;
  };
}

// UserType for this component (all stringified)
export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  designation?: string | null;
  isActive: boolean;
  createdAt: string;
  organizationId?: string;
}

// Raw import row interface
interface IRawImportRow {
  Name?: string | number;
  name?: string | number;
  Email?: string;
  email?: string;
  Role?: string;
  role?: string;
  Designation?: string;
  designation?: string;
  [key: string]: unknown;
}

// Organization-level roles only (super_admin is platform-level, not org-level)
const userRoles = ["employee", "team_lead", "manager", "org_admin"];

// Helper function to serialize user data from server response
function serializeUser(user: {
  _id: string | { toString(): string };
  name: string;
  email: string;
  role: string;
  designation?: string | null;
  isActive: boolean;
  createdAt: string;
  organizationId?: string | { toString(): string };
}): UserType {
  return {
    _id: typeof user._id === "string" ? user._id : user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    designation: user.designation ?? null,
    isActive: user.isActive,
    createdAt: user.createdAt,
    organizationId: user.organizationId
      ? typeof user.organizationId === "string"
        ? user.organizationId
        : user.organizationId.toString()
      : undefined,
  };
}

export default function OrganizationDetailsManagement({
  organization,
  initialUsers,
}: {
  organization: IOrganization;
  initialUsers: UserType[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPending, startTransition] = useTransition();
  const [orgData, setOrgData] = useState<IOrganization>(organization);
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals for User Management
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState<UserType | null>(
    null
  );
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);

  // Bulk Upload States
  const [uploadTab, setUploadTab] = useState<"file" | "paste">("file");
  const [pasteData, setPasteData] = useState("");

  // Edit Org Modal
  const [showEditOrgModal, setShowEditOrgModal] = useState(false);
  const [isOrgEditLoading, setIsOrgEditLoading] = useState(false);

  // Create User Modal - Send Reset Email State
  const [sendResetEmail, setSendResetEmail] = useState(true);

  // Refresh user list function - FIXED: properly serialize users
  const refreshUsers = async () => {
    const res = await getUsersInOrganization(orgData._id);
    if (res.success && res.data) {
      // Serialize users to match UserType interface
      const serializedUsers: UserType[] = res.data.map((user) =>
        serializeUser(user as Parameters<typeof serializeUser>[0])
      );
      setUsers(serializedUsers);
    } else {
      toast.error("Failed to refresh user list: " + res.error);
    }
  };

  // Refresh organization data
  const refreshOrganizationData = async () => {
    const res = await getOrganizationById(orgData._id);
    if (res.success && res.data) {
      setOrgData(res.data);
    } else {
      toast.error("Failed to refresh organization data: " + res.error);
    }
  };

  // --- Organization Management Handlers ---
  const handleEditOrg = async (formData: FormData) => {
    setIsOrgEditLoading(true);
    const result = await editOrganization(orgData._id, formData);
    setIsOrgEditLoading(false);
    if (result.success) {
      toast.success(result.message);
      setShowEditOrgModal(false);
      router.refresh();
      startTransition(async () => {
        await refreshOrganizationData();
      });
    } else {
      toast.error(result.error);
    }
  };

  // --- User Management Handlers ---
  const handleCreateUser = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createUserInOrganization(orgData._id, formData);
      if (result.success) {
        toast.success(result.message);
        setShowCreateUserModal(false);
        setSendResetEmail(true); // Reset for next time
        await refreshUsers();
        await refreshOrganizationData();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleUpdateUser = async (formData: FormData) => {
    if (!showEditUserModal) return;
    startTransition(async () => {
      const result = await updateUserInOrganization(
        showEditUserModal._id,
        formData
      );
      if (result.success) {
        toast.success(result.message);
        setShowEditUserModal(null);
        await refreshUsers();
        await refreshOrganizationData();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteUserFromOrganization(userId);
      if (result.success) {
        toast.success(result.message);
        await refreshUsers();
        await refreshOrganizationData();
      } else {
        toast.error(result.error);
      }
    });
  };

  // --- Password Reset Handler ---
  const handleResetPassword = async (userId: string, userEmail: string) => {
    if (!confirm(`Send password reset email to ${userEmail}?`)) return;

    startTransition(async () => {
      const result = await adminResetUserPassword(userId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || "Failed to reset password");
      }
    });
  };

  // --- Bulk Import Logic ---
  const processImportData = async (rawData: IRawImportRow[]) => {
    const mappedData = rawData
      .map((row) => ({
        name: String(row.Name || row.name || "").trim(),
        email: String(row.Email || row.email || "").trim(),
        role: String(row.Role || row.role || "employee")
          .trim()
          .toLowerCase(),
        designation: String(row.Designation || row.designation || "").trim(),
      }))
      .filter((r) => !!r.email && r.email.includes("@"));

    if (mappedData.length === 0) {
      toast.error(
        "No valid user data found. Check headers (Name, Email, Role, Designation)."
      );
      return;
    }

    startTransition(async () => {
      const res = await bulkImportUsersToOrg(orgData._id, mappedData);
      if (res.success) {
        toast.success(res.message);
        if (res.results?.errors && res.results.errors.length > 0) {
          res.results.errors.forEach((err) => toast.error(err));
        }
        setPasteData("");
        setShowBulkImportModal(false);
        await refreshUsers();
        await refreshOrganizationData();
      } else {
        toast.error(
          typeof res.error === "string" ? res.error : "Import failed"
        );
        if (res.results?.errors && res.results.errors.length > 0) {
          res.results.errors.forEach((err) => toast.error(err));
        }
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop()?.toLowerCase();

    if (fileExt === "csv") {
      Papa.parse<IRawImportRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => processImportData(results.data),
      });
    } else if (["xlsx", "xls"].includes(fileExt || "")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json<IRawImportRow>(ws);
        processImportData(data);
      };
      reader.readAsBinaryString(file);
    } else {
      toast.error("Unsupported file type. Use .csv, .xlsx, or .xls");
    }

    e.target.value = "";
  };

  const handlePasteSubmit = () => {
    if (!pasteData.trim()) {
      toast.error("Please paste data first");
      return;
    }

    Papa.parse<IRawImportRow>(pasteData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => processImportData(results.data),
    });
  };

  // Filtered users for display
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.designation?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Header with Organization Name and Back Button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              {orgData.name} ({orgData.code})
            </h1>
            <p className="text-gray-500 mt-1">
              Manage details, users, and resources for this organization.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowEditOrgModal(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          <Edit className="h-4 w-4" /> Edit Organization Details
        </button>
      </div>

      {/* Tabs for Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "users"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Users ({orgData.stats?.totalUsers || 0})
          </button>
          <button
            onClick={() => setActiveTab("modules")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "modules"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Modules & Courses
          </button>
        </nav>
      </div>

      {/* --- Tab Content --- */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Organization Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DetailItem label="Name" value={orgData.name} />
            <DetailItem label="Code" value={orgData.code} />
            <DetailItem label="Plan Type" value={orgData.planType} capitalize />
            <DetailItem label="Max Users" value={orgData.license?.maxUsers} />
            <DetailItem label="Users Used" value={orgData.stats?.totalUsers} />
            <DetailItem
              label="Subscription Start Date"
              value={getFormattedDate(orgData.startDate)}
            />
            <DetailItem
              label="Subscription End Date"
              value={getFormattedDate(orgData.endDate)}
            />
            <DetailItem
              label="Primary Contact"
              value={orgData.primaryContact?.name}
            />
            <DetailItem
              label="Contact Email"
              value={orgData.primaryContact?.email}
            />
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* User Management Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBulkImportModal(true)}
                className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100"
                disabled={
                  isPending ||
                  orgData.stats.totalUsers >= orgData.license.maxUsers
                }
              >
                <Upload className="h-4 w-4" /> Bulk Import
              </button>
              <button
                onClick={() => setShowCreateUserModal(true)}
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                disabled={
                  isPending ||
                  orgData.stats.totalUsers >= orgData.license.maxUsers
                }
              >
                <Plus className="h-4 w-4" /> Add User
              </button>
            </div>
          </div>

          {/* User Table */}
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Designation</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isPending && filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    <Loader2 className="animate-spin inline-block mr-2" />{" "}
                    Loading users...
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 capitalize">
                      {user.role.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {user.designation || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleResetPassword(user._id, user.email)
                          }
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded"
                          title="Reset Password"
                          disabled={isPending}
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowEditUserModal(user)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                          title="Edit User"
                          disabled={isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete User"
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {filteredUsers.length === 0 && !isPending && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {orgData.stats.totalUsers >= orgData.license.maxUsers && (
            <div className="p-4 text-center text-sm text-red-600 bg-red-50 border-t border-red-200">
              Organization has reached its maximum user limit (
              {orgData.license.maxUsers}). No more users can be added.
            </div>
          )}
        </div>
      )}

      {activeTab === "modules" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Module & Course Management
          </h3>
          <div className="text-gray-600 text-center py-10 border border-dashed rounded-lg">
            <SquareCheckBig className="h-10 w-10 text-blue-400 mx-auto mb-4" />
            <p className="font-semibold text-xl">Coming Soon!</p>
            <p className="mt-2 text-sm">
              This section will allow you to assign and manage learning modules
              and courses for {orgData.name}.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}

      {/* Edit Organization Modal */}
      {showEditOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <h3 className="font-bold text-lg mb-4">Edit Organization</h3>
            <button
              type="button"
              onClick={() => setShowEditOrgModal(false)}
              className="absolute top-4 right-4"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
            <form action={handleEditOrg} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  defaultValue={orgData.name}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Plan
                </label>
                <select
                  name="planType"
                  defaultValue={orgData.planType}
                  className="w-full px-3 py-2 border rounded-md"
                  required
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
                  defaultValue={orgData.license?.maxUsers}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  End Date
                </label>
                <input
                  name="endDate"
                  type="date"
                  required
                  defaultValue={
                    orgData.endDate
                      ? new Date(orgData.endDate).toISOString().split("T")[0]
                      : ""
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditOrgModal(false)}
                  className="flex-1 py-2 border rounded"
                  disabled={isOrgEditLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOrgEditLoading}
                  className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isOrgEditLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto relative">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Add User to {orgData.name}</h3>
              <button
                type="button"
                onClick={() => {
                  setShowCreateUserModal(false);
                  setSendResetEmail(true); // Reset state
                }}
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <form action={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Password{" "}
                  {sendResetEmail && "(Optional - will send setup email)"}
                </label>
                <input
                  name="password"
                  type="password"
                  required={!sendResetEmail}
                  minLength={8}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={
                    sendResetEmail
                      ? "Leave blank to send setup email"
                      : "Enter password (min 8 characters)"
                  }
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    id="sendResetEmail"
                    name="sendResetEmail"
                    type="checkbox"
                    checked={sendResetEmail}
                    onChange={(e) => setSendResetEmail(e.target.checked)}
                    value="true"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="sendResetEmail"
                    className="text-sm text-gray-600"
                  >
                    Send password setup email to user
                  </label>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  defaultValue="employee"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  {userRoles.map((role) => (
                    <option key={role} value={role} className="capitalize">
                      {role.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Designation (Optional)
                </label>
                <input
                  name="designation"
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateUserModal(false);
                    setSendResetEmail(true); // Reset state
                  }}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto relative">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">
                Edit User: {showEditUserModal.name}
              </h3>
              <button type="button" onClick={() => setShowEditUserModal(null)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <form action={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  defaultValue={showEditUserModal.name}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue={showEditUserModal.email}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  New Password (Optional)
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  minLength={8}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  defaultValue={showEditUserModal.role}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  {userRoles.map((role) => (
                    <option key={role} value={role} className="capitalize">
                      {role.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Designation (Optional)
                </label>
                <input
                  name="designation"
                  type="text"
                  defaultValue={showEditUserModal.designation || ""}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  defaultChecked={showEditUserModal.isActive}
                  value="true"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active User
                </label>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(null)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <div>
                <h3 className="font-bold text-lg">Bulk Import Users</h3>
                <p className="text-sm text-gray-500">
                  Import multiple users to {orgData.name} ({orgData.code}).
                  Available slots:{" "}
                  {Math.max(
                    0,
                    orgData.license.maxUsers - orgData.stats.totalUsers
                  )}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  📧 Password setup emails will be sent to all imported users
                  automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkImportModal(false)}
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-auto">
              {/* Tabs */}
              <div className="flex gap-4 border-b border-gray-200 mb-4">
                <button
                  onClick={() => setUploadTab("file")}
                  className={`pb-2 text-sm font-medium flex items-center gap-2 ${
                    uploadTab === "file"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FileSpreadsheet className="h-4 w-4" /> Upload File
                  (CSV/Excel)
                </button>
                <button
                  onClick={() => setUploadTab("paste")}
                  className={`pb-2 text-sm font-medium flex items-center gap-2 ${
                    uploadTab === "paste"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <ClipboardList className="h-4 w-4" /> Copy & Paste
                </button>
              </div>

              {/* Tab Content */}
              <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                {uploadTab === "file" ? (
                  <div className="flex flex-col items-center justify-center py-4 space-y-3">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Supported: .csv, .xlsx, .xls
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleFileUpload}
                      disabled={
                        isPending ||
                        orgData.stats.totalUsers >= orgData.license.maxUsers
                      }
                      className="block w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Paste data from Excel/Sheets.{" "}
                        <strong>
                          Must include headers: Name, Email. Optional: Role,
                          Designation.
                        </strong>
                      </p>
                      <button
                        onClick={handlePasteSubmit}
                        disabled={
                          isPending ||
                          !pasteData ||
                          orgData.stats.totalUsers >= orgData.license.maxUsers
                        }
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isPending ? "Processing..." : "Import Data"}
                      </button>
                    </div>
                    <textarea
                      value={pasteData}
                      onChange={(e) => setPasteData(e.target.value)}
                      placeholder={`Name,Email,Role,Designation\nJohn Doe,john@example.com,Manager,Team Lead\nJane Smith,jane@example.com,Employee,Associate`}
                      className="w-full h-32 p-3 text-sm border rounded-md font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
                <span className="sr-only">Processing...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for displaying details - FIXED: replaced 'any' with proper type
function DetailItem({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string | number | null | undefined;
  capitalize?: boolean;
}) {
  let displayValue: string;

  if (value === null || value === undefined) {
    displayValue = "N/A";
  } else if (typeof value === "number") {
    displayValue = value.toString();
  } else if (capitalize) {
    displayValue = value
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else {
    displayValue = value;
  }

  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">
        {displayValue}
      </span>
    </div>
  );
}
