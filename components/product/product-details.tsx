"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/product/add-to-cart-button";

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    description: string;
    averageRating: number;
    reviewCount: number;
    categoryName: string;
    categorySlug: string;
    sku: string;
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Add to wishlist functionality
  const addToWishlist = async () => {
    setIsAddingToWishlist(true);
    try {
      const response = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (response.ok) {
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Function to check stock status
  const stockStatus = () => {
    if (product.stock > 10) {
      return { label: "In Stock", color: "text-green-600 dark:text-green-400" };
    } else if (product.stock > 0) {
      return {
        label: `Only ${product.stock} left`,
        color: "text-orange-600 dark:text-orange-400",
      };
    } else {
      return { label: "Out of Stock", color: "text-red-600 dark:text-red-400" };
    }
  };

  const status = stockStatus();

  return (
    <div className="flex flex-col h-full">
      {/* Product category */}
      <Link
        href={`/products/category/${product.categorySlug}`}
        className="text-sm text-primary-600 dark:text-primary-400 hover:underline mb-2"
      >
        {product.categoryName}
      </Link>

      {/* Product name */}
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center mb-4">
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className={`w-5 h-5 ${
                index < Math.round(product.averageRating)
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <Link
          href="#reviews"
          className="ml-2 text-sm text-gray-500 dark:text-gray-400 hover:underline"
        >
          {product.reviewCount}{" "}
          {product.reviewCount === 1 ? "review" : "reviews"}
        </Link>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {Math.round(
                  ((product.compareAtPrice - product.price) /
                    product.compareAtPrice) *
                    100
                )}
                % OFF
              </span>
            </>
          )}
        </div>
      </div>

      {/* Short description */}
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-400">
          {product.description.split("\n")[0]}
        </p>
      </div>

      {/* Stock status */}
      <div className="mb-6">
        <p className={`text-sm font-medium ${status.color}`}>{status.label}</p>
      </div>

      {/* Add to cart section */}
      <div className="mt-auto">
        <div className="mb-4">
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: "",
            }}
            className="py-3"
          />
        </div>

        {/* Wishlist button */}
        <button
          onClick={addToWishlist}
          disabled={isAddingToWishlist || isInWishlist}
          className="w-full flex items-center justify-center py-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {isAddingToWishlist ? (
            "Adding..."
          ) : isInWishlist ? (
            <>
              <svg
                className="w-5 h-5 mr-2 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              Added to Wishlist
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 6.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 18.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
              Add to Wishlist
            </>
          )}
        </button>

        {/* Product meta */}
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              SKU:{" "}
              <span className="text-gray-900 dark:text-gray-200">
                {product.sku}
              </span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Category:{" "}
              <Link
                href={`/products/category/${product.categorySlug}`}
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                {product.categoryName}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
