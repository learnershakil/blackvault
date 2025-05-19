import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// GET endpoint to fetch featured collections
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Check for admin role for full access
    const isAdmin = session?.user?.role === "ADMIN";

    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active") === "true";

    // Build query filters
    let whereClause: any = {};

    // Filter active collections
    if (!isAdmin || active) {
      whereClause.isActive = true;

      // Only show collections within date range if specified
      const now = new Date();
      whereClause.OR = [{ startDate: null }, { startDate: { lte: now } }];
      whereClause.AND = [
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ];
    }

    const collections = await prisma.featuredCollection.findMany({
      where: whereClause,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                compareAtPrice: true,
                images: {
                  where: { isDefault: true },
                  take: 1,
                },
              },
            },
          },
          orderBy: { priority: "desc" },
        },
      },
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new featured collection (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const schema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      slug: z.string().min(1, "Slug is required"),
      imageUrl: z.string().optional(),
      isActive: z.boolean().default(true),
      priority: z.number().int().default(0),
      startDate: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
      endDate: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
      productIds: z.array(z.string()).optional(),
    });

    const validatedData = schema.parse(body);
    const { productIds, ...collectionData } = validatedData;

    // Check if slug is unique
    const existingCollection = await prisma.featuredCollection.findUnique({
      where: { slug: collectionData.slug },
    });

    if (existingCollection) {
      return NextResponse.json(
        { error: "Collection with this slug already exists" },
        { status: 400 }
      );
    }

    // Create collection
    const collection = await prisma.featuredCollection.create({
      data: {
        ...collectionData,
        // Create featured products if provided
        ...(productIds && productIds.length > 0
          ? {
              products: {
                create: productIds.map((productId, index) => ({
                  productId,
                  priority: productIds.length - index, // Reverse the index for descending priority
                })),
              },
            }
          : {}),
      },
      include: {
        products: { include: { product: true } },
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating collection:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
}
