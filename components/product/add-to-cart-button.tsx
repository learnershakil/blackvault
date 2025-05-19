"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cart-store";
import { useToast } from "@/components/ui/toast";

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
  const [showCheck, setShowCheck] = useState(false);
  const { addItem } = useCartStore();
  const { showToast } = useToast();

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

      // Show success animation
      setShowCheck(true);

      // Show success toast
      showToast(`${product.name} added to cart`, "success");

      // Reset quantity
      setQuantity(1);

      // Reset success animation after delay
      setTimeout(() => {
        setShowCheck(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Failed to add item to cart", "error");
    } finally {
      // Add a small delay to show the loading state
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    loading: { scale: 0.98 },
    success: { scale: [1, 1.1, 1] },
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Quantity selector */}
      <div className="flex border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
        <motion.button
          type="button"
          className="w-10 h-10 flex items-center justify-center border-r border-gray-300 dark:border-gray-600"
          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          disabled={quantity <= 1}
          whileTap={{ scale: 0.9 }}
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
        </motion.button>

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

        <motion.button
          type="button"
          className="w-10 h-10 flex items-center justify-center border-l border-gray-300 dark:border-gray-600"
          onClick={() => setQuantity(quantity + 1)}
          whileTap={{ scale: 0.9 }}
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
        </motion.button>
      </div>

      {/* Add to cart button with animation */}
      <motion.div
        className="flex-1"
        variants={buttonVariants}
        animate={isAdding ? "loading" : showCheck ? "success" : "initial"}
      >
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full relative ${className}`}
        >
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
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
              </motion.span>
            ) : showCheck ? (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <svg
                  className="mr-2 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Added to Cart
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
}
