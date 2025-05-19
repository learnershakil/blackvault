import prisma from "@/lib/prisma";

/**
 * Get related products based on category and tags
 */
export async function getRelatedProducts(productId: string, limit: number = 4) {
  // Get the product with its category
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      categoryId: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Find related products in the same category
  return await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: productId },
      isPublished: true,
    },
    include: {
      images: {
        where: { isDefault: true },
        take: 1,
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    take: limit,
  });
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      category: true,
      images: true,
      attributes: {
        include: {
          attribute: true,
          attributeValues: true,
        },
      },
      variants: {
        include: {
          options: {
            include: {
              attributeValue: true,
            },
          },
        },
      },
      reviews: {
        where: { isPublished: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });
}

/**
 * Get best selling products
 */
export async function getBestSellingProducts(limit: number = 4) {
  // This would typically use analytics or order data
  // For now, we'll use reviews count as a proxy for popularity
  return await prisma.product.findMany({
    where: {
      isPublished: true,
    },
    include: {
      images: {
        where: { isDefault: true },
        take: 1,
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      _count: {
        select: { reviews: true },
      },
    },
    orderBy: {
      reviews: { _count: "desc" },
    },
    take: limit,
  });
}

/**
 * Check if product is in stock and sufficient quantity
 */
export async function isProductAvailable(
  productId: string,
  quantity: number = 1
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });

  if (!product) {
    return false;
  }

  return product.stock >= quantity;
}
