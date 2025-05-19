"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  selectedCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export default function ProductFilters({
  selectedCategory,
  minPrice,
  maxPrice,
  sort,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for filter values
  const [categories, setCategories] = useState<any[]>([]);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice || "");
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice || "");
  const [selectedSort, setSelectedSort] = useState(sort || "newest");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/products/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (selectedCategory) params.set("category", selectedCategory);
    if (localMinPrice) params.set("minPrice", localMinPrice.toString());
    if (localMaxPrice) params.set("maxPrice", localMaxPrice.toString());
    if (selectedSort) params.set("sort", selectedSort);

    router.push(`/products?${params.toString()}`);
  };

  // Reset filters
  const resetFilters = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setSelectedSort("newest");
    router.push("/products");
  };

  // Helper to create a URL with a category filter
  const createCategoryUrl = (categorySlug: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categorySlug) {
      params.set("category", categorySlug);
    } else {
      params.delete("category");
    }

    return `/products?${params.toString()}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 sticky top-20">
      <h2 className="font-medium text-lg mb-4">Filters</h2>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-medium mb-2 text-sm">Category</h3>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center">
              <a
                href={createCategoryUrl(undefined)}
                className={`text-sm py-1 ${
                  !selectedCategory
                    ? "font-medium text-primary-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                All Products
              </a>
            </div>

            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <a
                  href={createCategoryUrl(category.slug)}
                  className={`text-sm py-1 ${
                    selectedCategory === category.slug
                      ? "font-medium text-primary-600"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {category.name}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-medium mb-2 text-sm">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="sr-only">Min Price</label>
            <input
              type="number"
              placeholder="Min"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="sr-only">Max Price</label>
            <input
              type="number"
              placeholder="Max"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h3 className="font-medium mb-2 text-sm">Sort By</h3>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700"
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Popularity</option>
        </select>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
