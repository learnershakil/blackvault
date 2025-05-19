import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserList from "@/components/admin/users/user-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management | BlackVault Admin",
  description: "Manage users, roles and permissions",
};

interface UsersPageProps {
  searchParams: {
    page?: string;
    role?: string;
    query?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button asChild>
          <Link href="/admin/users/new">Add User</Link>
        </Button>
      </div>

      <Suspense fallback={<UserListSkeleton />}>
        <UserListServer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Server component to fetch and render users
async function UserListServer({
  searchParams,
}: {
  searchParams: UsersPageProps["searchParams"];
}) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Construct the API URL with search params
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));

  if (searchParams.role) {
    queryParams.set("role", searchParams.role);
  }

  if (searchParams.query) {
    queryParams.set("query", searchParams.query);
  }

  if (searchParams.sortBy) {
    queryParams.set("sortBy", searchParams.sortBy);
    queryParams.set("sortOrder", searchParams.sortOrder || "asc");
  }

  // Fetch users from API
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL
    }/api/admin/users?${queryParams.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();

  return (
    <UserList
      initialUsers={data.users}
      pagination={{
        currentPage: page,
        totalPages: data.pagination.totalPages,
        totalUsers: data.pagination.total,
      }}
      searchParams={searchParams}
    />
  );
}

// Skeleton loader
function UserListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search and filter controls skeleton */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mb-4"></div>
        <div className="flex flex-wrap gap-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-1/4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-1/4"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-1">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex p-4 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
