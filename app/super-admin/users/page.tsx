import { requireRole } from "@/lib/auth";
import { getAllUsers } from "@/app/actions/super-admin";
import UserManagement, {
  UserType,
} from "@/components/super-admin/UserManagement";

// Define the shape of the raw data coming from the server action
// This satisfies the linter by replacing 'any' with a specific type
interface ServerUserResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
  organizationId?: {
    _id: string;
    name: string;
    code: string;
  } | null;
  // This allows for other Mongoose fields (like __v, password, etc.)
  // to exist without breaking the type, but types them as unknown
  [key: string]: unknown;
}

export default async function SuperAdminUsersPage() {
  await requireRole("super_admin");
  const usersResult = await getAllUsers();

  // FIX: Explicitly map the server data using the ServerUserResponse interface.
  const userList: UserType[] =
    usersResult.success && Array.isArray(usersResult.data)
      ? usersResult.data.map((user: ServerUserResponse) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          // We cast role to string because the server might return an enum type
          // that TS views as incompatible with the simple string in UserType
          role: String(user.role),
          isActive: user.isActive,
          createdAt: user.createdAt || "",
          organizationId: user.organizationId
            ? {
                _id: user.organizationId._id,
                name: user.organizationId.name,
                code: user.organizationId.code,
              }
            : null,
        }))
      : [];

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">
            View, manage, and audit all system users.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border px-3 py-1 rounded-md text-sm">
            Total Users: <span className="font-bold">{userList.length}</span>
          </div>
        </div>
      </div>

      {/* The User Table Component */}
      <UserManagement initialUsers={userList} />
    </div>
  );
}
