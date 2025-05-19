"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  status: string;
  amount: number;
}

interface RecentOrdersProps {
  orders: Order[];
  loading?: boolean;
}

export default function RecentOrders({
  orders,
  loading = false,
}: RecentOrdersProps) {
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

  // Get background color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "refunded":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-2">
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
        <h2 className="text-lg font-medium">Recent Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 py-4">
            No recent orders to display
          </p>
        </div>
      ) : (
        <motion.div
          className="divide-y divide-gray-200 dark:divide-gray-700"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {orders.map((order) => (
            <motion.div
              key={order.id}
              variants={itemVariants}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Link href={`/admin/orders/${order.id}`} className="block">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      #{order.orderNumber}
                    </h3>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                        {order.customerName} · {order.date}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(order.amount)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="bg-gray-50 dark:bg-gray-900/30 px-6 py-3">
        <Link
          href="/admin/orders"
          className="text-sm text-primary-600 hover:text-primary-800 dark:hover:text-primary-400"
        >
          View all orders
        </Link>
      </div>
    </div>
  );
}
