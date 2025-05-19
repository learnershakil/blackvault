import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schema for cart items array validation
const cartItemsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      productId: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().int().positive(),
      image: z.string().optional(),
      variantSku: z.string().optional(),
    })
  ),
});

// POST handler to sync client cart with server
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // For unauthenticated users, just return the cart as-is
    if (!session?.user) {
      // Extract and validate the incoming cart
      const body = await request.json();
      const { items } = cartItemsSchema.parse(body);
      return NextResponse.json({ items });
    }

    // For authenticated users, persist their cart
    const body = await request.json();
    const { items } = cartItemsSchema.parse(body);

    // Find or create the user's cart
    let cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // Delete existing items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Add new items from the client cart
    if (items.length > 0) {
      // Verify all products exist
      const productIds = [...new Set(items.map((item) => item.productId))];
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true },
      });

      const validProductIds = new Set(products.map((p) => p.id));
      const validItems = items.filter((item) =>
        validProductIds.has(item.productId)
      );

      // Create all cart items in a single transaction
      await prisma.$transaction(
        validItems.map((item) =>
          prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              quantity: item.quantity,
              variantSku: item.variantSku || null,
            },
          })
        )
      );
    }

    // Fetch the updated cart to return to the client
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
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

    // Format items for response
    const formattedItems =
      updatedCart?.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: parseFloat(item.product.price.toString()),
        quantity: item.quantity,
        image: item.product.images[0]?.url,
        variantSku: item.variantSku || undefined,
      })) || [];

    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error syncing cart:", error);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}
