import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfileTabs from "@/components/profile/profile-tabs";
import ProfileForm from "@/components/profile/profile-form";
import { Metadata } from "next";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "My Profile | BlackVault",
  description: "Manage your BlackVault account profile",
};

export default async function ProfilePage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/profile");
  }

  // Fetch user data including addresses
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      addresses: {
        orderBy: { isDefault: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with navigation */}
          <div className="lg:col-span-1">
            <ProfileTabs />
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">
                Personal Information
              </h2>
              <ProfileForm user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
