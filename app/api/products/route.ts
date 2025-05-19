import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  parsePaginationParams,
  createPaginatedResponse,
  optimizedResponse,
} from "@/lib/api-utils";

// GET handler for listing products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const { page, limit } = parsePaginationParams(request);

    // Get field selectors
    const fields = searchParams.get("fields")?.split(",") || [];

    // Build query filters
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    // Build where condition
    const where: any = {
      isPublished: true,
    };

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build orderBy condition
    const orderBy: any = {};
    orderBy[sort] = order.toLowerCase();

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          where: {
            OR: [{ isDefault: true }, { id: { equals: undefined } }],
          },
          take: 1,
          orderBy: {
            isDefault: "desc",
          },
        },
      },
    });

    // Create paginated response
    const response = createPaginatedResponse(products, total, { page, limit });

    // Return optimized response with caching
    return optimizedResponse(response, "MEDIUM");
  } catch (error) {
    console.error("Error fetching products:", error);
    return optimizedResponse(
      { error: "Failed to fetch products" },
      "SHORT",
      500
    );
  }
}

// Product creation schema
const createProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  compareAtPrice: z.number().optional(),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  categoryId: z.string().min(1, "Category is required"),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

// POST handler for creating a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createProductSchema.parse(body);

    // Generate a slug from the product name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    // Check for duplicate slug
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 400 }
      );
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
