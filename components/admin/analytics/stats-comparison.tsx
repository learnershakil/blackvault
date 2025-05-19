"use client";

import { motion } from "framer-motion";

interface StatsComparisonProps {
  title: string;
  currentValue: number;
  previousValue: number;
  percentChange?: number; // If not provided, will be calculated
  formatter?: (value: number) => string;
  prefix?: string;
  suffix?: string;
  positiveIsGood?: boolean; // Whether positive change is considered good
  loading?: boolean;
}

export default function StatsComparison({
  title,
  currentValue,
  previousValue,
  percentChange: externalPercentChange,
  formatter = (value) => value.toLocaleString(),
  prefix = "",
  suffix = "",
  positiveIsGood = true,
  loading = false,
}: StatsComparisonProps) {
  // Calculate percent change if not provided
  const percentChange =
    externalPercentChange !== undefined
      ? externalPercentChange
      : previousValue !== 0
      ? ((currentValue - previousValue) / previousValue) * 100
      : 0;

  const isPositive = percentChange > 0;
  const isNegative = percentChange < 0;
  const isGood =
    (isPositive && positiveIsGood) || (isNegative && !positiveIsGood);
  const isBad =
    (isPositive && !positiveIsGood) || (isNegative && positiveIsGood);

  // Format with the formatter and add prefix/suffix
  const formattedCurrent = `${prefix}${formatter(currentValue)}${suffix}`;
  const formattedPrevious = `${prefix}${formatter(previousValue)}${suffix}`;

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {title}
      </h3>

      <div className="flex items-baseline">
        <motion.p
          className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {formattedCurrent}
        </motion.p>

        {Math.abs(percentChange) > 0 && (
          <motion.span
            className={`ml-2 text-sm font-medium flex items-center ${
              isGood
                ? "text-green-600 dark:text-green-400"
                : isBad
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isPositive ? (
              <svg
                className="w-4 h-4 mr-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 mr-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            {Math.abs(percentChange).toFixed(1)}%
          </motion.span>
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Previous: {formattedPrevious}
      </p>
    </div>
  );
}
