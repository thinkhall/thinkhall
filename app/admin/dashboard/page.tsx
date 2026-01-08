// app/admin/dashboard/page.tsx

import { requireRole } from "@/lib/auth";
import LogoutButton from "@/components/ui/LogoutButton"; // Adjusted path based on standard component structure
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  GraduationCap,
  Activity,
  Upload,
  Settings,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { getOrgStats, getRecentEmployees } from "@/app/actions/org-admin";

// Define the shape of the employee data
interface Employee {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

// Helper for date formatting
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
};

export default async function AdminDashboard() {
  const user = await requireRole(["org_admin", "super_admin"]);
  const stats = await getOrgStats();
  // Ensure strict typing for the return value
  const recentEmployees: Employee[] = await getRecentEmployees();

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50/50">
      {/* 1. HERO SECTION */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-1000"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 uppercase tracking-wider">
                Organization Admin
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display">
              Overview
            </h1>
            <p className="mt-2 text-gray-400 max-w-lg">
              Welcome back, {user.name}. Here&apos;s what&apos;s happening in
              your organization today.
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Employees
            </CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.employees}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>{stats.activeEmployees} active now</span>
            </p>
          </CardContent>
        </Card>

        {/* Departments */}
        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Departments
            </CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Building2 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.departments}
            </div>
            <p className="text-xs text-gray-500 mt-1">Across 3 locations</p>
          </CardContent>
        </Card>

        {/* Active Courses */}
        <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Learning
            </CardTitle>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <GraduationCap className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.courses}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Active courses assigned
            </p>
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Engagement
            </CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <Activity className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.engagement}%
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+5% from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Quick Actions (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-400" />
            Quick Actions
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/admin/employees/upload" className="group">
              <Card className="h-full hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer border-dashed border-2">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Bulk Import
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Upload CSV/Excel files to add employees in bulk.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/employees" className="group">
              <Card className="h-full hover:border-green-400 hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      Manage Staff
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Add, edit, or offboard employees individually.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/departments" className="group">
              <Card className="h-full hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      Departments
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Structure your organization hierarchy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/settings" className="group">
              <Card className="h-full hover:border-yellow-400 hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Settings className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                      Org Settings
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Configure branding, domains, and security.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Activity (1/3 width) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Recent Joinees
            </h2>
            <Link
              href="/admin/employees"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentEmployees.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No recent activity
                  </div>
                ) : (
                  recentEmployees.map((emp: Employee) => (
                    <div
                      key={emp._id}
                      className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                        {emp.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {emp.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {emp.email}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(emp.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 bg-gray-50 border-t border-gray-100">
                <Link
                  href="/admin/employees"
                  className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  View full roster <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
