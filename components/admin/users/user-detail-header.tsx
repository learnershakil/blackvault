"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserRoleBadge from "./user-role-badge";
import { formatDate } from "@/lib/utils";

interface UserDetailHeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    createdAt: string;
    _count?: {
      orders: number;
      reviews: number;
    };
  };
}

export default function UserDetailHeader({ user }: UserDetailHeaderProps) {
  const router = useRouter();
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDeactivateUser = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this user? They will no longer be able to login."
    );

    if (!confirmed) return;

    setIsDeactivating(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}/deactivate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to deactivate user");
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      console.error("Error deactivating user:", error);
      alert("Failed to deactivate user. Please try again.");
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl text-gray-500 dark:text-gray-400">
                {user.name?.[0] || user.email?.[0] || "?"}
              </div>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold mb-1">
              {user.name || "No name provided"}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{user.email || "No email"}</span>
              <span>•</span>
              <UserRoleBadge role={user.role} />
              <span>•</span>
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-semibold">
              {user._count?.orders || 0}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-semibold">
              {user._count?.reviews || 0}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Reviews
            </span>
          </div>
          <div className="ml-4">
            <Button
              variant="destructive"
              onClick={handleDeactivateUser}
              disabled={isDeactivating}
            >
              {isDeactivating ? "Processing..." : "Deactivate User"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
