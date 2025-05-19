"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/admin/search-input";
import UserRoleBadge from "@/components/admin/users/user-role-badge";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

interface UserListProps {
  initialUsers: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
  };
  searchParams: {
    page?: string;
    role?: string;
    query?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default function UserList({
  initialUsers,
  pagination,
  searchParams,
}: UserListProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState(searchParams.query || "");
  const [selectedRole, setSelectedRole] = useState(searchParams.role || "");
  const [sortBy, setSortBy] = useState(searchParams.sortBy || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.sortOrder || "desc");

  // Effect to update state when props change (for back/forward navigation)
  useEffect(() => {
    setUsers(initialUsers);
    setSearchQuery(searchParams.query || "");
    setSelectedRole(searchParams.role || "");
    setSortBy(searchParams.sortBy || "createdAt");
    setSortOrder(searchParams.sortOrder || "desc");
  }, [initialUsers, searchParams]);

  // Apply filters and navigate
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("query", searchQuery);
    }

    if (selectedRole) {
      params.set("role", selectedRole);
    }

    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.set("page", "1"); // Reset to first page on filter change

    router.push(`${pathname}?${params.toString()}`);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRole("");
    setSortBy("createdAt");
    setSortOrder("desc");
    router.push(pathname);
  };

  // Handle pagination
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams as any);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium mb-4">Filter Users</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={applyFilters}
              placeholder="Search by name or email"
            />
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split(":");
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="name:asc">Name (A-Z)</option>
              <option value="name:desc">Name (Z-A)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                {user.name?.[0] || user.email?.[0] || "?"}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {user.name || "No name provided"}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email || "No email provided"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <UserRoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {user._count?.orders || 0}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/users/${user.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium">{users.length}</span> of{" "}
                  <span className="font-medium">{pagination.totalUsers}</span>{" "}
                  users
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-3 py-2 text-sm">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-10 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No users found matching your filters
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
