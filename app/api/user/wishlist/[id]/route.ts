import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// DELETE handler to remove item from wishlist
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get authenticated user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if item exists and belongs to the user
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id },
    });

    if (!wishlistItem) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 }
      );
    }

    if (wishlistItem.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the item
    await prisma.wishlistItem.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Item removed from wishlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove item from wishlist" },
      { status: 500 }
    );
  }
}
