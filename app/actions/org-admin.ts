"use server";

import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function checkOrgAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["org_admin", "super_admin"].includes(session.user?.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getOrgStats() {
  const session = await checkOrgAdmin();
  await connectDB();

  // In a real app, filtering by organizationId is crucial:
  // const orgId = session.user.organizationId;
  // const filter = { organizationId: orgId };
  // For now, assuming single org or fetching all for demo if orgId missing
  const filter = {};

  const totalUsers = await User.countDocuments(filter);
  const activeUsers = await User.countDocuments({ ...filter, isActive: true });

  // Mock data for things we don't have schemas for yet (Departments, Courses)
  return {
    employees: totalUsers,
    activeEmployees: activeUsers,
    departments: 8, // Placeholder
    courses: 15, // Placeholder
    engagement: 78, // Placeholder %
  };
}

export async function getRecentEmployees() {
  const session = await checkOrgAdmin();
  await connectDB();

  const users = await User.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email role createdAt isActive")
    .lean();

  return JSON.parse(JSON.stringify(users));
}
