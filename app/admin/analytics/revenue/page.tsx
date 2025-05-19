import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnalyticsDateRangePicker from "@/components/admin/analytics/date-range-picker";
import RevenueChart from "@/components/admin/analytics/revenue-chart";
import OrderStatsComparison from "@/components/admin/analytics/order-stats-comparison";
import RevenueByChannel from "@/components/admin/analytics/revenue-by-channel";
import RevenueByCategory from "@/components/admin/analytics/revenue-by-category";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue Analytics | BlackVault Admin",
  description:
    "Revenue analytics and financial insights for BlackVault E-commerce",
};

export default async function RevenueAnalytics({
  searchParams,
}: {
  searchParams: {
    startDate?: string;
    endDate?: string;
    period?: string;
  };
}) {
  // Get date range from query parameters or use default (last 30 days)
  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate)
    : new Date();

  const period = searchParams.period || "daily";

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
            <h1 className="text-2xl font-bold">Revenue Analytics</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track sales performance and revenue growth
          </p>
        </div>

        {/* Date Range Picker */}
        <AnalyticsDateRangePicker
          startDate={startDate}
          endDate={endDate}
          includePeriod={true}
          period={period as "daily" | "weekly" | "monthly"}
        />
      </div>

      {/* Key Metrics Comparison */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"
              ></div>
            ))}
          </div>
        }
      >
        <OrderStatsComparison startDate={startDate} endDate={endDate} />
      </Suspense>

      {/* Revenue Over Time Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4">Revenue Trends</h2>
        <Suspense
          fallback={
            <div className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
          }
        >
          <RevenueChart
            startDate={startDate}
            endDate={endDate}
            period={period as "daily" | "weekly" | "monthly"}
          />
        </Suspense>
      </div>

      {/* Revenue By Category & Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue By Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue By Category</h2>
          <Suspense
            fallback={
              <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
            }
          >
            <RevenueByCategory startDate={startDate} endDate={endDate} />
          </Suspense>
        </div>

        {/* Revenue By Channel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Sales by Channel</h2>
          <Suspense
            fallback={
              <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
            }
          >
            <RevenueByChannel startDate={startDate} endDate={endDate} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
