"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cart-store";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    specialPrice?: number | null;
    specialPriceEndDate?: Date | null;
    image?: string;
    imageAlt?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();

  // Determine which price to display
  const displayPrice = product.specialPrice ?? product.price;
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > displayPrice;

  // Check if special price is still valid
  const isSpecialPriceValid =
    product.specialPrice && product.specialPriceEndDate
      ? new Date() < new Date(product.specialPriceEndDate)
      : true;

  // Calculate discount percentage if there's a discount
  const discountPercentage = hasDiscount
    ? Math.round(
      // @ts-ignore
        ((product.compareAtPrice - displayPrice) / product.compareAtPrice) * 100
      )
    : 0;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);

    try {
      addItem({
        productId: product.id,
        name: product.name,
        price: displayPrice,
        image: product.image || "",
        quantity: 1,
      });

      // Show the "Added" state briefly
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 1500);

      // Simulate a short delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Card animation variants
  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
    },
    tap: {
      y: 0,
      boxShadow: "0 5px 10px rgba(0, 0, 0, 0.05)",
    },
    initial: {
      y: 0,
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    },
  };

  // Button animation variants
  const buttonVariants = {
    hover: {
      y: 0,
      opacity: 1,
    },
    hidden: {
      y: 20,
      opacity: 0,
    },
  };

  // Badge animation variants
  const badgeVariants = {
    initial: { scale: 1 },
    animate: { scale: [1, 1.2, 1], transition: { duration: 0.5 } },
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
      // @ts-ignore
        className="group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col h-full"
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        transition={{ duration: 0.2 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          {product.image ? (
            <div className="h-full w-full relative">
              <motion.img
                src={product.image}
                alt={product.imageAlt || product.name}
                className="object-cover w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <motion.span
              className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
              variants={badgeVariants}
              initial="initial"
              animate="animate"
            >
              {discountPercentage}% OFF
            </motion.span>
          )}

          {/* Special price badge */}
          {product.specialPrice && isSpecialPriceValid && !hasDiscount && (
            <motion.span
              className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded"
              variants={badgeVariants}
              initial="initial"
              animate="animate"
            >
              Special
            </motion.span>
          )}

          {/* Add to cart button overlay */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-4 py-3"
            variants={buttonVariants}
            initial="hidden"
            animate={isHovered ? "hover" : "hidden"}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full"
              size="sm"
            >
              {isAddingToCart ? (
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
              ) : isAdded ? (
                <span className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4"
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
                  Added!
                </span>
              ) : (
                "Add to Cart"
              )}
            </Button>
          </motion.div>
        </div>

        {/* Product details */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          <motion.div
            className="mt-auto pt-2"
            animate={isAdded ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white">
                {formatPrice(displayPrice)}
              </span>

              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
