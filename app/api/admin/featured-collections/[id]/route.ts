import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// GET a specific featured collection
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await auth();

    // Non-admin users can only view active collections
    let whereClause: any = { id };
    if (session?.user?.role !== "ADMIN") {
      whereClause.isActive = true;

      // Only show collections within date range if specified
      const now = new Date();
      whereClause.OR = [{ startDate: null }, { startDate: { lte: now } }];
      whereClause.AND = [
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ];
    }

    const collection = await prisma.featuredCollection.findFirst({
      where: whereClause,
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

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

// PATCH handler to update a featured collection
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Validate request data
    const schema = z.object({
      title: z.string().optional(),
      description: z.string().optional().nullable(),
      slug: z.string().optional(),
      imageUrl: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
      priority: z.number().int().optional(),
      startDate: z
        .string()
        .optional()
        .nullable()
        .transform((val) => (val ? new Date(val) : null)),
      endDate: z
        .string()
        .optional()
        .nullable()
        .transform((val) => (val ? new Date(val) : null)),
      productIds: z.array(z.string()).optional(),
      removeProductIds: z.array(z.string()).optional(),
    });

    const validatedData = schema.parse(body);

    // Check if collection exists
    const existingCollection = await prisma.featuredCollection.findUnique({
      where: { id },
    });

    if (!existingCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    // If slug is being changed, check if it's unique
    if (validatedData.slug && validatedData.slug !== existingCollection.slug) {
      const slugExists = await prisma.featuredCollection.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A collection with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Extract product operations from validated data
    const { productIds, removeProductIds, ...collectionData } = validatedData;

    // Start a transaction to update the collection and its products
    const updatedCollection = await prisma.$transaction(async (tx) => {
      // Update collection details
      const updated = await tx.featuredCollection.update({
        where: { id },
        data: collectionData,
        include: {
          products: { include: { product: true } },
        },
      });

      // Remove products if specified
      if (removeProductIds?.length) {
        await tx.featuredProduct.deleteMany({
          where: {
            collectionId: id,
            productId: { in: removeProductIds },
          },
        });
      }

      // Add new products if specified
      if (productIds?.length) {
        // Get existing product IDs
        const existingProductIds = updated.products.map((p) => p.productId);

        // Filter out products that are already in the collection
        const newProductIds = productIds.filter(
          (pid) => !existingProductIds.includes(pid)
        );

        if (newProductIds.length > 0) {
          // Add new products
          await tx.featuredProduct.createMany({
            data: newProductIds.map((productId, index) => ({
              collectionId: id,
              productId,
              priority: newProductIds.length - index, // Reverse index for descending priority
            })),
            skipDuplicates: true,
          });
        }
      }

      // Fetch the updated collection with its products
      return tx.featuredCollection.findUnique({
        where: { id },
        include: {
          products: {
            include: { product: true },
            orderBy: { priority: "desc" },
          },
        },
      });
    });

    return NextResponse.json(updatedCollection);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating collection:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a featured collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if collection exists
    const existingCollection = await prisma.featuredCollection.findUnique({
      where: { id },
    });

    if (!existingCollection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    // Delete the collection (related products will be deleted due to cascading)
    await prisma.featuredCollection.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: 500 }
    );
  }
}
