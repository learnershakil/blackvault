import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfileTabs from "@/components/profile/profile-tabs";
import EmailChangeForm from "@/components/profile/email-change-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Email | BlackVault",
  description: "Update your email address",
};

export default async function EmailChangePage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/profile/email-change");
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
                Change Email Address
              </h2>
              <EmailChangeForm currentEmail={session.user.email || ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
