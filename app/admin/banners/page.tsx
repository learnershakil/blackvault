"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  position: string;
  imageUrl: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  priority: number;
  createdAt: string;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all"); // "all", "active", "inactive"
  const [position, setPosition] = useState<string>(""); // filter by position

  // Fetch banners on component mount and when filters change
  useEffect(() => {
    const fetchBanners = async () => {
      setIsLoading(true);
      try {
        // Prepare query parameters
        const params = new URLSearchParams();

        if (filter === "active") {
          params.append("active", "true");
        }

        if (position) {
          params.append("position", position);
        }

        const response = await fetch(`/api/admin/banners?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }

        const data = await response.json();
        setBanners(data);
      } catch (err: any) {
        console.error("Error fetching banners:", err);
        setError(err.message || "Failed to load banners");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, [filter, position]);

  // Handle deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }

      // Remove from state
      setBanners(banners.filter((banner) => banner.id !== id));
    } catch (err: any) {
      console.error("Error deleting banner:", err);
      alert(err.message || "Failed to delete banner");
    }
  };

  // Toggle banner active status
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update banner");
      }

      // Update status in state
      setBanners(
        banners.map((banner) =>
          banner.id === id ? { ...banner, isActive: !currentStatus } : banner
        )
      );
    } catch (err: any) {
      console.error("Error updating banner:", err);
      alert(err.message || "Failed to update banner");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Check if banner is active based on dates
  const isCurrentlyActive = (banner: Banner) => {
    const now = new Date();
    const startDate = new Date(banner.startDate);
    const endDate = new Date(banner.endDate);

    return banner.isActive && now >= startDate && now <= endDate;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Manage Banners</h1>
        <Link href="/admin/banners/new">
          <Button>Add New Banner</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium mb-1"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
            >
              <option value="all">All Banners</option>
              <option value="active">Active Only</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="position-filter"
              className="block text-sm font-medium mb-1"
            >
              Position
            </label>
            <select
              id="position-filter"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
            >
              <option value="">All Positions</option>
              <option value="HERO">Hero</option>
              <option value="FEATURED">Featured</option>
              <option value="SIDEBAR">Sidebar</option>
              <option value="POPUP">Popup</option>
              <option value="NOTIFICATION">Notification</option>
            </select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-md">
          {error}
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No banners found
          </p>
          <Link href="/admin/banners/new">
            <Button variant="outline">Create Your First Banner</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Banner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valid Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {banners.map((banner) => (
                  <tr
                    key={banner.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/10"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                          {banner.imageUrl && (
                            <img
                              src={banner.imageUrl}
                              alt={banner.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {banner.title}
                          </div>
                          {banner.subtitle && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {banner.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                        {banner.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(banner.startDate)} -{" "}
                        {formatDate(banner.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(banner.id, banner.isActive)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ease-in-out duration-200 ${
                          isCurrentlyActive(banner)
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`${
                            isCurrentlyActive(banner)
                              ? "translate-x-6"
                              : "translate-x-1"
                          } inline-block w-4 h-4 transform bg-white rounded-full transition ease-in-out duration-200`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/banners/${banner.id}`}
                        className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
