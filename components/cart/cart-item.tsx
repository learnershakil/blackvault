"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/store/cart-store";
import useCartStore from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
  showControls?: boolean;
}

export default function CartItem({ item, showControls = true }: CartItemProps) {
  const { updateItemQuantity, removeItem } = useCartStore();

  return (
    <li className="flex gap-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      {/* Product image */}
      <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 80px) 100vw, 80px"
            className="object-cover rounded"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            {item.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productId}`}
          className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2"
        >
          {item.name}
        </Link>

        {item.variantSku && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SKU: {item.variantSku}
          </p>
        )}

        <div className="mt-1 flex items-center justify-between">
          <span className="font-medium">{formatPrice(item.price)}</span>

          {/* Quantity controls */}
          {showControls && (
            <div className="flex items-center">
              <button
                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
                aria-label="Decrease quantity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>

              <span className="w-8 h-8 flex items-center justify-center text-sm">
                {item.quantity}
              </span>

              <button
                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
                aria-label="Increase quantity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v12M6 12h12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Display item subtotal and remove button */}
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Subtotal: {formatPrice(item.price * item.quantity)}
          </p>

          {showControls && (
            <button
              onClick={() => removeItem(item.id)}
              className="text-xs text-red-600 dark:text-red-400 hover:underline"
              aria-label="Remove item"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
