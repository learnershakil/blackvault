import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// GET handler to fetch a specific address
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Check if the address belongs to the user
    if (address.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    return NextResponse.json(
      { error: "Failed to fetch address" },
      { status: 500 }
    );
  }
}

// PATCH handler to update an address
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the address exists and belongs to the user
    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse and validate the request body
    const body = await request.json();

    const addressSchema = z.object({
      firstName: z.string().min(1, "First name is required").optional(),
      lastName: z.string().min(1, "Last name is required").optional(),
      address1: z.string().min(1, "Address is required").optional(),
      address2: z.string().optional(),
      city: z.string().min(1, "City is required").optional(),
      state: z.string().min(1, "State is required").optional(),
      postalCode: z.string().min(1, "Postal code is required").optional(),
      country: z.string().min(1, "Country is required").optional(),
      phone: z.string().optional(),
      type: z.enum(["SHIPPING", "BILLING", "BOTH"]).optional(),
      isDefault: z.boolean().optional(),
    });

    const validatedData = addressSchema.parse(body);

    // If this is set as default, unset other defaults of the same type
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          id: { not: id },
          OR: [
            { type: validatedData.type || existingAddress.type },
            { type: "BOTH" },
            validatedData.type === "BOTH" || existingAddress.type === "BOTH"
              ? { type: { in: ["SHIPPING", "BILLING"] } }
              : {},
          ],
        },
        data: { isDefault: false },
      });
    }

    // Update the address
    const address = await prisma.address.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(address);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove an address
export async function DELETE(
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

    // Delete the address
    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Address deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
