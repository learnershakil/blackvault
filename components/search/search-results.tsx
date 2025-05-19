"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=12`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }

        const data = await response.json();

        // If first page, replace products; otherwise append
        if (page === 1) {
          setProducts(data.products);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
        }

        setHasMore(data.pagination.hasMore);
      } catch (err: any) {
        console.error("Error fetching search results:", err);
        setError(err.message || "Failed to load search results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  // Loading state for initial load
  if (isLoading && page === 1) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg h-72"
          />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-300 rounded-lg">
        {error}
      </div>
    );
  }

  // No results state
  if (products.length === 0) {
    return (
      <div className="py-12 px-4 text-center border border-gray-200 dark:border-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          We couldn't find any products matching "{query}".
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button asChild>
            <a href="/products">Browse All Products</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
              image: product.images?.[0]?.url,
              imageAlt: product.images?.[0]?.alt || product.name,
            }}
          />
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? "Loading..." : "Load More Products"}
          </Button>
        </div>
      )}
    </div>
  );
}
