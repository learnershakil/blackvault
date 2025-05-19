import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/navigation/breadcrumbs";
import CategoryNav from "@/components/navigation/category-nav";
import SearchResults from "@/components/search/search-results";
import { Metadata } from "next";

interface SearchPageProps {
  searchParams: { q?: string };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = searchParams.q || "";
  return {
    title: `Search results for "${query}" | BlackVault`,
    description: `Search results for "${query}" on BlackVault Audio`,
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  // Handle empty search query
  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ href: "/search", label: "Search" }]} />

        <div className="max-w-4xl mx-auto py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Search Our Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Enter a search term to find products in our catalog.
          </p>
          <div className="flex justify-center">
            <Link href="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ href: "/search", label: "Search Results" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Search Results for "{query}"
        </h1>

        {/* Category navigation for quick access */}
        <div className="mt-6">
          <h2 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Browse Categories
          </h2>
          <CategoryNav />
        </div>
      </div>

      {/* Search results with suspense fallback */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg h-72"
              />
            ))}
          </div>
        }
      >
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
