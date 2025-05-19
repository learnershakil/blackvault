"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface QuickAction {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  bgColor: string;
}

interface QuickActionsProps {
  title?: string;
}

export default function QuickActions({
  title = "Quick Actions",
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      name: "Add Product",
      description: "Create a new product listing",
      href: "/admin/products/new",
      icon: (
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      bgColor:
        "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400",
    },
    {
      name: "Manage Orders",
      description: "View and process customer orders",
      href: "/admin/orders",
      icon: (
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
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      bgColor:
        "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
    },
    {
      name: "Manage Coupons",
      description: "Create and edit promotions",
      href: "/admin/coupons",
      icon: (
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
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
      bgColor:
        "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
    },
    {
      name: "Manage Categories",
      description: "Organize your product catalog",
      href: "/admin/products/categories",
      icon: (
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      bgColor:
        "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400",
    },
    {
      name: "Banner Management",
      description: "Update promotional banners",
      href: "/admin/banners",
      icon: (
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      bgColor:
        "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
    },
    {
      name: "View Reports",
      description: "Analyze sales and performance",
      href: "/admin/analytics",
      icon: (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      bgColor: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium">{title}</h2>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {actions.map((action, index) => (
          <motion.div
            key={action.name}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            whileTap={{ y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={action.href}
              className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${action.bgColor} mr-4`}
              >
                {action.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {action.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
