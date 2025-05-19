"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import useCartStore from "@/store/cart-store";

export default function CartButton() {
  const { totalItems } = useCartStore();
  const [itemCount, setItemCount] = useState(0);

  // Use client-side state to prevent hydration mismatch
  useEffect(() => {
    setItemCount(totalItems());
  }, [totalItems]);

  return (
    <Link href="/cart">
      <motion.div
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>

        {itemCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
}
