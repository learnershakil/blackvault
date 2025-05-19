import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

// POST endpoint to validate a coupon code
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      code: z.string().min(1, "Coupon code is required"),
      cartTotal: z.number().min(0, "Cart total must be a positive number"),
    });

    const { code, cartTotal } = schema.parse(body);

    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    // Check if coupon exists
    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: "Coupon code not found" },
        { status: 404 }
      );
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return NextResponse.json(
        { valid: false, message: "Coupon is inactive" },
        { status: 400 }
      );
    }

    // Check if coupon is within valid date range
    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return NextResponse.json(
        { valid: false, message: "Coupon is expired or not yet active" },
        { status: 400 }
      );
    }

    // Check if coupon has usage limits
    if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) {
      return NextResponse.json(
        { valid: false, message: "Coupon has reached its usage limit" },
        { status: 400 }
      );
    }

    // Check minimum purchase requirement
    if (coupon.minPurchase && cartTotal < coupon.minPurchase.toNumber()) {
      return NextResponse.json(
        {
          valid: false,
          message: `Minimum purchase of ${coupon.minPurchase.toNumber()} required`,
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    switch (coupon.discountType) {
      case "PERCENTAGE":
        discountAmount = cartTotal * (coupon.discountValue.toNumber() / 100);
        break;
      case "FIXED_AMOUNT":
        discountAmount = coupon.discountValue.toNumber();
        // Don't allow discount to exceed cart total
        if (discountAmount > cartTotal) {
          discountAmount = cartTotal;
        }
        break;
      case "FREE_SHIPPING":
        // The actual shipping calculation happens elsewhere
        discountAmount = 0;
        break;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        ...coupon,
        discountAmount,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
