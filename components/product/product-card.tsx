"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

      // Simulate a short delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className="group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col h-full transition-all duration-300 hover:shadow-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          {product.image ? (
            <div className="h-full w-full relative">
              <img
                src={product.image}
                alt={product.imageAlt || product.name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
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
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </span>
          )}

          {/* Special price badge */}
          {product.specialPrice && isSpecialPriceValid && !hasDiscount && (
            <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              Special
            </span>
          )}

          {/* Add to cart button overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-4 py-3 transform transition-transform duration-300 ${
              isHovered ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full"
              size="sm"
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>

        {/* Product details */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-auto pt-2">
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
          </div>
        </div>
      </div>
    </Link>
  );
}
