import ProductCard from "@/components/product/product-card";
import prisma from "@/lib/prisma";

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
  limit?: number;
}

export default async function RelatedProducts({
  productId,
  categoryId,
  limit = 4,
}: RelatedProductsProps) {
  // Fetch related products from the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: productId },
      categoryId: categoryId,
      isPublished: true,
    },
    include: {
      images: {
        where: { isDefault: true },
        take: 1,
      },
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  if (relatedProducts.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        No related products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
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
            image: product.images[0]?.url,
            imageAlt: product.images[0]?.alt || product.name,
          }}
        />
      ))}
    </div>
  );
}
