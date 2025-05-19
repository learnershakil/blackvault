"use client";

import { useEffect, useState } from "react";
import useCartStore from "@/store/cart-store";

export default function CartButton() {
  const { toggleCart, totalItems } = useCartStore();
  const [itemCount, setItemCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when item count changes
  useEffect(() => {
    const currentCount = totalItems();

    if (currentCount > itemCount) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }

    setItemCount(currentCount);
  }, [totalItems, itemCount]);

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
      aria-label="Open cart"
    >
      <svg
        className="w-6 h-6"
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

      {/* Item count badge */}
      {itemCount > 0 && (
        <span
          className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs bg-primary-600 text-white rounded-full transition-transform ${
            isAnimating ? "animate-bounce" : ""
          }`}
        >
          {itemCount}
        </span>
      )}
    </button>
  );
}
