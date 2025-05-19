"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/admin/orders/order-status-badge";

interface OrderListProps {
  initialOrders: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
  };
}

export default function OrderList({
  initialOrders,
  pagination,
}: OrderListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for filters
  const [orders, setOrders] = useState(initialOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || ""
  );
  const [dateFilter, setDateFilter] = useState({
    start: searchParams.get("startDate") || "",
    end: searchParams.get("endDate") || "",
  });
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);

  // Handle filter changes
  useEffect(() => {
    // Construct query string based on filters
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (dateFilter.start) params.set("startDate", dateFilter.start);
    if (dateFilter.end) params.set("endDate", dateFilter.end);
    if (searchQuery) params.set("query", searchQuery);
    if (currentPage > 1) params.set("page", currentPage.toString());

    // Update URL with filters
    router.push(`/admin/orders?${params.toString()}`);

    // Optional: If you want to fetch data client-side instead of server-side
    // fetchFilteredOrders();
  }, [statusFilter, dateFilter, searchQuery, currentPage, router]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle filter reset
  const resetFilters = () => {
    setStatusFilter("");
    setDateFilter({ start: "", end: "" });
    setSearchQuery("");
    setCurrentPage(1);
    router.push("/admin/orders");
  };

  return (
    <div className="space-y-6">
      {/* Filters section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium mb-4">Order Filters</h2>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status filter */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            {/* Date range filter - Start date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-1"
              >
                From Date
              </label>
              <input
                type="date"
                id="startDate"
                value={dateFilter.start}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, start: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
              />
            </div>

            {/* Date range filter - End date */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-1"
              >
                To Date
              </label>
              <input
                type="date"
                id="endDate"
                value={dateFilter.end}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, end: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
              />
            </div>

            {/* Search query filter */}
            <div>
              <label htmlFor="query" className="block text-sm font-medium mb-1">
                Search
              </label>
              <input
                type="text"
                id="query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order # or Customer"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Filter action buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={resetFilters}>
              Reset
            </Button>
            <Button type="submit">Apply Filters</Button>
          </div>
        </form>
      </div>

      {/* Orders table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.user?.name || "Guest"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatPrice(Number(order.total))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-900/30 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === pagination.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * 10 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * 10, pagination.totalOrders)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{pagination.totalOrders}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {/* First and Previous Page */}
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    <span className="sr-only">First</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>

                  {/* Page numbers */}
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter((page) => {
                      // Show first, last, and pages around current page
                      return (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, i, filtered) => {
                      // Add ellipsis where we're skipping pages
                      const showEllipsis =
                        i > 0 && filtered[i - 1] !== page - 1;

                      return (
                        <div key={page}>
                          {showEllipsis && (
                            <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                              ...
                            </span>
                          )}
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}

                  {/* Next and Last Page */}
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium"
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium"
                    disabled={currentPage === pagination.totalPages}
                    onClick={() => setCurrentPage(pagination.totalPages)}
                  >
                    <span className="sr-only">Last</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
