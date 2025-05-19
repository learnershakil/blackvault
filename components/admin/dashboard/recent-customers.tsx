"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
  avatar?: string | null;
}

interface RecentCustomersProps {
  customers: Customer[];
  loading?: boolean;
}

export default function RecentCustomers({
  customers,
  loading = false,
}: RecentCustomersProps) {
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

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mr-4"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium">Recent Customers</h2>
      </div>

      {customers.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 py-4">
            No recent customers to display
          </p>
        </div>
      ) : (
        <motion.div
          className="divide-y divide-gray-200 dark:divide-gray-700"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {customers.map((customer) => (
            <motion.div
              key={customer.id}
              variants={itemVariants}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Link
                href={`/admin/customers/${customer.id}`}
                className="flex items-center"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 overflow-hidden">
                  {customer.avatar ? (
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{customer.name.charAt(0)}</span>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {customer.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {customer.email}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {formatPrice(customer.totalSpent)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {customer.orders} orders
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="bg-gray-50 dark:bg-gray-900/30 px-6 py-3">
        <Link
          href="/admin/customers"
          className="text-sm text-primary-600 hover:text-primary-800 dark:hover:text-primary-400"
        >
          View all customers
        </Link>
      </div>
    </div>
  );
}
