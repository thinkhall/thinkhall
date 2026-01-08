// app/super-admin/dashboard/page.tsx

import { requireRole } from "@/lib/auth";
import { getAllUsers } from "@/app/actions/super-admin"; // We still need this for the count
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Users,
  Database,
  Shield,
  Activity,
  TrendingUp,
} from "lucide-react";

export default async function SuperAdminDashboard() {
  const user = await requireRole("super_admin");
  // Fetch just to get counts
  const usersResult = await getAllUsers();
  const userCount = usersResult.success ? usersResult.data.length : 0;

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-4">
            System Overview
          </div>
          <h1 className="text-4xl font-bold font-display">
            Welcome back, {user.name}
          </h1>
          <p className="mt-2 text-gray-400 max-w-xl">
            Here is the real-time status of the Thinkhall platform ecosystem.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Users
            </CardTitle>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Users className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{userCount}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-600 font-medium">+12%</span> from last
              month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Organizations
            </CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <p className="text-xs text-gray-500 mt-1">3 pending approval</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              System Health
            </CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">99.9%</div>
            <p className="text-xs text-gray-500 mt-1">Uptime this week</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Database Load
            </CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Database className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">28%</div>
            <p className="text-xs text-gray-500 mt-1">2.4 GB used</p>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics Chart Area (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-md">
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
              <div className="text-center text-gray-400">
                <Activity className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Activity Chart Placeholder</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Storage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
              <p className="text-gray-400">Pie Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
