"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DataPoint {
  label: string;
  value: number;
}

interface RevenueChartProps {
  data: DataPoint[];
  title?: string;
  loading?: boolean;
  period?: "daily" | "weekly" | "monthly";
  onPeriodChange?: (period: "daily" | "weekly" | "monthly") => void;
}

export default function RevenueChart({
  data,
  title = "Revenue",
  loading = false,
  period = "weekly",
  onPeriodChange,
}: RevenueChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Find max value for chart scaling
  const maxValue = Math.max(...data.map((d) => d.value), 0);

  // Get height percentage for a bar
  const getBarHeight = (value: number) => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 100;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="p-6">
          <div className="h-64 w-full bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between">
        <h2 className="text-lg font-medium">{title}</h2>

        {/* Period selector */}
        {onPeriodChange && (
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => onPeriodChange("daily")}
              className={`px-2 py-1 rounded ${
                period === "daily"
                  ? "bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => onPeriodChange("weekly")}
              className={`px-2 py-1 rounded ${
                period === "weekly"
                  ? "bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => onPeriodChange("monthly")}
              className={`px-2 py-1 rounded ${
                period === "monthly"
                  ? "bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50"
              }`}
            >
              Monthly
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              No revenue data available
            </p>
          </div>
        ) : (
          <div className="h-64" ref={chartRef}>
            <div className="flex justify-between h-full">
              {data.map((d, i) => {
                const barHeight = getBarHeight(d.value);

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ width: `${100 / data.length}%` }}
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    {hoveredBar === i && (
                      <div className="mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded">
                        ${d.value.toLocaleString()}
                      </div>
                    )}

                    {/* Bar */}
                    <div className="w-full h-[calc(100%-30px)] flex items-end">
                      <motion.div
                        className="w-[60%] mx-auto bg-primary-400 dark:bg-primary-600 rounded-t hover:bg-primary-500 dark:hover:bg-primary-500"
                        style={{ height: `${barHeight}%` }}
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeight}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    {/* Label */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {d.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
