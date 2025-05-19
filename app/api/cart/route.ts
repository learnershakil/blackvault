import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schema for cart item validation
const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  variantSku: z.string().optional(),
});

// GET handler to retrieve user's cart
export async function GET() {
  try {
    const session = await auth();

    // Handle unauthenticated users
    if (!session?.user) {
      return NextResponse.json({ items: [] });
    }

    // Find or create user's cart
    let cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isDefault: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    // If no cart exists, return empty cart
    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    // Format cart items for the frontend
    const items = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: parseFloat(item.product.price.toString()),
      quantity: item.quantity,
      image: item.product.images[0]?.url,
      variantSku: item.variantSku || undefined,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return NextResponse.json(
      { error: "Failed to retrieve cart" },
      { status: 500 }
    );
  }
}

// POST handler to add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    // Validate request body
    const { productId, quantity, variantSku } = cartItemSchema.parse(body);

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If user is logged in, add to their persistent cart
    if (session?.user) {
      // Find or create user cart
      let cart = await prisma.cart.findFirst({
        where: { userId: session.user.id },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: session.user.id },
        });
      }

      // Check if item already exists in cart
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          variantSku: variantSku || null,
        },
      });

      if (existingItem) {
        // Update quantity if item exists
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        // Create new cart item
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            variantSku: variantSku || null,
          },
        });
      }

      // Return updated cart
      return GET();
    }

    // For non-logged-in users, just return success
    // Their cart is managed client-side with Zustand
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
