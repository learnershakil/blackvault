"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  includePeriod?: boolean;
  period?: "daily" | "weekly" | "monthly";
}

export default function AnalyticsDateRangePicker({
  startDate,
  endDate,
  includePeriod = false,
  period = "daily",
}: DateRangePickerProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [dateRange, setDateRange] = useState({
    startDate: formatDateForInput(startDate),
    endDate: formatDateForInput(endDate),
  });

  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >(period);

  // Format date for input field (YYYY-MM-DD)
  function formatDateForInput(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  // Apply the date range filter
  function applyFilter() {
    const searchParams = new URLSearchParams();
    searchParams.set("startDate", dateRange.startDate);
    searchParams.set("endDate", dateRange.endDate);

    if (includePeriod) {
      searchParams.set("period", selectedPeriod);
    }

    router.push(`${pathname}?${searchParams.toString()}`);
  }

  // Quick date range selectors
  function setQuickRange(days: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setDateRange({
      startDate: formatDateForInput(start),
      endDate: formatDateForInput(end),
    });
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setQuickRange(7)}>
          Last 7 days
        </Button>
        <Button size="sm" variant="outline" onClick={() => setQuickRange(30)}>
          Last 30 days
        </Button>
        <Button size="sm" variant="outline" onClick={() => setQuickRange(90)}>
          Last 3 months
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div>
          <label
            htmlFor="startDate"
            className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 text-sm bg-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 text-sm bg-white dark:bg-gray-700"
          />
        </div>

        {includePeriod && (
          <div>
            <label
              htmlFor="period"
              className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Group By
            </label>
            <select
              id="period"
              value={selectedPeriod}
              onChange={(e) =>
                setSelectedPeriod(
                  e.target.value as "daily" | "weekly" | "monthly"
                )
              }
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 text-sm bg-white dark:bg-gray-700"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}
      </div>

      <Button onClick={applyFilter} size="sm" className="w-full">
        Apply Filter
      </Button>
    </div>
  );
}
