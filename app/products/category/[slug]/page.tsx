import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Breadcrumbs from "@/components/navigation/breadcrumbs";
import ProductGrid from "@/components/product/product-grid";
import CategoryNav from "@/components/navigation/category-nav";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return {
        title: "Category Not Found | BlackVault",
        description: "The requested category could not be found.",
      };
    }

    return {
      title: `${category.name} | BlackVault`,
      description:
        category.description ||
        `Shop our collection of ${category.name} at BlackVault.`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Products | BlackVault",
      description: "Shop our audio products at BlackVault.",
    };
  }
}

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: true,
    },
  });
}

async function getCategoryProducts(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        select: { id: true },
      },
    },
  });

  if (!category) return [];

  // Include category and all its children in the query
  const categoryIds = [
    category.id,
    ...category.children.map((child) => child.id),
  ];

  // Get products for this category and its children
  const products = await prisma.product.findMany({
    where: {
      categoryId: { in: categoryIds },
      isPublished: true,
    },
    include: {
      images: {
        take: 1,
        where: {
          isDefault: true,
        },
      },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  return products;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  // Fetch category data
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  // Fetch category products
  const products = await getCategoryProducts(slug);

  // Prepare breadcrumb items
  const breadcrumbItems = [];

  // Add parent category if exists
  if (category.parent) {
    breadcrumbItems.push({
      href: `/products/category/${category.parent.slug}`,
      label: category.parent.name,
    });
  }

  // Add current category
  breadcrumbItems.push({
    href: `/products/category/${category.slug}`,
    label: category.name,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { href: "/categories", label: "Categories" },
          ...breadcrumbItems,
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Category header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>

          {category.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {category.description}
            </p>
          )}

          {/* Show subcategories if available */}
          {category.children.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-medium mb-2">
                Browse {category.name} Subcategories:
              </h2>
              <div className="flex flex-wrap gap-2">
                {category.children.map((subcat) => (
                  <Link
                    key={subcat.id}
                    href={`/products/category/${subcat.slug}`}
                    className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {subcat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related categories navigation */}
        <div className="mb-8">
          <h2 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Other Categories
          </h2>
          <CategoryNav />
        </div>

        {/* Products grid with suspense fallback */}
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
          <ProductGrid products={products} />
        </Suspense>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-12 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We don't have any products in this category yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
