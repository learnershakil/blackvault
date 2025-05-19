import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Query schema validation
const querySchema = z.object({
  productId: z.string().cuid(),
  categoryId: z.string().optional(),
  limit: z.coerce.number().min(1).max(12).optional().default(4),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      productId: searchParams.get("productId"),
      categoryId: searchParams.get("categoryId"),
      limit: searchParams.get("limit"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    const { productId, categoryId, limit } = parsed.data;

    // Base query conditions
    const where: any = {
      id: { not: productId },
      isPublished: true,
    };

    // Add category filter if provided
    if (categoryId) {
      where.categoryId = categoryId;
    } else {
      // If no category ID provided, fetch the product's category first
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { categoryId: true },
      });

      if (product) {
        where.categoryId = product.categoryId;
      }
    }

    // Fetch related products
    const relatedProducts = await prisma.product.findMany({
      where,
      include: {
        images: {
          where: { isDefault: true },
          take: 1,
        },
        category: {
          select: { name: true, slug: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    return NextResponse.json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    );
  }
}
