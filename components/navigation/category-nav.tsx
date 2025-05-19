"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  children?: Category[];
}

interface CategoryNavProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  showDescription?: boolean;
}

export default function CategoryNav({
  orientation = "horizontal",
  className = "",
  showDescription = false,
}: CategoryNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/products/categories");

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Check if a category is active
  const isCategoryActive = (slug: string) => {
    return (
      pathname === `/categories/${slug}` ||
      pathname === `/products/category/${slug}` ||
      pathname.includes(`/products/category/${slug}/`)
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "animate-pulse",
          orientation === "horizontal"
            ? "flex gap-4 overflow-x-auto pb-2"
            : "space-y-2",
          className
        )}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-gray-200 dark:bg-gray-700 rounded",
              orientation === "horizontal"
                ? "w-24 h-8 flex-shrink-0"
                : "h-8 w-full"
            )}
          />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
    );
  }

  // No categories state
  if (categories.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Categories"
      className={cn(
        orientation === "horizontal"
          ? "flex flex-nowrap gap-1 md:gap-4 overflow-x-auto pb-2 hide-scrollbar"
          : "space-y-1",
        className
      )}
    >
      {categories.map((category) => (
        <div key={category.id}>
          <Link
            href={`/products/category/${category.slug}`}
            className={cn(
              "block transition-colors whitespace-nowrap",
              orientation === "horizontal"
                ? "px-3 py-1.5 rounded-full text-sm font-medium"
                : "px-4 py-2 rounded-md",
              isCategoryActive(category.slug)
                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            )}
          >
            {category.name}
          </Link>

          {/* Category description (optional) */}
          {showDescription && category.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-4">
              {category.description}
            </p>
          )}

          {/* Nested categories, if any */}
          {category.children && category.children.length > 0 && (
            <div
              className={cn(
                orientation === "horizontal"
                  ? "hidden" // Don't show nested in horizontal layout
                  : "pl-4 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700"
              )}
            >
              {category.children.map((childCat) => (
                <Link
                  key={childCat.id}
                  href={`/products/category/${childCat.slug}`}
                  className={cn(
                    "block px-4 py-1.5 text-sm transition-colors",
                    isCategoryActive(childCat.slug)
                      ? "text-primary-700 dark:text-primary-300 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  {childCat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
