"use client";

import { useState, useRef, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import {
  Search,
  Plus,
  Trash2,
  Loader2,
  X,
  Upload,
  FileSpreadsheet,
  Clipboard,
  CheckCircle2,
  Download,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import {
  createUser,
  updateUserRole,
  deleteUser,
  bulkImportUsers,
} from "@/app/actions/super-admin";

// --- EXPORTED INTERFACES ---
export interface IOrganizationShort {
  _id: string;
  name: string;
  code: string;
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

// Helper for deterministic date formatting
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

export default function UserManagement({
  initialUsers,
}: {
  initialUsers: UserType[];
}) {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [search, setSearch] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Bulk Upload State
  const [bulkTab, setBulkTab] = useState<"file" | "text">("file");
  const [bulkEmails, setBulkEmails] = useState<string[]>([]);
  const [bulkText, setBulkText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single Create Form Ref
  const formRef = useRef<HTMLFormElement>(null);

  // ---------------------------------------------------------
  // 1. BULK UPLOAD LOGIC
  // ---------------------------------------------------------

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (typeof bstr !== "string") return;

      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      // Convert to JSON with explicit type unknown
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];

      // Extract emails
      const extractedEmails: string[] = [];

      // Flatten the array and check types safely
      data.flat().forEach((cell: unknown) => {
        if (typeof cell === "string" && cell.includes("@")) {
          extractedEmails.push(cell.trim());
        }
      });

      setBulkEmails(extractedEmails);
      if (extractedEmails.length === 0) {
        toast.warning("No emails found in the file");
      } else {
        toast.success(`Found ${extractedEmails.length} emails`);
      }
    };
    reader.readAsBinaryString(file);
  };

  const submitBulkImport = async () => {
    if (bulkEmails.length === 0) return toast.error("No emails to import");

    setIsProcessing(true);

    const result = await bulkImportUsers(bulkEmails);

    setIsProcessing(false);

    if (result.success && result.results) {
      toast.success(
        `Imported: ${result.results.success}, Duplicates: ${result.results.duplicates}, Failed: ${result.results.failed}`
      );
      setIsBulkModalOpen(false);
      setBulkEmails([]);
      setBulkText("");
      window.location.reload();
    } else {
      toast.error("Bulk import failed");
    }
  };

  // ---------------------------------------------------------
  // 2. SINGLE USER LOGIC
  // ---------------------------------------------------------

  const handleCreateUser = async (formData: FormData) => {
    setIsProcessing(true);
    const result = await createUser(formData);
    setIsProcessing(false);

    if (result.success) {
      toast.success(result.message);
      setIsAddModalOpen(false);
      formRef.current?.reset();
      window.location.reload();
    } else {
      toast.error(
        typeof result.error === "string"
          ? result.error
          : "Failed to create user"
      );
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    toast.promise(updateUserRole(userId, newRole), {
      loading: "Updating role...",
      success: (data) => {
        if (!data.success) throw new Error(data.error);
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        return "Role updated";
      },
      error: (err) => err.message,
    });
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure?")) return;
    toast.promise(deleteUser(userId), {
      loading: "Deleting...",
      success: (data) => {
        setUsers(users.filter((u) => u._id !== userId));
        return "User deleted";
      },
      error: "Failed to delete",
    });
  };

  // ---------------------------------------------------------
  // UI RENDER
  // ---------------------------------------------------------

  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.organizationId?.name.toLowerCase().includes(searchLower)
    );
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "org_admin":
        return "bg-red-100 text-red-700 border-red-200";
      case "manager":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Actions */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users or organizations..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Bulk Import
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Organization</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                {/* User Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Organization Info */}
                <td className="px-6 py-4">
                  {user.organizationId ? (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {user.organizationId.name}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {user.organizationId.code}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-xs">
                      No Organization
                    </span>
                  )}
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={`px-2 py-1 rounded-md text-xs font-medium border ${getRoleBadgeColor(
                      user.role
                    )} bg-opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400`}
                  >
                    <option value="employee">Employee</option>
                    <option value="team_lead">Team Lead</option>
                    <option value="manager">Manager</option>
                    <option value="org_admin">Org Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      Inactive
                    </span>
                  )}
                </td>

                {/* Created Date */}
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {formatDate(user.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==================== ADD SINGLE USER MODAL ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">Add New User</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form
              ref={formRef}
              action={handleCreateUser}
              className="p-6 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="john@company.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    name="role"
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="org_admin">Org Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="••••••"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex justify-center"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== BULK IMPORT MODAL ==================== */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-yellow-500" />
                <h3 className="font-bold text-lg text-gray-900">
                  Bulk Import Users
                </h3>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                <button
                  onClick={() => setBulkTab("file")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                    bulkTab === "file"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <FileSpreadsheet className="h-4 w-4" /> Excel / CSV
                </button>
                <button
                  onClick={() => setBulkTab("text")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                    bulkTab === "text"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Clipboard className="h-4 w-4" /> Copy Paste
                </button>
              </div>

              {bulkTab === "file" ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-yellow-400 transition-colors cursor-pointer bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileUpload}
                  />
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="font-medium text-gray-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs text-gray-400 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                    <Download className="h-3 w-3" /> Template: Email column
                    required
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Paste Emails (comma or new line separated)
                  </label>
                  <textarea
                    className="w-full h-40 p-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-mono text-sm"
                    placeholder={
                      "user1@example.com\nuser2@example.com, user3@example.com"
                    }
                    value={bulkText}
                    onChange={(e) => {
                      setBulkText(e.target.value);
                      const emails = e.target.value
                        .split(/[\n,;]/)
                        .map((x) => x.trim())
                        .filter((x) => x.includes("@"));
                      setBulkEmails(emails);
                    }}
                  />
                </div>
              )}

              {/* Import Summary Preview */}
              {bulkEmails.length > 0 && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      Ready to import {bulkEmails.length} users
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Default password will be set to{" "}
                      <code className="bg-green-100 px-1 rounded font-bold">
                        Thinkhall@123
                      </code>
                    </p>
                    {bulkEmails.length > 5 && (
                      <p className="text-xs text-green-600 mt-2 truncate max-w-xs">
                        {bulkEmails.slice(0, 3).join(", ")}... and{" "}
                        {bulkEmails.length - 3} others
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={submitBulkImport}
                disabled={isProcessing || bulkEmails.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Start Import"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
