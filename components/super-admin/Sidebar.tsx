"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  Shield,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarItems = [
  {
    title: "Overview",
    href: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/super-admin/users",
    icon: Users,
  },
  {
    title: "Organizations",
    href: "/super-admin/organizations", // Placeholder route
    icon: Building2,
  },
  {
    title: "System Settings",
    href: "/super-admin/settings", // Placeholder route
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-[#0a0a0f] border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
      {/* Brand */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-display text-xl font-bold text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          Thinkhall<span className="text-yellow-500">.</span>
        </div>
        <p className="text-xs text-gray-500 mt-2 px-1">Super Admin Console</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-yellow-500/10 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.1)] border border-yellow-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
