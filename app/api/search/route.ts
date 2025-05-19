import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    if (!query) {
      return NextResponse.json({
        products: [],
        pagination: {
          page,
          limit,
          totalItems: 0,
          totalPages: 0,
          hasMore: false,
        },
      });
    }

    // Search for products matching the query
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
          {
            category: {
              name: { contains: query, mode: "insensitive" },
            },
          },
        ],
        isPublished: true, // Only return published products
      },
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
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalItems = await prisma.product.count({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
          {
            category: {
              name: { contains: query, mode: "insensitive" },
            },
          },
        ],
        isPublished: true,
      },
    });

    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
