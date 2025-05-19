import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET handler for featured products
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "6");

    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isPublished: true,
      },
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
      orderBy: [{ createdAt: "desc" }],
      take: limit,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
