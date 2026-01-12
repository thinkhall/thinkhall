// app/actions/password-reset.ts
"use server";

import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { PasswordResetToken } from "@/models/PasswordResetToken";
import { sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Generate a secure random token (not exported, internal use only)
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Generate a random temporary password (not exported, internal use only)
function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Async wrapper for generating temporary password (can be exported)
export async function generateTemporaryPassword(): Promise<string> {
  return generateTempPassword();
}

// Create reset token and send email
export async function createPasswordResetToken(
  userId: string,
  email: string,
  name: string,
  isNewUser: boolean = false
) {
  await connectDB();

  try {
    // Invalidate any existing tokens for this user
    await PasswordResetToken.updateMany(
      { userId, used: false },
      { used: true }
    );

    // Create new token
    const token = generateToken();
    const expiresAt = new Date();
    // New users get 24 hours, existing users get 1 hour
    expiresAt.setHours(expiresAt.getHours() + (isNewUser ? 24 : 1));

    await PasswordResetToken.create({
      userId,
      token,
      expiresAt,
      isNewUser,
      used: false,
    });

    // Send email
    await sendPasswordResetEmail(email, name, token, isNewUser);

    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    console.error("Error creating password reset token:", error);
    return { success: false, error: "Failed to create password reset token" };
  }
}

// Validate reset token
export async function validateResetToken(token: string) {
  await connectDB();

  try {
    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    }).populate("userId", "name email");

    if (!resetToken) {
      return { success: false, error: "Invalid or expired token" };
    }

    const user = resetToken.userId as unknown as {
      _id: string;
      name: string;
      email: string;
    };

    return {
      success: true,
      data: {
        tokenId: resetToken._id.toString(),
        userId: user._id.toString(),
        userName: user.name,
        userEmail: user.email,
        isNewUser: resetToken.isNewUser,
      },
    };
  } catch (error) {
    console.error("Error validating reset token:", error);
    return { success: false, error: "Failed to validate token" };
  }
}

// Reset password using token
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
) {
  await connectDB();

  try {
    const resetToken = await PasswordResetToken.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      return { success: false, error: "Invalid or expired token" };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password AND verify their email
    // (User proved they own the email by clicking the reset link)
    await User.findByIdAndUpdate(resetToken.userId, {
      password: hashedPassword,
      isEmailVerified: true, // FIXED: Verify email since user proved ownership
      failedLoginAttempts: 0, // Reset failed attempts
      lockUntil: undefined, // Unlock account if it was locked
    });

    // Mark token as used
    resetToken.used = true;
    await resetToken.save();

    return { success: true, message: "Password has been reset successfully" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Failed to reset password" };
  }
}

// Request password reset (for login page - anyone can request)
export async function requestPasswordReset(email: string) {
  await connectDB();

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return {
        success: true,
        message: "If an account exists, a reset email has been sent",
      };
    }

    await createPasswordResetToken(
      user._id.toString(),
      user.email,
      user.name,
      false
    );

    return {
      success: true,
      message: "If an account exists, a reset email has been sent",
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: "Failed to process request" };
  }
}
