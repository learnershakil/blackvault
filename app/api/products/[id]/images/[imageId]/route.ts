import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/auth";

// PATCH handler to update an image (e.g., set as default)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    // Verify user is authenticated and is an admin
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, imageId } = params;
    const body = await request.json();

    // Validate request body
    const validatedData = z
      .object({
        isDefault: z.boolean().optional(),
        alt: z.string().nullable().optional(),
      })
      .parse(body);

    // If making this image default, unset other defaults first
    if (validatedData.isDefault) {
      await prisma.productImage.updateMany({
        where: {
          productId: id,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    // Update the image
    const image = await prisma.productImage.update({
      where: { id: imageId },
      data: validatedData,
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Error updating product image:", error);
    return NextResponse.json(
      { error: "Failed to update product image" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete an image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    // Verify user is authenticated and is an admin
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageId } = params;

    // Check if this is the default image
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete the image
    await prisma.productImage.delete({
      where: { id: imageId },
    });

    // If this was the default image, try to set another image as default
    if (image.isDefault) {
      const otherImage = await prisma.productImage.findFirst({
        where: { productId: image.productId },
      });

      if (otherImage) {
        await prisma.productImage.update({
          where: { id: otherImage.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product image:", error);
    return NextResponse.json(
      { error: "Failed to delete product image" },
      { status: 500 }
    );
  }
}
