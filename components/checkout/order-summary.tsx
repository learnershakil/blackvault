"use client";

import Link from "next/link";
import { CartItem } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  total: number;
  editable?: boolean;
}

export default function OrderSummary({
  items,
  subtotal,
  shipping = 0,
  tax = 0,
  discount = 0,
  total,
  editable = true,
}: OrderSummaryProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-medium">Order Summary</h2>
      </div>

      {/* Items list */}
      <div className="p-4 divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
          <div key={item.id} className="flex py-3 gap-3">
            {/* Small image container */}
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded flex-shrink-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  {item.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Item details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <div className="flex-1 min-w-0">
                  {editable ? (
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 truncate"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium truncate">{item.name}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Qty: {item.quantity}{" "}
                    {item.variantSku && `(SKU: ${item.variantSku})`}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cost breakdown */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2 flex justify-between font-medium">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
