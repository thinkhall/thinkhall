import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Map roles to their default dashboard paths
const ROLE_DASHBOARDS: { [key: string]: string } = {
  super_admin: "/super-admin/dashboard",
  org_admin: "/dashboard", // Assuming /dashboard is the main org admin/employee dashboard
  manager: "/dashboard",
  team_lead: "/dashboard",
  employee: "/dashboard",
};

// Define role-based access control for specific route prefixes
const ROUTE_PROTECTION: { [key: string]: string[] } = {
  "/super-admin": ["super_admin"],
  // Example: if /admin routes are for org_admin and super_admin
  // "/admin": ["org_admin", "super_admin"],
};

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token; // The JWT token from NextAuth
    const pathname = req.nextUrl.pathname;

    // --- LOGIC FOR AUTHENTICATED USERS (when `token` exists) ---
    if (token) {
      const userRole = token.role as string;
      const targetDashboard = ROLE_DASHBOARDS[userRole];

      // 1. Redirect from /login to appropriate dashboard if already authenticated
      // This ensures authenticated users don't see the login page again.
      // We explicitly *DO NOT* include '/' here, allowing authenticated users to visit '/' if they choose.
      if (
        pathname === "/login" && // <-- ONLY CHECK FOR /login HERE
        targetDashboard &&
        pathname !== targetDashboard // Prevent infinite redirect if target is / or /login
      ) {
        console.log(
          `User '${token.email}' with role '${userRole}' redirected from '${pathname}' to '${targetDashboard}'`
        );
        return NextResponse.redirect(new URL(targetDashboard, req.url));
      }

      // 2. Check if user is active
      // Redirect to a specific page if the account is deactivated, but avoid loops.
      if (!token.isActive) {
        if (
          pathname !== "/account-deactivated" &&
          !pathname.startsWith("/api/auth") // Allow NextAuth API calls
        ) {
          console.warn(
            `Deactivated user '${token.email}' tried to access '${pathname}'. Redirecting.`
          );
          return NextResponse.redirect(
            new URL("/account-deactivated", req.url)
          );
        }
        // If already on /account-deactivated, let it pass
        return NextResponse.next();
      }

      // 3. Role-based access control for specific protected routes
      for (const routePrefix in ROUTE_PROTECTION) {
        if (pathname.startsWith(routePrefix)) {
          const allowedRoles = ROUTE_PROTECTION[routePrefix];
          if (!allowedRoles.includes(userRole)) {
            // User does not have the required role for this route prefix
            const unauthorizedRedirect = targetDashboard || "/"; // Redirect to their own dashboard or root
            console.warn(
              `Access Denied: User '${token.email}' with role '${userRole}' tried to access restricted route '${pathname}'. Redirecting to ${unauthorizedRedirect}`
            );
            return NextResponse.redirect(
              new URL(unauthorizedRedirect, req.url)
            );
          }
        }
      }
    }

    // --- DEFAULT: If no specific redirection/blocking occurred, allow the request ---
    // If we reach here, it means either:
    // - The user is authenticated, and no special middleware logic applied (proceed to page)
    // - The user is NOT authenticated, AND `callbacks.authorized` returned true (e.g., public paths like /, /login)
    return NextResponse.next();
  },
  {
    // This `callbacks.authorized` function determines if a user is authenticated *at all*
    // for a given path. If it returns `false`, `withAuth` will redirect to `pages.signIn`.
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Paths that do NOT require authentication.
        // If the user is unauthenticated and tries to access these, `authorized` returns `true`,
        // and the request proceeds to the `middleware` function (where `token` will be null).
        const publicPaths = [
          "/", // Authenticated or unauthenticated users can access the root.
          "/login",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/help",
          "/account-deactivated",
          "/api/auth", // NextAuth API endpoints must be accessible
        ];

        // If the path starts with any public path, it's authorized for anyone (authenticated or not).
        if (publicPaths.some((path) => pathname.startsWith(path))) {
          return true;
        }

        // For all other paths, a valid token is required.
        // If `!token` at this point, `withAuth` will redirect to `pages.signIn`.
        return !!token;
      },
    },
    pages: {
      signIn: "/login", // Redirect unauthenticated users to your custom login page
    },
  }
);

// Matcher configuration to specify which paths the middleware should apply to.
// Paths not matched here will not run through this middleware.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - /api/auth (NextAuth authentication routes)
     * - /api/public (your public API routes, if any)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (static assets in the public folder)
     * - /account-deactivated (needs to be excluded from general matcher to avoid loops)
     * - other truly public pages like forgot-password, etc.
     */
    "/((?!api/auth|api/public|_next/static|_next/image|favicon.ico|public|account-deactivated|forgot-password|reset-password|verify-email|help).*)",
    // Explicitly include '/' and '/login' here so the `middleware` function (the first one) runs
    // for these paths, allowing it to handle authenticated redirects away from /login.
    // If unauthenticated, `authorized` will have already allowed them for these paths.
    "/login",
    "/", // Keep '/' in matcher so the middleware function can run, but it won't redirect authenticated users away.
  ],
};
