import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/product-card";
import prisma from "@/lib/prisma";

interface ProductListProps {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "popular";
  page?: number;
  limit?: number;
}

export default async function ProductList({
  category,
  minPrice,
  maxPrice,
  sort = "newest",
  page = 1,
  limit = 12,
}: ProductListProps) {
  // Build filtering conditions
  const where: any = {
    isPublished: true,
  };

  if (category) {
    where.category = {
      slug: category,
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Define sorting
  const orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "popular") orderBy = { reviews: { _count: "desc" } };

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Fetch products with filtering, sorting, and pagination
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take: limit,
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      images: {
        where: { isDefault: true },
        take: 1,
      },
      _count: {
        select: { reviews: true },
      },
    },
  });

  // Get total count for pagination
  const total = await prisma.product.count({ where });
  const totalPages = Math.ceil(total / limit);

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-medium mb-4">No products found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Try adjusting your filters or browse our categories.
        </p>
        <Link href="/products">
          <Button>View All Products</Button>
        </Link>
      </div>
    );
  }

  // Function to generate pagination URL
  const getPaginationUrl = (pageNum: number) => {
    const searchParams = new URLSearchParams();
    if (category) searchParams.set("category", category);
    if (minPrice !== undefined)
      searchParams.set("minPrice", minPrice.toString());
    if (maxPrice !== undefined)
      searchParams.set("maxPrice", maxPrice.toString());
    if (sort) searchParams.set("sort", sort);
    searchParams.set("page", pageNum.toString());

    return `/products?${searchParams.toString()}`;
  };

  return (
    <div>
      {/* Results summary */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {products.length} of {total} products
        </p>
        <p className="text-sm">
          Page {page} of {totalPages}
        </p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
            <ProductCard
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
          </Suspense>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <div className="flex space-x-1">
            {page > 1 && (
              <Link href={getPaginationUrl(page - 1)}>
                <Button variant="outline" size="sm">
                  Previous
                </Button>
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Show first, last, current, and pages around current
                return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
              })
              .map((pageNum, index, array) => {
                // Add ellipsis between non-consecutive page numbers
                const showEllipsisBefore =
                  index > 0 && pageNum - array[index - 1] > 1;
                return (
                  <div key={pageNum} className="flex items-center">
                    {showEllipsisBefore && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <Link href={getPaginationUrl(pageNum)}>
                      <Button
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        className="min-w-[40px]"
                      >
                        {pageNum}
                      </Button>
                    </Link>
                  </div>
                );
              })}

            {page < totalPages && (
              <Link href={getPaginationUrl(page + 1)}>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse">
      <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  );
}
