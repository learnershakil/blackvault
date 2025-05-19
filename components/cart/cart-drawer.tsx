"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import useCartStore from "@/store/cart-store";
import CartItem from "@/components/cart/cart-item";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { isOpen, closeCart, items, totalItems, totalPrice, isLoading } =
    useCartStore();

  // Close cart on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeCart]);

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Load cart from database when component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart");
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            useCartStore.getState().setCart(data.items);
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  return (
    <div>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 shadow-xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Your Cart ({totalItems()})</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            aria-label="Close cart"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Cart content */}
        <div className="flex flex-col h-[calc(100%-160px)] overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <svg
                className="w-16 h-16 mb-4"
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
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm">
                Looks like you haven't added any products yet.
              </p>
              <Button onClick={closeCart} variant="outline" className="mt-6">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer with totals and checkout button */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="font-medium">{formatPrice(totalPrice())}</span>
            </div>
            <div className="flex justify-between mb-4 font-semibold">
              <span>Total</span>
              <span>{formatPrice(totalPrice())}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}>
              <Button className="w-full py-6">Proceed to Checkout</Button>
            </Link>
            <button
              onClick={closeCart}
              className="w-full mt-2 text-sm text-primary-600 dark:text-primary-400 text-center hover:underline"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
