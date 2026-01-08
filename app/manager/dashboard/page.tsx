// app/manager/dashboard/page.tsx

import { requireRole } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Award,
  BarChart3,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default async function ManagerDashboard() {
  const user = await requireRole(["manager", "org_admin", "super_admin"]);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="mt-2 opacity-90">
          Welcome back, {user.name} • {user.designation || "Manager"}
        </p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Team Members
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">2 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Team Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-green-500">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Completion
            </CardTitle>
            <Award className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-gray-500">Course completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Team Score
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2/5</div>
            <p className="text-xs text-gray-500">Performance rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Performance */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Team member list */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">John Doe</h4>
                      <p className="text-sm text-gray-600">Senior Developer</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">92%</p>
                      <p className="text-xs text-gray-500">Readiness</p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Jane Smith</h4>
                      <p className="text-sm text-gray-600">Developer</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">78%</p>
                      <p className="text-xs text-gray-500">Readiness</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">3 Pending Approvals</p>
                    <p className="text-xs text-gray-500">Course enrollments</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Weekly Report Ready</p>
                    <p className="text-xs text-gray-500">View report</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
