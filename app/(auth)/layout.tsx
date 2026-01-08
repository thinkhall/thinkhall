// app/(auth)/layout.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If user is already logged in, redirect to their dashboard
  if (session?.user) {
    const dashboardRoutes = {
      super_admin: "/super-admin/dashboard",
      org_admin: "/admin/dashboard",
      manager: "/manager/dashboard",
      team_lead: "/team-lead/dashboard",
      employee: "/employee/dashboard",
    };

    const route =
      dashboardRoutes[session.user.role as keyof typeof dashboardRoutes];

    redirect(route || "/dashboard");
  }

  return <>{children}</>;
}
