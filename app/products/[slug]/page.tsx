import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import Breadcrumbs from "@/components/navigation/breadcrumbs";
import ProductGallery from "@/components/product/product-gallery";
import ProductDetails from "@/components/product/product-details";
import RelatedProducts from "@/components/product/related-products";

interface ProductPageProps {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | BlackVault",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | BlackVault`,
    description: product.description.substring(0, 160),
    openGraph:
      product.images.length > 0
        ? {
            images: [{ url: product.images[0].url }],
          }
        : undefined,
  };
}

// Fetch product data
async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
      images: {
        orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
      },
      reviews: {
        where: { isPublished: true },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return product;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // Prepare breadcrumb items
  const breadcrumbItems = [
    { href: "/products", label: "Products" },
    {
      href: `/products/category/${product.category.slug}`,
      label: product.category.name,
    },
    { href: `/products/${product.slug}`, label: product.name },
  ];

  // Calculate average rating
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Left column - Product gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Right column - Product details */}
        <ProductDetails
          product={{
            ...product,
            price: Number(product.price),
            compareAtPrice: product.compareAtPrice
              ? Number(product.compareAtPrice)
              : undefined,
            averageRating,
            reviewCount: product.reviews.length,
            categoryName: product.category.name,
            categorySlug: product.category.slug,
          }}
        />
      </div>

      {/* Product description */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {product.description.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Product reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            This product has not been reviewed yet. Be the first to leave a
            review!
          </p>
        ) : (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 dark:border-gray-700 pb-6"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {review.user.image ? (
                      <img
                        src={review.user.image}
                        alt={review.user.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">
                        {review.user.name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {review.user.name || "Anonymous"}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${
                            index < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts
            productId={product.id}
            categoryId={product.categoryId}
          />
        </Suspense>
      </div>
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg h-72"
        />
      ))}
    </div>
  );
}
