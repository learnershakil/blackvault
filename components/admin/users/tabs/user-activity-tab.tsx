"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";

interface UserActivityTabProps {
  userId: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export default function UserActivityTab({ userId }: UserActivityTabProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUserActivity(1);
  }, [userId]);

  async function fetchUserActivity(pageNum: number) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/admin/users/${userId}/activity?page=${pageNum}`
      );

      if (!response.ok) throw new Error("Failed to fetch user activity");

      const data = await response.json();

      if (pageNum === 1) {
        setActivities(data.activities);
      } else {
        setActivities((prev) => [...prev, ...data.activities]);
      }

      setHasMore(data.pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      setError("Failed to load activity logs");
    } finally {
      setIsLoading(false);
    }
  }

  const loadMore = () => {
    if (hasMore && !isLoading) {
      fetchUserActivity(page + 1);
    }
  };

  function getActivityIcon(entityType: string) {
    switch (entityType) {
      case "ORDER":
        return (
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
            <svg
              className="w-4 h-4 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        );
      case "PRODUCT":
        return (
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <svg
              className="w-4 h-4 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10"
              />
            </svg>
          </div>
        );
      case "AUTH":
        return (
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
            <svg
              className="w-4 h-4 text-purple-600 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
        );
      case "PROFILE":
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
            <svg
              className="w-4 h-4 text-yellow-600 dark:text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
            <svg
              className="w-4 h-4 text-gray-600 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  if (isLoading && activities.length === 0) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">User Activity Log</h3>

      {activities.length === 0 ? (
        <p className="py-8 text-center text-gray-500 dark:text-gray-400">
          No activity logs found for this user
        </p>
      ) : (
        <div className="space-y-4">
          <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
            {activities.map((activity) => (
              <div key={activity.id} className="relative mb-8 last:mb-0">
                <div className="absolute -left-[25px]">
                  {getActivityIcon(activity.entityType)}
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(activity.createdAt, true)}
                    </span>
                  </div>

                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                    {activity.entityType}
                    {activity.entityId && (
                      <span className="text-xs ml-1 text-gray-500">
                        (ID: {activity.entityId})
                      </span>
                    )}
                  </p>

                  {activity.metadata && (
                    <div className="mt-2 p-2 bg-white dark:bg-gray-800 text-xs border border-gray-200 dark:border-gray-700 rounded">
                      <pre className="overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(activity.metadata, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {activity.ipAddress && (
                      <div>IP Address: {activity.ipAddress}</div>
                    )}
                    {activity.userAgent && (
                      <div>
                        User Agent:{" "}
                        <span className="truncate">{activity.userAgent}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
