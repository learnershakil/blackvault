import { Suspense } from "react";
import { Metadata } from "next";
import ProductList from "@/components/product/product-list";
import ProductFilters from "@/components/product/product-filters";
import Breadcrumbs from "@/components/navigation/breadcrumbs";
import ProductListingSkeleton from "@/components/product/product-listing-skeleton";

export const metadata: Metadata = {
  title: "Shop All Products | BlackVault",
  description:
    "Browse our collection of premium audio products - headphones, speakers, earbuds and accessories.",
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Get filter parameters from query string
  const category = searchParams.category || undefined;
  const minPrice = searchParams.minPrice
    ? Number(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? Number(searchParams.maxPrice)
    : undefined;
  const sort = searchParams.sort || undefined;
  const page = searchParams.page ? Number(searchParams.page) : 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ href: "/products", label: "All Products" }]} />

      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <ProductFilters
            selectedCategory={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sort={sort}
          />
        </div>

        {/* Product list with suspense boundary for streaming */}
        <div className="flex-grow">
          <Suspense fallback={<ProductListingSkeleton />}>
            <ProductList
              category={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sort={sort as any}
              page={page}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
