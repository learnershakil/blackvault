"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCouponDiscount, getCouponStatus } from "@/lib/coupon-utils";

export const metadata = {
  title: "Manage Coupons | BlackVault Admin",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);

  // Fetch coupons on component mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        // Construct query parameters
        const params = new URLSearchParams();
        if (activeFilter !== null) {
          params.append("active", activeFilter.toString());
        }
        if (searchQuery) {
          params.append("code", searchQuery);
        }

        const response = await fetch(`/api/coupons?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch coupons");
        }

        const data = await response.json();
        setCoupons(data);
      } catch (err: any) {
        console.error("Error fetching coupons:", err);
        setError(err.message || "Failed to load coupons");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, [searchQuery, activeFilter]);

  // Handle coupon deletion
  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) {
      return;
    }

    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete coupon");
      }

      // Filter out the deleted coupon
      setCoupons((prevCoupons) =>
        prevCoupons.filter((coupon) => coupon.id !== id)
      );
    } catch (err: any) {
      console.error("Error deleting coupon:", err);
      alert(err.message || "Failed to delete coupon");
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setSearchQuery(formData.get("query") as string);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupon Codes</h1>
        <Link href="/admin/coupons/new">
          <Button>Add New Coupon</Button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <form className="flex gap-4" onSubmit={handleSearch}>
          <div className="flex-1">
            <input
              type="text"
              name="query"
              placeholder="Search by coupon code..."
              defaultValue={searchQuery}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <Button type="submit">Search</Button>
          <div className="flex items-center gap-2">
            <select
              value={
                activeFilter === null ? "" : activeFilter ? "true" : "false"
              }
              onChange={(e) => {
                const value = e.target.value;
                setActiveFilter(value === "" ? null : value === "true");
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </form>
      </div>

      {error ? (
        <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valid Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Uses
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {coupon.code}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {coupon.description || "No description"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {formatCouponDiscount(coupon)}
                        </span>
                        {coupon.minPurchase && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Min: ${coupon.minPurchase}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {new Date(coupon.startDate).toLocaleDateString()} -
                          <br />
                          {new Date(coupon.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              coupon.isActive
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
                            }`}
                        >
                          {getCouponStatus(coupon)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {coupon.usesCount}
                          {coupon.maxUses && ` / ${coupon.maxUses}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/coupons/${coupon.id}`}
                          className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 mr-3"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      {searchQuery || activeFilter !== null ? (
                        <div>
                          <p className="mb-2">
                            No coupons found matching your criteria
                          </p>
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setActiveFilter(null);
                            }}
                            className="text-primary-600 hover:text-primary-800 dark:hover:text-primary-400"
                          >
                            Clear filters
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="mb-2">No coupons yet</p>
                          <Link
                            href="/admin/coupons/new"
                            className="text-primary-600 hover:text-primary-800 dark:hover:text-primary-400"
                          >
                            Create your first coupon
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
