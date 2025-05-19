import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import RevenueOverview from "@/components/admin/analytics/revenue-overview";
import TopSellingProducts from "@/components/admin/analytics/top-selling-products";
import CustomerMetrics from "@/components/admin/analytics/customer-metrics";
import AnalyticsDateRangePicker from "@/components/admin/analytics/date-range-picker";

export const metadata: Metadata = {
  title: "Sales Analytics | BlackVault Admin",
  description:
    "Sales analytics and business insights for BlackVault E-commerce",
};

export default async function AnalyticsDashboard({
  searchParams,
}: {
  searchParams: {
    startDate?: string;
    endDate?: string;
  };
}) {
  // Get date range from query parameters or use default (last 30 days)
  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate)
    : new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sales Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track revenue, products, and customer insights
          </p>
        </div>

        {/* Date Range Picker */}
        <AnalyticsDateRangePicker startDate={startDate} endDate={endDate} />
      </div>

      {/* Quick Analytics Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/analytics/revenue" className="group">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Revenue Analytics</h3>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Sales trends, revenue growth, and financial insights
            </p>
          </div>
        </Link>

        <Link href="/admin/analytics/products" className="group">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Product Performance</h3>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition-colors"
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Top products, performance metrics, and inventory analysis
            </p>
          </div>
        </Link>

        <Link href="/admin/analytics/customers" className="group">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg">Customer Insights</h3>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Customer behavior, retention, and acquisition metrics
            </p>
          </div>
        </Link>
      </div>

      {/* Overview Dashboards */}
      <div className="space-y-6">
        {/* Revenue Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Revenue Overview</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/analytics/revenue">View Detailed Report</Link>
            </Button>
          </div>

          <Suspense
            fallback={
              <div className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
            }
          >
            <RevenueOverview startDate={startDate} endDate={endDate} />
          </Suspense>
        </div>

        {/* Top Products & Customer Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Top Selling Products</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/analytics/products">View All Products</Link>
              </Button>
            </div>

            <Suspense
              fallback={
                <div className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
              }
            >
              <TopSellingProducts
                startDate={startDate}
                endDate={endDate}
                limit={5}
              />
            </Suspense>
          </div>

          {/* Customer Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Customer Metrics</h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/analytics/customers">Customer Details</Link>
              </Button>
            </div>

            <Suspense
              fallback={
                <div className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
              }
            >
              <CustomerMetrics startDate={startDate} endDate={endDate} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
