// app/actions/super-admin.ts
"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Organization, { PlanType } from "@/models/Organization";
import mongoose, { Types } from "mongoose";
import {
  createPasswordResetToken,
  generateTemporaryPassword,
} from "./password-reset";

// Interface to handle the populate 'any' error for user organization reference
interface IPopulatedOrganizationForUser {
  _id: Types.ObjectId;
  name: string;
  code: string;
}

// Interface for organization update data
interface IOrganizationUpdateData {
  name: FormDataEntryValue | null;
  planType: FormDataEntryValue | null;
  "license.maxUsers": number;
  endDate?: Date;
}

// Interface for user update data
interface IUserUpdateData {
  name: string;
  email: string;
  role: string;
  designation: string | null;
  isActive: boolean;
  level: "entry" | "lead" | "executive";
  password?: string;
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
  if (error instanceof Error) {
    if (error instanceof mongoose.Error.CastError) {
      return `Invalid ID format for: ${error.path}`;
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    }
    return error.message;
  }
  return String(error);
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export async function getAllUsers() {
  await checkSuperAdmin();
  try {
    await connectDB();

    const users = await User.find({})
      .populate("organizationId", "name code")
      .sort({ createdAt: -1 })
      .lean();

    const serializedUsers = users.map((user) => {
      const org =
        user.organizationId as unknown as IPopulatedOrganizationForUser;

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
    return { success: false, error: "Failed to fetch users", data: [] };
  }
}

// ----------------------------------------------------------------------
// ORGANIZATION MANAGEMENT ACTIONS
// ----------------------------------------------------------------------

// NEW: Get Organization KPIs for Super Admin Dashboard
export async function getOrganizationKPIs() {
  await checkSuperAdmin();
  await connectDB();

  try {
    const kpis = await Organization.getGlobalStats();
    return {
      success: true,
      data: {
        totalOrganizations: kpis.totalOrgs,
        totalLicensedUsers: kpis.totalLicenses,
        totalUsedUsers: kpis.usedLicenses,
      },
    };
  } catch (error) {
    console.error("Error fetching organization KPIs:", error);
    return { success: false, error: "Failed to fetch KPIs" };
  }
}

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

// NEW: Get a single organization by ID
export async function getOrganizationById(orgId: string) {
  await checkSuperAdmin();
  await connectDB();
  try {
    if (!mongoose.Types.ObjectId.isValid(orgId)) {
      return { success: false, error: "Invalid organization ID" };
    }
    const org = await Organization.findById(orgId).lean();
    if (!org) {
      return { success: false, error: "Organization not found" };
    }
    return { success: true, data: JSON.parse(JSON.stringify(org)) };
  } catch (error) {
    console.error(`Error fetching organization ${orgId}:`, error);
    return {
      success: false,
      error: getErrorMessage(error) || "Failed to fetch organization",
    };
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
      primaryContact: {
        name: formData.get("ownerName") as string,
        email: (formData.get("ownerEmail") as string).toLowerCase().trim(),
        designation: "Org Admin",
      },
    };

    const existingOrg = await Organization.findOne({
      code: orgData.code,
    }).session(session);
    if (existingOrg) throw new Error("Organization Code already exists");

    const ownerName = formData.get("ownerName") as string;
    const ownerEmail = orgData.primaryContact.email;
    const ownerPwd = formData.get("ownerPassword") as string;
    const managerName = (formData.get("managerName") as string)?.trim();
    const managerEmail = (formData.get("managerEmail") as string)
      ?.toLowerCase()
      .trim();
    const managerPwd = formData.get("managerPassword") as string;

    const emailsToCheck = [ownerEmail, managerEmail].filter(
      (e): e is string => !!e && e.length > 0
    );
    const existingUsers = await User.find({
      email: { $in: emailsToCheck },
    }).session(session);

    if (existingUsers.length > 0) {
      throw new Error(
        `User(s) with these email(s) already exist: ${existingUsers
          .map((u) => u.email)
          .join(", ")}`
      );
    }

    const newOrgs = await Organization.create([orgData], { session });
    const orgId = newOrgs[0]._id;

    const hashedOwnerPwd = await bcrypt.hash(ownerPwd, 10);
    const ownerUser = await User.create(
      [
        {
          name: ownerName,
          email: ownerEmail,
          password: hashedOwnerPwd,
          role: "org_admin",
          level: "executive",
          designation: "Organization Administrator",
          organizationId: orgId,
          isActive: true,
          onboardingCompleted: false,
        },
      ],
      { session }
    );

    let usersCreatedCount = 1;
    if (managerEmail && managerPwd) {
      const hashedManagerPwd = await bcrypt.hash(managerPwd, 10);
      await User.create(
        [
          {
            name: managerName || "Manager",
            email: managerEmail,
            password: hashedManagerPwd,
            role: "manager",
            level: "lead",
            designation: "Manager",
            organizationId: orgId,
            managerId: ownerUser[0]._id,
            isActive: true,
            onboardingCompleted: false,
          },
        ],
        { session }
      );
      usersCreatedCount++;
    }

    await Organization.findByIdAndUpdate(
      orgId,
      { $inc: { "stats.totalUsers": usersCreatedCount } },
      { session }
    );

    await session.commitTransaction();
    revalidatePath("/super-admin/organizations");
    revalidatePath(`/super-admin/organizations/${orgId.toString()}`);
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
    if (!mongoose.Types.ObjectId.isValid(orgId)) {
      return { success: false, error: "Invalid organization ID" };
    }

    const updateData: IOrganizationUpdateData = {
      name: formData.get("name"),
      planType: formData.get("planType"),
      "license.maxUsers": Number(formData.get("maxUsers")),
    };

    const endDateString = formData.get("endDate") as string;
    if (endDateString) {
      updateData.endDate = new Date(endDateString);
    }

    const updatedOrg = await Organization.findByIdAndUpdate(orgId, updateData, {
      new: true,
    });
    if (!updatedOrg) {
      return { success: false, error: "Organization not found" };
    }

    revalidatePath("/super-admin/organizations");
    revalidatePath(`/super-admin/organizations/${orgId}`);
    return { success: true, message: "Organization updated" };
  } catch (error) {
    console.error("Edit Org Error:", error);
    return {
      success: false,
      error: getErrorMessage(error) || "Failed to update organization",
    };
  }
}

export async function deleteOrganization(orgId: string) {
  await checkSuperAdmin();
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!mongoose.Types.ObjectId.isValid(orgId)) {
      throw new Error("Invalid organization ID");
    }

    const deletedOrg = await Organization.findByIdAndDelete(orgId, { session });
    if (!deletedOrg) {
      throw new Error("Organization not found");
    }
    await User.deleteMany({ organizationId: orgId }, { session });

    await session.commitTransaction();
    revalidatePath("/super-admin/organizations");
    revalidatePath(`/super-admin/organizations/${orgId}`);
    return {
      success: true,
      message: "Organization and all associated users deleted",
    };
  } catch (error) {
    await session.abortTransaction();
    console.error("Delete Org Error:", error);
    return {
      success: false,
      error: getErrorMessage(error) || "Failed to delete organization",
    };
  } finally {
    session.endSession();
  }
}

export async function getUsersInOrganization(orgId: string) {
  await checkSuperAdmin();
  await connectDB();
  try {
    if (!mongoose.Types.ObjectId.isValid(orgId)) {
      return { success: false, error: "Invalid organization ID", data: [] };
    }

    const users = await User.find({ organizationId: orgId })
      .select("name email role designation isActive createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const serializedUsers = users.map((user) => ({
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
    }));

    return { success: true, data: serializedUsers };
  } catch (error) {
    console.error("Error fetching organization members:", error);
    return {
      success: false,
      error: getErrorMessage(error) || "Failed to fetch members",
      data: [],
    };
  }
}

export async function createUserInOrganization(
  orgId: string,
  formData: FormData
) {
  await checkSuperAdmin();
  await connectDB();

  const name = formData.get("name") as string;
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "employee";
  const designation = (formData.get("designation") as string)?.trim();
  const sendResetEmail = formData.get("sendResetEmail") === "true";

  if (!name || !email) {
    return {
      success: false,
      error: "Missing required fields: Name, Email",
    };
  }
  if (!mongoose.Types.ObjectId.isValid(orgId)) {
    return { success: false, error: "Invalid organization ID" };
  }

  try {
    const org = await Organization.findById(orgId);
    if (!org) return { success: false, error: "Organization not found" };

    const currentCount = await User.countDocuments({ organizationId: orgId });
    if (currentCount >= org.license.maxUsers) {
      return {
        success: false,
        error: `Cannot add user: Organization reached its license limit (${org.license.maxUsers} users).`,
      };
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return { success: false, error: `Email "${email}" already in use` };
    }

    // Determine if we should send a password reset email
    const shouldSendResetEmail = sendResetEmail || !password;

    // Use provided password or generate temporary one
    const finalPassword: string = password
      ? password
      : await generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    // If admin provides password directly (no reset email), user is pre-verified
    // If sending reset email, user will be verified when they click the link
    const isPreVerified = !shouldSendResetEmail;

    const newUser = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
      role,
      designation: designation || undefined,
      isActive: true,
      isEmailVerified: isPreVerified, // Smart verification based on flow
      onboardingCompleted: false,
      level:
        role === "org_admin"
          ? "executive"
          : role === "manager"
          ? "lead"
          : "entry",
      organizationId: orgId,
    });

    await Organization.findByIdAndUpdate(orgId, {
      $inc: { "stats.totalUsers": 1 },
    });

    // Send password reset email if needed
    if (shouldSendResetEmail) {
      await createPasswordResetToken(
        newUser._id.toString(),
        email,
        name.trim(),
        true // isNewUser
      );
    }

    revalidatePath("/super-admin/organizations");
    revalidatePath(`/super-admin/organizations/${orgId}`);
    return {
      success: true,
      message: shouldSendResetEmail
        ? "User created successfully. Password setup email sent."
        : "User created successfully",
      data: JSON.parse(JSON.stringify(newUser)),
    };
  } catch (error) {
    console.error("Create User in Org Error:", error);
    return {
      success: false,
      error: getErrorMessage(error) || "Failed to create user",
    };
  }
}

export async function updateUserInOrganization(
  userId: string,
  formData: FormData
) {
  await checkSuperAdmin();
  await connectDB();

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { success: false, error: "Invalid user ID" };
    }

    const role = formData.get("role") as string;
    const level: "entry" | "lead" | "executive" =
      role === "org_admin"
        ? "executive"
        : role === "manager"
        ? "lead"
        : "entry";

    const updateData: IUserUpdateData = {
      name: (formData.get("name") as string)?.trim(),
      email: (formData.get("email") as string)?.toLowerCase().trim(),
      role: role,
      designation: (formData.get("designation") as string)?.trim() || null,
      isActive: formData.get("isActive") === "true",
      level: level,
    };

    // Check if email is being changed and if new email is taken
    const originalUser = await User.findById(userId);
    if (!originalUser) {
      return { success: false, error: "User not found" };
    }
    if (updateData.email !== originalUser.email) {
      const emailExists = await User.findOne({ email: updateData.email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return {
          success: false,
          error: `Email "${updateData.email}" already in use by another user`,
        };
      }
    }

    // Passwords are handled separately or omitted if not provided
    const password = formData.get("password") as string;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).lean();
    if (!updatedUser) {
      return { success: false, error: "User not found after update attempt" };
    }

    // If isActive status changed, update organization's activeUsers count
    if (originalUser.isActive !== updatedUser.isActive) {
      if (updatedUser.isActive) {
        await Organization.findByIdAndUpdate(originalUser.organizationId, {
          $inc: { "stats.activeUsers": 1 },
        });
      } else {
        await Organization.findByIdAndUpdate(originalUser.organizationId, {
          $inc: { "stats.activeUsers": -1 },
        });
      }
    }

    revalidatePath("/super-admin/organizations");
    revalidatePath(
      `/super-admin/organizations/${originalUser.organizationId?.toString()}`
    );
    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    console.error("Update User in Org Error:", error);
    return {
      success: false,
      error: getErrorMessage(error) || "Failed to update user",
    };
  }
}

export async function deleteUserFromOrganization(userId: string) {
  await checkSuperAdmin();
  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error("User not found");
    }

    const orgId = user.organizationId;

    if (user.role === "org_admin" && orgId) {
      const orgAdminCount = await User.countDocuments({
        organizationId: orgId,
        role: "org_admin",
        _id: { $ne: user._id },
      }).session(session);
      if (orgAdminCount < 1) {
        throw new Error("Cannot delete the last Organization Admin");
      }
    }

    await User.findByIdAndDelete(userId, { session });

    if (orgId) {
      await Organization.findByIdAndUpdate(
        orgId,
        {
          $inc: {
            "stats.totalUsers": -1,
            "stats.activeUsers": user.isActive ? -1 : 0,
          },
        },
        { session }
      );
    }

    await session.commitTransaction();
    revalidatePath("/super-admin/organizations");
    if (orgId) revalidatePath(`/super-admin/organizations/${orgId.toString()}`);
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    await session.abortTransaction();
    console.error("Delete User in Org Error:", error);
    return {
      success: false,
      error: getErrorMessage(error) || "Failed to delete user",
    };
  } finally {
    session.endSession();
  }
}

// Bulk Import Users to Organization with Password Reset Emails
export async function bulkImportUsersToOrg(
  orgId: string,
  csvData: {
    name: string;
    email: string;
    role?: string;
    designation?: string;
  }[]
) {
  await checkSuperAdmin();
  await connectDB();

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
    emailsSent: 0,
  };

  try {
    if (!mongoose.Types.ObjectId.isValid(orgId)) {
      throw new Error("Invalid organization ID");
    }
    const org = await Organization.findById(orgId);
    if (!org) throw new Error("Organization not found");

    const currentCount = await User.countDocuments({ organizationId: orgId });
    const availableSlots = org.license.maxUsers - currentCount;
    if (availableSlots <= 0) {
      return {
        success: false,
        error: `Organization has reached its user limit (${org.license.maxUsers}). No new users can be imported.`,
        results,
      };
    }

    const usersToImport = csvData.filter((row, index) => {
      if (index < availableSlots) {
        return true;
      } else {
        results.errors.push(
          `${row.email || row.name || "Unknown"}: Exceeded license limit.`
        );
        results.failed++;
        return false;
      }
    });

    if (usersToImport.length === 0) {
      return {
        success: false,
        error:
          usersToImport.length === 0 && results.failed > 0
            ? `No users could be imported. ${results.errors.join("; ")}`
            : "No valid users provided for import.",
        results,
      };
    }

    for (const row of usersToImport) {
      const email = row.email.toLowerCase().trim();
      if (!email || !email.includes("@")) {
        results.failed++;
        results.errors.push(`${row.name || "Unknown"}: Invalid email format`);
        continue;
      }

      const exists = await User.findOne({ email });
      if (exists) {
        results.failed++;
        results.errors.push(`${email}: User with this email already exists`);
        continue;
      }

      const role = row.role?.toLowerCase() || "employee";
      const validRoles = ["employee", "team_lead", "manager", "org_admin"];
      const finalRole = validRoles.includes(role) ? role : "employee";

      const tempPassword: string = await generateTemporaryPassword();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const userName =
        row.name || email.split("@")[0].split(".").map(capitalize).join(" ");

      try {
        const newUser = await User.create({
          name: userName,
          email: email,
          password: hashedPassword,
          role: finalRole,
          designation: row.designation?.trim() || undefined,
          organizationId: orgId,
          isActive: true,
          isEmailVerified: false, // Will be verified when they reset password
          onboardingCompleted: false,
          level:
            finalRole === "org_admin"
              ? "executive"
              : finalRole === "manager"
              ? "lead"
              : "entry",
        });

        results.success++;

        // Send password setup email - when they complete this, isEmailVerified = true
        try {
          await createPasswordResetToken(
            newUser._id.toString(),
            email,
            userName,
            true
          );
          results.emailsSent++;
        } catch (emailError) {
          console.error(`Failed to send email to ${email}:`, emailError);
          results.errors.push(
            `${email}: User created but email failed to send`
          );
        }
      } catch (createError) {
        results.failed++;
        results.errors.push(`${email}: Failed to create user`);
        console.error(`Failed to create user ${email}:`, createError);
      }
    }

    if (results.success > 0) {
      await Organization.findByIdAndUpdate(orgId, {
        $inc: {
          "stats.totalUsers": results.success,
          "stats.activeUsers": results.success,
        },
      });
    }

    revalidatePath("/super-admin/organizations");
    revalidatePath(`/super-admin/organizations/${orgId}`);
    return {
      success: results.success > 0,
      results,
      message:
        results.success > 0
          ? `Successfully imported ${results.success} users. ${results.emailsSent} password setup emails sent.`
          : "No users were imported.",
    };
  } catch (error) {
    console.error("System error during bulk import:", error);
    return {
      success: false,
      error: getErrorMessage(error) || "System error during import",
      results,
    };
  }
}

// Super Admin - Reset user password (sends email)
export async function adminResetUserPassword(userId: string) {
  await checkSuperAdmin();
  await connectDB();

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { success: false, error: "Invalid user ID" };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Generate temporary password and update user (AWAIT the async function)
    const tempPassword: string = await generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    // Send password reset email
    await createPasswordResetToken(
      userId,
      user.email,
      user.name,
      false // not a new user
    );

    revalidatePath("/super-admin/users");
    revalidatePath("/super-admin/organizations");
    if (user.organizationId) {
      revalidatePath(
        `/super-admin/organizations/${user.organizationId.toString()}`
      );
    }

    return {
      success: true,
      message: `Password reset email sent to ${user.email}`,
    };
  } catch (error) {
    console.error("Admin Reset Password Error:", error);
    return {
      success: false,
      error: getErrorMessage(error) || "Failed to reset password",
    };
  }
}
