import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/auth";

// GET handler to list all images for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const productImages = await prisma.productImage.findMany({
      where: { productId: id },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json(productImages);
  } catch (error) {
    console.error("Error fetching product images:", error);
    return NextResponse.json(
      { error: "Failed to fetch product images" },
      { status: 500 }
    );
  }
}

// Schema for adding a product image
const imageSchema = z.object({
  url: z.string().url("Image URL must be valid"),
  alt: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
});

// POST handler to add an image to a product
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user is authenticated and is an admin
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    // Validate request body
    const validatedData = imageSchema.parse(body);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If this is set as default, unset other default images
    if (validatedData.isDefault) {
      await prisma.productImage.updateMany({
        where: {
          productId: id,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    // Create the image
    const image = await prisma.productImage.create({
      data: {
        ...validatedData,
        productId: id,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error adding product image:", error);
    return NextResponse.json(
      { error: "Failed to add product image" },
      { status: 500 }
    );
  }
}
