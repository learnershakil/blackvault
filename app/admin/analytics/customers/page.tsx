import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnalyticsDateRangePicker from "@/components/admin/analytics/date-range-picker";
import CustomerAcquisition from "@/components/admin/analytics/customer-acquisition";
import CustomerRetention from "@/components/admin/analytics/customer-retention";
import TopCustomers from "@/components/admin/analytics/top-customers";
import CustomerSegmentation from "@/components/admin/analytics/customer-segmentation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Insights | BlackVault Admin",
  description: "Customer analytics and insights for BlackVault E-commerce",
};

export default async function CustomerAnalytics({
  searchParams,
}: {
  searchParams: {
    startDate?: string;
    endDate?: string;
  };
}) {
  // Get date range from query parameters or use default (last 6 months)
  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate)
    : new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);

  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate)
    : new Date();

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
            <h1 className="text-2xl font-bold">Customer Insights</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track customer behavior, retention, and acquisition
          </p>
        </div>

        {/* Date Range Picker */}
        <AnalyticsDateRangePicker startDate={startDate} endDate={endDate} />
      </div>

      {/* Customer Acquisition */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4">Customer Acquisition</h2>
        <Suspense
          fallback={
            <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
          }
        >
          <CustomerAcquisition startDate={startDate} endDate={endDate} />
        </Suspense>
      </div>

      {/* Customer Retention & Segmentation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Retention */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Retention</h2>
          <Suspense
            fallback={
              <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
            }
          >
            <CustomerRetention startDate={startDate} endDate={endDate} />
          </Suspense>
        </div>

        {/* Customer Segmentation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Segmentation</h2>
          <Suspense
            fallback={
              <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
            }
          >
            <CustomerSegmentation startDate={startDate} endDate={endDate} />
          </Suspense>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4">Top Customers</h2>
        <Suspense
          fallback={
            <div className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
          }
        >
          <TopCustomers startDate={startDate} endDate={endDate} />
        </Suspense>
      </div>
    </div>
  );
}
