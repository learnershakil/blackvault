import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// GET handler to fetch a specific coupon
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const coupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    // Regular users can only view active coupons
    if (
      session.user.role !== "ADMIN" &&
      (!coupon.isActive ||
        coupon.startDate > new Date() ||
        coupon.endDate < new Date())
    ) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupon" },
      { status: 500 }
    );
  }
}

// PATCH handler to update a coupon (admin only)
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

    // Validate request body
    const schema = z.object({
      code: z.string().min(3).optional(),
      description: z.string().optional(),
      discountType: z
        .enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"])
        .optional(),
      discountValue: z.number().positive().optional(),
      minPurchase: z.number().min(0).optional().nullable(),
      maxUses: z.number().int().min(1).optional().nullable(),
      startDate: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
      endDate: z
        .string()
        .transform((str) => new Date(str))
        .optional(),
      isActive: z.boolean().optional(),
    });

    const validatedData = schema.parse(body);

    // Check if coupon exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    // If code is being changed, check if it's unique
    if (validatedData.code && validatedData.code !== existingCoupon.code) {
      const codeExists = await prisma.coupon.findUnique({
        where: { code: validatedData.code },
      });

      if (codeExists) {
        return NextResponse.json(
          { error: "Coupon code already in use" },
          { status: 400 }
        );
      }
    }

    // Update coupon
    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a coupon (admin only)
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if coupon exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    // Delete coupon
    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
