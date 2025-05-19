import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserDetailTabs from "@/components/admin/users/user-detail-tabs";
import UserDetailHeader from "@/components/admin/users/user-detail-header";

interface UserDetailPageProps {
  params: { id: string };
  searchParams: { tab?: string };
}

export async function generateMetadata({ params }: UserDetailPageProps) {
  const user = await getUserData(params.id);
  return {
    title: user
      ? `${user.name || user.email || "User"} | BlackVault Admin`
      : "User Details",
  };
}

async function getUserData(userId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/users/${userId}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default async function UserDetailPage({
  params,
  searchParams,
}: UserDetailPageProps) {
  const user = await getUserData(params.id);

  if (!user) {
    notFound();
  }

  const activeTab = searchParams.tab || "profile";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/admin/users"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <span className="sr-only">Back to Users</span>
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">User Details</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and manage user information
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link href={`/admin/users/${params.id}/activity`}>
              View Activity Log
            </Link>
          </Button>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="h-40 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        }
      >
        <UserDetailHeader user={user} />
      </Suspense>

      <UserDetailTabs id={params.id} activeTab={activeTab} />
    </div>
  );
}
