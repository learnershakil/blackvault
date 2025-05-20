import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { generateOrderNumber } from "@/lib/order-utils";

// POST handler for creating a new order
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      shippingAddressId: z.string().min(1, "Shipping address is required"),
      billingAddressId: z.string().min(1, "Billing address is required"),
      paymentMethod: z.enum(["card", "razorpay", "cod"]),
      items: z.array(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().int().positive(),
          variantSku: z.string().optional(),
        })
      ),
      couponCode: z.string().optional(),
      notes: z.string().optional(),
    });

    const validatedData = schema.parse(body);

    // Verify addresses belong to the user
    const [shippingAddress, billingAddress] = await Promise.all([
      prisma.address.findFirst({
        where: {
          id: validatedData.shippingAddressId,
          userId: session.user.id,
        },
      }),
      prisma.address.findFirst({
        where: {
          id: validatedData.billingAddressId,
          userId: session.user.id,
        },
      }),
    ]);

    if (!shippingAddress || !billingAddress) {
      return NextResponse.json(
        { error: "Invalid address provided" },
        { status: 400 }
      );
    }

    // Get user's cart or use items from request
    let orderItems = [];
    let subtotal = 0;

    // Fetch products to calculate final prices
    const productIds = validatedData.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Create order items and calculate totals
    for (const item of validatedData.items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        continue; // Skip if product not found
      }

      // Use product price for the item
      const price = product.price.toNumber();
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        variantSku: item.variantSku,
      });
    }

    // Apply tax and shipping calculations
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100

    // Apply coupon discount if provided
    let discount = 0;
    if (validatedData.couponCode) {
      // Check if coupon exists and is valid
      const coupon = await prisma.coupon.findUnique({
        where: {
          code: validatedData.couponCode,
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });

      if (coupon) {
        if (coupon.discountType === "PERCENTAGE") {
          discount = subtotal * (coupon.discountValue.toNumber() / 100);
        } else if (coupon.discountType === "FIXED_AMOUNT") {
          discount = coupon.discountValue.toNumber();
        } else if (coupon.discountType === "FREE_SHIPPING") {
          discount = shipping;
          shipping = 0;
        }

        // Update coupon uses count
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usesCount: { increment: 1 } },
        });
      }
    }

    // Calculate total
    const total = subtotal + tax + shipping - discount;

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        status: "PENDING",
        subTotal: subtotal,
        tax,
        shipping,
        total,
        discount,
        shippingAddressId: shippingAddress.id,
        billingAddressId: billingAddress.id,
        couponCode: validatedData.couponCode,
        notes: validatedData.notes,
        items: {
          create: orderItems,
        },
        // Create a payment record associated with this order
        Payment: {
          create: {
            amount: total,
            paymentMethod: validatedData.paymentMethod,
            status: "PENDING",
          },
        },
      },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        Payment: true,
      },
    });

    // Clear the user's cart after successful order creation
    const userCart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
    });

    if (userCart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET handler to fetch user's orders (with pagination)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  slug: true,
                  images: {
                    where: { isDefault: true },
                    take: 1,
                    select: {
                      url: true,
                      alt: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.order.count({
        where: { userId: session.user.id },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        total,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
