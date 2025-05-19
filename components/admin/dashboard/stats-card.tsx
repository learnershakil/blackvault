"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  href?: string;
  bgColor?: string;
  changeTimeframe?: string;
  loading?: boolean;
}

export default function StatsCard({
  title,
  value,
  change,
  icon,
  href,
  bgColor = "bg-primary-500",
  changeTimeframe = "from last month",
  loading = false,
}: StatsCardProps) {
  // Animation variants
  const cardVariants = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: {
      y: -5,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
  };

  // Determine if change is positive, negative, or neutral
  let changeColor = "text-gray-500 dark:text-gray-400";
  let changeIcon = null;
  if (change) {
    if (change > 0) {
      changeColor = "text-green-600 dark:text-green-400";
      changeIcon = (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M11.47 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 9.31 8.78 12.53a.75.75 0 01-1.06-1.06l3.75-3.75z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (change < 0) {
      changeColor = "text-red-600 dark:text-red-400";
      changeIcon = (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12.53 16.28a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06L12 14.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  }

  // Wrapper component will be different based on if we have a link
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      return (
        <Link href={href} className="block h-full">
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  };

  return (
    <Wrapper>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover={href ? "hover" : undefined}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
            ) : (
              <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                {value}
              </p>
            )}

            {typeof change !== "undefined" && !loading && (
              <p className={`text-xs flex items-center mt-1 ${changeColor}`}>
                {changeIcon}
                <span className="mx-1">{Math.abs(change)}%</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {changeTimeframe}
                </span>
              </p>
            )}
          </div>
          <div
            className={`h-12 w-12 rounded-full ${bgColor} bg-opacity-20 flex items-center justify-center text-${
              bgColor.split("-")[1]
            }-600 dark:text-${bgColor.split("-")[1]}-400`}
          >
            {icon}
          </div>
        </div>
      </motion.div>
    </Wrapper>
  );
}
