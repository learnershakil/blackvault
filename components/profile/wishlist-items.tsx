"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Product, WishlistItem } from "@prisma/client";

type WishlistItemWithProduct = WishlistItem & {
  product: Product & {
    images: { url: string; alt: string | null }[];
    category: { name: string; slug: string };
  };
};

interface WishlistItemsProps {
  initialItems: WishlistItemWithProduct[];
}

export default function WishlistItems({ initialItems }: WishlistItemsProps) {
  const [items, setItems] = useState<WishlistItemWithProduct[]>(initialItems);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  // Remove item from wishlist
  const handleRemove = async (itemId: string) => {
    setLoading(itemId);

    try {
      const response = await fetch(`/api/user/wishlist/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      // Update local state
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      router.refresh();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setLoading(null);
    }
  };

  // Add to cart from wishlist
  const handleAddToCart = async (productId: string, itemId: string) => {
    setLoading(itemId);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      // Show a success message or update UI as needed
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Your wishlist is empty.
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        >
          {/* Product image */}
          <div className="flex-shrink-0">
            <Link
              href={`/products/${item.product.slug}`}
              className="block w-full sm:w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden"
            >
              {item.product.images.length > 0 ? (
                <img
                  src={item.product.images[0].url}
                  alt={item.product.images[0].alt || item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  {item.product.name.charAt(0)}
                </div>
              )}
            </Link>
          </div>

          {/* Product details */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-medium hover:text-primary-600"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.product.category.name}
                </p>
                <p className="font-medium mt-1">
                  {formatPrice(Number(item.product.price))}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(item.product.id, item.id)}
                  disabled={loading === item.id}
                >
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemove(item.id)}
                  disabled={loading === item.id}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
