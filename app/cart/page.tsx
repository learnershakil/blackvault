"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import useCartStore, { CartItem } from "@/store/cart-store";
import CartItemComponent from "@/components/cart/cart-item";

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCartStore();
  const [clientItems, setClientItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize client-side items after hydration to prevent mismatch
  useEffect(() => {
    setClientItems(items);
    setIsInitialized(true);

    // Fetch cart from server if needed
    if (items.length === 0) {
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
    }
  }, [items]);

  if (!isInitialized) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (clientItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <svg
              className="mx-auto w-16 h-16 text-gray-400 dark:text-gray-500 mb-4"
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
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Cart header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="font-medium">
                {totalItems()} item{totalItems() !== 1 ? "s" : ""} in your cart
              </h2>
              <button
                onClick={clearCart}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Clear Cart
              </button>
            </div>

            {/* Cart items list */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {clientItems.map((item) => (
                <li key={item.id} className="p-4">
                  <CartItemComponent item={item} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Shipping
                </span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Taxes</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full py-6 mb-3">Proceed to Checkout</Button>
            </Link>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By proceeding, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
