// lib/auth.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/next-auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?error=SessionRequired");
  }
  return user;
}

export async function requireRole(roles: UserRole | UserRole[]) {
  const user = await requireAuth();
  const roleArray = Array.isArray(roles) ? roles : [roles];

  if (!roleArray.includes(user.role as UserRole)) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  return requireRole(["org_admin", "super_admin"]);
}

export async function requireSuperAdmin() {
  return requireRole("super_admin");
}
