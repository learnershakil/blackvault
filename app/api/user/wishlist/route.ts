import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// GET handler to retrieve user's wishlist
export async function GET() {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch wishlist items with product details
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: {
              where: { isDefault: true },
              take: 1,
            },
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// POST handler to add item to wishlist
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      productId: z.string().min(1, "Product ID is required"),
    });

    const { productId } = schema.parse(body);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product is already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { message: "Product already in wishlist", item: existingItem },
        { status: 200 }
      );
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add item to wishlist" },
      { status: 500 }
    );
  }
}
