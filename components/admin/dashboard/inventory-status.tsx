"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  category: string;
  image?: string;
}

interface InventoryStatusProps {
  products: Product[];
  loading?: boolean;
  lowStockThreshold?: number;
}

export default function InventoryStatus({
  products,
  loading = false,
  lowStockThreshold = 10,
}: InventoryStatusProps) {
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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Stock level indicator color
  const getStockLevelColor = (stock: number) => {
    if (stock <= 0)
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    if (stock < 5)
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    if (stock < lowStockThreshold)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mr-3"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filter to only display low stock products
  const lowStockProducts = products.filter((p) => p.stock < lowStockThreshold);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium">Inventory Status</h2>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          {lowStockProducts.length} Low Stock Items
        </span>
      </div>

      {lowStockProducts.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 py-4">
            All products have sufficient stock
          </p>
        </div>
      ) : (
        <motion.div
          className="divide-y divide-gray-200 dark:divide-gray-700"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {lowStockProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Link
                href={`/admin/products/${product.id}`}
                className="flex items-center"
              >
                <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      {product.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    SKU: {product.sku} • {product.category}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStockLevelColor(
                    product.stock
                  )}`}
                >
                  {product.stock <= 0
                    ? "Out of Stock"
                    : `${product.stock} left`}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="bg-gray-50 dark:bg-gray-900/30 px-6 py-3">
        <Link
          href="/admin/products?stock=low"
          className="text-sm text-primary-600 hover:text-primary-800 dark:hover:text-primary-400"
        >
          View all low stock products
        </Link>
      </div>
    </div>
  );
}
