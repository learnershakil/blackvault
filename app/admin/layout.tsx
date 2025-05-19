import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check for authentication and admin role
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    // Redirect non-admins to the home page
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={session.user} />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
