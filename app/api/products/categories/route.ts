import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET handler for listing all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topLevel = searchParams.get("topLevel") === "true";
    const limit = parseInt(searchParams.get("limit") || "0");

    // Build query based on parameters
    const query: any = {};

    if (topLevel) {
      query.parentId = null; // Only top-level categories
    }

    // Include product count for each category
    const categories = await prisma.category.findMany({
      where: query,
      include: {
        products: {
          select: {
            id: true,
          },
        },
        children: {
          include: {
            products: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      ...(limit > 0 ? { take: limit } : {}),
    });

    // Transform data to include product counts and format the response
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      parentId: category.parentId,
      image: category.image,
      _count: {
        products: category.products.length,
      },
      children: category.children.map((child) => ({
        id: child.id,
        name: child.name,
        description: child.description,
        slug: child.slug,
        parentId: child.parentId,
        image: child.image,
        _count: {
          products: child.products.length,
        },
      })),
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// Schema for creating a category
import { z } from "zod";
import { auth } from "@/auth";

const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  image: z.string().url("Image must be a valid URL").optional(),
});

// POST handler for creating a new category
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated and is an admin
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validatedData = createCategorySchema.parse(body);

    // Generate a slug from the category name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    // Check for duplicate slug
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      );
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        ...validatedData,
        slug,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
