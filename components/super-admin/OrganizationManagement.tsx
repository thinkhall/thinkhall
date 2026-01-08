"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Loader2,
  X,
  Edit,
  Users,
  Upload,
  FileSpreadsheet,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import {
  createOrganizationWithUsers,
  deleteOrganization,
  editOrganization,
  getOrganizationMembers,
  bulkImportUsersToOrg,
} from "@/app/actions/super-admin";
import Papa from "papaparse";
import * as XLSX from "xlsx";

// --- INTERFACES ---
interface IOrgStats {
  totalUsers: number;
}

interface IOrgLicense {
  maxUsers: number;
}
export interface IOrganizationShort {
  _id: string;
  name: string;
  code: string;
}

interface IOrganization {
  _id: string;
  name: string;
  code: string;
  planType: string;
  license: IOrgLicense;
  stats: IOrgStats;
  startDate: string;
  endDate: string;
}
export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  organizationId?: IOrganizationShort | null;
}

interface IMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

// FIX: Replaced 'any' with 'unknown' to satisfy ESLint
interface IRawImportRow {
  Name?: string | number;
  name?: string | number;
  Email?: string;
  email?: string;
  Role?: string;
  role?: string;
  [key: string]: unknown; // <--- CHANGED FROM 'any' TO 'unknown'
}

export default function OrganizationManagement({
  initialOrgs,
}: {
  initialOrgs: IOrganization[];
}) {
  const [orgs, setOrgs] = useState<IOrganization[]>(initialOrgs);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<IOrganization | null>(
    null
  );
  const [showMembersModal, setShowMembersModal] =
    useState<IOrganization | null>(null);
  const [members, setMembers] = useState<IMember[]>([]);

  // Bulk Upload States
  const [uploadTab, setUploadTab] = useState<"file" | "paste">("file");
  const [pasteData, setPasteData] = useState("");

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
      window.location.reload();
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
    const result = await deleteOrganization(orgId);
    if (result.success) {
      toast.success(result.message);
      setOrgs(orgs.filter((o) => o._id !== orgId));
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
      window.location.reload();
    } else {
      toast.error(
        typeof result.error === "string" ? result.error : "Failed to update"
      );
    }
  };

  const openMembersModal = async (org: IOrganization) => {
    setShowMembersModal(org);
    setPasteData("");
    setIsLoading(true);
    const res = await getOrganizationMembers(org._id);
    setMembers(res.success ? (res.data as IMember[]) : []);
    setIsLoading(false);
  };

  // ------------------------------------------
  // BULK UPLOAD LOGIC (Unified)
  // ------------------------------------------

  // 1. Central Processor for cleaned data
  const processImportData = async (rawData: IRawImportRow[]) => {
    if (!showMembersModal) return;

    // FIX: Wrapped values in String() to handle cases where Excel returns numbers
    const mappedData = rawData
      .map((row) => ({
        name: String(row.Name || row.name || "").trim(),
        email: String(row.Email || row.email || "").trim(),
        role: String(row.Role || row.role || "employee")
          .trim()
          .toLowerCase(),
      }))
      .filter((r) => !!r.email && r.email.includes("@"));

    if (mappedData.length === 0) {
      toast.error("No valid data found. Check headers (Name, Email).");
      return;
    }

    setIsLoading(true);
    const res = await bulkImportUsersToOrg(showMembersModal._id, mappedData);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message);
      setPasteData("");
      // Refresh list
      const updatedMembers = await getOrganizationMembers(showMembersModal._id);
      setMembers(
        updatedMembers.success ? (updatedMembers.data as IMember[]) : []
      );
    } else {
      toast.error(typeof res.error === "string" ? res.error : "Import failed");
      if (res.results?.errors && Array.isArray(res.results.errors)) {
        res.results.errors.forEach((err: string) => toast.error(err));
      }
    }
  };

  // 2. File Upload Handler (CSV + Excel)
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
        // Using 'binary' string read is deprecated in newer XLSX but still works commonly.
        // Consider 'arraybuffer' for strictly modern implementations, but this matches your previous logic.
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

  // 3. Paste Handler
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
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orgs
            .filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
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
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openMembersModal(org)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Manage Members"
                    >
                      <Users className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowEditModal(org)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(org._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* ========================================================= */}
      {/* MEMBERS & BULK UPLOAD MODAL */}
      {/* ========================================================= */}
      {showMembersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <div>
                <h3 className="font-bold text-lg">Manage Members</h3>
                <p className="text-sm text-gray-500">
                  {showMembersModal.name} ({showMembersModal.code})
                </p>
              </div>
              <button onClick={() => setShowMembersModal(null)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* --- BULK UPLOAD SECTION --- */}
            <div className="border-b border-gray-200 bg-white p-4 shrink-0">
              <h4 className="font-semibold text-gray-800 text-sm mb-3">
                Bulk Import Users
              </h4>

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
                      disabled={isLoading}
                      className="block w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Paste data from Excel/Sheets.{" "}
                        <strong>Must include headers: Name, Email</strong>
                      </p>
                      <button
                        onClick={handlePasteSubmit}
                        disabled={isLoading || !pasteData}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? "Processing..." : "Import Data"}
                      </button>
                    </div>
                    <textarea
                      value={pasteData}
                      onChange={(e) => setPasteData(e.target.value)}
                      placeholder={`Name,Email,Role\nJohn Doe,john@example.com,Manager\nJane Smith,jane@example.com,Employee`}
                      className="w-full h-32 p-3 text-sm border rounded-md font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* --- MEMBER LIST TABLE --- */}
            <div className="flex-1 overflow-auto bg-white">
              {isLoading && members.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="animate-spin text-gray-400" />
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {members.map((m) => (
                      <tr key={m._id}>
                        <td className="px-6 py-3 font-medium">{m.name}</td>
                        <td className="px-6 py-3 text-gray-500">{m.email}</td>
                        <td className="px-6 py-3 capitalize">{m.role}</td>
                        <td className="px-6 py-3">
                          {m.isActive ? (
                            <span className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                              Active
                            </span>
                          ) : (
                            <span className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded">
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {members.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-10 text-gray-400"
                        >
                          No members found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CREATE MODAL */}
      {/* ========================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Create Organization</h3>
              <button onClick={() => setShowCreateModal(false)}>
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
                      Manager Email
                    </label>
                    <input
                      name="managerEmail"
                      type="email"
                      className="w-full px-3 py-2 border rounded-md"
                    />
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
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
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
            <form action={handleEdit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  defaultValue={showEditModal.name}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Plan
                </label>
                <select
                  name="planType"
                  defaultValue={showEditModal.planType}
                  className="w-full border rounded p-2"
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
                  defaultValue={showEditModal.license.maxUsers}
                  className="w-full border rounded p-2"
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
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="flex-1 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
