// types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

export type UserRole =
  | "employee"
  | "team_lead"
  | "manager"
  | "org_admin"
  | "super_admin";

export type UserLevel = "entry" | "mid" | "senior" | "lead" | "executive";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      level: UserLevel;
      designation: string;
      organizationId?: string;
      departmentId?: string;
      teamId?: string;
      managerId?: string;
      isActive: boolean;
      isEmailVerified: boolean;
      onboardingCompleted: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: UserRole;
    level: UserLevel;
    designation: string;
    organizationId?: string;
    departmentId?: string;
    teamId?: string;
    managerId?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    onboardingCompleted: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    level: UserLevel;
    designation: string;
    organizationId?: string;
    departmentId?: string;
    teamId?: string;
    managerId?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    onboardingCompleted: boolean;
  }
}
