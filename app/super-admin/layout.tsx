import Sidebar from "@/components/super-admin/Sidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* Add left margin to account for fixed sidebar */}
      <main className="ml-64 min-h-screen">{children}</main>
    </div>
  );
}
