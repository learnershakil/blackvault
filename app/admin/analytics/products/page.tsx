import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnalyticsDateRangePicker from "@/components/admin/analytics/date-range-picker";
import TopSellingProducts from "@/components/admin/analytics/top-selling-products";
import ProductPerformanceTable from "@/components/admin/analytics/product-performance-table";
import CategoryPerformance from "@/components/admin/analytics/category-performance";
import InventoryStatus from "@/components/admin/analytics/inventory-status";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Performance | BlackVault Admin",
  description:
    "Product analytics and performance metrics for BlackVault E-commerce",
};

export default async function ProductAnalytics({
  searchParams,
}: {
  searchParams: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
  };
}) {
  // Get date range from query parameters or use default (last 30 days)
  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate)
    : new Date();

  const categoryId = searchParams.categoryId || undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/analytics"
              className="text-gray-500 hover:text-primary-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">Product Performance</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track top products, categories, and inventory metrics
          </p>
        </div>

        {/* Date Range Picker */}
        <AnalyticsDateRangePicker startDate={startDate} endDate={endDate} />
      </div>

      {/* Top Selling Products */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
        <Suspense
          fallback={
            <div className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
          }
        >
          <TopSellingProducts
            startDate={startDate}
            endDate={endDate}
            limit={10}
          />
        </Suspense>
      </div>

      {/* Category Performance & Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Category Performance</h2>
          <Suspense
            fallback={
              <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
            }
          >
            <CategoryPerformance startDate={startDate} endDate={endDate} />
          </Suspense>
        </div>

        {/* Inventory Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
          <Suspense
            fallback={
              <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
            }
          >
            <InventoryStatus />
          </Suspense>
        </div>
      </div>

      {/* Product Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4">
          Product Performance Details
        </h2>
        <Suspense
          fallback={
            <div className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
          }
        >
          <ProductPerformanceTable
            startDate={startDate}
            endDate={endDate}
            categoryId={categoryId}
          />
        </Suspense>
      </div>
    </div>
  );
}
