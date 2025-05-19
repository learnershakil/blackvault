import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetail from "@/components/product/product-detail";
import { Metadata } from "next";
import { ProductStructuredData } from "@/components/seo/structured-data";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the product
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: product.images.length > 0 ? [{ url: product.images[0].url }] : [],
      type: "product",
    },
  };
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isPublished: true },
      include: {
        category: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!product) return null;

    // Calculate average rating
    const ratings = product.reviews.map((review) => review.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    return {
      ...product,
      reviewStats: {
        averageRating,
        count: product.reviews.length,
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* Add structured data */}
      <ProductStructuredData
        product={{
          ...product,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice
            ? Number(product.compareAtPrice)
            : undefined,
          reviews: {
            rating: product.reviewStats.averageRating,
            count: product.reviewStats.count,
          },
        }}
      />

      <ProductDetail product={product} />
    </>
  );
}
