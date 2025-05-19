import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// GET endpoint to fetch banners
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Check for admin role for full access, otherwise only return active banners
    const isAdmin = session?.user?.role === "ADMIN";

    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");
    const active = searchParams.get("active") === "true";

    // Build query filters
    let whereClause: any = {};

    // Filter by position if provided
    if (position) {
      whereClause.position = position;
    }

    // If not admin or active filter specified, only show active banners
    if (!isAdmin || active) {
      const now = new Date();
      whereClause.isActive = true;
      whereClause.startDate = { lte: now };
      whereClause.endDate = { gte: now };
    }

    const banners = await prisma.banner.findMany({
      where: whereClause,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new banner (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();

    const schema = z.object({
      title: z.string().min(1, "Title is required"),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().min(1, "Image URL is required"),
      imageAlt: z.string().optional(),
      linkUrl: z.string().optional(),
      linkText: z.string().optional(),
      position: z.enum([
        "HERO",
        "FEATURED",
        "SIDEBAR",
        "POPUP",
        "NOTIFICATION",
      ]),
      startDate: z.string().transform((str) => new Date(str)),
      endDate: z.string().transform((str) => new Date(str)),
      isActive: z.boolean().default(true),
      priority: z.number().int().default(0),
      bgColor: z.string().optional(),
      textColor: z.string().optional(),
    });

    const validatedData = schema.parse(body);

    // Create banner
    const banner = await prisma.banner.create({
      data: validatedData,
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
