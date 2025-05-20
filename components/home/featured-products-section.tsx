"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";

interface FeaturedCollection {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  imageUrl?: string | null;
  products: {
    id: string;
    priority: number;
    specialPrice: number | null;
    specialPriceEndDate: Date | null;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      compareAtPrice: number | null;
      images: {
        url: string;
        alt: string | null;
      }[];
    };
  }[];
}

interface FeaturedProductsSectionProps {
  collectionSlug?: string;
  title?: string;
  viewAllLink?: string;
  maxProducts?: number;
}

export default function FeaturedProductsSection({
  collectionSlug,
  title,
  viewAllLink,
  maxProducts = 4,
}: FeaturedProductsSectionProps) {
  const [collection, setCollection] = useState<FeaturedCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetchFeaturedCollection = async () => {
      try {
        setIsLoading(true);

        // Fetch collections from the API with timeout
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(
          `/api/admin/featured-collections?active=true`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (!response.ok) {
          throw new Error("Failed to fetch featured collections");
        }

        const collections: FeaturedCollection[] = await response.json();

        // Find the requested collection or use the first one
        let targetCollection: FeaturedCollection | undefined;

        if (collectionSlug) {
          targetCollection = collections.find((c) => c.slug === collectionSlug);
        } else if (collections.length > 0) {
          // Use the first collection if no specific slug provided
          targetCollection = collections[0];
        }

        if (targetCollection && isMounted) {
          setCollection(targetCollection);
        } else if (isMounted) {
          setError("No featured collection found");
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Featured collection fetch aborted due to timeout");
        } else {
          console.error("Error fetching featured collection:", err);
        }

        if (isMounted) {
          setError(err.message || "Failed to load featured products");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFeaturedCollection();

    // Clean up function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [collectionSlug]);

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !collection) {
    return null; // Return nothing if there's an error or no collection
  }

  // Limit the number of products displayed
  const displayProducts = collection.products
    .slice(0, maxProducts)
    .map((item) => ({
      ...item.product,
      specialPrice: item.specialPrice ? Number(item.specialPrice) : null,
      specialPriceEndDate: item.specialPriceEndDate,
    }));

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {title || collection.title}
            </h2>
            {collection.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {collection.description}
              </p>
            )}
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="mt-4 md:mt-0 inline-flex items-center font-medium text-primary-600 hover:text-primary-700"
            >
              View all
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                compareAtPrice: product.compareAtPrice
                  ? Number(product.compareAtPrice)
                  : undefined,
                specialPrice: product.specialPrice,
                specialPriceEndDate: product.specialPriceEndDate,
                image: product.images?.[0]?.url,
                imageAlt: product.images?.[0]?.alt || product.name,
              }}
            />
          ))}
        </div>

        {/* Mobile view all button */}
        {viewAllLink && (
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline">
              <Link href={viewAllLink}>View All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
