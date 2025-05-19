"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cart-store";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  variant?: { sku: string } | null;
  className?: string;
}

export default function AddToCartButton({
  product,
  variant = null,
  className = "",
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      // Add to cart (Zustand will handle the API call)
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        variantSku: variant?.sku,
      });

      setQuantity(1); // Reset quantity
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      // Add a small delay to show the loading state
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Quantity selector */}
      <div className="flex border border-gray-300 dark:border-gray-600 rounded">
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center border-r border-gray-300 dark:border-gray-600"
          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          disabled={quantity <= 1}
        >
          <span className="sr-only">Decrease quantity</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 12H4"
            />
          </svg>
        </button>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value > 0) setQuantity(value);
          }}
          className="w-14 text-center border-none focus:outline-none focus:ring-0 bg-transparent"
        />

        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center border-l border-gray-300 dark:border-gray-600"
          onClick={() => setQuantity(quantity + 1)}
        >
          <span className="sr-only">Increase quantity</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v12M6 12h12"
            />
          </svg>
        </button>
      </div>

      {/* Add to cart button */}
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`flex-1 ${className}`}
      >
        {isAdding ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding...
          </span>
        ) : (
          <span>Add to Cart</span>
        )}
      </Button>
    </div>
  );
}
