import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// GET handler to retrieve user addresses
export async function GET() {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch addresses
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// POST handler to create a new address
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await request.json();

    const addressSchema = z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      address1: z.string().min(1, "Address is required"),
      address2: z.string().optional(),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      postalCode: z.string().min(1, "Postal code is required"),
      country: z.string().min(1, "Country is required"),
      phone: z.string().optional(),
      type: z.enum(["SHIPPING", "BILLING", "BOTH"]),
      isDefault: z.boolean().optional().default(false),
    });

    const validatedData = addressSchema.parse(body);

    // If this is set as default, unset other defaults of the same type
    if (validatedData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          OR: [
            { type: validatedData.type },
            { type: "BOTH" },
            validatedData.type === "BOTH"
              ? { type: { in: ["SHIPPING", "BILLING"] } }
              : {},
          ],
        },
        data: { isDefault: false },
      });
    }

    // Create the address
    const address = await prisma.address.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
