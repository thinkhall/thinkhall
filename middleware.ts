// middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ROLE_ROUTES = {
  "/super-admin": ["super_admin"],
  "/admin": ["org_admin", "super_admin"],
  "/manager": ["manager", "org_admin", "super_admin"],
  "/team-lead": ["team_lead", "manager", "org_admin", "super_admin"],
  "/employee": ["employee", "team_lead", "manager", "org_admin", "super_admin"],
};

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Check if user is active
    if (token && !token.isActive) {
      return NextResponse.redirect(new URL("/account-deactivated", req.url));
    }

    // Check role-based access
    for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(route)) {
        if (!token?.role || !allowedRoles.includes(token.role as string)) {
          return NextResponse.redirect(new URL("/login", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes that don't require authentication
        const publicPaths = [
          "/",
          "/login",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/help",
          "/account-deactivated",
        ];

        if (publicPaths.some((path) => pathname.startsWith(path))) {
          return true;
        }

        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|api/public|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
