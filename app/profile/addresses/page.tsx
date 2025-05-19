import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfileTabs from "@/components/profile/profile-tabs";
import AddressList from "@/components/profile/address-list";
import AddressForm from "@/components/profile/address-form";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Addresses | BlackVault",
  description: "Manage your shipping and billing addresses",
};

export default async function AddressesPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/profile/addresses");
  }

  // Fetch user addresses
  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

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
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">My Addresses</h2>

              {addresses.length > 0 ? (
                <AddressList initialAddresses={addresses} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  You don't have any saved addresses yet.
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
              <AddressForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
