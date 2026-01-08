"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Organization, { PlanType } from "@/models/Organization";
import mongoose, { Types } from "mongoose";

// Interface to handle the populate 'any' error
interface IPopulatedOrganization {
  _id: Types.ObjectId;
  name: string;
  code: string;
}

// Helper to ensure authorization
async function checkSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "super_admin") {
    throw new Error("Unauthorized: Super Admin access required");
  }
  return session;
}

// Helper for error message extraction
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// ----------------------------------------------------------------------
// USER MANAGEMENT ACTIONS
// ----------------------------------------------------------------------

// CREATE SINGLE USER
export async function createUser(formData: FormData) {
  await checkSuperAdmin();
  await connectDB();

  const name = formData.get("name") as string;
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "employee";

  if (!name || !email || !password) {
    return { success: false, error: "Missing required fields" };
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return { success: false, error: "Email already in use" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name: name.trim(),
    email,
    password: hashedPassword,
    role,
    isActive: true,
    onboardingCompleted: false,
    level:
      role === "org_admin"
        ? "executive"
        : role === "manager"
        ? "lead"
        : "entry",
  });

  revalidatePath("/super-admin/users");
  return { success: true, message: "User created successfully" };
}

// UPDATE USER ROLE
export async function updateUserRole(userId: string, newRole: string) {
  await checkSuperAdmin();
  await connectDB();

  const validRoles = [
    "employee",
    "team_lead",
    "manager",
    "org_admin",
    "super_admin",
  ];
  if (!validRoles.includes(newRole)) {
    return { success: false, error: "Invalid role" };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { success: false, error: "User not found" };
  }

  // Prevent removing the last super_admin
  if (user.role === "super_admin" && newRole !== "super_admin") {
    const superAdminCount = await User.countDocuments({ role: "super_admin" });
    if (superAdminCount <= 1) {
      return { success: false, error: "Cannot remove the last super admin" };
    }
  }

  await User.findByIdAndUpdate(userId, {
    role: newRole,
    level:
      newRole === "org_admin"
        ? "executive"
        : newRole === "manager"
        ? "lead"
        : "entry",
  });

  revalidatePath("/super-admin/users");
  return { success: true, message: "Role updated" };
}

// DELETE USER
export async function deleteUser(userId: string) {
  await checkSuperAdmin();
  await connectDB();

  const user = await User.findById(userId);
  if (!user) {
    return { success: false, error: "User not found" };
  }

  // Prevent deleting the last super_admin
  if (user.role === "super_admin") {
    const superAdminCount = await User.countDocuments({ role: "super_admin" });
    if (superAdminCount <= 1) {
      return { success: false, error: "Cannot delete the last super admin" };
    }
  }

  await User.findByIdAndDelete(userId);

  revalidatePath("/super-admin/users");
  return { success: true, message: "User deleted" };
}

// BULK IMPORT (GLOBAL)
export async function bulkImportUsers(emails: string[]) {
  await checkSuperAdmin();
  await connectDB();

  const results = {
    success: 0,
    duplicates: 0,
    failed: 0,
  };

  const defaultPassword = await bcrypt.hash("Thinkhall@123", 10);

  for (const rawEmail of emails) {
    const email = rawEmail.toLowerCase().trim();
    if (!email.includes("@")) continue;

    try {
      const exists = await User.findOne({ email });
      if (exists) {
        results.duplicates++;
        continue;
      }

      await User.create({
        name: email
          .split("@")[0]
          .replace(".", " ")
          .split(" ")
          .map(capitalize)
          .join(" "),
        email,
        password: defaultPassword,
        role: "employee",
        isActive: true,
        onboardingCompleted: false,
        level: "entry",
      });

      results.success++;
    } catch (err) {
      results.failed++;
      console.error(`Failed to create ${email}:`, err);
    }
  }

  revalidatePath("/super-admin/users");
  return {
    success: true,
    message: `Imported ${results.success} users`,
    results,
  };
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// GET ALL USERS (Updated to fix Type errors)
export async function getAllUsers() {
  try {
    await connectDB();

    const users = await User.find({})
      .populate("organizationId", "name code")
      .sort({ createdAt: -1 })
      .lean();

    // Convert _id and dates to strings for Next.js serialization
    const serializedUsers = users.map((user) => {
      // FIX: Cast to unknown first to avoid 'any' lint error
      const org = user.organizationId as unknown as IPopulatedOrganization;

      return {
        ...user,
        _id: user._id.toString(),
        organizationId: org
          ? {
              _id: org._id.toString(),
              name: org.name,
              code: org.code,
            }
          : null,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      };
    });

    return { success: true, data: serializedUsers };
  } catch (error) {
    console.error("Error fetching users:", error);
    // FIX: Return empty data array so the frontend doesn't receive 'undefined'
    return { success: false, error: "Failed to fetch users", data: [] };
  }
}

// ----------------------------------------------------------------------
// ORGANIZATION MANAGEMENT ACTIONS
// ----------------------------------------------------------------------

export async function getAllOrganizations() {
  await checkSuperAdmin();
  await connectDB();

  try {
    const orgs = await Organization.find({}).sort({ createdAt: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(orgs)) };
  } catch (error) {
    console.error("Get All Orgs Error:", error);
    return { success: false, error: "Failed to fetch organizations", data: [] };
  }
}

export async function createOrganizationWithUsers(formData: FormData) {
  await checkSuperAdmin();
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orgData = {
      name: formData.get("name") as string,
      code: (formData.get("code") as string).toUpperCase().trim(),
      planType: formData.get("planType") as PlanType,
      license: {
        maxUsers: Number(formData.get("maxUsers")),
        features: ["basic_skills"],
      },
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      status: "active",
      isActive: true,
      stats: { totalUsers: 0, activeUsers: 0 },
    };

    const existingOrg = await Organization.findOne({
      code: orgData.code,
    }).session(session);
    if (existingOrg) throw new Error("Organization Code already exists");

    const ownerName = formData.get("ownerName") as string;
    const ownerEmail = (formData.get("ownerEmail") as string)
      .toLowerCase()
      .trim();
    const ownerPwd = formData.get("ownerPassword") as string;
    const managerEmail = (formData.get("managerEmail") as string)
      ?.toLowerCase()
      .trim();
    const managerPwd = formData.get("managerPassword") as string;

    const emailsToCheck = [ownerEmail, managerEmail].filter(
      (e): e is string => !!e && e.length > 0
    );
    const existingEmails = await User.find({
      email: { $in: emailsToCheck },
    }).session(session);

    if (existingEmails.length > 0) {
      throw new Error(
        `Email(s) already in use: ${existingEmails
          .map((u) => u.email)
          .join(", ")}`
      );
    }

    const newOrgs = await Organization.create([orgData], { session });
    const orgId = newOrgs[0]._id;

    const hashedOwnerPwd = await bcrypt.hash(ownerPwd, 10);
    const ownerUsers = await User.create(
      [
        {
          name: ownerName,
          email: ownerEmail,
          password: hashedOwnerPwd,
          role: "org_admin",
          level: "executive",
          organizationId: orgId,
          isActive: true,
          onboardingCompleted: false,
        },
      ],
      { session }
    );

    let managerCount = 0;
    if (managerEmail && managerPwd) {
      const hashedManagerPwd = await bcrypt.hash(managerPwd, 10);
      await User.create(
        [
          {
            name: "Manager",
            email: managerEmail,
            password: hashedManagerPwd,
            role: "manager",
            level: "lead",
            organizationId: orgId,
            managerId: ownerUsers[0]._id,
            isActive: true,
            onboardingCompleted: false,
          },
        ],
        { session }
      );
      managerCount = 1;
    }

    await Organization.findByIdAndUpdate(
      orgId,
      { $inc: { "stats.totalUsers": 1 + managerCount } },
      { session }
    );

    await session.commitTransaction();
    revalidatePath("/super-admin/organizations");
    return {
      success: true,
      message: "Organization and Users created successfully",
    };
  } catch (error: unknown) {
    await session.abortTransaction();
    console.error("Create Org Error:", error);
    return {
      success: false,
      error: getErrorMessage(error) || "Failed to create organization",
    };
  } finally {
    session.endSession();
  }
}

export async function editOrganization(orgId: string, formData: FormData) {
  await checkSuperAdmin();
  await connectDB();

  try {
    const updateData = {
      name: formData.get("name"),
      planType: formData.get("planType"),
      "license.maxUsers": Number(formData.get("maxUsers")),
      endDate: new Date(formData.get("endDate") as string),
    };

    await Organization.findByIdAndUpdate(orgId, updateData);
    revalidatePath("/super-admin/organizations");
    return { success: true, message: "Organization updated" };
  } catch (error) {
    return { success: false, error: "Failed to update organization" };
  }
}

export async function deleteOrganization(orgId: string) {
  await checkSuperAdmin();
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Organization.findByIdAndDelete(orgId, { session });
    await User.deleteMany({ organizationId: orgId }, { session });
    await session.commitTransaction();
    revalidatePath("/super-admin/organizations");
    return {
      success: true,
      message: "Organization and all associated users deleted",
    };
  } catch (error) {
    await session.abortTransaction();
    return { success: false, error: "Failed to delete organization" };
  } finally {
    session.endSession();
  }
}

export async function getOrganizationMembers(orgId: string) {
  await checkSuperAdmin();
  await connectDB();
  try {
    const users = await User.find({ organizationId: orgId })
      .select("name email role isActive designation")
      .sort({ createdAt: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(users)) };
  } catch (error) {
    return { success: false, error: "Failed to fetch members" };
  }
}

export async function bulkImportUsersToOrg(
  orgId: string,
  csvData: { name: string; email: string; gender?: string; role?: string }[]
) {
  await checkSuperAdmin();
  await connectDB();

  const results = { success: 0, failed: 0, errors: [] as string[] };
  const defaultPassword = await bcrypt.hash("Thinkhall@123", 10);

  try {
    const org = await Organization.findById(orgId);
    if (!org) return { success: false, error: "Organization not found" };

    const currentCount = await User.countDocuments({ organizationId: orgId });
    if (currentCount + csvData.length > org.license.maxUsers) {
      return {
        success: false,
        error: `Import exceeds license limit (Max: ${org.license.maxUsers})`,
      };
    }

    for (const row of csvData) {
      try {
        const email = row.email.toLowerCase().trim();
        const exists = await User.findOne({ email });
        if (exists) {
          results.failed++;
          results.errors.push(`${email}: Already exists`);
          continue;
        }

        const userData: Record<string, unknown> = {
          name: row.name || email.split("@")[0],
          email: email,
          password: defaultPassword,
          role: row.role || "employee",
          organizationId: orgId,
          isActive: true,
          onboardingCompleted: false,
          level: "entry",
        };

        await User.create(userData);
        results.success++;
      } catch (err) {
        results.failed++;
        console.error(err);
      }
    }

    await Organization.findByIdAndUpdate(orgId, {
      $inc: { "stats.totalUsers": results.success },
    });
    revalidatePath("/super-admin/organizations");
    return {
      success: true,
      results,
      message: `Imported ${results.success} users successfully`,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "System error during import" };
  }
}
