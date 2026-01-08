import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-5">
        <h1 className="text-xl font-semibold mb-8">Thinkhall Admin</h1>

        <nav className="space-y-4 text-sm">
          <Link
            href="/admin"
            className="block hover:text-yellow-400 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/organizations"
            className="block hover:text-yellow-400 transition"
          >
            Organizations
          </Link>

          <Link
            href="/admin/users"
            className="block hover:text-yellow-400 transition"
          >
            Users
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-yellow-50 p-6">{children}</main>
    </div>
  );
}
