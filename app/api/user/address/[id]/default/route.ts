import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// PATCH handler to set an address as default
export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the address exists and belongs to the user
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (address.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Unset default for other addresses of the same type
    await prisma.address.updateMany({
      where: {
        userId: session.user.id,
        id: { not: id },
        OR: [
          { type: address.type },
          { type: "BOTH" },
          address.type === "BOTH"
            ? { type: { in: ["SHIPPING", "BILLING"] } }
            : {},
        ],
      },
      data: { isDefault: false },
    });

    // Set this address as default
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error("Error setting default address:", error);
    return NextResponse.json(
      { error: "Failed to set default address" },
      { status: 500 }
    );
  }
}
