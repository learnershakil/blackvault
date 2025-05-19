import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// GET a specific banner
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const { id } = params;

    // Regular users can only view active banners
    let whereClause: any = { id };
    if (session?.user?.role !== "ADMIN") {
      const now = new Date();
      whereClause.isActive = true;
      whereClause.startDate = { lte: now };
      whereClause.endDate = { gte: now };
    }

    const banner = await prisma.banner.findFirst({
      where: whereClause,
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// PATCH to update a banner (admin only)
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

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    // Validate update data
    const schema = z.object({
      title: z.string().min(1).optional(),
      subtitle: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      imageUrl: z.string().min(1).optional(),
      imageAlt: z.string().optional().nullable(),
      linkUrl: z.string().optional().nullable(),
      linkText: z.string().optional().nullable(),
      position: z
        .enum(["HERO", "FEATURED", "SIDEBAR", "POPUP", "NOTIFICATION"])
        .optional(),
      startDate: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
      endDate: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
      isActive: z.boolean().optional(),
      priority: z.number().int().optional(),
      bgColor: z.string().optional().nullable(),
      textColor: z.string().optional().nullable(),
    });

    const validatedData = schema.parse(body);

    // Update banner
    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedBanner);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE a banner (admin only)
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

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    // Delete the banner
    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
