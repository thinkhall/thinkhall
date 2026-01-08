"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 1. Exact paths where Nav/Footer should be hidden (Auth pages)
  const exactHiddenPaths = [
    "/login",
    "/register",
    "/signup",
    "/forgot-password",
  ];

  // 2. URL prefixes where Nav/Footer should be hidden (Dashboards)
  // Using prefixes ensures sub-pages (e.g., /employee/dashboard/settings) also hide them.
  const hiddenPrefixes = [
    "/super-admin",
    "/admin",
    "/manager",
    "/team-lead",
    "/employee",
  ];

  // Check if current path is an exact match OR starts with a hidden prefix
  const shouldHideLayout =
    exactHiddenPaths.includes(pathname) ||
    hiddenPrefixes.some((prefix) => pathname.startsWith(prefix));

  return (
    <>
      {!shouldHideLayout && <Navigation />}
      {children}
      {!shouldHideLayout && <Footer />}
    </>
  );
}
