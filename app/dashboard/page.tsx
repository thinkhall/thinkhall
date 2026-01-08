// app/dashboard/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardRouter() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Redirect to role-specific dashboard
  const dashboardRoutes = {
    super_admin: "/super-admin/dashboard",
    org_admin: "/admin/dashboard",
    manager: "/manager/dashboard",
    team_lead: "/team-lead/dashboard",
    employee: "/employee/dashboard",
  };

  const route =
    dashboardRoutes[session.user.role as keyof typeof dashboardRoutes];
  redirect(route || "/employee/dashboard");
}
