// hooks/use-auth.ts

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { UserRole } from "@/types/next-auth";

const DASHBOARD_ROUTES: Record<UserRole, string> = {
  super_admin: "/super-admin/dashboard",
  org_admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  team_lead: "/team-lead/dashboard",
  employee: "/employee/dashboard",
};

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  // Extract role to avoid memoization issues
  const userRole = user?.role as UserRole | undefined;

  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return result;
  }, []);

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/login");
  }, [router]);

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!userRole) return false;
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(userRole);
    },
    [userRole]
  );

  const getDashboardRoute = useMemo(() => {
    if (!userRole) return "/dashboard";
    return DASHBOARD_ROUTES[userRole] || "/dashboard";
  }, [userRole]);

  const goToDashboard = useCallback(() => {
    router.push(getDashboardRoute);
  }, [router, getDashboardRoute]);

  // Role checks as memoized values
  const isAdmin = useMemo(
    () => userRole === "org_admin" || userRole === "super_admin",
    [userRole]
  );

  const isSuperAdmin = useMemo(() => userRole === "super_admin", [userRole]);

  const isManager = useMemo(
    () =>
      userRole === "manager" ||
      userRole === "team_lead" ||
      userRole === "org_admin" ||
      userRole === "super_admin",
    [userRole]
  );

  const isTeamLead = useMemo(
    () =>
      userRole === "team_lead" ||
      userRole === "manager" ||
      userRole === "org_admin" ||
      userRole === "super_admin",
    [userRole]
  );

  return {
    user,
    session,
    status,
    isAuthenticated,
    isLoading,
    userRole,
    login,
    logout,
    hasRole,
    goToDashboard,
    getDashboardRoute,
    updateSession: update,
    // Role checks
    isAdmin,
    isSuperAdmin,
    isManager,
    isTeamLead,
  };
}
