import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

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

    // Get the product ID from params
    const { id: productId } = params;

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Process the uploaded file
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Get the alt text
    const altText = (formData.get("alt") as string) || null;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Create unique file name to prevent overwriting
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${uuidv4()}.${fileExtension}`;

    // Create path to public directory
    const publicDir = join(process.cwd(), "public");

    // Create uploads directory path
    const uploadDir = join(publicDir, "uploads", "products", productId);

    // Import mkdir here for better error handling
    const { mkdir } = require("fs/promises");

    try {
      // Always ensure the directory exists first
      await mkdir(uploadDir, { recursive: true });

      // Read the file as array buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Write the file to the server
      await writeFile(join(uploadDir, fileName), buffer);
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }

    // File URL for database and client
    const fileUrl = `/uploads/products/${productId}/${fileName}`;

    // Check if this is the first image (make it default)
    const imageCount = await prisma.productImage.count({
      where: { productId },
    });

    // Create image record in database
    const newImage = await prisma.productImage.create({
      data: {
        productId,
        url: fileUrl,
        alt: altText,
        isDefault: imageCount === 0, // Make default if it's the first image
      },
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("Error uploading product image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
