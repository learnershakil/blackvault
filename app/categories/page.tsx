import Link from "next/link";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Breadcrumbs from "@/components/navigation/breadcrumbs";

export const metadata: Metadata = {
  title: "Shop by Category | BlackVault",
  description:
    "Browse our audio products by category - headphones, speakers, earbuds, accessories and more.",
};

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true,
          },
        },
        children: {
          include: {
            products: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: {
        parentId: null, // Only top-level categories
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ href: "/categories", label: "Categories" }]} />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>

        {categories.length === 0 ? (
          <div className="text-center py-12 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No categories found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products/category/${category.slug}`}
                className="group block rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-shadow hover:shadow-md"
              >
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <span className="text-4xl font-light">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="font-bold text-lg mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {category.name}
                  </h2>

                  {category.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.products.length} products
                    </span>
                    <span className="text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:underline flex items-center">
                      Browse
                      <svg
                        className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                    </span>
                  </div>

                  {category.children.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Subcategories:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {category.children.slice(0, 3).map((child) => (
                          <Link
                            key={child.id}
                            href={`/products/category/${child.slug}`}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {child.name}
                          </Link>
                        ))}
                        {category.children.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                            +{category.children.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
