import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// GET endpoint to fetch all coupons (admin) or valid coupons (customers)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active") === "true";
    const code = searchParams.get("code");

    // Query parameters
    let query: any = {};

    // Filter conditions
    if (session.user.role !== "ADMIN") {
      // Regular users can only see active coupons
      query.isActive = true;
      query.startDate = { lte: new Date() };
      query.endDate = { gte: new Date() };
    } else if (active) {
      // Admin filtering active coupons
      query.isActive = true;
    }

    // Filter by code if provided
    if (code) {
      query.code = { contains: code, mode: "insensitive" };
    }

    const coupons = await prisma.coupon.findMany({
      where: query,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new coupon (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const schema = z.object({
      code: z.string().min(3, "Code must be at least 3 characters"),
      description: z.string().optional(),
      discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
      discountValue: z.number().positive("Discount value must be positive"),
      minPurchase: z.number().min(0).optional(),
      maxUses: z.number().int().min(1).optional(),
      startDate: z.string().transform((str) => new Date(str)),
      endDate: z.string().transform((str) => new Date(str)),
      isActive: z.boolean().default(true),
    });

    const validatedData = schema.parse(body);

    // Check if code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: validatedData.code },
    });

    if (existingCoupon) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 400 }
      );
    }

    // Create coupon
    const coupon = await prisma.coupon.create({
      data: validatedData,
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}
