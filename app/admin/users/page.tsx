"use client";

import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

type EditableUser = User & {
  isEditing?: boolean;
  draftRole?: string;
  draftIsActive?: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<EditableUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const startEdit = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id
          ? {
              ...u,
              isEditing: true,
              draftRole: u.role,
              draftIsActive: u.isActive,
            }
          : u
      )
    );
  };

  const cancelEdit = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isEditing: false } : u))
    );
  };

  const saveEdit = async (id: string) => {
    const user = users.find((u) => u._id === id);
    if (!user) return;

    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: user.draftRole,
        isActive: user.draftIsActive,
      }),
    });

    setUsers((prev) =>
      prev.map((u) =>
        u._id === id
          ? {
              ...u,
              role: user.draftRole!,
              isActive: user.draftIsActive!,
              isEditing: false,
            }
          : u
      )
    );
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
    });

    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  if (loading) {
    return <div className="p-8 text-slate-600">Loading users…</div>;
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Manage Users</h2>

        <div className="overflow-x-auto rounded-lg border border-yellow-300 bg-white shadow">
          <table className="w-full">
            <thead className="bg-yellow-100">
              <tr className="text-left text-slate-700">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t hover:bg-yellow-50 transition"
                >
                  <td className="p-4 text-slate-800">{u.name}</td>

                  <td className="p-4 text-slate-600">{u.email}</td>

                  <td className="p-4">
                    {u.isEditing ? (
                      <select
                        value={u.draftRole}
                        onChange={(e) =>
                          setUsers((prev) =>
                            prev.map((x) =>
                              x._id === u._id
                                ? {
                                    ...x,
                                    draftRole: e.target.value,
                                  }
                                : x
                            )
                          )
                        }
                        className="rounded-md border border-yellow-300 px-2 py-1"
                      >
                        <option value="employee">Employee</option>
                        <option value="team_lead">Team Lead</option>
                        <option value="org_admin">Org Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    ) : (
                      <span className="capitalize">{u.role}</span>
                    )}
                  </td>

                  <td className="p-4">
                    {u.isEditing ? (
                      <input
                        type="checkbox"
                        checked={u.draftIsActive}
                        onChange={(e) =>
                          setUsers((prev) =>
                            prev.map((x) =>
                              x._id === u._id
                                ? {
                                    ...x,
                                    draftIsActive: e.target.checked,
                                  }
                                : x
                            )
                          )
                        }
                      />
                    ) : (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          u.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>

                  <td className="p-4 space-x-3">
                    {u.isEditing ? (
                      <>
                        <button
                          onClick={() => saveEdit(u._id)}
                          className="font-medium text-green-600 hover:underline"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => cancelEdit(u._id)}
                          className="text-slate-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(u._id)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
