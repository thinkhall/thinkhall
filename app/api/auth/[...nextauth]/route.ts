// app/api/auth/[...nextauth]/route.ts

import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { User } from "@/models/User"; // Removed type IUser import to avoid conflicts if not needed here

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please provide email and password");
        }

        await connectDB();

        const inputEmail = credentials.email.toLowerCase().trim();
        const superAdminEmail =
          process.env.SUPER_ADMIN_EMAIL?.toLowerCase().trim();
        const superAdminPass = process.env.SUPER_ADMIN_PASSWORD;

        // ============================================================
        // 1. SUPER ADMIN BYPASS / AUTO-CREATION LOGIC
        // ============================================================
        if (superAdminEmail && inputEmail === superAdminEmail) {
          // Verify against the ENV password first
          if (credentials.password !== superAdminPass) {
            // Optional: You could allow them to fall through to check DB password
            // but usually, if matching env email, force env password for security
            throw new Error("Invalid super admin password");
          }

          // Check if Super Admin exists in DB
          let user = await User.findOne({ email: inputEmail });

          if (!user) {
            console.log(
              "⚡ Super Admin not found in DB. Creating automatically..."
            );

            // Hash the env password so it's stored securely
            const hashedPassword = await bcrypt.hash(superAdminPass!, 10);

            // Create the user
            user = await User.create({
              name: "Super Admin",
              email: inputEmail,
              password: hashedPassword,
              role: "super_admin",
              level: "executive",
              designation: "System Administrator",
              isActive: true,
              isEmailVerified: true,
              onboardingCompleted: true,
              preferences: {
                emailNotifications: true,
                pushNotifications: true,
                language: "en",
                timezone: "UTC", // or your default
              },
            });
            console.log("✅ Super Admin account created successfully.");
          } else {
            // If user exists, ensure they have the role (fix role if it was changed manually)
            if (user.role !== "super_admin") {
              await User.findByIdAndUpdate(user._id, { role: "super_admin" });
              user.role = "super_admin";
            }
          }

          // Return session user immediately
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar || null,
            role: "super_admin",
            level: user.level,
            designation: user.designation || "",
            organizationId: user.organizationId?.toString(),
            departmentId: user.departmentId?.toString(),
            teamId: user.teamId?.toString(),
            managerId: user.managerId?.toString(),
            isActive: true,
            isEmailVerified: true,
            onboardingCompleted: true,
          };
        }

        // ============================================================
        // 2. STANDARD USER LOGIN LOGIC
        // ============================================================

        // Find user with password field included
        const user = await User.findOne({
          email: inputEmail,
        }).select("+password");

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Check if account is locked
        if (user.isLocked) {
          throw new Error(
            "Account is locked due to multiple failed attempts. Please contact your administrator."
          );
        }

        // Check if user is active
        if (!user.isActive) {
          throw new Error(
            "Your account has been deactivated. Please contact your administrator."
          );
        }

        // Check if email is verified (skip for admins)
        if (
          !user.isEmailVerified &&
          !["org_admin", "super_admin"].includes(user.role)
        ) {
          throw new Error(
            "Please verify your email before logging in. Check your inbox for verification link."
          );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password!
        );

        if (!isValidPassword) {
          // Increment failed login attempts
          await user.incrementLoginAttempts();

          const attemptsLeft = 5 - (user.failedLoginAttempts + 1);
          if (attemptsLeft > 0) {
            throw new Error(
              `Invalid email or password. ${attemptsLeft} attempts remaining.`
            );
          } else {
            throw new Error("Account locked due to multiple failed attempts.");
          }
        }

        // Reset login attempts on successful login
        await user.resetLoginAttempts();

        // Update last login
        await User.findByIdAndUpdate(user._id, {
          lastLoginAt: new Date(),
          lastActivityAt: new Date(),
        });

        // Return user object
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.avatar || null,
          role: user.role,
          level: user.level,
          designation: user.designation || "",
          organizationId: user.organizationId?.toString(),
          departmentId: user.departmentId?.toString(),
          teamId: user.teamId?.toString(),
          managerId: user.managerId?.toString(),
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          onboardingCompleted: user.onboardingCompleted,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.level = user.level;
        token.designation = user.designation;
        token.organizationId = user.organizationId;
        token.departmentId = user.departmentId;
        token.teamId = user.teamId;
        token.managerId = user.managerId;
        token.isActive = user.isActive;
        token.isEmailVerified = user.isEmailVerified;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.level = token.level;
        session.user.designation = token.designation;
        session.user.organizationId = token.organizationId;
        session.user.departmentId = token.departmentId;
        session.user.teamId = token.teamId;
        session.user.managerId = token.managerId;
        session.user.isActive = token.isActive;
        session.user.isEmailVerified = token.isEmailVerified;
        session.user.onboardingCompleted = token.onboardingCompleted;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // 1. If callback is the login page itself, send to dashboard
      if (url.includes("/login")) {
        return `${baseUrl}/dashboard`;
      }

      // 2. Default NextAuth logic
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
  },

  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email} with role: ${user.role}`);
    },
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
